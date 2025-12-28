/* ==========================
   MAIN.JS — SOLO UI / HOME
   (SIN AUTH / SIN REDIRECTS)
========================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ==========================
     MENÚ MOBILE
  ========================== */
  const toggle = document.getElementById("menuToggle");
  const menu = document.getElementById("navMenu");

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      menu.classList.toggle("active");
    });

    // Cierra menú al tocar link (mobile)
    menu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        menu.classList.remove("active");
      });
    });
  }

  /* ==========================
     LINK ACTIVO EN NAV
  ========================== */
  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav-links a").forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPage || href === "#" + currentPage) {
      link.classList.add("active");
    }
  });
});
