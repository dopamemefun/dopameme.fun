document.addEventListener('DOMContentLoaded', () => {
    const glitchElement = document.getElementById('glitchText');
    const originalText = glitchElement.textContent;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:",.<>/?~`'; // All possible glitch characters

    function getRandomChar() {
        return characters.charAt(Math.floor(Math.random() * characters.length));
    }

    function applyGlitchEffect() {
        let glitchedText = '';
        for (let i = 0; i < originalText.length; i++) {
            // Randomly decide if a character should glitch
            if (Math.random() < 0.3) { // 30% chance for a character to glitch
                glitchedText += getRandomChar();
            } else {
                glitchedText += originalText[i];
            }
        }
        glitchElement.textContent = glitchedText;

        // Revert to original text after a very short delay
        setTimeout(() => {
            glitchElement.textContent = originalText;
        }, 50); // Glitch lasts for 50 milliseconds
    }

    // Apply the glitch effect periodically
    setInterval(applyGlitchEffect, 1500); // Glitch every 1.5 seconds
});