document.addEventListener("DOMContentLoaded", function () {
  // Toggle sidebar
  window.toggleSidebar = function () {
    document.getElementById("sidebar").classList.toggle("collapsed");
  };

  // Deadline calculation
  const submittedDateEl = document.getElementById("submittedDate");
  const deadlineEl = document.getElementById("deadline");
  const submittedDateStr = submittedDateEl.textContent.trim();
  const submittedDate = new Date(submittedDateStr);

  if (!isNaN(submittedDate)) {
    const deadlineDate = new Date(submittedDate);
    deadlineDate.setDate(deadlineDate.getDate() + 21);
    deadlineEl.textContent = deadlineDate.toISOString().split("T")[0];
  } else {
    deadlineEl.textContent = "Invalid date";
  }

  // Set Google Maps link near Geolocation Photo
  const latitude = 10.867147;
  const longitude = 78.075749;
  const geoMapLink = document.getElementById("geoMapLink");
  if (geoMapLink) {
    geoMapLink.innerHTML = `<a href="https://www.google.com/maps?q=${latitude},${longitude}" target="_blank">View Location on Google Maps</a>`;
  }

  // Status Log
  const statusLog = [];

  window.handleStatusChange = function () {
    const status = document.getElementById("statusSelect").value;

    // Show/hide sections
    document.getElementById("reportSection").classList.toggle("d-none", status !== "report");
    document.getElementById("escalateSection").classList.toggle("d-none", status !== "escalate");

    if (!status || status === "none") return;

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

  window.submitReport = function () {
    const remark = document.getElementById("finalRemark").value;
    const file = document.getElementById("closureDocs").files[0];

    if (!remark || !file) {
      alert("Please add final remark and attach closure document.");
      return;
    }

    alert("Report submitted successfully!");
  };

  window.downloadPDF = function () {
    alert("Downloading PDF...");
    // Integration with jsPDF or html2pdf.js would go here
  };

  window.handleApprove = function () {
    alert("Petition Approved!");
  };

  window.handleReject = function () {
    alert("Petition Rejected!");
  };

  window.toggleForward = function () {
    const dropdown = document.getElementById("forwardDropdown");
    dropdown.style.display = dropdown.style.display === "none" || dropdown.style.display === "" ? "block" : "none";
  };

  window.activateReport = function () {
    document.getElementById("reportSection").classList.remove("d-none");
    document.getElementById("escalateSection").classList.add("d-none");

    const now = new Date();
    statusLog.push({ status: "report", date: now.toLocaleString() });
    updateTimeline();

    window.scrollTo({ top: document.getElementById("reportSection").offsetTop - 60, behavior: "smooth" });
  };

  const escalateForm = document.getElementById("escalateForm");
  if (escalateForm) {
    escalateForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Escalation submitted successfully!");
    });
  }
});
