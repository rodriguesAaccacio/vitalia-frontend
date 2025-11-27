document.addEventListener("DOMContentLoaded", () => {
    // pegando a div onde vai aparecer a info do usuario
    const userInfoDiv = document.getElementById("user-info")
    // tenta pegar o nome do usuario se ele tiver logado na sessao
    const nomeUsuario = sessionStorage.getItem("usuarioNome")

    // essa funcao aq serve pra arrumar os links dependendo de onde a pessoa ta no site
    function getCaminhos() {
        const rawPath = window.location.pathname
        // deixa tudo maiusculo pra facilitar a verificacao e evitar erro
        const path = decodeURIComponent(rawPath).toUpperCase()

        // se tiver nessas pastas mais fundas, tem q voltar 3 niveis (../../..)
        if (path.includes("HOMEJOGO") || path.includes("SELECT")) {
            return {
                login: "../../../LOGIN/login.html",
                home: "../../../index.html"
            }
        }

        // se tiver nessas pastas aq, volta 2 niveis (../..)
        if (
            path.includes("/JOGO/") || 
            path.includes("/QUIZ/") || 
            path.includes("/RANKING/")
        ) {
            return {
                login: "../../LOGIN/login.html",
                home: "../../index.html"
            }
        }

        // nessas aqui eh mais simples, so volta 1 nivel (../)
        if (
            path.includes("NUTRIENTES") || 
            path.includes("FUNCOES") || 
            path.includes("FASES") || 
            path.includes("EXTRAS") ||
            path.includes("DICAS") || 
            path.includes("QUIZEJOGOS") || 
            path.includes("ABOUT") ||
            path.includes("CADASTRO")
        ) {
            return {
                login: "../LOGIN/login.html",
                home: "../index.html"
            }
        }

        // se n cair em nenhuma das de cima, ta na raiz, entao n precisa voltar nada
        return {
            login: "LOGIN/login.html",
            home: "index.html"
        }
    }

    // executa a funcao pra pegar os caminhos certos pra pagina atual
    const caminhos = getCaminhos()

    // cria o html do modal de sair, aquela janelinha de confirmacao
    const modalHTML = `
        <div id="logoutModal" class="logout-overlay">
            <div class="logout-box">
                <h3>Deseja sair?</h3>
                <p>Você entrará no modo visitante e não poderá salvar pontuações.</p>
                <div class="logout-buttons">
                    <button class="btn-cancel" id="cancelLogout">Cancelar</button>
                    <button class="btn-confirm" id="confirmLogout">Sair</button>
                </div>
            </div>
        </div>
    `
    
    // verifica se o modal ja existe, se n existir, adiciona ele no final do body
    if (!document.getElementById("logoutModal")) {
        document.body.insertAdjacentHTML('beforeend', modalHTML)
    }

    // aqui a gente checa: se tem nome de usuario, mostra o perfil
    if (nomeUsuario) {
        userInfoDiv.innerHTML = `
            <div class="user-profile">
                <svg class="user-avatar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#A1CF6B" style="background: #fff;">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <span class="user-greeting">Olá, ${nomeUsuario}</span>
                <button id="btnSair" class="btn-logout">Sair</button>
            </div>
        `

        // pegando os elementos do modal e o botao de sair pra dar vida a eles
        const btnSair = document.getElementById("btnSair")
        const modal = document.getElementById("logoutModal")
        const btnCancel = document.getElementById("cancelLogout")
        const btnConfirm = document.getElementById("confirmLogout")

        // qnd clica em sair, previne o padrao e mostra o modal na tela
        btnSair.addEventListener("click", (e) => {
            e.preventDefault()
            modal.style.display = "flex"
        })

        // se clicar em cancelar, so esconde o modal de novo
        btnCancel.addEventListener("click", () => {
            modal.style.display = "none"
        })

        // se confirmar msm, limpa a sessao e manda o usuario pra home
        btnConfirm.addEventListener("click", () => {
            sessionStorage.removeItem("usuarioId")
            sessionStorage.removeItem("usuarioNome")
            sessionStorage.setItem("acabouDeSair", "true") // marca q ele acabou de deslogar
            window.location.href = caminhos.home
        })

    } else {
        // se n tiver logado, mostra so o botao pra entrar usando o caminho certo
        userInfoDiv.innerHTML = `
            <a href="${caminhos.login}" class="btn-login-nav">Entrar</a>
        `
    }
})