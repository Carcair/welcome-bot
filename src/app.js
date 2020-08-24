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
const {
  port,
  port2,
  location_key,
  location_chain,
  location_cert,
} = require('../config');

/**
 * loading dependencies
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const https = require('https');

/**
 * Load DB connection
 */
const db = require('./config/dbConfig');

// checking connection
db.authenticate()
  .then(() => {
    // Connected to database
    /**
     * Initialize slack bot
     */
    const bot = require('./handlers/botHandler');
    /**
     * Initialize cron tasks
     */
    const cronTasks = require('./methods/cronTasks');
    cronTasks.setTasks();
  })
  .catch((err) => {
    logger.logSQLError(err);
  });

/**
 * Loading helper files
 */
const logger = require('./config/logger');
const { setReportCount } = require('./handlers/reportHandler');

/**
 * Initializing report info
 */
setReportCount('Messages count', 'messages');
setReportCount('Schedules count', 'schedules');
setReportCount('Triggers count', 'triggers');

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
const reports = require('./routes/reports');

/**
 * Initialize middleware
 */
app.use(express.json({ limit: '500kb' }));
app.use(cors());
app.use(helmet());
app.use(limiter);

/**
 * Initializing routes
 */
app.use('/login', login);
app.use('/api/messages/', messages);
app.use('/api/schedules/', schedules);
app.use('/api/triggers/', triggers);
app.use('/api/channels', channels);
app.use('/api/reports', reports);

https
  .createServer(
    {
      key: fs.readFileSync(location_key),
      cert: fs.readFileSync(location_cert),
      ca: fs.readFileSync(location_chain),
    },
    app
  )
  .listen(port2, () => {
    console.log(`Listening on ${port2}`);
  });

// app.listen(port, () => {
//   console.log(`Listening @${port}`);
// });
