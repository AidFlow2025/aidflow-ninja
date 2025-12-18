/*************************
 * CONFIGURACIÓN GENERAL
 *************************/
const NIVELES = {
  1: { tramos: 4 },
  2: {},
  3: {}
};

const SISTEMA = {
  usuariosMinimosTorneos: 100
};

const TORNEO = {
  pozo: 100,      // dinero total a repartir
  ganadores: 20   // primeros 20 cobran
};

/*************************
 * DAO
 *************************/
let DAO = {
  fondo: parseFloat(localStorage.getItem("aidflow_dao_fondo")) || 1000
};

/*************************
 * USUARIOS ACTIVOS (mock)
 *************************/
let usuariosActivos =
  parseInt(localStorage.getItem("aidflow_usuarios_activos")) || 1;

/*************************
 * ESTADO DEL USUARIO
 *************************/
let usuario = {
  id: "usuario_local",
  nivel: 1,
  tramoNivel1: 0,
  shuriken: 0,
  saldo: 0,
  nivel2Desbloqueado: false
};

/*************************
 * STORAGE
 *************************/
function guardarUsuario() {
  localStorage.setItem("aidflow_usuario", JSON.stringify(usuario));
}

function cargarUsuario() {
  const data = localStorage.getItem("aidflow_usuario");
  if (data) usuario = JSON.parse(data);
}

function guardarDAO() {
  localStorage.setItem("aidflow_dao_fondo", DAO.fondo);
}

/*************************
 * TORNEOS
 *************************/
function torneosHabilitados() {
  return usuariosActivos >= SISTEMA.usuariosMinimosTorneos;
}

function verificarEstadoTorneos() {
  const status = document.getElementById("torneos-status");
  const btn = document.getElementById("btn-torneo");

  if (!status || !btn) return;

  if (torneosHabilitados()) {
    status.textContent = "🏆 Torneos ACTIVOS — Premios en dinero real";
    btn.textContent = "Entrar al Torneo";
    btn.disabled = false;
    btn.classList.remove("disabled");
  } else {
    status.textContent = `🔒 Torneos bloqueados (${usuariosActivos}/${SISTEMA.usuariosMinimosTorneos})`;
    btn.textContent = "Modo entrenamiento";
    btn.disabled = true;
    btn.classList.add("disabled");
  }
}

/*************************
 * UI NIVEL 1
 *************************/
function actualizarUITramoNivel1() {
  const progreso = document.getElementById("progreso-nivel1");
  const info = document.getElementById("info-nivel1");
  const shurikenInfo = document.getElementById("shuriken-nivel1");
  const saldoInfo = document.getElementById("saldo-usuario");

  if (progreso && info) {
    const porcentaje =
      (usuario.tramoNivel1 / NIVELES[1].tramos) * 100;
    progreso.style.width = porcentaje + "%";
    info.textContent = `Tramos completados: ${usuario.tramoNivel1} / ${NIVELES[1].tramos}`;
  }

  if (shurikenInfo) {
    shurikenInfo.textContent = `Shuriken disponibles: ${usuario.shuriken}`;
  }

  if (saldoInfo) {
    saldoInfo.textContent = `Saldo disponible: $${usuario.saldo.toFixed(2)}`;
  }
}

/*************************
 * AVANZAR TRAMO NIVEL 1
 *************************/
function avanzarTramoNivel1() {
  if (usuario.tramoNivel1 < NIVELES[1].tramos) {
    usuario.tramoNivel1++;
    guardarUsuario();
    actualizarUITramoNivel1();

    if (usuario.tramoNivel1 === NIVELES[1].tramos) {
      usuario.nivel2Desbloqueado = true;
      guardarUsuario();
      desbloquearNivel2();
    }
  }
}

/*************************
 * SHURIKEN (SOLO DUELOS)
 *************************/
function ganarShuriken(cantidad = 1) {
  usuario.shuriken += cantidad;
  guardarUsuario();
  actualizarUITramoNivel1();
}

/*************************
 * TORNEOS – PAGOS DESDE DAO
 *************************/
function pagarTorneo(ranking) {
  if (!torneosHabilitados()) {
    console.warn("🎯 Torneo en modo entrenamiento");
    return;
  }

  if (DAO.fondo < TORNEO.pozo) {
    console.warn("❌ DAO sin fondos suficientes");
    return;
  }

  const ganadores = ranking.slice(0, TORNEO.ganadores);
  const premio = TORNEO.pozo / ganadores.length;

  ganadores.forEach(jugador => {
    if (jugador.id === usuario.id) {
      usuario.saldo += premio;
    }
  });

  DAO.fondo -= TORNEO.pozo;
  guardarDAO();
  guardarUsuario();
  actualizarUITramoNivel1();

  alert("🏆 Torneo finalizado — premios acreditados");
}

/*************************
 * DESBLOQUEO NIVEL 2
 *************************/
function desbloquearNivel2() {
  const card = document.getElementById("nivel2-card");
  const btn = document.getElementById("btn-nivel2");

  if (card) card.classList.remove("locked");
  if (btn) {
    btn.classList.remove("disabled");
    btn.disabled = false;
    btn.textContent = "Subir a Avanzado";
  }
}

/*************************
 * RANKING DE DUELOS
 *************************/
let rankingDuelos =
  JSON.parse(localStorage.getItem("aidflow_ranking_duelos")) || [];

function registrarVictoriaDuelo(userId) {
  const entry = rankingDuelos.find(u => u.id === userId);

  if (entry) entry.victorias++;
  else rankingDuelos.push({ id: userId, victorias: 1 });

  rankingDuelos.sort((a, b) => b.victorias - a.victorias);
  localStorage.setItem(
    "aidflow_ranking_duelos",
    JSON.stringify(rankingDuelos)
  );
}

/*************************
 * INIT
 *************************/
document.addEventListener("DOMContentLoaded", () => {
  cargarUsuario();
  actualizarUITramoNivel1();

  if (usuario.nivel2Desbloqueado) {
    desbloquearNivel2();
  }

  verificarEstadoTorneos();
});
