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

app.use('/messages/', messages);

const port = process.env.PORT;

app.listen(port, () => console.log(`Listening port ${port}`));