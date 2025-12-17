/*************************
 * ESTADO DEL USUARIO
 *************************/
const usuario = {
  nivelActual: 1,
  tramoNivel1: 0, // 0 a 4
  shuriken: 0,
  nivel2Desbloqueado: false
};

/*************************
 * CONFIGURACIÓN DE NIVELES
 *************************/
const NIVELES = {
  1: {
    nombre: "Ninja",
    tramos: 4
  },
  2: {
    nombre: "Avanzado"
  }
};

/*************************
 * UI NIVEL 1
 *************************/
function actualizarUITramoNivel1() {
  const progreso = document.getElementById("progreso-nivel1");
  const info = document.getElementById("info-nivel1");

  if (!progreso || !info) return;

  const porcentaje = (usuario.tramoNivel1 / NIVELES[1].tramos) * 100;
  progreso.style.width = porcentaje + "%";
  info.textContent = `Tramos completados: ${usuario.tramoNivel1} / ${NIVELES[1].tramos}`;
}

/*************************
 * AVANZAR TRAMO
 *************************/
function avanzarTramoNivel1() {
  if (usuario.tramoNivel1 >= NIVELES[1].tramos) return;

  usuario.tramoNivel1++;
  actualizarUITramoNivel1();

  if (usuario.tramoNivel1 === NIVELES[1].tramos) {
    desbloquearNivel2();
  }
}

/*************************
 * DESBLOQUEO NIVEL 2
 *************************/
function desbloquearNivel2() {
  usuario.nivel2Desbloqueado = true;

  const card = document.getElementById("nivel2-card");
  const btn = document.getElementById("btn-nivel2");

  if (card && btn) {
    card.classList.remove("locked");
    btn.classList.remove("disabled");
    btn.disabled = false;
    btn.textContent = "Subir a Avanzado";
  }

  console.log("✅ Nivel 2 desbloqueado");
  alert("🎉 ¡Desbloqueaste el Nivel Avanzado!");
}

/*************************
 * INIT
 *************************/
document.addEventListener("DOMContentLoaded", () => {
  actualizarUITramoNivel1();

  if (usuario.nivel2Desbloqueado) {
    desbloquearNivel2();
  }
});
