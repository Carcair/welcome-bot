//////////////////////////////////////
//                                  //
//      Welcome Bot Application     //
//            Entry Point           //
//                                  //
//////////////////////////////////////

/**
 * Loading env file / to be replaced with Transcrypt
 */
require('dotenv').config();

/**
 * loading dependencies
 */
const express = require('express');
const cors = require('cors');
const cronJob = require('node-cron');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

/**
 * Loading helper files
 */
const logger = require('./config/logger');
// const bot = require('./handlers/botHandler');

// /**
//  * Schedule test
//  */
// let job = cronJob.schedule(
//   '00 41 14 * * 0-6',
//   () => {
//     console.log('Test');
//   },
//   {
//     scheduled: true,
//   }
// );

/**
 * Config for limiter
 */
const limiter = rateLimit({
  windowMs: 60 * 100,
  max: 100,
});

/**
 * Initialize express
 */
const app = express();

/**
 * Loading routes
 */
const login = require('./routes/login');
const messages = require('./routes/messagesController');
const schedules = require('./routes/schedulesController.js');
const triggers = require('./routes/triggersController');

/**
 * Initialize middleware
 */
app.use(express.json({ limit: '500kb' }));
app.use(cors());
app.use(helmet());
app.use(limiter);

/**
 * Load DB connection
 */
const db = require('./config/dbConfig');

// checking connection
db.authenticate()
  .then(() => {
    // Connected to database
  })
  .catch((err) => {
    // console.log('ERROR - Unable to connect to the database:', err);
    logger.logSQLError(err);
  });

/**
 * Initializing routes
 */
app.use('/login', login);
app.use('/api/messages/', messages);
app.use('/api/schedules/', schedules);
app.use('/api/triggers/', triggers);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Listening @${port}`);
});
