// js/economia.js

export const usuarioBase = {
  nivel: 1, // SIEMPRE arranca en 1

  ciclo: {
    activo: true,
    etapa: 1,          // 1 a 4
    balance: 0,
    tope: 50,          // cambia según nivel
    completo: false
  },

  premios: {
    saldo: 0
  },

  shuriken: 0
};


export function acreditarPremio(usuario, monto) {
  const espacioCiclo = usuario.ciclo.tope - usuario.ciclo.balance;

  if (espacioCiclo > 0) {
    const alCiclo = Math.min(monto, espacioCiclo);
    usuario.ciclo.balance += alCiclo;

    if (usuario.ciclo.balance >= usuario.ciclo.tope) {
      usuario.ciclo.completo = true;
      usuario.ciclo.activo = false;
    }

    usuario.premios.saldo += (monto - alCiclo);
  } else {
    usuario.premios.saldo += monto;
  }
}


// TEST LOCAL
const usuario = JSON.parse(JSON.stringify(usuarioBase));

usuario.ciclo.balance = 45;

acreditarPremio(usuario, 100);

console.log(usuario);
