document.addEventListener("DOMContentLoaded", () => {
const btnCadastrar = document.getElementById("btnCadastrar");

    // CONFIGURAÇÃO DO SERVIDOR (Troque se for pra nuvem)
    const API_URL = API_BASE_URL;

    if (btnCadastrar) {
        btnCadastrar.addEventListener("click", async (e) => {
            if(e) e.preventDefault(); 

            const nome = document.getElementById("nome").value;
            const email = document.getElementById("email").value;
            const senha = document.getElementById("senha").value;
            
            // --- NOVA VALIDAÇÃO: CHECKBOX DOS TERMOS ---
            // Seleciona o checkbox pelo atributo name="conferido"
            const termosAceitos = document.querySelector('input[name="conferido"]');

            if (!termosAceitos || !termosAceitos.checked) {
                alert("Você precisa aceitar os termos de privacidade e diretrizes para continuar.");
                return; // Para o código aqui se não aceitou
            }
            // -------------------------------------------

            // Tratamento de Erro: Campos Vazios
            if (!nome || !email || !senha) {
                alert("Por favor, preencha todos os campos.");
                return;
            }

            // Validação simples de email
            if (!email.includes("@")) {
                alert("Por favor, insira um e-mail válido.");
                return;
            }

            try {
                const response = await fetch(`${API_URL}/cadastrar`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include',
                    body: JSON.stringify({ nome, email, senha })
                });

                const result = await response.json();

                if (response.ok) {
                    alert("Sucesso! Usuário cadastrado.");
                    window.location.href = "../LOGIN/login.html";
                } else {
                    // Tratamento de Erro: Mostra erro do backend (ex: Email já existe)
                    alert(result.error || "Erro ao cadastrar.");
                }

            } catch (error) {
                console.error(error);
                alert("Erro de conexão. O servidor está online?");
            }
        });
    }
});

// --- LÓGICA DOS MODAIS (TERMOS E DIRETRIZES) ---
document.addEventListener("DOMContentLoaded", () => {
    const fade = document.getElementById("fade"); // pega o fundo que escurece atras do modal
  
    // funcao pra abrir o modal
    function openModal(id) {
        const modal = document.getElementById(id);
        if(modal) {
            modal.classList.add("show"); // mostra o modal certo
            fade.classList.add("show"); // mostra o fade por tras
        }
    }
  
    // funcao pra fechar o modal
    function closeModal(id) {
        const modal = document.getElementById(id);
        if(modal) {
            modal.classList.remove("show"); // esconde o modal
            fade.classList.remove("show"); // esconde o fade
        }
    }
  
    // aqui pega todos os botoes que abrem modal (1 a 9)
    for (let i = 1; i <= 9; i++) {
        const botao = document.querySelector(`.botao${i}`);
        if (botao) { // se o botao existir
            botao.addEventListener("click", () => openModal(`modal${i}`)); // abre o modal certo
        }
    }
  
    // aqui pega todos os botoes de fechar dentro dos modais
    document.querySelectorAll(".fechar").forEach(botao => {
        botao.addEventListener("click", () => closeModal(botao.dataset.close)); // fecha o modal
    });
  
    // fecha todos os modais se clicar no fade
    if(fade) {
        fade.addEventListener("click", () => {
            document.querySelectorAll(".modal.show").forEach(m => m.classList.remove("show")); // fecha todos
            fade.classList.remove("show"); // esconde o fade tbm
        });
    }});