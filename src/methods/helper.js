/**
 * Load dependencies
 */
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
const db = require('../methods/dbConnect');
const { QueryTypes } = require('sequelize');
require('dotenv').config();

/**
 * Load Sequelize models
 */
const Messages = require('../models/Messages');
const Triggers = require('../models/Triggers');

/**
 * Load necessary Sequelize models
 */
const Users = require('../models/Users');

const helpers = {
  /**
   * Encode input
   */
  encodeInsert(obj) {
    Object.keys(obj).forEach(key => {
      obj[key] = encodeURIComponent(obj[key]);
    });
  return obj;
  },

  /**
   * Decode output
   */
    decodeOutput(arrOfObj) {
      if(!Array.isArray(arrOfObj)){ arrOfObj = [arrOfObj]} //checks if "arrOfObj"  is array 
    arrOfObj.forEach(obj =>{    
    Object.keys(obj).forEach(key => {
      obj[key] = decodeURIComponent(obj[key]);
    });
       });
  return arrOfObj;
  }
,
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