// Note a palavra "export" antes da função e da constante
export function getApiUrl() {
    const host = window.location.hostname;
    const origin = window.location.origin;

    // 1. LOCALHOST
    if (host === "127.0.0.1" || host === "localhost") {
        return "http://localhost:3333/api";
    }

    // 2. NUVEM DA ESCOLA
    if (host.includes("cloudworkstations") || host.includes("web.app") || host.includes("edutec")) {
        // Tenta ajustar a porta automaticamente
        return origin.replace(/:[0-9]+/, ":3333") + "/api";
    }

    // 3. PRODUÇÃO (Vercel)
    return "https://vitalia-backend-psi.vercel.app/api"; 
}

export const API_BASE_URL = getApiUrl();
// console.log("🌍 API Base definida como:", API_BASE_URL);