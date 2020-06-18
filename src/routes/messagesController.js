/**
 * Loading dependencies
 */
const express = require('express');

/**
 * Load loader
 */
const messages = require('../models/messagesModels');

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
router.post('/newmessage', (req, res) => {
  let message = {
    title: 'something new',
    text: 'fucks sake',
    cr_date: '555444'
  };
  messages.insertMessage(message.title, message.text, message.cr_date);
  res.send('New message created.');
});

/**
 * Delete a message
 */
router.delete('/deletemessage', (req, res) => {
  let id = 3;
  messages.deleteMessage(id);
  res.send('Message deleted.');
});

module.exports = router;