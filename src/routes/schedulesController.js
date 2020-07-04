/**
 * Loading dependencies
 */
const express = require('express');

/**
 * Load models
 */
const Schedules = require('../models/Schedules');

// Load Query model
const Queries = require('../models/Queries');
let queries = new Queries('schedules');

/**
 * Router middleware
 */
const router = express.Router();

/**
 * Get schedules
 */
router.get('/', (req, res) => {
  queries
    .selectAll()
    .then((result) => {
      let temp = JSON.parse(result);

      temp.forEach((obj, index) => {
        const schedule = new Schedules(
          obj.message,
          obj.run_date,
          obj.repeat_range
        );
        // Decode query return
        temp[index] = schedule.decodeOutput();
      });

      temp = JSON.stringify(temp);

      res.status(200);
      res.end(temp);
    })
    .catch((err) => {
      console.log(err);
    });
});

/**
 * Get one schedule by message title
 */
router.get('/:title', (req, res) => {
  queries
    .selectOne('message', req.params.title)
    .then((result) => {
      // Decode query return
      let temp = JSON.parse(result);
      let schedule = new Schedules(
        temp[0].message,
        temp[0].run_date,
        temp[0].repeat_range
      );
      temp[0] = schedule.decodeOutput();
      temp = JSON.stringify(temp);

      res.status(200);
      res.end(temp);
    })
    .catch((err) => {
      console.log(err);
    });
});

/**
 * Insert schedules
 */
router.post('/', (req, res) => {
  const schedule = new Schedules(
    req.body.message,
    req.body.run_date,
    req.body.repeat_range
  );

  // Checking input
  if (schedule.checkInsert()) {
    // Encode before sending
    queries.insertOne(schedule.encodeInsert());
    res.status(201).send();
  } else {
    res.status(406).send();
  }
});

/**
 * Delete a schedule found by message title
 */
router.delete('/:title', (req, res) => {
  queries.deleteOne('message', req.params.title);
  res.status(202).send();
});

/**
 * Edit schedule found by message title
 */
router.post('/:message', (req, res) => {
  const schedule = new Schedules(
    req.body.message,
    req.body.run_date,
    req.body.repeat_range
  );

  if (schedule.checkInsert()) {
    queries.editOne('message', req.params.message, schedule.encodeInsert());
    res.status(402).send();
  } else {
    res.status(406).send();
  }
});

module.exports = router;
