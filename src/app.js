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
const routes = require('./routes/index');

app.use('/', routes);

const port = process.env.PORT;
const env = process.env.NODE_ENV;
const host = process.env.HOST;

app.listen(port, () => console.log(`Listening port ${port}`));