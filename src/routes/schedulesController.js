/**
 * Loading dependencies
 */
const express = require('express');

/**
 * Load models
 */
const Schedules = require('../models/Schedules');

/// Load Sequelize model
const db = require('../methods/dbConnect');
const Sch = db.sch;

/**
 * Router middleware
 */
const router = express.Router();

/**
 * Get schedules
 */
router.get('/', (req, res) => {
  Sch.findAll()
    .then((results) => {
      let arr = [...results];
      let temp = [];
      arr.forEach((obj) => {
        temp.push(obj.dataValues);
      });

      temp.forEach((obj, index) => {
        let schedule = new Schedules(obj.title, obj.text, obj.cr_date);
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
  Sch.findOne({ where: { title: req.params.title } })
    .then((result) => {
      // Decode query return
      let temp = result.dataValues;
      let schedule = new Schedules(temp.title, temp.text, temp.cr_date);
      temp = schedule.decodeOutput();
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
    req.body.title,
    req.body.text,
    req.body.cr_date
  );

  // Checking input
  if (schedule.checkInsert()) {
    // Encoding input before sending query
    Sch.create(schedule.encodeInsert());
    res.status(201).send();
  } else {
    res.status(406).send();
  }
});

/**
 * Delete a schedule found by message title
 */
router.delete('/:title', (req, res) => {
  Sch.destroy({ where: { title: req.params.title } })
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
  const schedule = new Schedules(req.body.title, req.body.text);

  if (schedule.checkInsert()) {
    Sch.update(
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
});

module.exports = router;
