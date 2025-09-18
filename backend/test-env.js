require("dotenv").config();

console.log("Caminho atual:", __dirname);
console.log("Conteúdo do .env:", process.env.GOOGLE_CREDENTIALS ? "Carregado ✅" : "undefined ❌");
s