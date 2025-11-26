// espera a pagina carregar toda antes de rodar o codigo
document.addEventListener("DOMContentLoaded", () => {
  const fade = document.getElementById("fade"); // pega o fundo que escurece atras do modal

  // funcao pra abrir o modal
  function openModal(id) {
    document.getElementById(id).classList.add("show"); // mostra o modal certo
    fade.classList.add("show"); // mostra o fade por tras
  }

  // funcao pra fechar o modal
  function closeModal(id) {
    document.getElementById(id).classList.remove("show"); // esconde o modal
    fade.classList.remove("show"); // esconde o fade
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
  fade.addEventListener("click", () => {
    document.querySelectorAll(".modal.show").forEach(m => m.classList.remove("show")); // fecha todos
    fade.classList.remove("show"); // esconde o fade tbm
  }); });