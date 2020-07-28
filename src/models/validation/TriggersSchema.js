// Loading dependencies
const Joi = require('@hapi/joi');

const TriggerSchema = Joi.object({
  message: Joi.string().required(),
  trigger_word: Joi.string()
    .regex(/^\S+$/) // from the start to the end, everything has to be a None whitespace
    .required(),
  channel: Joi.string().required(),
  active: Joi.bool(),
});

module.exports = TriggerSchema;
