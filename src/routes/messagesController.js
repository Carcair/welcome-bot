/**
 * Loading dependencies
 */
const express = require('express');

/**
 * Load methods
 */
const messages = require('../methods/crud/messagesMethods');

/**
 * Load models
 */
const Message = require('../models/Messages');

/**
 * Using router middleware
 */
const router = express.Router();

/**
 * Get all messages
 */
router.get('/', (req, res) => {
  const result = messages.getMessages()
    .then((result) => {
      res.end(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

/**
 * Insert new message
 */
router.post('/', (req, res) => {
  const message = new Message(req.body.title, req.body.text, req.body.cr_date);
  messages.insertMessage(message);
  res.status(201).send();
});

/**
 * Delete a message
 */
router.delete('/:id', (req, res) => {
  messages.deleteMessage(req.params.id);
  res.send('Message deleted.');
});

/**
 * Edit a message
 */
router.post('/:id', (req, res) => {
  const message = new Message(req.body.title, req.body.text);
  messages.editMessage(req.params.id, message);
  res.send('Message edited.');
});

module.exports = router;