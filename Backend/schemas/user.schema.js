let Joi = require("joi");

//Schema para registo de uma conta
userRegisterSchema = Joi.object({
  nome: Joi.string().max(256).required().label("Nome inserido incorretamente"),
  email: Joi.string()
    .email()
    .max(320)
    .required()
    .label("Email inserido incorretamente"),
  password: Joi.string()
    .required()
    .max(256)
    .label("Password inserida incorretamente"),
});

//Schema para login de um user
userLoginSchema = Joi.object({
  email: Joi.string()
    .email()
    .max(320)
    .required()
    .label("Email inserido incorretamente"),
  password: Joi.string()
    .required()
    .max(256)
    .label("Password inserida incorretamente"),
});

module.exports = {
  userRegisterSchema: userRegisterSchema,
  userLoginSchema: userLoginSchema,
};
