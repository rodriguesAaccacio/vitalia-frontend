import { API_BASE_URL } from '../../api.js';

// ==================== GUARDA-COSTAS ====================
if (!sessionStorage.getItem("usuarioId")) {
  alert("Ops! Você precisa fazer login para jogar e salvar sua pontuação.");
  window.location.href = "../../LOGIN/login.html"; 
  throw new Error("Acesso negado: Usuário não logado.");
}

// ==================== CONFIGURAÇÕES GLOBAIS ====================
const IMGS_PATH = './IMGSjogo/'; 
const SOUNDS_PATH = './IMGSjogo/'; 

// ==================== VARIÁVEIS GLOBAIS ====================
let canvas, ctx;
let loadingContainer, progressFill;
let pauseScreen, gameOverScreen, levelCompleteScreen, levelSelectScreen;
let pauseBtn, resumeBtn, restartBtn, mainMenuBtn;
let retryBtn, goToMenuBtn, nextLevelBtn, levelSelectFromComplete, menuFromComplete;
let muteBtn, menuBtn;
let livesCount, scoreCount, finalScore, levelScore;
let levelButtons;

let player, monsters = [], obstacles = [], fruits = [];
let collectSound, hitSound, GameOverSound, startSound, buttonSound;
let keys = {};
let paused = false;
let gameOver = false;
let imagesLoaded = 0;
let totalImages = 0;
let soundMuted = false;
let currentLevel = 2; // <--- FASE 2
let totalLevels = 5;

// ==================== INICIALIZAÇÃO ====================
window.addEventListener('load', function() {
  initDOMElements();
  setupEventListeners();
  initGame();
});

 function initDOMElements() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  loadingContainer = document.getElementById('loadingContainer');
  progressFill = document.querySelector('.progress-fill');
  pauseScreen = document.getElementById('pauseScreen');
  gameOverScreen = document.getElementById('gameOverScreen');
  levelCompleteScreen = document.getElementById('levelCompleteScreen');
  levelSelectScreen = document.getElementById('levelSelectScreen');

  pauseBtn = document.getElementById('pauseBtn');
  resumeBtn = document.getElementById('resumeBtn');
  restartBtn = document.getElementById('restartBtn');
  mainMenuBtn = document.getElementById('mainMenuBtn');
  retryBtn = document.getElementById('retryBtn');
  goToMenuBtn = document.getElementById('goToMenuBtn');
  nextLevelBtn = document.getElementById('nextLevelBtn');
  levelSelectFromComplete = document.getElementById('levelSelectFromComplete');
  menuFromComplete = document.getElementById('menuFromComplete');
  muteBtn = document.getElementById('muteBtn');
  menuBtn = document.getElementById('menuBtn');

  livesCount = document.getElementById('livesCount');
  scoreCount = document.getElementById('scoreCount');
  finalScore = document.getElementById('finalScore');
  levelScore = document.getElementById('levelScore');

  levelButtons = document.querySelectorAll('.level-btn');
}

 function setupEventListeners() {
  document.addEventListener('keydown', e => {
    if (gameOver) return;
    keys[e.key] = true;
    if (e.key === "p" || e.key === "P") togglePause();
  });
  document.addEventListener('keyup', e => keys[e.key] = false);

  pauseBtn.addEventListener('click', togglePause);
  resumeBtn.addEventListener('click', togglePause);
  
  // Botões de Restart
  restartBtn.addEventListener('click', restartGame);
  retryBtn.addEventListener('click', restartGame);
  
  // Botões de Menu (Adicionei o save aqui tbm pra garantir)
  mainMenuBtn.addEventListener('click', goToMainMenu);
  goToMenuBtn.addEventListener('click', goToMainMenu);
  menuFromComplete.addEventListener('click', goToMainMenu);
  
  // O FAMOSO NEXT LEVEL IGUAL DA FASE 3
  nextLevelBtn.addEventListener('click', nextLevel);
  
  if (levelSelectFromComplete) levelSelectFromComplete.addEventListener('click', showLevelSelect);
  muteBtn.addEventListener('click', toggleMute);
  menuBtn.addEventListener('click', showLevelSelect);

  const backToGameBtn = document.getElementById('backToGameBtn');
  if (backToGameBtn) backToGameBtn.addEventListener('click', hideLevelSelect);

  levelButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const level = parseInt(btn.getAttribute('data-level'));
      window.location.href = level === 1 ? 'jogo.html' : `fase${level}.html`;
    });
  });
}

// SISTEMA DE FASE TRAVADA
function updateLevelButtons() {
  const unlockedLevel = parseInt(localStorage.getItem("unlockedLevel")) || 1;
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
         window.location.href = level === 1 ? 'jogo.html' : `fase${level}.html`;
      };
    }
  });
}
 window.addEventListener("load", updateLevelButtons);

// ==================== INITIALIZE GAME ====================
function initGame() {
  const savedLives = parseInt(localStorage.getItem("lives")) || 3;
  
  // Pega o score acumulado (igual fase 3 faz)
  let accumulatedScore = parseInt(localStorage.getItem("accumulatedScore"));
  if (isNaN(accumulatedScore)) accumulatedScore = 0;

  currentLevel = 2; // FORÇANDO FASE 2

  const character = localStorage.getItem("selectedCharacter") || 'player1.png';

  player = {
    x: 50, // Posição inicial Fase 2
    y: 350,
    size: 20,
    speed: 2,
    lives: savedLives,
    score: accumulatedScore,
    invincible: false,
    image: new Image()
  };
  player.image.src = IMGS_PATH + character;

  collectSound = new Audio(SOUNDS_PATH + 'collect.mp3');
  hitSound = new Audio(SOUNDS_PATH + 'hit.mp3');
  GameOverSound = new Audio(SOUNDS_PATH + 'GameOver.mp3');
  startSound = new Audio(SOUNDS_PATH + 'start.mp3');
  buttonSound = new Audio(SOUNDS_PATH + 'button.mp3');

  if (!soundMuted) {
    startSound.currentTime = 0;
    startSound.play().catch(e => console.log("Erro som"));
  }

  loadLevel(currentLevel);
}

// ==================== DADOS DA FASE 2 (INSERIDOS AQUI) ====================
const levelData = {
  2: {
    player: { x: 150, y: 350 },
    monsters: [
      { x: 200, y: 200, speed: 1.0 },
      { x: 350, y: 50, speed: 1.2 }
    ],
    obstacles: [
      { x: 100, y: 100, width: 200, height: 20 },
      { x: 50, y: 200, width: 20, height: 150 },
      { x: 200, y: 300, width: 150, height: 20 }
    ],
    fruits: [
      { x: 50, y: 350, type: 1 },
      { x: 350, y: 350, type: 2 },
      { x: 200, y: 50, type: 3 }
    ]
  }
};

 function loadLevel(level) {
  monsters = []; obstacles = []; fruits = []; imagesLoaded = 0;
  
  // Se por acaso vier level errado, segura no 2
  if (!levelData[level]) level = 2;

  const data = levelData[level];
  player.x = data.player.x;
  player.y = data.player.y;
  player.invincible = false;

  data.monsters.forEach(m => {
    const monster = { x: m.x, y: m.y, size: 20, speed: m.speed, image: new Image() };
    monster.image.src = IMGS_PATH + 'enemy.png';
    monsters.push(monster);
  });

  data.obstacles.forEach(obs => {
    obstacles.push({ x: obs.x, y: obs.y, width: obs.width, height: obs.height });
  });

  data.fruits.forEach(f => {
    const fruit = { x: f.x, y: f.y, size: 20, collected: false, image: new Image(), type: f.type };
    if (f.type === 1) fruit.image.src = IMGS_PATH + 'fruit1.png';
    else if (f.type === 2) fruit.image.src = IMGS_PATH + 'fruit2.png';
    else fruit.image.src = IMGS_PATH + 'fruit3.png';
    fruits.push(fruit);
  });

  totalImages = 1 + monsters.length + fruits.length;
  player.image.onload = imageLoaded;
  monsters.forEach(m => { m.image.onload = imageLoaded; m.image.onerror = imageLoaded; });
  fruits.forEach(f => { f.image.onload = imageLoaded; f.image.onerror = imageLoaded; });
  showLoadingScreen();
}

// ==================== CONTROLES E TELAS ====================
function togglePause() {
  if (gameOver) return;
  paused = !paused;
  pauseScreen.style.display = paused ? 'flex' : 'none';
}

 function toggleMute() {
  soundMuted = !soundMuted;
  muteBtn.textContent = soundMuted ? '🔇' : '🔊';
  collectSound.muted = soundMuted;
  hitSound.muted = soundMuted;
}

 function restartGame() {
  // Reinicia mantendo vidas em 3? Ou como estava?
  // O código da fase 3 reseta vidas para 3 no restart:
  localStorage.setItem("lives", "3");
  window.location.reload();
}

 function goToMainMenu() {
  // Adicionei salvamento aqui tbm pq não custa nada
  enviarPontuacaoParaBanco(player.score);
  window.location.href = "../select/select.html";
}

function showLevelSelect() { levelSelectScreen.style.display = 'flex'; paused = true; }
function hideLevelSelect() { levelSelectScreen.style.display = 'none'; paused = false; }

 function showLoadingScreen() {
  loadingContainer.style.display = 'flex';
  loadingContainer.style.opacity = '1';
  progressFill.style.width = '0%';
}

 function hideLoadingScreen() {
  loadingContainer.style.opacity = '0';
  setTimeout(() => { loadingContainer.style.display = 'none'; }, 500);
}

 function showGameOver() {
  gameOver = true;
  finalScore.textContent = player.score;
  gameOverScreen.style.display = 'flex';
  enviarPontuacaoParaBanco(player.score); // Salva ao morrer
  if (!soundMuted) GameOverSound.play().catch(e => console.log(e));
}

function showLevelComplete() {
  levelScore.textContent = player.score;
  levelCompleteScreen.style.display = 'flex';
  // AQUI a fase 3 não salva direto, ela espera clicar no botão
}

// ==================== A FUNÇÃO MÁGICA (CÓPIA DA FASE 3) ====================
function nextLevel() {
  if (currentLevel < totalLevels) {
    // Salva o progresso local
    localStorage.setItem("accumulatedScore", player.score.toString());
    localStorage.setItem("lives", player.lives.toString());
    
    // Salva no banco (SEM AWAIT, igual na Fase 3)
    enviarPontuacaoParaBanco(player.score); 
    
    // Redireciona
    window.location.href = 'fase3.html';
  }
}

// ==================== ASSET LOADING & LOOP ====================
function imageLoaded() {
  imagesLoaded++;
  const progress = Math.round((imagesLoaded / totalImages) * 100);
  progressFill.style.width = progress + '%';
  if (imagesLoaded >= totalImages) {
    setTimeout(() => {
      hideLoadingScreen();
      if (!paused && !gameOver) gameLoop();
    }, 500);
  }
}

 function isCollidingWithObstacle(x, y, size) {
  return obstacles.some(obs =>
    x < obs.x + obs.width && x + size > obs.x &&
    y < obs.y + obs.height && y + size > obs.y
  );
}

 function movePlayer() {
  let nextX = player.x;
  let nextY = player.y;

  if (keys['ArrowUp'] || keys['W'] || keys['w']) nextY -= player.speed;
  if (keys['ArrowDown'] || keys['S'] || keys['s']) nextY += player.speed;
  if (keys['ArrowLeft'] || keys['A'] || keys['a']) nextX -= player.speed;
  if (keys['ArrowRight'] || keys['D'] || keys['d']) nextX += player.speed;

  if (nextX >= 0 && nextX + player.size <= canvas.width && !isCollidingWithObstacle(nextX, player.y, player.size)) player.x = nextX;
  if (nextY >= 0 && nextY + player.size <= canvas.height && !isCollidingWithObstacle(player.x, nextY, player.size)) player.y = nextY;
}

function moveMonster(monster) {
  let nextX = monster.x;
  let nextY = monster.y;

  if (monster.x < player.x) nextX += monster.speed;
  if (monster.x > player.x) nextX -= monster.speed;
  if (monster.y < player.y) nextY += monster.speed;
  if (monster.y > player.y) nextY -= monster.speed;

  if (!isCollidingWithObstacle(nextX, monster.y, monster.size)) monster.x = nextX;
  if (!isCollidingWithObstacle(monster.x, nextY, monster.size)) monster.y = nextY;
}

function checkFruitCollection() {
  fruits.forEach(fruit => {
    if (!fruit.collected &&
      player.x < fruit.x + fruit.size && player.x + player.size > fruit.x &&
      player.y < fruit.y + fruit.size && player.y + player.size > fruit.y
    ) {
      fruit.collected = true;
      player.score += 10;
      monsters.forEach(m => m.speed += 0.1);
      if (!soundMuted) { collectSound.currentTime = 0; collectSound.play().catch(e => {}); }
    }
  });

  const allCollected = fruits.every(fruit => fruit.collected);
  if (allCollected) showLevelComplete();
}

function checkCollision() {
  for (const monster of monsters) {
    if (
      player.x < monster.x + monster.size && player.x + player.size > monster.x &&
      player.y < monster.y + monster.size && player.y + player.size > monster.y
    ) {
      if (!player.invincible) {
        if (!soundMuted) { hitSound.currentTime = 0; hitSound.play().catch(e => {}); }
        player.lives--;
        livesCount.classList.add("vida-perdida");
        setTimeout(() => livesCount.classList.remove("vida-perdida"), 800);
        player.invincible = true;
        setTimeout(() => { player.invincible = false; }, 1500);
        if (player.lives <= 0) showGameOver();
        break;
      }
    }
  }
}

function drawPlayer() {
  if (player.invincible && Math.floor(Date.now() / 100) % 2 === 0) return;
  if (player.image.complete && player.image.naturalHeight !== 0) ctx.drawImage(player.image, player.x, player.y, player.size, player.size);
  else { ctx.fillStyle = "#3498db"; ctx.fillRect(player.x, player.y, player.size, player.size); }
}

 function drawMonster(monster) {
  if (monster.image.complete && monster.image.naturalHeight !== 0) ctx.drawImage(monster.image, monster.x, monster.y, monster.size, monster.size);
  else { ctx.fillStyle = "#e74c3c"; ctx.fillRect(monster.x, monster.y, monster.size, monster.size); }
}

 function drawObstacles() {
  ctx.fillStyle = "#34495e";
  obstacles.forEach(obs => {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    ctx.strokeStyle = "#2c3e50";
    ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
  });
}

 function drawFruits() {
  fruits.forEach((fruit, index) => {
    if (!fruit.collected) {
      if (fruit.image.complete && fruit.image.naturalHeight !== 0) ctx.drawImage(fruit.image, fruit.x, fruit.y, fruit.size, fruit.size);
      else {
        const colors = ["#e74c3c", "#f39c12", "#2ecc71"];
        ctx.fillStyle = colors[fruit.type - 1] || "#e74c3c";
        ctx.beginPath();
        ctx.arc(fruit.x + fruit.size/2, fruit.y + fruit.size/2, fruit.size/2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
}
 function drawHUD() {
  livesCount.textContent = player.lives;
  scoreCount.textContent = player.score;
  ctx.fillStyle = "#ecf0f1";
  ctx.font = "1rem 'Segoe UI', sans-serif";
  ctx.fillText(`Vidas: ${player.lives}`, 10, 20);
  ctx.fillText(`Pontos: ${player.score}`, 10, 40);
  ctx.fillText(`Fase ${currentLevel}`, canvas.width - 70, 20);
} 
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!paused && !gameOver) {
    movePlayer();
    monsters.forEach(m => moveMonster(m));
    checkCollision();
    checkFruitCollection();
  }
  drawObstacles();
  drawFruits();
  drawPlayer();
  monsters.forEach(m => drawMonster(m));
  drawHUD();
  requestAnimationFrame(gameLoop);
} 

async function enviarPontuacaoParaBanco(pontosFinais) {
  const idUsuario = sessionStorage.getItem("usuarioId");
  if (!idUsuario) return;

  try {
    const response = await fetch(`${API_BASE_URL}/salvar-pontuacao`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ userId: idUsuario, pontos: pontosFinais })
      });
      
      // Mantivemos apenas o console.log para você ver no F12 se quiser, 
      // mas nada vai pular na tela do jogador.
      const data = await response.json();
    if(data.newRecord) {
          console.log("NOVO RECORDE REGISTRADO!");
      }

  } catch (error) {
      console.error("Erro ao conectar:", error);
  }
}