let express = require("express");
let bcrypt = require("bcryptjs");
let router = express.Router();
let dbConnection = require("../config/db_conn");
let userSchemas = require("../schemas/user.schema");
//TODO: Criar middleware que verifica a cookie de sessão

// GET /
router.get("/", (req, res, next) => {
  res.render("login");
});

// POST /
router.post("/", async (req, res, next) => {
  //Validação de dados do frontend
  let validatedUser = userSchemas.userLoginSchema.validate(req.body);

  if (validatedUser.error) {
    res.status(400).json({
      message: validatedUser.error.details[0].context.label,
    });
    return;
  }

  validatedUser = validatedUser.value;

  //Verificar se a conta existe na base de dados, se sim, buscar o id do user e criar uma cookie de sessão no cliente com essa cookie encriptada
  try {
    let rows = await (
      await dbConnection
    ).query("SELECT user_id FROM User WHERE email=? AND password=?;", [
      validatedUser.email,
      validatedUser.password,
    ]);
    //TODO: atualizar para funcionar com hash da palavra passe (se calhar primeiro verificar email, se existir buscar a palavra passe desse email e fazer compare com o bcrypt com a inserida)

    //Caso não haja conta
    if (!rows || rows.length === 0) {
      console.log("[ERRO] Conta não existe");
      res.status(400).json({
        message:
          "Essa conta não existe, verifique se os dados estão bem inseridos",
      });
      return;
    }

    //TODO: Caso tudo esteja correto, criar cookie de sessão e redirecionar para dashboard
    // req.session.sessionCookie = rows[0].user_id; //Pseudocódigo
    console.log("[SUCESSO] Conta existe");
    res.status(200).json({
      message: "Conta existe, criar cookie de sessão e redirecionar",
    });
  } catch (err) {
    console.log(
      "[ERRO] Ocorreu algum erro a efetuar log-in\n" + err.stack || err.message
    );
    return res
      .status(500)
      .json({ message: "Ocorreu algum erro, tente novamente mais tarde" });
  }
});

// GET /registo
router.get("/registo", (req, res, next) => {
  res.render("registo");
});

// POST /registo
router.post("/registo", async (req, res, next) => {
  //Encriptação da palavra passe
  req.body.password = bcrypt.hashSync(req.body.password, 14);
  //Validação de dados do frontend
  let validatedUser = userSchemas.userRegisterSchema.validate(req.body);

  if (validatedUser.error) {
    res.status(400).json({
      message: validatedUser.error.details[0].context.label,
    });
    return;
  }

  validatedUser = validatedUser.value;

  try {
    let rows = await (
      await dbConnection
    ).query("SELECT email FROM User WHERE email=?", [validatedUser.email]);

    //Caso já exista uma conta com o e-mail inserido
    if (rows.length > 0) {
      res.status(409).json({
        message: "Este e-mail já está em uso",
      });
      return;
    }

    //Caso tudo esteja correto, inserir User
    let dbResponse = await (
      await dbConnection
    ).query("INSERT INTO User (nome, email, password) VALUES (?, ?, ?);", [
      validatedUser.nome,
      validatedUser.email,
      validatedUser.password,
    ]);

    if (dbResponse.affectedRows === 1) {
      return res.status(201).json({ message: "Conta criada com sucesso" });
    } else {
      return res
        .status(400)
        .json({ message: "Ocorreu algum erro, tente novamente mais tarde" });
    }
  } catch (err) {
    console.log(
      "[ERRO] Ocorreu algum erro a registar\n" + err.stack || err.message
    );
    return res
      .status(500)
      .json({ message: "Ocorreu algum erro, tente novamente mais tarde" });
  }
});

module.exports = router;
