document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault();
    let email = document.getElementById("email").value;
    let otp = document.getElementById("otp").value;

    if (!email || !otp) {
        alert("Please fill out all fields");
    } else {
        alert("Login successful!");
    }
});
