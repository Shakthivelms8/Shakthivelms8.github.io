// Typing effect function
function typeText(elementId, text, speed) {
    let i = 0;
    document.getElementById(elementId).textContent = '';
    function type() {
        if (i < text.length) {
            document.getElementById(elementId).textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Redirect to community page
function redirectToCommunity() {
    window.location.href = "community.html";
}

// Load content from external files
async function loadContent(elementId, fileName, useTypingEffect = true) {
    try {
        const response = await fetch(fileName);
        if (!response.ok) throw new Error("Failed to load file");
        const text = await response.text();
        
        if (useTypingEffect) {
            typeText(elementId, text, 50);
        } else {
            document.getElementById(elementId).textContent = text;
        }
        
        if (elementId === "email-link") {
            document.getElementById("email-link").textContent = text;
            document.getElementById("email-link").href = `https://mail.google.com/mail/?view=cm&fs=1&to=${text}`;
            document.getElementById("email-link").setAttribute("target", "_blank");
        }
        
        if (elementId === "address-link") {
            document.getElementById("address-link").textContent = text;
            document.getElementById("address-link").href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text)}`;
            document.getElementById("address-link").setAttribute("target", "_blank");
        }
    } catch (error) {
        console.error("Error loading content:", error);
        document.getElementById(elementId).textContent = "Content unavailable.";
    }
}

// Search function to filter content
function searchContent() {
    let input = document.getElementById("search-bar").value.toLowerCase();
    let sections = document.querySelectorAll(".sections");
    
    sections.forEach(section => {
        let text = section.textContent.toLowerCase();
        section.style.display = text.includes(input) ? "block" : "none";
    });
}

// Load content on page load
document.addEventListener("DOMContentLoaded", function() {
    loadContent("summary-text", "textfiles/summary.txt");
    loadContent("upcoming-text", "textfiles/upcoming.txt", false);
    loadContent("address-link", "textfiles/address.txt", false);
    loadContent("email-link", "textfiles/email.txt", false);
});

// Ensure page scrolls to top on load
window.addEventListener("DOMContentLoaded", function () {
    history.replaceState(null, null, window.location.pathname);
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 10);
});

// Fetch news from RSS feed
async function fetchNews() {
    const rssUrl = "https://feeds.bbci.co.uk/news/rss.xml";
    try {
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
        const data = await response.json();
        
        let newsHtml = data.items.slice(0, 20).map(item => 
            `<p><a href="${item.link}" target="_blank">${item.title}</a></p>`
        ).join('');

        document.querySelector(".sidebar-content").innerHTML = newsHtml;
    } catch (error) {
        document.querySelector(".sidebar-content").innerHTML = "<p>Failed to load news.</p>";
        console.error("Error fetching news:", error);
    }
}
document.addEventListener("DOMContentLoaded", fetchNews);

// Audio effects
function setupAudioEffects() {
    const hoverSound = new Audio("sounds/hover.mp3");
    const clickSound = new Audio("sounds/click.mp3");
    let audioUnlocked = false;

    function unlockAudio() {
        if (!audioUnlocked) {
            hoverSound.play().then(() => {
                hoverSound.pause();
                hoverSound.currentTime = 0;
                clickSound.play().then(() => {
                    clickSound.pause();
                    clickSound.currentTime = 0;
                    audioUnlocked = true;
                });
            }).catch(error => console.error("Audio unlock failed:", error));
        }
    }
    
    // Unlock audio on first user interaction
    document.addEventListener("click", unlockAudio, { once: true });
    document.addEventListener("keydown", unlockAudio, { once: true });
    
    // Apply sound effects to clickable elements
    const clickableElements = document.querySelectorAll("a, button, [role='button'], .clickable, .profile-pic");
    
    clickableElements.forEach(item => {
        item.addEventListener("mouseenter", () => {
            if (audioUnlocked) {
                hoverSound.currentTime = 0;
                hoverSound.play();
            }
        });
    });
    
    clickableElements.forEach(item => {
        item.addEventListener("click", () => {
            if (audioUnlocked) {
                clickSound.currentTime = 0;
                clickSound.play();
            }
        });
    });
}
document.addEventListener("DOMContentLoaded", setupAudioEffects);
