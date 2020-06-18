/**
 * Load MySQL
 */
const mysql = require('mysql');
const connection = require('../assets/dbConnect');

/**
 * Methods object
 */
const triggers = {
  /**
   * Get triggers
   */
  getTriggers() {
    return new Promise((resolve, reject) => {
      const db = connection.crConn();
      const sql = `SELECT * FROM triggers`;
      db.query(sql, (err, result) => {
        if (err) throw err;
        if (result === undefined) {
          reject(new Error("Result not found."));
        } else {
          resolve(JSON.stringify(result));
        }
      });
    });
  }

  /**
   * Insert trigger
   */
  /**
   * Delete Trigger
   */
  /**
   * Update trigger
   */
};

module.exports = triggers;