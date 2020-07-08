/**
 * Loading dependencies
 */
const express = require('express');

/**
 * Load Schedules models
 */
const Schedules = require('../models/Schedules');


/**
 * Router middleware
 */
const router = express.Router();

/**
 * Get all schedules
 */
router.get('/', (req, res) => {
  Schedules.findAll()
    .then((results) => {
      res.status(200);
      res.end(JSON.stringify(results));
    })
    .catch((err) => {
      console.log(err);
    });
});

/**
 * Get one schedule by message title
 */
router.get('/:title', (req, res) => {
  Schedules.findOne({ where: { message: req.params.title } })
    .then((result) => {
      res.status(200);
      res.end(JSON.stringify(result));
    })
    .catch((err) => {
      console.log(err);
    });
});

/**
 * Insert schedules
 */
router.post('/', (req, res) => {
  Schedules.create({
    message: req.body.message,
    run_date:  req.body.run_date,
    repeat_range: req.body.repeat_range,
   })
   .then(()=>{   res.status(201).send();  })
   .catch(()=>{  res.status(406).send();  })
   /*
  // Checking input
  if (schedule.checkInsert()) {
    // Encoding input before sending query
    Schedules.create(schedule.encodeInsert());
    res.status(201).send();
  } else {
    res.status(406).send();
  }
*/
});

/**
 * Delete a schedule found by message title
 */
router.delete('/:title', (req, res) => {
  Schedules.destroy({ where: { message: req.params.title } })
    .then(() => {
      res.status(202).send();
    })
    .catch((err) => {
      throw err;
    });
});

/**
 * Edit schedule found by message title
 */
router.post('/:message', (req, res) => {
  Schedules.update(
    {
      message: req.body.message,
      run_date:  req.body.run_date,
      repeat_range: req.body.repeat_range
    },
    { where: { message: req.params.message } }
  )
    .then(() => res.status(201).end())
    .catch((err) => res.status(406).end(err));


/*
  if (schedule.checkInsert()) {
    Schedules.update(
      // values to update
      schedule.encodeInsert(),
      {
        where: { title: req.params.title },
      }
    )
      .then(() => {
        res.status(202).send();
      })
      .catch((err) => {
        res.status(404).send();
      });
  } else {
    res.status(406).send();
  }
  */
});

module.exports = router;