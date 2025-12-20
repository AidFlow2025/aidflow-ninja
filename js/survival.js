/*************************
 * NINJA SURVIVAL GAME
 *************************/

const canvas = document.getElementById("survivalGame");
const ctx = canvas.getContext("2d");

let gameRunning = false;
let score = 0;
let ninja, enemies, intervalId, enemyInterval;

/*************************
 * CONFIG
 *************************/
const GAME_CONFIG = {
  ninjaSize: 20,
  enemySize: 15,
  enemySpeed: 2,
  spawnRate: 800
};

/*************************
 * INIT GAME
 *************************/
function startGame() {
  resetGame();
  gameRunning = true;

  intervalId = setInterval(updateGame, 16);
  enemyInterval = setInterval(spawnEnemy, GAME_CONFIG.spawnRate);

  document.addEventListener("keydown", moveNinja);
}

/*************************
 * RESET
 *************************/
function resetGame() {
  score = 0;
  ninja = {
    x: canvas.width / 2 - 10,
    y: canvas.height - 30,
    size: GAME_CONFIG.ninjaSize
  };
  enemies = [];

  clearInterval(intervalId);
  clearInterval(enemyInterval);
}

/*************************
 * UPDATE LOOP
 *************************/
function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  score++;
  drawNinja();
  updateEnemies();
  drawScore();
}

/*************************
 * DRAW
 *************************/
function drawNinja() {
  ctx.fillStyle = "#00ffcc";
  ctx.fillRect(ninja.x, ninja.y, ninja.size, ninja.size);
}

function drawScore() {
  ctx.fillStyle = "#fff";
  ctx.font = "14px Arial";
  ctx.fillText(`Score: ${score}`, 10, 20);
}

/*************************
 * ENEMIES
 *************************/
function spawnEnemy() {
  enemies.push({
    x: Math.random() * (canvas.width - GAME_CONFIG.enemySize),
    y: -GAME_CONFIG.enemySize,
    size: GAME_CONFIG.enemySize
  });
}

function updateEnemies() {
  ctx.fillStyle = "#ff0044";

  enemies.forEach((enemy, index) => {
    enemy.y += GAME_CONFIG.enemySpeed;
    ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);

    if (checkCollision(ninja, enemy)) {
      endGame();
    }

    if (enemy.y > canvas.height) {
      enemies.splice(index, 1);
    }
  });
}

/*************************
 * CONTROLS
 *************************/
function moveNinja(e) {
  if (!gameRunning) return;

  if (e.key === "ArrowLeft" && ninja.x > 0) {
    ninja.x -= 10;
  }
  if (e.key === "ArrowRight" && ninja.x < canvas.width - ninja.size) {
    ninja.x += 10;
  }
}

/*************************
 * COLLISION
 *************************/
function checkCollision(a, b) {
  return (
    a.x < b.x + b.size &&
    a.x + a.size > b.x &&
    a.y < b.y + b.size &&
    a.y + a.size > b.y
  );
}

/*************************
 * GAME OVER
 *************************/
function endGame() {
  gameRunning = false;
  clearInterval(intervalId);
  clearInterval(enemyInterval);
  document.removeEventListener("keydown", moveNinja);

  guardarScore(score);
  renderRanking();

  alert(`💀 Game Over\nScore: ${score}`);
}

/*************************
 * RANKING TOP 10
 *************************/
function guardarScore(puntaje) {
  let ranking = JSON.parse(localStorage.getItem("ninja_survival_top10")) || [];

  ranking.push({
    score: puntaje,
    fecha: new Date().toISOString()
  });

  ranking.sort((a, b) => b.score - a.score);
  ranking = ranking.slice(0, 10);

  localStorage.setItem(
    "ninja_survival_top10",
    JSON.stringify(ranking)
  );
}

function renderRanking() {
  const list = document.getElementById("ranking-list");
  if (!list) return;

  const ranking = JSON.parse(
    localStorage.getItem("ninja_survival_top10")
  ) || [];

  list.innerHTML = "";

  ranking.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `#${index + 1} — ${item.score} pts`;
    list.appendChild(li);
  });
}

/*************************
 * INIT RANKING ON LOAD
 *************************/
document.addEventListener("DOMContentLoaded", renderRanking);



function renderRanking() {
  const lista = document.getElementById("ranking-juego");
  if (!lista) return;

  const ranking = JSON.parse(localStorage.getItem(RANKING_KEY)) || [];

  lista.innerHTML = "";

  ranking.forEach((r, i) => {
    const li = document.createElement("li");
    li.textContent = `#${i + 1} — ${r.score} pts`;
    lista.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", renderRanking);
