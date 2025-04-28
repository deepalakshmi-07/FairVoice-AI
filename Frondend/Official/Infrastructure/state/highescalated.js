function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("collapsed");
  }
  function logout() {
    // You can add real logout logic here (session clear, redirect etc.)
    alert("You have been logged out!");
    window.location.href = "Main_home.html"; // Redirect to login page
  }
  function openModal(petition) {
    document.getElementById("modalTitle").textContent = petition.title;
    document.getElementById("modalName").textContent = petition.name;
    document.getElementById("modalPhone").textContent = petition.phone;
    document.getElementById("modalLocation").textContent = petition.location;
    document.getElementById("modalDescription").textContent =
      petition.description;
  
    // Documents
    const docList = document.getElementById("modalDocuments");
    docList.innerHTML = ""; // Clear previous
    petition.documents.forEach((doc) => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${doc.url}" target="_blank">${doc.name}</a>`;
      docList.appendChild(li);
    });
  
    document.getElementById("petitionModal").style.display = "block";
  }
  
  function closeModal() {
    document.getElementById("petitionModal").style.display = "none";
  }
  
  window.onclick = function (event) {
    const modal = document.getElementById("petitionModal");
    if (event.target == modal) {
      closeModal();
    }
  };
  
  function logout() {
    // Redirect to the homepage without allowing the user to go back
    window.location.replace("Main_home.html"); // Replace with the path to your homepage
  }
  function openReportModal() {
    document.getElementById("reportModal").style.display = "block";
  }
  
  function closeReportModal() {
    document.getElementById("reportModal").style.display = "none";
  }
  
  document.getElementById("reportForm").addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Report submitted successfully.");
    closeReportModal();
  });
  