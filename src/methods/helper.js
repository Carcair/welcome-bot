/**
 * Load dependencies
 */
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
const db = require('../config/dbConfig');
const { QueryTypes } = require('sequelize');
require('dotenv').config();

/**
 * Load Sequelize models
 */
// const Messages = require('../models/Messages');
const Triggers = require('../models/Triggers');

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
  getBearerToken(req, res, next) {
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
            id: data.user.id,
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

  /**
   * Get message with selected triggers
   */
  getMessage(trigger_word) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT messages.text AS text, triggers.channel AS channel FROM messages JOIN triggers ON messages.title=triggers.message WHERE trigger_word='${trigger_word}'`,
        {
          type: QueryTypes.SELECT,
        }
      )
        .then((message) => {
          resolve(message[0]);
        })
        .catch((err) => {
          logger.logSQLError(err);
          reject(err.parent.sqlMessage);
        });
    });
  },

  /**
   * Get all available commands
   */
  getTriggers() {
    return new Promise((resolve, reject) => {
      Triggers.findAll()
        .then((triggers) => {
          resolve(triggers);
        })
        .catch((err) => {
          logger.logSQLError(err);
          reject(err.parent.sqlMessage);
        });
    });
  },
};

module.exports = helpers;
