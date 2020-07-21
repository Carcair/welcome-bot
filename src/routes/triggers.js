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

/**
 * Router middleware
 */
const router = express.Router();

/**
 * Get all triggers
 */
router.get('/', getTriggers);

/**
 * Get messages by trigger_word
 */
router.get('/:trigger_word', getOneTrigger);

/**
 * Insert trigger
 */
router.post('/', insertNewTrigger);

/**
 * Delete one post by trigger name
 */
router.delete('/:trigger_word', deleteTrigger);

/**
 * Edit one post by trigger name
 */
router.post('/:trigger_word', editTrigger);

module.exports = router;
