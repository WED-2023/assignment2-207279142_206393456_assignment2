/*const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = new Image();
player.src = "images/playerB.png";

const enemyImg = new Image();
enemyImg.src = "Images/BubbleB.png";



const fireSound = document.getElementById("fireSound");
const hitSound = document.getElementById("hitSound");

const bubble = { x: canvas.width / 2, y: canvas.height - 60, width: 40, height: 60, speed: 5 };
const bullets = [];
const enemies = [];

const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => delete keys[e.key]);

const enemyRows = 3;
const enemyCols = 8;
const spacing = 40;
for (let r = 0; r < enemyRows; r++) {
  for (let c = 0; c < enemyCols; c++) {
    enemies.push({ x: 50 + c * spacing, y: 50 + r * spacing, radius: 10 });
  }
}

let canShoot = true;
let score = 0;
let gameOver = false;

function shoot() {
  if (canShoot) {
    bullets.push({ x: bubble.x, y: bubble.y, speed: 5 });
    fireSound.play();
    canShoot = false;
    setTimeout(() => canShoot = true, 300);
  }
}

function update() {
  if (keys["ArrowLeft"] && bubble.x > 0) bubble.x -= bubble.speed;
  if (keys["ArrowRight"] && bubble.x < canvas.width - bubble.width) bubble.x += bubble.speed;
  if (keys[" "] || keys["Spacebar"]) shoot();

  bullets.forEach(b => b.y -= b.speed);
  for (let i = bullets.length - 1; i >= 0; i--) {
    if (bullets[i].y < 0) bullets.splice(i, 1);
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    for (let j = bullets.length - 1; j >= 0; j--) {
      const dx = enemies[i].x - bullets[j].x;
      const dy = enemies[i].y - bullets[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 10) {
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

  ctx.drawImage(player, bubble.x - bubble.width / 2, bubble.y, bubble.width, bubble.height);

  ctx.fillStyle = "magenta";
  bullets.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, 4, 0, 2 * Math.PI);
    ctx.fill();
  });

  enemies.forEach(e => {
    ctx.drawImage(enemyImg, e.x - 20, e.y - 20, 40, 40);
  });

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
*/

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Images
const player = new Image();
player.src = "Images/playerB.png";

const enemyImg = new Image();
enemyImg.src = "Images/BubbleB.png";

const bulletImg = new Image();
bulletImg.src = "Images/bullet.png";

// Sounds
const fireSound = document.getElementById("fireSound");
const hitSound = document.getElementById("hitSound");

// Player data
const bubble = {
  x: canvas.width / 2,
  y: canvas.height - 250,
  width: 240,
  height: 320,
  speed: 5
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