/**
 * Load dependencies
 */
const SlackBot = require('slackbots');
const { getMessage, getTriggers } = require('../methods/helper');

/**
 * Load secret variables
 */
const { botConfig } = require('../../config');

const bot = new SlackBot(botConfig);

const CronJob = require('cron').CronJob;
/**
 * Test slackbot connection
 * general chat can be changed to whatever chat bot joins
 * then we can use it as reusable
 */
bot.on('start', () => {
  // var params = {};

  // Post a message to general channel
  bot.postMessageToChannel(
    'slackbot-test',
    'What does Marsellus Wallace look like?!'
  );
});

/**
 * Error handler
 */
bot.on('error', (err) => console.log(err));

/**
 * Message handler
 */
bot.on('message', (data) => {
  // Break if event sent something unauthorized
  if (data.type === 'message' && data.username !== 'Welcome Bot') {
    /**
     * Check input for some defaults
     */
    if (data.text.includes(' help')) {
      /**
       * Sends back list of commands available for users
       */

      getTriggers()
        .then((result) => {
          let temp = JSON.stringify(result);
          temp_array = JSON.parse(temp);
          temp_array.forEach((obj) => {
            let temp_output = `\`\`\`Command: ${obj.trigger_word}, posts on channel: ${obj.channel}, active: ${obj.active}\`\`\``;
            bot.postMessageToChannel('slackbot-test', temp_output);
          });
        })
        .catch((err) => {
          bot.postMessageToChannel('slackbot-test', err);
        });
      return;
    } else {
      let temp = data.text.split(' ');

      getMessage(temp[1])
        .then((message) => {
          bot.postMessageToChannel(
            'slackbot-test',
            decodeURIComponent(message.text)
          );
          // bot.postMessageToChannel(message.channel, message.text);
        })
        .catch((err) => {
          bot.postMessageToChannel(
            'slackbot-test',
            'Can not connect to database.'
          );
        });
      return;
    }
  }
});

const job = new CronJob(
  '22 13 * * *',
  () => {
    console.log('Testing');
  },
  null,
  true
);

module.exports = bot;
