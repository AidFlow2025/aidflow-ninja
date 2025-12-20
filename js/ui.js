/*************************
 * UI - USUARIO
 *************************/
function renderUsuario() {
  if (typeof usuario === "undefined") return;

  const shuriken = document.getElementById("shuriken-usuario") 
                || document.getElementById("shuriken-nivel1");

  const saldo = document.getElementById("saldo-usuario");
  const saldoRetenido = document.getElementById("saldo-retenido");

  if (shuriken) {
    shuriken.textContent = `Shuriken disponibles: ${usuario.shuriken}`;
  }

  if (saldo) {
    saldo.textContent = `Saldo retenido: $${usuario.saldo.toFixed(2)}`;
  }

  if (saldoRetenido) {
    saldoRetenido.textContent = `Saldo retenido: $${usuario.saldo.toFixed(2)}`;
  }
}

/*************************
 * UI - RETIROS
 *************************/
function renderRetiros() {
  const btn = document.getElementById("btn-retiro");
  const bloqueo = document.getElementById("retiro-bloqueado");

  if (!btn) return;

  const habilitado = usuario.tramoNivel1 >= 1 && usuario.saldo > 0;

  btn.disabled = !habilitado;

  if (bloqueo) {
    bloqueo.style.display = habilitado ? "none" : "block";
  }
}

/*************************
 * UI - TORNEOS
 *************************/
function renderTorneos() {
  const estado =
    document.getElementById("estado-torneos") ||
    document.getElementById("estado-torneo");

  const btn = document.getElementById("btn-torneo");

  if (!estado) return;

  if (typeof torneosHabilitados === "function" && torneosHabilitados()) {
    estado.textContent = "🏆 Torneos activos — premios en dinero real";
    if (btn) btn.disabled = false;
  } else {
    estado.textContent =
      "🔒 Torneos bloqueados hasta alcanzar 100 usuarios activos. Modo entrenamiento activo.";
    if (btn) btn.disabled = true;
  }
}

/*************************
 * UI - RANKING DUELOS
 *************************/
function renderRankingDuelos() {
  const lista = document.getElementById("ranking-duelos");
  if (!lista) return;

  const ranking =
    JSON.parse(localStorage.getItem("aidflow_ranking_duelos")) || [];

  lista.innerHTML = "";

  if (ranking.length === 0) {
    lista.innerHTML = "<li>Sin duelos registrados aún</li>";
    return;
  }

  ranking.slice(0, 10).forEach((jugador, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>#${i + 1}</strong> — Ninja ${jugador.id} ⚔️ ${jugador.victorias}`;
    lista.appendChild(li);
  });
}

/*************************
 * UI - RANKING SURVIVAL
 *************************/
function renderRankingSurvivalDashboard() {
  const ul = document.getElementById("ranking-survival-dashboard");
  if (!ul) return;

  const ranking =
    JSON.parse(localStorage.getItem("aidflow_survival_ranking")) || [];

  ul.innerHTML = "";

  if (ranking.length === 0) {
    ul.innerHTML = "<li>Sin registros aún</li>";
    return;
  }

  ranking.slice(0, 10).forEach((r, i) => {
    const li = document.createElement("li");
    li.textContent = `#${i + 1} — ${r.score} pts`;
    ul.appendChild(li);
  });
}

/*************************
 * UI - HISTORIAL
 *************************/
function actualizarHistorialUI() {
  const ciclos = document.getElementById("hist-ciclos");
  if (!ciclos) return;

  document.getElementById("hist-total").textContent =
    `$${usuario.totalGanado.toFixed(2)}`;

  document.getElementById("hist-shuriken").textContent =
    usuario.shurikenGanados;

  document.getElementById("hist-fecha").textContent =
    usuario.ultimoCiclo
      ? new Date(usuario.ultimoCiclo).toLocaleString()
      : "—";
}

/*************************
 * EVENTOS GLOBALES
 *************************/
window.addEventListener("shurikenUpdate", e => {
  const shuriken = document.getElementById("shuriken-usuario");
  if (shuriken) {
    shuriken.textContent = `Shuriken disponibles: ${e.detail.total}`;
  }
});

window.addEventListener("rankingSurvivalUpdate", () => {
  renderRankingSurvivalDashboard();
});

/*************************
 * INIT
 *************************/
document.addEventListener("DOMContentLoaded", () => {
  renderUsuario();
  renderRetiros();
  renderTorneos();
  renderRankingDuelos();
  renderRankingSurvivalDashboard();
});
/*************************
 * UI — ANIMACIONES
 *************************/

function animarProgresoNivel1(porcentajeObjetivo) {
  const barra = document.getElementById("progreso-nivel1");
  if (!barra) return;

  let anchoActual = 0;
  const incremento = 1; // velocidad
  const intervalo = setInterval(() => {
    if (anchoActual >= porcentajeObjetivo) {
      clearInterval(intervalo);
      barra.style.width = porcentajeObjetivo + "%";
    } else {
      anchoActual += incremento;
      barra.style.width = anchoActual + "%";
    }
  }, 10);
}

/*************************
 * ACTUALIZAR UI PROGRESO
 *************************/
function actualizarUIProgresoAnimado() {
  if (!window.usuario || !window.NIVELES) return;

  const porcentaje =
    (usuario.tramoNivel1 / NIVELES[1].tramos) * 100;

  animarProgresoNivel1(porcentaje);
}

/*************************
 * SHURIKEN FEEDBACK
 *************************/

function efectoShuriken(cantidad = 1) {
  const contenedor = document.getElementById("shuriken-nivel1");
  if (!contenedor) return;

  // efecto pulse
  contenedor.classList.add("pulse");
  setTimeout(() => contenedor.classList.remove("pulse"), 400);

  // texto flotante +X
  const flotante = document.createElement("span");
  flotante.textContent = `+${cantidad}`;
  flotante.className = "shuriken-float";
  contenedor.appendChild(flotante);

  setTimeout(() => flotante.remove(), 1000);
}
