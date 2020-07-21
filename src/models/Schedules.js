const Sequelize = require('sequelize');
const db = require('../config/dbConfig');

/**
 * Define model for table schedules
 */
const Schedules = db.define(
  'schedule',
  {
    message: { type: Sequelize.STRING(255)},
    run_date: { type: Sequelize.STRING(255) },
    active: { type: Sequelize.STRING(255) },
    repeat_range: { type: Sequelize.STRING(255) },
  },
  { timestamps: false }
);
Schedules.removeAttribute('id'); // removes id attribute from model Schedules

module.exports = Schedules;
