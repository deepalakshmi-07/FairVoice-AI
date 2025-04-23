document.addEventListener("DOMContentLoaded", function () {
  console.log("Login.js loaded.");

  const phoneInput = document.getElementById("phone");
  const sendOtpBtn = document.getElementById("send-otp");
  const otpSection = document.getElementById("otp-section");
  const loginForm = document.getElementById("login-form");

  // When the "Send OTP" button is clicked:
  sendOtpBtn.addEventListener("click", async function () {
    const phoneNumber = phoneInput.value.trim();
    if (!phoneNumber) {
      alert("Please enter your phone number.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          phoneNumber: phoneNumber,
        }
      );
      alert(response.data.message);
      phoneInput.disabled = true; // Disables the phone input
      sendOtpBtn.style.display = "none"; // Hides the send OTP button
      otpSection.style.display = "block"; // Reveals the OTP input section
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert(error.response?.data?.message || "Error sending OTP");
    }
  });

  // When the form is submitted (Verify OTP & Login)
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const phoneNumber = phoneInput.value.trim();
    const otp = document.getElementById("otp").value.trim();

    if (!otp) {
      alert("Please enter OTP.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/verify-otp",
        {
          phoneNumber: phoneNumber,
          otp: otp,
        }
      );
      alert(response.data.message);
      // Store token for later use, if needed
      localStorage.setItem("token", response.data.token);
      // Redirect to user home page (replace "UserHome.html" with your actual home page)
      window.location.href = "petitioner.html";
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert(error.response?.data?.message || "Error verifying OTP");
    }
  });
});
