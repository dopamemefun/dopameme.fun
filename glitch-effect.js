document.addEventListener('DOMContentLoaded', () => {
    // --- Shared Glitch Logic ---
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:",.<>/?~`';

    function getRandomChar() {
        return characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // --- Glitch effect for the <h1> text (Dopameme) ---
    const glitchElement = document.getElementById('glitchText');
    const originalBodyText = glitchElement.textContent; // Store original body text

    let bodyGlitchInterval; // To store the interval ID
    let bodyIsGlitched = false;

    function applyBodyTextSubtleGlitch() {
        let glitchedText = '';
        for (let i = 0; i < originalBodyText.length; i++) {
            // Lower chance to glitch characters for readability
            if (Math.random() < 0.2) { // Now 20% chance per character to glitch
                glitchedText += getRandomChar();
            } else {
                glitchedText += originalBodyText[i];
            }
        }
        glitchElement.textContent = glitchedText;
    }

    function startBodyGlitchCycle() {
        // Apply a quick series of subtle glitches
        let cycleCount = 0;
        const maxCycles = 5; // How many quick glitches before pausing

        bodyGlitchInterval = setInterval(() => {
            applyBodyTextSubtleGlitch();
            cycleCount++;
            if (cycleCount >= maxCycles) {
                clearInterval(bodyGlitchInterval); // Stop quick glitches
                glitchElement.textContent = originalBodyText; // Revert to original
                bodyIsGlitched = false;
                // Wait before starting the next cycle
                setTimeout(startBodyGlitchCycle, 2000); // Wait 2 seconds before next burst
            }
        }, 80); // Quick glitches happen every 80ms
        bodyIsGlitched = true; // Mark as glitched
    }

    // Initial start
    startBodyGlitchCycle();


    // --- Glitch effect for the Browser Tab Title ---
    const originalTitle = document.title; // Store original title from <title> tag

    let titleGlitchInterval; // To store the interval ID
    let titleIsGlitched = false;

    function applyTitleSubtleGlitch() {
        let glitchedTitle = '';
        for (let i = 0; i < originalTitle.length; i++) {
            // Even lower chance to glitch characters for the title for better readability
            if (Math.random() < 0.1) { // 10% chance per character to glitch
                glitchedTitle += getRandomChar();
            } else {
                glitchedTitle += originalTitle[i];
            }
        }
        document.title = glitchedTitle; // Set the tab title to the glitched version
    }

    function startTitleGlitchCycle() {
        // Apply a quick series of subtle glitches for the title
        let cycleCount = 0;
        const maxCycles = 3; // Fewer cycles for title

        titleGlitchInterval = setInterval(() => {
            applyTitleSubtleGlitch();
            cycleCount++;
            if (cycleCount >= maxCycles) {
                clearInterval(titleGlitchInterval); // Stop quick glitches
                document.title = originalTitle; // Revert to original
                titleIsGlitched = false;
                // Wait before starting the next cycle
                setTimeout(startTitleGlitchCycle, 3500); // Wait 3.5 seconds before next burst
            }
        }, 120); // Quick glitches happen every 120ms
        titleIsGlitched = true; // Mark as glitched
    }

    // Initial start
    startTitleGlitchCycle();

});
