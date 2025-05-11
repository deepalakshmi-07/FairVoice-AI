function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("collapsed");
}

const statusLog = [];

function handleStatusChange() {
  const status = document.getElementById("statusSelect").value;

  // Toggle visibility based on selected status
  document.getElementById("reportSection").classList.toggle("d-none", status !== "report");
  document.getElementById("escalateSection").classList.toggle("d-none", status !== "escalate");

  if (!status || status === "none") return;

  // Log status with current time
  const now = new Date();
  statusLog.push({ status, date: now.toLocaleString() });

  // Update timeline visually
  updateTimeline();
}

function updateTimeline() {
  const timelineList = document.getElementById("timelineList");
  timelineList.innerHTML = "";

  statusLog.forEach((entry) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${entry.status}</strong> - <small>${entry.date}</small>`;
    timelineList.appendChild(li);
  });
}

function submitReport() {
  const remark = document.getElementById("finalRemark").value;
  const file = document.getElementById("closureDocs").files[0];

  if (!remark || !file) {
    alert("Please add final remark and attach closure document.");
    return;
  }

  alert("Report submitted successfully!");
}

function downloadPDF() {
  alert("Downloading PDF...");
  // Integration with jsPDF or html2pdf.js would go here
}

window.onload = function () {
  // Deadline calculation
  const submittedDateEl = document.getElementById("submittedDate");
  const deadlineEl = document.getElementById("deadline");

  const submittedDateStr = submittedDateEl.textContent.trim();
  const submittedDate = new Date(submittedDateStr);

  if (!isNaN(submittedDate)) {
    const deadlineDate = new Date(submittedDate);
    deadlineDate.setDate(deadlineDate.getDate() + 21); // 3 weeks
    deadlineEl.textContent = deadlineDate.toISOString().split("T")[0];
  } else {
    deadlineEl.textContent = "Invalid date";
  }
};
document.getElementById("escalateForm").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Escalation submitted successfully!");
});


document.getElementById("escalateForm").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Escalation submitted successfully!");
  closeEscalateModal();
});
