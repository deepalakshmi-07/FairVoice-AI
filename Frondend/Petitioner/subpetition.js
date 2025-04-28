// ------------------------------
// 0. Decode JWT and extract userId
// ------------------------------
function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    console.log("▶️ Decoded JWT payload:", decodedPayload);

    // use id instead of userId
    return decodedPayload.id || decodedPayload.userId;
  } catch (e) {
    console.error("Error decoding token:", e);
    return null;
  }
}

// ------------------------------
// 1. District → Taluk → Sub-District data & functions
// ------------------------------
const data = {
  Chennai: {
    "Chennai Central Division": [
      "Ambattur",
      "Aminjikarai",
      "Ayanavaram",
      "Egmore",
      "Kolathur",
      "Maduravoyal",
      "Mambalam",
    ],
    "Chennai North Division": [
      "Madhavaram",
      "Perambur",
      "Purasawalkam",
      "Tiruvottiyur",
      "Tondiarpet",
    ],
    "Chennai South Division": [
      "Alandur",
      "Guindy",
      "Mylapore",
      "Sholinganallur",
      "Velachery",
    ],
  },
  Kanchipuram: {
    "Kanchipuram Revenue Division": ["Kanchipuram", "Uthiramerur", "Walajabad"],
    "Sriperumbudur Revenue Division": ["Sriperumbudur", "Kundrathur"],
  },
};

function updateTaluks() {
  const district = document.getElementById("district").value;
  const talukSelect = document.getElementById("taluk");
  const subDistrictField = document.getElementById("subDistrict");
  talukSelect.innerHTML = `<option value="">Select Taluk</option>`;
  subDistrictField.value = "";
  if (district && data[district]) {
    const allTaluks = [];
    for (const subDiv in data[district]) {
      allTaluks.push(...data[district][subDiv]);
    }
    allTaluks.forEach((taluk) => {
      const o = document.createElement("option");
      o.value = taluk;
      o.textContent = taluk;
      talukSelect.appendChild(o);
    });
  }
}

function autoFillSubDistrict() {
  const district = document.getElementById("district").value;
  const selectedTaluk = document.getElementById("taluk").value;
  const subDistrictField = document.getElementById("subDistrict");
  subDistrictField.value = "";
  if (district && selectedTaluk && data[district]) {
    for (const subDiv in data[district]) {
      if (data[district][subDiv].includes(selectedTaluk)) {
        subDistrictField.value = subDiv;
        break;
      }
    }
  }
}

// ------------------------------
// 2. Petition detail word count
// ------------------------------
document
  .getElementById("petitionDetail")
  .addEventListener("input", function () {
    const words = this.value
      .trim()
      .split(/\s+/)
      .filter((w) => w.length);
    if (words.length > 100) this.value = words.slice(0, 100).join(" ");
    document.getElementById("wordCount").textContent =
      words.length + "/100 words";
  });

// ------------------------------
// 3. Form submission
// ------------------------------
// … your getUserIdFromToken(), data, updateTaluks(), autoFillSubDistrict(), word‑count code stays unchanged …

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("petitionForm");

  // Create or select the message box once, and insert it immediately below the form
  let msgBox = document.getElementById("resultMessage");
  if (!msgBox) {
    msgBox = document.createElement("div");
    msgBox.id = "resultMessage";
    msgBox.style.marginTop = "15px";
    msgBox.style.fontWeight = "bold";
    form.parentNode.insertBefore(msgBox, form.nextSibling);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1) FastAPI prediction
    const petitionTitle = document.getElementById("petitionTitle").value.trim();
    let aiStatus;
    try {
      const { data } = await axios.post("http://127.0.0.1:8000/predict", {
        text: petitionTitle,
      });
      aiStatus = data.status.toLowerCase();
      console.log("Prediction:", data);
    } catch (err) {
      console.error("Predict error:", err);
      return alert("Error validating petition title. Please try again.");
    }

    // clear previous message
    msgBox.innerText = "";

    if (aiStatus !== "approved") {
      // 🚀 use innerHTML so the <a> tag works
      msgBox.innerHTML = `
        ❌ Petition rejected. 
        Please go through the <a href="Howitwork.html" target="_blank" rel="noopener">
          instructions
        </a>.
      `;
      msgBox.style.color = "red";
      msgBox.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // 2) Collect form values
    const userId = getUserIdFromToken();
    if (!userId) {
      return alert("You must be logged in to submit a petition.");
    }

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("name", document.getElementById("fullName").value);
    formData.append(
      "phoneNumber",
      document.getElementById("phoneNumber").value
    );
    formData.append("district", document.getElementById("district").value);
    formData.append("taluk", document.getElementById("taluk").value);
    formData.append(
      "subDistrict",
      document.getElementById("subDistrict").value
    );
    formData.append(
      "petitionLocation",
      document.getElementById("petitionLocation").value
    );
    formData.append("petitionTitle", petitionTitle);
    formData.append(
      "petitionDescription",
      document.getElementById("petitionDetail").value
    );

    // Append files
    const photoInput = document.getElementById("photo");
    if (photoInput.files[0]) formData.append("photo", photoInput.files[0]);
    const docs = document.getElementById("attachments").files;
    for (let i = 0; i < docs.length; i++) {
      formData.append("attachments", docs[i]);
    }

    // 3) Submit to Node.js
    try {
      const resp = await axios.post(
        "http://localhost:3000/api/petitions/submit",
        formData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Submit response:", resp.data);

      // Show backend message if present, otherwise default
      const successMsg =
        resp.data.message || "Petition submitted successfully!";
      msgBox.innerText = `✅ ${successMsg}`;
      msgBox.style.color = "green";
      msgBox.scrollIntoView({ behavior: "smooth", block: "center" });

      form.reset();
      document.getElementById("wordCount").innerText = "0/100 words";
    } catch (err) {
      // 🚀 UPDATED: Log the full error to console and show a simple alert
      console.error("Submit error:", err);
      alert("An error occurred while submitting the petition.");
    }
  });
});
