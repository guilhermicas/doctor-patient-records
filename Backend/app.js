let express = require("express");
let app = express();
let cors = require("cors");
require("dotenv").config();

// Configuracao do servidor
const PORT = process.env.PORT || 3000;

// Handling de request
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configuração CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Routes
userRoutes = require("./routes/user");

app.use(userRoutes);

app.listen(PORT, (err) => {
  if (err) return console.log("Nao foi possivel ouvir na porta" + PORT);
  console.log("Servidor a ouvir em http://localhost:" + PORT);
});
