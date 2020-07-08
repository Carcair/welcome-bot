const winston = require('winston');

/**
 * Create logger
 */
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: 'src/logs/combined.log',
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      filename: 'src/logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});

module.exports = logger;
