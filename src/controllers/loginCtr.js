/**
 * Loading dependencies
 */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const logger = require('../config/logger');
const db = require('../config/dbConfig');

/**
 * Load config file
 */
require('dotenv').config();

/**
 * Load Sequelize and JOI schema models
 */
const Users = require('../models/Users');
const UsersSchema = require('../models/joiSchema/UsersSchema');

/**
 * Loading helpers
 */
const helpers = require('../methods/helper');

/**
 * Callback for Admin Login endpoint
 */
exports.getToken = (req, res) => {
  let temp = {
    username: req.body.username,
    pass: req.body.pass,
  };

  // Body object validation
  const { error, value } = UsersSchema.validate(temp);

  if (error) {
    // Logger output
    res.sendStatus(406);
  } else {
    Users.findOne({
      where: { username: temp.username },
    })
      .then((user) => {
        // Checking if there is such admin
        if (JSON.stringify(user) === 'null') {
          logger.logLoginDenied(req.body);
          res.sendStatus(401);
        } else {
          // If admin is found, check it's password
          bcrypt.compare(temp.pass, user.pass, (err, result) => {
            if (result === true) {
              jwt.sign({ user }, process.env.SK, (err, token) => {
                res.json({ token });
              });
            } else {
              res.sendStatus(401);
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
 * To be kept commented unless needed in emergency
 */
// exports.regAdmin = (req, res) => {
//   let temp = {
//     username: req.body.username,
//     pass: req.body.pass,
//   };

//   // Validate input
//   const { error } = UsersSchema.validate(temp);
//   if (error) {
//     // Loger output
//     res.sendStatus(406);
//   } else {
//     // Password encryption
//     bcrypt.hash(temp.pass, 10, (err, hash) => {
//       temp.pass = hash;

//       // Inputing new admin user into DB
//       Users.create(temp)
//         .then((result) => {
//           // Logger output
//           res.sendStatus(201);
//         })
//         .catch((err) => {
//           logger.logSQLError(err);
//           res.status(406).end(err.parent.sqlMessage);
//         });
//     });
//   }
// };
