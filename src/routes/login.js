/**
 * Loading dependencies
 */
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const logger = require('../config/logger');
const { getToken } = require('../controllers/loginCtr');
// Helper for registering, to be kept commented
// const { regAdmin } = require('../controllers/login');
require('dotenv').config();

/**
 * Load Users model
 */
const Users = require('../models/Users');

/**
 * Load schema module
 */
const UsersSchema = require('../models/joiSchema/UsersSchema');

/**
 * Load helper methods
 */
const helpers = require('../methods/helper');

/**
 * Initialize router middleware
 */
const router = express.Router();

/**
 * Get token
 */
router.post('/', getToken);

/**
 * Verify token
 */
router.post(
  '/test',
  helpers.getBearerToken,
  helpers.verifyToken,
  (req, res) => {
    res.end('true');
  }
);

/**
 * Helper endpoint for registering admin
 * To be kept commented unless needed in emergency
 */
// router.post('/hidden/reg', regAdmin);

module.exports = router;
