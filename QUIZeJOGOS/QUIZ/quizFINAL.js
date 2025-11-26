import { API_BASE_URL } from '../../api.js';

document.addEventListener("DOMContentLoaded", () => {
    // 1. Recupera a pontuação salva no arquivo de perguntas
    const mostRecentScore = localStorage.getItem("mostRecentScore");
    const finalScore = document.getElementById('finalScore');

    // 2. Mostra na tela e Salva no Banco
    if (mostRecentScore) {
        // Atualiza o texto na tela 
        // (Se o seu quiz tem 10 perguntas, deixe 10. Se tem 6, mude para 6 aqui)
        finalScore.innerText = `${mostRecentScore} de 10`;

        // Chama a função para salvar no banco
        enviarPontuacaoParaBanco(parseInt(mostRecentScore));
    } else {
        finalScore.innerText = "0 de 10";
    }
});

// =================================================
// FUNÇÃO DE CONEXÃO COM O BANCO DE DADOS
// =================================================
async function enviarPontuacaoParaBanco(pontosFinais) {
    const idUsuario = sessionStorage.getItem("usuarioId");
    
    // Se não tiver usuário logado, para aqui
    if (!idUsuario) return;

    try {
        // 🔴 IMPLEMENTAÇÃO DA API DINÂMICA AQUI:
        // 1. Usamos API_BASE_URL (do api.js) em vez de localhost
        // 2. Mantivemos o credentials: 'include' para funcionar na escola
        const response = await fetch(`${API_BASE_URL}/salvar-pontuacao`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', 
            body: JSON.stringify({
                userId: idUsuario,
                pontos: pontosFinais
            })
        });
        
        const data = await response.json();
        console.log("Status do Ranking:", data.message);
        
        if(data.newRecord) {
            console.log("Parabéns! Novo recorde pessoal registrado!");
        }
    } catch (error) {
        console.error("Erro ao salvar pontuação:", error);
    }
}