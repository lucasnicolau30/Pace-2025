// const fs = require("fs");
// const path = require("path");
// const express = require("express");
// const { google } = require("googleapis");
// const favicon = require("serve-favicon");

// const app = express();

// // Middlewares
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(favicon(path.join(__dirname, "../public/img/favicon.ico")));
// app.use(express.static(path.join(__dirname, "../public")));

// // Caminho para credenciais
// let credentialsPath;

// // Se estiver na Render, usar a variável de ambiente GOOGLE_CREDENTIALS_PATH
// if (process.env.GOOGLE_CREDENTIALS_PATH) {
//   credentialsPath = process.env.GOOGLE_CREDENTIALS_PATH;
// } else {
//   // Rodando local, usa o credentials.json dentro do backend
//   credentialsPath = path.join(__dirname, "credentials.json");
// }

// // Ler credenciais
// if (!fs.existsSync(credentialsPath)) {
//   console.error(`❌ Arquivo de credenciais não encontrado: ${credentialsPath}`);
//   process.exit(1);
// }

// const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));
// console.log("🟢 Credenciais carregadas para:", credentials.client_email);

// // Rota principal
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../public/index.html"));
// });

// // Recebe dados do formulário e envia para Google Sheets
// app.post("/", async (req, res) => {
//   try {
//     console.log("📥 Recebido do formulário:", req.body);

//     const { nome, idade, sexo, peso, altura, pressao, temperatura } = req.body;

//     const auth = new google.auth.GoogleAuth({
//       credentials,
//       scopes: "https://www.googleapis.com/auth/spreadsheets",
//     });

//     const client = await auth.getClient();
//     const googleSheets = google.sheets({ version: "v4", auth: client });

//     const spreadsheetId = "1BxN1B1u2p5VvJyW_7hbgFafWddlRZk6sD55N8Y6n97M";

//     await googleSheets.spreadsheets.values.append({
//       spreadsheetId,
//       range: "Pace-Dados!A:G",
//       valueInputOption: "USER_ENTERED",
//       resource: {
//         values: [[nome, idade, sexo, peso, altura, pressao, temperatura]],
//       },
//     });

//     console.log("✅ Dados enviados com sucesso para o Google Sheets!");
//     res.send("✅ Dados enviados com sucesso para o Google Sheets!");
//   } catch (error) {
//     console.error("❌ Erro ao enviar para Google Sheets:", error);
//     res.status(500).send(`❌ Erro ao salvar os dados: ${error.message}`);
//   }
// });

// // Porta do servidor (Render define process.env.PORT)
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));


const fs = require("fs");
const path = require("path");
const express = require("express");
const { google } = require("googleapis");
const favicon = require("serve-favicon");

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(favicon(path.join(__dirname, "../public/img/favicon.ico")));
app.use(express.static(path.join(__dirname, "../public")));

// Caminho para credenciais
let credentialsPath;

// Se estiver na Render, usar a variável de ambiente GOOGLE_CREDENTIALS_PATH
if (process.env.GOOGLE_CREDENTIALS_PATH) {
  credentialsPath = process.env.GOOGLE_CREDENTIALS_PATH;
} else {
  credentialsPath = path.join(__dirname, "credentials.json"); // local
}

// Ler credenciais
if (!fs.existsSync(credentialsPath)) {
  console.error(`❌ Arquivo de credenciais não encontrado: ${credentialsPath}`);
  process.exit(1);
}

const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));
console.log("🟢 Credenciais carregadas para:", credentials.client_email);

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Recebe dados do formulário e envia para Google Sheets
app.post("/", async (req, res) => {
  try {
    console.log("📥 Recebido do formulário:", req.body);

    const {
      nome,
      idade,
      sexo,
      peso,
      altura,
      pressao,
      classPressao,
      temperatura,
      classTemp,
      imc,
      classificacao,
      atendente,
      data_atendimento,
    } = req.body;

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1BxN1B1u2p5VvJyW_7hbgFafWddlRZk6sD55N8Y6n97M";

    // Append corrigido
    const response = await googleSheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Pace-Dados",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS", // Garante que será adicionada uma nova linha
      resource: {
        values: [[
          nome,
          idade,
          sexo,
          peso,
          altura,
          pressao,
          classPressao,
          temperatura,
          classTemp,
          imc,
          classificacao,
          atendente,
          data_atendimento,
        ]],
      },
    });

    console.log("✅ Dados enviados com sucesso para o Google Sheets!");
    console.log("📊 Resposta da API:", response.data);

    res.send("✅ Dados enviados com sucesso para o Google Sheets!");
  } catch (error) {
    console.error("❌ Erro ao enviar para Google Sheets:", error);
    res.status(500).send(`❌ Erro ao salvar os dados: ${error.message}`);
  }
});

// Porta do servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));