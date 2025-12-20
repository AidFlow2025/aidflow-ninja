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
  pozo: 100,
  ganadores: 20
};

const RECOMPENSAS_KEY = "aidflow_shuriken_diario";

/*************************
 * DAO
 *************************/
let DAO = {
  fondo: 1000
};

/*************************
 * ESTADO DEL USUARIO
 *************************/
let usuario = {
  id: "usuario_local",
  nivel: 1,

  // Ciclo actual
  tramoNivel1: 0,
  saldo: 0,

  // Recursos
  shuriken: 0,

  // Estados
  nivel2Desbloqueado: false,

  // 📊 Historial
  ciclosCompletados: 0,
  totalGanado: 0,
  shurikenGanados: 0,
  ultimoCiclo: null
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
  localStorage.setItem("aidflow_dao", JSON.stringify(DAO));
}

function cargarDAO() {
  const data = localStorage.getItem("aidflow_dao");
  if (data) DAO = JSON.parse(data);
}

/*************************
 * USUARIOS ACTIVOS (mock)
 *************************/
function obtenerCantidadUsuarios() {
  return Number(localStorage.getItem("aidflow_usuarios_activos")) || 1;
}

function torneosHabilitados() {
  return obtenerCantidadUsuarios() >= SISTEMA.usuariosMinimosTorneos;
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
    const porcentaje = (usuario.tramoNivel1 / NIVELES[1].tramos) * 100;
    progreso.style.width = porcentaje + "%";
    info.textContent = `Tramos completados: ${usuario.tramoNivel1} / ${NIVELES[1].tramos}`;
  }

  if (shurikenInfo) {
    shurikenInfo.textContent = `Shuriken disponibles: ${usuario.shuriken}`;
  }

  if (saldoInfo) {
    saldoInfo.textContent = `$${usuario.saldo.toFixed(2)}`;
  }
}

/*************************
 * AVANZAR TRAMO
 *************************/
function avanzarTramoNivel1() {
  if (usuario.tramoNivel1 < NIVELES[1].tramos) {
    usuario.tramoNivel1++;
    guardarUsuario();
    actualizarUITramoNivel1();
    actualizarEstadoCiclo();

    if (usuario.tramoNivel1 === NIVELES[1].tramos) {
      usuario.nivel2Desbloqueado = true;
      guardarUsuario();
      desbloquearNivel2();
    }
  }
}

/*************************
 * SHURIKEN — SOLO DUELOS / JUEGOS
 *************************/
function ganarShuriken(cantidad = 1) {
  usuario.shuriken += cantidad;
  usuario.shurikenGanados += cantidad;

  guardarUsuario();
  actualizarUITramoNivel1();

  if (typeof efectoShuriken === "function") {
    efectoShuriken(cantidad);
  }

  if (typeof actualizarUIProgresoAnimado === "function") {
    actualizarUIProgresoAnimado();
  }

  console.log(`🥷 Ganaste ${cantidad} shuriken`);
}

/*************************
 * TORNEOS — DINERO REAL
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
  const premioBase = TORNEO.pozo / ganadores.length;

  ganadores.forEach(jugador => {
    if (jugador.id === usuario.id) {
      usuario.saldo += premioBase;
      usuario.totalGanado += premioBase;
    }
  });

  DAO.fondo -= TORNEO.pozo;

  guardarUsuario();
  guardarDAO();
  actualizarUITramoNivel1();

  console.log("🏆 Torneo pagado correctamente");
}

/*************************
 * CIERRE DE CICLO
 *************************/
function cicloCompletado() {
  return usuario.tramoNivel1 >= NIVELES[1].tramos;
}

function actualizarEstadoCiclo() {
  const btnRetiro = document.getElementById("btn-retiro");
  const btnRecompra = document.getElementById("btn-recompra");

  if (!btnRetiro && !btnRecompra) return;

  if (cicloCompletado()) {
    if (btnRetiro) btnRetiro.disabled = false;
    if (btnRecompra) btnRecompra.style.display = "block";
  } else {
    if (btnRetiro) btnRetiro.disabled = true;
    if (btnRecompra) btnRecompra.style.display = "none";
  }
}

/*************************
 * RETIRO DE FONDOS
 *************************/
function retirarFondos() {
  if (!cicloCompletado()) {
    alert("⚠️ Aún no completaste el ciclo");
    return;
  }

  usuario.ciclosCompletados++;
  usuario.totalGanado += usuario.saldo;
  usuario.ultimoCiclo = new Date().toISOString();

  alert(`💰 Retiraste $${usuario.saldo.toFixed(2)}`);

  usuario.saldo = 0;

  guardarUsuario();
  actualizarUITramoNivel1();
}

/*************************
 * RECOMPRA PASE NINJA
 *************************/
function recomprarPaseNinja() {
  if (!cicloCompletado()) {
    alert("⚠️ Debés completar el ciclo primero");
    return;
  }

  usuario.tramoNivel1 = 0;
  usuario.saldo = 0;
  usuario.nivel2Desbloqueado = false;

  guardarUsuario();

  alert("🥷 Nuevo ciclo iniciado");
  actualizarUITramoNivel1();
  actualizarEstadoCiclo();
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

  console.log("✅ Nivel 2 desbloqueado");
}

/*************************
 * RANKING DE DUELOS
 *************************/
let rankingDuelos = JSON.parse(
  localStorage.getItem("aidflow_ranking_duelos")
) || [];

function registrarVictoriaDuelo(userId) {
  const entry = rankingDuelos.find(u => u.id === userId);

  if (entry) {
    entry.victorias++;
  } else {
    rankingDuelos.push({ id: userId, victorias: 1 });
  }

  rankingDuelos.sort((a, b) => b.victorias - a.victorias);

  localStorage.setItem(
    "aidflow_ranking_duelos",
    JSON.stringify(rankingDuelos)
  );
}

/*************************
 * RECOMPENSAS DESDE JUEGOS
 *************************/
function evaluarRecompensa(score) {
  const hoy = new Date().toDateString();

  let registro = JSON.parse(localStorage.getItem(RECOMPENSAS_KEY)) || {
    fecha: hoy,
    shuriken: 0
  };

  if (registro.fecha !== hoy) {
    registro = { fecha: hoy, shuriken: 0 };
  }

  const shurikenPorScore = Math.floor(score / 10);
  const LIMITE_DIARIO = 3;

  const disponibles = LIMITE_DIARIO - registro.shuriken;
  const otorgar = Math.min(shurikenPorScore, disponibles);

  if (otorgar > 0) {
    ganarShuriken(otorgar);
    registro.shuriken += otorgar;
    localStorage.setItem(RECOMPENSAS_KEY, JSON.stringify(registro));
  }
}

/*************************
 * INIT
 *************************/
document.addEventListener("DOMContentLoaded", () => {
  cargarUsuario();
  cargarDAO();
  actualizarUITramoNivel1();
  actualizarEstadoCiclo();

  if (usuario.nivel2Desbloqueado) {
    desbloquearNivel2();
  }
});
