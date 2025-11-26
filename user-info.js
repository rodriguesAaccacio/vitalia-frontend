document.addEventListener("DOMContentLoaded", () => {
    const userInfoDiv = document.getElementById("user-info");
    const nomeUsuario = sessionStorage.getItem("usuarioNome");

    // ============================================================
    // 1. FUNÇÃO PARA DESCOBRIR O CAMINHO (Lógica Ajustada)
    // ============================================================
    function getCaminhos() {
        const rawPath = window.location.pathname;
        const path = decodeURIComponent(rawPath).toUpperCase();

        // --- NÍVEL 3: MUITO FUNDO (Volta 3x) ---
        // Ex: .../QUIZeJOGOS/JOGO/homeJOGO/homeJ.html
        // Ex: .../QUIZeJOGOS/JOGO/select/select.html
        if (path.includes("HOMEJOGO") || path.includes("SELECT")) {
            return {
                login: "../../../LOGIN/login.html",
                home: "../../../index.html"
            };
        }

        // --- NÍVEL 2: FUNDO (Volta 2x) ---
        // Ex: .../QUIZeJOGOS/JOGO/fase2.html (Fases estão na pasta JOGO)
        // Ex: .../QUIZeJOGOS/QUIZ/quizFINAL.html
        // Ex: .../IMGsJOGO/RANKING/ranking.html
        if (
            path.includes("/JOGO/") || 
            path.includes("/QUIZ/") || 
            path.includes("/RANKING/")
        ) {
            return {
                login: "../../LOGIN/login.html",
                home: "../../index.html"
            };
        }

        // --- NÍVEL 1: RASO (Volta 1x) ---
        // Ex: .../ABOUT US/aboutus.html
        // Ex: .../QUIZeJOGOS/quizEjogos.html
        if (
            path.includes("NUTRIENTES") || 
            path.includes("FUNCOES") || 
            path.includes("FASES") || 
            path.includes("EXTRAS") ||
            path.includes("DICAS") || 
            path.includes("QUIZEJOGOS") || // Pega o arquivo quizEjogos.html
            path.includes("ABOUT") ||
            path.includes("CADASTRO")
        ) {
            return {
                login: "../LOGIN/login.html",
                home: "../index.html"
            };
        }

        // --- NÍVEL 0: RAIZ (Home) ---
        return {
            login: "LOGIN/login.html",
            home: "index.html"
        };
    }

    const caminhos = getCaminhos();

    // ============================================================
    // 2. INJETA O MODAL DE LOGOUT
    // ============================================================
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
    `;
    
    if (!document.getElementById("logoutModal")) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // ============================================================
    // 3. PREENCHE O HEADER
    // ============================================================
    if (nomeUsuario) {
        // --- LOGADO ---
        userInfoDiv.innerHTML = `
            <div class="user-profile">
                <svg class="user-avatar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#A1CF6B" style="background: #fff;">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <span class="user-greeting">Olá, ${nomeUsuario}</span>
                <button id="btnSair" class="btn-logout">Sair</button>
            </div>
        `;

        const btnSair = document.getElementById("btnSair");
        const modal = document.getElementById("logoutModal");
        const btnCancel = document.getElementById("cancelLogout");
        const btnConfirm = document.getElementById("confirmLogout");

        btnSair.addEventListener("click", (e) => {
            e.preventDefault();
            modal.style.display = "flex";
        });

        btnCancel.addEventListener("click", () => {
            modal.style.display = "none";
        });

        btnConfirm.addEventListener("click", () => {
            sessionStorage.removeItem("usuarioId");
            sessionStorage.removeItem("usuarioNome");
            sessionStorage.setItem("acabouDeSair", "true");
            window.location.href = caminhos.home;
        });

    } else {
        // --- DESLOGADO ---
        userInfoDiv.innerHTML = `
            <a href="${caminhos.login}" class="btn-login-nav">Entrar</a>
        `;
    }
});