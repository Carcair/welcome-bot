/**
 * Loading dependencies
 */
const express = require('express');

/**
 * Load helpers and callbacks
 */
const {
  getMessages,
  getOneMessage,
  insertNewMessage,
  deleteMessage,
  editMessage,
} = require('../controllers/messagesCtr');

/**
 * Using router middleware
 */
const router = express.Router();

/**
 * Get all messages
 */
router.get('/', getMessages);

/**
 * Get one message by title
 */
router.get('/:title', getOneMessage);

/**
 * Insert new message
 */
router.post('/', insertNewMessage);

/**
 * Delete a message
 */
router.delete('/:title', deleteMessage);

/**
 * Edit a message
 */
router.post('/:title', editMessage);

module.exports = router;
