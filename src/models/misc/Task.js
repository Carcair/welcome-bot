/**
 * Load modules
 */
const CronJob = require('cron').CronJob;
const CronTime = require('cron').CronTime;

/**
 * Logger configurations
 */
const logger = require('../../config/logger');
const { NODE_ENV } = require('../../../config');

/**
 * Load cron tasks
 */
const cronTasks = require('../../methods/cronTasks');

/**
 * Load schedules model
 */
const Schedules = require('../schemas/Schedules');

/**
 * Configure and initialize bot
 */
const bot = require('../../handlers/botHandler');

/**
 * Load helper methods
 */
const { newError } = require('../../methods/helper');

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
      this.day = parseInt(temp[0]);
      return parseInt(temp[0]);
    };
    // month
    this.month = 0;
    this.initMonth = () => {
      let temp = this.run_date.split('/');
      this.month = parseInt(temp[1] - 1);
      this.initYear();
      return parseInt(temp[1]) - 1;
    };
    // year
    this.year = 0;
    this.initYear = () => {
      let temp = this.run_date.split('/');
      this.year = parseInt(temp[2]);
      return parseInt(temp[2]);
    };

    // Update date
    this.updateDate = (x) => {
      let temp, tempDate;

      // Task repeat every 1 or 7 days
      if (x === '1' || x === '7') {
        temp = this.day + parseInt(x);
        // We want for Date class to process date changes automatically
        tempDate = new Date(this.year, this.month, temp);

        /**
         * Update object variables
         */
        this.day = tempDate.getDate();
        this.month = tempDate.getMonth();
        this.year = tempDate.getFullYear();
      }
      // Task repeat every month
      if (x === '30') {
        temp = this.month + 1;
        // Date class processing new date changes
        tempDate = new Date(this.year, temp, this.day);

        /**
         * Update object variables
         */
        this.day = tempDate.getDate();
        this.month = tempDate.getMonth();
        this.year = tempDate.getFullYear();
      }
    };

    // Send message to Slack
    this.sendMessage = () => {
      // Testing on channel slackbot-test
      if (NODE_ENV === 'development')
        bot.postMessageToChannel('slackbot-test', this.text);

      // Production;
      if (NODE_ENV === 'production')
        bot.postMessageToChannel('general', this.text);
    };

    this.job = new CronJob(
      // '* * * * *', // Cron task for every min, for tests
      `0 10 ${this.initDay()} ${this.initMonth()} *`,
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
              newError(err);
              logger.logSQLError(err);
            });
        } else {
          // Update task tick date
          this.updateDate(self.repeat_range);
          let tempMonth = 0;
          this.run_date = `${this.day}/${this.month}/${this.year}`;

          // Prepare month for DB entry
          // In DB 1-12, in BE 0-11
          if (this.month == 11) tempMonth = 0;
          else tempMonth = this.month + 1;

          // We need encoded date string to update DB table
          let nextDate = encodeURIComponent(
            `${this.day}/${tempMonth}/${this.year}`
          );

          // Update next run_date in DB
          Schedules.update(
            { run_date: nextDate },
            { where: { message: self.message } }
          )
            .then(() => {
              // Set new crontime for this task
              const tempString = `0 10 ${self.day} ${self.month} *`;
              self.job.setTime(new CronTime(tempString));
              self.sendMessage();
            })
            .catch((err) => {
              newError(err);
            });
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
