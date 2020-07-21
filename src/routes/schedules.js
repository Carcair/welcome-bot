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

/**
 * Router middleware
 */
const router = express.Router();

/**
 * Get all schedules
 */
router.get('/', getSchedules);

/**
 * Get one schedule by message title
 */
router.get('/:message', getSchedulesByMessage);

/**
 * Insert schedules
 */
router.post('/', insertNewSchedule);

/**
 * Delete a schedule found by message title
 */
router.delete('/:message', deleteSchedule);

/**
 * Edit schedule found by message title
 */
router.post('/:message', editSchedule);

module.exports = router;
