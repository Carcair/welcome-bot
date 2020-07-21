const Sequelize = require('sequelize');
const db = require('../methods/dbConnect');

/**
 * Define model for table triggers
 */
const Triggers = db.define(
  'trigger',
  {
    message: { type: Sequelize.STRING(255) },
    trigger_word: { type: Sequelize.STRING(255) , unique : true },
    channel: { type: Sequelize.STRING(255) },
    active: { type: Sequelize.STRING(255) }
  },
  { timestamps: false }
);

Triggers.removeAttribute('id'); // removes id attribute from model Triggers

module.exports = Triggers;