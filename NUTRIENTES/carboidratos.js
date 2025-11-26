// espera a página carregar antes de rodar
document.addEventListener('DOMContentLoaded', function() {
    const prato = document.querySelector('.prato'); // pega o prato na tela
    let isRotating = false; // variável pra saber se o prato já tá girando

    // quando passar o mouse em cima do prato
    prato.addEventListener('mouseenter', function() {
        if (!isRotating) { // se ele n ta girando ainda
            isRotating = true; // marca que agora tá girando
            this.style.transform = 'rotate(360deg) scale(1.05)'; // gira e aumenta um pouquinho

            // depois que termina a animação, reseta tudo
            setTimeout(() => {
                this.style.transform = 'rotate(0deg) scale(1)'; // volta pro normal
                isRotating = false; // marca que parou de girar
            }, 800); // duração da animação
        }
    });
});
