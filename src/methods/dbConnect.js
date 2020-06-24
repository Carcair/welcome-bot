/**
 * Load mysql
 */
const mysql = require('mysql');

/**
 * Load connection obj
 */
const DBConfig = require('../models/DBConfig');

const connection = {
  crConn() {
    // Create connection
    var db = mysql.createConnection(new DBConfig());

    // Connect
    db.connect((err) => {
      if (err) throw err;
      console.log('MySQL connected.');
    });

    return db;
  },
};

module.exports = connection;