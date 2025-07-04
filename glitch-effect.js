document.addEventListener('DOMContentLoaded', () => {
    // --- Shared Glitch Logic ---
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:",.<>/?~`';

    function getRandomChar() {
        return characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // --- Glitch effect for the <h1> text (Dopameme) ---
    const glitchElement = document.getElementById('glitchText');
    const originalBodyText = glitchElement.textContent; // Store original body text

    function applyBodyTextContinuousGlitch() {
        let glitchedText = '';
        for (let i = 0; i < originalBodyText.length; i++) {
            // High chance to glitch, making it constantly dynamic
            if (Math.random() < 0.6) { // 60% chance for a character to glitch
                glitchedText += getRandomChar();
            } else {
                glitchedText += originalBodyText[i];
            }
        }
        glitchElement.textContent = glitchedText;

        // Immediately set a short timeout to either restore partially or re-glitch
        // For a more continuous effect, we want it to constantly change,
        // so we'll re-glitch very quickly or restore original after a short pause.
        // Let's make it flicker and then settle briefly before the next full re-glitch cycle.
        setTimeout(() => {
            // A small chance to fully revert to original, or keep a partial glitch
            if (Math.random() < 0.2) { // 20% chance to revert to original
                glitchElement.textContent = originalBodyText;
            }
        }, 100); // After 100ms, consider reverting or moving to next phase
    }

    // Trigger the main body text glitch cycle very frequently
    setInterval(applyBodyTextContinuousGlitch, 150); // Glitch body text every 150 milliseconds (much faster)


    // --- Glitch effect for the Browser Tab Title ---
    const originalTitle = document.title; // Store original title from <title> tag

    function applyTitleContinuousGlitch() {
        let glitchedTitle = '';
        for (let i = 0; i < originalTitle.length; i++) {
            // Apply a moderate chance to glitch characters for the title
            if (Math.random() < 0.3) { // 30% chance for a character to glitch
                glitchedTitle += getRandomChar();
            } else {
                glitchedTitle += originalTitle[i];
            }
        }
        document.title = glitchedTitle; // Set the tab title to the glitched version

        // Short timeout for the title as well, possibly reverting quickly
        setTimeout(() => {
             if (Math.random() < 0.4) { // 40% chance to revert to original
                document.title = originalTitle;
            }
        }, 150); // Glitch lasts for 150 milliseconds in the title
    }

    // Trigger the title glitch cycle more frequently than before
    setInterval(applyTitleContinuousGlitch, 500); // Glitch title every 500 milliseconds (0.5 seconds)
});
