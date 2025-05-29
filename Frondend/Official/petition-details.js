/** Return the value of ?name=… from the URL or null */
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

document.addEventListener("DOMContentLoaded", async function () {
  // // Sidebar toggle
  // window.toggleSidebar = function () {
  //   document.getElementById("sidebar").classList.toggle("collapsed");
  // };

  // // Set deadline (21 days after submission)
  // const submittedDateEl = document.getElementById("submittedDate");
  // const deadlineEl = document.getElementById("deadline");
  // const submittedDateStr = submittedDateEl.textContent.trim();
  // const submittedDate = new Date(submittedDateStr);

  // if (!isNaN(submittedDate)) {
  //   const deadlineDate = new Date(submittedDate);
  //   deadlineDate.setDate(deadlineDate.getDate() + 21);
  //   deadlineEl.textContent = deadlineDate.toISOString().split("T")[0];
  // } else {
  //   deadlineEl.textContent = "Invalid date";
  // }

  // // Set Google Map link
  // const latitude = 10.867147;
  // const longitude = 78.075749;
  // const geoMapLink = document.getElementById("geoMapLink");
  // if (geoMapLink) {
  //   geoMapLink.innerHTML = `<a href="https://www.google.com/maps?q=${latitude},${longitude}" target="_blank">View Location on Google Maps</a>`;
  // }

  // — 1) Auth guard (redirect if no JWT) —
  const token = localStorage.getItem("token");
  if (!token) {
    return window.location.replace("/Frondent/Petitioner/Main_home.html");
  }

  // — 2) Grab the petition ID from URL —
  const petitionId = getQueryParam("id");
  if (!petitionId) {
    return alert("No petition ID provided.");
  }

  try {
    // — 3) Fetch petition data from backend —
    const res = await axios.get(
      `http://localhost:3000/api/petitions/${petitionId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const p = res.data;

    // — 4) Populate all fields in your HTML —
    document.getElementById("name").textContent = p.name;
    document.getElementById("phone").textContent = p.phoneNumber;
    document.getElementById("District").textContent = p.district;
    document.getElementById("Taluk").textContent = p.taluk;
    document.getElementById("SubDistrict").textContent = p.subDistrict;

    // AI suggestion cards (they’re the three <h6> in order)
    const cards = document.querySelectorAll(".card.text-center h6");
    cards[0].textContent = p.category;
    cards[1].textContent = p.urgency;
    cards[2].textContent = p.isRepetitive ? "Repetitive" : "Not Repetitive";

    document.getElementById("title").textContent = p.petitionTitle;
    document.getElementById("detail").textContent = p.petitionDescription;
    document.getElementById("grievance").textContent = p.grievanceId || "-";

    // Dates
    const submittedEl = document.getElementById("submittedDate");
    submittedEl.textContent = new Date(p.createdAt).toISOString().split("T")[0];
    document.getElementById("deadline").textContent = new Date(p.deadline)
      .toISOString()
      .split("T")[0];

    // —— Map preview ——
    // Only if lat+lng present
    const mapLinkEl = document.getElementById("geoMapLink");
    if (p.geolocation?.latitude && p.geolocation?.longitude) {
      mapLinkEl.innerHTML = `<a href="https://www.google.com/maps?q=${p.geolocation.latitude},${p.geolocation.longitude}" target="_blank">
       View Location on Google Maps
     </a>`;
    } else {
      mapLinkEl.parentElement.style.display = "none";
    }

    // —— Geolocation Photo ——
    if (p.photo) {
      const photoUrl = p.photo;
      const imgEl = document.getElementById("geoPhoto");
      imgEl.src = photoUrl;
      imgEl.alt = "Geolocation Photo";

      // wrap in a clickable <a>
      const link = document.createElement("a");
      link.href = photoUrl;
      link.target = "_blank";
      imgEl.parentNode.replaceChild(link, imgEl);
      link.appendChild(imgEl);
    } else {
      document.getElementById("geoPhoto").parentElement.style.display = "none";
    }

    // —— Attachments ——
    const docsContainer = document.getElementById("relatedPhoto").parentElement;
    docsContainer.innerHTML = "<strong>Docs:</strong> ";

    if (p.attachments && p.attachments.length) {
      p.attachments.forEach((url) => {
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.textContent = url.split("/").pop();
        a.classList.add("d-block", "mt-1");
        docsContainer.appendChild(a);
      });
    } else {
      docsContainer.style.display = "none";
    }
  } catch (err) {
    console.error("Error loading petition:", err);
    return alert("Failed to load petition details.");
  }

  // — 5) Sidebar toggle & logout (reuse your existing helpers) —
  window.toggleSidebar = () =>
    document.getElementById("sidebar").classList.toggle("collapsed");
  document.querySelector(".logout-btn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.replace("/Frondent/Petitioner/Main_home.html");
  });

  const statusLog = [];

  window.handleStatusChange = function () {
    const status = document.getElementById("statusSelect").value;
    if (!status || status === "none") return;

    const reportSection = document.getElementById("reportSection");
    const escalateSection = document.getElementById("escalateSection");

    if (reportSection)
      reportSection.classList.toggle("d-none", status !== "report");
    if (escalateSection)
      escalateSection.classList.toggle("d-none", status !== "escalate");

    const now = new Date();
    statusLog.push({ status, date: now.toLocaleString() });
    updateTimeline();
  };

  function updateTimeline() {
    const timelineList = document.getElementById("timelineList");
    timelineList.innerHTML = "";
    statusLog.forEach((entry) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${entry.status}</strong> - <small>${entry.date}</small>`;
      timelineList.appendChild(li);
    });
  }

  // Submit report and show success message + show Download button
  window.submitReport = function () {
    const remark = document.getElementById("finalRemark").value.trim();
    const file = document.getElementById("closureDocs").files[0];

    if (!remark || !file) {
      alert("Please add final remark and attach closure document.");
      return;
    }

    // Show success message if not already shown
    if (!document.getElementById("successMsg")) {
      const msg = document.createElement("span");
      msg.id = "successMsg";
      msg.className = "text-success fw-semibold me-3";
      msg.textContent = "✔ Report submitted successfully!";

      const submitBtn = document.querySelector(
        "#reportSection button.btn-success"
      );
      submitBtn.parentNode.insertBefore(msg, submitBtn);
    }

    // Show the download button
    const downloadBtn = document.querySelector(
      "#reportSection button.btn-outline-primary"
    );
    if (downloadBtn) {
      downloadBtn.classList.remove("d-none");
    }
  };

  // When "Download PDF" is clicked, just go to view-report.html
  window.downloadPDF = function () {
    window.location.href = "viewreport.html";
  };

  // Approve/reject handlers
  window.handleApprove = function () {
    alert("Petition Approved!");
  };

  window.handleReject = function () {
    alert("Petition Rejected!");
  };

  // Show forward department dropdown
  window.toggleForward = function () {
    const dropdown = document.getElementById("forwardDropdown");
    dropdown.style.display =
      dropdown.style.display === "none" || dropdown.style.display === ""
        ? "block"
        : "none";
  };

  // Show report section and scroll to it
  window.activateReport = function () {
    const reportSection = document.getElementById("reportSection");
    reportSection.classList.remove("d-none");
    document.getElementById("escalateSection")?.classList.add("d-none");

    const now = new Date();
    statusLog.push({ status: "Report Initiated", date: now.toLocaleString() });
    updateTimeline();

    window.scrollTo({
      top: reportSection.offsetTop - 60,
      behavior: "smooth",
    });
  };

  // Escalate form submission
  const escalateForm = document.getElementById("escalateForm");
  if (escalateForm) {
    escalateForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Escalation submitted successfully!");
    });
  }
});
