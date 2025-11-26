document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.getElementById("btnLogin");

    // CONFIGURAÇÃO DO SERVIDOR (Troque se for pra nuvem)
    const API_URL = API_BASE_URL;

    if (btnLogin) {
        btnLogin.addEventListener("click", async (e) => {
            if(e) e.preventDefault(); 

            const email = document.getElementById("email").value;
            const senha = document.getElementById("senha").value;

            // Tratamento de Erro: Campos Vazios
            if (!email || !senha) {
                alert("Preencha e-mail e senha para entrar.");
                return;
            }

            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include',
                    body: JSON.stringify({ email, senha })
                });

                const result = await response.json();

                if (response.ok) {
                    // SessionStorage conforme requisitos
                    sessionStorage.setItem("usuarioId", result.id);
                    sessionStorage.setItem("usuarioNome", result.nome);
                    
                    alert("Bem-vindo(a), " + result.nome + "!");
                    window.location.href = "../index.html"; 
                } else {
                    // Tratamento de Erro: Senha errada ou usuário inexistente
                    // O backend manda a mensagem certa no result.error
                    alert(result.error || "Falha no login.");
                }

            } catch (error) {
                console.error(error);
                alert("Erro ao conectar ao servidor.");
            }
        });
    }
});