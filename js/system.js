function guardarSistema() {
  localStorage.setItem(
    "aidflow_users_active",
    document.getElementById("usuarios-activos").value
  );

  localStorage.setItem(
    "aidflow_juegos_activos",
    document.getElementById("activar-juegos").checked
  );

  localStorage.setItem(
    "aidflow_torneos_activos",
    document.getElementById("activar-torneos").checked
  );

  alert("Sistema actualizado");
}

function agregarJuego() {
  const nombre = document.getElementById("juego-nombre").value;
  const url = document.getElementById("juego-url").value;

  if (!nombre || !url) return alert("Completa todo");

  const juegos =
    JSON.parse(localStorage.getItem("aidflow_games")) || [];

  juegos.push({ nombre, url, activo: true });

  localStorage.setItem("aidflow_games", JSON.stringify(juegos));
  renderJuegos();
}

function renderJuegos() {
  const lista = document.getElementById("lista-juegos");
  if (!lista) return;

  lista.innerHTML = "";

  const juegos =
    JSON.parse(localStorage.getItem("aidflow_games")) || [];

  juegos.forEach((j, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      🎮 ${j.nombre}
      <button onclick="toggleJuego(${i})">
        ${j.activo ? "Desactivar" : "Activar"}
      </button>
    `;
    lista.appendChild(li);
  });
}

function toggleJuego(i) {
  const juegos =
    JSON.parse(localStorage.getItem("aidflow_games")) || [];

  juegos[i].activo = !juegos[i].activo;
  localStorage.setItem("aidflow_games", JSON.stringify(juegos));
  renderJuegos();
}

document.addEventListener("DOMContentLoaded", renderJuegos);
