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
 * Load Schedule Schema
 */
const schedule_schema = require('../models/joiSchema/SchedulesSchema');

/**
 * Load helpers
 */
const { encodeInsert , decodeOutput } = require('../methods/helper');

/**
 * Router middleware
 */
const router = express.Router();

/**
 * Get all schedules
 */
router.get('/', (req, res) => {
  Schedules.findAll({
    raw : true
  })
    .then((results) => {
      results = decodeOutput(results); //decoding
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
  let messageToGet = encodeURIComponent(req.params.message); //encode
  Schedules.findOne({ where: { message: messageToGet } , raw : true})
    .then((result) => {
      if(result !== null){ //if "message" cant be found
      result = decodeOutput(result); //decoding
      res.status(200);
      res.end(JSON.stringify(result));
      }else{
        res.end('[]');
      }
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
  let temp_obj = {
    message: req.body.message,
    run_date: req.body.run_date,
    active: req.body.active,
    repeat_range: req.body.repeat_range,
  };
  const { error, value } = schedule_schema.validate(temp_obj); //joi validation of data sent from frontend

  if (error) {
    res.status(422).end(error.details[0].message);
  } else if (value) {
    temp_obj = encodeInsert(temp_obj); //encode
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
  let messageToDelete = encodeURIComponent(req.params.message); //encode
  Schedules.destroy({ where: { message: messageToDelete } })  //.destroy will delete all the schedules with same message title
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
  let messageToEdit = encodeURIComponent(req.params.message); //encode
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

    Schedules.update(encodeInsert(temp_obj), { where: { message: messageToEdit } })
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
