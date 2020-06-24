/**
 * Loading dependencies
 */
const express = require('express');

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
  queries.selectAll()
    .then(result => {
      res.end(result);
    })
    .catch(err => {
      console.log(err);
    });
});

/**
 * Get one schedule by message title
 */
router.get('/:title', (req, res) => {
  queries.selectOne('message', req.params.title)
    .then(result => {
      res.end(result);
    })
    .catch(err => {
      console.log(err);
    });
});

/**
 * Insert schedules
 */
router.post('/', (req, res) => {
  let obj = {
    message: req.body.message,
    run_date: req.body.run_date,
    repeat_range: req.body.repeat_range
  };
  queries.insertOne(obj);
  res.status(201).send();
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
router.post('/:title', (req, res) => {
  let obj = {
    message: req.body.message,
    run_date: req.body.run_date,
    repeat_range: req.body.repeat_range
  };
  queries.editOne('message', req.params.title, obj);
  res.status(201).send();
});

module.exports = router;