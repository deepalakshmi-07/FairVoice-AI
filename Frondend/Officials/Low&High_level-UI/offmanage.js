const officials = [
    { name: "Anita Sharma", email: "anita@midlevel.gov", role: "Mid-Level", location: "Zone A" },
    { name: "Ravi Kumar", email: "ravi@lowlevel.gov", role: "Low-Level", location: "District B" },
  ];

  const officialsBody = document.getElementById('officialsBody');

  function renderOfficials() {
    officialsBody.innerHTML = '';
    officials.forEach((official, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${official.name}</td>
        <td>${official.email}</td>
        <td>${official.role}</td>
        <td>${official.location}</td>
        <td>
          <button class="action-btn edit-btn" onclick="editOfficial(${index})">Edit</button>
          <button class="action-btn remove-btn" onclick="removeOfficial(${index})">Remove</button>
        </td>
      `;
      officialsBody.appendChild(row);
    });
  }

  function editOfficial(index) {
    alert(`Editing: ${officials[index].name}`);
    // You can redirect to an edit page with query params or a modal popup
  }

  function removeOfficial(index) {
    const confirmRemove = confirm(`Are you sure you want to remove ${officials[index].name}?`);
    if (confirmRemove) {
      officials.splice(index, 1);
      renderOfficials();
    }
  }
document.addEventListener("DOMContentLoaded", function () {
    renderOfficials();
  });
  
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("collapsed");
}
function logout() {
    // Redirect to the homepage without allowing the user to go back
    window.location.replace('Main_home.html'); // Replace with the path to your homepage
}

