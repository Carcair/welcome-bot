/**
 * Loading dependencies
 */
const express = require('express');
const logger = require('../config/logger');

/**
 * Load Messages models
 */
const Messages = require('../models/Messages');

/**
 * Load Messages Schema
 */
const message_schema = require('../models/joiSchema/MesagesSchema');

/**
 * Using router middleware
 */
const router = express.Router();

/**
 * Get all messages
 */
router.get('/', (req, res) => {
  Messages.findAll()
    .then((messages) => {
      res.status(200).end(JSON.stringify(messages));
    })
    .catch((err) => {
      logger.logSQLError(err);
      res.status(406).end(err.parent.sqlMessage);
    });
});

/**
 * Get one message by title
 */
router.get('/:title', (req, res) => {
  Messages.findOne({
    where: {
      title: req.params.title,
      // keks: 'dzeks' // For testing errors
    },
  })
    .then((post) => {
      res.status(200).end(JSON.stringify(post));
    })
    .catch((err) => {
      logger.logSQLError(err);
      res.status(406).end(err.parent.sqlMessage);
    });
});

/**
 * Insert new message
 */
router.post('/', (req, res) => {
  const temp_obj = {
    title: req.body.title,
    text: req.body.text,
    cr_date: req.body.cr_date,
  };
  const { error, value } = message_schema.validate(temp_obj); //joi validation of data sent from frontend
  if (error) {
    res.status(422).end(error.details[0].message); //if err throw validation error
  } else if (value) {
    Messages.create(temp_obj)
      .then(() => {
        logger.logInput(JSON.stringify(temp_obj), 'message');
        res.status(201).end();
      })
      .catch((err) => {
        logger.logSQLError(err);
        res.status(406).end(err.parent.sqlMessage);
      });
  }
});

/**
 * Delete a message
 */
router.delete('/:title', (req, res) => {
  Messages.destroy({
    where: { title: req.params.title },
  })
    .then((result) => {
      if (result !== 0) {
        //checking if the "result" is diffrent then 0 and responding accordingly
        logger.logDelete(req.params.title, 'message');
        res.status(202).end();
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
 * Edit a message
 */
router.post('/:title', (req, res) => {
  const temp_obj = {
    title: req.body.title,
    text: req.body.text,
  };
  const { error, value } = message_schema.validate(temp_obj); //joi validation of data sent from frontend
  if (error) {
    res.status(422).end(error.details[0].message); //if err throw validation error
  } else if (value) {
    Messages.update(temp_obj, { where: { title: req.params.title } })
      .then((result) => {
        if (result[0] !== 0) {
          //checking if the "result" is diffrent then 0 and responding accordingly
          logger.logUpdate(
            JSON.stringify(temp_obj),
            req.params.title,
            'message'
          );
          res.status(201).end();
        } else {
          res.status(406).end();
        }
      })
      .catch((err) => {
        logger.logSQLError(err);
        res.status(406).end(err.parent.sqlMessage);
      });
  }
});

module.exports = router;
