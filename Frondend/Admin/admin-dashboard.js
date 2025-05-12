/* admin-dashboard.js */
// Handle Manage Officials navigation
const manageLink = document.getElementById("manageOfficialsLink");
manageLink.addEventListener("click", () => {
  window.location.href = "manage-official.html";
});

// Handle Logout (clear token and redirect to login)
const logoutLink = document.getElementById("logoutLink");
logoutLink.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "official-login.html";
});
