/*************************
 * AUTH SIMPLE AIDFLOW
 *************************/
const SESSION_KEY = "aidflow_sesion";

/*************************
 * LOGIN
 *************************/
function loginNinja() {
  localStorage.setItem(SESSION_KEY, "true");
  window.location.href = "/dashboard/index.html";
}

/*************************
 * LOGOUT
 *************************/
function logoutNinja() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = "/index.html";
}

/*************************
 * CHECK SESION
 *************************/
function usuarioLogueado() {
  return localStorage.getItem(SESSION_KEY) === "true";
}


function login() {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  // MOCK (por ahora)
  if (user === "admin" && pass === "admin123") {
    localStorage.setItem("aidflow_role", "admin");
    window.location.href = "/admin/index.html";
    return;
  }

  if (user && pass) {
    localStorage.setItem("aidflow_role", "user");
    window.location.href = "/dashboard/index.html";
    return;
  }

  document.getElementById("login-error").textContent =
    "❌ Datos incorrectos";
}

function protegerRuta(roleNecesario) {
  const role = localStorage.getItem("aidflow_role");
  if (role !== roleNecesario) {
    window.location.href = "/login.html";
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "/index.html";
}

function registrarUsuario() {
  const acepta = document.getElementById("aceptaTerminos")?.checked;
  const nombre = document.getElementById("username")?.value;

  if (!nombre) {
    alert("⚠️ Ingresá un nombre ninja");
    return;
  }

  if (!acepta) {
    alert("⚠️ Debés aceptar los Términos y Condiciones");
    return;
  }

  const usuario = {
    id: "ninja_" + Date.now(),
    nombre,
    registrado: true,
    aceptaTerminos: true,
    pagoConfirmado: false,
    nivel: 0
  };

  localStorage.setItem("aidflow_usuario", JSON.stringify(usuario));

  // 👉 va a activar pase
  window.location.href = "pago.html";
}


function registrarNinja() {
  const user = document.getElementById("reg-user").value;
  const pass = document.getElementById("reg-pass").value;
  const terminos = document.getElementById("reg-terminos").checked;

  if (!user || !pass) {
    mostrarError("Completá todos los campos");
    return;
  }

  if (!terminos) {
    mostrarError("Debés aceptar los términos");
    return;
  }

  const data = {
    user,
    pass,
    pago: false,
    nivel: 1,
    referidos: 0
  };

  localStorage.setItem("aidflow_user", JSON.stringify(data));
  window.location.href = "pago.html";
}

function mostrarError(msg) {
  const el = document.getElementById("reg-error");
  if (el) el.textContent = msg;
}
