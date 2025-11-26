// espera a página carregar antes de rodar o código
document.addEventListener("DOMContentLoaded", () => {
  const fade = document.getElementById("fade"); // pega o fundo escuro
  const modals = document.querySelectorAll(".modal"); // pega todos os modais
  const imagens = document.querySelectorAll("[data-modal]"); // pega todas as imagens que abrem modal
  const botoesFechar = document.querySelectorAll(".fechar"); // pega os X de fechar

  // abrir modal quando clicar na imagem da vitamina
  imagens.forEach(img => {
    img.addEventListener("click", () => {
      const modalId = img.getAttribute("data-modal"); // pega qual modal abrir
      const modal = document.getElementById(modalId);

      fade.classList.add("show"); // mostra o fundo escuro
      modal.classList.add("show"); // mostra o modal
    });
  });

  // fechar modal clicando no X
  botoesFechar.forEach(btn => {
    btn.addEventListener("click", () => {
      const modalId = btn.getAttribute("data-close"); // qual modal fechar
      const modal = document.getElementById(modalId);

      fade.classList.remove("show"); // some fundo escuro
      modal.classList.remove("show"); // some modal
    });
  });

  // fechar modal clicando no fundo escuro
  fade.addEventListener("click", () => {
    fade.classList.remove("show"); // some o fade
    modals.forEach(m => m.classList.remove("show")); // some todos os modais
  });
});
