/**
 * Load modules
 */
const SlackBot = require('slackbots');

/**
 * Load secret variables
 */
const { botConfig } = require('../../config');

/**
 * Initialize slackbot
 */
const bot = new SlackBot(botConfig);

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
      console.log(err);
      res.status(406).end('Not acceptable');
    });
};
