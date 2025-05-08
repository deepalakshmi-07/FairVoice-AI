document.getElementById("forwardForm").addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Petition forwarded successfully!");
  });
   function toggleSidebar() {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.toggle('hidden');
    }
    function logout() {
      // Add logout logic here
      alert("Logged out");
    }
  