document.addEventListener('DOMContentLoaded', () => {
    // --- Glitch effect for the <h1> text (Dopameme) ---
    const glitchElement = document.getElementById('glitchText');
    const originalBodyText = glitchElement.textContent; // Store original body text
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:",.<>/?~`';

    function getRandomChar() {
        return characters.charAt(Math.floor(Math.random() * characters.length));
    }

    function applyBodyTextGlitchEffect() {
        let glitchedText = '';
        for (let i = 0; i < originalBodyText.length; i++) {
            if (Math.random() < 0.3) { // 30% chance for a character to glitch
                glitchedText += getRandomChar();
            } else {
                glitchedText += originalBodyText[i];
            }
        }
        glitchElement.textContent = glitchedText;

        // Revert to original text after a very short delay
        setTimeout(() => {
            glitchElement.textContent = originalBodyText;
        }, 50); // Glitch lasts for 50 milliseconds
    }

    setInterval(applyBodyTextGlitchEffect, 1500); // Glitch body text every 1.5 seconds


    // --- Glitch effect for the Browser Tab Title ---
    const originalTitle = document.title; // Store original title from <title> tag

    function applyTitleGlitchEffect() {
        let glitchedTitle = '';
        for (let i = 0; i < originalTitle.length; i++) {
            // Apply a more subtle glitch for the title, e.g., 15% chance
            if (Math.random() < 0.15) {
                glitchedTitle += getRandomChar();
            } else {
                glitchedTitle += originalTitle[i];
            }
        }
        document.title = glitchedTitle; // Set the tab title to the glitched version

        // Revert to original title after a very short delay
        setTimeout(() => {
            document.title = originalTitle;
        }, 80); // Glitch lasts for 80 milliseconds in the title
    }

    // Apply the glitch effect to the title periodically, maybe less often than the body text
    setInterval(applyTitleGlitchEffect, 3000); // Glitch title every 3 seconds (can adjust)
});
