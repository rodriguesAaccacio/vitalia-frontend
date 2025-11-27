import { API_BASE_URL } from '../api.js';

document.addEventListener("DOMContentLoaded", () => {
    // pega o botao de login la do html
    const btnLogin = document.getElementById("btnLogin");

    // traz a url da api pra ca e loga no console pra gente ter certeza q ta certo
    const API_URL = API_BASE_URL; 
    console.log("Conectando em:", API_URL);

    // so adiciona o evento se o botao existir msm na pagina
    if (btnLogin) {
        btnLogin.addEventListener("click", async (e) => {
            // isso aq evita q o formulario recarregue a pagina sozinho qnd clica
            if(e) e.preventDefault(); 

            // captura o q a pessoa digitou nos campos de email e senha
            const email = document.getElementById("email").value;
            const senha = document.getElementById("senha").value;

            // validacao basica: se faltou preencher algo, ja barra e avisa
            if (!email || !senha) {
                alert("Preencha e-mail e senha para entrar.");
                return;
            }

            try {
                // chama o backend na rota de login enviando os dados
                const response = await fetch(`${API_URL}/login`, {
                    method: "POST", // metodo post pq tamo mandando dados sensiveis
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include', // importante pra lidar com sessao/cookies
                    body: JSON.stringify({ email, senha })
                });

                // espera a resposta do servidor e converte pra json
                const result = await response.json();

                 // se a resposta for sucesso (status 200 ok)
                if (response.ok) {
                    // guarda o id e o nome no navegador (sessionStorage) pra usar dps no jogo
                    sessionStorage.setItem("usuarioId", result.id);
                    sessionStorage.setItem("usuarioNome", result.nome);
                    
                    alert("Bem-vindo(a), " + result.nome + "!");
                    // redireciona o usuario pra pagina principal do site
                    window.location.href = "../index.html"; 
                } else {
                    // se deu ruim (senha errada ou usuario nao existe), mostra o erro q veio do back
                    alert(result.error || "Falha no login.");
                }

            } catch (error) {
                // cai aq se o servidor tiver fora ou a net cair
                console.error(error);
                alert("Erro ao conectar ao servidor.");
            }
        });
    }
});