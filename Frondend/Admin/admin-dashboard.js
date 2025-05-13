// admin-dashboard.js

// 1. Block back‑button
window.history.replaceState(null, null, window.location.href);
window.addEventListener("popstate", () => {
  window.history.pushState(null, null, window.location.href);
});

// 2. Guard: if no JWT, redirect immediately
if (!localStorage.getItem("token")) {
  window.location.replace("/Frondend/Petitioner/Main_home.html");
}

// 3. DOM ready for element lookups
document.addEventListener("DOMContentLoaded", () => {
  // Logout
  document.getElementById("logoutLink").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.replace("/Frondend/Petitioner/Main_home.html");
  });

  // Manage Officials
  document
    .getElementById("manageOfficialsLink")
    .addEventListener("click", () => {
      window.location.href = "manage-official.html";
    });
});
