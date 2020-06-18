/**
 * Load .env file
 */
require('dotenv').config();

/**
 * Load mysql
 */
const mysql = require('mysql');

const connection = {
  crConn() {
    // Create connection
    var db = mysql.createConnection({
      host: process.env.DATABASE_URL,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    });

    // Connect
    db.connect((err) => {
      if (err) throw err;
      console.log('MySQL connected.');
    });

    return db;
  },
};

module.exports = connection;