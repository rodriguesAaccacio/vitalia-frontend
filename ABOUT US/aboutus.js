// Lista com os perfis do grupo, cada um com nome, insta, faculdade, resumo e foto
const perfis = {
    andressa: {
        nome: "Andressa Accacio",
        user: "Instagram: @andressaaxl",
        faculdade: "Estuda no: UNASP-SP",
        resumo: "Infos textuais, ajuda no design e envolvimento em todas as animações",
        imagem: "../HOME/imgs/andressa.png"
    },
    bruna: {
        nome: "Bruna Silva",
        user: "Instagram: @brunasmqs",
        faculdade: "Estuda no: UNASP-SP",
        resumo: "Infos textuais, ajuda no design e desenvolvedora da API no feedback",
        imagem: "../HOME/imgs/bruna.png"
    },
    myria: {
        nome: "Myriã Xavier",
        user: "Instagram: @myria.vi_",
        faculdade: "Estuda no: UNASP-SP",
        resumo: "Infos textuais, ajuda no design e envolvimento em todas as ligações",
        imagem: "../HOME/imgs/userCinza.png" // ainda sem foto real
    },
    nicolas: {
        nome: "Nicolas de Souza",
        user: "Sem rede social ativa",
        faculdade: "Estuda no: UNASP-SP",
        resumo: "Figuras, busca de textos, ajuda geral e desenvolvidor do quiz",
        imagem: "../HOME/imgs/userCinza.png"
    },
    rayssa: {
        nome: "Rayssa Cruz",
        user: "Instagram: @cqzray",
        faculdade: "Estuda no: UNASP-SP",
        resumo: "Editora chefe, ama estética e desenvolvidora do jogo",
        imagem: "../HOME/imgs/rayssa.png"
    }
};

// guarda qual perfil tá aberto, null se nenhum
let perfilVisivel = null;

// função q roda qnd clica numa foto
// nome = perfil da pessoa, imgElement = foto clicada
function mostrarPerfil(nome, imgElement) {
    const perfil = perfis[nome]; // pega infos do perfil
    const perfilCaixa = document.getElementById("perfil"); // caixinha do perfil

    // se clicou na msm pessoa q já tava aberta
    if (perfilVisivel === nome) {
        perfilCaixa.style.display = "none"; // fecha a caixinha
        imgElement.classList.remove('selecionada'); // tira destaque da foto
        perfilVisivel = null; // agora ninguem aberto
    } else {
        // se clicou em outra pessoa, mostra infos dela
        document.getElementById("nome").textContent = perfil.nome;
        document.getElementById("user").textContent = perfil.user;
        document.getElementById("faculdade").textContent = perfil.faculdade;
        document.getElementById("resumo").textContent = perfil.resumo;
        perfilCaixa.style.display = "block"; // mostra a caixinha

        // tira selecao de todas as fotos
        const todasImagens = document.querySelectorAll('.f');
        todasImagens.forEach(img => {
            img.classList.remove('selecionada'); // remove classe de destaque
        });

        imgElement.classList.add('selecionada'); // marca só a clicada
        perfilVisivel = nome; // atualiza qual ta aberto
    }
}
