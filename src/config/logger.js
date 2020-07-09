const winston = require('winston');

/**
 * Create logger
 */
const logger = {
  info: winston.createLogger({
    transports: [
      new winston.transports.File({
        filename: 'src/logs/combined.log',
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
      }),
    ],
  }),
  error: winston.createLogger({
    transports: [
      new winston.transports.File({
        filename: 'src/logs/error.log',
        level: 'error',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
      }),
    ],
  }),
  logSQLError: (err) => {
    logger.error.log({
      level: 'error',
      message: `Error code: ${err.parent.code} || Error message: ${err.parent.sqlMessage} || Error number: ${err.parent.errno}`,
    });
  },
  logInput: (input, table_name) => {
    logger.info.log({
      level: 'info',
      message: `New ${table_name}: ${input} sent to the Database successfully.`,
    });
  },
  logDelete: (title, table_name) => {
    logger.info.log({
      level: 'info',
      message: `${table_name}: "${title}" deleted from the Database.`,
    });
  },
  logUpdate: (input, title, table_name) => {
    logger.info.log({
      level: 'info',
      message: `"${title}" in ${table_name} updated with ${input}.`,
    });
  },
};

module.exports = logger;
