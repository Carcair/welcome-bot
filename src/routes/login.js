/**
 * Loading dependencies
 */
const express = require('express');

/**
 * Load helpers and callbacks
 */
const { getBearerToken, verifyToken } = require('../methods/helper');
const { setToken } = require('../controllers/loginCtr');
// Helper for registering, to be kept commented
// const { regAdmin } = require('../controllers/login');

/**
 * Initialize router middleware
 */
const router = express.Router();

/**
 * Get token
 */
router.post('/', setToken);

/**
 * Verify token
 */
router.post('/test', getBearerToken, verifyToken, (req, res) => {
  res.end('true');
});

/**
 * Helper endpoint for registering admin
 * To be kept commented unless needed in emergency
 */
// router.post('/hidden/reg', regAdmin);

module.exports = router;
