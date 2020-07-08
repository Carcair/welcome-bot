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
      res.status(200).end(JSON.stringify(result));
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
   .then((_=>{ res.status(201).end(); }))
   .catch(_=> { res.status(406).end(); });
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
});

module.exports = router;