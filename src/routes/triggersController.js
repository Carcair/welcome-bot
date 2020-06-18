/**
 * Loading dependencies
 */
const express = require('express');

/**
 * Load loader
 */
const triggers = require('../models/triggersModels');

/**
 * Router middleware
 */
const router = express.Router();

/**
 * Get Schedules
 */
router.get('/', (req, res) => {
  const result = triggers.getTriggers()
    .then(result => {
      res.end(result);
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;