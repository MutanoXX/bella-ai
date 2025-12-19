const { shannz: cf } = require('bycf');

// Verifica se estamos rodando no Vercel (serverless)
const isVercel = process.env.VERCEL === '1';

// Importa express apenas se não for serverless
let express, app;
if (!isVercel) {
  express = require('express');
  app = express();
  app.use(express.json());
}

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

// Handler para Vercel (serverless)
async function handler(req, res) {
  // Adiciona headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, method } = req;
  
  try {
    if (url === '/' && method === 'GET') {
      return res.json({
        name: "API Turnstile Solver",
        version: "1.0.0",
        platform: isVercel ? "Vercel Serverless" : "Local Server",
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
    }

    if (url === '/health' && method === 'GET') {
      return res.json({
        status: "online",
        message: "API de Turnstile está funcionando",
        platform: isVercel ? "Vercel Serverless" : "Local Server",
        timestamp: new Date().toISOString()
      });
    }

    if (url === '/solve' && method === 'GET') {
      console.log("Recebida requisição GET para resolver Turnstile com credenciais de teste");
      
      const result = await solveTurnstile(website_url, website_key);
      
      if (result.success) {
        return res.json({
          status: "success",
          data: {
            website_url: website_url,
            website_key: website_key,
            turnstile_token: result.token
          },
          message: result.message
        });
      } else {
        return res.status(500).json({
          status: "error",
          data: {
            website_url: website_url,
            website_key: website_key
          },
          error: result.error,
          message: result.message
        });
      }
    }

    if (url === '/solve' && method === 'POST') {
      const { website_url: reqUrl, website_key: reqKey } = req.body;
      
      if (!reqUrl || !reqKey) {
        return res.status(400).json({
          status: "error",
          error: "Parâmetros website_url e website_key são obrigatórios"
        });
      }
      
      console.log("Recebida requisição POST para resolver Turnstile com credenciais personalizadas");
      
      const result = await solveTurnstile(reqUrl, reqKey);
      
      if (result.success) {
        return res.json({
          status: "success",
          data: {
            website_url: reqUrl,
            website_key: reqKey,
            turnstile_token: result.token
          },
          message: result.message
        });
      } else {
        return res.status(500).json({
          status: "error",
          data: {
            website_url: reqUrl,
            website_key: reqKey
          },
          error: result.error,
          message: result.message
        });
      }
    }

    return res.status(404).json({
      status: "error",
      error: "Endpoint não encontrado"
    });

  } catch (error) {
    console.error("Erro no handler:", error);
    return res.status(500).json({
      status: "error",
      error: "Erro interno do servidor"
    });
  }
}

// Export para Vercel
if (isVercel) {
  module.exports = handler;
} else {
  // Configuração para desenvolvimento local
  app.get('/', async (req, res) => {
    req.url = '/';
    req.method = 'GET';
    return handler(req, res);
  });

  app.get('/health', async (req, res) => {
    req.url = '/health';
    req.method = 'GET';
    return handler(req, res);
  });

  app.get('/solve', async (req, res) => {
    req.url = '/solve';
    req.method = 'GET';
    return handler(req, res);
  });

  app.post('/solve', async (req, res) => {
    req.url = '/solve';
    req.method = 'POST';
    return handler(req, res);
  });

  // Iniciar servidor local
  const port = process.env.PORT || 3001;
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
}