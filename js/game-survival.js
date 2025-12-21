const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

/* ======================
   ESTADO DEL JUEGO
====================== */
let estado = "inicio"; // inicio | jugando | gameover
let score = 0;
let enemigos = [];
let frame = 0;
let loop = null;
let tiempo = 0;

/* ======================
   SPRITES
====================== */
const ninjaSprite = new Sprite(
  "assets/sprites/ninja_idle.png",
  32,
  32,
  6,
  6
);

const enemySprite = new Sprite(
  "assets/sprites/enemy_idle.png",
  32,
  32,
  4,
  10
);

/* ======================
   NINJA
====================== */
const ninja = {
  x: canvas.width / 2 - 16,
  y: canvas.height - 48,
  size: 32,
  vidas: 3,
  invulnerable: false
};

/* ======================
   PANTALLA INICIO
====================== */
function pantallaInicio() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "16px 'Press Start 2P', monospace";
  ctx.textAlign = "center";

  ctx.fillText("NINJA SURVIVAL", canvas.width / 2, 140);

  ctx.font = "10px 'Press Start 2P', monospace";
  ctx.fillText("Mové el mouse para esquivar", canvas.width / 2, 190);
  ctx.fillText("Sobreviví el mayor tiempo posible", canvas.width / 2, 210);
  ctx.fillText("Click para comenzar", canvas.width / 2, 250);
}

/* ======================
   INICIAR JUEGO
====================== */
function iniciarJuego() {
  score = 0;
  tiempo = 0;
  enemigos = [];
  estado = "jugando";

  if (loop) clearInterval(loop);
  loop = setInterval(actualizarJuego, 1000 / 30);
}

canvas.addEventListener("click", () => {
  if (estado === "inicio" || estado === "gameover") {
    iniciarJuego();
  }
});

/* ======================
   LOOP PRINCIPAL
====================== */
function actualizarJuego() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (estado === "inicio") {
    pantallaInicio();
    return;
  }

  if (estado === "gameover") {
    pantallaGameOver();
    return;
  }

  // === JUGANDO ===
  tiempo++;
  frame++;

  // SCORE
  score++;
  document.getElementById("game-score").textContent =
    `Puntaje: ${score}`;

  // RECOMPENSA
  if (score % 10 === 0) {
    ganarShuriken(1);
    textoFlotante("+1 🥷", ninja.x, ninja.y);
  }

  // DIFICULTAD PROGRESIVA
  const spawnRate = Math.min(0.005 + tiempo / 20000, 0.05);
  const velocidadBase = 1 + tiempo / 1200;

  // NINJA
  ninjaSprite.draw(ctx, ninja.x, ninja.y, ninja.size);

  // SPAWN ENEMIGOS
  if (Math.random() < spawnRate) {
    enemigos.push({
      x: Math.random() * (canvas.width - 32),
      y: -32,
      size: 32,
      speed: velocidadBase + Math.random()
    });
  }

  // ENEMIGOS
  enemigos.forEach(e => {
    e.y += e.speed;
    enemySprite.draw(ctx, e.x, e.y, e.size);

    if (colision(ninja, e)) {
      terminarJuego();
    }
  });

  // LIMPIEZA
  enemigos = enemigos.filter(e => e.y < canvas.height + 40);
}

/* ======================
   MOVIMIENTO
====================== */
document.addEventListener("mousemove", e => {
  if (estado !== "jugando") return;
  const rect = canvas.getBoundingClientRect();
  ninja.x = e.clientX - rect.left - ninja.size / 2;
});

/* ======================
   GAME OVER
====================== */
function pantallaGameOver() {
  ctx.fillStyle = "rgba(2,6,23,0.85)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ef4444";
  ctx.font = "14px 'Press Start 2P', monospace";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, 160);

  ctx.fillStyle = "#e5e7eb";
  ctx.font = "10px 'Press Start 2P', monospace";
  ctx.fillText(`Puntaje: ${score}`, canvas.width / 2, 200);
  ctx.fillText("Click para reintentar", canvas.width / 2, 240);
}

function terminarJuego() {
  clearInterval(loop);
  estado = "gameover";

  guardarPuntaje(score);
  cargarRankingJuego();
}

/* ======================
   COLISIÓN
====================== */
function colision(a, b) {
  return (
    a.x < b.x + b.size &&
    a.x + a.size > b.x &&
    a.y < b.y + b.size &&
    a.y + a.size > b.y
  );
}

/* ======================
   TEXTO FLOTANTE
====================== */
function textoFlotante(texto, x, y) {
  const el = document.createElement("div");
  el.textContent = texto;
  el.style.position = "absolute";
  el.style.left = canvas.offsetLeft + x + "px";
  el.style.top = canvas.offsetTop + y + "px";
  el.style.color = "#facc15";
  el.style.fontFamily = "'Press Start 2P', monospace";
  el.style.fontSize = "10px";
  el.style.pointerEvents = "none";
  el.style.animation = "floatUp 1s ease forwards";
  document.body.appendChild(el);

  setTimeout(() => el.remove(), 1000);
}

/* ======================
   RANKING
====================== */
function guardarPuntaje(puntos) {
  let ranking =
    JSON.parse(localStorage.getItem("aidflow_ranking_juego")) || [];

  ranking.push({ puntos, fecha: new Date().toLocaleDateString() });
  ranking.sort((a, b) => b.puntos - a.puntos);
  ranking = ranking.slice(0, 10);

  localStorage.setItem(
    "aidflow_ranking_juego",
    JSON.stringify(ranking)
  );
}

function cargarRankingJuego() {
  const lista = document.getElementById("ranking-juego");
  if (!lista) return;

  lista.innerHTML = "";
  const ranking =
    JSON.parse(localStorage.getItem("aidflow_ranking_juego")) || [];

  ranking.forEach(r => {
    const li = document.createElement("li");
    li.textContent = `${r.puntos} pts — ${r.fecha}`;
    lista.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", cargarRankingJuego);
