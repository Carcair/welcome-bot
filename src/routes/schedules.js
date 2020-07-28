/**
 * Loading dependencies
 */
const express = require('express');

/**
 * Load helpers and callbacks
 */
const {
  getSchedules,
  getSchedulesByMessage,
  insertNewSchedule,
  deleteSchedule,
  editSchedule,
} = require('../controllers/schedulesCtr');
const { getBearerToken, verifyToken } = require('../methods/helper');

/**
 * Router middleware
 */
const router = express.Router();

/**
 * Get all schedules
 */
router.get('/', getBearerToken, verifyToken, getSchedules);

/**
 * Get one schedule by message title
 */
router.get('/:message', getBearerToken, verifyToken, getSchedulesByMessage);

/**
 * Insert schedules
 */
router.post('/', getBearerToken, verifyToken, insertNewSchedule);

/**
 * Delete a schedule found by message title
 */
router.delete('/:message', getBearerToken, verifyToken, deleteSchedule);

/**
 * Edit schedule found by message title
 */
router.post('/:message', getBearerToken, verifyToken, editSchedule);

module.exports = router;
