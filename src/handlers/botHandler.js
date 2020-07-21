const SlackBot = require('slackbots');
const helper = require('../methods/helper');
const cron = require('node-cron');

const bot = new SlackBot({
  token: 'xoxb-846778013510-1222657554999-FBOzVZeDfFhgND3QYjzOjhL3',
  name: 'Welcome Bot',
});

/**
 * Test slackbot connection
 * general chat can be changed to whatever chat bot joins
 * then we can use it as reusable
 */
// bot.on('start', () => {
//   // var params = {};

//   // Post a message to general channel
//   bot.postMessageToChannel(
//     'general',
//     'What does Marsellus Wallace look like?!'
//   );
// });

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
      helper
        .getTriggers()
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
      helper
        .getMessage(temp[1])
        .then((message) => {
          bot.postMessageToChannel('slackbot-test', message.text);
        })
        .catch((err) => {
          bot.postMessageToChannel('slackbot-test', err);
        });
      return;
    }
  }
});

let task = cron.schedule(
  '00 45 14 * * 0-6',
  () => {
    bot.postMessageToChannel('slackbot-test', 'Scheduled message test');
  },
  { scheduled: true }
);
module.exports = bot;
