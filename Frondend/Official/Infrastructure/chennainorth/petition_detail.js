function getParam(key) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key) || "Not Provided";
  }
  
  document.getElementById("name").textContent = getParam("name");
  document.getElementById("phone").textContent = getParam("phone");
  document.getElementById("location").textContent = getParam("location");
  document.getElementById("title").textContent = getParam("title");
  document.getElementById("detail").textContent = getParam("detail");
  
  // Optional images (placeholder fallback)
  document.getElementById("geoPhoto").src = getParam("geoPhoto") || "placeholder-geo.jpg";
  document.getElementById("relatedPhoto").src = getParam("relatedPhoto") || "placeholder-related.jpg";
  
  function handleAction(action) {
    alert("You clicked: " + action.charAt(0).toUpperCase() + action.slice(1));
  }
  