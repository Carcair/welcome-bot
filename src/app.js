/**
 * Loading env file
 */
require('dotenv').config();

/**
 * loading dependencies
 */
const express = require('express');
const cors = require('cors');
const logger = require('./config/logger');

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
app.use(express.json());
app.use(cors());

/**
 * Load DB connection
 */
const db = require('./methods/dbConnect');

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
