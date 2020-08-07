/**
 * Loading logger configuration
 */
const logger = require('../config/logger');

/**
 * Load trigger model and validation schema
 */
const Triggers = require('../models/Triggers');
const TriggerSchema = require('../models/validation/TriggersSchema');

/**
 * Load helpers
 */
const {
  encodeInsert,
  decodeOutput,
  setValueDeleted,
} = require('../methods/helper');
const { setReportCount } = require('../handlers/reportHandler');

/**
 * Get triggers
 */
exports.getTriggers = (req, res) => {
  Triggers.findAll({ raw: true })
    .then((triggers) => {
      triggers = decodeOutput(triggers);
      res.status(200).end(JSON.stringify(triggers));
    })
    .catch((err) => {
      logger.logSQLError(err);
      res.status(400).end('SQL Error');
    });
};

/**
 * Get one trigger by trigger word
 */
exports.getOneTrigger = (req, res) => {
  let trigger_word = encodeURIComponent(req.params.trigger_word);
  Triggers.findOne({
    where: { trigger_word },
    raw: true,
  })
    .then((trigger) => {
      // Check if there is existing trigger_word

      if (trigger !== null) {
        trigger = decodeOutput(trigger);
        res.status(200).end(JSON.stringify(trigger));
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
 * Insert new trigger
 */
exports.insertNewTrigger = (req, res) => {
  let temp_obj = {
    message: req.body.message,
    trigger_word: req.body.trigger_word,
    channel: req.body.channel,
    active: req.body.active,
  };

  // Validate input through JOI schema
  const { error, value } = TriggerSchema.validate(temp_obj);

  if (error) {
    res.status(417).end('Validation Error');
  } else if (value) {
    // Encode input before sending
    temp_obj = encodeInsert(temp_obj);

    Triggers.create(temp_obj)
      .then(() => {
        setReportCount('Triggers count', 'triggers');
        logger.logInput(JSON.stringify(temp_obj), 'trigger');
        res.status(201).end('Created');
      })
      .catch((err) => {
        logger.logSQLError(err);
        res.status(400).end('SQL Error');
      });
  }
};

/**
 * Delete one trigger
 */
exports.deleteTrigger = (req, res) => {
  // Encode before comparing
  let trigger_word = encodeURIComponent(req.params.trigger_word);

  Triggers.destroy({ where: { trigger_word } })
    .then((deleted) => {
      if (deleted !== 0) {
        //checking if the "result" is diffrent then 0 and responding accordingly
        setReportCount('Triggers count', 'triggers');
        setValueDeleted('Triggers deleted');
        logger.logDelete(req.params.trigger_word, 'trigger');
        res.status(200).end('Deleted');
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
 * Edit one trigger
 */

exports.editTrigger = (req, res) => {
  // Encode before comparing
  let trigger_word = encodeURIComponent(req.params.trigger_word);

  const temp_obj = {
    message: req.body.message,
    trigger_word: req.body.trigger_word,
    channel: req.body.channel,
    active: req.body.active,
  };

  // Validate input through JOI schema
  const { error, value } = TriggerSchema.validate(temp_obj);

  if (error) {
    res.status(417).end('Validation Error');
  } else if (value) {
    Triggers.update(encodeInsert(temp_obj), { where: { trigger_word } })
      .then((updated) => {
        if (updated[0] !== 0) {
          //checking if the "result" is diffrent then 0 and responding accordingly
          logger.logUpdate(
            JSON.stringify(temp_obj),
            req.params.trigger_word,
            'trigger'
          );
          res.status(201).end('Edited');
        } else {
          res.status(404).end('Not Found');
        }
      })
      .catch((err) => {
        logger.logSQLError(err);
        res.status(400).end('SQL Error');
      });
  }
};
