const ADMIN_PASSWORD = "CNdeF1988";

function loginAdmin() {
  const pass = document.getElementById("admin-pass").value;
  const error = document.getElementById("error-admin");

  if (pass === ADMIN_PASSWORD) {
    localStorage.setItem("aidflow_admin_auth", "true");
    window.location.href = "dashboard.html";
  } else {
    error.textContent = "Clave incorrecta";
  }
}

function protegerAdmin() {
  if (localStorage.getItem("aidflow_admin_auth") !== "true") {
    window.location.href = "index.html";
  }
}

function logoutAdmin() {
  localStorage.removeItem("aidflow_admin_auth");
  window.location.href = "index.html";
}
