/**
 * Loading dependencies
 */
const express = require('express');

/**
 * Load loader
 */
const schedules = require('../methods/crud/schedulesMethods');

/**
 * Router middleware
 */
const router = express.Router();

/**
 * Get schedules
 */
router.get('/', (req, res) => {
  const result = schedules.getSchedules()
    .then(result => {
      res.end(result);
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;