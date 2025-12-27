/* =========================
   DOJO NINJA – SISTEMA BASE
   ========================= */

/*
  El Dojo representa:
  - estado del ninja
  - mensajes del sistema
  - espacio futuro para misiones, juegos, rankings
*/

document.addEventListener("DOMContentLoaded", () => {
  iniciarDojo();
});

/* =========================
   INIT DOJO
========================= */
function iniciarDojo() {
  const user = localStorage.getItem("aidflow_user");

  if (!user) {
    console.warn("Dojo: no hay usuario activo");
    return;
  }

  // Crear estado inicial si no existe
  if (!localStorage.getItem("aidflow_dojo_" + user)) {
    const estadoInicial = {
      nivel: 1,
      energia: 100,
      rango: "Aprendiz",
      ultimaActividad: Date.now()
    };

    localStorage.setItem(
      "aidflow_dojo_" + user,
      JSON.stringify(estadoInicial)
    );
  }

  mostrarEstadoDojo();
}

/* =========================
   MOSTRAR ESTADO
========================= */
function mostrarEstadoDojo() {
  const user = localStorage.getItem("aidflow_user");
  const el = document.getElementById("dojo-estado");

  if (!user || !el) return;

  const data = JSON.parse(
    localStorage.getItem("aidflow_dojo_" + user)
  );

  el.innerHTML = `
    🥷 <strong>Dojo Ninja</strong><br>
    Rango: ${data.rango}<br>
    Nivel: ${data.nivel}<br>
    Energía: ${data.energia}%
  `;
}

/* =========================
   CONSUMIR ENERGÍA
========================= */
function consumirEnergia(cantidad = 10) {
  const user = localStorage.getItem("aidflow_user");
  if (!user) return;

  const key = "aidflow_dojo_" + user;
  const data = JSON.parse(localStorage.getItem(key));

  data.energia = Math.max(0, data.energia - cantidad);
  data.ultimaActividad = Date.now();

  localStorage.setItem(key, JSON.stringify(data));
  mostrarEstadoDojo();
}

/* =========================
   RECARGAR ENERGÍA
========================= */
function recargarEnergia() {
  const user = localStorage.getItem("aidflow_user");
  if (!user) return;

  const key = "aidflow_dojo_" + user;
  const data = JSON.parse(localStorage.getItem(key));

  data.energia = 100;
  data.ultimaActividad = Date.now();

  localStorage.setItem(key, JSON.stringify(data));
  mostrarEstadoDojo();
}

/* =========================
   SUBIR NIVEL (FUTURO)
========================= */
function subirNivel() {
  const user = localStorage.getItem("aidflow_user");
  if (!user) return;

  const key = "aidflow_dojo_" + user;
  const data = JSON.parse(localStorage.getItem(key));

  data.nivel += 1;

  if (data.nivel >= 5) data.rango = "Guerrero";
  if (data.nivel >= 10) data.rango = "Maestro";
  if (data.nivel >= 20) data.rango = "Leyenda";

  localStorage.setItem(key, JSON.stringify(data));
  mostrarEstadoDojo();
}
