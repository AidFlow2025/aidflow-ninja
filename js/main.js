document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("menuToggle");
  const menu = document.getElementById("navMenu");

  toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
  });

  // Cierra menú al tocar link (mobile)
  document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("active");
    });
  });
});

// Marcar link activo según la página
const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll(".nav-links a").forEach(link => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});

// main.js

init();

function init() {
  const usuariosActivos = obtenerUsuariosActivos();
  const daoFondos = obtenerFondosDAO();

  renderTorneos(usuariosActivos, daoFondos);
}


// main.js

init();

//function init() {
//  renderLeaderboard();
//}

/*************************
 * LOGIN SIMULADO
 *************************/
function loginSimulado() {
  localStorage.setItem("aidflow_logged_in", "true");
  window.location.href = "dashboard/index.html";
}

function logoutSimulado() {
  localStorage.removeItem("aidflow_logged_in");
  window.location.href = "../index.html";
}
/*************************
 * INDEX INTELIGENTE
 *************************/
document.addEventListener("DOMContentLoaded", () => {
  const loggedIn = localStorage.getItem("aidflow_logged_in");

  const btnLogin = document.getElementById("btn-login");
  const btnPanel = document.getElementById("btn-panel");

  if (btnLogin && btnPanel) {
    if (loggedIn) {
      btnLogin.style.display = "none";
      btnPanel.style.display = "inline-block";
    } else {
      btnLogin.style.display = "inline-block";
      btnPanel.style.display = "none";
    }
  }
});

/*************************
 * PROTECCIÓN DE RUTAS
 *************************/
/*************************
 * CONTROL GLOBAL DE RUTAS
 *************************/
document.addEventListener("DOMContentLoaded", () => {
  const loggedIn = localStorage.getItem("aidflow_logged_in");
  const path = window.location.pathname;

  const esDashboard = path.includes("/dashboard");
  const esIndex =
    path === "/" ||
    path.endsWith("/index.html");

  // 🚫 No logueado intentando entrar al dashboard
  if (esDashboard && !loggedIn) {
    window.location.href = "../index.html";
    return;
  }

  // ✅ Logueado intentando quedarse en el index
  if (loggedIn && esIndex) {
    window.location.href = "dashboard/index.html";
    return;
  }
});


