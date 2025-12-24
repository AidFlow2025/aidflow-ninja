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
