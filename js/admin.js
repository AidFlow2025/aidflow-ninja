/* =========================================================
   AIDFLOW NINJA — ADMIN CORE (CEREBRO DEL SISTEMA)
   Este archivo controla TODA la lógica interna del admin:
   DAO, torneos, juegos, sistema, referidos y estados.
   
   ⚠️ NO maneja autenticación ni login.
   ⚠️ auth.js es el único responsable de seguridad.

   Última actualización: 2025-12-22
========================================================= */


/* =========================================================
   🚫 AUTH (DESACTIVADO — SOLO REFERENCIA)
   MOVIDO A: admin/auth.js
========================================================= */

/*
function loginAdmin() {
  ...
}

function logoutAdmin() {
  ...
}
*/


/* =========================================================
   CARGA INICIAL — ESTADO GENERAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const u = document.getElementById("admin-usuarios");
  const d = document.getElementById("admin-dao");
  const p = document.getElementById("admin-pozo");

  if (u) u.value = localStorage.getItem("aidflow_usuarios_activos") || 0;
  if (d) d.value = localStorage.getItem("aidflow_dao_fondo") || 0;
  if (p) p.value = localStorage.getItem("aidflow_torneo_pozo") || 100;

  actualizarEstado();
});


/* =========================================================
   SISTEMA GENERAL
========================================================= */

function guardarUsuariosActivos() {
  const val = Number(document.getElementById("admin-usuarios").value || 0);
  localStorage.setItem("aidflow_usuarios_activos", val);
  actualizarEstado();
}

function guardarDAOFondos() {
  const val = Number(document.getElementById("admin-dao").value || 0);
  localStorage.setItem("aidflow_dao_fondo", val);
  actualizarEstado();
}

function guardarPozoTorneo() {
  const val = Number(document.getElementById("admin-pozo").value || 0);
  localStorage.setItem("aidflow_torneo_pozo", val);
  actualizarEstado();
}

function actualizarEstado() {
  const usuarios = Number(
    localStorage.getItem("aidflow_usuarios_activos") || 0
  );

  const estado = document.getElementById("estado-sistema");
  if (!estado) return;

  estado.textContent =
    usuarios >= 100
      ? "✅ Torneos ACTIVOS — Premios en dinero real"
      : `🔒 Torneos bloqueados (${usuarios}/100 usuarios)`;
}


/* =========================================================
   DAO / TORNEOS / SISTEMA (ADMIN PANEL)
========================================================= */

function guardarDAOAdmin() {
  const fondo = Number(document.getElementById("dao-fondo")?.value || 0);
  localStorage.setItem("aidflow_dao", JSON.stringify({ fondo }));
  alert("✅ DAO actualizado");
}

function guardarTorneoAdmin() {
  const pozo = Number(document.getElementById("torneo-pozo")?.value || 0);
  const ganadores = Number(document.getElementById("torneo-ganadores")?.value || 0);

  localStorage.setItem(
    "aidflow_torneo",
    JSON.stringify({ pozo, ganadores })
  );

  alert("🏆 Torneo actualizado");
}

function guardarSistemaAdmin() {
  const usuarios = Number(
    document.getElementById("usuarios-activos")?.value || 0
  );

  localStorage.setItem("aidflow_usuarios_activos", usuarios);
  alert("👥 Usuarios activos actualizados");
}


/* =========================================================
   REFERIDOS (TOP)
========================================================= */

function cargarReferidosAdmin() {
  const lista = document.getElementById("admin-referidos");
  if (!lista) return;

  lista.innerHTML = "";

  const datos = Object.keys(localStorage)
    .filter(k => k.startsWith("aidflow_refs_"))
    .map(k => ({
      user: k.replace("aidflow_refs_", ""),
      refs: Number(localStorage.getItem(k)) || 0
    }))
    .sort((a, b) => b.refs - a.refs);

  if (!datos.length) {
    lista.innerHTML = "<li>Sin referidos aún</li>";
    return;
  }

  datos.forEach(d => {
    const li = document.createElement("li");
    li.textContent = `🥷 ${d.user} — ${d.refs} referidos`;
    lista.appendChild(li);
  });
}


/* =========================================================
   JUEGOS (ADMIN)
========================================================= */

const juegosDefault = [
  {
    id: "ninja-survival",
    nombre: "Ninja Survival",
    url: "../games/ninja-survival/index.html",
    tipo: "torneo",
    activo: true
  },
  {
    id: "tetris-ninja",
    nombre: "Tetris Ninja",
    url: "../games/tetris/index.html",
    tipo: "entrenamiento",
    activo: false
  }
];

function cargarJuegosAdmin() {
  let juegos = JSON.parse(localStorage.getItem("aidflow_games"));

  if (!juegos) {
    juegos = juegosDefault;
    localStorage.setItem("aidflow_games", JSON.stringify(juegos));
  }

  const lista = document.getElementById("admin-games-list");
  if (!lista) return;

  lista.innerHTML = "";

  juegos.forEach((j, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${j.nombre}</strong>
      <span class="badge">${j.tipo}</span>
      <label>
        <input type="checkbox" ${j.activo ? "checked" : ""}
          onchange="toggleJuego(${i})">
        Activo
      </label>
    `;
    lista.appendChild(li);
  });
}

function toggleJuego(i) {
  const juegos = JSON.parse(localStorage.getItem("aidflow_games")) || [];
  juegos[i].activo = !juegos[i].activo;
  localStorage.setItem("aidflow_games", JSON.stringify(juegos));
  cargarJuegosAdmin();
}

function resetearJuegos() {
  localStorage.setItem("aidflow_games", JSON.stringify(juegosDefault));
  cargarJuegosAdmin();
}


/* =========================================================
   INIT FINAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  cargarJuegosAdmin();
  cargarReferidosAdmin();
  cargarFondosAdmin?.();
});
