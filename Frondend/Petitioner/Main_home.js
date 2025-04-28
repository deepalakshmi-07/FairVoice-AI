document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("registerBtn").addEventListener("click", function () {
    window.location.href = "Register.html";
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const officialLoginBtn = document.getElementById("officialLoginBtn");

  officialLoginBtn.addEventListener("click", function () {
    window.location.href = "offmail.html";
  });
});
