/**
 * Load dependencies
 */
const SlackBot = require('slackbots');
const CronJob = require('cron').CronJob;
const { getMessage, getTriggers } = require('../methods/helper');
const logger = require('../config/logger');

/**
 * Load secret variables
 */
const { botConfig } = require('../../config');

/**
 * Initialize Slack Bot
 */
const bot = new SlackBot(botConfig);

/**
 * Test slackbot connection
 * general chat can be changed to whatever chat bot joins
 * then we can use it as reusable
 */
bot.on('start', () => {
  // Post a message to general channel
  bot.postMessageToChannel(
    'slackbot-test',
    'What does Marsellus Wallace look like?!'
  );

  // Regular morning greeting at 8:30 from monday to friday
  const goodMorning = new CronJob(
    '30 8 * * 1-5',
    () => {
      bot.postMessageToChannel('general', 'Good Morning Folks! :wave:');
    },
    null,
    true
  );

  /**
   * Testing cron task which sends message every minute
   * Presentation only
   */
  // const test = new CronJob(
  //   '* * * * *',
  //   () => {
  //     bot.postMessageToChannel(
  //       'slackbot-test',
  //       'Testing message sent every minute. :punch:'
  //     );
  //   },
  //   null,
  //   true
  // );
});

/**
 * Error handler
 */
bot.on('error', (err) => logger.logBotError(err));

/**
 * Message handler
 */
bot.on('message', (data) => {
  // Continue only if user sent a MESSAGE directed at BOT
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
            // bot.postMessageToChannel(data.channel, temp_output);
            bot.postMessageToChannel('slackbot-test', temp_output);
          });
        })
        .catch((err) => {
          logger.logSQLError(err);
          bot.postMessageToChannel(
            'slackbot-test',
            'Can not connect to database.'
          );
        });
      return;
    } else {
      /**
       * Sends back a message linked with trigger_word sent from Slack
       */
      let temp = data.text.split(' ');

      getMessage(temp[1])
        .then((message) => {
          /**
           * Testing message post
           */
          // bot.postMessageToChannel(
          //   'slackbot-test',
          //   decodeURIComponent(message.text)
          // );

          /**
           * Production message post
           */
          bot.postMessageToChannel(
            message.channel,
            decodeURIComponent(message.text)
          );
        })
        .catch((err) => {
          logger.logSQLError(err);
          bot.postMessageToChannel(
            'slackbot-test',
            'Can not connect to database.'
          );
        });
      return;
    }
  }
});

module.exports = bot;
