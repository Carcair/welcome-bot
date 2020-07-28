/**
 * Load modules
 */
const express = require('express');

/**
 * Load channels controller
 */
const { getChannels } = require('../controllers/channelsCtr');

/**
 * Load helpers and callbacs
 */
const { getBearerToken, verifyToken } = require('../methods/helper');

/**
 * Initialize router middleware
 */
const router = express.Router();

router.get('/', getBearerToken, verifyToken, getChannels);

module.exports = router;
