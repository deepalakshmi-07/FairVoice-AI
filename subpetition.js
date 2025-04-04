document.getElementById("petitionDetail").addEventListener("input", function () {
    let words = this.value.trim().split(/\s+/);
    let wordCount = words.filter(word => word.length > 0).length;
    
    if (wordCount > 100) {
        this.value = words.slice(0, 100).join(" "); // Limit to 100 words
    }
    
    document.getElementById("wordCount").textContent = wordCount + "/100 words";
});
