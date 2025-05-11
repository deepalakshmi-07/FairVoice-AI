function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("collapsed");
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
function openForwardModal() {
  document.getElementById("forwardModal").style.display = "block";
}

function closeForwardModal() {
  document.getElementById("forwardModal").style.display = "none";
}

document.getElementById("forwardForm").addEventListener("submit", function (e) {
  e.preventDefault();
  // Gather form data
  const department = document.getElementById("department").value;
  const reason = document.getElementById("reason").value;
  const file = document.getElementById("file").files[0];

  // For now, we'll just log the data
  console.log("Department:", department);
  console.log("Reason:", reason);
  if (file) {
    console.log("File:", file.name);
  }

  // Close the modal after submission
  closeForwardModal();
});
function logout() {
  // Redirect to the homepage without allowing the user to go back
  window.location.replace("Main_home.html"); // Replace with the path to your homepage
}
function showCompletedMessage() {
  alert("This petition has been marked as completed.");
}
function showRejectedMessage() {
  alert("This petition has been marked as Rejected.");
}
