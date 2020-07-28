//////////////////////////////////////
//                                  //
//      Welcome Bot Application     //
//            Entry Point           //
//                                  //
//////////////////////////////////////

// TODO:
// FIXME:
/**
 * Loading env file / to be replaced with Transcrypt
 */
const { port } = require('../config');

/**
 * loading dependencies
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

/**
 * Initialize cron tasks
 */
const cronTasks = require('./methods/cronTasks');
cronTasks.setTasks();
/**
 * Initialize slack bot
 */
const bot = require('./handlers/botHandler');
/**
 * Loading helper files
 */
const logger = require('./config/logger');

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
const messages = require('./routes/messages');
const schedules = require('./routes/schedules');
const triggers = require('./routes/triggers');
const channels = require('./routes/channels');

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
app.use('/api/channels', channels);

app.listen(port, () => {
  console.log(`Listening @${port}`);
});
