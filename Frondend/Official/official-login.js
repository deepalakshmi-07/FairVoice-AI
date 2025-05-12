// official-login.js

// point Axios at your backend
axios.defaults.baseURL = "http://localhost:3000";

const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMsg.textContent = "";

  // build payload
  const payload = {
    email: form.email.value.trim(),
    password: form.password.value,
  };

  try {
    // call your official‐login endpoint
    const { data } = await axios.post("/api/auth/official-login", payload);

    // store the token for later calls
    localStorage.setItem("token", data.token);

    // redirect based on role
    if (data.role === "admin") {
      window.location.href = "/Admin/admin-dashboard.html";
    } else {
      window.location.href = "/Official/official-dashboard.html";
    }
  } catch (err) {
    // display server-sent error or fallback
    errorMsg.textContent = err.response?.data?.message || "Login failed";
  }
});
