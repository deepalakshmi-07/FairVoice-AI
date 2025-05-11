// add-official.js

const roleSelect = document.getElementById("role");
const regionSelect = document.getElementById("region");

// Define available regions per role
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

// When role changes, refill the region dropdown
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

// Handle form submission
document
  .getElementById("addOfficialForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      name: e.target.name.value.trim(),
      email: e.target.email.value.trim(),
      password: e.target.password.value,
      phone: e.target.phone.value.trim(),
      department: e.target.department.value,
      role: e.target.role.value,
      region: e.target.region.value,
    };

    try {
      await axios.post("/api/admin/add-official", payload, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Official registered successfully!");
      window.location.href = "/admin/dashboard.html";
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to register official.");
    }
  });
