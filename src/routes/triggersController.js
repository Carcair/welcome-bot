/**
 * Loading dependencies
 */
const express = require('express');

// Load Query model
const Queries = require('../models/Queries');
let queries = new Queries('triggers');

/**
 * Router middleware
 */
const router = express.Router();

/**
 * Get trigger
 */
router.get('/', (req, res) => {
  const result = queries.selectAll()
    .then(result => {
      res.end(result);
    })
    .catch(err => {
      console.log(err);
    });
});

/**
 * Get messages by trigger name
 */
router.get('/:trigger_word', (req, res) => {
  const result = queries.selectOne('trigger_word', req.params.trigger_word)
    .then(result => {
      res.end(result);
    })
    .catch(err => {
      console.log(err);
    });
});

/**
 * Insert trigger
 */
router.post('/', (req, res) => {
  const trigger = {
    message: req.body.message,
    trigger_word: req.body.trigger_word,
    channel: req.body.channel,
    active: req.body.active
  };
  queries.insertOne(trigger);
  res.status(201).send();
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
  let obj = {
    message: req.body.message,
    trigger_word: req.body.trigger_word,
    channel: req.body.channel,
    active: req.body.active
  };
  queries.editOne('trigger_word', req.params.trigger_word, obj);
  res.status(202).send();
});

module.exports = router;