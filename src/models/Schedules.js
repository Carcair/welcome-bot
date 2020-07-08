const Sequelize = require('sequelize');
const db = require('../methods/dbConnect');

/**
 * Define model for table schedules
 */
const Schedules = db.define(
  'schedule',
  {
    message: { type: Sequelize.STRING(255) },
    run_date: { type: Sequelize.STRING(255) },
    repeat_range: { type: Sequelize.STRING(255) },
  },
  { timestamps: false }
);
Schedules.removeAttribute('id');

module.exports = Schedules;