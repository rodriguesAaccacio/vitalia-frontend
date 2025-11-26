document.addEventListener('DOMContentLoaded', function() {
  const characterCards = document.querySelectorAll('.character-card'); // todos os cards dos personagens
  const startBtn = document.getElementById('startBtn'); // botão iniciar
  const loadingContainer = document.getElementById('loadingContainer'); // container do loading
  let selectedCharacter = null; // personagem escolhido

  // som de clique/coleta
  const buttonSound = new Audio("../IMGSjogo/button.mp3");

  // efeito sombra quando passa o mouse nos cards
  characterCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (!card.classList.contains('selected')) {
        card.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)'; // mais sombra
      }
    });

    card.addEventListener('mouseleave', () => {
      if (!card.classList.contains('selected')) {
        card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)'; // sombra normal
      }
    });

    // clicar no personagem
    card.addEventListener('click', () => {
      characterCards.forEach(c => c.classList.remove('selected')); // tira seleção dos outros
      card.classList.add('selected'); // marca esse como selecionado
      selectedCharacter = card.dataset.file; // pega arquivo do personagem
      localStorage.setItem("selectedCharacter", selectedCharacter); // salva no storage

      // toca som de clique
      buttonSound.currentTime = 0;
      buttonSound.play();

      // ativa botão iniciar
      startBtn.disabled = false;
    });
  });

  // iniciar jogo
  startBtn.addEventListener('click', () => {
    if (!selectedCharacter) {
      showNotification('Escolha um personagem antes de começar!', 'error'); // alerta se n escolheu
      return;
    }
    
    // mostrar loading
    startBtn.classList.add('loading'); 
    loadingContainer.classList.add('visible');
    
    // simula carregamento antes de ir pra fase 1
    setTimeout(() => {
      window.location.href = "../jogo.html"; // leva pra fase 1
    }, 1500);
  });

  // função pra mostrar notificações
  function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) existingNotification.remove(); // remove se já tiver

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // estilo rápido
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 5px;
      color: white;
      font-weight: 500;
      z-index: 1000;
      animation: slideIn 0.3s ease, fadeOut 0.5s ease 2.5s forwards;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    // cores dependendo do tipo
    if (type === 'error') {
      notification.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
    } else {
      notification.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
    }

    document.body.appendChild(notification);

    // some depois de 3s
    setTimeout(() => {
      if (notification.parentNode) notification.parentNode.removeChild(notification);
    }, 3000);
  }

  // animações do slide e fade
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
});
