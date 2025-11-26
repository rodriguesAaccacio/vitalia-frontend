function getApiUrl() {
    const host = window.location.hostname;
    const origin = window.location.origin;

    // 1. LOCALHOST (Sua casa)
    if (host === "127.0.0.1" || host === "localhost") {
        // ADICIONEI O "/api" NO FINAL
        return "http://localhost:3333/api";
    }

    // 2. NUVEM DA ESCOLA (Cloud Workstations)
    if (host.includes("cloudworkstations") || host.includes("web.app") || host.includes("edutec")) {
        if (origin.includes("5500")) return origin.replace("5500", "3333") + "/api"; // <--- AQUI
        if (origin.includes("5501")) return origin.replace("5501", "3333") + "/api"; // <--- AQUI
        if (origin.includes("5502")) return origin.replace("5502", "3333") + "/api"; // <--- AQUI
    }

    // 3. PRODUÇÃO (Vercel - Backend Separado)
    // Cole seu link da Vercel aqui depois, SEM o /api no final (pois a Vercel já adiciona pela pasta)
    // Mas para garantir, observe como a Vercel vai gerar o link.
    // Por padrão, se você subir o backend, o link base já aponta pra raiz.
    // Vamos deixar o placeholder:
    return "https://vitalia-backend-psi.vercel.app/api"; 
}

const API_BASE_URL = getApiUrl();
console.log("🌍 API conectada em:", API_BASE_URL);