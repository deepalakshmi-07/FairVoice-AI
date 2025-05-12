document.addEventListener("DOMContentLoaded", () => {
  console.log("Login JS Loaded");

  const districtSelect = document.getElementById("district");
  const levelSelect = document.getElementById("level");
  const loginButton = document.getElementById("submit");

  if (!districtSelect || !levelSelect || !loginButton) {
    console.error("One or more elements not found!");
    return;
  }

  districtSelect.addEventListener("change", function () {
    const selectedDistrict = this.value.toLowerCase(); // 👈 Case-insensitive match
    console.log("Selected District:", selectedDistrict);

    levelSelect.innerHTML =
      '<option value="" disabled selected>Select Level</option>';

    let levels = [];

    if (selectedDistrict === "chennai") {
      levels = [
        "North-Chennai",
        "South-Chennai",
        "Central-Chennai",
        "Chennai district",
      ];
    } else if (selectedDistrict === "kanchipuram") {
      levels = [
        "Sriperambadur Regional Taluk",
        "Kanchipuram Regional Taluk",
        "Kanchipuram district",
      ];
    } else if (selectedDistrict === "high-level") {
      levels = ["High-Level"];
    }

    levels.forEach((level) => {
      const option = document.createElement("option");
      option.value = level;
      option.textContent = level;
      levelSelect.appendChild(option);
    });
  });

  loginButton.addEventListener("click", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const level = document.getElementById("level").value;

    console.log("Username:", username);
    console.log("Password:", password);
    console.log("Level:", level);

    if (!username || !password || !level) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/app/authenticateOfficials/login",
        {
          username,
          password,
          level,
        }
      );

      alert("Login successful!");
      localStorage.setItem("authToken", response.data.token);
      window.location.href = "/home";
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  });
});
