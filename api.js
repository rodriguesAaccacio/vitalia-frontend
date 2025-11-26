// frontend/api.js

export function getApiUrl() {
    const host = window.location.hostname;

    // ----------------------------------------------------------------
    // 1. AMBIENTE LOCAL (Seu PC) 🏠
    // ----------------------------------------------------------------
    // Se o site estiver rodando em localhost ou IP local (127.0.0.1)
    if (host === "localhost" || host === "127.0.0.1") {
        console.log("🏠 Modo Desenvolvimento: Usando Backend Local (Porta 3333)");
        return "http://localhost:3333/api";
    }

    // ----------------------------------------------------------------
    // 2. AMBIENTE NUVEM DA ESCOLA (Opcional/Segurança) 🏫
    // ----------------------------------------------------------------
    // Caso você abra no Cloud Workstations da escola algum dia
    if (host.includes("cloudworkstations") || host.includes("edutec")) {
        // Lógica para ajustar a porta na nuvem da escola (se precisar)
        const origin = window.location.origin;
        return origin.replace(/:[0-9]+/, ":3333") + "/api";
    }

    // ----------------------------------------------------------------
    // 3. AMBIENTE DE PRODUÇÃO (Vercel) ☁️
    // ----------------------------------------------------------------
    // Se não for local nem escola, assume que é a Vercel
    console.log("☁️ Modo Produção: Usando Backend da Vercel");
    return "https://vitalia-backend-psi.vercel.app/api";
}

// Exporta a constante pronta para uso
export const API_BASE_URL = getApiUrl();