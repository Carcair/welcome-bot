/**
 * Load .env / changed to transcrypt
 */
// require('dotenv').config();
const config = require('../../config');

/**
 * Load SEQUELIZE
 */
const Sequelize = require('sequelize');

/**
 * Load connection obj
 */
const db = new Sequelize(config.dbName, config.dbUsername, config.dbPass, {
  host: config.dbUrl,
  dialect: 'mysql',
  logging: false,
  define: {
    timestamps: false,
  },
});

module.exports = db;
