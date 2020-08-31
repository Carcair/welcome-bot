/**
 * Loading logger configuration
 */
const logger = require('../config/logger');

/**
 * Load message model and validation schema
 */
const Messages = require('../models/schemas/Messages');
const MessageSchema = require('../models/validation/MessagesSchema');

/**
 * Load helpers
 */
const {
  encodeInsert,
  decodeOutput,
  setValueDeleted,
  newError,
} = require('../methods/helper');
const { setReportCount } = require('../handlers/reportHandler');

/**
 * Get messages
 */
exports.getMessages = (req, res) => {
  Messages.findAll({ raw: true })
    .then((messages) => {
      // Decode output
      messages = decodeOutput(messages);
      res.status(200).end(JSON.stringify(messages));
    })
    .catch((err) => {
      newError(err);
      logger.logSQLError(err);
      res.status(400).end('SQL Error');
    });
};

/**
 * Get one message depending on title
 */
exports.getOneMessage = (req, res) => {
  let title = encodeURIComponent(req.params.title);
  Messages.findOne({
    where: { title },
    raw: true,
  })
    .then((message) => {
      // Check if there is existing title

      if (message !== null) {
        // Decode output before sending
        message = decodeOutput(message);
        res.status(200).end(JSON.stringify(message));
      } else {
        res.status(404).end('Not Found');
      }
    })
    .catch((err) => {
      newError(err);
      logger.logSQLError(err);
      res.status(400).end('SQL Error');
    });
};

/**
 * Insert new message
 */
exports.insertNewMessage = (req, res) => {
  let temp_obj = {
    title: req.body.title,
    text: req.body.text,
    cr_date: req.body.cr_date,
  };

  const { error, value } = MessageSchema.validate(temp_obj);

  if (error) {
    res.status(417).end('Validation Error');
  } else if (value) {
    // Encode input
    temp_obj = encodeInsert(temp_obj);

    Messages.create(temp_obj)
      .then(() => {
        logger.logInput(JSON.stringify(temp_obj), 'message');
        setReportCount('Messages count', 'messages');
        res.status(201).end('Created');
      })
      .catch((err) => {
        newError(err);
        logger.logSQLError(err);
        res.status(400).end('SQL Error');
      });
  }
};

/**
 * Delete a message
 */
exports.deleteMessage = (req, res) => {
  // Encode title before checking
  let title = encodeURIComponent(req.params.title);

  Messages.destroy({ where: { title } })
    .then((deleted) => {
      if (deleted !== 0) {
        //checking if the "result" is diffrent then 0 and responding accordingly
        logger.logDelete(req.params.title, 'message');
        setReportCount('Messages count', 'messages');
        setValueDeleted('Messages deleted');
        res.status(200).end('Deleted');
      } else {
        res.status(404).end('Not Found');
      }
    })
    .catch((err) => {
      newError(err);
      logger.logSQLError(err);
      res.status(400).end('SQL Error');
    });
};

/**
 * Edit a message
 */
exports.editMessage = (req, res) => {
  const temp_obj = {
    title: req.body.title,
    text: req.body.text,
  };

  const title = encodeURIComponent(req.params.title);

  // Validate obj according to schema
  const { error, value } = MessageSchema.validate(temp_obj);

  if (error) {
    res.status(417).end('Validation Error');
  } else if (value) {
    // Encode insert
    Messages.update(encodeInsert(temp_obj), { where: { title } })
      .then((updated) => {
        if (updated[0] !== 0) {
          //checking if the "result" is diffrent then 0 and responding accordingly
          logger.logUpdate(
            JSON.stringify(temp_obj),
            req.params.title,
            'message'
          );
          res.status(201).end('Edited');
        } else {
          res.status(404).end('Not Found');
        }
      })
      .catch((err) => {
        newError(err);
        logger.logSQLError(err);
        res.status(400).end('SQL Error');
      });
  }
};
