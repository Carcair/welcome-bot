/**
 * Loading dependencies
 */
const express = require('express');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
require('dotenv').config();

/**
 * Load Users model
 */
const Users = require('../models/Users');

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
router.post('/', (req, res) => {
  Users.findAll({
    where: {
      username: req.body.username,
      pass: req.body.pass,
    },
  })
    .then((results) => {
      if (JSON.stringify(results) === '[]') {
        logger.logLoginDenied(req.body.username, req.body.pass);
        res.status(406).end('Wrong creds');
      } else {
        jwt.sign({ results }, process.env.SK, (err, token) => {
          res.json({
            token,
          });
        });
      }
    })
    .catch((err) => {
      logger.logSQLError(err);
      res.status(406).end(err.parent.sqlMessage);
    });
});

/**
 * Verify token
 */
router.post('/test', helpers.getToken, helpers.verifyToken, (req, res) => {
  res.end('true');
});

/**
 * Export endpoints
 */
module.exports = router;
