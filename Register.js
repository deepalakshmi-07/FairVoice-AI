document.addEventListener("DOMContentLoaded", function () {
  console.log("Register.js loaded and DOM fully ready.");
  generateCaptcha(); // Generate CAPTCHA when page loads

  const form = document.getElementById("registerForm");
  if (!form) {
    console.error("Register form not found!");
    return;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form's default submission
    console.log("Submit button clicked! Form submission detected.");

    // Fetch values from inputs using IDs
    let name = document.getElementById("fullName")?.value.trim();
    let phoneNumber = document.getElementById("phoneNumber")?.value.trim();
    let email = document.getElementById("email")?.value.trim();
    let address = document.getElementById("address")?.value.trim();
    let district = document.getElementById("district")?.value.trim();
    let pincode = document.getElementById("pincode")?.value.trim();
    let gender = document.getElementById("gender")?.value;
    let aadhaarNumber = document.getElementById("aadharNo")?.value.trim();
    let captchaInput = document.getElementById("captchaInput")?.value.trim();
    let captchaText = document
      .getElementById("captchaText")
      ?.textContent.trim();

    // Debug log for collected values
    console.log("Form values collected:", {
      name,
      phoneNumber,
      email,
      address,
      district,
      pincode,
      gender,
      aadhaarNumber,
      captchaInput,
      captchaText,
    });

    // Check if all fields are filled
    if (
      !name ||
      !phoneNumber ||
      !email ||
      !address ||
      !district ||
      !pincode ||
      !aadhaarNumber ||
      !gender
    ) {
      alert("Please fill in all fields.");
      return;
    }

    // Aadhaar Validation (must be exactly 12 digits)
    let aadharPattern = /^\d{12}$/;
    if (!aadharPattern.test(aadhaarNumber)) {
      document.getElementById("aadharError").textContent =
        "Aadhar number must be exactly 12 digits.";
      return;
    } else {
      document.getElementById("aadharError").textContent = "";
    }

    // CAPTCHA Validation: Refresh CAPTCHA only if incorrect
    if (captchaInput !== captchaText) {
      document.getElementById("captchaError").textContent =
        "Incorrect CAPTCHA. Try again.";
      generateCaptcha(); // Refresh CAPTCHA only on error
      return;
    } else {
      document.getElementById("captchaError").textContent = "";
    }

    console.log("Sending request to backend...");

    // Send Data to Backend API using Axios
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          name,
          phoneNumber,
          email,
          gender,
          aadhaarNumber,
          address,
          district,
          pincode,
        }
      );

      console.log("Response received:", response);
      alert(response.data.message);

      // Redirect to login page if registration is successful (HTTP 201)
      if (response.status === 201) {
        window.location.href = "Userlogin.html";
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.message || "Registration failed!");
    }
  });
});

// Function to Generate CAPTCHA
function generateCaptcha() {
  let captcha = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    captcha += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  document.getElementById("captchaText").textContent = captcha;
  console.log("New CAPTCHA generated:", captcha);
}
