let express = require("express");
let app = express();
require("dotenv").config();

// Configuracao do servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  if (err) return console.log("Nao foi possivel ouvir na porta" + PORT);
  console.log("Servidor a ouvir em http://localhost:" + PORT);
});
