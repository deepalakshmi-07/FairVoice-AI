document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const districtSelect = document.getElementById("district");
  const levelSelect = document.getElementById("level");

  // Update Level dropdown based on District
  districtSelect.addEventListener("change", function () {
    const selectedDistrict = this.value;
    levelSelect.innerHTML =
      '<option value="" disabled selected>Select Level</option>';

    const levels =
      selectedDistrict === "Chennai"
        ? [
            "North-Chennai",
            "South-Chennai",
            "Central-Chennai",
            "Chennai district",
          ]
        : selectedDistrict === "Kanchipuram"
        ? [
            "Sriperambadur Regional Taluk",
            "Kanchipuram Regional Taluk",
            "Kanchipuram district",
          ]
        : selectedDistrict === "High-Level"
        ? ["High-Level"]
        : [];

    levels.forEach((level) => {
      const option = document.createElement("option");
      option.value = level;
      option.textContent = level;
      levelSelect.appendChild(option);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const department = document.getElementById("department").value;
    const district = document.getElementById("district").value;
    const level = document.getElementById("level").value;
    const username = document.getElementById("username").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value.trim();

    if (
      !department ||
      !district ||
      !level ||
      !username ||
      !phone ||
      !password
    ) {
      alert("Please fill out all fields.");
      return;
    }

    // Debug logs for troubleshooting
    console.log("Entered password:", password);
    console.log("Password length:", password.length);

    // Password validation (between 5-10 chars, must include upper, lower, number, special char)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{5,10}$/;

    if (passwordRegex.test(password)) {
      alert(
        "Password must be 5-10 characters and include at least one uppercase, one lowercase, one digit, and one special character."
      );
      return;
    }

    // Phone number validation (Indian format - 10 digits starting from 6 to 9)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      alert("Enter a valid 10-digit Indian phone number.");
      return;
    }

    const formData = { department, district, level, username, phone, password };

    axios
      .post("http://localhost:3000/api/officials/register", formData)
      .then((response) => {
        alert("Registration successful!");
        form.reset();
      })
      .catch((error) => {
        console.error("Registration error:", error);
        const errMsg =
          error.response?.data?.error ||
          "Registration failed. Please try again later.";
        alert(errMsg);
      });
  });
});

// document.addEventListener("DOMContentLoaded", () => {
//   const form = document.getElementById("registerForm");

//   form.addEventListener("submit", function (e) {
//     e.preventDefault();

//     // Get values
//     const department = document.getElementById("department").value;
//     const district = document.getElementById("district").value;
//     const username = document.getElementById("username").value.trim();
//     const phone = document.getElementById("phone").value.trim();
//     const password = document.getElementById("password").value.trim();

//     // Validate fields
//     if (!department || !district || !username || !phone || !password) {
//       alert("Please fill out all fields.");
//       return;
//     }

//     // Password validation
//     if (password.length < 6) {
//       alert("Password must be at least 6 characters long.");
//       return;
//     }

//     // Phone number validation (10 digits)
//     const phoneRegex = /^[6-9]\d{9}$/;
//     if (!phoneRegex.test(phone)) {
//       alert("Enter a valid 10-digit Indian phone number.");
//       return;
//     }

//     // Optional: Send data using Axios (backend API placeholder)
//     const formData = {
//       department,
//       district,
//       username,
//       phone,
//       password,
//     };

//     console.log("Submitting form data:", formData); // Debug

//     // Example Axios request (replace URL with your backend endpoint)
//     /*
//       axios.post("https://your-backend-api/register", formData)
//         .then(response => {
//           alert("Registration successful!");
//           form.reset();
//         })
//         .catch(error => {
//           console.error(error);
//           alert("Registration failed. Try again later.");
//         });
//       */

//     alert("Form submitted successfully! (Mock)");
//     form.reset(); // Reset form after mock submit
//   });
// });
