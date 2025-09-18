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

// Carregar credenciais do Google Sheets
const credentialsPath = process.env.GOOGLE_CREDENTIALS_PATH || path.join(__dirname, "credentials.json");

if (!fs.existsSync(credentialsPath)) {
  console.error(`❌ Arquivo de credenciais não encontrado: ${credentialsPath}`);
  process.exit(1);
}

const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));
console.log("🟢 Credenciais carregadas para:", credentials.client_email);

// Configurar Google Sheets
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});
const googleSheets = google.sheets({ version: "v4", auth });
const spreadsheetId = "1BxN1B1u2p5VvJyW_7hbgFafWddlRZk6sD55N8Y6n97M";

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Recebe dados do formulário e envia para Google Sheets
app.post("/", async (req, res) => {
  try {
    console.log("📥 Recebido do formulário:", req.body);

    const { nome, idade, sexo, peso, altura, pressao, temperatura } = req.body;

    await googleSheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Pace-Dados!A:G",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[nome, idade, sexo, peso, altura, pressao, temperatura]],
      },
    });

    console.log("✅ Dados enviados com sucesso para o Google Sheets!");
    res.send("✅ Dados enviados com sucesso para o Google Sheets!");
  } catch (error) {
    console.error("❌ Erro ao enviar para Google Sheets:", error);
    res.status(500).send(`❌ Erro ao salvar os dados: ${error.message}`);
  }
});

// Porta do servidor (Vercel/Render define process.env.PORT)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
