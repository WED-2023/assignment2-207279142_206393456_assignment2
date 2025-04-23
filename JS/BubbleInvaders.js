const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Images
const player = new Image();
player.src = "Images//player_front.png";

const enemyImg = new Image();
enemyImg.src = "Images/BubbleB.png";

const bulletImg = new Image();
bulletImg.src = "Images/bullet.png";

const heartImg = new Image();
heartImg.src = "Images/Heart.png";

// Sounds
const fireSound = document.getElementById("fireSound");
const hitSound = document.getElementById("hitSound");
const hit = document.getElementById("hit");

let canShoot = true;
let score = 0;
let gameStartTime = null;
let gameDurationInSec = 0;
let gameOver = false;

let enemyDirection = 1;
let enemySpeed = 1;
let enemyBullets = [];
let bulletBaseSpeed = 3;
let lastEnemyShotY = canvas.height;

let lives = 3;
let speedIncreaseCount = 0;
const maxSpeedIncreases = 4;

let showOuch = false;
let gamePaused = false;
let endMessage = "";

// Player data
const bubble = {
  x: Math.random() * (canvas.width - 100) + 50,
  y: canvas.height - 90,
  width: 100,
  height: 80,
  speed: 10
};
const initialPlayerPosition = { x: bubble.x, y: bubble.y };

const bullets = [];
const enemies = [];

const keys = {};
document.addEventListener("keydown", e => {
  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
    e.preventDefault();
  }
  keys[e.code] = true;
});

document.addEventListener("keyup", e => {
  delete keys[e.code];
});

// Load configuration
document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("navigate", e => {
    if (e.detail === "game") {
      const config = JSON.parse(sessionStorage.getItem("gameConfig"));
      if (config?.background) {
        canvas.style.backgroundImage = `url('Images/${config.background}')`;
        canvas.style.backgroundSize = "cover";
        canvas.style.backgroundPosition = "center";
      }
      if (config?.duration) {
        gameDurationInSec = config.duration * 60;
        gameStartTime = Date.now();
        setTimeout(() => {
          if (!gameOver) endGameByTime();
        }, gameDurationInSec * 1000);
      }
    }
  });
});

// Create 4x5 enemies
const enemyRows = 4, enemyCols = 5;
for (let r = 0; r < enemyRows; r++) {
  for (let c = 0; c < enemyCols; c++) {
    enemies.push({
      x: 60 + c * 80,
      y: 50 + r * 60,
      row: r
    });
  }
}

function shoot() {
  if (canShoot) {
    bullets.push({ x: bubble.x, y: bubble.y - 20, speed: 5 });
    fireSound.play();
    canShoot = false;
    setTimeout(() => canShoot = true, 300);
  }
}

function update() {
  const gameScreen = document.getElementById("game");
  if (!gameScreen.classList.contains("active")) return;

  const limitY = canvas.height * 0.6;
  if (keys["ArrowLeft"] && bubble.x > bubble.width / 2) bubble.x -= bubble.speed;
  if (keys["ArrowRight"] && bubble.x < canvas.width - bubble.width / 2) bubble.x += bubble.speed;
  if (keys["ArrowUp"] && bubble.y > limitY) bubble.y -= bubble.speed;
  if (keys["ArrowDown"] && bubble.y < canvas.height - bubble.height) bubble.y += bubble.speed;
  if (keys["Space"]) shoot();

  bullets.forEach(b => b.y -= b.speed);
  bullets.filter(b => b.y >= 0);

  for (let i = enemies.length - 1; i >= 0; i--) {
    for (let j = bullets.length - 1; j >= 0; j--) {
      const dx = enemies[i].x - bullets[j].x;
      const dy = enemies[i].y - bullets[j].y;
      if (Math.sqrt(dx * dx + dy * dy) < 50) {
        const row = enemies[i].row;
        score += [20, 15, 10, 5][row];
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        hitSound.play();
        break;
      }
    }
  }

  let reachedEdge = false;
  enemies.forEach(e => {
    e.x += enemyDirection * enemySpeed;
    if (e.x + 50 >= canvas.width || e.x - 50 <= 0) reachedEdge = true;
  });
  if (reachedEdge) enemyDirection *= -1;

  handleEnemyShooting();
  checkEnemyBulletHitsPlayer();

  if (enemies.length === 0 && !gameOver) {
    gameOver = true;
    endMessage = "Champion!";
  }
}

function handleEnemyShooting() {
  if (enemyBullets.length === 0 || enemyBullets[enemyBullets.length - 1].y > canvas.height * 0.75) {
    const enemy = enemies[Math.floor(Math.random() * enemies.length)];
    if (enemy) enemyBullets.push({ x: enemy.x, y: enemy.y + 20, speed: bulletBaseSpeed });
  }

  enemyBullets.forEach(b => b.y += b.speed);
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    if (enemyBullets[i].y > canvas.height) enemyBullets.splice(i, 1);
  }
}

function checkEnemyBulletHitsPlayer() {
  for (let i = 0; i < enemyBullets.length; i++) {
    const b = enemyBullets[i];
    if (
      b.x > bubble.x - bubble.width / 2 &&
      b.x < bubble.x + bubble.width / 2 &&
      b.y > bubble.y &&
      b.y < bubble.y + bubble.height
    ) {
      hit.play();
      lives--;
      triggerOuch();
      resetPlayerPosition();
      enemyBullets.splice(i, 1);
      if (lives <= 0) {
        gameOver = true;
        endMessage = "You Lost!";
      }
      break;
    }
  }
  updateLivesUI();
}

function updateLivesUI() {
  const hearts = document.querySelectorAll(".life-heart");
  hearts.forEach((h, i) => h.style.visibility = i < lives ? "visible" : "hidden");
}

function triggerOuch() {
  showOuch = true;
  gamePaused = true;
  setTimeout(() => {
    showOuch = false;
    gamePaused = false;
  }, 2000);
}

function getRemainingTime() {
  if (!gameStartTime || gameOver) return "00:00";
  const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
  const remain = Math.max(0, gameDurationInSec - elapsed);
  return `${String(Math.floor(remain / 60)).padStart(2, '0')}:${String(remain % 60).padStart(2, '0')}`;
}

function endGameByTime() {
  endMessage = score < 100 ? `You can do better (${score})` : "Winner!";
  gameOver = true;
}

function resetPlayerPosition() {
  bubble.x = initialPlayerPosition.x;
  bubble.y = initialPlayerPosition.y;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(player, bubble.x - bubble.width / 2, bubble.y, bubble.width, bubble.height);
  bullets.forEach(b => ctx.drawImage(bulletImg, b.x - 8, b.y, 16, 32));
  enemies.forEach(e => ctx.drawImage(enemyImg, e.x - 50, e.y - 50, 100, 100));
  enemyBullets.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  });

  ctx.fillStyle = "yellow";
  ctx.font = "20px 'Comic Sans MS', cursive";
  ctx.textAlign = "right";
  ctx.fillText(getRemainingTime(), canvas.width - 20, 10);
  ctx.textAlign = "left";
  ctx.fillText("Score: " + score, 20, 10);

  if (showOuch && !gameOver) {
    ctx.font = "60px 'Comic Sans MS', cursive";
    ctx.textAlign = "center";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.strokeText("Ouch!", canvas.width / 2, canvas.height / 2);
    ctx.fillText("Ouch!", canvas.width / 2, canvas.height / 2);
  }

  if (gameOver) {
    ctx.font = "40px 'Comic Sans MS', cursive";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.strokeText(endMessage, canvas.width / 2, canvas.height / 2);
    ctx.fillText(endMessage, canvas.width / 2, canvas.height / 2);
  }
}

function loop() {
  if (!gameOver) {
    if (!gamePaused) update();
    draw();
    requestAnimationFrame(loop);
  }
}
loop();
setInterval(() => {
  if (speedIncreaseCount < maxSpeedIncreases) {
    enemySpeed += 0.5;
    bulletBaseSpeed += 0.5;
    speedIncreaseCount++;
  }
}, 5000);
