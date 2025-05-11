// official-login.js
const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMsg.textContent = "";

  const payload = {
    email: form.email.value.trim(),
    password: form.password.value,
  };

  try {
    const { data } = await axios.post("/api/auth/login", payload);
    localStorage.setItem("token", data.token);
    if (data.role === "admin") window.location.href = "/admin/dashboard.html";
    else window.location.href = "/officer/dashboard.html";
  } catch (err) {
    errorMsg.textContent = err.response?.data?.message || "Login failed";
  }
});
