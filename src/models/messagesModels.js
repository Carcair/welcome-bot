
/**
 * Load mysql
 */
const mysql = require('mysql');
const connection = require('../assets/dbConnect');

/**
 * Methods object
 */
const messages = {
  /**
   * Get all messages
   */
  getMessages() {
    return new Promise((resolve, reject) => {
      const db = connection.crConn();
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
    const db = connection.crConn();
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
    const db = connection.crConn();
    let sql = `DELETE FROM messages WHERE id='${id}'`;
    db.query(sql, (err, result) => {
      if (err) throw err;
      console.log(result);
    });
  },

  /**
   * Edit message
   */
};

module.exports = messages;