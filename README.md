# API Turnstile Solver

API para resolver desafios Turnstile usando a biblioteca bycf.

## 🚀 Inicialização

```bash
cd API-Captcha
bun install
bun start
```

## 📡 Endpoints

### 1. GET `/`
Retorna informações sobre a API.

### 2. GET `/health`
Health check da API.

### 3. GET `/solve`
Resolve Turnstile com as credenciais de teste:
- **URL:** `http://tsmanaged.zlsupport.com`
- **Key:** `0x4AAAAAAABUYP0XeMJF0xoy`

### 4. POST `/solve`
Resolve Turnstile com credenciais personalizadas.

**Body:**
```json
{
  "website_url": "http://example.com",
  "website_key": "0x4AAAAAAABk..."
}
```

## 🧪 Testes

### Teste rápido com credenciais de teste:
```bash
curl http://localhost:3001/solve
```

### Teste com credenciais personalizadas:
```bash
curl -X POST http://localhost:3001/solve \
  -H "Content-Type: application/json" \
  -d '{
    "website_url": "http://tsmanaged.zlsupport.com",
    "website_key": "0x4AAAAAAABUYP0XeMJF0xoy"
  }'
```

## 📝 Respostas

### Sucesso (200):
```json
{
  "status": "success",
  "data": {
    "website_url": "http://tsmanaged.zlsupport.com",
    "website_key": "0x4AAAAAAABUYP0XeMJF0xoy",
    "turnstile_token": "0x4AAAAAAABUYP0XeMJF0xoy..."
  },
  "message": "Turnstile resolvido com sucesso"
}
```

### Erro (500):
```json
{
  "status": "error",
  "data": {
    "website_url": "http://tsmanaged.zlsupport.com",
    "website_key": "0x4AAAAAAABUYP0XeMJF0xoy"
  },
  "error": "Mensagem de erro",
  "message": "Erro ao resolver Turnstile"
}
```

## 🔧 Dependências

- `bycf`: Biblioteca para resolver desafios
- `express`: Framework web para criar a API