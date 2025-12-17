/*************************
 * CONFIGURACIÓN GENERAL
 *************************/
const NIVELES = {
  1: { tramos: 4 },
  2: {},
  3: {}
};

/*************************
 * ESTADO DEL USUARIO
 *************************/
let usuario = {
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
  if (data) {
    usuario = JSON.parse(data);
  }
}

/*************************
 * UI NIVEL 1
 *************************/
function actualizarUITramoNivel1() {
  const progreso = document.getElementById("progreso-nivel1");
  const info = document.getElementById("info-nivel1");
  const shurikenInfo = document.getElementById("shuriken-nivel1");

  if (progreso && info) {
    const porcentaje = (usuario.tramoNivel1 / NIVELES[1].tramos) * 100;
    progreso.style.width = porcentaje + "%";
    info.textContent = `Tramos completados: ${usuario.tramoNivel1} / ${NIVELES[1].tramos}`;
  }

  if (shurikenInfo) {
    shurikenInfo.textContent = `Shuriken disponibles: ${usuario.shuriken}`;
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

    if (usuario.tramoNivel1 === NIVELES[1].tramos) {
      usuario.nivel2Desbloqueado = true;
      guardarUsuario();
      desbloquearNivel2();
    }
  }
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
 * INIT
 *************************/
document.addEventListener("DOMContentLoaded", () => {
  cargarUsuario();
  actualizarUITramoNivel1();

  if (usuario.nivel2Desbloqueado) {
    desbloquearNivel2();
  }
});