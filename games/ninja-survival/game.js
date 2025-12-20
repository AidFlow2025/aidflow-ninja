const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

let gameRunning = true;
let score = 0;

const player = new Player(canvas.width / 2, canvas.height / 2);
let shurikens = [];
let enemies = [];

// DISPARO
document.addEventListener("click", () => {
  if (!gameRunning) return;

  shurikens.push(
    new Shuriken(player.x, player.y, 0, -1)
  );
});

// SPAWN ENEMIGOS
setInterval(() => {
  if (!gameRunning) return;

  const x = Math.random() * canvas.width;
  enemies.push(new Enemy(x, 0));
}, 1200);

// ==========================
// GAME OVER
// ==========================
function gameOver() {
  gameRunning = false;

  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);

  ctx.font = "16px Arial";
  ctx.fillText(
    "Score: " + score,
    canvas.width / 2,
    canvas.height / 2 + 20

    
  );

  guardarScore(score);

}
function guardarScore(score) {
  let ranking = JSON.parse(localStorage.getItem(RANKING_KEY)) || [];

  ranking.push({
    score,
    fecha: Date.now()
  });

  ranking.sort((a, b) => b.score - a.score);
  ranking = ranking.slice(0, 10);

  localStorage.setItem(RANKING_KEY, JSON.stringify(ranking));

  evaluarRecompensa(score);
  
}


// ==========================
// UPDATE
// ==========================
function update() {
  if (!gameRunning) return;

  player.move(keys);

  shurikens.forEach(s => s.update());
  enemies.forEach(e => e.update(player));

  // SHURIKEN vs ENEMIGO
  shurikens.forEach((s, si) => {
    enemies.forEach((e, ei) => {
      const dist = Math.hypot(s.x - e.x, s.y - e.y);
      if (dist < e.size / 2) {
        enemies.splice(ei, 1);
        shurikens.splice(si, 1);
        score += 10;
      }
    });
  });

  // ENEMIGO vs JUGADOR (MUERTE)
  enemies.forEach(e => {
    const dist = Math.hypot(player.x - e.x, player.y - e.y);
    if (dist < e.size / 2 + player.size / 2) {
      gameOver();
    }
  });

  shurikens = shurikens.filter(
    s => !s.fueraDePantalla(canvas.width, canvas.height)
  );
}

// ==========================
// DRAW
// ==========================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.draw(ctx);
  shurikens.forEach(s => s.draw(ctx));
  enemies.forEach(e => e.draw(ctx));

  ctx.fillStyle = "#fff";
  ctx.font = "14px Arial";
  ctx.fillText("Score: " + score, 10, 20);
}

// ==========================
// LOOP
// ==========================
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
