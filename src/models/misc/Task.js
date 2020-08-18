/**
 * Load modules
 */
const SlackBot = require('slackbots');
const CronJob = require('cron').CronJob;
const CronTime = require('cron').CronTime;

/**
 * Logger configuration
 */
const logger = require('../../config/logger');

/**
 * Load secret variables
 */
const { botConfig } = require('../../../config');

/**
 * Load schedules model
 */
const Schedules = require('../Schedules');

/**
 * Configure and initialize bot
 */
const bot = new SlackBot(botConfig);

/**
 * Initialize class for Tasks
 */
class Task {
  constructor(tempObj) {
    this.message = tempObj.message;
    this.text = tempObj.text;
    this.run_date = tempObj.run_date;
    this.repeat_range = tempObj.repeat_range;

    // active variable is a string, we need boolean
    this.active = () => {
      if (tempObj.active === 'true') {
        return true;
      } else if (tempObj === 'false') {
        return false;
      }
    };

    // date variables
    // day
    this.day = 0;
    this.initDay = () => {
      let temp = this.run_date.split('/');
      return parseInt(temp[0]);
    };
    // month
    this.month = 0;
    this.initMonth = () => {
      let temp = this.run_date.split('/');
      return parseInt(temp[1]) - 1;
    };
    // year
    this.year = 0;
    this.initYear = () => {
      let temp = this.run_date.split('/');
      return parseInt(temp[2]);
    };

    // Update date
    this.updateDate = (x) => {
      let temp, tempDate;

      // Repeat ranges 1 for 1 day, 7 for 7 days
      // 30 for 1 month

      /**
       * For testing when using first tick
       * Turn off when changing to real first tick
       */
      // this.initDay();
      // this.initMonth();
      // this.initYear();
      // /////////////////

      // Task repeat every 1 or 7 days
      if (x === '1' || x === '7') {
        temp = this.day + parseInt(x);
        // We want for Date class to process date changes automatically
        tempDate = new Date(this.year, this.month - 1, temp);

        /**
         * Update local storage
         */
        this.day = tempDate.getDate();
        this.month = tempDate.getMonth();
        this.year = tempDate.getFullYear();

        /**
         * Return for use
         */
        return [
          tempDate.getDate(),
          tempDate.getMonth(),
          tempDate.getFullYear(),
        ];
      }
      // Task repeat every month
      if (x === '30') {
        temp = this.month + 1;
        tempDate = new Date(this.year, temp - 1, this.day);

        /**
         * Update local storage
         */
        this.day = tempDate.getDate();
        this.month = tempDate.getMonth();
        this.year = tempDate.getFullYear();

        /**
         * Return for use
         */
        return [
          tempDate.getDate(),
          tempDate.getMonth(),
          tempDate.getFullYear(),
        ];
      }
    };

    // Send message to Slack
    this.sendMessage = () => {
      // // Testin on channel slackbot-test
      bot.postMessageToChannel('slackbot-test', this.text);
      // Production;
      // bot.postMessageToChannel('general', this.text);
    };

    this.job = new CronJob(
      // '* * * * *', // Cron task for every min, for tests
      `0 12 ${this.initDay()} ${this.initMonth()} *`,
      () => {
        // On tick
        const self = this;
        // Update one time tasks to change active to false
        if (this.repeat_range === '0') {
          Schedules.update(
            { active: 'false' },
            { where: { message: self.message } }
          )
            .then(() => {
              this.job.stop();
            })
            .catch((err) => {
              logger.logSQLError(err);
            });
        } else {
          // Update task tick date
          const tempArray = self.updateDate(self.repeat_range);
          const tempString = `40 11 ${tempArray[0]} ${tempArray[1]} *`;
          self.job.setTime(new CronTime(tempString));
          // Send message to Slack
          self.sendMessage();
        }
      },
      // Message completed
      null,
      // True or False, defines if task is started after creation
      this.active(),
      'Europe/Sarajevo'
    );
  }
}

module.exports = Task;
