document.addEventListener("DOMContentLoaded", function () {
    // Typing effect for header text
    function typeText(elementId, text, speed) {
        let i = 0;
        function type() {
            if (i < text.length) {
                document.getElementById(elementId).textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        document.getElementById(elementId).textContent = ""; // Clear previous text
        type();
    }
    typeText("typing-text", "Do I Know You?", 100);

    // Event listener for 'Join' tile
    document.getElementById("join-tile").addEventListener("click", function() {
        window.location.href = "register.html"; // Redirect to register page
    });

    // Event listener for 'Sign-in' tile
    document.getElementById("signin-tile").addEventListener("click", function () {
        window.location.href = "signin.html"; // Redirect to sign-in page
    });

    // Fetch and display news on click
    document.getElementById("news-tile").addEventListener("click", function () {
        fetchNews();
        document.getElementById("news-container").style.display = "block"; // Show marquee
    });

    async function fetchNews() {
        try {
            const response = await fetch("textfiles/news.txt");
            if (!response.ok) throw new Error("Failed to load news");
            const text = await response.text();

            // Convert text file into separate lines
            const newsItems = text.split("\n").map(item => `<p>${item}</p>`).join("");

            // Add to marquee
            document.getElementById("news-marquee").innerHTML = newsItems;
        } catch (error) {
            console.error("Error fetching news:", error);
            document.getElementById("news-marquee").innerHTML = "<p>Failed to load news.</p>";
        }
    }

    // Load sound effects
    const hoverSound = new Audio("sounds/hover.mp3");
    const clickSound = new Audio("sounds/click.mp3");
    let audioUnlocked = false;

    // Unlock audio on first interaction
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

    document.addEventListener("click", unlockAudio, { once: true });
    document.addEventListener("keydown", unlockAudio, { once: true });

    // Functions to play sounds
    function playHoverSound() {
        if (audioUnlocked) {
            hoverSound.currentTime = 0;
            hoverSound.play();
        }
    }

    function playClickSound() {
        if (audioUnlocked) {
            clickSound.currentTime = 0;
            clickSound.play();
        }
    }

    // Add sound effects to all tiles
    const tiles = document.querySelectorAll(".tile, .sign-in-tile, .back-link");
    tiles.forEach(tile => {
        tile.addEventListener("mouseenter", playHoverSound);
        tile.addEventListener("click", playClickSound);
    });
});
