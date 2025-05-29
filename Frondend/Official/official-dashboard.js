// official-dashboard.js
// maps the DB “value” → full name
const DEPARTMENT_LABELS = {
  health: "Health",
  law: "Law and Order",
  infra: "Infrastructure",
  education: "Education",
  welfare: "Social Welfare",
  admin: "Administration",
};

// 1. Block back‑button so “Back” can’t return to this page
window.history.replaceState(null, null, window.location.href);
window.addEventListener("popstate", () => {
  window.history.pushState(null, null, window.location.href);
});

// 2. Guard: if no JWT, redirect immediately to homepage
if (!localStorage.getItem("token")) {
  window.location.replace("/Frondend/Petitioner/Main_home.html");
}

// Toggle Sidebar Function
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("collapsed");
}

// Logout Function
function logout() {
  // 1) Remove the JWT
  localStorage.removeItem("token");
  // 2) Redirect to the homepage without allowing the user to go back
  window.location.replace("/Frondend/Petitioner/Main_home.html");
}

// Petition Overview Count Logic
// function updatePetitionOverview() {
//   const petitions = document.querySelectorAll(".petition-box");
//   let total = petitions.length;
//   let resolved = 0;
//   let pending = 0;
//   let completed = 0;

//   petitions.forEach((petition) => {
//     const status = petition
//       .querySelector(".status")
//       .textContent.trim()
//       .toLowerCase();
//     if (status === "approved") {
//       resolved++;
//     } else if (status === "pending") {
//       pending++;
//     } else if (status === "completed") {
//       completed++;
//     }
//   });

//   document.getElementById("total-count").textContent = total;
//   document.getElementById("resolved-count").textContent = resolved;
//   document.getElementById("pending-count").textContent = pending;
//   document.getElementById("completed-count").textContent = completed;
// }

// Petition Details Click - Opens a new page or can open a modal with the petition info
function openPetitionDetails(petition) {
  // In this case, we are just navigating to the petition details page
  // You can use this function if you decide to display details in the same page via a modal
  const petitionDetails = {
    title: petition.querySelector(".petition-title").textContent,
    status: petition.querySelector(".status").textContent,
    submissionDate: petition.querySelector(".petition-detail").textContent, // Example for submission date
    district: petition.querySelectorAll(".petition-detail")[1].textContent, // Example for district
  };

  // Example: You could navigate to a detailed petition page:
  localStorage.setItem("petitionDetails", JSON.stringify(petitionDetails)); // Store details temporarily
  window.location.href = "petition-details.html"; // Assuming you want to navigate to a new page for more details
}

// --- JWT parse helper (no extra library) ---
function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
}

// --- welcome text factory ---
function getWelcomeText(role, region, department) {
  const prettyDept = DEPARTMENT_LABELS[department.toLowerCase()] || department;
  const deptLabel = `${prettyDept} department`;

  switch (role) {
    case "state":
      return {
        line1: `Welcome, State Officer of ${region}`,
        line2: deptLabel,
        line3:
          "Empowering districts to serve citizens better across the state.",
      };
    case "district":
      return {
        line1: `Welcome, District Officer – ${region}`,
        line2: deptLabel,
        line3: `Leading effective petition resolution in ${region}.`,
      };
    case "subdistrict":
      return {
        line1: `Welcome, Subdistrict Officer – ${region}`,
        line2: deptLabel,
        line3: `Addressing local grievances in ${region} with care and urgency.`,
      };
    default:
      return {
        line1: "Welcome",
        line2: deptLabel,
        line3: "",
      };
  }
}

// async function fetchAndRenderPetitions() {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     console.error("No token found—you must be logged in.");
//     return;
//   }

//   try {
//     // Use absolute URL in dev to avoid path issues:
//     const res = await axios.get(
//       "http://localhost:3000/api/petitions/forOfficial",
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     //console.log("Fetched petitions:", res.data);
//     const petitions = res.data;
//     console.log("Fetched petitions:", petitions);

//     // ─── 2A) COMPUTE COUNTS ─────────────────────────────
//     const totalCount = petitions.length;
//     const resolvedCount = petitions.filter(
//       (p) => p.status === "Resolved"
//     ).length;
//     const pendingCount = petitions.filter(
//       (p) => p.status === "Submitted" || p.status === "In Progress"
//     ).length;

//     // ─── 2B) UPDATE THE OVERVIEW BOXES ─────────────────
//     document.getElementById("total-count").textContent = totalCount;
//     document.getElementById("pending-count").textContent = pendingCount;
//     document.getElementById("resolved-count").textContent = resolvedCount;

//     // ─── 2C) RENDER PETITION CARDS ───────────────────────
//     const container = document.getElementById("petition-container");
//     container.innerHTML = "";
//     if (!totalCount) {
//       container.innerHTML = "<p>No petitions found.</p>";
//       return;
//     }

//     const container = document.getElementById("petition-container");
//     container.innerHTML = "";

//     if (!res.data.length) {
//       container.innerHTML = "<p>No petitions found.</p>";
//       return;
//     }

//     res.data.forEach((p) => {
//       const date = new Date(p.createdAt).toLocaleDateString();
//       // Build a link carrying the petition’s _id in the query string
//       const href = `petition-details.html?id=${p._id}`;
//       container.insertAdjacentHTML(
//         "beforeend",
//         `
//         <a class="petition-box" href="${href}">
//           <div class="petition-title">${p.petitionTitle}</div>
//           <div class="petition-detail">Submitted on: ${date}</div>
//           <div class="petition-detail">District: ${p.district}</div>
//           <div class="petition-detail">
//             Status: <span class="status ${p.status.toLowerCase()}">${
//           p.status
//         }</span>
//           </div>
//         </a>
//       `
//       );
//     });
//   } catch (err) {
//     console.error("Error fetching petitions:", err);
//     document.getElementById("petition-container").innerHTML =
//       "<p>Failed to load petitions.</p>";
//   }
// }

async function fetchAndRenderPetitions() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found—you must be logged in.");
    return;
  }

  try {
    const res = await axios.get(
      "http://localhost:3000/api/petitions/forOfficial",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const petitions = res.data;
    console.log("Fetched petitions:", petitions);

    // ─── A) COMPUTE COUNTS ─────────────────────────────
    const totalCount = petitions.length;
    const resolvedCount = petitions.filter(
      (p) => p.status === "Resolved"
    ).length;
    const pendingCount = petitions.filter(
      (p) => p.status === "Submitted" || p.status === "In Progress"
    ).length;

    document.getElementById("total-count").textContent = totalCount;
    document.getElementById("pending-count").textContent = pendingCount;
    document.getElementById("resolved-count").textContent = resolvedCount;

    // ─── B) RENDER PETITION CARDS ───────────────────────
    const container = document.getElementById("petition-container");
    container.innerHTML = ""; // clear old cards

    if (totalCount === 0) {
      container.innerHTML = "<p>No petitions found.</p>";
      return;
    }

    petitions.forEach((p) => {
      const date = new Date(p.createdAt).toLocaleDateString();
      const href = `petition-details.html?id=${p._id}`;
      container.insertAdjacentHTML(
        "beforeend",
        `
        <a class="petition-box" href="${href}">
          <div class="petition-title">${p.petitionTitle}</div>
          <div class="petition-detail">Submitted on: ${date}</div>
          <div class="petition-detail">District: ${p.district}</div>
          <div class="petition-detail">
            Status: <span class="status ${p.status.toLowerCase()}">${
          p.status
        }</span>
          </div>
        </a>
      `
      );
    });
  } catch (err) {
    console.error("Error fetching petitions:", err);
    document.getElementById("petition-container").innerHTML =
      "<p>Failed to load petitions.</p>";
  }
}

// Run setup after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // 1) grab the token
  const token = localStorage.getItem("token");
  if (!token) {
    // no token? kick them out
    window.location.replace("/Frondend/Petitioner/Main_home.html");
    return;
  }

  // 2) parse it once
  const { role, region, department } = parseJwt(token);

  // DYNAMIC WELCOME (uses the role we just parsed)
  const { line1, line2, line3 } = getWelcomeText(role, region, department);
  document.getElementById("welcome-line1").innerText = line1;
  document.getElementById("welcome-line2").innerText = line2;
  document.getElementById("welcome-line3").innerText = line3;

  // ——— STATE-ONLY OVERVIEW ──────────────────────
  const overviewEl = document.getElementById("petition-overview");
  const overviewHeading = document.getElementById("overview-title");

  if (role === "state") {
    // state officers see the overview
    overviewEl.style.display = ""; // lets your CSS handle layout (e.g. flex)
    overviewHeading.style.display = ""; // show title
  } else {
    // district & subdistrict: hide
    overviewEl.style.display = "none";
    overviewHeading.style.display = "none";
  }
  // —————————————————————————————————————

  // Attach logout handler
  document.getElementById("logoutBtn").addEventListener("click", logout);

  // — finally, fetch & render all petitions
  fetchAndRenderPetitions();

  // (If you have a sidebar toggle button, attach it here)
  // document.getElementById("sidebarToggleBtn").addEventListener("click", toggleSidebar);
});
