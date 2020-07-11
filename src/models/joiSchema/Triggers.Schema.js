// Loading dependencies
const Joi = require('@hapi/joi');


const trigger_schema = Joi.object({
    message:Joi.string().alphanum().required(),
    trigger_word: Joi.string().required() ,
    channel: Joi.string().required(),
    active: Joi.bool(),
});

module.exports = trigger_schema ;
