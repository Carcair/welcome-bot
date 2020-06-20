
/**
 * Load mysql
 */
const mysql = require('mysql');
const connection = require('../dbConnect');


/**
 * Load models
 */
const Select = require('../../models/queries/Select');
const Insert = require('../../models/queries/Insert');
const Delete = require('../../models/queries/Delete');
const Edit = require('../../models/queries/Edit');


/**
 * Methods object
 */
const messages = {
  /**
   * Get all messages
   */
  getMessages() {
    return new Promise((resolve, reject) => {
      /**
       * Connecting to DB. Using connection to db on each query,
       * since we used free package from DB host provider
       */
      const db = connection.crConn();
      const m_select = new Select('messages');

      db.query(m_select.sql, (err, result) => {
        if (err) throw err;

        if (result === undefined)
          reject(new Error("Result is undefined."));
        else
          resolve(JSON.stringify(result));
      });
    });
  },

  /**
   * Get one message by filter
   */

  /**
   * Insert new message
   */
  insertMessage(message) {
    const db = connection.crConn();
    const m_insert = new Insert('messages', message);

    db.query(m_insert.sql, (err, result) => {
      if (err) throw err;
    });
  },

  /**
   * Delete a message
   */
  deleteMessage(id) {
    const db = connection.crConn();
    const m_delete = new Delete('messages', 'id', id);

    db.query(m_delete.sql, (err, result) => {
      if (err) throw err;
    });
  },

  /**
   * Edit message
   */
  editMessage(id, message) {
    const db = connection.crConn();
    const m_edit = new Edit('messages', 'id', id, message);

    db.query(m_edit.sql, (err, result) => {
      if (err) throw err;
    });
  }
};

module.exports = messages;