document.addEventListener("DOMContentLoaded", function () {
    const trackButton = document.getElementById("trackBtn");
    const grievanceInput = document.getElementById("grievanceId");
  
    trackButton.addEventListener("click", function () {
      let grievanceId = grievanceInput.value.trim();
  
      if (grievanceId === "") {
        alert("Please enter a valid Grievance ID.");
        return;
      }
  
      let progressLevels = {
        1001: 1,
        1002: 2,
        1003: 3,
        1004: 4,
        1005: 5,
      };
  
      let currentStage = progressLevels[grievanceId] || 0;
      updateProgressBar(currentStage);
    });
  
    function updateProgressBar(stage) {
      let steps = document.querySelectorAll(".progress-container .step");
  
      steps.forEach((step, index) => {
        if (index < stage) {
          step.classList.add("active");
        } else {
          step.classList.remove("active");
        }
      });
    }
  });
  