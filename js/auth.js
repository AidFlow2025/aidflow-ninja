function login() {
  const user = document.getElementById("user").value.trim();
  const pass = document.getElementById("pass").value;
  const acepta = document.getElementById("aceptaTerminos");

  const error = document.getElementById("login-error");

  if (!user || !pass) {
    error.textContent = "Completa usuario y contraseña";
    return;
  }

  if (acepta && !acepta.checked) {
    error.textContent = "Debes aceptar los términos";
    return;
  }

  const passGuardada = localStorage.getItem("aidflow_pass_" + user);

  if (!passGuardada || passGuardada !== pass) {
    error.textContent = "Credenciales incorrectas";
    return;
  }

  // ✅ AUTENTICACIÓN CORRECTA
  localStorage.setItem("aidflow_user", user);

  window.location.href = "dashboard/index.html";
}

/* ======================
   PROTECCIÓN DE RUTAS
====================== */
function protegerRuta(tipo = "user") {
  if (tipo === "user") {
    if (!localStorage.getItem("aidflow_user")) {
      window.location.href = "../login.html";
    }
  }

  if (tipo === "admin") {
    if (localStorage.getItem("aidflow_admin_auth") !== "true") {
      window.location.href = "index.html";
    }
  }
}

function logout() {
  localStorage.removeItem("aidflow_user");
  window.location.href = "../login.html";
}
