const express = require("express"); 
const { google } = require("googleapis"); 
const path = require("path");
const favicon = require("serve-favicon");

const app = express(); 

// Permitir que o Express consiga receber dados do formulário
app.use(express.urlencoded({ extended: true }));
// Servir arquivos estáticos (CSS, JS, imagens) da pasta frontend
app.use(favicon(path.join(__dirname, "../public/img/favicon.ico")));
app.use(express.static(path.join(__dirname, "../public")));

// Rota principal - enviar o HTML
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Rota POST - receber dados do formulário e enviar para o Google Sheets
app.post("/", async (req, res) =>{
    console.log("Recebido do formulário:", req.body); // <- adicione isso
    const { nome, idade, sexo, peso, altura, pressao, temperatura } = req.body;

    
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, "credentials.json"),
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    // Create client instance for auth
    const client = await auth.getClient();

    // Instance of Google Sheets API
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1BxN1B1u2p5VvJyW_7hbgFafWddlRZk6sD55N8Y6n97M";

    // Get metadata about spreadsheet
    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId,
    });

    // Ler linhas do spreadsheet
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        // exemplo para pegar apenas a coluna selecionada
        // range: "Pace-Dados!A:A"
        range: "Pace-Dados"
    });

    // Escrever no spreadsheet
    await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Pace-Dados!A:G",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [[nome, idade, sexo, peso, altura, pressao, temperatura]],
        },
    });

    res.send("Dados enviados com sucesso para o Google Sheets! ✅");
});

app.listen(3001, (req, res) => console.log("Rodando na 3001"));