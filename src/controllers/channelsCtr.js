/**
 * Load modules
 */
const SlackBot = require('slackbots');

/**
 * Load secret variables
 */
const { botConfig } = require('../../config');

/**
 * Load helper methods
 */
const { newError } = require('../methods/helper');

/**
 * Initialize slackbot
 */
const bot = new SlackBot(botConfig);

/**
 * Fetches the list of all channels from Slack WS
 */
exports.getChannels = (req, res) => {
  bot
    .getChannels()
    .then((results) => {
      let tempArray = [];
      results.channels.forEach((tempObj) => {
        tempArray.push(tempObj.name);
      });
      res.json({ tempArray });
    })
    .catch((err) => {
      newError(err);
      console.log(err);
      res.status(400).end('Bad Request');
    });
};
