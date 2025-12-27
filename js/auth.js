/* ==========================
   LOGIN
========================== */
function login() {
  const user = document.getElementById("user")?.value.trim();
  const pass = document.getElementById("pass")?.value;

  if (!user || !pass) {
    mostrarError("Completa usuario y contraseña");
    return;
  }

  const savedPass = localStorage.getItem("aidflow_pass_" + user);

  if (!savedPass || savedPass !== pass) {
    mostrarError("Usuario o contraseña incorrectos");
    return;
  }

  // ✅ SESIÓN ACTIVA
  localStorage.setItem("aidflow_user", user);
  localStorage.setItem("aidflow_auth", "true");

  mostrarError("");

  // 👉 ir al dashboard del usuario
  window.location.href = "/dashboard/index.html";
}

/* ==========================
   ERRORES
========================== */
function mostrarError(msg) {
  const el = document.getElementById("login-error");
  if (el) el.textContent = msg;
}

/* ==========================
   LOGOUT USUARIO
========================== */
function logout() {
  localStorage.removeItem("aidflow_user");
  localStorage.removeItem("aidflow_auth");

  window.location.href = "/login.html";
}

/* ==========================
   PROTEGER RUTAS
========================== */
function protegerRuta() {
  const user = localStorage.getItem("aidflow_user");
  const auth = localStorage.getItem("aidflow_auth");

  if (auth !== "true" || !user) {
    window.location.href = "/login.html";
  }
}

/* ==========================
   BLOQUEAR LOGIN SI YA ESTÁ LOGUEADO
========================== */
function bloquearLoginSiAutenticado() {
  const auth = localStorage.getItem("aidflow_auth");
  const user = localStorage.getItem("aidflow_user");

  if (auth === "true" && user) {
    window.location.href = "/dashboard/index.html";
  }
}
