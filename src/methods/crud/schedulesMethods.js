/**
 * Load MySQL
 */
const mysql = require('mysql');
const connection = require('../dbConnect');

/**
 * Methods object
 */
const schedules = {
  /**
   * Get Schedules
   */
  getSchedules() {
    return new Promise((resolve, reject) => {
      const db = connection.crConn();
      const sql = `SELECT * FROM schedules`;
      db.query(sql, (err, result) => {
        if (err) throw err;
        if (result === undefined) {
          reject(new Error("Result is undefined"));
        } else {
          resolve(JSON.stringify(result));
        }
      });
    });
  },

  /**
   * Insert schedules
   */

  /**
   * Delete schedules
   */

  /**
   * Update schedules
   */
};

module.exports = schedules;