const Sequelize = require('sequelize');
const db = require('../methods/dbConnect');

/**
 * Define model for table messages
 */
const Messages = db.define(
  'message',
  {
    title: { type: Sequelize.STRING(255) },
    text: { type: Sequelize.STRING },
    cr_date: { type: Sequelize.STRING(255) },
  },
  { timestamps: false }
);

module.exports = Messages;
