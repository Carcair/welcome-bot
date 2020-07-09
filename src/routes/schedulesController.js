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
    repeat_range: req.body.repeat_range,
  };
  Schedules.create(temp_obj)
    .then(() => {
      logger.logInput(JSON.stringify(temp_obj), 'schedule');
      res.status(201).send();
    })
    .catch(() => {
      logger.logSQLError(err);
      res.status(406).end(err.parent.sqlMessage);
    });
});

/**
 * Delete a schedule found by message title
 */
router.delete('/:message', (req, res) => {
  Schedules.destroy({ where: { message: req.params.message } })
    .then(() => {
      logger.logDelete(req.params.message, 'schedule');
      res.status(202).send();
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
    repeat_range: req.body.repeat_range,
  };
  Schedules.update(temp_obj, { where: { message: req.params.message } })
    .then(() => {
      logger.logUpdate(
        JSON.stringify(temp_obj),
        req.params.message,
        'schedule'
      );
      res.status(201).end();
    })
    .catch((err) => {
      logger.logSQLError(err);
      res.status(406).end(err.parent.sqlMessage);
    });
});

module.exports = router;
