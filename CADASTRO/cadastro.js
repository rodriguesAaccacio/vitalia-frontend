
import { API_BASE_URL } from '../api.js'

document.addEventListener("DOMContentLoaded", () => {
    const btnCadastrar = document.getElementById("btnCadastrar")
    const API_URL = API_BASE_URL 
    console.log("Conectando em:", API_URL)

    if (btnCadastrar) {
        btnCadastrar.addEventListener("click", async (e) => {
            if(e) e.preventDefault() 

            const nome = document.getElementById("nome").value
            const email = document.getElementById("email").value
            const senha = document.getElementById("senha").value

            const termosAceitos = document.querySelector('input[name="conferido"]')

            if (!termosAceitos || !termosAceitos.checked) {
                alert("Você precisa aceitar os termos de privacidade e diretrizes para continuar.")
                return
            }
             if (!nome || !email || !senha) {
                alert("Por favor, preencha todos os campos.")
                return
            }
             if (!email.includes("@")) {
                alert("Por favor, insira um e-mail válido.")
                return
            }

            try {
                const response = await fetch(`${API_URL}/cadastrar`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include',
                    body: JSON.stringify({ nome, email, senha })
                })

                const result = await response.json()

                if (response.ok) {
                    alert("Sucesso! Usuário cadastrado.")
                    window.location.href = "../LOGIN/login.html"
                } else {
                    alert(result.error || "Erro ao cadastrar.")
                }

            } catch (error) {
                console.error(error)
                alert("Erro de conexão. O servidor está online?")
            }
        })
    }
})

 document.addEventListener("DOMContentLoaded", () => {
    const fade = document.getElementById("fade")
  
     function openModal(id) {
        const modal = document.getElementById(id)
        if(modal) {
            modal.classList.add("show") 
            fade.classList.add("show") 
        }
    }
  
     function closeModal(id) {
        const modal = document.getElementById(id)
        if(modal) {
            modal.classList.remove("show")
            fade.classList.remove("show")
        }
    }
  
    
    for (let i = 1; i <= 9; i++) {
        const botao = document.querySelector(`.botao${i}`)
        if (botao) {
            botao.addEventListener("click", () => openModal(`modal${i}`))
        }
    }
  
     document.querySelectorAll(".fechar").forEach(botao => {
        botao.addEventListener("click", () => closeModal(botao.dataset.close))
    })
  
     if(fade) {
        fade.addEventListener("click", () => {
            document.querySelectorAll(".modal.show").forEach(m => m.classList.remove("show"))
            fade.classList.remove("show")
        })
    }})