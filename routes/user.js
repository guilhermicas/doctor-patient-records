let express = require("express");
let bcrypt = require("bcryptjs");
let router = express.Router();
let sessions = require("client-sessions");

//DB
let dbConnection = require("../config/db_conn");
let userSchemas = require("../schemas/user.schema");
let categoriaSchema = require("../schemas/categoria.schema");

//Middlewares
//Cookie
router.use(
  sessions({
    cookieName: "session",
    secret: process.env.COOKIE_SECRET_STR,
    duration: 1000 * 60 * 60 * 6, //Cookie ativa por 6 horas
    httpOnly: true, // Não deixa o browser conseguir aceder ás informações da cookie
    secure: true, // Cookie só existe através de https
  })
);

//Smart User Middlewares
router.use(async (req, res, next) => {
  //Se não existir cookie, continua, caso vá para
  if (!(req.session && req.session.uID)) {
    return next();
  }

  let rows = await (
    await dbConnection
  ).query("SELECT nome, email, created_at FROM User WHERE user_id=?;", [
    req.session.uID,
  ]);

  if (rows.length === 0) {
    return next();
  }

  //Cria req.user, que é necessário para verificar redirecionamento em caso de necessidade de login, na função loginRequired
  req.user = rows[0];
  next();
});

//Login-Required
function loginRequired(req, res, next) {
  if (!req.user && !req.session.uID) {
    return res.redirect("/");
  }
  next();
}

router.get("/logout", (req, res, next) => {
  req.user = null;
  req.session.uID = null;
  res.redirect("/");
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

//GET /categorias
router.get("/categorias", loginRequired, async (req, res, next) => {
  //Buscar categorias do user atual e devolver no frontend
  return res.render("categorias");
});

//GET /buscarCategorias
router.get("/buscarCategorias", loginRequired, async (req, res, next) => {
  //Buscar categorias do user atual e devolver no frontend
  try {
    let categorias = await (
      await dbConnection
    ).query("SELECT * FROM Categoria WHERE user_id=?;", [req.session.uID]);

    return res.status(200).json(categorias);
  } catch (err) {
    return res.status(500).render("categorias", {
      err:
        "Ocorreu algum erro a aceder ás suas categorias, experimente re-entrar na página",
    });
  }
});

// POST /categorias
router.post("/categorias", async (req, res, next) => {
  //Objeto para verificar categoria
  var categoria = {
    user_id: req.session.uID,
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    cor: req.body.cor,
  };

  //Validação de dados do frontend
  let categoriaValida = categoriaSchema.validate(categoria);

  if (categoriaValida.error) {
    res.status(400).json({
      message: categoriaValida.error.details[0].context.label,
    });
    return;
  }

  categoriaValida = categoriaValida.value;

  try {
    //Caso tudo esteja correto, inserir categoria
    let dbResponse = await (
      await dbConnection
    ).query(
      "INSERT INTO Categoria (user_id,titulo,descricao,cor) VALUES (?, ?, ?, ?);",
      [
        categoriaValida.user_id,
        categoriaValida.titulo,
        categoriaValida.descricao,
        categoriaValida.cor,
      ]
    );

    if (dbResponse.affectedRows === 1) {
      return res
        .status(201)
        .json({ message: "Categoria inserida com sucesso" });
    } else {
      return res
        .status(400)
        .json({ message: "Ocorreu algum erro, tente novamente mais tarde" });
    }
  } catch (err) {
    console.log(
      "[ERRO] Ocorreu algum erro a inserir categoria\n" + err.stack ||
        err.message
    );
    return res
      .status(500)
      .json({ message: "Ocorreu algum erro, tente novamente mais tarde" });
  }
});

//GET /pacientes
router.get("/pacientes", loginRequired, async (req, res, next) => {
  //Buscar pacientes do user atual e devolver no frontend
  try {
    let pacientes = await (
      await dbConnection
    ).query(
      "SELECT paciente_id, nome, categoria_id FROM Paciente WHERE user_id=?;",
      [req.session.uID]
    );

    return res.render("pacientes", {
      pacientes: pacientes,
    });
  } catch (err) {
    return res.render("pacientes", {
      err:
        "Ocorreu algum erro a aceder aos seus pacientes, experimente re-entrar na página",
    });
  }
});

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
    ).query("SELECT password, user_id FROM User WHERE email=?;", [
      validatedUser.email,
    ]);

    //Se existir conta verificar a palavra passe
    if (rows.length === 1) {
      //Verificação da password
      if (bcrypt.compareSync(validatedUser.password, rows[0].password)) {
        console.log("[SUCESSO] Conta existe");
        req.session.uID = rows[0].user_id; //Pseudocódigo
        console.log(req.session.uID);
        return res.redirect("/categorias");
      } else {
        console.log("[ERRO] Password Incorreta");
        res.status(400).json({
          message: "Palavra-passe incorreta",
        });
      }
    } else {
      console.log("[ERRO] E-mail não registado");
      res.status(400).json({
        message: "Não existe conta com esse e-mail",
      });
    }
  } catch (err) {
    console.log(
      "[ERRO] Ocorreu algum erro a efetuar log-in\n" + err.stack || err.message
    );
    return res
      .status(500)
      .json({ message: "Ocorreu algum erro, tente novamente mais tarde" });
  }
});

module.exports = router;
