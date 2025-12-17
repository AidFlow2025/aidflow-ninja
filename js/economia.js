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

function aplicarGanancia(nivel, saldoActual, ganancia) {
  const data = ECONOMIA.niveles[nivel];
  if (!data) return null;

  const tramoValor = data.cicloMaximo / data.tramos;
  let nuevoSaldo = saldoActual + ganancia;

  let tramosCompletados = Math.floor(nuevoSaldo / tramoValor);
  if (tramosCompletados > data.tramos) {
    tramosCompletados = data.tramos;
  }

  return {
    nuevoSaldo,
    tramoValor,
    tramosCompletados,
    retiroHabilitado: tramosCompletados > 0
  };
}

window.aplicarGanancia = aplicarGanancia;


