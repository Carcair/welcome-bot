/**
 * Loading dependencies
 */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/**
 * Loading logger configuration
 */
const logger = require('../config/logger');

/**
 * Load config file / changed to transcrypt
 */
const { encKey, NODE_ENV } = require('../../config');

/**
 * Load Sequelize and JOI schema models
 */
const Users = require('../models/Users');
const UsersSchema = require('../models/validation/UsersSchema');

/**
 * Callback for Admin Login endpoint
 */
exports.setToken = (req, res) => {
  let temp = {
    username: req.body.username,
    pass: req.body.pass,
  };

  // Body object validation
  const { error, value } = UsersSchema.validate(temp);

  if (error) {
    logger.logLoginDenied(req.body);
    res.status(406).end('Login Denied');
  } else if (value) {
    Users.findOne({
      where: { username: temp.username },
    })
      .then((user) => {
        // Checking if there is such admin
        if (JSON.stringify(user) === 'null') {
          logger.logLoginDenied(req.body);
          res.status(406).end('Login Denied');
        } else {
          // If admin is found, check it's password
          bcrypt.compare(temp.pass, user.pass, (err, result) => {
            if (result === true) {
              jwt.sign({ user }, encKey, (err, token) => {
                res.json({ token });
              });
            } else {
              logger.logLoginDenied(req.body);
              res.status(406).end('Login Denied');
            }
          });
        }
      })
      .catch((err) => {
        logger.logSQLError(err);
        res.status(406).end(err.parent.sqlMessage);
      });
  }
};

/**
 * Helper callback for registering admin
 * only in development environment
 */

if (NODE_ENV === 'development') {
  exports.regAdmin = (req, res) => {
    let temp = {
      username: req.body.username,
      pass: req.body.pass,
    };

    // Validate input
    const { error } = UsersSchema.validate(temp);
    if (error) {
      // Loger output
      res.sendStatus(406);
    } else {
      // Password encryption
      bcrypt.hash(temp.pass, 10, (err, hash) => {
        temp.pass = hash;

        // Inputing new admin user into DB
        Users.create(temp)
          .then((result) => {
            // Logger output
            res.sendStatus(201);
          })
          .catch((err) => {
            logger.logSQLError(err);
            res.status(406).end(err.parent.sqlMessage);
          });
      });
    }
  };
}
