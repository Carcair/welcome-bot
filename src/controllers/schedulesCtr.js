/**
 * Loading logger configuration
 */
const logger = require('../config/logger');

/**
 * Load schedule model and validation schema
 */
const Schedules = require('../models/Schedules');
const ScheduleSchema = require('../models/validation/SchedulesSchema');

/**
 * Load helpers
 */
const { encodeInsert, decodeOutput } = require('../methods/helper');

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
      res.status(406).end(err.parent.sqlMessage);
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
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      logger.logSQLError(err);
      res.status(406).end(err.parent.sqlMessage);
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
    // Loger output
    res.status(406).end(error.details[0].message);
  } else if (value) {
    // Encode input
    temp_obj = encodeInsert(temp_obj);
    Schedules.create(temp_obj)
      .then(() => {
        logger.logInput(JSON.stringify(temp_obj), 'schedule');
        res.sendStatus(201);
      })
      .catch((err) => {
        logger.logSQLError(err);
        res.status(406).end(err.parent.sqlMessage);
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
        logger.logDelete(req.params.message, 'schedule');
        res.sendStatus(202);
      } else {
        res.sendStatus(406);
      }
    })
    .catch((err) => {
      logger.logSQLError(err);
      res.status(406).end(err.parent.sqlMessage);
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
    // Loger output
    res.status(406).end(error.details[0].message);
  } else if (value) {
    Schedules.update(encodeInsert(temp_obj), {
      where: { message },
    })
      .then((updated) => {
        if (updated[0] !== 0) {
          //checking if the "result" is diffrent then 0 and responding accordingly

          logger.logUpdate(
            JSON.stringify(temp_obj),
            req.params.message,
            'schedule'
          );
          res.status(201).end();
        } else {
          res.status(304).end();
        }
      })
      .catch((err) => {
        logger.logSQLError(err);
        res.status(406).end(err.parent.sqlMessage);
      });
  }
};
