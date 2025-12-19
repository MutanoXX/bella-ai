const { shannz: cf } = require('bycf');

// Parâmetros fornecidos pelo usuário
const website_url = "http://tsmanaged.zlsupport.com";
const website_key = "0x4AAAAAAABUYP0XeMJF0xoy";

async function solveTurnstile() {
    console.log(`Tentando resolver Turnstile para URL: ${website_url} com Site Key: ${website_key}`);
    
    try {
        // Usando cf.turnstileMin para uma solução rápida
        // O terceiro parâmetro (proxy) é opcional.
        const token = await cf.turnstileMin(
            website_url,
            website_key
        );

        console.log("==================================================");
        console.log("✅ Turnstile resolvido com sucesso!");
        console.log("Token de Resposta (cf-turnstile-response):");
        console.log(token);
        console.log("==================================================");
        
        return {
            success: true,
            token: token
        };

    } catch (error) {
        console.error("==================================================");
        console.error("❌ Erro ao resolver Turnstile:");
        // A biblioteca bycf pode retornar um objeto de erro com mais detalhes
        if (error.message) {
            console.error(error.message);
        } else {
            console.error(error);
        }
        console.error("==================================================");
        
        return {
            success: false,
            error: error.message || error
        };
    }
}

// Executar o teste
solveTurnstile().then(result => {
    console.log("\n📋 Resultado final:", result);
}).catch(error => {
    console.error("\n💥 Erro fatal:", error);
});