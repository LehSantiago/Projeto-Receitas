const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 25000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve a pasta de imagens
app.use('/img', express.static(path.join(__dirname, 'img')));

// Caminho do arquivo receitas.json
const receitasPath = path.join(__dirname, "receitas.json");

// Rota para retornar todas as receitas
app.get("/receitas", (req, res) => {
  fs.readFile(receitasPath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao ler o arquivo de receitas." });
    }
    try {
      const receitas = JSON.parse(data);
      res.json(receitas);
    } catch (parseErr) {
      res.status(500).json({ error: "Erro ao parsear o JSON de receitas." });
    }
  });
});

// Servidor ouvindo na porta 25000
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
