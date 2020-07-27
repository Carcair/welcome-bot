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
const db = new Sequelize(
  // process.env.DATABASE_NAME,
  // // 'test', // Use when testing failed connection
  // process.env.DATABASE_USERNAME,
  // process.env.DATABASE_PASSWORD,
  config.dbName,
  config.dbUsername,
  config.dbPass,
  {
    // host: process.env.DATABASE_URL,
    host: config.dbUrl,
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: false,
    },

    // pool: {
    //   max: 100,
    //   min: 0,
    //   acquire: 30000,
    //   idle: 10000,
    // },
  }
);

module.exports = db;
