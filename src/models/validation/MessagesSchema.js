// Loading dependencies
const JoiBase = require('@hapi/joi');
const JoiDate = require('@hapi/joi-date');
const Joi = JoiBase.extend(JoiDate); // extend Joi with Joi Date

const MessageSchema = Joi.object({
  title: Joi.string()
    .regex(/^\S+$/) // from the start to the end, everything has to be a None whitespace
    .min(5)
    .max(30)
    .required(),
  text: Joi.string().min(20).required(),
  cr_date: Joi.date()
    .format('DD/MM/YYYY') // set desired date format here
    .raw(),
});

module.exports = MessageSchema;
