// Loading dependencies
const Joi = require('@hapi/joi');

const UsersSchema = Joi.object({
  username: Joi.string().min(5).max(15).required(),
  pass: Joi.string().min(5).max(15).required(),
}).with('username', 'pass');

module.exports = UsersSchema;
