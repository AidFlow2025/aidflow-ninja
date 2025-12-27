/* ==========================
   WALLET INTERNA – AidFlow Ninja
========================== */

function getUser() {
  return localStorage.getItem("aidflow_user");
}

/* ==========================
   CREAR WALLET (si no existe)
========================== */
function crearWalletSiNoExiste() {
  const user = getUser();
  if (!user) return;

  const key = "aidflow_wallet_" + user;
  if (localStorage.getItem(key) === null) {
    localStorage.setItem(key, JSON.stringify({
      saldo: 0,
      historial: []
    }));
  }
}

/* ==========================
   OBTENER WALLET
========================== */
function obtenerWallet() {
  const user = getUser();
  if (!user) return null;

  const key = "aidflow_wallet_" + user;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

/* ==========================
   GUARDAR WALLET
========================== */
function guardarWallet(wallet) {
  const user = getUser();
  if (!user) return;

  const key = "aidflow_wallet_" + user;
  localStorage.setItem(key, JSON.stringify(wallet));
}

/* ==========================
   SUMAR SALDO
========================== */
function sumarSaldo(monto, motivo = "Ingreso") {
  const wallet = obtenerWallet();
  if (!wallet) return;

  wallet.saldo += monto;
  wallet.historial.push({
    tipo: "ENTRADA",
    monto,
    motivo,
    fecha: new Date().toISOString()
  });

  guardarWallet(wallet);
  renderWallet();
}

/* ==========================
   RESTAR SALDO
========================== */
function restarSaldo(monto, motivo = "Gasto") {
  const wallet = obtenerWallet();
  if (!wallet) return false;

  if (wallet.saldo < monto) return false;

  wallet.saldo -= monto;
  wallet.historial.push({
    tipo: "SALIDA",
    monto,
    motivo,
    fecha: new Date().toISOString()
  });

  guardarWallet(wallet);
  renderWallet();
  return true;
}

/* ==========================
   OBTENER SALDO
========================== */
function obtenerSaldo() {
  const wallet = obtenerWallet();
  return wallet ? wallet.saldo : 0;
}

/* ==========================
   RENDER WALLET (UI)
========================== */
function renderWallet() {
  const wallet = obtenerWallet();
  if (!wallet) return;

  const saldoEl = document.getElementById("wallet-saldo");
  if (saldoEl) {
    saldoEl.textContent = "$" + wallet.saldo.toFixed(2);
  }

  const histEl = document.getElementById("wallet-historial");
  if (histEl) {
    histEl.innerHTML = "";
    wallet.historial.slice().reverse().forEach(h => {
      const li = document.createElement("li");
      li.textContent = `${h.tipo} $${h.monto} — ${h.motivo}`;
      histEl.appendChild(li);
    });
  }
}

/* ==========================
   BLOQUEO POR PAGO
========================== */
function tieneAccesoBasico() {
  return obtenerSaldo() >= 10;
}
