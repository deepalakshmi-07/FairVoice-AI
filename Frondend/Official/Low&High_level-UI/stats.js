// Example values — update from backend or local storage dynamically
const total = 120;
const resolved = 85;
const pending = 35;

document.getElementById("totalCount").textContent = total;
document.getElementById("resolvedCount").textContent = resolved;
document.getElementById("pendingCount").textContent = pending;

// Bar Chart using Chart.js
const ctx = document.getElementById('statusBarChart').getContext('2d');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Resolved', 'Pending'],
    datasets: [{
      label: 'Petition Status',
      data: [resolved, pending],
      backgroundColor: ['#6c4df4', '#f7c948'],
      borderRadius: 10,
      borderSkipped: false
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.parsed.y;
            const label = context.label;
            const percent = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percent}%)`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10,
        },
        title: {
          display: true,
          text: 'Number of Petitions'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Status'
        }
      }
    }
  }
});
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("collapsed");
}
function logout() {
    // Redirect to the homepage without allowing the user to go back
    window.location.replace('Main_home.html'); // Replace with the path to your homepage
}