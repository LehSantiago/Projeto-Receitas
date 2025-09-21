const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 25000;

// Configuração de CORS mais permissiva para debug
const allowedOrigins = [
    'http://172.31.24.97:8080',  // IP privado da instância Web
    'http://3.214.212.212:8080', // IP público da instância Web  
    'http://localhost:8080',     // Para testes locais
    'http://127.0.0.1:8080'      // Para testes locais
];

app.use(cors({
    origin: function(origin, callback) {
        // Permite requests diretas (curl/postman) sem origin
        if (!origin) {
            console.log('Request sem origin - permitindo');
            return callback(null, true);
        }
        
        console.log('Origin da request:', origin);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            console.log('Origin permitida:', origin);
            return callback(null, true);
        } else {
            console.log('Origin não permitida:', origin);
            // Em desenvolvimento, permita todas as origins por enquanto
            return callback(null, true);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: false
}));

app.use(express.json());

// Log detalhado de requisições
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    console.log('Origin:', req.get('Origin'));
    next();
});

// Caminho do arquivo receitas.json
const receitasPath = path.join(__dirname, "receitas.json");

// Rota para verificar se o servidor está funcionando
app.get("/", (req, res) => {
    res.json({ 
        message: "Backend de Receitas funcionando!", 
        timestamp: new Date().toISOString(),
        port: PORT,
        hostname: require('os').hostname(),
        env: process.env.NODE_ENV || 'development'
    });
});

// Rota para health check
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Rota para retornar todas as receitas
app.get("/receitas", (req, res) => {
    console.log("Buscando receitas...");
    
    fs.readFile(receitasPath, "utf-8", (err, data) => {
        if (err) {
            console.error("Erro ao ler arquivo:", err);
            return res.status(500).json({ 
                error: "Erro ao ler o arquivo de receitas.",
                details: err.message,
                path: receitasPath
            });
        }
        
        try {
            const receitas = JSON.parse(data);
            console.log(`${receitas.receitas?.length || 0} receitas carregadas`);
            
            // Adiciona meta informações
            const response = {
                ...receitas,
                meta: {
                    total: receitas.receitas?.length || 0,
                    timestamp: new Date().toISOString(),
                    servidor: "Backend AWS EC2"
                }
            };
            
            res.json(response);
        } catch (parseErr) {
            console.error("Erro ao parsear JSON:", parseErr);
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
    console.log(`Buscando receita com ID: ${id}`);
    
    fs.readFile(receitasPath, "utf-8", (err, data) => {
        if (err) {
            return res.status(500).json({ 
                error: "Erro ao ler o arquivo de receitas.",
                details: err.message 
            });
        }
        
        try {
            const receitas = JSON.parse(data);
            const receita = receitas.receitas.find(r => r.id === id);
            
            if (!receita) {
                return res.status(404).json({ 
                    error: "Receita não encontrada.",
                    id: id,
                    disponíveis: receitas.receitas.map(r => r.id)
                });
            }
            
            console.log(`Receita encontrada: ${receita.nome}`);
            res.json(receita);
        } catch (parseErr) {
            res.status(500).json({ 
                error: "Erro ao parsear o JSON de receitas.",
                details: parseErr.message 
            });
        }
    });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    console.log(`Rota não encontrada: ${req.method} ${req.path}`);
    res.status(404).json({ 
        error: "Rota não encontrada",
        path: req.path,
        method: req.method,
        availableRoutes: [
            'GET /',
            'GET /health', 
            'GET /receitas',
            'GET /receitas/:id'
        ]
    });
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error("Erro no servidor:", err);
    res.status(500).json({ 
        error: "Erro interno do servidor",
        details: err.message 
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend rodando na porta ${PORT}`);
    console.log(`Arquivo de receitas: ${receitasPath}`);
    console.log(`Acesse: http://localhost:${PORT}`);
    console.log(`Origins permitidas:`, allowedOrigins);
    
    // Verificar arquivo de receitas
    if (fs.existsSync(receitasPath)) {
        console.log("Arquivo receitas.json encontrado");
        try {
            const content = fs.readFileSync(receitasPath, 'utf-8');
            const data = JSON.parse(content);
            console.log(`${data.receitas?.length || 0} receitas disponíveis`);
        } catch (e) {
            console.error("Erro ao ler receitas na inicialização:", e.message);
        }
    } else {
        console.error("ATENÇÃO: Arquivo receitas.json NÃO encontrado!");
        console.log("Arquivos no diretório:", fs.readdirSync(__dirname));
    }
});