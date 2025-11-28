# 🥗 Vitalia - Frontend

Bem-vindo ao repositório frontend do **Vitalia**, uma plataforma web interativa focada em educação nutricional e saúde. O projeto combina uma enciclopédia interativa sobre nutrição com um sistema de **gamificação robusto**, onde o usuário aprende e testa seus conhecimentos.

## 🌟 Visão Geral do Projeto

O Vitalia guia o usuário por uma jornada de aprendizado que vai desde a história da alimentação até a nutrição moderna, culminando em um jogo arcade para fixação de conteúdo.

### 🎮 Mecânicas do Jogo (Game Logic)
O núcleo da gamificação (`jogo.js`) é um jogo estilo *arcade 2D* desenvolvido em **Canvas API**.

* **Objetivo:** Coletar todas as frutas espalhadas pelo mapa para avançar de nível.
* **Sistema de Pontuação:**
    * Cada fruta coletada: **+10 pontos**.
    * **Dificuldade Progressiva:** A cada fruta coletada, a velocidade dos inimigos aumenta em `0.1`, tornando o jogo mais desafiador dinamicamente.
* **Inimigos e Obstáculos:**
    * Monstros que perseguem o jogador ou patrulham áreas.
    * Sistema de colisão preciso: Ao ser atingido, o jogador perde uma vida e ganha **invencibilidade temporária** (efeito visual piscante).
* **Controles Híbridos:**
    * Suporta tanto setas direcionais (`ArrowKeys`) quanto padrão gamer (`WASD`).
* **Persistência de Dados:**
    * O jogo salva o progresso (fases desbloqueadas e vidas) via `sessionStorage`.
    * Ao fim da partida ou fase, a pontuação é enviada automaticamente para o banco de dados MySQL via API.

### 📚 Módulos Educativos
A interface principal (`index.html`) oferece navegação rica através de:

1.  **Caminho Vital (Linha do Tempo):** Uma seção interativa que conta a história da nutrição, desde 3000 a.C. até a atualidade, com popups informativos.
2.  **Conteúdos Detalhados:**
    * **Nutrientes:** Carboidratos, Fibras, Lipídios, Vitaminas, etc.
    * **Funções:** Sistema Imunológico, Saúde Mental, Metabolismo.
    * **Fases da Vida:** Gravidez, Infância e Senilidade.
3.  **Feedback:** Integração com **EmailJS** para envio de feedback dos usuários diretamente pelo site.

---

## 🚀 Diferenciais Técnicos

### 🔌 Conexão Inteligente com a API (`api.js`)
O frontend possui um sistema de detecção de ambiente para configurar a URL da API automaticamente. Não é necessário mudar o código entre desenvolvimento e produção:

```javascript
// Lógica simplificada do api.js
if (host === "localhost") {
    return "http://localhost:3333/api"; // Ambiente Local
} else if (host.includes("cloud")) {
    return origin.replace(/:[0-9]+/, ":3333") + "/api"; // Ambiente Escolar/Cloud
} else {
    return "[https://vitalia-backend-psi.vercel.app/api](https://vitalia-backend-psi.vercel.app/api)"; // Produção (Vercel)
}
````

### 🔒 Segurança no Frontend

  * Verificação de sessão ativa antes de carregar o jogo.
  * Bloqueio de fases futuras via validação no `sessionStorage`.
  * Feedback visual imediato para ações proibidas (ex: tentar acessar fase bloqueada).

-----

## 🛠️ Tecnologias Utilizadas

  * **Linguagens:** HTML5, CSS3, JavaScript (ES6+).
  * **Game Engine:** Nativa (HTML5 Canvas + RequestAnimationFrame).
  * **Bibliotecas Externas:**
      * `EmailJS`: Para formulário de contato.
      * Fontes Google (Inter, Literata, Lato).
  * **Assets:** Ícones e imagens otimizados.

-----

## 📂 Como executar o projeto

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/accacioArodrigues22a/vitalia-frontend.git](https://github.com/accacioArodrigues22a/vitalia-frontend.git)
    ```
2.  **Abra o projeto:**
      * Utilize o **Live Server** do VS Code para garantir que o carregamento de módulos JS funcione corretamente.
      * Abra o arquivo `HOME/inicio.html` ou `index.html` para iniciar a navegação.
3.  **Login:**
      * Para acessar o jogo, é necessário criar uma conta ou fazer login (conectado ao backend rodando localmente ou na nuvem).

-----

## 👥 Autores e Agradecimentos

Projeto desenvolvido com dedicação por:

  * **Andressa Accacio**
  * **Bruna Marques**
  * **Myriã Xavier**
  * **Nicolas de Souza**
  * **Rayssa Cruz**

**Agradecimentos Especiais:**

  * Prof. Márcio
  * Prof. Benones

-----

## 📝 Licença

Este projeto foi desenvolvido para fins acadêmicos.