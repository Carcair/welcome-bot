/**
 * Load .env file
 */
require('dotenv').config();

/**
 * Load mysql
 */
const mysql = require('mysql');

const messages = {
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

  /**
   * Get all messages
   */
  getMessages() {
    return new Promise((resolve, reject) => {
      const db = this.crConn();
      const sql = `SELECT * FROM messages`;
      db.query(sql, (err, result) => {
        if (result === undefined) {
          reject(new Error("Result is undefined."));
        } else {
          resolve(JSON.stringify(result));
        }
      });
    });
  },

  /**
   * Insert new message
   */
  insertMessage(title, text, cr_date) {
    const db = this.crConn();
    let sql = `INSERT INTO messages(title, text, cr_date) VALUES ('${title}', '${text}', '${cr_date}')`;
    let query = db.query(sql, (err, result) => {
      if (err) throw err;
      console.log(result);
    });
  },

  /**
   * Delete a message
   */
  deleteMessage(id) {
    
  }
};

module.exports = messages;