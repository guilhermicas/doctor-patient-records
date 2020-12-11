let express = require("express");
let app = express();
let path = require("path");
require("dotenv").config();

// Configuracao do servidor
const PORT = process.env.PORT || 3000;

// Handling de request
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Servir ficheiros estáticos para frontend
app.use("/public", express.static(path.join(__dirname, "public")));

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
