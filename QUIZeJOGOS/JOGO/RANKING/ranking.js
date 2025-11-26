document.addEventListener("DOMContentLoaded", async () => {
    // Usa a variável mágica do api.js
    const API_URL = API_BASE_URL; 

    try {
        // 🔴 O SEGREDO ESTÁ AQUI: credentials: 'include'
        const response = await fetch(`${API_URL}/ranking`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include' 
        });

        const rankingData = await response.json();

        if (!response.ok) {
            console.error("Erro na resposta da API");
            return;
        }

        // === 1º LUGAR (OURO) ===
        const firstPlaceDiv = document.querySelector('.first-place');
        if (rankingData[0]) {
            const nomeEl = firstPlaceDiv.querySelector('.player-name');
            const pontosEl = firstPlaceDiv.querySelector('.player-score');
            
            if(nomeEl) nomeEl.textContent = rankingData[0].name;
            if(pontosEl) pontosEl.textContent = rankingData[0].score + " Pontos";
        } else {
            if(firstPlaceDiv) firstPlaceDiv.style.display = 'none';
        }

        // === 2º LUGAR (PRATA) ===
        const secondPlaceDiv = document.querySelector('.second-place');
        if (rankingData[1]) {
            const nomeEl = secondPlaceDiv.querySelector('.player-name');
            const pontosEl = secondPlaceDiv.querySelector('.player-score');
            
            if(nomeEl) nomeEl.textContent = rankingData[1].name;
            if(pontosEl) pontosEl.textContent = rankingData[1].score + " Pontos";
        } else {
            if(secondPlaceDiv) secondPlaceDiv.style.visibility = 'hidden';
        }

        // === 3º LUGAR (BRONZE) ===
        const thirdPlaceDiv = document.querySelector('.third-place');
        if (rankingData[2]) {
            // Nota: Seu HTML usa ID 'terceiro' no nome
            const nomeEl = document.getElementById('terceiro'); 
            const pontosEl = thirdPlaceDiv.querySelector('.player-score');
            
            if(nomeEl) nomeEl.textContent = rankingData[2].name;
            if(pontosEl) pontosEl.textContent = rankingData[2].score + " Pontos";
        } else {
            if(thirdPlaceDiv) thirdPlaceDiv.style.visibility = 'hidden';
        }

    } catch (error) {
        console.error("Erro ao carregar ranking:", error);
    }
});