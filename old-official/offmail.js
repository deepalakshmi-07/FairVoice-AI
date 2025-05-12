document.getElementById("submit").addEventListener("click", function () {
    const emailInput = document.getElementById("mail").value;
    const errorMsg = document.getElementById("error-msg");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailPattern.test(emailInput)) {
      errorMsg.textContent = ""; // Clear error
      // Proceed with further actions (e.g., send OTP)
      console.log("Valid email:", emailInput);
    } else {
      errorMsg.textContent = "Please enter a valid email address.";
    }
  });