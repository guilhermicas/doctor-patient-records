let express = require("express");
let router = express.Router();

//GET /
router.get("/", (req, res, next) => {
  res.render("index");
});

//GET /login
router.get("/login", (req, res, next) => {
  res.render("login");
});

//GET /registo
router.get("/registo", (req, res, next) => {
  res.render("registo");
});

//GET /dashboard
router.get("/dashboard", (req, res, next) => {
  res.render("dashboard");
});

module.exports = router;
