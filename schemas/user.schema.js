let Joi = require("joi");

userSchema = Joi.object({
  nome: Joi.string().max(256).required().label("Nome inserido incorretamente"),
  email: Joi.string()
    .email()
    .max(320)
    .required()
    .label("Email inserido incorretamente"),
  password: Joi.string()
    .max(256)
    .required()
    .label("Password inserida incorretamente"),
});

module.exports = userSchema;
