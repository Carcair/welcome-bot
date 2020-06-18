/**
 * Loading env file
 */
require('dotenv').config();

/**
 * loading dependencies
 */
const express = require('express');

/**
 * Initialize express
 */
const app = express();

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
app.use('/api/triggers', triggers);

const port = process.env.PORT;

app.listen(port, () => console.log(`Listening port ${port}`));