/**
 * Load dependencies
 */
const db = require('../config/dbConfig');
const { QueryTypes } = require('sequelize');
const logger = require('../config/logger');

/**
 * Load helpers and callbacks
 */
const { decodeOutput } = require('./helper');

/**
 * Load Task module
 */
const Task = require('../models/misc/Task');

/**
 * Tasks object
 */
let cronTasks = {
  tasks: {},
  // Set all tasks
  setTasks() {
    const self = this;
    db.query(
      `SELECT messages.text AS text, schedules.message AS message, schedules.run_date AS run_date, schedules.active AS active, schedules.repeat_range AS repeat_range FROM messages JOIN schedules ON messages.title=schedules.message`,
      {
        type: QueryTypes.SELECT,
      }
    )
      .then((messages) => {
        // Create a task from each query row
        messages.forEach((tempObj) => {
          // Decode before outputing
          tempObj = decodeOutput(tempObj);

          // Check if tasks exists
          if (self.getLength() == 0) {
            // Initialize new tasks
            self.tasks[tempObj[0].message] = new Task(tempObj[0]);
          } else {
            // Check if a specific task exists
            Object.keys(self.tasks).forEach((key) => {
              // Avoid initializing old tasks
              if (key != tempObj[0].message)
                self.tasks[tempObj[0].message] = new Task(tempObj[0]);
            });
          }
        });
      })
      .catch((err) => {
        logger.logBotError(err);
      });
  },
  getTasks() {
    Object.keys(this.tasks).forEach((key) => {
      console.log(key);
    });
  },
  getLength() {
    let size = 0;
    Object.keys(this.tasks).forEach((key) => {
      size++;
    });
    return size;
  },
};

module.exports = cronTasks;
