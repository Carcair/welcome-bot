/**
 * Loading dependencies
 */
const express = require('express');

/**
 * Load Messages models
 */
const Messages = require('../models/Messages');

/**
 * Using router middleware
 */
const router = express.Router();

/**
 * Get all messages
 */
router.get('/', (req, res) => {
  Messages.findAll()
    .then((messages) => {
      res.status(200).end(JSON.stringify(messages));
    })
    .catch((err) => res.status(406).end(err.parent.sqlMessage));
});

/**
 * Get one message by title
 */
router.get('/:title', (req, res) => {
  Messages.findOne({
    where: {
      title: req.params.title,
    }
  })
    .then((post) => {
      res.status(200).end(JSON.stringify(post));
    })
    .catch((err) => res.status(406).end(err.parent.sqlMessage));
});

/**
 * Insert new message
 */
router.post('/', (req, res) => {
  Messages.create({
    title: req.body.title,
    text: req.body.text,
    cr_date: req.body.cr_date,
  })
    .then(() => res.status(201).end())
    .catch((err) => res.status(406).end(err.parent.sqlMessage));
});

/**
 * Delete a message
 */
router.delete('/:title', (req, res) => {
  Messages.destroy({
    where: { title: req.params.title },
  })
    .then(() => res.status(202).end())
    .catch((err) => res.status(406).end(err.parent.sqlMessage));
});

/**
 * Edit a message
 */
router.post('/:title', (req, res) => {
  Messages.update(
    {
      title: req.body.title,
      text: req.body.text,
    },
    { where: { title: req.params.title } }
  )
    .then(() => res.status(201).end())
    .catch((err) => res.status(406).end(err.parent.sqlMessage));
});

module.exports = router;