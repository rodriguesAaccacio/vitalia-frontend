// =================================================================// 1. LÓGICA DO USUÁRIO (LOGIN/LOGOUT)
// =================================================================
document.addEventListener("DOMContentLoaded", () => {
    
    const usuarioNome = sessionStorage.getItem("usuarioNome");
    const userInfoDiv = document.getElementById("user-info");

    if (userInfoDiv) {
        if (usuarioNome) {
            // --- ESTADO: LOGADO ---
            userInfoDiv.innerHTML = `
                <div class="user-profile">
                    <svg class="user-avatar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#A1CF6B">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <span class="user-greeting">Olá, ${usuarioNome}</span>
                </div>
                <button id="btnSair" class="btn-logout">SAIR</button>
            `;

            // Configuração do Modal de Logout
            const btnSair = document.getElementById("btnSair");
            const modalLogout = document.getElementById("modal-logout");
            const btnConfirmar = document.getElementById("btn-confirmar-logout");
            const btnCancelar = document.getElementById("btn-cancelar-logout");

            if(btnSair && modalLogout) {
                // 1. Abre o modal ao clicar em SAIR
                btnSair.addEventListener("click", (e) => {
                    e.preventDefault();
                    modalLogout.style.display = "flex"; 
                });

                // 2. Fecha o modal ao clicar em CANCELAR
                if(btnCancelar) {
                    btnCancelar.addEventListener("click", () => {
                        modalLogout.style.display = "none";
                    });
                }

                // 3. Desloga ao clicar em CONFIRMAR
                if(btnConfirmar) {
                    btnConfirmar.addEventListener("click", () => {
                        sessionStorage.removeItem("usuarioId");
                        sessionStorage.removeItem("usuarioNome");
                        alert("Você saiu da conta. Volte sempre!");
                        window.location.reload(); 
                    });
                }
                
                // Fecha se clicar fora da caixinha (no fundo preto)
                modalLogout.addEventListener("click", (e) => {
                    if (e.target === modalLogout) {
                        modalLogout.style.display = "none";
                    }
                });
            }

        } else {
            // --- ESTADO: DESLOGADO (O código que faltava) ---
            userInfoDiv.innerHTML = `
                <a href="../LOGIN/login.html" class="btn-login-nav">ENTRAR</a>
            `;
        }
    }
}); // <--- ESSA LINHA ERA A QUE FALTAVA (Fechando o primeiro bloco)


// =================================================================
// 2. LÓGICA DAS ANIMAÇÕES (SPLASH, CARROSSEL, POPUPS)
// =================================================================

const fade = document.getElementById("fade"); 

// Animação de splash screen
window.addEventListener('load', () => {
    const splash = document.getElementById('splash'); 
    const mainContent = document.getElementById('main-content'); 
    
    if(splash && mainContent) {
        const splashTime = 2000; 
        setTimeout(() => {
            splash.classList.add('hidden'); 
            mainContent.classList.add('visible'); 
        }, splashTime);
    }
});

// Funções Globais para Popups
window.abrirPopup = function(id) {
    const popup = document.getElementById(id);
    const fade = document.getElementById('fade');
    if (!popup) return;
    popup.style.display = "flex"; 
    if(fade) fade.classList.add("show"); 
}

window.fecharPopup = function(id) {
    const popup = document.getElementById(id);
    const fade = document.getElementById('fade');
    if (!popup) return; 
    popup.style.display = "none"; 
    if(fade) fade.classList.remove("show"); 
}

function fecharTodos() {
    document.querySelectorAll(".popup, .popup-feedback").forEach(p => p.style.display = "none"); 
    const fade = document.getElementById('fade');
    if(fade) fade.classList.remove("show"); 
}

if(fade) fade.addEventListener("click", fecharTodos);

document.querySelectorAll(".popup, .popup-feedback").forEach(popup => {
    popup.addEventListener("click", function(e) {
        e.stopPropagation(); 
    });
});

// Modais de imagem (Professores)
document.querySelectorAll("[data-modal]").forEach(el => {
    el.addEventListener("click", () => {
      const modalId = el.getAttribute("data-modal"); 
      const modal = document.getElementById(modalId);
      const fade = document.getElementById('fade');

      if (!modal) return;
  
      modal.classList.add("show"); 
      if(fade) fade.classList.add("show"); 
  
      if(fade) {
          fade.onclick = () => {
            modal.classList.remove("show"); 
            fade.classList.remove("show"); 
          };
      }
    modal.onclick = e => e.stopPropagation();
    });
}); 
// --- LÓGICA DO CARROSSEL ---
const track = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let index = 0;

if (track && prevBtn && nextBtn) {
    function updateCarousel() {
        const card = track.querySelector('.card');
        if(!card) return;

        const cardWidth = card.offsetWidth + 24; 
        track.style.transform = `translateX(${-index * cardWidth}px)`;

        prevBtn.disabled = index === 0;
        const cardsVisiveis = Math.floor(track.parentElement.offsetWidth / cardWidth);
        const totalCards = track.children.length;
        
        nextBtn.disabled = index >= totalCards - cardsVisiveis;
    }

    nextBtn.addEventListener('click', () => {
        index++;
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        index--;
        updateCarousel();
    });

    window.addEventListener('resize', updateCarousel);
    setTimeout(updateCarousel, 100);
}

// Scroll da seta (Arraste)
window.addEventListener("scroll", function () {
    const img = document.querySelector(".arraste img");
    if(img) {
        const limiteEmRem = 0.5;
        const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const limitePx = limiteEmRem * rootFontSize;
    
        if (window.scrollY > limitePx) {
            img.classList.add("oculto");
        } else {
            img.classList.remove("oculto");
        }
    }
});

// Animação do Título
document.addEventListener("DOMContentLoaded", () => {
const el = document.getElementById("title");
    if (el) {
      const text = el.textContent.trim();
      el.innerHTML = text
        .split("")
        .map((ch, i) =>
          `<span style="animation-delay:${i * 0.1}s">${ch === " " ? "&nbsp;" : ch}</span>`
        )
        .join("");
    }});