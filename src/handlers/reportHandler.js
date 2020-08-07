/**
 * Loading logger
 */
const logger = require('../config/logger');

/**
 * Loading db config
 */
const db = require('../config/dbConfig');
const { QueryTypes } = require('sequelize');

/**
 * Set Messages, Schedules and Triggers number
 * UPDATE `reports` SET `report_value`=(SELECT COUNT(title) FROM messages) WHERE report_name='Messages count'
 */
exports.setReportCount = (report_name, table_name) => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const dateString = `${day}.${month}.${year}`;
  db.query(
    `UPDATE reports 
      SET report_value=(SELECT COUNT(*) FROM ${table_name}), last_update='${dateString}' 
      WHERE report_name='${report_name}'`,
    {
      type: QueryTypes.UPDATE,
    }
  )
    .then((results) => {
      // Counts updated
    })
    .catch((err) => {
      console.log(err);
    });
};
