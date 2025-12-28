/* ==========================
   AUTH CENTRAL — AIDFLOW
   Cerebro de autenticación
   Actualizado: 2025-12-28
   Admin: KarlitoxRey
========================== */

/* ==========================
   LOGIN
========================== */
function login() {
  const user = document.getElementById("user")?.value.trim();
  const pass = document.getElementById("pass")?.value;
  const errorEl = document.getElementById("login-error");

  if (!user || !pass) {
    errorEl.textContent = "Completá usuario y contraseña";
    return;
  }

  const raw = localStorage.getItem("aidflow_user_" + user);
  if (!raw) {
    errorEl.textContent = "Usuario o contraseña incorrectos";
    return;
  }

  const data = JSON.parse(raw);

  if (data.pass !== pass) {
    errorEl.textContent = "Usuario o contraseña incorrectos";
    return;
  }

  /* SESIÓN */
  localStorage.setItem("aidflow_auth", "true");
  localStorage.setItem("aidflow_user", user);

  /* ROL */
  if (user === "ZevlaSaitam") {
    localStorage.setItem("aidflow_role", "admin");
  } else {
    localStorage.setItem("aidflow_role", "user");
  }

  window.location.href = "/dashboard/index.html";
}

/* ==========================
   LOGOUT
========================== */
function logout() {
  localStorage.removeItem("aidflow_auth");
  localStorage.removeItem("aidflow_user");
  localStorage.removeItem("aidflow_role");
  window.location.href = "/login.html";
}

/* ==========================
   PROTEGER RUTAS
========================== */
function protegerRuta() {
  const auth = localStorage.getItem("aidflow_auth");
  const user = localStorage.getItem("aidflow_user");

  if (auth !== "true" || !user) {
    window.location.href = "/login.html";
  }
}

/* ==========================
   BLOQUEAR LOGIN
========================== */
function bloquearLoginSiAutenticado() {
  const auth = localStorage.getItem("aidflow_auth");
  const user = localStorage.getItem("aidflow_user");

  if (auth === "true" && user) {
    window.location.href = "/dashboard/index.html";
  }
}

/* ==========================
   SOLO ADMIN
========================== */
function protegerAdmin() {
  const auth = localStorage.getItem("aidflow_auth");
  const role = localStorage.getItem("aidflow_role");

  if (auth !== "true" || role !== "admin") {
    window.location.href = "/login.html";
  }
}
