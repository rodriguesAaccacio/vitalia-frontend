import { API_BASE_URL } from '../../api.js';

// ==================== GUARDA-COSTAS (SEGURANÇA) ==================== 
// // Verifica se o usuário está logado. Se não estiver, manda pro Login.
if (!sessionStorage.getItem("usuarioId")) {
  alert("Ops! Você precisa fazer login para jogar e salvar sua pontuação.");
  
  // ATENÇÃO: Ajuste os "../" abaixo dependendo de onde está sua pasta de Login
  // Se o jogo está em /QUIZeJOGOS/JOGO/ e o login na raiz ou pasta irmã:
  window.location.href = "../../LOGIN/login.html"; 
  
  // DICA: Se o caminho acima der erro 404, tente: "../../../login.html"
  throw new Error("Acesso negado: Usuário não logado."); // Para a execução do resto do código
}
// =================================================================== 
// // ==================== CONFIGURAÇÕES GLOBAIS ====================
const IMGS_PATH = './IMGSjogo/'; // Caminho p/ imagens
const SOUNDS_PATH = './IMGSjogo/'; // Caminho p/ sons

// ==================== VARIÁVEIS GLOBAIS ====================
let canvas, ctx;
let loadingContainer, progressFill;
let pauseScreen, gameOverScreen, levelCompleteScreen, victoryScreen, levelSelectScreen;
let pauseBtn, resumeBtn, restartBtn, mainMenuBtn;
let retryBtn, goToMenuBtn, nextLevelBtn, levelSelectFromComplete, menuFromComplete;
let playAgainBtn, victoryMenuBtn;
let muteBtn, menuBtn;
let livesCount, scoreCount, finalScore, levelScore, victoryScore;
let levelButtons;

let player, monsters = [], obstacles = [], fruits = [];
let collectSound, hitSound, GameOverSound, startSound, buttonSound;
let keys = {};
let paused = false;
let gameOver = false;
let victory = false;
let imagesLoaded = 0;
let totalImages = 0;
let soundMuted = false;
let currentLevel = 5;
let totalLevels = 5;

// ==================== INICIALIZAÇÃO DO JOGO ====================
window.addEventListener('load', function() {
// Inicializa elementos do DOM
initDOMElements();

// Configura event listeners
setupEventListeners();

// Inicializa o jogo
initGame();
});

// Inicializa elementos do DOM
function initDOMElements() {
canvas = document.getElementById('gameCanvas');
ctx = canvas.getContext('2d');
loadingContainer = document.getElementById('loadingContainer');
progressFill = document.querySelector('.progress-fill');
pauseScreen = document.getElementById('pauseScreen');
gameOverScreen = document.getElementById('gameOverScreen');
levelCompleteScreen = document.getElementById('levelCompleteScreen');
victoryScreen = document.getElementById('victoryScreen');
levelSelectScreen = document.getElementById('levelSelectScreen');

// Botões
pauseBtn = document.getElementById('pauseBtn');
resumeBtn = document.getElementById('resumeBtn');
restartBtn = document.getElementById('restartBtn');
mainMenuBtn = document.getElementById('mainMenuBtn');
retryBtn = document.getElementById('retryBtn');
goToMenuBtn = document.getElementById('goToMenuBtn');
nextLevelBtn = document.getElementById('nextLevelBtn');
levelSelectFromComplete = document.getElementById('levelSelectFromComplete');
menuFromComplete = document.getElementById('menuFromComplete');
playAgainBtn = document.getElementById('playAgainBtn');
victoryMenuBtn = document.getElementById('victoryMenuBtn');
muteBtn = document.getElementById('muteBtn');
menuBtn = document.getElementById('menuBtn');

// Elementos de texto
livesCount = document.getElementById('livesCount');
scoreCount = document.getElementById('scoreCount');
finalScore = document.getElementById('finalScore');
levelScore = document.getElementById('levelScore');
victoryScore = document.getElementById('victoryScore');

// Botões de seleção de nível
levelButtons = document.querySelectorAll('.level-btn');
}

// Configura event listeners
function setupEventListeners() {
// Controles de teclado
document.addEventListener('keydown', e => {
  if (gameOver || victory) return;
  keys[e.key] = true;
  if (e.key === "p" || e.key === "P") togglePause();
});

document.addEventListener('keyup', e => keys[e.key] = false);

// Controles de interface
pauseBtn.addEventListener('click', togglePause);
resumeBtn.addEventListener('click', togglePause);
restartBtn.addEventListener('click', restartGame);
mainMenuBtn.addEventListener('click', goToMainMenu);
retryBtn.addEventListener('click', restartGame);
goToMenuBtn.addEventListener('click', goToMainMenu);
nextLevelBtn.addEventListener('click', () => window.location.href = 'jogo.html');
levelSelectFromComplete.addEventListener('click', showLevelSelect);
menuFromComplete.addEventListener('click', goToMainMenu);
playAgainBtn.addEventListener('click', () => window.location.href = 'jogo.html');
victoryMenuBtn.addEventListener('click', goToMainMenu);
muteBtn.addEventListener('click', toggleMute);
menuBtn.addEventListener('click', showLevelSelect);

// Botão de voltar
const backToGameBtn = document.getElementById('backToGameBtn');
if (backToGameBtn) {
  backToGameBtn.addEventListener('click', hideLevelSelect);
}

// Botões de seleção de nível
levelButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const level = parseInt(btn.getAttribute('data-level'));
    window.location.href = level === 1 ? 'jogo.html' : `fase${level}.html`;
  });
});
}

// ==================== SISTEMA DE FASES BLOQUEADAS ====================

// Salva o progresso quando o jogador completa uma fase
function saveProgress(level) {
const unlockedLevel = parseInt(localStorage.getItem("unlockedLevel")) || 1;

// sempre guarda o maior nível alcançado
if (level > unlockedLevel) {
  localStorage.setItem("unlockedLevel", level);
}
}

// Botões da seleção de fase travam nas não liberadas
function updateLevelButtons() {
const unlockedLevel = parseInt(localStorage.getItem("unlockedLevel")) || 5;
const buttons = document.querySelectorAll(".level-btn");

buttons.forEach(btn => {
  const level = parseInt(btn.getAttribute("data-level"));

  if (level > unlockedLevel) {
    btn.disabled = true;
    btn.classList.add("locked");
  } else {
    btn.disabled = false;
    btn.classList.remove("locked");
    btn.onclick = () => {
      if (level === 1) {
        window.location.href = "jogo.html";
      } else {
        window.location.href = `fase${level}.html`;
      }
    };
  }
});
}

// Chamar essa função quando carregar o menu de seleção
window.addEventListener("load", updateLevelButtons);

// Chamar saveProgress() smp que uma fase for concluída
/*
function showLevelComplete() {
levelScore.textContent = player.score;
levelCompleteScreen.style.display = 'flex';
saveProgress(currentLevel);
}
*/


// Inicializa o jogo
function initGame() {
// Carrega dados salvos ou usa padrão
const savedLives = parseInt(localStorage.getItem("lives")) || 3;
const accumulatedScore = parseInt(localStorage.getItem("accumulatedScore")) || 0;

currentLevel = 5;

// Inicializa o player
const character = localStorage.getItem("selectedCharacter") || 'player1.png';

player = {
  x: 200,
  y: 200,
  size: 20,
  speed: 2,
  lives: savedLives,
  score: accumulatedScore,
  invincible: false,
  image: new Image()
};

player.image.src = IMGS_PATH + character;

// Inicializa sons
collectSound = new Audio(SOUNDS_PATH + 'collect.mp3');
hitSound = new Audio(SOUNDS_PATH + 'hit.mp3');
GameOverSound = new Audio(SOUNDS_PATH + 'GameOver.mp3');
startSound = new Audio(SOUNDS_PATH + 'start.mp3');
buttonSound = new Audio(SOUNDS_PATH + 'button.mp3');

if (!soundMuted) {
  startSound.currentTime = 0;
  startSound.play().catch(e => console.log("Erro ao reproduzir som"));
}

// Carrega o nível atual
loadLevel(currentLevel);
}

// ==================== GERENCIAMENTO DE NÍVEIS ====================
// Define os dados de cada nível
const levelData = {
5: {
  player: { x: 200, y: 250, speed: 1.2 },
  monsters: [
    { x: 50, y: 50, speed: 0.7 },
    { x: 350, y: 50, speed: 0.5 },
    { x: 50, y: 350, speed: 0.7 },
    { x: 200, y: 50, speed: 0.5 }
  ],
  obstacles: [
    { x: 0, y: 0, width: 150, height: 20 },
    { x: 250, y: 0, width: 150, height: 20 },
    { x: 0, y: 100, width: 100, height: 20 },
    { x: 300, y: 100, width: 100, height: 20 },
    { x: 100, y: 200, width: 200, height: 20 },
    { x: 0, y: 300, width: 100, height: 20 },
    { x: 300, y: 300, width: 100, height: 20 },
    { x: 0, y: 380, width: 150, height: 20 },
    { x: 250, y: 380, width: 150, height: 20 },
    { x: 150, y: 100, width: 20, height: 100 },
    { x: 230, y: 100, width: 20, height: 100 },
    { x: 150, y: 200, width: 20, height: 100 },
    { x: 230, y: 200, width: 20, height: 100 }
  ],
  fruits: [
    { x: 50, y: 150, type: 1 },
    { x: 350, y: 150, type: 2 },
    { x: 50, y: 250, type: 3 },
    { x: 350, y: 250, type: 1 },
    { x: 150, y: 50, type: 2 },
    { x: 250, y: 50, type: 3 },
    { x: 150, y: 350, type: 1 },
    { x: 250, y: 350, type: 2 },
    { x: 200, y: 320, type: 3 }
  ]
}
};

// Carrega um nível específico
function loadLevel(level) {
if (level < 1 || level > totalLevels) return;

currentLevel = level;

// Reseta o estado do jogo
monsters = [];
obstacles = [];
fruits = [];
imagesLoaded = 0;

// Obtém dados do nível
const data = levelData[level];

// Configura a posição do player
player.x = data.player.x;
player.y = data.player.y;
player.invincible = false;

// Cria monstros
data.monsters.forEach(m => {
  const monster = {
    x: m.x,
    y: m.y,
    size: 20,
    speed: m.speed,
    image: new Image()
  };
  monster.image.src = IMGS_PATH + 'enemy.png';
  monsters.push(monster);
});

// Cria obstáculos
data.obstacles.forEach(obs => {
  obstacles.push({
    x: obs.x,
    y: obs.y,
    width: obs.width,
    height: obs.height
  });
});

// Cria frutas
data.fruits.forEach(f => {
  const fruit = {
    x: f.x,
    y: f.y,
    size: 20,
    collected: false,
    image: new Image(),
    type: f.type
  };
  
  // Seleciona a imagem baseada no tipo
  if (f.type === 1) fruit.image.src = IMGS_PATH + 'fruit1.png';
  else if (f.type === 2) fruit.image.src = IMGS_PATH + 'fruit2.png';
  else fruit.image.src = IMGS_PATH + 'fruit3.png';
  
  fruits.push(fruit);
});

// Calcula o total de imagens a carregar
totalImages = 1 + monsters.length + fruits.length; // player + monstros + frutas

// Configura os event listeners para carregamento de imagens
player.image.onload = imageLoaded;

monsters.forEach(monster => {
  monster.image.onload = imageLoaded;
  monster.image.onerror = () => imageLoaded();
});

fruits.forEach(fruit => {
  fruit.image.onload = imageLoaded;
  fruit.image.onerror = () => imageLoaded();
});

// Mostra a tela de loading
showLoadingScreen();
}

// ==================== CONTROLES DE JOGO ====================
// Alterna pausa
function togglePause() {
if (gameOver || victory) return;
paused = !paused;
pauseScreen.style.display = paused ? 'flex' : 'none';
}

// Alterna mudo
function toggleMute() {
soundMuted = !soundMuted;
muteBtn.textContent = soundMuted ? '🔇' : '🔊';
collectSound.muted = soundMuted;
hitSound.muted = soundMuted;
}

// Reinicia o jogo
function restartGame() {
localStorage.setItem("lives", "3");
window.location.reload();
}

// Vai para o menu principal
function goToMainMenu() {
window.location.href = "../QUIZeJOGOS/homeJOGO/homej.html";
}

// Mostra seleção de nível quando pausa
const levelSelectBtn = document.querySelector("#levelSelectBtn")
levelSelectBtn.addEventListener("click", showLevelSelect)

// Mostra seleção de nível
function showLevelSelect() {
levelSelectScreen.style.display = 'flex';
paused = true;
}

// Esconde seleção de nível
function hideLevelSelect() {
levelSelectScreen.style.display = 'none';
paused = false;
}

// ==================== TELAS DE JOGO ====================
// Mostra tela de loading
function showLoadingScreen() {
loadingContainer.style.display = 'flex';
loadingContainer.style.opacity = '1';
progressFill.style.width = '0%';
}

// Esconde tela de loading
function hideLoadingScreen() {
loadingContainer.style.opacity = '0';
setTimeout(() => {
  loadingContainer.style.display = 'none';
}, 500);
}

// Mostra game over
function showGameOver() {
gameOver = true;
finalScore.textContent = player.score;
gameOverScreen.style.display = 'flex';

enviarPontuacaoParaBanco(player.score);

if (!soundMuted) {
  GameOverSound.currentTime = 0;
  GameOverSound.play().catch(e => console.log("Erro ao reproduzir som"));
}
}

// Mostra seleção de nível quando dá gameover
const levelSelectFromGameOver = document.querySelector("#levelSelectFromGameOver")
levelSelectFromGameOver.addEventListener("click", showLevelSelect)

// Mostra conclusão de nível
function showLevelComplete() {
levelScore.textContent = player.score;
levelCompleteScreen.style.display = 'flex';
paused = true;
}

// Mostra vitória final
function showVictory() {
victory = true;
victoryScore.textContent = player.score;
victoryScreen.style.display = 'flex';

enviarPontuacaoParaBanco(player.score);
}

// Avança para o próximo nível
function nextLevel() {
if (currentLevel < totalLevels) {
  // Salva o progresso
  localStorage.setItem("score", player.score.toString());
  localStorage.setItem("lives", player.lives.toString());
  
  // Redireciona para a próxima fase
  window.location.href = 'fase5.html';
} else {
  // Jogo completo
  showVictory();
}
}

// ==================== CARREGAMENTO DE IMAGENS ====================
// Chamada quando uma imagem é carregada
function imageLoaded() {
imagesLoaded++;
const progress = Math.round((imagesLoaded / totalImages) * 100);
progressFill.style.width = progress + '%';

if (imagesLoaded >= totalImages) {
  setTimeout(() => {
    hideLoadingScreen();
    if (!paused && !gameOver && !victory) {
      gameLoop();
    }
  }, 500);
}
}

// ==================== COLISÕES ====================
// Verifica colisão with obstáculos
function isCollidingWithObstacle(x, y, size) {
return obstacles.some(obs =>
  x < obs.x + obs.width &&
  x + size > obs.x &&
  y < obs.y + obs.height &&
  y + size > obs.y
);
}

// ==================== MOVIMENTO ====================
// Move o player
function movePlayer() {
let nextX = player.x;
let nextY = player.y;

if (keys['ArrowUp'] || keys['W'] || keys['w']) nextY -= player.speed;
if (keys['ArrowDown'] || keys['S'] || keys['s']) nextY += player.speed;
if (keys['ArrowLeft'] || keys['A'] || keys['a']) nextX -= player.speed;
if (keys['ArrowRight'] || keys['D'] || keys['d']) nextX += player.speed;

// Verifica limites do canvas e colisões
if (nextX >= 0 && nextX + player.size <= canvas.width &&
    !isCollidingWithObstacle(nextX, player.y, player.size)) {
  player.x = nextX;
}

if (nextY >= 0 && nextY + player.size <= canvas.height &&
    !isCollidingWithObstacle(player.x, nextY, player.size)) {
  player.y = nextY;
}
}

// Move um monstro
function moveMonster(monster) {
let nextX = monster.x;
let nextY = monster.y;

// Movimento em direção ao player
if (monster.x < player.x) nextX += monster.speed;
if (monster.x > player.x) nextX -= monster.speed;
if (monster.y < player.y) nextY += monster.speed;
if (monster.y > player.y) nextY -= monster.speed;

// Verifica colisões com obstáculos
if (!isCollidingWithObstacle(nextX, monster.y, monster.size)) monster.x = nextX;
if (!isCollidingWithObstacle(monster.x, nextY, monster.size)) monster.y = nextY;
}

// ==================== RENDERIZAÇÃO ====================
// Desenha o player
function drawPlayer() {
// Efeito piscante quando invencível
if (player.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
  return;
}

if (player.image.complete && player.image.naturalHeight !== 0) {
  ctx.drawImage(player.image, player.x, player.y, player.size, player.size);
} else {
  // Fallback caso a imagem não carregue
  ctx.fillStyle = "#3498db";
  ctx.fillRect(player.x, player.y, player.size, player.size);
}
}

// Desenha um monstro
function drawMonster(monster) {
if (monster.image.complete && monster.image.naturalHeight !== 0) {
  ctx.drawImage(monster.image, monster.x, monster.y, monster.size, monster.size);
} else {
  // Fallback
  ctx.fillStyle = "#e74c3c";
  ctx.fillRect(monster.x, monster.y, monster.size, monster.size);
}
}

// Desenha obstáculos
function drawObstacles() {
ctx.fillStyle = "#34495e";
obstacles.forEach(obs => {
  ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  ctx.strokeStyle = "#2c3e50";
  ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
});
}

// Desenha frutas
function drawFruits() {
fruits.forEach((fruit, index) => {
  if (!fruit.collected) {
    if (fruit.image.complete && fruit.image.naturalHeight !== 0) {
      ctx.drawImage(fruit.image, fruit.x, fruit.y, fruit.size, fruit.size);
    } else {
      // Fallback
      const colors = ["#e74c3c", "#f39c12", "#2ecc71"];
      ctx.fillStyle = colors[fruit.type - 1] || "#e74c3c";
      ctx.beginPath();
      ctx.arc(fruit.x + fruit.size/2, fruit.y + fruit.size/2, fruit.size/2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
});
}

// Desenha HUD
function drawHUD() {
// Atualiza elementos do DOM
livesCount.textContent = player.lives;
scoreCount.textContent = player.score;

// Desenha no canvas também
ctx.fillStyle = "#ecf0f1";
ctx.font = "1rem 'Segoe UI', sans-serif";
ctx.fillText(`Vidas: ${player.lives}`, 10, 20);
ctx.fillText(`Pontos: ${player.score}`, 10, 40);
ctx.fillText(`Fase ${currentLevel}`, canvas.width - 70, 20);
}

// ==================== LÓGICA DO JOGO ====================
// Verifica coleta de frutas
function checkFruitCollection() {
fruits.forEach(fruit => {
  if (!fruit.collected &&
    player.x < fruit.x + fruit.size &&
    player.x + player.size > fruit.x &&
    player.y < fruit.y + fruit.size &&
    player.y + player.size > fruit.y
  ) {
    fruit.collected = true;
    player.score += 10;
    
    // Aumenta a dificuldade
    monsters.forEach(monster => {
      monster.speed += 0.1;
    });
    
    // Toca som de coleta
    if (!soundMuted) {
      collectSound.currentTime = 0;
      collectSound.play().catch(e => console.log("Erro ao reproduzir som"));
    }
  }
});

// Verifica se todas as frutas foram coletadas
const allCollected = fruits.every(fruit => fruit.collected);
if (allCollected) {
  showVictory();
}
}

// Verifica colisão com monstros
function checkCollision() {
for (const monster of monsters) {
  if (
    player.x < monster.x + monster.size &&
    player.x + player.size > monster.x &&
    player.y < monster.y + monster.size &&
    player.y + player.size > monster.y
  ) {
    if (!player.invincible) {
      // Toca som de hit
      if (!soundMuted) {
        hitSound.currentTime = 0;
        hitSound.play().catch(e => console.log("Erro ao reproduzir som"));
      }
      
      // Perde uma vida
      player.lives--;
      livesCount.classList.add("vida-perdida");
      setTimeout(() => livesCount.classList.remove("vida-perdida"), 800);

      // Torna invencível temporariamente
      player.invincible = true;
      setTimeout(() => { player.invincible = false; }, 1500);

      // Game over se não tiver mais vidas
      if (player.lives <= 0) {
        showGameOver();
      }
      
      break; // Sai do loop após uma colisão
    }
  }
}
}

// ==================== LOOP PRINCIPAL ====================
function gameLoop() {
// Limpa o canvas
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Atualiza o jogo se não estiver pausado
if (!paused && !gameOver && !victory) {
  movePlayer();
  
  // Move todos os monstros
  monsters.forEach(monster => {
    moveMonster(monster);
  });
  
  checkCollision();
  checkFruitCollection();
}

// Renderiza o jogo
drawObstacles();
drawFruits();
drawPlayer();

// Desenha todos os monstros
monsters.forEach(monster => {
  drawMonster(monster);
});

drawHUD();

// Continua o loop
requestAnimationFrame(gameLoop);
} 

async function enviarPontuacaoParaBanco(pontosFinais) {
  const idUsuario = sessionStorage.getItem("usuarioId");
  
  // Se não tiver ID (usuário não logou), não tenta salvar
  if (!idUsuario) {
      console.warn("Usuário não logado. Pontuação não salva.");
      return;
  }

  try {
      // 🔴 MUDANÇA AQUI: 
      // 1. Usamos crases `` (aquelas inclinadas) em vez de aspas simples ''
      // 2. Colocamos ${API_BASE_URL} no lugar do localhost
      const response = await fetch(`${API_BASE_URL}/salvar-pontuacao`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
              userId: idUsuario,
              pontos: pontosFinais
          })
      });
      
      // ... o resto continua igual ...
      const data = await response.json();
      console.log("Status do salvamento:", data.message);
      
      if(data.newRecord) {
          console.log("NOVO RECORDE REGISTRADO!");
    }
  } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
  }
}