export function getApiUrl() {
    const host = window.location.hostname;

    // 1. AMBIENTE LOCAL
    if (host === "localhost" || host === "127.0.0.1") {
        console.log("🏠 Modo Local detectado");
        return "http://localhost:3333/api";
    }

    // 2. NUVEM DA ESCOLA (Caso use o IDX/Cloud Workstations)
    if (host.includes("cloudworkstations") || host.includes("edutec")) {
        const origin = window.location.origin;
        return origin.replace(/:[0-9]+/, ":3333") + "/api";
    }

    // 3. PRODUÇÃO (Vercel)
    console.log("☁️ Modo Produção detectado (Vercel)");
    
    // BACKEND
    return "https://vitalia-backend-psi.vercel.app/api"; 
}

export const API_BASE_URL = getApiUrl();
console.log("🚀 API conectada em:", API_BASE_URL);