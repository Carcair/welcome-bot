/**
 * Load dependencies
 */
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
const db = require('../config/dbConfig');
const { QueryTypes } = require('sequelize');

/**
 * Load secret variables
 */
const { encKey } = require('../../config');

/**
 * Load Sequelize models
 */
const Triggers = require('../models/Triggers');
const Messages = require('../models/Messages');

/**
 * Load necessary Sequelize models
 */
const Users = require('../models/Users');

/**
 * Encode input
 */
exports.encodeInsert = (obj) => {
  let key;
  for (key in obj) {
    obj[key] = encodeURIComponent(obj[key]);
  }
  return obj;
};

/**
 * Decode output
 */
exports.decodeOutput = (arrOfObj) => {
  if (!Array.isArray(arrOfObj)) {
    arrOfObj = [arrOfObj];
  } //checks if "arrOfObj"  is array
  arrOfObj.forEach((obj) => {
    let key;
    for (key in obj) {
      obj[key] = decodeURIComponent(obj[key]);
    }
  });
  return arrOfObj;
};
/**
 * Token format / Authorization: Bearer <access_token>
 */

/**
 * Callback fn for getting token out of the header
 */
exports.getBearerToken = (req, res, next) => {
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
};

/**
 * Callback fn for token verification
 */
exports.verifyToken = (req, res, next) => {
  jwt.verify(req.token, encKey, (err, data) => {
    if (err) {
      logger.logDeniedAccess(err);
      res.status(403).end('Denied Access');
    } else {
      Users.findAll({
        where: {
          id: data.user.id,
        },
      })
        .then((result) => {
          if (JSON.stringify(result) === '[]') {
            logger.logAccessExpired();
            res.status(406).end('Session Expired');
          } else {
            next();
          }
        })
        .catch((err) => {
          logger.logSQLError(err);
          res.status(400).end('SQL Error');
        });
    }
  });
};

/**
 * Get message with selected triggers
 */
exports.getMessage = (trigger_word) => {
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
        reject(err);
      });
  });
};

/**
 * Get all available commands
 */
exports.getTriggers = () => {
  return new Promise((resolve, reject) => {
    Triggers.findAll()
      .then((triggers) => {
        resolve(triggers);
      })
      .catch((err) => {
        reject('SQL Error');
      });
  });
};

/**
 * Check if there's a message with some title
 */
exports.checkTitle = (req, res, next) => {
  Messages.findAll({
    where: { title: req.body.title },
    raw: true,
  })
    .then((result) => {
      if (result[0] === undefined) {
        next();
      } else {
        // 'title already exists'
        res.status(302).end('Message with that title exists');
      }
    })
    .catch((err) => {
      logger.logSQLError(err);
      res.status(400).end('SQL Error');
    });
};

/**
 * Check if there's a trigger with some trigger_word
 */
exports.checkTrigerWord = (req, res, next) => {
  Triggers.findAll({
    where: { trigger_word: req.body.trigger_word },
    raw: true,
  })
    .then((result) => {
      if (result[0] === undefined) {
        next();
      } else {
        // 'Trigger_word already exists'
        res.status(302).end('Trigger with that trigger word exists');
      }
    })
    .catch((err) => {
      logger.logSQLError(err);
      res.status(400).end('SQL Error');
    });
};
