document.addEventListener("DOMContentLoaded", function () {
    generateCaptcha(); // Generate CAPTCHA when page loads
});

document.getElementById("registerForm").addEventListener("submit", function (event) {
    let aadharInput = document.getElementById("aadharNo");
    let aadharError = document.getElementById("aadharError");
    let captchaInput = document.getElementById("captchaInput");
    let captchaText = document.getElementById("captchaText").textContent;
    let captchaError = document.getElementById("captchaError");

    // Aadhar Validation (12 digits)
    let aadharPattern = /^\d{12}$/;
    if (!aadharPattern.test(aadharInput.value)) {
        event.preventDefault(); // Prevent form submission
        aadharError.textContent = "Aadhar number must be exactly 12 digits.";
    } else {
        aadharError.textContent = ""; // Clear error message if valid
    }

    // CAPTCHA Validation
    if (captchaInput.value.trim() !== captchaText.trim()) {
        event.preventDefault();
        captchaError.textContent = "Incorrect CAPTCHA. Try again.";
        generateCaptcha(); // Refresh CAPTCHA
    } else {
        captchaError.textContent = "";
    }
});

// Function to Generate CAPTCHA
function generateCaptcha() {
    let captcha = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 6; i++) {
        captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    document.getElementById("captchaText").textContent = captcha;
}
