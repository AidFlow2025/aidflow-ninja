// leaderboard.js

function obtenerLeaderboard() {
  return JSON.parse(localStorage.getItem("leaderboard")) || [];
}

function guardarLeaderboard(data) {
  localStorage.setItem("leaderboard", JSON.stringify(data));
}

function actualizarPuntaje(usuario, puntos) {
  let leaderboard = obtenerLeaderboard();

  const index = leaderboard.findIndex(u => u.nombre === usuario);

  if (index !== -1) {
    leaderboard[index].puntos += puntos;
  } else {
    leaderboard.push({ nombre: usuario, puntos });
  }

  leaderboard.sort((a, b) => b.puntos - a.puntos);
  guardarLeaderboard(leaderboard);
}

function renderLeaderboard() {
  const container = document.getElementById("leaderboard");
  if (!container) return;

  const leaderboard = obtenerLeaderboard();

  container.innerHTML = `
    <h2>🏆 Ranking Ninja</h2>
    <ol>
      ${leaderboard.map(u => `
        <li>${u.nombre} — ${u.puntos} pts</li>
      `).join("")}
    </ol>
  `;
}
