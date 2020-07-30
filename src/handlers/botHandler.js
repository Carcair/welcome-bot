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
// bot.on('start', () => {
//   const test = new CronJob(
//     '* * * * *',
//     () => {
//       bot.postMessageToChannel(
//         'slackbot-test',
//         'Testing message sent every minute. :punch:'
//       );
//     },
//     null,
//     true
//   );
// });

/**
 * Error handler
 */
bot.on('error', (err) => logger.logBotError(err));

/**
 * Message handler
 */
bot.on('message', (data) => {
  // Continue only if user sent a MESSAGE directed at BOT
  if (
    data.type === 'message' &&
    data.username !== 'Welcome Bot' &&
    data.text.includes('<@U016JKBGAVD>')
  ) {
    /**
     * Username is contained in metadata only if the sender is Bot
     * In other cases metadata contains only user ID's and channel ID's
     * Necessary comparisons to get username and channel names
     */

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

            /**
             * Comparing channel id where message to bot was sent
             * with all channels
             * then sending response in apropriate channel
             */
            bot
              .getChannels()
              .then((results) => {
                results.channels.forEach((obj) => {
                  if (data.channel === obj.id) {
                    bot.postMessageToChannel(obj.name, temp_output);
                  }
                });
              })
              .catch((err) => {
                logger.logBotError(err);
              });
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
    } else if (data.text.includes(' robot-about')) {
      /**
       * Get channel and its users
       */

      // Get all channels
      bot.channels.forEach((channelObj) => {
        /**
         * Comparing all channel ID's with channel ID where message was sent
         */

        if (channelObj.id === data.channel) {
          // Ourput
          let tempOutput = `Channel \`\`\`${channelObj.name}\`\`\` | Members: `;

          // Get all users from workspace
          bot.users.forEach((userObj) => {
            // Undefined users no longer are part of workspace
            // we need only users which belong to the channel we are requesting info from
            if (
              userObj.real_name !== undefined &&
              channelObj.members.includes(userObj.id)
            ) {
              tempOutput += ` \`\`\` ${userObj.real_name} \`\`\` `;
            }
          });
          bot.postMessageToChannel(channelObj.name, tempOutput);
        }
      });

      /**
       * Messages defined by application description
       * but don't have detailed description of their purpose
       */
    } else if (data.text.includes(' robot-benefits')) {
      /**
       * General info about company benefits
       */
    } else if (data.text.includes(' robot-work')) {
      /**
       * Shows about flexible work hours
       */
    } else if (data.text.includes(' robot-docs')) {
      /**
       * Show link to documentation related to channel or general documentation
       */
    } else if (data.text.includes(' robot-community')) {
      /**
       * Show link about the Google+ community
       */
    } else {
      /**
       * Sends back a message linked with trigger_word sent from Slack
       */
      let temp = data.text.split(' ');

      getMessage(temp[1])
        .then((message) => {
          /**
           * If channel is defined as private
           * Message must be sent to user in PM
           */
          if (message.channel !== 'private') {
            // Message sent to channel
            bot.postMessageToChannel(
              message.channel.toLowerCase(),
              decodeURIComponent(message.text)
            );
          } else {
            /**
             * Comparing user id from metadata with all users id
             * and getting username from that comparison
             */
            bot
              .getUsers()
              .then((results) => {
                results.members.forEach((obj) => {
                  if (obj.real_name !== undefined) {
                    if (data.user === obj.id) {
                      bot.postMessageToUser(obj.name, temp_output);
                    }
                  }
                });
              })
              .catch((err) => {
                logger.logBotError(err);
              });
          }
        })
        .catch((err) => {
          //logger.logSQLError(err);
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
