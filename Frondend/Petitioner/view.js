// view.js
// Fetch and display the logged-in user's petitions using Axios

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to view your petitions.");
    return;
  }

  try {
    // Request the user's petitions from the backend
    const resp = await axios.get("http://localhost:3000/api/petitions/mine", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const petitions = resp.data;
    const tbody = document.getElementById("petitionTableBody");
    tbody.innerHTML = ""; // Clear any placeholder rows

    if (Array.isArray(petitions) && petitions.length > 0) {
      // Show most recent first
      petitions.reverse().forEach((p, idx) => {
        const petitionNo = `P${String(idx + 1).padStart(3, "0")}`;
        const title = p.petitionTitle;
        const date = new Date(p.createdAt).toISOString().split("T")[0];
        const gid = p.grievanceId || "-";

        // Color coding for status
        let statusColor;
        switch (p.status) {
          case "Submitted":
            statusColor = "green";
            break;
          case "In Progress":
            statusColor = "orange";
            break;
          case "Resolved":
            statusColor = "blue";
            break;
          case "Rejected":
            statusColor = "red";
            break;
          default:
            statusColor = "black";
        }

        // Create and append row
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${petitionNo}</td>
          <td title="${p.petitionDescription}">${title}</td>
          <td>${date}</td>
          <td style="color: ${statusColor};">${p.status}</td>
          <td>${gid}</td>
        `;
        tbody.appendChild(tr);
      });
    } else {
      // No petitions to display
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding-right:5px;">You haven't submitted any petitions yet.</td></tr>`;
    }
  } catch (err) {
    console.error("Error fetching petitions:", err.response?.data || err);
    document.getElementById(
      "petitionTableBody"
    ).innerHTML = `<tr><td colspan="5">Error loading petitions.</td></tr>`;
  }
});
