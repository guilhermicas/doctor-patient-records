let express = require("express");
let app = express();
require("dotenv").config();

// Configuracao do servidor
const PORT = process.env.PORT || 3000;

// Configuracao da view engine (pug)
app.set("views", "./views");
app.set("view engine", "pug");

// Routes
userRoutes = require("./routes/user");
app.use(userRoutes);

app.listen(PORT, (err) => {
  if (err) return console.log("Nao foi possivel ouvir na porta" + PORT);
  console.log("Servidor a ouvir em http://localhost:" + PORT);
});
