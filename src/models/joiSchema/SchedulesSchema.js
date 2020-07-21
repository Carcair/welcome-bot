// Loading dependencies
const JoiBase = require('@hapi/joi');
const JoiDate = require('@hapi/joi-date');
const Joi = JoiBase.extend(JoiDate); // extend Joi with Joi Date

const ScheduleSchema = Joi.object({
  message: Joi.string().required(),
  run_date: Joi.date()
    .format('DD/MM/YYYY') // set desired date format here
    //  .min("now") // minimum time is "now" or newer
    .required()
    .raw(),
  active: Joi.string().required(),
  repeat_range: Joi.string(),
});

module.exports = ScheduleSchema;
