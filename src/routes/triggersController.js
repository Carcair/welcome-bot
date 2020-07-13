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
 * Load Messages Schema 
 */
const trigger_schema = require('../models/joiSchema/TriggersSchema');


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
 * Get messages by trigger_word
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
  const { error, value } = trigger_schema.validate(temp_obj);
  if (error) {
      res.status(422).end(error.details[0].message);
    } else if (value) {
      Triggers.create(temp_obj)
        .then(() => {
          logger.logInput(JSON.stringify(temp_obj), 'trigger');
          res.status(201).end();
        })
        .catch((err) => {
          logger.logSQLError(err);
          res.status(406).end(err.parent.sqlMessage);
        });
    }


});

/**
 * Delete one post by trigger name
 */
router.delete('/:trigger_word', (req, res) => {
  Triggers.destroy({ where: { trigger_word: req.params.trigger_word } })
    .then((result) => {
      if(result[0] !== 0){   //checking if the "result" is diffrent then 0 and responding accordingly
      logger.logDelete(req.params.trigger_word, 'trigger');
      res.status(202).send();
      }
      else{  res.status(406).end();  }
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
  const { error, value } = trigger_schema.validate(temp_obj);
  if (error) {
      res.status(422).end(error.details[0].message);
    } else if (value) {
      Triggers.update(temp_obj, {
            where: { trigger_word: req.params.trigger_word },
      })
        .then((result) => {
          if(result[0] !== 0){ //checking if the "result" is diffrent then 0 and responding accordingly
          logger.logUpdate(
            JSON.stringify(temp_obj),
            req.params.trigger_word,
            'trigger'
          );
          res.status(201).end();
        }else{  res.status(406).end();   }
        })
        .catch((err) => {
          logger.logSQLError(err);
          res.status(406).end(err.parent.sqlMessage);
        });
    }
});

module.exports = router;
