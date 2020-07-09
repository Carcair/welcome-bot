/**
 * Load dependencies
 */
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
require('dotenv').config();

/**
 * Load necessary Sequelize models
 */
const Users = require('../models/Users');

const helpers = {
  /**
   * Encode input
   */
  encodeInsert() {
    const self = this;
    let temp = {
      message: encodeURIComponent(self.message),
      run_date: encodeURIComponent(self.run_date),
      repeat_range: encodeURIComponent(self.repeat_range),
    };
    return temp;
  },

  /**
   * Decode output
   */
  decodeOutput() {
    let self = this;
    let temp = {
      message: decodeURIComponent(self.message),
      run_date: decodeURIComponent(self.run_date),
      repeat_range: decodeURIComponent(self.repeat_range),
    };
    return temp;
  },

  /**
   * Token format / Authorization: Bearer <access_token>
   */

  /**
   * Callback fn for getting token out of the header
   */
  getToken(req, res, next) {
    // get authorization header value
    const bearerHeader = req.headers.authorization;
    // Check if header is undefined
    if (typeof bearerHeader !== 'undefined') {
      // Take token out of header
      const bearer = bearerHeader.split(' ');
      const token = bearer[1];
      req.token = token;
      next();
    } else {
      res.sendStatus(403);
    }
  },

  /**
   * Callback fn for token verification
   */
  verifyToken(req, res, next) {
    jwt.verify(req.token, process.env.SK, (err, data) => {
      if (err) {
        logger.logDeniedAccess();
        res.sendStatus(403);
      } else {
        Users.findAll({
          where: {
            id: data.results[0].id,
          },
        })
          .then((result) => {
            if (JSON.stringify(result) === '[]') {
              logger.logAccessExpired();
              res.status(406).end('false');
            } else {
              next();
            }
          })
          .catch((err) => {
            logger.logSQLError(err);
            res.status(406).end(err.parent.sqlMessage);
          });
      }
    });
  },
};

module.exports = helpers;
