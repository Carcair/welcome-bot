/**
 * Loading dependencies
 */
const express = require('express');
const messages = require('../models/messagesModel');

/**
 * Using router middleware
 */
const router = express.Router();

/**
 * Get all messages
 */
router.get('/', (req, res) => {
  var result = messages.getMessages()
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

module.exports = router;