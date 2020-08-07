/**
 * Load dependencies
 */
const express = require('express');

/**
 * Load helpers and callbacks
 */
const { getBearerToken, verifyToken } = require('../methods/helper');
const { getReports, getUsage } = require('../controllers/reportsCtr');

/**
 * Load middlewares
 */
const router = express.Router();

/**
 * Get all reports
 */
router.get('/', getBearerToken, verifyToken, getReports);

/**
 * Get bot usage
 */
router.get('/usage', getBearerToken, verifyToken, getUsage);

module.exports = router;
