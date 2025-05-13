// Toggle Sidebar Function
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("collapsed");
}

// Logout Function
function logout() {
  // Redirect to the homepage without allowing the user to go back
  window.location.replace("../Main_home.html"); // Replace with the path to your homepage
}

// Petition Overview Count Logic
function updatePetitionOverview() {
  const petitions = document.querySelectorAll(".petition-box");
  let total = petitions.length;
  let resolved = 0;
  let pending = 0;
  let completed = 0;

  petitions.forEach((petition) => {
    const status = petition.querySelector(".status").textContent.trim().toLowerCase();
    if (status === "approved") {
      resolved++;
    } else if (status === "pending") {
      pending++;
    } else if (status === "completed") {
      completed++;
    }
  });

  document.getElementById("total-count").textContent = total;
  document.getElementById("resolved-count").textContent = resolved;
  document.getElementById("pending-count").textContent = pending;
  document.getElementById("completed-count").textContent = completed;
}

// Petition Details Click - Opens a new page or can open a modal with the petition info
function openPetitionDetails(petition) {
  // In this case, we are just navigating to the petition details page
  // You can use this function if you decide to display details in the same page via a modal
  const petitionDetails = {
    title: petition.querySelector(".petition-title").textContent,
    status: petition.querySelector(".status").textContent,
    submissionDate: petition.querySelector(".petition-detail").textContent, // Example for submission date
    district: petition.querySelectorAll(".petition-detail")[1].textContent // Example for district
  };
  
  // Example: You could navigate to a detailed petition page:
  localStorage.setItem("petitionDetails", JSON.stringify(petitionDetails)); // Store details temporarily
  window.location.href = "petition-details.html"; // Assuming you want to navigate to a new page for more details
}

// Run the petition overview count when the page loads
document.addEventListener("DOMContentLoaded", updatePetitionOverview);

// If you want to trigger the function from clicking a petition box, you could attach the `openPetitionDetails` function to each petition-box
const petitionBoxes = document.querySelectorAll('.petition-box');
petitionBoxes.forEach(petitionBox => {
  petitionBox.addEventListener('click', function () {
    openPetitionDetails(petitionBox);
  });
});
