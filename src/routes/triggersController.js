/**
 * Loading dependencies
 */
const express = require('express');

/**
 * Load models
 */
const Triggers = require('../models/Triggers');

/// Load Sequelize model
const db = require('../methods/dbConnect');
const Trg = db.trg;

/**
 * Router middleware
 */
const router = express.Router();

/**
 * Get trigger
 */
router.get('/', (req, res) => {
  const result = queries
    .selectAll()
    .then((result) => {
      res.end(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

/**
 * Get messages by trigger name
 */
router.get('/:trigger_word', (req, res) => {
  const result = queries
    .selectOne('trigger_word', req.params.trigger_word)
    .then((result) => {
      // Decode query return
      let temp = JSON.parse(result);
      let trigger = new Triggers(
        temp[0].message,
        temp[0].trigger_word,
        temp[0].channel,
        temp[0].active
      );
      temp[0] = trigger.decodeOutput();
      temp = JSON.stringify(temp);

      res.status(200);
      res.end(temp);
    })
    .catch((err) => {
      console.log(err);
    });
});

/**
 * Insert trigger
 */
router.post('/', (req, res) => {
  const trigger = new Triggers(
    req.body.message,
    req.body.trigger_word,
    req.body.channel,
    req.body.active
  );

  // Checking input
  if (trigger.checkInsert()) {
    // Encode input before sending
    queries.insertOne(trigger.encodeInsert());
    res.status(201).send();
  } else {
    res.status(406).send();
  }
});

/**
 * Delete one post by trigger name
 */
router.delete('/:trigger_word', (req, res) => {
  queries.deleteOne('trigger_word', req.params.trigger_word);
  res.status(202).send();
});

/**
 * Edit one post by trigger name
 */
router.post('/:trigger_word', (req, res) => {
  const trigger = new Triggers(
    req.body.message,
    req.body.trigger_word,
    req.body.channel,
    req.body.active
  );
  if (trigger.checkInsert()) {
    queries.editOne(
      'trigger_word',
      req.params.trigger_word,
      trigger.encodeInsert()
    );
    res.status(202).send();
  } else {
    res.status(406).send();
  }
});

module.exports = router;
