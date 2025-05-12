document.addEventListener("DOMContentLoaded", function () {
  // Sidebar toggle
  window.toggleSidebar = function () {
    document.getElementById("sidebar").classList.toggle("collapsed");
  };

  // Set deadline (21 days after submission)
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

  // Set Google Map link
  const latitude = 10.867147;
  const longitude = 78.075749;
  const geoMapLink = document.getElementById("geoMapLink");
  if (geoMapLink) {
    geoMapLink.innerHTML = `<a href="https://www.google.com/maps?q=${latitude},${longitude}" target="_blank">View Location on Google Maps</a>`;
  }

  const statusLog = [];

  window.handleStatusChange = function () {
    const status = document.getElementById("statusSelect").value;
    if (!status || status === "none") return;

    const reportSection = document.getElementById("reportSection");
    const escalateSection = document.getElementById("escalateSection");

    if (reportSection) reportSection.classList.toggle("d-none", status !== "report");
    if (escalateSection) escalateSection.classList.toggle("d-none", status !== "escalate");

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

      const submitBtn = document.querySelector("#reportSection button.btn-success");
      submitBtn.parentNode.insertBefore(msg, submitBtn);
    }

    // Show the download button
    const downloadBtn = document.querySelector("#reportSection button.btn-outline-primary");
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
    dropdown.style.display = dropdown.style.display === "none" || dropdown.style.display === "" ? "block" : "none";
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
      behavior: "smooth"
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
