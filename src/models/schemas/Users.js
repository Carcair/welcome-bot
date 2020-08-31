const Sequelize = require('sequelize');
const db = require('../../config/dbConfig');

/**
 * Model for user table
 */
const Users = db.define(
  'user',
  {
    username: { type: Sequelize.STRING(255) },
    pass: { type: Sequelize.STRING(255) },
  },
  { timestamps: false }
);

module.exports = Users;
