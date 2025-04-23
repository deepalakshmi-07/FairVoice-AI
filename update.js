document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', function () {
      const input = this.previousElementSibling;
      input.disabled = !input.disabled;
      if (!input.disabled) {
        input.focus();
      }
    });
  });
  const districtPincodeMap = {
    "Ariyalur": "621",
    "Chengalpattu": "603",
    "Chennai": "600",
    "Coimbatore": "641",
    "Cuddalore": "607",
    "Dharmapuri": "636",
    "Dindigul": "624",
    "Erode": "638",
    "Kallakurichi": "606",
    "Kancheepuram": "631",
    "Karur": "639",
    "Krishnagiri": "635",
    "Madurai": "625",
    "Nagapattinam": "611",
    "Namakkal": "637",
    "Nilgiris": "643",
    "Perambalur": "621",
    "Pudukkottai": "622",
    "Ramanathapuram": "623",
    "Ranipet": "632",
    "Salem": "636",
    "Sivaganga": "630",
    "Tenkasi": "627",
    "Thanjavur": "613",
    "Theni": "625",
    "Thoothukudi": "628",
    "Tiruchirappalli": "620",
    "Tirunelveli": "627",
    "Tirupathur": "635",
    "Tiruppur": "641",
    "Tiruvallur": "602",
    "Tiruvannamalai": "606",
    "Tiruvarur": "610",
    "Vellore": "632",
    "Viluppuram": "605",
    "Virudhunagar": "626"
  };
  document.getElementById("district").addEventListener("change", function() {
    const selectedDistrict = this.value;
    const prefix = districtPincodeMap[selectedDistrict] || "";
    document.getElementById("pincode").value = prefix;
  });
    
  ['fullName', 'phoneNumber', 'email', 'address', 'district', 'pincode'].forEach(id => {
    const input = document.getElementById(id);
    initialData[id] = input.value;
  });
  
  const initialData = {};
  
  window.addEventListener('DOMContentLoaded', () => {
    const fields = ['fullName', 'phoneNumber', 'email', 'address', 'district', 'pincode'];
    fields.forEach(id => {
      const input = document.getElementById(id);
      initialData[id] = input.value;
    });
  });
  
  document.getElementById('discardChanges').addEventListener('click', () => {
    for (const key in initialData) {
      document.getElementById(key).value = initialData[key];
      document.getElementById(key).disabled = true;
    }
  });
  
  document.getElementById('profileForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const updatedData = {};
    ['fullName', 'phoneNumber', 'email', 'address', 'district', 'pincode'].forEach(id => {
      updatedData[id] = document.getElementById(id).value;
    });
  
    console.log("Updated User Profile:", updatedData);
  
    // Example: Sending data to backend
    // axios.post('/api/update-profile', updatedData)
    //   .then(response => alert("Profile updated successfully"))
    //   .catch(error => console.error(error));
  });
  