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
