// Loading dependencies
const JoiBase = require('@hapi/joi');  
const JoiDate = require('@hapi/joi-date');
const Joi = JoiBase.extend(JoiDate); // extend Joi with Joi Date

const scheduleSchema = Joi.object({
    message:Joi.string().alphanum().required(),
    run_date: Joi.date()
    .format("DD/MM/YYYY") // set desired date format here 
    .min("now") // min time is now or newer
    .required() 
    .raw(), 
    repeat_range: Joi.string(),
});

module.exports = scheduleSchema ;
