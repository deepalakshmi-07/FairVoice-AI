function searchPetitions() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const table = document.getElementById("petitionTableBody");
    const rows = table.getElementsByTagName("tr");
  
    for (let i = 0; i < rows.length; i++) {
      const titleCell = rows[i].getElementsByTagName("td")[1];
      const idCell = rows[i].getElementsByTagName("td")[4];
  
      const titleText = titleCell.textContent.toLowerCase();
      const idText = idCell.textContent.toLowerCase();
  
      if (titleText.includes(input) || idText.includes(input)) {
        rows[i].style.display = "";
      } else {
        rows[i].style.display = "none";
      }
    }
  }
  