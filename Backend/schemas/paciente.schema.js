let Joi = require("joi");

//Schema para registo de uma conta
pacienteSchema = Joi.object({
  user_id: Joi.number()
    .required()
    .label("Necessita de um utilizador associado"),
  categoria_id: Joi.number(),
  nome: Joi.string()
    .max(256)
    .required()
    .label("Necessita de dar um nome ao paciente"),
  descricao: Joi.string().max(1024),
});

module.exports = pacienteSchema;
