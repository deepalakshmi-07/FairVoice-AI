// Static petition data (can be replaced with dynamic content)
const petitionData = {
  title: "Street Light Installation in Perambur",
  name: "Deepa Shankar",
  phone: "9967123456",
  location: "Perambur, Chennai",
  description: "Several streets in Perambur lack proper lighting, making it unsafe at night. We request installation of street lights.",
  documents: [
    { name: "Dark Zones Map.jpg", url: "files/dark-zones-map.jpg" }
  ]
};

// Renders petition details
function openPetitionDetail(data) {
  const petitionTable = document.getElementById("petitionTable");
  petitionTable.innerHTML = `
    <tr><th>Petition Title</th><td>${data.title}</td></tr>
    <tr><th>Full Name</th><td>${data.name}</td></tr>
    <tr><th>Phone Number</th><td>${data.phone}</td></tr>
    <tr><th>Location</th><td>${data.location}</td></tr>
    <tr><th>Description</th><td>${data.description}</td></tr>
    <tr><th>Uploaded Documents</th><td>
      <ul>
        ${data.documents.map(doc => `<li><a href="${doc.url}" download>${doc.name}</a></li>`).join("")}
      </ul>
    </td></tr>
  `;
}

// PDF download
function downloadAsPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const title = document.getElementById("petitionTitle").textContent;
  doc.setFontSize(18);
  doc.text(title, 14, 20);

  const table = document.getElementById("petitionTable");
  const tableData = [];

  for (let i = 0; i < table.rows.length; i++) {
    const row = table.rows[i];
    const rowData = [];
    rowData.push(row.cells[0].textContent.trim());
    let cellContent = row.cells[1].textContent.trim();
    rowData.push(cellContent);
    tableData.push(rowData);
  }

  doc.autoTable({
    head: [["Field", "Information"]],
    body: tableData,
    startY: 30,
    theme: "grid",
    headStyles: {
      fillColor: [75, 58, 255],
      textColor: [255, 255, 255],
      fontStyle: "bold"
    },
    columnStyles: { 0: { cellWidth: 60 } },
    margin: { top: 30 },
    styles: {
      overflow: "linebreak",
      cellPadding: 4
    }
  });

  const filename = title.toLowerCase().replace(/\s+/g, '_') + ".pdf";
  doc.save(filename);
}

// Sidebar toggle
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("collapsed");
}

// Logout
function logout() {
  alert("You have been logged out!");
  window.location.href = "../Main_home.html";
}

// Initialize page
openPetitionDetail(petitionData);
