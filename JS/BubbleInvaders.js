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

let lives = 3;
let speedIncreaseCount = 0;
const maxSpeedIncreases = 4;
let bulletBaseSpeed = 3;


document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("navigate", e => {
    if (e.detail === "game") {
      const config = JSON.parse(sessionStorage.getItem("gameConfig"));
      if (config && config.background) {
        const canvas = document.getElementById("gameCanvas");
        canvas.style.backgroundImage = `url('Images/${config.background}')`;
        canvas.style.backgroundSize = "cover";
        canvas.style.backgroundPosition = "center";
      }
    }
  });
});

// Sounds
const fireSound = document.getElementById("fireSound");
const hitSound = document.getElementById("hitSound");
const hit = document.getElementById("hit");

// Player data
// const bubble = {
//   x: Math.floor(Math.random() * (canvas.width - 100)),  
//   y: canvas.height - 90,
//   width: 100,
//   height: 80,
//   speed: 10
// };

const bubble = {
  x: Math.random() * (canvas.width - 100) + 50,
  y: canvas.height - 90,
  width: 100,
  height: 80,
  speed: 10
};

// נשמור עותק של המיקום ההתחלתי
const initialPlayerPosition = { x: bubble.x, y: bubble.y };


// Bullets and enemies
const bullets = [];
const enemies = [];

const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => delete keys[e.key]);

// Create 4x5 enemies
const enemyRows = 4;
const enemyCols = 5;
const spacingX = 80;
const spacingY = 60;
const startX = 60;
const startY = 50;

for (let r = 0; r < enemyRows; r++) {
  for (let c = 0; c < enemyCols; c++) {
    enemies.push({
      x: startX + c * spacingX,
      y: startY + r * spacingY,
      row: r 
    });
  }
}


let canShoot = true;
let score = 0;
let gameOver = false;

let enemyDirection = 1; 
let enemySpeed = 1; 

let enemyBullets = []; // מערך של כדורי אויב
let lastEnemyShotY = canvas.height;

function shoot() {
  if (canShoot) {
    bullets.push({ x: bubble.x, y: bubble.y - 20, speed: 5 });
    fireSound.play();
    canShoot = false;
    setTimeout(() => canShoot = true, 300);
  }
}
// Load shootKey from gameConfig
const config = JSON.parse(sessionStorage.getItem("gameConfig")) || {};
const shootKey = config.shootKey ? config.shootKey.toUpperCase() : "SPACE";

function update() {
  const movementLimitY = canvas.height * 0.6;
  if (keys["ArrowLeft"] && bubble.x > bubble.width / 2) {
    bubble.x -= bubble.speed;
  }
  if (keys["ArrowRight"] && bubble.x < canvas.width - bubble.width / 2) {
    bubble.x += bubble.speed;
  }
  if (keys["ArrowUp"] && bubble.y > movementLimitY) {
    bubble.y -= bubble.speed;
  }
  if (keys["ArrowDown"] && bubble.y < canvas.height - bubble.height) {
    bubble.y += bubble.speed;
  }
  if (shootKey === "SPACE" && (keys[" "] || keys["Spacebar"])) {
    shoot();
  } else if (shootKey !== "SPACE" && keys[shootKey]) {
    shoot();
  }

  bullets.forEach(b => b.y -= b.speed);
  for (let i = bullets.length - 1; i >= 0; i--) {
    if (bullets[i].y < 0) bullets.splice(i, 1);
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    for (let j = bullets.length - 1; j >= 0; j--) {
      const dx = enemies[i].x - bullets[j].x;
      const dy = enemies[i].y - bullets[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 50) {
        const enemyRow = enemies[i].row;
        let points = 0;
        
        switch (enemyRow) {
          case 3: points = 5; break;
          case 2: points = 10; break;
          case 1: points = 15; break;
          case 0: points = 20; break;
        }
        
        score += points;
      
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        hitSound.play();
        break;
      }
    }
  }
    // הזזת כל האויבים
  let reachedEdge = false;
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].x += enemyDirection * enemySpeed;

    // בדיקה אם אחד מהם הגיע לקצה
    if (enemies[i].x + 50 >= canvas.width || enemies[i].x - 50 <= 0) {
      reachedEdge = true;
    }
  }

  // אם הגיעו לקצה – שנה כיוון
  if (reachedEdge) {
    enemyDirection *= -1;
  }
  handleEnemyShooting();
  checkEnemyBulletHitsPlayer();

}


function createEnemyBullet(x, y) {
  return {
    x,
    y,
    speed: bulletBaseSpeed,
    width: 8,
    height: 16
  };
}

function handleEnemyShooting() {
  // תנאי לירי
  if (enemyBullets.length === 0 || enemyBullets[enemyBullets.length - 1].y > canvas.height * 0.75) {
    const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
    if (randomEnemy) {
      enemyBullets.push(createEnemyBullet(randomEnemy.x, randomEnemy.y + 20));
    }
  }

  // תזוזה של כל כדור אויב
  for (let bullet of enemyBullets) {
    bullet.y += bullet.speed;
  }

  // מחיקת כדורים שיצאו מהמסך
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    if (enemyBullets[i].y > canvas.height) {
      enemyBullets.splice(i, 1);
    }
  }
}

function checkEnemyBulletHitsPlayer() {
  for (let i = 0; i < enemyBullets.length; i++) {
    const bullet = enemyBullets[i];
    if (
      bullet.x > bubble.x - bubble.width / 2 &&
      bullet.x < bubble.x + bubble.width / 2 &&
      bullet.y > bubble.y &&
      bullet.y < bubble.y + bubble.height
    ) {
      hit.play;
      lives--;
      resetPlayerPosition();
      enemyBullets.splice(i, 1);

      if (lives <= 0) {
        gameOver = true;
      }

      break;
    }
  }
  updateLivesUI();
}

function updateLivesUI() {
  const hearts = Array.from(document.querySelectorAll(".life-heart")).reverse();
  for (let i = 0; i < hearts.length; i++) {
    hearts[i].style.visibility = i < lives ? "visible" : "hidden";
  }
}

function increaseEnemySpeed() {
  if (speedIncreaseCount < maxSpeedIncreases) {
    enemySpeed += 0.5;
    bulletBaseSpeed += 0.5;
    speedIncreaseCount++;
    showSpeedUpText();
  }
}

// function showSpeedUpText() {
//   const gameScreen = document.getElementById("game");
//   const isVisible = gameScreen.classList.contains("active");

//   if (!isVisible) return; // לא נמצא בעמוד המשחק

//   const speedText = document.createElement("div");
//   speedText.textContent = "🔥 SPEED UP!";
//   speedText.style.position = "absolute";
//   speedText.style.top = "100px";
//   speedText.style.left = "50%";
//   speedText.style.transform = "translateX(-50%)";
//   speedText.style.fontSize = "36px";
//   speedText.style.color = "orange";
//   speedText.style.fontWeight = "bold";
//   speedText.style.zIndex = "1000";
//   speedText.style.animation = "fadeOut 2s ease-out";

//   document.body.appendChild(speedText);

//   setTimeout(() => {
//     speedText.remove();
//   }, 2000);
// }


function resetPlayerPosition() {
  bubble.x = initialPlayerPosition.x;
  bubble.y = initialPlayerPosition.y;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.drawImage(player, bubble.x - bubble.width / 2, bubble.y, bubble.width, bubble.height);

  // Draw bullets
  bullets.forEach(b => {
    ctx.drawImage(bulletImg, b.x - 8, b.y, 16, 32);
  });

  // Draw enemies
  enemies.forEach(e => {
    ctx.drawImage(enemyImg, e.x - 50, e.y - 50, 100, 100); // using 100x100 as size
  });



  enemyBullets.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "red"; 
    ctx.fill();
    ctx.closePath();
  });

  // Draw score
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);

  if (gameOver) {
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
  }

}

function loop() {
  if (!gameOver) {
    update();
    draw();
    requestAnimationFrame(loop);
  }
}
loop();
setInterval(increaseEnemySpeed, 5000);