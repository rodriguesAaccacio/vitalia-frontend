// cria o carrossel do Siema, tipo slideshow q troca os blocos
new Siema;

// função q mostra ou esconde o bloco de info
// id = id do bloco q vc clicou
function mostrarInfo(id) {
    const bloco = document.getElementById(id); // pega o bloco clicado

    // se o bloco já ta aberto, fecha ele
    if (bloco.classList.contains('ativo')) {
        bloco.classList.remove('ativo'); // tira a classe q mostra ele
    } else {
        // fecha todos os outros blocos antes de abrir esse
        document.querySelectorAll('.info').forEach(el => el.classList.remove('ativo'));

        // abre o bloco q clicou
        bloco.classList.add('ativo'); // marca como ativo
    }
}
