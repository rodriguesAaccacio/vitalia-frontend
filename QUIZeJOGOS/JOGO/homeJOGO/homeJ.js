if (!sessionStorage.getItem("usuarioId")) { 
    alert("Ops! Você precisa fazer login para jogar e salvar sua pontuação.");
    
    window.location.href = "../../../LOGIN/login.html"; 
    
    throw new Error("Acesso negado: Usuário não logado.");
} 
document.addEventListener("DOMContentLoaded", () => {
    const fade = document.getElementById("fade"); // fundo escuro por tras dos modais
    const modals = document.querySelectorAll(".modal"); // todos os modais
    const botoesFechar = document.querySelectorAll(".fechar"); // botoes de X
    const botoesModal = document.querySelectorAll("[data-modal]"); // botoes q abrem modais

    const SOUNDS_PATH = '../IMGSjogo/'; // pasta dos sons

    // abrir modal
    botoesModal.forEach(btn => {
        btn.addEventListener("click", () => {
            const modalId = btn.getAttribute("data-modal"); // pega id do modal q abriu
            const modal = document.getElementById(modalId);

            // fecha todos os modais, menos o principal (modal1)
            modals.forEach(m => {
                if (m.id !== "modal1") {
                    m.classList.remove("show"); // some os secundarios
                }
            });

            fade.classList.add("show"); // mostra fade
            modal.classList.add("show"); // mostra modal clicado
        });
    });

    // fechar modal clicando no X
    botoesFechar.forEach(btn => {
        btn.addEventListener("click", () => {
            const modalId = btn.getAttribute("data-close"); // pega id do modal a fechar
            const modal = document.getElementById(modalId);

            modal.classList.remove("show"); // some modal

            // se n tiver nenhum outro modal aberto, some fade
            const algumAberto = Array.from(modals).some(m => m.classList.contains("show"));
            if (!algumAberto) fade.classList.remove("show");
        });
    });

    // fechar modal clicando no fundo escuro
    fade.addEventListener("click", () => {
        fade.classList.remove("show"); // some fade
        modals.forEach(m => m.classList.remove("show")); // some todos os modais
    });

// LÓGICA DO BOTÃO COMEÇAR COM BLOQUEIO DE LOGIN
    const botaoComecar = document.querySelector(".com");
    
    if (botaoComecar) {
        const startSound = new Audio("../IMGSjogo/start.mp3"); // Verifique se o caminho do som está certo

        botaoComecar.addEventListener("click", (e) => {
            e.preventDefault(); // Impede mudança imediata

            // === AQUI ESTÁ O BLOQUEIO ===
            const idUsuario = sessionStorage.getItem("usuarioId");

            if (!idUsuario) {
                // SE NÃO TIVER LOGADO:
                alert("Opa! Para jogar você precisa fazer Login.");
                
                // Redireciona para o login (ajuste os ../ conforme sua pasta)
                // Se homeJ.html está em QUIZeJOGOS/JOGO/homeJOGO/homeJ.html (bem fundo)
                window.location.href = "../../../LOGIN/login.html"; 
                return; // Para o código aqui, não toca som nem muda de fase
            }
            // ============================

            // SE ESTIVER LOGADO, VIDA SEGUE NORMAL:
            startSound.currentTime = 0;
            startSound.play().catch(err => console.log("Erro ao tocar som:", err));

        setTimeout(() => {
                window.location.href = "../select/select.html";
            }, 200);
        });
    }});