/**
 * Loading logger
 */
const logger = require('../config/logger');

/**
 * Loading table models
 */
const Reports = require('../models/Reports');
const BotCalls = require('../models/BotCalls');

/**
 * Fetches list of reports
 */
exports.getReports = (req, res) => {
  Reports.findAll()
    .then((reports) => {
      res.status(200).json({ reports });
    })
    .catch((err) => {
      logger.logSQLError(err);
      res.status(400).end('SQL Error');
    });
};

/**
 * Fetches the number of times a message
 * got called by command
 */
exports.getUsage = (req, res) => {
  BotCalls.findAll()
    .then((usage) => {
      res.status(200).json({ usage });
    })
    .catch((err) => {
      logger.logSQLError(err);
      res.status(400).end('SQL Error');
    });
};
