// official-login.js

// Point Axios at your backend
axios.defaults.baseURL = "http://localhost:3000";

const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const toggleBtn = document.getElementById("togglePassword");

// 1. Auto-convert email to lowercase as user types
emailInput.addEventListener("input", () => {
  emailInput.value = emailInput.value.toLowerCase();
});

// 2. Toggle password visibility
toggleBtn.addEventListener("click", () => {
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);

  // Switch the icon class
  toggleBtn.classList.toggle("bi-eye-fill");
  toggleBtn.classList.toggle("bi-eye-slash-fill");
});

// 3. Handle form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMsg.textContent = "";

  const payload = {
    email: emailInput.value.trim(),
    password: passwordInput.value,
  };

  try {
    const { data } = await axios.post("/api/auth/official-login", payload);
    localStorage.setItem("token", data.token);

    if (data.role === "admin") {
      window.location.replace("/Frondend/Admin/admin-dashboard.html");
    } else {
      window.location.replace("/Frondend/Official/official-dashboard.html");
    }
  } catch (err) {
    errorMsg.textContent = err.response?.data?.message || "Login failed";
  }
});
