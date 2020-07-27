/**
 * Load modules
 */
const express = require('express');

/**
 * Load channels controller
 */
const { getChannels } = require('../controllers/channelsCtr');

/**
 * Initialize router middleware
 */
const router = express.Router();

router.get('/', getChannels);

module.exports = router;
