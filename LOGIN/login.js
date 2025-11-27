import { API_BASE_URL } from '../api.js';

sessionStorage.removeItem("usuarioId");
sessionStorage.removeItem("usuarioNome");
// -----------------------------------------------------------------------

// variavel pra garantir que nao clique duas vezes no botao
let jaEstouLogando = false;

// como é um modulo, ele ja espera o html carregar sozinho
const btnLogin = document.getElementById("btnLogin");

if (btnLogin) {
    btnLogin.addEventListener("click", async (e) => {
        if (e) e.preventDefault();

        // seguranca: se ja tiver fazendo login, cancela esse clique novo
        if (jaEstouLogando) {
            return; 
        }

        // ativa a trava pra ninguem clicar de novo agora
        jaEstouLogando = true;
        
        // muda o texto pra avisar que ta processando
        const textoOriginal = btnLogin.innerText;
        btnLogin.innerText = "Entrando...";
        btnLogin.style.opacity = "0.7"; // deixa visualmente travado

        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        // funcao pra liberar o botao de novo se der erro
        const resetarSistema = () => {
            jaEstouLogando = false; // solta a trava
            btnLogin.innerText = textoOriginal;
            btnLogin.style.opacity = "1";
        };

        if (!email || !senha) {
            alert("Preencha e-mail e senha para entrar.");
            resetarSistema();
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({ email, senha })
            });

            const result = await response.json();

            if (response.ok) {
                // login funcionou
                sessionStorage.setItem("usuarioId", result.id);
                sessionStorage.setItem("usuarioNome", result.nome);
                
                alert("Bem-vindo(a), " + result.nome + "!");
                
                // manda pra home
                window.location.href = "../index.html";
                
                // obs: nao precisa destravar o botao aqui pq a pagina vai mudar
            } else {
                // senha ou email errados
                alert(result.error || "Falha no login.");
                resetarSistema();
            }

        } catch (error) {
            console.error(error);
            alert("Erro ao conectar ao servidor.");
            resetarSistema();
        }
    });
}