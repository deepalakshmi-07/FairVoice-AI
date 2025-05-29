// manage-official.js

// Point Axios to your backend
axios.defaults.baseURL = "http://localhost:3000";

// Mapping from stored department code → display name
const DEPT_MAP = {
  law: "Law & Order",
  infra: "Infrastructure",
  health: "Health",
  education: "Education",
  welfare: "Social Welfare",
  admin: "Administration",
};

// Utility: capitalize first letter
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Format region:
// - Always uppercase first letter
// - If role is subdistrict AND region is 'sriperumbudur' or 'kanchipuram', append " Division"
function formatRegion(region, role) {
  const base = capitalize(region);
  if (
    role === "subdistrict" &&
    (region === "sriperumbudur" || region === "kanchipuram")
  ) {
    return `${base} Division`;
  }
  return base;
}

// Fetch & render officials
async function loadOfficials() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must log in first.");
    return (window.location.href = "/official-login.html");
  }

  try {
    const { data: officers } = await axios.get("/api/admin/list-officials", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const tbody = document.getElementById("officialsBody");
    tbody.innerHTML = "";

    // Exclude system-admin accounts
    const filtered = officers.filter(
      (off) => off.role !== "admin" && off.department !== "admin"
    );

    // Build rows
    filtered.forEach((off, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td>${off.name}</td>
        <td>${off.email}</td>
        <td>${off.phone}</td>
        <td>${DEPT_MAP[off.department] || capitalize(off.department)}</td>
        <td>${capitalize(off.role)}</td>
        <td>${formatRegion(off.region, off.role)}</td>
        <td>
          <button class="btn-edit" onclick="editOfficer('${
            off._id
          }')">Edit</button>
          <button class="btn-remove" onclick="deleteOfficer('${
            off._id
          }')">Remove</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading officials:", err);
    alert("Could not load officials. See console for details.");
  }
}

// Stub: edit an officer
function editOfficer(id) {
  alert(`Edit officer: ${id}`);
}

// Remove an officer then refresh
async function deleteOfficer(id) {
  if (!confirm("Are you sure you want to remove this official?")) return;

  const token = localStorage.getItem("token");
  try {
    await axios.delete(`/api/admin/remove-official/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    loadOfficials();
  } catch (err) {
    console.error("Error removing official:", err);
    alert("Failed to remove. See console for details.");
  }
}

// Initialize on page load
window.addEventListener("DOMContentLoaded", loadOfficials);
