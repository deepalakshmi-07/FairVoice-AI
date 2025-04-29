// update.js

// Helpers: phone formatting
function formatDisplayPhone(phone) {
  return phone ? phone.replace(/^\+91/, "") : "";
}
function formatStoragePhone(raw) {
  const digits = raw.replace(/\D/g, "");
  const last10 = digits.length > 10 ? digits.slice(-10) : digits;
  return "+91" + last10;
}

// 1. District → Pincode logic
const districtPincodeMap = { Chennai: "600", Kanchipuram: "631" };
const districtSelect = document.getElementById("district");
const pincodeInput = document.getElementById("pincode");
districtSelect.addEventListener("change", () => {
  pincodeInput.value = districtPincodeMap[districtSelect.value] || "";
});

// 2. Grab form elements
const fullNameInput = document.getElementById("fullName");
const phoneInput = document.getElementById("phoneNumber");
const emailInput = document.getElementById("email");
const addressInput = document.getElementById("address");
const aadharInput = document.getElementById("aadhar");
const genderSelect = document.getElementById("gender");
const editAllBtn = document.getElementById("editAllBtn");
const discardBtn = document.getElementById("discardChanges");
const profileForm = document.getElementById("profileForm");

function setDisabledState(disabled) {
  [
    fullNameInput,
    phoneInput,
    emailInput,
    addressInput,
    districtSelect,
    pincodeInput,
    aadharInput,
    genderSelect,
  ].forEach((el) => (el.disabled = disabled));
}

// 3. On load: GET & prefill
window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) return alert("Log in first");
  try {
    const { data } = await axios.get("http://localhost:3000/api/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const u = data.user;
    fullNameInput.value = u.name || "";
    phoneInput.value = formatDisplayPhone(u.phoneNumber);
    emailInput.value = u.email || "";
    addressInput.value = u.address || "";

    // district (case-insensitive match)
    if (u.district) {
      const wanted = u.district.toLowerCase();
      let opt = Array.from(districtSelect.options).find(
        (o) => o.value.toLowerCase() === wanted
      );
      if (!opt) {
        opt = document.createElement("option");
        opt.value = u.district;
        opt.text = u.district;
        districtSelect.appendChild(opt);
      }
      districtSelect.value = opt.value;
    }

    pincodeInput.value = u.pincode || "";
    aadharInput.value = "";
    aadharInput.placeholder = "XXXX-XXXX-XXXX";
    aadharInput.disabled = true;
    genderSelect.value = u.gender || "";

    setDisabledState(true);
  } catch {
    alert("Failed to load profile");
  }
});

// 4. Edit/Discard
editAllBtn.addEventListener("click", () => setDisabledState(false));
discardBtn.addEventListener("click", () => window.location.reload());

// 5. On Submit: PUT update (omit aadhaarNumber)
profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  if (!token) return alert("Not authenticated");

  const fullPhone = formatStoragePhone(phoneInput.value);
  const updated = {
    name: fullNameInput.value,
    phoneNumber: fullPhone,
    email: emailInput.value,
    address: addressInput.value,
    district: districtSelect.value,
    pincode: pincodeInput.value,
    gender: genderSelect.value,
  };

  try {
    await axios.put("http://localhost:3000/api/user/profile", updated, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Profile updated!");
    setDisabledState(true);
  } catch {
    alert("Error updating profile");
  }
});
