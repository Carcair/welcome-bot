const Sequelize = require('sequelize');
const db = require('../../config/dbConfig');

/**
 * Reports model
 */
const BotCalls = db.define(
  'botcall',
  {
    date: { type: Sequelize.STRING(255) },
    called: { type: Sequelize.STRING(255) },
  },
  { timestamps: false }
);

module.exports = BotCalls;
