const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Images
const player = new Image();
player.src = "Images//player_front.png";

const enemyImg = new Image();
enemyImg.src = "Images/BubbleB.png";

const bulletImg = new Image();
bulletImg.src = "Images/bullet.png";

// Player data maor


// Sounds
const fireSound = document.getElementById("fireSound");
const hitSound = document.getElementById("hitSound");

// Player data
const bubble = {
  x: canvas.width / 2,
  y: canvas.height - 250,
  width: 120,
  height: 80,
  speed: 10
};

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
    enemies.push({ x: startX + c * spacingX, y: startY + r * spacingY });
  }
}

let canShoot = true;
let score = 0;
let gameOver = false;

function shoot() {
  if (canShoot) {
    bullets.push({ x: bubble.x, y: bubble.y - 20, speed: 5 });
    fireSound.play();
    canShoot = false;
    setTimeout(() => canShoot = true, 300);
  }
}

function update() {
  if (keys["ArrowLeft"] && bubble.x > bubble.width / 2) {
    bubble.x -= bubble.speed;
  }
  if (keys["ArrowRight"] && bubble.x < canvas.width - bubble.width / 2) {
    bubble.x += bubble.speed;
  }
  if (keys[" "] || keys["Spacebar"]) {
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
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score++;
        hitSound.play();
        break;
      }
    }
  }
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