let express = require("express");
let router = express.Router();
let dbConnection = require("../config/db_conn");
let userSchema = require("../schemas/user.schema");

// GET /
router.get("/", (req, res, next) => {
  res.render("login");
});

// POST /
router.post("/", (req, res, next) => {});

// GET /registo
router.get("/registo", (req, res, next) => {
  res.render("registo");
});

// POST /registo
router.post("/registo", async (req, res, next) => {
  let validatedUser = userSchema.validate(req.body);

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
