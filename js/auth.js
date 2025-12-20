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
