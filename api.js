// api.js

export function getApiUrl() {
    // Vamos deixar simples e direto.
    // Se quiser testar o backend local depois, descomente a linha do localhost.
    
    // 1. Backend Local (Use só se o terminal do backend estiver rodando)
    return "http://localhost:3333/api";

    // 2. Backend Produção (Vercel) - VAMOS USAR ESSE AGORA PARA GARANTIR
    //return "https://vitalia-backend-psi.vercel.app/api";
}

export const API_BASE_URL = getApiUrl();
console.log("🚀 URL da API definida para:", API_BASE_URL);