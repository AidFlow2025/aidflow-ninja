function logoutAdmin() {
  localStorage.removeItem("aidflow_admin_auth");
  window.location.href = "index.html";
}


// Admin logic placeholder
console.log("Admin panel loaded");
const ADMIN_PASSWORD = "ninja123"; // cambiala cuando quieras
function loginAdmin() {
  const pass = document.getElementById("admin-pass").value;
  const error = document.getElementById("error-admin");

  if (pass === ADMIN_PASSWORD) {
    localStorage.setItem("aidflow_admin_auth", "true");
    window.location.href = "dashboard.html";
  } else {
    error.textContent = "❌ Clave incorrecta";
  }
}



/*************************
 * CARGA INICIAL
 *************************/
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("admin-usuarios").value =
    localStorage.getItem("aidflow_usuarios_activos") || 0;

  document.getElementById("admin-dao").value =
    localStorage.getItem("aidflow_dao_fondo") || 0;

  document.getElementById("admin-pozo").value =
    localStorage.getItem("aidflow_torneo_pozo") || 100;

  actualizarEstado();
});

/*************************
 * GUARDAR USUARIOS
 *************************/
function guardarUsuariosActivos() {
  const val = parseInt(
    document.getElementById("admin-usuarios").value
  );
  localStorage.setItem("aidflow_usuarios_activos", val);
  actualizarEstado();
}

/*************************
 * GUARDAR DAO
 *************************/
function guardarDAOFondos() {
  const val = parseFloat(
    document.getElementById("admin-dao").value
  );
  localStorage.setItem("aidflow_dao_fondo", val);
  actualizarEstado();
}

/*************************
 * GUARDAR POZO TORNEO
 *************************/
function guardarPozoTorneo() {
  const val = parseFloat(
    document.getElementById("admin-pozo").value
  );
  localStorage.setItem("aidflow_torneo_pozo", val);
  actualizarEstado();
}

/*************************
 * ESTADO GENERAL
 *************************/
function actualizarEstado() {
  const usuarios =
    localStorage.getItem("aidflow_usuarios_activos") || 0;

  const estado = document.getElementById("estado-sistema");

  if (usuarios >= 100) {
    estado.textContent =
      "✅ Torneos ACTIVOS — Premios en dinero real";
  } else {
    estado.textContent =
      `🔒 Torneos bloqueados (${usuarios}/100 usuarios)`;
  }
}
/*************************
 * ADMIN PANEL
 *************************/

function renderAdmin() {
  const daoEl = document.getElementById("dao-fondo");
  const usuariosEl = document.getElementById("usuarios-activos");
  const pozoInput = document.getElementById("input-pozo");
  const usuariosInput = document.getElementById("input-usuarios");

  if (daoEl) daoEl.textContent = `$${DAO.fondo}`;
  if (usuariosEl) usuariosEl.textContent = obtenerCantidadUsuarios();

  if (pozoInput) pozoInput.value = TORNEO.pozo;
  if (usuariosInput) usuariosInput.value = SISTEMA.usuariosMinimosTorneos;
}

function guardarConfigTorneo() {
  TORNEO.pozo = Number(document.getElementById("input-pozo").value);
  SISTEMA.usuariosMinimosTorneos = Number(
    document.getElementById("input-usuarios").value
  );

  alert("Configuración guardada");
}

function simularUsuarios(cantidad) {
  let actuales = obtenerCantidadUsuarios();
  let nuevos = actuales + cantidad;

  localStorage.setItem("aidflow_usuarios_activos", nuevos);
  renderAdmin();
}

function resetDAO() {
  DAO.fondo = 0;
  guardarDAO();
  renderAdmin();
}

function resetRanking() {
  localStorage.removeItem("aidflow_ranking_duelos");
  alert("Ranking reseteado");
}

function resetTodo() {
  localStorage.clear();
  location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
  cargarDAO();
  renderAdmin();
});

/*************************
 * CARGAR DATOS
 *************************/
function cargarAdmin() {
  const dao = JSON.parse(localStorage.getItem("aidflow_dao")) || { fondo: 0 };
  const torneo = JSON.parse(localStorage.getItem("aidflow_torneo")) || {
    pozo: 100,
    ganadores: 20
  };

  const usuarios = Number(
    localStorage.getItem("aidflow_usuarios_activos")
  ) || 0;

  document.getElementById("dao-fondo").value = dao.fondo;
  document.getElementById("torneo-pozo").value = torneo.pozo;
  document.getElementById("torneo-ganadores").value = torneo.ganadores;
  document.getElementById("usuarios-activos").value = usuarios;
}

/*************************
 * GUARDAR DAO
 *************************/
function guardarDAOAdmin() {
  const fondo = Number(document.getElementById("dao-fondo").value);

  localStorage.setItem(
    "aidflow_dao",
    JSON.stringify({ fondo })
  );

  alert("✅ DAO actualizado");
}

/*************************
 * GUARDAR TORNEO
 *************************/
function guardarTorneoAdmin() {
  const pozo = Number(document.getElementById("torneo-pozo").value);
  const ganadores = Number(document.getElementById("torneo-ganadores").value);

  localStorage.setItem(
    "aidflow_torneo",
    JSON.stringify({ pozo, ganadores })
  );

  alert("🏆 Torneo actualizado");
}

/*************************
 * GUARDAR SISTEMA
 *************************/
function guardarSistemaAdmin() {
  const usuarios = Number(
    document.getElementById("usuarios-activos").value
  );

  localStorage.setItem(
    "aidflow_usuarios_activos",
    usuarios
  );

  alert("👥 Usuarios activos actualizados");
}

document.addEventListener("DOMContentLoaded", cargarAdmin);
