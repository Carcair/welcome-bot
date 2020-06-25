/**
 * Loading dependencies
 */
const express = require('express');

/**
 * Load models
 */
const Messages = require('../models/Messages');

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
      let temp = JSON.parse(result);

      temp.forEach((obj, index) => {
        let message = new Messages(obj.title, obj.text, obj.cr_date);
        // Decode query return
        temp[index] = message.decodeOutput();
      });

      temp = JSON.stringify(temp);
      
      res.status(200);
      res.end(temp);
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
      // Decode query return
      let temp = JSON.parse(result);
      let message = new Messages(temp[0].title, temp[0].text, temp[0].cr_date);
      temp[0] = message.decodeOutput();
      temp = JSON.stringify(temp);

      res.status(200);
      res.end(temp);
    })
    .catch(err => {
      console.log(err);
    });
});

/**
 * Insert new message
 */
router.post('/', (req, res) => {
  const message = new Messages(req.body.title, req.body.text, req.body.cr_date);
  
  // Checking input
  if (message.checkInsert()) {
    // Encoding input before sending query
    queries.insertOne(message.encodeInsert());
    res.status(201).send();
  } else {
    res.status(406).send();
  }
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
  const message = new Messages(req.body.title, req.body.text);

  if (message.checkInsert()) {
    queries.editOne('title', req.params.title, message.encodeInsert());
    res.status(202).send();
  } else {
    res.status(406).send();
  }
});

module.exports = router;