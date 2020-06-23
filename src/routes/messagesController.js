/**
 * Loading dependencies
 */
const express = require('express');

/**
 * Load models
 */
const Message = require('../models/Messages');

// Load Query model
const Queries = require('../models/Queries');
let queries = new Queries('messages');

/**
 * Using router middleware
 */
const router = express.Router();

/**
 * Get all messages
 */
router.get('/', (req, res) => {
  queries.selectAll()
    .then(result => {
      res.status(200);
      res.end(result);
    })
    .catch(err => {
      console.log(err);
    });
});

/**
 * Get one message by title
 */
router.get('/:title', (req, res) => {
  queries.selectOne('title', req.params.title)
    .then(result => {
      res.status(200);
      res.end(result);
    })
    .catch(err => {
      console.log(err);
    });
});

/**
 * Insert new message
 */
router.post('/', (req, res) => {
  const message = new Message(req.body.title, req.body.text, req.body.cr_date);
  queries.insertOne(message);
  res.status(201).send();
});

/**
 * Delete a message
 */
router.delete('/:title', (req, res) => {
  queries.deleteOne('title', req.params.title);
  res.status(202).send();
});

/**
 * Edit a message
 */
router.post('/:title', (req, res) => {
  const message = new Message(req.body.title, req.body.text);
  queries.editOne('title', req.params.title, message);
  res.status(202).send();
});

module.exports = router;