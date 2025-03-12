document.addEventListener("DOMContentLoaded", function () {
    const contentData = JSON.parse(document.getElementById("section").dataset.content);
    
    document.getElementById("section").addEventListener("change", function () {
        document.getElementById("content").value = contentData[this.value] || "";
    });

    document.getElementById("section").dispatchEvent(new Event("change"));
});
