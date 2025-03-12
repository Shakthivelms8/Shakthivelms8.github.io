document.addEventListener("DOMContentLoaded", function () {
    let verificationCode; // Stores the generated verification code
    let countdown; // Holds the countdown timer reference
    let codeValid = false; // Flag to check if the code is valid
    let timeLeft = 20; // Timer duration in seconds

    // Get form and verification section elements
    const registerForm = document.getElementById("register-form");
    const verifySection = document.getElementById("verify-section");
    const verifyButton = document.getElementById("verify-button");
    const verificationCodeInput = document.getElementById("verification-code");

    // Initialize EmailJS
    emailjs.init("zBRbT5XIlTvBaeBLA"); // Replace with your EmailJS Public Key

    // Event listener for form submission
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevents default form submission behavior
        verifySection.style.display = "block"; // Show verification section
        generateVerificationCode(); // Generate a new verification code
        startTimer(); // Start countdown timer
    });

    // Function to generate a random 4-digit verification code and send via EmailJS
    function generateVerificationCode() {
        verificationCode = Math.floor(1000 + Math.random() * 9000); // Generate random 4-digit number
        codeValid = true; // Set code as valid
        
        const userEmail = document.getElementById("email").value;
        
        // Send the verification code via EmailJS
        emailjs.send("service_uc9p2n6", "template_atkh446", {
            verification_code: verificationCode,
            user_email: userEmail
        }).then(
            function(response) {
                console.log("Email sent successfully", response);
            },
            function(error) {
                console.log("Failed to send email", error);
            }
        );
    }

    // Function to start the countdown timer
    function startTimer() {
        let timerElement = document.getElementById("verification-timer");
        if (!timerElement) {
            timerElement = document.createElement("p");
            timerElement.id = "verification-timer";
            verifySection.appendChild(timerElement);
        }

        let resendButton = document.getElementById("resend-button");
        if (!resendButton) {
            resendButton = document.createElement("button");
            resendButton.id = "resend-button";
            resendButton.textContent = "Resend Code";
            resendButton.style.display = "none";
            verifySection.appendChild(resendButton);
        }

        timeLeft = 20; // Reset timer to 10 seconds
        timerElement.textContent = `Time remaining: ${timeLeft} seconds`;

        countdown = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `Time remaining: ${timeLeft} seconds`;
            
            if (timeLeft <= 0) {
                clearInterval(countdown); // Stop countdown when time reaches 0
                timerElement.textContent = "Time expired. Request a new code.";
                resendButton.style.display = "block"; // Show resend button
                codeValid = false; // Invalidate the expired code
            }
        }, 1000);

        // Event listener for resend button
        resendButton.addEventListener("click", function () {
            resendButton.style.display = "none"; // Hide resend button after clicking
            generateVerificationCode(); // Generate a new code
            startTimer(); // Restart the timer
        });
    }

    // Event listener for verifying the entered code
    verifyButton.addEventListener("click", function () {
        const userCode = verificationCodeInput.value;
        let errorElement = document.getElementById("error-message");
        let successMessage = document.getElementById("success-message");
        
        // Create error message element if not already present
        if (!errorElement) {
            errorElement = document.createElement("p");
            errorElement.id = "error-message";
            errorElement.style.color = "red";
            verifySection.appendChild(errorElement);
        }
        
        // Create success message element if not already present
        if (!successMessage) {
            successMessage = document.createElement("p");
            successMessage.id = "success-message";
            successMessage.style.color = "green";
            verifySection.appendChild(successMessage);
        }
        
        // Check if entered code matches the generated code
        if (userCode == verificationCode && codeValid) {
            document.getElementById("account-section").style.display = "block"; // Show account creation section
            errorElement.textContent = ""; // Clear error message
            successMessage.textContent = "Successfully verified"; // Show success message
            
            clearInterval(countdown); // Stop countdown timer
            document.getElementById("verification-timer").style.display = "none"; // Hide timer
        } else if (!codeValid) {
            errorElement.textContent = "Code expired. Request a new code."; // Display expiration message
            successMessage.textContent = "";
        } else {
            errorElement.textContent = "Incorrect code"; // Display incorrect code message
            successMessage.textContent = "";
        }
    });
});
