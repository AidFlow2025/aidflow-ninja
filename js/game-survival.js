const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

/* ======================
   ESTADO DEL JUEGO
====================== */
let estado = "inicio"; // inicio | jugando | gameover
let score = 0;
let enemigos = [];
let loop = null;
let frame = 0;

/* ======================
   NINJA (SPRITE NO TOCAR)
====================== */
const ninjaSprite = new Sprite(
  "assets/sprites/ninja_idle.png",
  32,
  32,
  6,
  6
);

const ninja = {
  x: canvas.width / 2 - 16,
  y: canvas.height - 48,
  size: 32,
  invulnerable: false
};

/* ======================
   ENEMIGO (SPRITE NO TOCAR)
====================== */
const enemySprite = new Sprite(
  "assets/sprites/enemy_idle.png",
  32,
  32,
  4,
  10
);

/* ======================
   PANTALLAS
====================== */
function pantallaInicio() {
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#e11d48";
  ctx.font = "16px 'Press Start 2P'";
  ctx.textAlign = "center";
  ctx.fillText("NINJA SURVIVAL", canvas.width / 2, 140);

  ctx.fillStyle = "#e5e7eb";
  ctx.font = "10px 'Press Start 2P'";
  ctx.fillText("Mové el mouse para esquivar", canvas.width / 2, 200);
  ctx.fillText("Sobreviví lo máximo posible", canvas.width / 2, 220);
  ctx.fillText("CLICK PARA COMENZAR", canvas.width / 2, 260);
}

function pantallaGameOver() {
  ctx.fillStyle = "rgba(2,6,23,0.9)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ef4444";
  ctx.font = "16px 'Press Start 2P'";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, 160);

  ctx.fillStyle = "#e5e7eb";
  ctx.font = "10px 'Press Start 2P'";
  ctx.fillText(`PUNTAJE: ${score}`, canvas.width / 2, 210);
  ctx.fillText("CLICK PARA REINTENTAR", canvas.width / 2, 250);
}

/* ======================
   INICIO
====================== */
function iniciarJuego() {
  score = 0;
  frame = 0;
  enemigos = [];
  estado = "jugando";

  ninja.x = canvas.width / 2 - ninja.size / 2;
  ninja.y = canvas.height - 48;

  ninja.invulnerable = true;
  setTimeout(() => ninja.invulnerable = false, 1500);

  if (loop) clearInterval(loop);
  loop = setInterval(actualizarJuego, 1000 / 30);

  actualizarJuego();
}

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

  frame++;
  score++;

  document.getElementById("game-score").textContent =
    `Puntaje: ${score}`;

  /* === SHURIKEN === */
  if (score % 10 === 0) {
    ganarShuriken(1);
    textoFlotante("+1 Shuriken", ninja.x, ninja.y);
  }

  /* === NINJA === */
  ninjaSprite.draw(ctx, ninja.x, ninja.y, ninja.size);

  /* === DIFICULTAD PROGRESIVA === */
  const dificultad = Math.min(0.015 + score * 0.00002, 0.08);
  const velocidadBase = 2 + score * 0.002;

  /* === SPAWN ENEMIGOS === */
  if (Math.random() < dificultad) {
    enemigos.push({
      x: Math.random() * (canvas.width - 32),
      y: -32,
      size: 32,
      speed: velocidadBase
    });
  }

  /* === ENEMIGOS === */
  enemigos.forEach(e => {
    e.y += e.speed;
    enemySprite.draw(ctx, e.x, e.y, e.size);

    if (!ninja.invulnerable && colision(ninja, e)) {
      terminarJuego();
    }
  });

  enemigos = enemigos.filter(e => e.y < canvas.height + 40);
}

/* ======================
   MOVIMIENTO
====================== */
canvas.addEventListener("mousemove", e => {
  if (estado !== "jugando") return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;

  ninja.x = Math.max(
    0,
    Math.min(canvas.width - ninja.size, x - ninja.size / 2)
  );
});

/* ======================
   CLICK
====================== */
canvas.addEventListener("click", () => {
  if (estado === "inicio" || estado === "gameover") {
    iniciarJuego();
  }
});

/* ======================
   GAME OVER
====================== */
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
  el.style.fontWeight = "bold";
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
