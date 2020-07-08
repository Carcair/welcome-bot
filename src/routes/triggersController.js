/**
 * Loading dependencies
 */
const express = require('express');

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
    .catch((err) => res.status(406).end(err));
});

/**
 * Get messages by trigger name
 */
router.get('/:trigger_word', (req, res) => {
  Triggers.findOne({ where: { trigger_word: req.params.trigger_word } })
    .then((result) => {
      /*
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
*/
      res.status(200).end(JSON.stringify(result));
   //   res.end(temp);  
    })
    .catch((err) => {
      console.log(err);
    });
});

/**
 * Insert trigger
 */
router.post('/', (req, res) => {
  Triggers.create({
    message: req.body.message,
    trigger_word: req.body.trigger_word,
    channel: req.body.channel,
    active: req.body.active
   })
   .then((_=>{ res.status(201).send(); }))
   .catch(_=> { res.status(406).send(); });
/*
  // Checking input
  if (trigger.checkInsert()) {
    // Encode input before sending
    queries.insertOne(trigger.encodeInsert());
    res.status(201).send();
  } else {
    res.status(406).send();
  }*/
});

/**
 * Delete one post by trigger name
 */
router.delete('/:trigger_word', (req, res) => {
 Triggers.destroy({ where: { trigger_word: req.params.trigger_word } })
  .then(() => {
    res.status(202).send();
  })
  .catch((err) => {
    throw err;
  });
});

/**
 * Edit one post by trigger name
 */
router.post('/:trigger_word', (req, res) => {
  Triggers.update(
    {
      message: req.body.message,
    trigger_word: req.body.trigger_word,
    channel: req.body.channel,
    active: req.body.active
    },
    { where: { trigger_word: req.params.trigger_word} }
  )
    .then(() => res.status(201).end())
    .catch((err) => res.status(406).end(err));
/*
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
  */
});

module.exports = router;