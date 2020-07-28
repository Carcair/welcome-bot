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

const {
  getBearerToken,
  verifyToken,
  checkTitle,
} = require('../methods/helper');

/**
 * Using router middleware
 */
const router = express.Router();

/**
 * Get all messages
 */
router.get('/', getBearerToken, verifyToken, getMessages);

/**
 * Get one message by title
 */
router.get('/:title', getBearerToken, verifyToken, getOneMessage);

/**
 * Insert new message
 */
router.post('/', getBearerToken, verifyToken, checkTitle, insertNewMessage);

/**
 * Delete a message
 */
router.delete('/:title', getBearerToken, verifyToken, deleteMessage);

/**
 * Edit a message
 */
router.post('/:title', getBearerToken, verifyToken, editMessage);

module.exports = router;
