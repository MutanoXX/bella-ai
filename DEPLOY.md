# Vercel Deployment Guide

## 📋 Arquivos de Configuração

### 1. vercel.json
Arquivo principal de configuração para deploy na Vercel:
- **Runtime**: Node.js 18.x
- **Duração máxima**: 30 segundos (para processamento do Turnstile)
- **CORS**: Configurado para permitir requisições de qualquer origem
- **Roteamento**: Todas as requisições são direcionadas para `api.js`

### 2. api.js
Arquivo otimizado para serverless:
- Detecta automaticamente se está rodando na Vercel
- Handler compatível com serverless functions
- Headers CORS configurados
- Tratamento de erros robusto

## 🚀 Como Fazer o Deploy

### Pré-requisitos
1. Instalar Vercel CLI:
```bash
npm i -g vercel
```

### Deploy Automático
```bash
cd API-Captcha
vercel --prod
```

### Deploy Manual
1. Fazer upload do projeto para o GitHub
2. Conectar o repositório na Vercel
3. Configurar as variáveis de ambiente (se necessário)

## 🔧 Configurações do vercel.json

```json
{
  "version": 2,
  "name": "api-captcha",
  "builds": [
    {
      "src": "api.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api.js"
    }
  ],
  "functions": {
    "api.js": {
      "runtime": "nodejs18.x",
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type"
        }
      ]
    }
  ]
}
```

## 📡 Endpoints na Vercel

Após o deploy, os endpoints estarão disponíveis em:
- `https://seu-pro.vercel.app/` - Informações da API
- `https://seu-pro.vercel.app/health` - Health check
- `https://seu-pro.vercel.app/solve` - Resolver Turnstile (GET/POST)

## 🧪 Testes pós-deploy

```bash
# Teste de saúde
curl https://seu-pro.vercel.app/health

# Teste com credenciais de teste
curl https://seu-pro.vercel.app/solve

# Teste com credenciais personalizadas
curl -X POST https://seu-pro.vercel.app/solve \
  -H "Content-Type: application/json" \
  -d '{
    "website_url": "http://tsmanaged.zlsupport.com",
    "website_key": "0x4AAAAAAABUYP0XeMJF0xoy"
  }'
```

## ⚙️ Variáveis de Ambiente (Opcional)

Se precisar configurar variáveis de ambiente na Vercel:
```bash
vercel env add
```

Ou configure através do dashboard da Vercel.

## 🔍 Monitoramento

A Vercel oferece:
- Logs em tempo real
- Métricas de performance
- Analytics de uso
- Alertas de erro

## 📝 Considerações

1. **Timeout**: Configurado para 30 segundos (suficiente para resolver Turnstile)
2. **CORS**: Habilitado para permitir requisições de qualquer origem
3. **Cold Start**: A primeira requisição pode ser mais lenta
4. **Rate Limiting**: Configure se necessário no dashboard da Vercel
5. **Custom Domain**: Configure domínio personalizado se necessário