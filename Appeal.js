document.addEventListener("DOMContentLoaded", function () {
    // Word Count Limit for Textareas
    function setupWordCount(textareaId, wordLimit) {
      const textarea = document.getElementById(textareaId);
      const wordCountDisplay = textarea.nextElementSibling;
  
      textarea.addEventListener("input", function () {
        const words = this.value.split(/\s+/).filter((word) => word.length > 0);
        if (words.length > wordLimit) {
          this.value = words.slice(0, wordLimit).join(" ");
        }
        wordCountDisplay.textContent = `${words.length}/${wordLimit} words`;
      });
    }
  
    // File Upload Validation
    const fileInput = document.querySelector('input[type="file"]');
    fileInput.addEventListener("change", function () {
      const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
      const file = this.files[0];
  
      if (file) {
        const fileSize = file.size / 1024 / 1024; // Convert to MB
        const fileExtension = file.name.split(".").pop().toLowerCase();
  
        if (!allowedExtensions.includes(fileExtension)) {
          alert("Only image files (JPG, PNG, GIF) are allowed.");
          this.value = "";
        } else if (fileSize > 2) {
          alert("File size should not exceed 2MB.");
          this.value = "";
        }
      }
    });
  
    // Form Validation Before Submission
    const form = document.querySelector("form");
    form.addEventListener("submit", function (e) {
      const name = document
        .querySelector('input[placeholder="Enter your fullname"]')
        .value.trim();
      const phone = document
        .querySelector('input[placeholder="Enter your mobile number"]')
        .value.trim();
      const email = document
        .querySelector('input[placeholder="Enter your email"]')
        .value.trim();
      const grievanceId = document
        .querySelector('input[placeholder="Enter Grievance ID"]')
        .value.trim();
  
      if (!name || !phone || !email || !grievanceId) {
        alert("Please fill all required fields.");
        e.preventDefault();
      }
    });
  });
  