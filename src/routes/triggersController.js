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
 * Load Triggers Schema 
 */
const TriggerSchema = require('../models/joiSchema/TriggersSchema');

/**
 * Load helpers
 */
const { encodeInsert , decodeOutput } = require('../methods/helper');

/**
 * Router middleware
 */
const router = express.Router();


/**
 * Get all triggers
 */
router.get('/', (req, res) => {
  Triggers.findAll({
    raw: true
  })
    .then((posts) => {
      let decoded = decodeOutput(posts);
      res.status(200).end(JSON.stringify(decoded));
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
  let triggerWordToGet = encodeURIComponent(req.params.trigger_word); 
  Triggers.findOne({ where: { trigger_word: triggerWordToGet }, raw: true })
    .then((result) => {
      if(result !==null){
      let decoded = decodeOutput(result)  
      res.status(200).end(JSON.stringify(decoded));
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
 * Insert trigger
 */
router.post('/', (req, res) => {
  const temp_obj = {
    message: req.body.message,
    trigger_word: req.body.trigger_word,
    channel: req.body.channel,
    active: req.body.active,
  };
  const { error, value } = TriggerSchema.validate(temp_obj);
  if (error) {
      res.status(422).end(error.details[0].message);
    } else if (value) {
      let encoded = encodeInsert(temp_obj);
      Triggers.create(encoded)
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
  let triggerWordToDelete = encodeURIComponent(req.params.trigger_word); 
  Triggers.destroy({ where: { trigger_word: req.params.trigger_word } })
    .then((result) => {
      if(result !== 0){   //checking if the "result" is diffrent then 0 and responding accordingly
      logger.logDelete(req.params.trigger_word, 'trigger');
      res.status(202).send();
      }else{ 
         res.status(406).end();  }
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
  let triggerWordToEdit = req.params.trigger_word ;
  const temp_obj = {
    message: req.body.message,
    trigger_word: req.body.trigger_word,
    channel: req.body.channel,
    active: req.body.active,
  };
  const { error, value } = TriggerSchema.validate(temp_obj);
  if (error) {
      res.status(422).end(error.details[0].message);
    } else if (value) {
      let encoded = encodeInsert(temp_obj);
      Triggers.update(encoded, {
            where: { trigger_word: triggerWordToEdit},
      })
        .then((result) => {
          console.log(result[0])
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
