document.addEventListener('DOMContentLoaded', () => {
    // --- Shared Glitch Logic ---
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:",.<>/?~`';

    function getRandomChar() {
        return characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // --- Glitch effect for the ON-PAGE <h1> text (Dopameme) ---
    const glitchElement = document.getElementById('glitchText');
    const originalBodyText = glitchElement.textContent; // Store original body text

    let bodyGlitchInterval;

    function applyBodyTextReadableGlitch() {
        let glitchedText = '';
        for (let i = 0; i < originalBodyText.length; i++) {
            // Keep a lower chance to glitch for readability (e.g., 20%)
            if (Math.random() < 0.2) {
                glitchedText += getRandomChar();
            } else {
                glitchedText += originalBodyText[i];
            }
        }
        glitchElement.textContent = glitchedText;
    }

    function startBodyGlitchCycle() {
        let cycleCount = 0;
        const maxCycles = 5; // Number of quick glitches in a burst

        bodyGlitchInterval = setInterval(() => {
            applyBodyTextReadableGlitch();
            cycleCount++;
            if (cycleCount >= maxCycles) {
                clearInterval(bodyGlitchInterval); // Stop quick glitches
                glitchElement.textContent = originalBodyText; // Revert to original
                // Wait longer before the next burst for a "slower" feel
                setTimeout(startBodyGlitchCycle, 3000); // Wait 3 seconds before next burst (adjust for slower/faster)
            }
        }, 100); // Quick glitches happen every 100ms within the burst
    }

    // Initial start for on-page text
    startBodyGlitchCycle();


    // --- Glitch effect for the BROWSER TAB TITLE ---
    const originalTitle = document.title; // Store original title from <title> tag

    let titleGlitchInterval;

    function applyTitleChaoticGlitch() {
        let glitchedTitle = '';
        for (let i = 0; i < originalTitle.length; i++) {
            // HIGH chance to glitch for a chaotic, illegible effect (e.g., 80%)
            if (Math.random() < 0.8) {
                glitchedTitle += getRandomChar();
            } else {
                glitchedTitle += originalTitle[i];
            }
        }
        document.title = glitchedTitle; // Set the tab title to the glitched version
    }

    function startTitleGlitchCycle() {
        let cycleCount = 0;
        const maxCycles = 4; // Number of quick, chaotic glitches in a burst

        titleGlitchInterval = setInterval(() => {
            applyTitleChaoticGlitch();
            cycleCount++;
            if (cycleCount >= maxCycles) {
                clearInterval(titleGlitchInterval); // Stop quick glitches
                document.title = originalTitle; // Revert to original (important for clarity between bursts)
                // Wait before starting the next cycle
                setTimeout(startTitleGlitchCycle, 4000); // Wait 4 seconds before next chaotic burst
            }
        }, 150); // Quick chaotic glitches happen every 150ms within the burst
    }

    // Initial start for tab title
    startTitleGlitchCycle();

    // --- NEW: Tilt Effect Logic ---
    const tiltBox = document.querySelector('.header-section');
    const maxTilt = 10; // Maximum tilt in degrees

    document.addEventListener('mousemove', (e) => {
        // Get the center of the tiltBox
        const rect = tiltBox.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate mouse position relative to the center of the box
        // Normalized to -1 to 1 range
        const mouseX = (e.clientX - centerX) / (rect.width / 2);
        const mouseY = (e.clientY - centerY) / (rect.height / 2);

        // Calculate tilt angles
        // Move cursor right, tilt right (rotateY positive)
        // Move cursor down, tilt down (rotateX negative)
        const rotateY = mouseX * maxTilt;
        const rotateX = -mouseY * maxTilt; // Invert Y-axis for natural tilt

        // Apply transform
        tiltBox.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    // Optional: Reset tilt when mouse leaves the document (or a specific area)
    document.addEventListener('mouseleave', () => {
        tiltBox.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
});
