import { API_BASE_URL } from '../../../api.js' 

document.addEventListener("DOMContentLoaded", async () => {
    // puxa a url da api que a gente importou pra usar dentro dessa funcao
    const API_URL = API_BASE_URL 

    try {
        // faz a requisicao pro backend pra pegar a lista do ranking
        const response = await fetch(`${API_URL}/ranking`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // manda cookie junto se precisar
            cache: 'no-store' // desabilita o cache pra sempre vir os dados mais frescos
        })

        // converte a resposta q veio da api pra json
        let rankingData = await response.json()

        // se a resposta n for ok (tipo erro 400 ou 500), avisa e para tudo
        if (!response.ok) {
            console.error("Erro na resposta da API")
            return
        }

        console.log("Ranking recebido (bruto):", rankingData)

        // a magica acontece aq: ordena o array do maior score pro menor
        rankingData.sort((a, b) => b.score - a.score)

        console.log("Ranking ordenado:", rankingData)

        // --- PREENCHENDO O 1º LUGAR ---
        const firstPlaceDiv = document.querySelector('.first-place')
        // verifica se tem alguem na posicao 0 (primeirao)
        if (rankingData[0]) {
            const nomeEl = firstPlaceDiv.querySelector('.player-name')
            const pontosEl = firstPlaceDiv.querySelector('.player-score')
            
            // se achou os elementos no html, bota o nome e os pontos la
            if(nomeEl) nomeEl.textContent = rankingData[0].name
            if(pontosEl) pontosEl.textContent = rankingData[0].score + " Pontos"
        } else {
            // se n tiver ninguem, esconde essa div
            if(firstPlaceDiv) firstPlaceDiv.style.display = 'none'
        }

        // --- PREENCHENDO O 2º LUGAR ---
        const secondPlaceDiv = document.querySelector('.second-place')
        // verifica se tem alguem na posicao 1 (vice)
        if (rankingData[1]) {
            const nomeEl = secondPlaceDiv.querySelector('.player-name')
            const pontosEl = secondPlaceDiv.querySelector('.player-score')
            
            if(nomeEl) nomeEl.textContent = rankingData[1].name
            if(pontosEl) pontosEl.textContent = rankingData[1].score + " Pontos"
        } else {
            // aq usa visibility hidden pra nao quebrar o layout, so fica invisivel
            if(secondPlaceDiv) secondPlaceDiv.style.visibility = 'hidden'
        }

        // --- PREENCHENDO O 3º LUGAR ---
        const thirdPlaceDiv = document.querySelector('.third-place')
        // verifica se tem alguem na posicao 2 (terceiro)
        if (rankingData[2]) {
            // atencao aq: pro nome do terceiro ta buscando pelo ID especifico 'terceiro'
            const nomeEl = document.getElementById('terceiro') 
            const pontosEl = thirdPlaceDiv.querySelector('.player-score')
            
            if(nomeEl) nomeEl.textContent = rankingData[2].name
            if(pontosEl) pontosEl.textContent = rankingData[2].score + " Pontos"
        } else {
            if(thirdPlaceDiv) thirdPlaceDiv.style.visibility = 'hidden'
        }

    } catch (error) {
        // se der ruim na conexao ou no codigo acima, mostra o erro no console
        console.error("Erro ao carregar ranking:", error)
    }
})