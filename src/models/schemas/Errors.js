const Sequelize = require('sequelize');
const db = require('../../config/dbConfig');

/**
 * Define model for error table
 */
const Errors = db.define(
  'error',
  {
    text: { type: Sequelize.TEXT },
    timestamp: { type: Sequelize.STRING(255) },
  },
  { timestamps: false }
);

module.exports = Errors;
