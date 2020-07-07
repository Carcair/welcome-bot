/**
 * Loading env file
 */
require('dotenv').config();

/**
 * loading dependencies
 */
const express = require('express');
const cors = require('cors');

/**
 * Initialize express
 */
const app = express();

/**
 * Loading middleware
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
    console.log('INFO - Database connected.');
  })
  .catch((err) => {
    console.log('ERROR - Unable to connect to the database:', err);
  });

/**
 * Loading routes
 */
const messages = require('./routes/messagesController');
const schedules = require('./routes/schedulesController.js');
const triggers = require('./routes/triggersController');

/**
 * Initializing routes
 */
app.use('/api/messages/', messages);
app.use('/api/schedules/', schedules);
app.use('/api/triggers/', triggers);

const port = process.env.PORT;

app.listen(port, () => console.log(`Listening port ${port}`));
