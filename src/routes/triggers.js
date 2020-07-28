/**
 * Loading dependencies
 */
const express = require('express');

/**
 * Load helpers and callbacks
 */
const {
  getTriggers,
  getOneTrigger,
  insertNewTrigger,
  deleteTrigger,
  editTrigger,
} = require('../controllers/triggersCtr');
const {
  getBearerToken,
  verifyToken,
  checkTrigerWord,
} = require('../methods/helper');

/**
 * Router middleware
 */
const router = express.Router();

/**
 * Get all triggers
 */
router.get('/', getBearerToken, verifyToken, getTriggers);

/**
 * Get messages by trigger_word
 */
router.get('/:trigger_word', getBearerToken, verifyToken, getOneTrigger);

/**
 * Insert trigger
 */
router.post(
  '/',
  getBearerToken,
  verifyToken,
  checkTrigerWord,
  insertNewTrigger
);

/**
 * Delete one post by trigger name
 */
router.delete('/:trigger_word', getBearerToken, verifyToken, deleteTrigger);

/**
 * Edit one post by trigger name
 */
router.post('/:trigger_word', getBearerToken, verifyToken, editTrigger);

module.exports = router;
