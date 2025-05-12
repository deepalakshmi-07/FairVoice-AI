// add-official.js

// point Axios at your backend
axios.defaults.baseURL = "http://localhost:3000";

const roleSelect = document.getElementById("role");
const regionSelect = document.getElementById("region");
const form = document.getElementById("addOfficialForm");

// map roles to region lists
const regions = {
  state: ["Tamil Nadu"],
  district: ["Chennai", "Kanchipuram"],
  subdistrict: [
    "South Chennai",
    "North Chennai",
    "Central Chennai",
    "Sriperumbudur",
    "Kanchipuram",
  ],
};

// refill the Region dropdown when Role changes
roleSelect.addEventListener("change", () => {
  const list = regions[roleSelect.value] || [];
  regionSelect.innerHTML =
    '<option value="" disabled selected>Select Region</option>';
  list.forEach((name) => {
    const opt = document.createElement("option");
    opt.value = name.toLowerCase().replace(/\s+/g, "");
    opt.textContent = name;
    regionSelect.appendChild(opt);
  });
});

// handle the Add Official form
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // gather form data
  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    password: form.password.value,
    phone: form.phone.value.trim(),
    department: form.department.value,
    role: form.role.value,
    region: form.region.value,
  };

  // grab the admin token
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in as admin to add officials.");
    return (window.location.href = "/official-login.html");
  }

  try {
    // call the protected add-official endpoint
    await axios.post("/api/admin/add-official", payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Official registered successfully!");
    window.location.href = "/Admin/admin-dashboard.html";
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Failed to register official.");
  }
});
