document.addEventListener("DOMContentLoaded", () => {
    
    // tenta puxar o nome do usuario q ta salvo na sessao e a div de info
    const usuarioNome = sessionStorage.getItem("usuarioNome")
    const userInfoDiv = document.getElementById("user-info")

    // se a div de info existir na pagina, a gente mexe nela
    if (userInfoDiv) {
        // caso o usuario esteja logado (tem nome salvo)
        if (usuarioNome) {
            // monta o html do perfil com o icone e o botao de sair
            userInfoDiv.innerHTML = `
                <div class="user-profile">
                    <svg class="user-avatar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#A1CF6B">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <span class="user-greeting">Olá, ${usuarioNome}</span>
                </div>
                <button id="btnSair" class="btn-logout">SAIR</button>
            `

            // pega os botoes do modal de logout pra fazer funcionar
            const btnSair = document.getElementById("btnSair")
            const modalLogout = document.getElementById("modal-logout")
            const btnConfirmar = document.getElementById("btn-confirmar-logout")
            const btnCancelar = document.getElementById("btn-cancelar-logout")

            // verifica se o botao e o modal existem antes de add evento
            if(btnSair && modalLogout) {
                btnSair.addEventListener("click", (e) => {
                    e.preventDefault()
                    // mostra o modal perguntando se quer sair msm
                    modalLogout.style.display = "flex" 
                })

                // se clicar em cancelar, so esconde o modal
                if(btnCancelar) {
                    btnCancelar.addEventListener("click", () => {
                        modalLogout.style.display = "none"
                    })
                }

                // se confirmar, ai sim desloga
                if(btnConfirmar) {
                    btnConfirmar.addEventListener("click", () => {
                        // limpa tudo da sessao
                        sessionStorage.removeItem("usuarioId")
                        sessionStorage.removeItem("usuarioNome")
                        alert("Você saiu da conta. Volte sempre!")
                        // recarrega a pagina pra atualizar o estado
                        window.location.reload() 
                    })
                }
                
                // fecha o modal se clicar fora dele (no fundo escuro)
                modalLogout.addEventListener("click", (e) => {
                    if (e.target === modalLogout) {
                        modalLogout.style.display = "none"
                    }
                })
            }

        } else {
            // se n tiver logado, mostra so o botaozao de entrar
            userInfoDiv.innerHTML = `
                <a href="../LOGIN/login.html" class="btn-login-nav">ENTRAR</a>
            `
        }
    }
})


// pega o elemento q faz o fundo escuro (fade)
const fade = document.getElementById("fade") 

// --- Animação de splash screen (aquela tela de carregamento inicial) ---
window.addEventListener('load', () => {
    const splash = document.getElementById('splash') 
    const mainContent = document.getElementById('main-content') 
    
    if(splash && mainContent) {
        const splashTime = 2000 // tempo q a tela de load fica (2s)
        setTimeout(() => {
            splash.classList.add('hidden') // esconde o load
            mainContent.classList.add('visible') // mostra o site
        }, splashTime)
    }
})

// funcao global pra abrir qualquer popup pelo ID
window.abrirPopup = function(id) {
    const popup = document.getElementById(id)
    const fade = document.getElementById('fade')
    if (!popup) return
    popup.style.display = "flex" 
    if(fade) fade.classList.add("show") // escurece o fundo
}

// funcao global pra fechar
window.fecharPopup = function(id) {
    const popup = document.getElementById(id)
    const fade = document.getElementById('fade')
    if (!popup) return 
    popup.style.display = "none" 
    if(fade) fade.classList.remove("show") 
}

// fecha tudo q tiver aberto qnd clica no fundo escuro
function fecharTodos() {
    document.querySelectorAll(".popup, .popup-feedback").forEach(p => p.style.display = "none") 
    const fade = document.getElementById('fade')
    if(fade) fade.classList.remove("show") 
}

if(fade) fade.addEventListener("click", fecharTodos)

// evita q o clique DENTRO do popup feche ele (propagacao de evento)
document.querySelectorAll(".popup, .popup-feedback").forEach(popup => {
    popup.addEventListener("click", function(e) {
        e.stopPropagation() 
    })
})

// logica generica pra qualquer elemento q tenha o atributo data-modal
document.querySelectorAll("[data-modal]").forEach(el => {
    el.addEventListener("click", () => {
      const modalId = el.getAttribute("data-modal") 
      const modal = document.getElementById(modalId)
      const fade = document.getElementById('fade')

      if (!modal) return
  
      modal.classList.add("show") 
      if(fade) fade.classList.add("show") 
  
      // garante q se clicar no fundo tbm fecha esse modal especifico
      if(fade) {
          fade.onclick = () => {
            modal.classList.remove("show") 
            fade.classList.remove("show") 
          }
      }
    modal.onclick = e => e.stopPropagation()
    })
}) 

// --- Logica do Carrossel ---
const track = document.querySelector('.carousel-track')
const prevBtn = document.querySelector('.prev')
const nextBtn = document.querySelector('.next')
let index = 0

if (track && prevBtn && nextBtn) {
    function updateCarousel() {
        const card = track.querySelector('.card')
        if(!card) return

        // calcula largura do card + margem pra saber qnto tem q andar
        const cardWidth = card.offsetWidth + 24 
        // move a trilha do carrossel
        track.style.transform = `translateX(${-index * cardWidth}px)`

        // desabilita botao de voltar se tiver no inicio
        prevBtn.disabled = index === 0
        
        // contas matematicas pra saber qnd chegou no fim e desabilitar o botao next
        const cardsVisiveis = Math.floor(track.parentElement.offsetWidth / cardWidth)
        const totalCards = track.children.length
        
        nextBtn.disabled = index >= totalCards - cardsVisiveis
    }

    // avanca um card
    nextBtn.addEventListener('click', () => {
        index++
        updateCarousel()
    })

    // volta um card
    prevBtn.addEventListener('click', () => {
        index--
        updateCarousel()
    })

    // se redimensionar a tela, recalcula tudo pra nao quebrar
    window.addEventListener('resize', updateCarousel)
    setTimeout(updateCarousel, 100)
}

// esconde aquela setinha de "arraste pra baixo" qnd a pessoa comeca a rolar a tela
window.addEventListener("scroll", function () {
    const img = document.querySelector(".arraste img")
    if(img) {
        const limiteEmRem = 0.5
        // converte rem pra pixel pra fazer a conta certa
        const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
        const limitePx = limiteEmRem * rootFontSize
    
        if (window.scrollY > limitePx) {
            img.classList.add("oculto")
        } else {
            img.classList.remove("oculto")
        }
    }
})

// animacao das letras do titulo aparecendo uma por uma
document.addEventListener("DOMContentLoaded", () => {
const el = document.getElementById("title")
    if (el) {
      const text = el.textContent.trim()
      // quebra o texto letra por letra e coloca num span com delay diferente
      el.innerHTML = text
        .split("")
        .map((ch, i) =>
          `<span style="animation-delay:${i * 0.1}s">${ch === " " ? "&nbsp" : ch}</span>`
        )
        .join("")
    }})