let express = require("express");
let bcrypt = require("bcryptjs");
let router = express.Router();
let sessions = require("client-sessions");

//DB
let dbConnection = require("../config/db_conn");
let userSchemas = require("../schemas/user.schema");
let pacienteSchema = require("../schemas/paciente.schema");
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
    return res.status(401).end();
    //return res.redirect("/");
  }
  next();
}

//Verifica se o paciente passado pelos parametros no url é do user autenticado
async function verificarPermissaoPaciente(req, res, next) {
  let idPaciente = req.params.idPaciente;

  let paciente = await (
    await dbConnection
  ).query(
    "SELECT paciente_id, nome, descricao, created_at FROM Paciente WHERE user_id=? AND paciente_id=?",
    [req.session.uID, idPaciente]
  );

  if (paciente.length === 0) {
    //TODO: frontend 403 paciente nao pertence ao utilizador
    return res.status(403).end();
  }

  res.locals.paciente = paciente;
  return next();
}

router.get("/logout", (req, res, next) => {
  console.log("attempting to log out");
  req.user = null;
  req.session.uID = null;
  return res.status(200).end();
});

// POST /registo
router.post("/registo", async (req, res, next) => {
  //Encriptação da palavra passe
  req.body.password = bcrypt.hashSync(req.body.password, 14);
  //Validação de dados do frontend
  let validatedUser = userSchemas.userRegisterSchema.validate(req.body);

  if (validatedUser.error) {
    res.status(400).send({
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
      res.status(409).send({
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
      return res.status(201).send({ message: "Conta criada com sucesso" });
    } else {
      return res
        .status(400)
        .send({ message: "Ocorreu algum erro, tente novamente mais tarde" });
    }
  } catch (err) {
    console.log(
      "[ERRO] Ocorreu algum erro a registar\n" + err.stack || err.message
    );
    return res
      .status(500)
      .send({ message: "Ocorreu algum erro, tente novamente mais tarde" });
  }
});

//GET /categorias
router.get("/categorias", loginRequired, async (req, res, next) => {
  //Buscar categorias do user atual e devolver no frontend
  try {
    let categorias = await (
      await dbConnection
    ).query("SELECT * FROM Categoria WHERE user_id=?;", [req.session.uID]);

    return res.status(200).send(categorias);
  } catch (err) {
    //TODO: frontend renderizar corretamente o erro
    return res.status(500).end();
  }
});

// POST /categorias
router.post("/categorias", loginRequired, async (req, res, next) => {
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
    res.status(400).send({
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
        .send({ message: "Categoria inserida com sucesso" });
    } else {
      return res
        .status(400)
        .send({ message: "Ocorreu algum erro, tente novamente mais tarde" });
    }
  } catch (err) {
    console.log(
      "[ERRO] Ocorreu algum erro a inserir categoria\n" + err.stack ||
        err.message
    );
    return res
      .status(500)
      .send({ message: "Ocorreu algum erro, tente novamente mais tarde" });
  }
});

// GET /pacientes
router.get("/pacientes", loginRequired, async (req, res, next) => {
  try {
    let pacientes = await (
      await dbConnection
    ).query(
      "SELECT p.paciente_id, p.nome, c.titulo, p.created_at FROM Paciente as p, Categoria as c WHERE p.user_id=? AND p.categoria_id = c.categoria_id",
      [req.session.uID]
    );
    //TODO: por no frontend o paciente_id associado á row da table

    //TODO: devolver JSON de pacientes para frontend
    return res.send(pacientes);
  } catch (err) {
    console.log(err);
    //TODO: frontend interpretar corretamente status 500
    return res.status(500).end();
  }
});

// POST /paciente
//router.post("/paciente", loginRequired, async (req, res, next) => {
//let validatedPaciente = pacienteSchema.validate(req.body);

//if (validatedPaciente.error) {
//res.status(400).send({
//message: validatedPaciente.error.details[0].context.label,
//});
//return;
//}

//validatedPaciente = validatedPaciente.value;

//Ajusta a query string caso haja ou não categoria_id para associar o paciente
//cat = validatedPaciente.categoria_id ? true : false;
//if (cat)
//queryString = "INSERT INTO Paciente (user_id, " + cat ? "categoria_id, " + " password) VALUES (?,"+ cat ? "?," : "" +" ?);"

//Caso tudo esteja correto, inserir Paciente
//let dbResponse = await (
//await dbConnection
//).query(queryString, [
//validatedUser.nome,
//validatedUser.email,
//validatedUser.password,
//]);

//if (dbResponse.affectedRows === 1) {
//return res.status(201).send({ message: "Conta criada com sucesso" });
//} else {
//return res
//.status(400)
//.send({ message: "Ocorreu algum erro, tente novamente mais tarde" });
//}
//} catch (err) {
//console.log(
//"[ERRO] Ocorreu algum erro a registar\n" + err.stack || err.message
//);
//return res
//.status(500)
//.send({ message: "Ocorreu algum erro, tente novamente mais tarde" });
//}
//});

// GET /pacientes/c/:idCategoria
router.get(
  "/pacientes/c/:idCategoria",
  loginRequired,
  async (req, res, next) => {
    try {
      //Verificar se o idCategoria é o do user autenticado
      let idCategoria = req.params.idCategoria;

      let qtdCategorias = await (
        await dbConnection
      ).query(
        "SELECT count(*) AS qtdCat FROM Categoria WHERE categoria_id=? AND user_id=?",
        [idCategoria, req.session.uID]
      );

      if (qtdCategorias[0].qtdCat == 0) {
        //TODO: frontend interpretar corretamente status 401
        return res.status(401).end();
      }

      let pacientes = await (
        await dbConnection
      ).query(
        "SELECT p.paciente_id, p.nome, c.titulo, p.created_at FROM Paciente as p, Categoria as c WHERE p.user_id=? AND c.categoria_id = p.categoria_id AND p.categoria_id = ?",
        [req.session.uID, idCategoria]
      );

      //TODO:JSON frontend
      return res.send(pacientes);
    } catch (err) {
      console.log(err);
      return res.status(500).end();
    }
  }
);

// GET /paciente/:idPaciente
router.get(
  "/paciente/:idPaciente",
  loginRequired,
  verificarPermissaoPaciente,
  async (req, res, next) => {
    let paciente = res.locals.paciente[0];
    return res.send(paciente);
  }
);

// DELETE /paciente/:idPaciente
router.delete(
  "/paciente/:idPaciente",
  loginRequired,
  verificarPermissaoPaciente,
  async (req, res, next) => {
    //Paciente a eliminar
    let idPaciente = res.locals.paciente[0].paciente_id;

    //Eliminar o paciente com o id
    let { err, resultado } = await (
      await dbConnection
    ).query("DELETE FROM Paciente WHERE paciente_id=?;", [idPaciente]);

    if (err) {
      return res.status(500).send({
        err:
          "Ocorreu algum erro a eliminar o paciente, tente novamente mais tarde",
      });
    } else {
      return res.status(200).send({
        msg: "Paciente eliminado com sucesso",
      });
    }
  }
);

// POST /
router.post("/", async (req, res, next) => {
  //LOGIN
  //Validação de dados do frontend
  let validatedUser = userSchemas.userLoginSchema.validate(req.body);

  if (validatedUser.error) {
    return res.status(400).send({
      message: validatedUser.error.details[0].context.label,
    });
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
        return res.status(200).end();
      } else {
        console.log("[ERRO] Password Incorreta");
        res.status(400).send({
          message: "Palavra-passe incorreta",
        });
      }
    } else {
      console.log("[ERRO] E-mail não registado");
      res.status(400).send({
        message: "Não existe conta com esse e-mail",
      });
    }
  } catch (err) {
    console.log(
      "[ERRO] Ocorreu algum erro a efetuar log-in\n" + err.stack || err.message
    );
    return res
      .status(500)
      .send({ message: "Ocorreu algum erro, tente novamente mais tarde" });
  }
});

module.exports = router;
