const { shannz: cf } = require('bycf');
const express = require('express');
const app = express();
const port = 3001;

// Middleware para parsear JSON
app.use(express.json());

// Parâmetros de teste
const website_url = "http://tsmanaged.zlsupport.com";
const website_key = "0x4AAAAAAABUYP0XeMJF0xoy";

// Função para resolver Turnstile
async function solveTurnstile(url, siteKey) {
    console.log(`Tentando resolver Turnstile para URL: ${url} com Site Key: ${siteKey}`);
    
    try {
        // Usando cf.turnstileMin para uma solução rápida
        const token = await cf.turnstileMin(url, siteKey);

        console.log("==================================================");
        console.log("✅ Turnstile resolvido com sucesso!");
        console.log("Token de Resposta (cf-turnstile-response):");
        console.log(token);
        console.log("==================================================");

        return {
            success: true,
            token: token,
            message: "Turnstile resolvido com sucesso"
        };

    } catch (error) {
        console.error("==================================================");
        console.error("❌ Erro ao resolver Turnstile:");
        if (error.message) {
            console.error(error.message);
        } else {
            console.error(error);
        }
        console.error("==================================================");

        return {
            success: false,
            error: error.message || error,
            message: "Erro ao resolver Turnstile"
        };
    }
}

// Endpoint principal - GET para teste com credenciais fixas
app.get('/solve', async (req, res) => {
    console.log("Recebida requisição para resolver Turnstile com credenciais de teste");
    
    const result = await solveTurnstile(website_url, website_key);
    
    if (result.success) {
        res.json({
            status: "success",
            data: {
                website_url: website_url,
                website_key: website_key,
                turnstile_token: result.token
            },
            message: result.message
        });
    } else {
        res.status(500).json({
            status: "error",
            data: {
                website_url: website_url,
                website_key: website_key
            },
            error: result.error,
            message: result.message
        });
    }
});

// Endpoint POST para resolver com credenciais personalizadas
app.post('/solve', async (req, res) => {
    const { website_url, website_key } = req.body;
    
    if (!website_url || !website_key) {
        return res.status(400).json({
            status: "error",
            error: "Parâmetros website_url e website_key são obrigatórios"
        });
    }
    
    console.log("Recebida requisição para resolver Turnstile com credenciais personalizadas");
    
    const result = await solveTurnstile(website_url, website_key);
    
    if (result.success) {
        res.json({
            status: "success",
            data: {
                website_url: website_url,
                website_key: website_key,
                turnstile_token: result.token
            },
            message: result.message
        });
    } else {
        res.status(500).json({
            status: "error",
            data: {
                website_url: website_url,
                website_key: website_key
            },
            error: result.error,
            message: result.message
        });
    }
});

// Endpoint de health check
app.get('/health', (req, res) => {
    res.json({
        status: "online",
        message: "API de Turnstile está funcionando",
        timestamp: new Date().toISOString()
    });
});

// Endpoint raiz com informações
app.get('/', (req, res) => {
    res.json({
        name: "API Turnstile Solver",
        version: "1.0.0",
        endpoints: {
            "GET /": "Informações da API",
            "GET /health": "Health check",
            "GET /solve": "Resolver Turnstile com credenciais de teste",
            "POST /solve": "Resolver Turnstile com credenciais personalizadas"
        },
        usage: {
            test_credentials: {
                website_url: website_url,
                website_key: website_key
            }
        }
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`\n🚀 API Turnstile Solver rodando em http://localhost:${port}`);
    console.log(`📝 Endpoints disponíveis:`);
    console.log(`   GET  http://localhost:${port}/`);
    console.log(`   GET  http://localhost:${port}/health`);
    console.log(`   GET  http://localhost:${port}/solve (teste)`);
    console.log(`   POST http://localhost:${port}/solve (personalizado)`);
    console.log(`\n🔑 Credenciais de teste:`);
    console.log(`   URL: ${website_url}`);
    console.log(`   Key: ${website_key}`);
    console.log(`\n⚡ Teste rápido: curl http://localhost:${port}/solve`);
});

// Teste automático ao iniciar (opcional)
setTimeout(async () => {
    console.log(`\n🧪 Executando teste automático...`);
    const result = await solveTurnstile(website_url, website_key);
    if (result.success) {
        console.log("✅ Teste automático concluído com sucesso!");
    } else {
        console.log("❌ Teste automático falhou!");
    }
}, 2000);