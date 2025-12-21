/*************************
 * UI — USUARIO
 *************************/
function renderUsuario() {
  if (!window.usuario) return;

  const shurikenEl =
    document.getElementById("shuriken-usuario") ||
    document.getElementById("shuriken-nivel1");

  const saldoEl = document.getElementById("saldo-usuario");
  const saldoRetenidoEl = document.getElementById("saldo-retenido");

  if (shurikenEl) {
    shurikenEl.textContent = `Shuriken disponibles: ${usuario.shuriken}`;
  }

  if (saldoEl) {
    saldoEl.textContent = `$${usuario.saldo.toFixed(2)}`;
  }

  if (saldoRetenidoEl) {
    saldoRetenidoEl.textContent = `$${usuario.saldo.toFixed(2)}`;
  }
}

/*************************
 * UI — RETIROS
 *************************/
function renderRetiros() {
  if (!window.usuario) return;

  const btn = document.getElementById("btn-retiro");
  const bloqueo = document.getElementById("retiro-bloqueado");
  if (!btn) return;

  const habilitado =
    usuario.tramoNivel1 >= 1 && usuario.saldo > 0;

  btn.disabled = !habilitado;

  if (bloqueo) {
    bloqueo.style.display = habilitado ? "none" : "block";
  }
}

/*************************
 * UI — TORNEOS
 *************************/
function renderTorneos() {
  const estado =
    document.getElementById("torneos-status") ||
    document.getElementById("estado-torneos") ||
    document.getElementById("estado-torneo");

  const btn = document.getElementById("btn-torneo");
  if (!estado) return;

  const activos =
    typeof torneosHabilitados === "function" &&
    torneosHabilitados();

  if (activos) {
    estado.textContent = "🏆 Torneos activos — premios en dinero real";
    if (btn) btn.disabled = false;
  } else {
    estado.textContent =
      "🔒 Torneos bloqueados hasta alcanzar 100 usuarios activos.";
    if (btn) btn.disabled = true;
  }
}

/*************************
 * UI — RANKING DUELOS
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
 * UI — RANKING SURVIVAL
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
 * UI — HISTORIAL
 *************************/
function actualizarHistorialUI() {
  if (!window.usuario) return;

  const ciclosEl = document.getElementById("hist-ciclos");
  if (!ciclosEl) return;

  ciclosEl.textContent = usuario.ciclosCompletados || 0;

  document.getElementById("hist-total").textContent =
    `$${usuario.totalGanado.toFixed(2)}`;

  document.getElementById("hist-shuriken").textContent =
    usuario.shurikenGanados || 0;

  document.getElementById("hist-fecha").textContent =
    usuario.ultimoCiclo
      ? new Date(usuario.ultimoCiclo).toLocaleString()
      : "—";
}

/*************************
 * UI — PROGRESO ANIMADO
 *************************/
function animarProgresoNivel1(porcentajeObjetivo) {
  const barra = document.getElementById("progreso-nivel1");
  if (!barra) return;

  let ancho = 0;
  const intervalo = setInterval(() => {
    ancho++;
    barra.style.width = ancho + "%";

    if (ancho >= porcentajeObjetivo) {
      clearInterval(intervalo);
    }
  }, 10);
}

function actualizarUIProgresoAnimado() {
  if (!window.usuario || !window.NIVELES) return;

  const porcentaje =
    (usuario.tramoNivel1 / NIVELES[1].tramos) * 100;

  animarProgresoNivel1(Math.min(100, porcentaje));
}

/*************************
 * UI — FEEDBACK SHURIKEN
 *************************/
function efectoShuriken(cantidad = 1) {
  const contenedor = document.getElementById("shuriken-nivel1");
  if (!contenedor) return;

  contenedor.classList.add("pulse");
  setTimeout(() => contenedor.classList.remove("pulse"), 400);

  const flotante = document.createElement("span");
  flotante.className = "shuriken-float";
  flotante.textContent = `+${cantidad}`;
  contenedor.appendChild(flotante);

  setTimeout(() => flotante.remove(), 1000);
}

/*************************
 * EVENTOS GLOBALES
 *************************/
window.addEventListener("shurikenUpdate", e => {
  if (!e.detail) return;
  const el = document.getElementById("shuriken-nivel1");
  if (el) el.textContent = `Shuriken disponibles: ${e.detail.total}`;
});

window.addEventListener("rankingSurvivalUpdate", renderRankingSurvivalDashboard);

/*************************
 * INIT
 *************************/
document.addEventListener("DOMContentLoaded", () => {
  renderUsuario();
  renderRetiros();
  renderTorneos();
  renderReferidos();
  renderRankingDuelos();
  renderRankingSurvivalDashboard();
  actualizarHistorialUI();
  actualizarUIProgresoAnimado();
});


/*************************
 * REFERIDOS
 *************************/

function generarLinkReferido() {
  if (!window.usuario) return;

  const baseURL = window.location.origin;
  const link = `${baseURL}/register.html?ref=${usuario.id}`;

  const input = document.getElementById("link-referido");
  if (input) input.value = link;
}

function copiarReferido() {
  const input = document.getElementById("link-referido");
  if (!input) return;

  input.select();
  document.execCommand("copy");

  alert("🔗 Link de referido copiado");
}

function calcularBonusReferidos() {
  const refs = usuario.referidos || 0;
  const nivel = usuario.nivel || 1;

  let bonus = 0;

  if (nivel === 1) {
    bonus = refs < 2 ? 40 : refs < 4 ? 45 : 50;
  }

  if (nivel === 2) {
    bonus = refs < 2 ? 45 : refs < 4 ? 50 : 55;
  }

  if (nivel === 3) {
    bonus = refs < 2 ? 50 : refs < 4 ? 55 : 60;
  }

  return bonus;
}

function renderReferidos() {
  if (!window.usuario) return;

  document.getElementById("total-referidos").textContent =
    usuario.referidos || 0;

  document.getElementById("ganancias-referidos").textContent =
    `$${(usuario.gananciasReferidos || 0).toFixed(2)}`;

  document.getElementById("bonus-referido").textContent =
    `${calcularBonusReferidos()}%`;

  generarLinkReferido();
}

