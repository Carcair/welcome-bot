/**
 * Loading dependencies
 */
const express = require('express');
const logger = require('../config/logger');

/**
 * Load Schedules models
 */
const Schedules = require('../models/Schedules');

/**
 * Load Messages Schema
 */
const schedule_schema = require('../models/joiSchema/SchedulesSchema');

/**
 * Router middleware
 */
const router = express.Router();

/**
 * Get all schedules
 */
router.get('/', (req, res) => {
  Schedules.findAll()
    .then((results) => {
      res.status(200);
      res.end(JSON.stringify(results));
    })
    .catch((err) => {
      logger.logError(err);
      res.status(406).end(err.parent.sqlMessage);
    });
});

/**
 * Get one schedule by message title
 */
router.get('/:message', (req, res) => {
  Schedules.findOne({ where: { message: req.params.message } })
    .then((result) => {
      res.status(200);
      res.end(JSON.stringify(result));
    })
    .catch((err) => {
      logger.logSQLError(err);
      res.status(406).end(err.parent.sqlMessage);
    });
});

/**
 * Insert schedules
 */
router.post('/', (req, res) => {
  const temp_obj = {
    message: req.body.message,
    run_date: req.body.run_date,
    active: req.body.active,
    repeat_range: req.body.repeat_range,
  };
  const { error, value } = schedule_schema.validate(temp_obj); //joi validation of data sent from frontend

  if (error) {
    res.status(422).end(error.details[0].message);
  } else if (value) {
    Schedules.create(temp_obj)
      .then(() => {
        logger.logInput(JSON.stringify(temp_obj), 'schedule');
        res.status(201).send();
      })
      .catch(() => {
        logger.logSQLError(err);
        res.status(406).end(err.parent.sqlMessage);
      });
  }
});

/**
 * Delete a schedule found by message title
 */
router.delete('/:message', (req, res) => {
  Schedules.destroy({ where: { message: req.params.message } })
    .then((result) => {
      if (result !== 0) {
        //checking if the "result" is diffrent then 0 and responding accordingly
        logger.logDelete(req.params.message, 'schedule');
        res.status(202).send();
      } else {
        res.status(406).end();
      }
    })
    .catch((err) => {
      logger.logSQLError(err);
      res.status(406).end(err.parent.sqlMessage);
    });
});

/**
 * Edit schedule found by message title
 */
router.post('/:message', (req, res) => {
  const temp_obj = {
    message: req.body.message,
    run_date: req.body.run_date,
    active: req.body.active,
    repeat_range: req.body.repeat_range,
  };
  const { error, value } = schedule_schema.validate(temp_obj);
  if (error) {
    res.status(422).end(error.details[0].message);
  } else if (value) {
    Schedules.update(temp_obj, { where: { message: req.params.message } })
      .then((result) => {
        if (result[0] !== 0) {
          //checking if the "result" is diffrent then 0 and responding accordingly
          logger.logUpdate(
            JSON.stringify(temp_obj),
            req.params.message,
            'schedule'
          );
          res.status(201).end();
        } else {
          res.status(406).end();
        } //incorect message
      })
      .catch((err) => {
        logger.logSQLError(err);
        res.status(406).end(err.parent.sqlMessage);
      });
  }
});

module.exports = router;
