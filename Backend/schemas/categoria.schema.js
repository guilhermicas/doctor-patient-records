let Joi = require("joi");

//Schema para registo de uma categoria
categoriaSchema = Joi.object({
  user_id: Joi.number()
    .required()
    .label("Tem de fazer referencia ao id do user"),
  titulo: Joi.string().max(120).required().label("Tem de inserir um titulo"),
  descricao: Joi.string()
    .max(256)
    .optional()
    .label("Descrição tem um limite de 256 caracteres"),
  cor: Joi.string()
    .max(7)
    .optional()
    .label("Tem de introduzir um valor de cor válido"),
});

module.exports = categoriaSchema;
