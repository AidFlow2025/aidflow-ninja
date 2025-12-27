/*************************
 * CARGA DE USUARIO REAL
 *************************/

if (!localStorage.getItem("aidflow_sesion")) {
  window.location.href = "/index.html";
}

let usuario = JSON.parse(
  localStorage.getItem("aidflow_usuario")
) || {
  id: "usuario_local",
  nivel: 1,
  tramoNivel1: 0,
  shuriken: 0,
  saldo: 0,
  nivel2Desbloqueado: false
};

const SISTEMA = {
  usuariosMinimosTorneos: 100
};

/*************************
 * USUARIOS ACTIVOS (mock)
 *************************/
function obtenerCantidadUsuarios() {
  return Number(
    localStorage.getItem("aidflow_usuarios_activos")
  ) || 0;
}

/*************************
 * TORNEOS
 *************************/
function torneosHabilitados() {
  return obtenerCantidadUsuarios() >= SISTEMA.usuariosMinimosTorneos;
}

/*************************
 * UI
 *************************/
function actualizarDashboard() {
  document.getElementById("ninjaName").textContent =
    usuario.nivel2Desbloqueado ? "Nivel: Avanzado" : "Nivel: Recluta";

  document.getElementById("shurikenCount").textContent = usuario.shuriken;
  document.getElementById("saldo").textContent = usuario.saldo.toFixed(2);
  document.getElementById("tramos").textContent = usuario.tramoNivel1;

  const progress = document.getElementById("progressBar");
  progress.value = usuario.tramoNivel1;

  const withdrawBtn = document.getElementById("withdrawBtn");
  withdrawBtn.disabled = usuario.tramoNivel1 === 0;

  // Ranking
  document.getElementById("rankingStatus").textContent =
    usuario.tramoNivel1 > 0 ? "Activo" : "Bloqueado";

  // Torneos
  const torneoCard = document.querySelector(".card.locked");
  const torneoText = torneoCard.querySelector("p");
  const torneoBtn = torneoCard.querySelector("button");

  if (torneosHabilitados()) {
    torneoCard.classList.remove("locked");
    torneoText.textContent = "🏆 Torneos activos";
    torneoBtn.disabled = false;
    torneoBtn.textContent = "Entrar a torneo";
  } else {
    torneoText.textContent =
      "🔒 Torneos bloqueados hasta 100 usuarios activos";
    torneoBtn.disabled = true;
  }
}

/*************************
 * INIT
 *************************/
document.addEventListener("DOMContentLoaded", () => {
  actualizarDashboard();
});


protegerRuta();
crearWalletSiNoExiste();
renderWallet();
