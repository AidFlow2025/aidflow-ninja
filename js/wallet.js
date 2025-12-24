// =====================
// WALLET INTERNA
// =====================

const user = localStorage.getItem("aidflow_user");

function getSaldo() {
  return Number(localStorage.getItem("aidflow_saldo_" + user)) || 0;
}

function setSaldo(monto) {
  localStorage.setItem("aidflow_saldo_" + user, monto);
}

function sumarSaldo(monto) {
  const nuevo = getSaldo() + monto;
  setSaldo(nuevo);
  actualizarVistaWallet();
}

function restarSaldo(monto) {
  const saldo = getSaldo();
  if (saldo < monto) {
    alert("Saldo insuficiente");
    return false;
  }
  setSaldo(saldo - monto);
  actualizarVistaWallet();
  return true;
}

function actualizarVistaWallet() {
  const slot = document.getElementById("wallet-saldo");
  if (slot) {
    slot.textContent = getSaldo().toFixed(2);
  }
}

document.addEventListener("DOMContentLoaded", actualizarVistaWallet);


function pagarEntrada(monto = 10) {
  if (!validarDisclaimer()) return;

  const ok = restarSaldo(monto);
  if (!ok) return;

  distribuirPago(monto);
  alert("Ingreso confirmado 🥷");
}


function obtenerWallet(user) {
  return Number(localStorage.getItem("aidflow_wallet_" + user)) || 0;
}

function sumarWallet(user, monto) {
  const saldo = obtenerWallet(user);
  localStorage.setItem(
    "aidflow_wallet_" + user,
    saldo + monto
  );
}

function restarWallet(user, monto) {
  const saldo = obtenerWallet(user);
  if (saldo < monto) return false;
  localStorage.setItem(
    "aidflow_wallet_" + user,
    saldo - monto
  );
  return true;
}
