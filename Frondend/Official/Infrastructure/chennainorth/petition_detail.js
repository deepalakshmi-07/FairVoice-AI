// Example values (in real usage, you would get these from your petition data)
const latitude = 28.6139;    // Replace with actual value
const longitude = 77.2090;   // Replace with actual value

// Fill in details
document.getElementById('name').textContent = "John Doe";
document.getElementById('phone').textContent = "9876543210";
document.getElementById('location').textContent = "New Delhi";
document.getElementById('title').textContent = "Fix streetlight";
document.getElementById('detail').textContent = "The streetlight near my house is broken.";
document.getElementById('geoPhoto').src = "geolocation.jpg";
document.getElementById('relatedPhoto').src = "related.jpg";

// Add Google Maps link
if (latitude && longitude) {
  const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
  document.getElementById('geoMapLink').innerHTML = `
    <a href="${mapLink}" target="_blank" class="btn btn-outline-primary btn-sm">
      View on Google Maps
    </a>`;
}
