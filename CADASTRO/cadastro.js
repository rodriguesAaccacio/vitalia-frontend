import { API_BASE_URL } from '../api.js';

// variavel pra controlar se o cadastro ja ta rolando pra evitar clique duplo
let jaEstouCadastrando = false;

const btnCadastrar = document.getElementById("btnCadastrar");

if (btnCadastrar) {
    btnCadastrar.addEventListener("click", async (e) => {
        if (e) e.preventDefault();

        // se ja estiver cadastrando, para tudo aqui e nao deixa continuar
        if (jaEstouCadastrando) {
            return;
        }

        // ativa a trava pra impedir novos cliques
        jaEstouCadastrando = true;
        
        // muda o texto do botao pra avisar pro usuario que ta carregando
        const textoOriginal = btnCadastrar.innerText;
        btnCadastrar.innerText = "Cadastrando...";
        btnCadastrar.style.opacity = "0.7"; // deixa o botao meio transparente

        // pega o que o usuario digitou
        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;
        const termosAceitos = document.querySelector('input[name="conferido"]');

        // funcao pra voltar o botao ao normal caso de algum erro
        const resetarSistema = () => {
            jaEstouCadastrando = false;
            btnCadastrar.innerText = textoOriginal;
            btnCadastrar.style.opacity = "1";
        };

        // verificacoes basicas antes de mandar pro servidor
        if (!termosAceitos || !termosAceitos.checked) {
            alert("Você precisa aceitar os termos de privacidade e diretrizes para continuar.");
            resetarSistema();
            return;
        }
        if (!nome || !email || !senha) {
            alert("Por favor, preencha todos os campos.");
            resetarSistema();
            return;
        }
        if (!email.includes("@")) {
            alert("Por favor, insira um e-mail válido.");
            resetarSistema();
            return;
        }

        try {
            const API_URL = API_BASE_URL;
            console.log("Conectando em:", API_URL);

            // manda os dados pro backend
            const response = await fetch(`${API_URL}/cadastrar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({ nome, email, senha })
            });

            const result = await response.json();

            if (response.ok) {
                // deu tudo certo no cadastro
                alert("Sucesso! Usuário cadastrado.");
                window.location.href = "../LOGIN/login.html";
                // nao destravamos aqui pq a pagina ja vai mudar
            } else {
                // deu erro (tipo email ja existe)
                alert(result.error || "Erro ao cadastrar.");
                resetarSistema(); // libera o botao pra tentar de novo
            }

        } catch (error) {
            console.error(error);
            alert("Erro de conexão. O servidor está online?");
            resetarSistema();
        }
    });
}

// =========================================================
// logica do modal (janelinha dos termos)
// =========================================================
const fade = document.getElementById("fade");

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add("show");
        fade.classList.add("show");
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove("show");
        fade.classList.remove("show");
    }
}

// quando clica no texto "termos de privacidade"
const botaoTermos = document.getElementById("botao1"); 
if (botaoTermos) {
    botaoTermos.addEventListener("click", () => openModal("modal1"));
}

// faz o x fechar o modal
document.querySelectorAll(".fechar").forEach(botao => {
    botao.addEventListener("click", () => closeModal(botao.dataset.close));
});

// se clicar fora da janelinha (no fundo escuro), fecha tambem
if (fade) {
    fade.addEventListener("click", () => {
        document.querySelectorAll(".modal.show").forEach(m => m.classList.remove("show"));
        fade.classList.remove("show");
    });
}