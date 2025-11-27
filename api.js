export function getApiUrl() {
    // pega o nome do host atual, tipo o dominio do site sem a porta
    const host = window.location.hostname

     // se tiver rodando no seu pc msm (local), ele identifica aq
    if (host === "localhost" || host === "127.0.0.1") {
        console.log("Modo Local detectado")
        // retorna o link pro backend rodando localmente na porta 3333
        return "http://localhost:3333/api"
    }

    // esse if aq eh pra caso esteja rodando num ambiente de nuvem ou na rede da escola
    if (host.includes("cloudworkstations") || host.includes("edutec")) {
        const origin = window.location.origin
        // pega a url completa, troca qualquer porta q tiver pela 3333 e adiciona o /api no final
        return origin.replace(/:[0-9]+/, ":3333") + "/api"
    }

    console.log("Modo Produção detectado (Vercel)")
    
    // se n cair em nenhum dos de cima, assume q ta valendo (producao) e manda o link da vercel
    return "https://vitalia-backend-psi.vercel.app/api"
}

// exporta o resultado da funcao numa constante pra usar facil em outros arquivos
export const API_BASE_URL = getApiUrl()
// mostra no console onde q a api conectou pra gente ter ctz q ta certo
console.log("API conectada em:", API_BASE_URL)