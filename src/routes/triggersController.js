/**
 * Loading dependencies
 */
const express = require('express');
const logger = require('../config/logger');

/**
 * Load models
 */
const Triggers = require('../models/Triggers');

/**
 * Router middleware
 */
const router = express.Router();

/**
 * Get all triggers
 */
router.get('/', (req, res) => {
  Triggers.findAll()
    .then((posts) => {
      res.status(200).end(JSON.stringify(posts));
    })
    .catch((err) => {
      logger.logSQLError(err);
      res.status(406).end(err.parent.sqlMessage);
    });
});

/**
 * Get messages by trigger name
 */
router.get('/:trigger_word', (req, res) => {
  Triggers.findOne({ where: { trigger_word: req.params.trigger_word } })
    .then((result) => {
      res.status(200).end(JSON.stringify(result));
    })
    .catch((err) => {
      logger.logSQLError(err);
      res.status(406).end(err.parent.sqlMessage);
    });
});

/**
 * Insert trigger
 */
router.post('/', (req, res) => {
  const temp_obj = {
    message: req.body.message,
    trigger_word: req.body.trigger_word,
    channel: req.body.channel,
    active: req.body.active,
  };
  Triggers.create(temp_obj)
    .then(() => {
      logger.logInput(JSON.stringify(temp_obj), 'trigger');
      res.status(201).end();
    })
    .catch((err) => {
      logger.logSQLError(err);
      res.status(406).end(err.parent.sqlMessage);
    });
});

/**
 * Delete one post by trigger name
 */
router.delete('/:trigger_word', (req, res) => {
  Triggers.destroy({ where: { trigger_word: req.params.trigger_word } })
    .then(() => {
      logger.logDelete(req.params.trigger_word, 'trigger');
      res.status(202).send();
    })
    .catch((err) => {
      logger.logSQLError(err);
      res.status(406).end(err.parent.sqlMessage);
    });
});

/**
 * Edit one post by trigger name
 */
router.post('/:trigger_word', (req, res) => {
  const temp_obj = {
    message: req.body.message,
    trigger_word: req.body.trigger_word,
    channel: req.body.channel,
    active: req.body.active,
  };
  Triggers.update(temp_obj, {
    where: { trigger_word: req.params.trigger_word },
  })
    .then(() => {
      logger.logUpdate(
        JSON.stringify(temp_obj),
        req.params.trigger_word,
        'trigger'
      );
      res.status(201).end();
    })
    .catch((err) => {
      logger.logSQLError(err);
      res.status(406).end(err.parent.sqlMessage);
    });
});

module.exports = router;
