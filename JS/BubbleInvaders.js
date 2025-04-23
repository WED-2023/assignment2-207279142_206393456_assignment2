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

let canShoot = true;
let score = 0;
let gameStartTime = null;
let gameDurationInSec = 0;
let gameOver = false;

let enemyDirection = 1; 
let enemySpeed = 1; 

let enemyBullets = []; // מערך של כדורי אויב
let lastEnemyShotY = canvas.height;

let lives = 3;
let speedIncreaseCount = 0;
const maxSpeedIncreases = 4;
let bulletBaseSpeed = 3;
let showOuch = false;
let gamePaused = false;
let endMessage = "";



// document.addEventListener("DOMContentLoaded", () => {
//   window.addEventListener("navigate", e => {
//     if (e.detail === "game") {
//       const config = JSON.parse(sessionStorage.getItem("gameConfig"));
//       if (config && config.background) {
//         const canvas = document.getElementById("gameCanvas");
//         canvas.style.backgroundImage = `url('Images/${config.background}')`;
//         canvas.style.backgroundSize = "cover";
//         canvas.style.backgroundPosition = "center";
//       }
//     }
//   });
// });

// document.addEventListener("DOMContentLoaded", () => {
//   window.addEventListener("navigate", e => {
//     if (e.detail === "game") {
//       const config = JSON.parse(sessionStorage.getItem("gameConfig"));

//       if (config && config.background) {
//         const canvas = document.getElementById("gameCanvas");
//         canvas.style.backgroundImage = `url('Images/${config.background}')`;
//         canvas.style.backgroundSize = "cover";
//         canvas.style.backgroundPosition = "center";
//       }
//       if (config && config.duration) {
//         const durationInMs = config.duration * 60 * 1000;

//         setTimeout(() => {
//           if (!gameOver) {
//             endGameByTime();
//           }
//         }, durationInMs);
//       }
//     }
//   });
// });

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

      // ⬇️ הכניסי את זה כאן בדיוק
      if (config && config.duration) {
        gameDurationInSec = config.duration * 60;
        gameStartTime = Date.now();

        const durationInMs = gameDurationInSec * 1000;

        setTimeout(() => {
          if (!gameOver) {
            endGameByTime();
          }
        }, durationInMs);
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
// document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keydown", e => {
  if ([" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
  }
  keys[e.key] = true;
});

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
const shootKey = config.shootKey;

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
  if (keys[shootKey]) {
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

    if (enemies[i].x + 50 >= canvas.width || enemies[i].x - 50 <= 0) {
      reachedEdge = true;
    }
  }

  if (reachedEdge) {
    enemyDirection *= -1;
  }
  handleEnemyShooting();
  checkEnemyBulletHitsPlayer();
  if (enemies.length === 0 && !gameOver) {
    endMessage = "Champion!";
    gameOver = true;
  }
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
  if (enemyBullets.length === 0 || enemyBullets[enemyBullets.length - 1].y > canvas.height * 0.75) {
    const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
    if (randomEnemy) {
      enemyBullets.push(createEnemyBullet(randomEnemy.x, randomEnemy.y + 20));
    }
  }
  
  
  for (let bullet of enemyBullets) {
    bullet.y += bullet.speed;
  }


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

function triggerOuch() {
  showOuch = true;
  gamePaused = true;

  setTimeout(() => {
    showOuch = false;
    gamePaused = false;
  }, 2000);
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

function getRemainingTime() {
  if (!gameStartTime || gameOver) return "00:00";

  const elapsedSec = Math.floor((Date.now() - gameStartTime) / 1000);
  const remaining = Math.max(0, gameDurationInSec - elapsedSec);
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}


function endGameByTime() {
  if (score < 100) {
    endMessage = "You can do better (" + score + ")";
  } else {
    endMessage = "Winner!";
  }
  gameOver = true;
}

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
  // Draw timer (top right)
  ctx.fillStyle = "yellow";
  ctx.font = "20px 'Comic Sans MS', cursive";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillText(getRemainingTime(), canvas.width - 20, 10);

  // Draw score
  ctx.fillStyle = "yellow";
  ctx.font = "20px 'Comic Sans MS', cursive";
  ctx.textAlign = "left";           
  ctx.textBaseline = "top";      
  ctx.fillText("Score: " + score, 20, 10);

  if (showOuch && !gameOver) {
    ctx.fillStyle = "yellow";
    ctx.font = "60px 'Comic Sans MS', cursive";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
  
    ctx.strokeText("Ouch!", canvas.width / 2, canvas.height / 2);
    ctx.fillText("Ouch!", canvas.width / 2, canvas.height / 2);
  }
  
  if (gameOver) {
    ctx.font = "40px 'Comic Sans MS', cursive";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
  
    ctx.strokeText(endMessage, canvas.width / 2, canvas.height / 2);
    ctx.fillText(endMessage, canvas.width / 2, canvas.height / 2);
  }
  

}

function loop() {
  if(!gameOver){
    if (!gamePaused) {
      update();
  
    }
    draw();
    requestAnimationFrame(loop);
  }
}
loop();
setInterval(increaseEnemySpeed, 5000);