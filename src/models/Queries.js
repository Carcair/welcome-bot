const mysql = require('mysql');
const connection = require('../methods/dbConnect');

class Queries {
  constructor(table_name) {
    this.table_name = table_name;
  }

  /**
   * Selecting all rows from MySQL db
   */
  selectAll() {
    return new Promise((resolve, reject) => {
      /**
       * Connecting to DB. Using connection to db on each query,
       * since we used free package from DB host provider
       */
      const db = connection.crConn();
      const sql = `SELECT * FROM ${this.table_name}`;

      db.query(sql, (err, result) => {
        if (err) throw err;

        if (result === undefined) reject(new Error('Result is undefined.'));
        else resolve(JSON.stringify(result));
      });

      // Close connection
      db.end((err) => console.log('Connection closed'));
    });
  }

  /**
   * Selecting one row from MySQL db depending on filter
   */
  selectOne(filter_name, filter_value) {
    return new Promise((resolve, reject) => {
      const db = connection.crConn();
      const sql = `SELECT * FROM ${this.table_name} WHERE ${filter_name}='${filter_value}' LIMIT 1`;

      db.query(sql, (err, result) => {
        if (err) throw err;

        if (result === undefined) reject(new Error('Result is undefined'));
        else resolve(JSON.stringify(result));
      });

      // Close connection
      db.end((err) => console.log('Connection closed'));
    });
  }

  /**
   * Insert one new row into MySQL db
   */
  insertOne(value_obj) {
    const db = connection.crConn();
    let sql = '';

    switch (this.table_name) {
      case 'messages':
        sql = `INSERT INTO messages(title, text, cr_date) VALUES ('${value_obj.title}', '${value_obj.text}', '${value_obj.cr_date}')`;
        break;

      case 'schedules':
        sql = `INSERT INTO schedules(message, run_date, repeat_range) VALUES ('${value_obj.message}', '${value_obj.run_date}', '${value_obj.repeat_range}')`;
        break;

      case 'triggers':
        sql = `INSERT INTO triggers(message, trigger_word, channel, active) VALUES ('${value_obj.message}', '${value_obj.trigger_word}', '${value_obj.channel}', '${value_obj.active}')`;
        break;

      default:
        console.log('Incorrect table name.');
        break;
    }

    db.query(sql, (err, result) => {
      if (err) throw err;
    });

    db.end((err) => console.log('Connection closed'));
  }

  /**
   * Delete one row in MySQL db
   */
  deleteOne(filter_name, filter_value) {
    const db = connection.crConn();
    const sql = `DELETE FROM ${this.table_name} WHERE ${filter_name}='${filter_value}'`;

    db.query(sql, (err, result) => {
      if (err) throw err;
    });

    db.end((err) => console.log('Connection closed'));
  }

  /**
   * Edit one row in MySQL db
   */
  editOne(filter_name, filter_value, value_obj) {
    const db = connection.crConn();
    let sql = '';

    switch (this.table_name) {
      case 'messages':
        sql = `UPDATE ${this.table_name} SET title='${value_obj.title}', text='${value_obj.text}' WHERE ${filter_name}='${filter_value}'`;
        break;

      case 'schedules':
        sql = `UPDATE ${this.table_name} SET message='${value_obj.message}', run_date='${value_obj.run_date}', repeat_range='${value_obj.repeat_range}' WHERE ${filter_name}='${filter_value}'`;
        break;

      case 'triggers':
        sql = `UPDATE ${this.table_name} SET message='${value_obj.message}', trigger_word='${value_obj.trigger_word}', channel='${value_obj.channel}', active='${value_obj.active}' WHERE ${filter_name}='${filter_value}'`;
        break;

      default:
        console.log('Incorrect table name.');
        break;
    }

    db.query(sql, (err, result) => {
      if (err) throw err;
    });

    db.end((err) => console.log('Connection closed'));
  }
}

module.exports = Queries;
