function entrarDuelo() {
  const user = localStorage.getItem("aidflow_user");
  if (!user) return;

  const saldoKey = "aidflow_saldo_" + user;
  let saldo = Number(localStorage.getItem(saldoKey)) || 0;

  if (saldo < 0.25) {
    alert("❌ Saldo insuficiente para duelarte");
    return;
  }

  // cobrar apuesta
  saldo -= 0.25;
  localStorage.setItem(saldoKey, saldo);

  // simular rival
  const gana = Math.random() > 0.5;

  if (gana) {
    saldo += 0.5;
    localStorage.setItem(saldoKey, saldo);
    alert("🏆 ¡Ganaste el duelo! +$0.50");
  } else {
    alert("💀 Perdiste el duelo");
  }
}
