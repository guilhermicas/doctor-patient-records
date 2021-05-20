let express = require("express");
let app = express();
let path = require("path");
require("dotenv").config();

// Configuracao do servidor
const PORT = process.env.PORT || 3000;

// Handling de request
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
userRoutes = require("./routes/user");

app.use(userRoutes);

app.listen(PORT, (err) => {
  if (err) return console.log("Nao foi possivel ouvir na porta" + PORT);
  console.log("Servidor a ouvir em http://localhost:" + PORT);
});
