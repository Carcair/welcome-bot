/**
 * Load dependencies
 */
const SlackBot = require('slackbots');
const CronJob = require('cron').CronJob;

/**
 * Load helpers and logger files
 */
const {
  getMessage,
  getTriggers,
  setBotCall,
  newError,
} = require('../methods/helper');
const logger = require('../config/logger');

/**
 * Load secret variables
 */
const { botConfig } = require('../../config');

/**
 * Initialize Slack Bot
 */
let bot;
const startBot = () => {
  let date = new Date();
  bot = new SlackBot(botConfig);
  bot.on('open', () => {
    console.log('Websocket connection is open. || ' + date);
    bot.postMessageToChannel('slackbot-test-2', 'Maintaining Bot lifecycle.');
  });
};
startBot();

// Maintaining bot connection in life
const life = new CronJob(
  '10 * * * *',
  () => {
    startBot();
  },
  null,
  true
);

/**
 * Test slackbot connection
 */
bot.on('start', () => {
  console.log('Web Connection maintained.');
});

/**
 * Error handler
 */
bot.on('error', (err) => {
  newError(err);
  console.log(err);
  startBot();
});

/**
 * In case of lost connection, reconnect
 */
bot.on('close', () => {
  console.log('Connection closed.');
  startBot();
});

/**
 * Message handler
 */
bot.on('message', (data) => {
  // Continue only in case of data type sent is message
  // Blocks message sent back by bot from being registered
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
     * not necessary in App goals
     */

    /**
     * Update bot usage
     */
    setBotCall();

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

          /**
           * Comparing channel id where message to bot was sent
           * with all channels
           * then sending response in apropriate channel
           */
          bot
            .getChannels()
            .then((results) => {
              results.channels.forEach((channelObj) => {
                // Respond to channel with same ID as sender
                if (data.channel === channelObj.id) {
                  bot.postMessageToChannel(
                    channelObj.name,
                    `\`\`\`Command: robot-about | Gives list of members on this channel.\`\`\``
                  );
                  temp_array.forEach((obj) => {
                    let temp_output = `\`\`\`Command: ${obj.trigger_word}, posts on channel: ${obj.channel}, active: ${obj.active}\`\`\``;
                    bot.postMessageToChannel(channelObj.name, temp_output);
                  });
                }
              });
            })
            .catch((err) => {
              newError(err);
              logger.logBotError(err);
            });
        })
        .catch((err) => {
          newError(err);
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
      let channelsArray = bot.getChannels()._value.channels;
      channelsArray.forEach((channel) => {
        /**
         * Comparing all channel ID's with channel ID where message was sent
         */
        if (channel.id == data.channel) {
          // Output
          let tempOutput = `Channel \`\`\`${channel.name}\`\`\` | Members: `;

          // Get all users from workspace
          bot.users.forEach((userObj) => {
            // Undefined users no longer are part of workspace
            // we need only users which belong to the channel we are requesting info from
            if (
              userObj.real_name !== undefined &&
              channel.members.includes(userObj.id)
            ) {
              tempOutput += ` \`\`\` ${userObj.real_name} \`\`\` `;
            }
          });
          bot.postMessageToChannel(channel.name, tempOutput);
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
           * Message must be sent to channel where message was triggered
           */
          if (message.channel.toLowerCase() !== 'private') {
            // In case of no found messages under sent command
            bot.postMessageToChannel(
              message.channel,
              decodeURIComponent(message.text)
            );
          } else {
            /**
             * If message should be sent to channel where it is triggered
             * as oppossed to predefined channel
             */
            bot.getChannels().then((results) => {
              results.channels.forEach((channelObj) => {
                if (data.channel === channelObj.id) {
                  bot.postMessageToChannel(
                    channelObj.name,
                    decodeURIComponent(message.text)
                  );
                }
              });
            });
          }
        })
        .catch((err) => {
          /**
           * We need response only in channel
           * where command is sent
           */
          newError(err);
          let channelsArray = bot.getChannels()._value.channels;
          channelsArray.forEach((channel) => {
            if (channel.id == data.channel) {
              bot.postMessageToChannel(
                channel.name,
                `No such command. Type '@Mean BMF help' to list all commands.`
              );
            }
          });
        });
    }
  }
});

module.exports = bot;
