const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Images
const player = new Image();
player.src = "Images//player_front.png";

const bulletImg = new Image();
bulletImg.src = "Images/bullet.png";

const heartImg = new Image();
heartImg.src = "Images/Heart.png";

// Sounds
const fireSound = document.getElementById("fireSound");
const hitSound = document.getElementById("hitSound");
const hit = document.getElementById("hit");

// Global Variables
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
let lastFrameTime = null;
let actualElapsedTime = 0;
let showOuch = false;
let gamePaused = false;
let endMessage = "";
let speedIntervalId = null;
let gameLoopRunning = false;

const bullets = [];
const enemies = [];
const keys = {};
const maxSpeedIncreases = 4;
const enemyRadius = 30;

// Load enemy images by color
const enemyImages = {
  red: new Image(),
  purple: new Image(),
  yellow: new Image(),
  green: new Image()
};

enemyImages.red.src = "Images/redEnemy.png";
enemyImages.purple.src = "Images/purpleEnemy.png";
enemyImages.yellow.src = "Images/yellowEnemy.png";
enemyImages.green.src = "Images/greenEnemy.png";

// Player's personal high scores – stored in localStorage per session
let highScores = JSON.parse(localStorage.getItem("highScore")) || [];
let currentUsername = sessionStorage.getItem("username") || null;

// Size player 
const bubble = {
  x: Math.random() * (canvas.width - 100) + 50,
  y: canvas.height - 90,
  width: 100,
  height: 80,
  speed: 10
};

// Size Enemies
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
/////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

document.addEventListener("keydown", e => {
  if ([" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
  }
  keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", e => {
  delete keys[e.key.toLowerCase()];
});

document.addEventListener("DOMContentLoaded", () => {
  // This is the "Let's Play" button in the navbar
  const startGameBtn = document.querySelector('[data-screen="game"]');
  const newGameBtn   = document.getElementById("newGameBtn");
  startGameBtn.addEventListener("click", () => {
    const config = JSON.parse(sessionStorage.getItem("gameConfig"));
    if (!config) {
      alert("Please set your game settings first.");
      return;
    }
    startNewGame();
  });

  if (newGameBtn) {
    newGameBtn.addEventListener("click", startNewGame);
  }

  // Stop music when exiting the game screen
  const exitBtn = document.querySelector('#game .menu-frame button[data-screen="welcome"]');
  if (exitBtn) {
    exitBtn.addEventListener("click", () => {
      const bgm = document.getElementById("gameMusic");
      if (bgm) bgm.pause();
    });
  }
});

//
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
  if (keys["arrowleft"] && bubble.x > bubble.width / 2) bubble.x -= bubble.speed;
  if (keys["arrowright"] && bubble.x < canvas.width - bubble.width / 2) bubble.x += bubble.speed;
  if (keys["arrowup"] && bubble.y > limitY) bubble.y -= bubble.speed;
  if (keys["arrowdown"] && bubble.y < canvas.height - bubble.height) bubble.y += bubble.speed;
/////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
  const config = JSON.parse(sessionStorage.getItem("gameConfig"));
  const shootKey = config?.shootKey || " ";

  if (keys[shootKey]) {
    shoot();
  }
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
    if (e.x + enemyRadius >= canvas.width || e.x - enemyRadius <= 0) {
      reachedEdge = true;
    }
  });
  if (reachedEdge) enemyDirection *= -1;
  

  handleEnemyShooting();
  checkEnemyBulletHitsPlayer();

  if (enemies.length === 0 && !gameOver) {
    gameOver = true;
    endMessage = "Champion!";
    endGame(score);
    if (currentUsername && score > 0) {
      saveScore(currentUsername, score);
    }
  }
}

function handleEnemyShooting() {
  if (
    enemyBullets.length === 0 ||
    enemyBullets[enemyBullets.length - 1].y > canvas.height * 0.75
  ) {
    const enemy = enemies[Math.floor(Math.random() * enemies.length)];
    if (enemy) {
      enemyBullets.push({
        x: enemy.x,
        y: enemy.y + 20,
        speed: bulletBaseSpeed,
        color: enemy.color,
        colorName: enemy.colorName
      });
      
    }
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
        endGame(score);
        if (currentUsername && score > 0) {
          saveScore(currentUsername, score);
        }
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
  }, 500);
}

// countdown timer - colled from drow
function getRemainingTime() {
  if (!gameStartTime || gameOver) return "00:00"; 
  const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);  
  const remain = Math.max(0, gameDurationInSec - elapsed);
  
  return `${String(Math.floor(remain / 60)).padStart(2, '0')}:${String(remain % 60).padStart(2, '0')}`;
}

let initialPlayerPosition = { x: 0, y: 0 };

function startNewGame() {

let currentUsername = sessionStorage.getItem("username");
  // Reset game state
  score = 0;
  lives = 3;
  gameOver = false;

  bubble.x = Math.random() * (canvas.width - 100) + 50;
  bubble.y = canvas.height - 90;

  // Save this starting position for resets
  initialPlayerPosition = { x: bubble.x, y: bubble.y };

  // Clear previous speed interval (in case one exists)
  if (speedIntervalId !== null) {
    clearInterval(speedIntervalId);
    speedIntervalId = null;
  }

  // Reset speed variables
  enemySpeed = 1;
  bulletBaseSpeed = 3;
  speedIncreaseCount = 0;

  // Get game configuration
  const config = JSON.parse(sessionStorage.getItem("gameConfig"));
  gameDurationInSec = config?.duration ? config.duration * 60 : 4 * 60;
  gameStartTime = Date.now();

  endMessage = "";

  // Apply background
  if (config?.background) {
    canvas.style.backgroundImage = `url('Images/${config.background}')`;
    canvas.style.backgroundSize = "cover";
    canvas.style.backgroundPosition = "center";
  }

  // Canvas size
  canvas.width = 700;
  canvas.height = 600;

  // Reset player & enemies

  enemies.length = 0;
  bulletBaseSpeed = 3;
  enemySpeed = 1;
  enemyDirection = 1;
  enemyBullets = [];

  const enemyRows = 4, enemyCols = 5;
  const colorNames = ["red", "purple", "yellow", "green"];
  for (let r = 0; r < enemyRows; r++) {
    for (let c = 0; c < enemyCols; c++) {
      enemies.push({
        x: enemyRadius + 10 + c * (enemyRadius * 2 + 10),
        y: enemyRadius + 10 + r * (enemyRadius * 2 + 10),
        row: r,
        colorName: colorNames[r]
      });
    }
  }
  
  // Start speed acceleration every 5 seconds (up to 4 times)
  speedIntervalId = setInterval(() => {
    if (speedIncreaseCount < maxSpeedIncreases) {
      enemySpeed += 0.5;
      bulletBaseSpeed += 0.5;
      speedIncreaseCount++;
    } else {
      clearInterval(speedIntervalId); // stop when reached max
    }
  }, 5000);

  if (!gameLoopRunning) {
    loop();
  }
  const bgm = document.getElementById("gameMusic");
  bgm.currentTime = 0;
  bgm.play();
}


function resetPlayerPosition() {
  bubble.x = initialPlayerPosition.x;
  bubble.y = initialPlayerPosition.y;
}
function draw() {
  // Clear the canvas for the new frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the player
  ctx.drawImage(player, bubble.x - bubble.width / 2, bubble.y, bubble.width, bubble.height);

  // Draw bullets
  bullets.forEach(b => ctx.drawImage(bulletImg, b.x - 8, b.y, 16, 32));
  
  // Draw enemies as colored circles
  enemies.forEach(e => {
    const img = enemyImages[e.colorName];
    if (img.complete) {
      const enemySize = 80;
      ctx.drawImage(img, e.x - enemySize / 2, e.y - enemySize / 2, enemySize, enemySize);
    }
  });

  // Draw enemy bullets using the enemy's image (scaled down)
  enemyBullets.forEach(b => {
    const img = enemyImages[b.colorName];
    if (img && img.complete) {
      const bulletSize = 24;
      ctx.drawImage(img, b.x - bulletSize / 2, b.y - bulletSize / 2, bulletSize, bulletSize);      
    } else {
      ctx.beginPath();
      ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = b.color || "red";
      ctx.fill();
      ctx.closePath();
    }
  });


  // Draw remaining time and current score
  ctx.fillStyle = "yellow";
  ctx.font = "20px 'Comic Sans MS', cursive";
  ctx.textAlign = "right";
  ctx.fillText(getRemainingTime(), canvas.width - 20, 20);
  ctx.textAlign = "left";
  ctx.fillText("Score: " + score, 20, 20);

  // Show "Ouch!" animation when player is hit
  if (showOuch && !gameOver) {
    ctx.font = "60px 'Comic Sans MS', cursive";
    ctx.textAlign = "center";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.strokeText("Ouch!", canvas.width / 2, canvas.height / 2);
    ctx.fillText("Ouch!", canvas.width / 2, canvas.height / 2);
  }

  // Show final game message if game is over (Champion!, You Lost!, etc.)
  if (gameOver) {
    ctx.font = "40px 'Comic Sans MS', cursive";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.textAlign = "center";
    ctx.strokeText(endMessage, canvas.width / 2, canvas.height / 2);
    ctx.fillText(endMessage, canvas.width / 2, canvas.height / 2);
  }
}

// Save score to localStorage
function saveScore(score) {
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const username = currentUser?.username || "Guest";

  const player = { username, score };
  highScores.push(player);
  highScores.sort((a, b) => b.score - a.score); // Highest first
  localStorage.setItem("highScores", JSON.stringify(highScores));
  updateHighScoreTable();
}


// Render high scores in HTML table
function updateHighScoreTable() {
  const table = document.getElementById("highScoreTable");
  if (!table) return;

  table.innerHTML = ""; // Clear previous
  highScores.forEach((score, index) => {
    const row = table.insertRow();
    row.insertCell(0).textContent = index + 1;
    row.insertCell(1).textContent = score.username;
    row.insertCell(2).textContent = score.score;
  });
}
function showHighScores() {
  const modal = document.getElementById("highScoresModal");
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const playerName = currentUser?.firstName || currentUser?.username || "Player";
  const playerScores = JSON.parse(localStorage.getItem("highScores")) || [];

  // Clear the previous table entries
  const tableBody = document.getElementById("highScoresTable").getElementsByTagName('tbody')[0];
  tableBody.innerHTML = ''; // Remove previous rows to avoid duplicates

  const playerNameElement = document.getElementById("playerNameHighScore");
  playerNameElement.textContent = `${playerName}'s High Scores`;

  playerScores
    .filter(score => score.username === currentUser?.username)
    .sort((a, b) => b.score - a.score)
    .forEach((score, index) => {
      const row = tableBody.insertRow();
      const rankCell = row.insertCell(0);
      const scoreCell = row.insertCell(1);
      rankCell.textContent = index + 1;
      scoreCell.textContent = score.score;
    });

  modal.style.display = "flex";

  // Close the modal when the X is clicked
  document.querySelector(".modal-close").addEventListener("click", () => {
    modal.style.display = "none";
  });
}



function endGame(score) {
  saveScore(score);
  
  setTimeout(() => {
    showHighScores();
  }, 3000); 
}

function loop() {
  // If game is already over, stop the loop
  if (gameOver) {
    gameLoopRunning = false;
    return;
  }

  // Start the loop if not running yet
  if (!gameLoopRunning) {
    gameLoopRunning = true;
  }

  // Update game state only if not paused
  if (!gamePaused) {
    update();
  }

  // Check if time is up
  const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
  if (!gameOver && elapsed >= gameDurationInSec) {
    gameOver = true;

    // Choose appropriate end message based on the score
    if (score < 100) {
      endMessage = `You can do better ${score}`;
    } else if (score < 250) {
      endMessage = "Winner!";
    } else {
      endMessage = "Champion!";
    }

    gameLoopRunning = false;  // Explicitly stop loop
    draw(); // Display the final message before showing the high score table

    // Delay high score modal by 3 seconds to let the message be visible
    setTimeout(() => {
      endGame(score);
    }, 3000);

    return;
  }
  
  // Render the current game frame
  draw();
  requestAnimationFrame(loop);
}

