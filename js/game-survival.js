const canvas = document.getElementById("gameCanvas");
if (!canvas) return;

const ctx = canvas.getContext("2d");

let jugando = false;
let score = 0;
let loop;
let ninja = { x: 140, y: 360, size: 22 };
let enemigos = [];

/* INICIAR */
function iniciarJuego() {
  score = 0;
  enemigos = [];
  jugando = true;

  clearInterval(loop);
  loop = setInterval(actualizarJuego, 1000 / 30);
}

/* LOOP */
function actualizarJuego() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Puntaje
  score++;
  document.getElementById("game-score").textContent =
    `Puntaje: ${score}`;

  // Premio shuriken
  if (score % 10 === 0) {
    ganarShuriken(1);
  }

  // Ninja
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(ninja.x, ninja.y, ninja.size, ninja.size);

  // Enemigos
  if (Math.random() < 0.04) {
    enemigos.push({
      x: Math.random() * (canvas.width - 20),
      y: -20,
      size: 20
    });
  }

  enemigos.forEach(e => {
    e.y += 4;
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(e.x, e.y, e.size, e.size);

    if (
      e.x < ninja.x + ninja.size &&
      e.x + e.size > ninja.x &&
      e.y < ninja.y + ninja.size &&
      e.y + e.size > ninja.y
    ) {
      terminarJuego();
    }
  });
}

/* MOVIMIENTO */
document.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  ninja.x = e.clientX - rect.left - ninja.size / 2;
});

/* GAME OVER */
function terminarJuego() {
  clearInterval(loop);
  jugando = false;

  guardarPuntaje(score);
  cargarRankingJuego();

  alert(`💀 Game Over\nPuntaje: ${score}`);
}

/* RANKING */
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
