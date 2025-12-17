// ===============================
// ECONOMÍA AIDFLOW NINJA
// ===============================

const ECONOMIA = {
  monedaInterna: "Shuriken",
  tramosPorCiclo: 4,

  niveles: {
    nivel1: {
      nombre: "Ninja",
      cicloMaximo: 50,
      tramos: 4
    },
    nivel2: {
      nombre: "Avanzado",
      cicloMaximo: 120,
      tramos: 4
    },
    nivel3: {
      nombre: "Experto",
      cicloMaximo: 300,
      tramos: 4
    }
  }
};

function calcularTramo(nivel) {
  const data = ECONOMIA.niveles[nivel];
  if (!data) return null;
  return data.cicloMaximo / data.tramos;
}

// Exponer al navegador (forma correcta sin módulos)
window.ECONOMIA = ECONOMIA;
window.calcularTramo = calcularTramo;

function aplicarGanancia(nivel, saldoAnterior, nuevosAportes) {
  const nivelConfig = NIVELES[nivel];
  if (!nivelConfig) return null;

  const saldoTotal = saldoAnterior + nuevosAportes;
  const tramosCompletados = Math.min(
    Math.floor(saldoTotal / nivelConfig.valorTramo),
    nivelConfig.tramos
  );

  const shurikenGanados = tramosCompletados * SHURIKEN_POR_TRAMO;

  return {
    saldoTotal,
    tramosCompletados,
    shurikenGanados
  };
}


window.aplicarGanancia = aplicarGanancia;

function renderCicloNivel1(saldo) {
  const resultado = aplicarGanancia("nivel1", saldo, 0);
  if (!resultado) return;

  const porcentaje = (resultado.tramosCompletados / 4) * 100;
  document.getElementById("progreso-nivel1").style.width = porcentaje + "%";

  document.getElementById("info-nivel1").innerText =
    `Tramos completados: ${resultado.tramosCompletados} / 4`;

  document.getElementById("shuriken-nivel1").innerText =
    `Shuriken disponibles: ${resultado.shurikenGanados}`;

  for (let i = 1; i <= resultado.tramosCompletados; i++) {
    const tramo = document.getElementById(`tramo-${i}`);
    if (tramo) tramo.classList.add("activo");
  }
}

// DEMO
renderCicloNivel1(25);


// DEMO TEMPORAL
renderCicloNivel1(25);

const SHURIKEN_POR_TRAMO = 5;

const TORNEOS = [
  {
    id: "torneo-semanal",
    nombre: "Torneo Semanal Ninja",
    costoShuriken: 5,
    fondoUSD: 100,
    ganadores: 20
  }
];

function inscribirseTorneo(idTorneo) {
  const torneo = TORNEOS.find(t => t.id === idTorneo);
  if (!torneo) return alert("Torneo no válido");

  if (shurikenUsuario < torneo.costoShuriken) {
    return alert("No tenés suficientes Shuriken 🥷");
  }

  shurikenUsuario -= torneo.costoShuriken;
  actualizarShuriken(0);

  alert(
    `Inscripto en ${torneo.nombre}\n` +
    `Fondo total: $${torneo.fondoUSD}\n` +
    `Premios para los primeros ${torneo.ganadores}`
  );

  // Registro futuro (no pago automático)
}


let usuario = {
  nivelActual: 1,
  tramoNivel1: 0, // de 0 a 4
  nivel2Desbloqueado: false
};

function avanzarTramoNivel1() {
  if (usuario.tramoNivel1 >= 4) return;

  usuario.tramoNivel1++;

  actualizarUITramoNivel1();

  if (usuario.tramoNivel1 === 4) {
    desbloquearNivel2();
  }
}

function desbloquearNivel2() {
  usuario.nivel2Desbloqueado = true;
  alert("🎉 ¡Nivel Avanzado desbloqueado!");
}

function actualizarUITramoNivel1() {
  const progreso = document.getElementById("progreso-nivel1");
  const info = document.getElementById("info-nivel1");

  if (!progreso || !info) return;

  const porcentaje = (usuario.tramoNivel1 / 4) * 100;
  progreso.style.width = porcentaje + "%";

  info.textContent = `Tramos completados: ${usuario.tramoNivel1} / 4`;
}


