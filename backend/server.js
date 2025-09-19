const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 25000;

// Configuração de CORS
const allowedOrigins = [
    'http://172.31.24.97:8080' // IP privado da instância Web + porta
];

app.use(cors({
    origin: function(origin, callback) {
        // Requests diretas (curl/postman) podem ter origin undefined
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = '❌ O CORS não permite esta origem.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Log de requisições
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Caminho do arquivo receitas.json
const receitasPath = path.join(__dirname, "receitas.json");

// Rota para verificar se o servidor está funcionando
app.get("/", (req, res) => {
    res.json({ 
        message: "🧁 Backend de Receitas funcionando!", 
        timestamp: new Date().toISOString(),
        port: PORT
    });
});

// Rota para retornar todas as receitas
app.get("/receitas", (req, res) => {
    console.log("📖 Buscando receitas...");
    
    fs.readFile(receitasPath, "utf-8", (err, data) => {
        if (err) {
            console.error("❌ Erro ao ler arquivo:", err);
            return res.status(500).json({ 
                error: "Erro ao ler o arquivo de receitas.",
                details: err.message 
            });
        }
        
        try {
            const receitas = JSON.parse(data);
            console.log(`✅ ${receitas.receitas?.length || 0} receitas carregadas`);
            res.json(receitas);
        } catch (parseErr) {
            console.error("❌ Erro ao parsear JSON:", parseErr);
            res.status(500).json({ 
                error: "Erro ao parsear o JSON de receitas.",
                details: parseErr.message 
            });
        }
    });
});

// Rota para buscar receita por ID
app.get("/receitas/:id", (req, res) => {
    const id = parseInt(req.params.id);
    
    fs.readFile(receitasPath, "utf-8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao ler o arquivo de receitas." });
        }
        
        try {
            const receitas = JSON.parse(data);
            const receita = receitas.receitas.find(r => r.id === id);
            
            if (!receita) {
                return res.status(404).json({ error: "Receita não encontrada." });
            }
            
            res.json(receita);
        } catch (parseErr) {
            res.status(500).json({ error: "Erro ao parsear o JSON de receitas." });
        }
    });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: "Rota não encontrada",
        path: req.path,
        method: req.method
    });
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error("❌ Erro no servidor:", err);
    res.status(500).json({ 
        error: "Erro interno do servidor",
        details: err.message 
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend rodando na porta ${PORT}`);
    console.log(`📁 Arquivo de receitas: ${receitasPath}`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
    
    if (fs.existsSync(receitasPath)) {
        console.log("✅ Arquivo receitas.json encontrado");
    } else {
        console.log("❌ Arquivo receitas.json NÃO encontrado!");
    }
});
