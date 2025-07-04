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
        const maxCycles = 5;

        bodyGlitchInterval = setInterval(() => {
            applyBodyTextReadableGlitch();
            cycleCount++;
            if (cycleCount >= maxCycles) {
                clearInterval(bodyGlitchInterval);
                glitchElement.textContent = originalBodyText;
                setTimeout(startBodyGlitchCycle, 3000);
            }
        }, 100);
    }

    // Initial start for on-page text
    startBodyGlitchCycle();


    // --- Glitch effect for the BROWSER TAB TITLE ---
    const originalTitle = document.title;

    let titleGlitchInterval;

    function applyTitleChaoticGlitch() {
        let glitchedTitle = '';
        for (let i = 0; i < originalTitle.length; i++) {
            if (Math.random() < 0.8) {
                glitchedTitle += getRandomChar();
            } else {
                glitchedTitle += originalTitle[i];
            }
        }
        document.title = glitchedTitle;
    }

    function startTitleGlitchCycle() {
        let cycleCount = 0;
        const maxCycles = 4;

        titleGlitchInterval = setInterval(() => {
            applyTitleChaoticGlitch();
            cycleCount++;
            if (cycleCount >= maxCycles) {
                clearInterval(titleGlitchInterval);
                document.title = originalTitle;
                setTimeout(startTitleGlitchCycle, 4000);
            }
        }, 150);
    }

    // Initial start for tab title
    startTitleGlitchCycle();

    // --- Tilt Effect Logic ---
    // UPDATED: Target the new .main-content-wrapper for tilt and bass effects
    const tiltBox = document.querySelector('.main-content-wrapper'); 
    const maxTilt = 10; // Maximum tilt in degrees

    document.addEventListener('mousemove', (e) => {
        const rect = tiltBox.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const mouseX = (e.clientX - centerX) / (rect.width / 2);
        const mouseY = (e.clientY - centerY) / (rect.height / 2);

        const rotateY = mouseX * maxTilt;
        const rotateX = -mouseY * maxTilt;

        // Apply mouse tilt (bass effect will be added as an additional transform)
        // Store current rotation values to combine with scale later in drawBassVisualization
        tiltBox.dataset.rotateX = rotateX;
        tiltBox.dataset.rotateY = rotateY;
        
        // This will be called frequently by mousemove, so we need to ensure it combines
        // with the scale from bass visualization without overwriting.
        // The drawBassVisualization function handles the combination.
        // For immediate feedback during mouse move, we can set a base transform here.
        // It's crucial that drawBassVisualization later processes and adds scale.
        // Simplified: The full transform will be handled in drawBassVisualization.
        // For now, let's ensure the initial transform is set up correctly.
        // We'll update the drawBassVisualization to properly combine stored rotations with scale.
        updateCombinedTransform();
    });

    document.addEventListener('mouseleave', () => {
        // Reset tilt on mouse leave
        tiltBox.dataset.rotateX = 0;
        tiltBox.dataset.rotateY = 0;
        updateCombinedTransform(); // Update transform to reset
    });


    // --- Audio Player and Bass Visualization Logic ---
    const musicTrack = document.getElementById('musicTrack');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progressBar = document.getElementById('progressBar');
    const progressBarFill = document.getElementById('progressBarFill');
    const currentTimeSpan = document.getElementById('currentTime');
    const totalTimeSpan = document.getElementById('totalTime');
    const playPauseIcon = playPauseBtn.querySelector('.material-icons'); // Get the icon element

    let audioContext;
    let analyser;
    let source;
    // Set a smaller bufferLength for more sensitive bass detection if needed
    // const bufferLength = 2048; // Default from previous step, keeping for consistency
    const dataArray = new Uint8Array(256); // analyser.fftSize / 2 for frequency data

    // Function to format time (e.g., 1:05 -> 01:05)
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    // Initialize Web Audio API on first user interaction
    function initAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            source = audioContext.createMediaElementSource(musicTrack);
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256; // Smaller FFT size for faster updates and more relevant bass data
            // dataArray should be half of fftSize
            // dataArray = new Uint8Array(analyser.frequencyBinCount); // This would be 128

            source.connect(analyser);
            analyser.connect(audioContext.destination);

            // Start the visualization loop
            drawBassVisualization();
        }
    }

    // Play/Pause Button Logic
    playPauseBtn.addEventListener('click', () => {
        initAudioContext(); // Initialize context on first click
        if (musicTrack.paused) {
            musicTrack.play();
            playPauseIcon.textContent = 'pause'; // Change icon to pause
        } else {
            musicTrack.pause();
            playPauseIcon.textContent = 'play_arrow'; // Change icon to play
        }
    });

    // Update Time and Progress Bar
    musicTrack.addEventListener('loadedmetadata', () => {
        totalTimeSpan.textContent = formatTime(musicTrack.duration);
        progressBar.max = musicTrack.duration; // Set max value of slider to total duration
    });

    musicTrack.addEventListener('timeupdate', () => {
        currentTimeSpan.textContent = formatTime(musicTrack.currentTime);
        const progressPercent = (musicTrack.currentTime / musicTrack.duration) * 100;
        progressBarFill.style.width = `${progressPercent}%`;
        progressBar.value = musicTrack.currentTime; // Update slider position
    });

    // Handle user seeking on the progress bar
    progressBar.addEventListener('input', () => {
        musicTrack.currentTime = progressBar.value;
    });
    
    // Reset play button icon if audio ends
    musicTrack.addEventListener('ended', () => {
        playPauseIcon.textContent = 'play_arrow';
    });


    // Global variables to store current rotation values from mousemove
    // These will be updated by mousemove and used by drawBassVisualization
    tiltBox.dataset.rotateX = 0; // Initialize custom data attributes
    tiltBox.dataset.rotateY = 0;

    function updateCombinedTransform() {
        const currentRotateX = parseFloat(tiltBox.dataset.rotateX) || 0;
        const currentRotateY = parseFloat(tiltBox.dataset.rotateY) || 0;
        
        let dynamicScale = parseFloat(tiltBox.dataset.scale) || 1.0; // Get scale from bass visualization

        tiltBox.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) scale(${dynamicScale})`;
    }


    // Bass Visualization Loop
    function drawBassVisualization() {
        requestAnimationFrame(drawBassVisualization); // Loop indefinitely

        if (!analyser || musicTrack.paused) {
            // If paused or analyser not ready, reset scale but keep current tilt
            tiltBox.dataset.scale = 1.0; // Reset scale to default
            updateCombinedTransform(); // Apply updated transform
            return;
        }

        analyser.getByteFrequencyData(dataArray); // Populate dataArray with frequency data

        // Calculate average bass (lower frequencies)
        // analyser.fftSize = 256 means frequencyBinCount = 128
        // Each bin represents approx. 44100 / 2 / 128 = ~172 Hz per bin if sampleRate is 44100
        // If fftSize is 256, frequencyBinCount is 128.
        // So indices 0-2 (0-344 Hz) could be a good bass range
        // Or 0-5 for a wider low-end.
        let bassSum = 0;
        // The first few bins represent the lowest frequencies
        const bassBandCount = 5; // Consider first 5 bins for bass
        
        for (let i = 0; i < bassBandCount; i++) {
            bassSum += dataArray[i];
        }
        let averageBass = bassSum / bassBandCount;

        // Map averageBass (0-255) to a scale factor (e.g., 1.0 to 1.05)
        const minScale = 1.0;
        const maxScale = 1.03; // Max scale for the "jump" effect (reduced for subtlety)
        const bassThreshold = 60; // Only react if bass is above this level (adjusted slightly)
        
        let dynamicScale = minScale;
        if (averageBass > bassThreshold) {
            dynamicScale = minScale + ((averageBass - bassThreshold) / (255 - bassThreshold)) * (maxScale - minScale);
        }
        dynamicScale = Math.min(maxScale, Math.max(minScale, dynamicScale)); // Clamp value

        // Store dynamic scale in a data attribute for updateCombinedTransform to use
        tiltBox.dataset.scale = dynamicScale;
        
        // Update the combined transform (tilt + scale)
        updateCombinedTransform();
    }
    
    // Initial call to set the combined transform for mouseleave and initial load
    updateCombinedTransform(); 
});
