const Sequelize = require('sequelize');
const db = require('../../config/dbConfig');

/**
 * Reports model
 */
const Reports = db.define(
  'report',
  {
    report_name: { type: Sequelize.STRING(255) },
    report_value: { type: Sequelize.STRING(255) },
    last_update: { type: Sequelize.STRING(255) },
  },
  { timestamps: false }
);

module.exports = Reports;
