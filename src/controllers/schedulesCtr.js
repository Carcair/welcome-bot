/**
 * Loading logger configuration
 */
const logger = require('../config/logger');

/**
 * Load schedule model and validation schema
 */
const Schedules = require('../models/schemas/Schedules');
const ScheduleSchema = require('../models/validation/SchedulesSchema');

/**
 * Load helpers and callbacks
 */
const {
  encodeInsert,
  decodeOutput,
  setValueDeleted,
} = require('../methods/helper');
const cronTasks = require('../methods/cronTasks');
const { setReportCount } = require('../handlers/reportHandler');
/**
 * Get schedules
 */
exports.getSchedules = (req, res) => {
  Schedules.findAll({ raw: true })
    .then((schedules) => {
      // Decode output before sending
      schedules = decodeOutput(schedules);
      res.status(200).end(JSON.stringify(schedules));
    })
    .catch((err) => {
      logger.logError(err);
      res.status(400).end('SQL Error');
    });
};

/**
 * Get one schedule by
 */
exports.getSchedulesByMessage = (req, res) => {
  // Encode message title first
  const message = encodeURIComponent(req.params.message);

  Schedules.findAll({ where: { message }, raw: true })
    .then((schedules) => {
      // If there are not query results
      if (schedules !== '[]') {
        // Decode output before sending
        schedules = decodeOutput(schedules);
        res.status(200).end(JSON.stringify(schedules));
      } else {
        res.status(404).end('Not Found');
      }
    })
    .catch((err) => {
      logger.logSQLError(err);
      res.status(400).end('SQL Error');
    });
};

/**
 * Insert new schedule
 */
exports.insertNewSchedule = (req, res) => {
  let temp_obj = {
    message: req.body.message,
    run_date: req.body.run_date,
    active: req.body.active,
    repeat_range: req.body.repeat_range,
  };

  // Validate input through JOI schema
  const { error, value } = ScheduleSchema.validate(temp_obj);

  if (error) {
    res.status(417).end('Validation Error');
  } else if (value) {
    // Encode input
    temp_obj = encodeInsert(temp_obj);
    Schedules.create(temp_obj)
      .then(() => {
        cronTasks.stopTasks();
        cronTasks.setTasks();
        setReportCount('Schedules count', 'schedules');
        logger.logInput(JSON.stringify(temp_obj), 'schedule');
        res.status(201).end('Created');
      })
      .catch((err) => {
        console.log(err);
        logger.logBotError(err);
        res.status(400).end('SQL Error');
      });
  }
};

/**
 * Delete schedule
 */
exports.deleteSchedule = (req, res) => {
  // Encode before comparing
  let message = encodeURIComponent(req.params.message);

  Schedules.destroy({ where: { message } })
    .then((deleted) => {
      if (deleted !== 0) {
        //checking if the "result" is diffrent then 0 and responding accordingly
        cronTasks.stopTasks();
        cronTasks.setTasks();
        setReportCount('Schedules count', 'schedules');
        setValueDeleted('Schedules deleted');
        logger.logDelete(req.params.message, 'schedule');
        res.status(200).end('Deleted');
      } else {
        res.status(404).end('Not Found');
      }
    })
    .catch((err) => {
      console.log(err);
      logger.logBotError(err);
      res.status(400).end('SQL Error');
    });
};

/**
 * Edit schedule
 */
exports.editSchedule = (req, res) => {
  // Encode message title before comparing
  let message = encodeURIComponent(req.params.message);

  const temp_obj = {
    message: req.body.message,
    run_date: req.body.run_date,
    active: req.body.active,
    repeat_range: req.body.repeat_range,
  };

  // Validate input through JOI validation
  const { error, value } = ScheduleSchema.validate(temp_obj);

  if (error) {
    res.status(417).end('Validation Error');
  } else if (value) {
    Schedules.update(encodeInsert(temp_obj), {
      where: { message },
    })
      .then((updated) => {
        if (updated[0] !== 0) {
          //checking if the "result" is diffrent then 0 and responding accordingly
          cronTasks.stopTasks();
          cronTasks.setTasks();
          logger.logUpdate(
            JSON.stringify(temp_obj),
            req.params.message,
            'schedule'
          );
          res.status(201).end('Edited');
        } else {
          res.status(404).end('Not Found');
        }
      })
      .catch((err) => {
        console.log(err);
        logger.logBotError(err);
        res.status(400).end('SQL Error');
      });
  }
};
