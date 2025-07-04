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
    const tiltBox = document.querySelector('.header-section');
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
        tiltBox.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    document.addEventListener('mouseleave', () => {
        tiltBox.style.transform = 'rotateX(0deg) rotateY(0deg)'; // Reset tilt on mouse leave
    });


    // --- NEW: Audio Player and Bass Visualization Logic ---
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
    const bufferLength = 2048; // Number of data points for frequency analysis
    const dataArray = new Uint8Array(bufferLength); // Array to hold frequency data

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


    // Bass Visualization Loop
    function drawBassVisualization() {
        requestAnimationFrame(drawBassVisualization); // Loop indefinitely

        if (!analyser || musicTrack.paused) {
            // Reset box scale if music is paused or analyser not ready
            // We need to carefully manage the transform so it doesn't conflict with tilt
            // For simplicity, we'll reset any bass-induced scale here.
            // The tilt effect relies on the transform directly, so we can't just set it to 'none'.
            // The tilt effect's mousemove listener will continuously update transform,
            // so if we just set scale here, mousemove will overwrite.
            // A better way is to combine transforms. We will do that below.
            return;
        }

        analyser.getByteFrequencyData(dataArray); // Populate dataArray with frequency data

        // Calculate average bass (lower frequencies)
        // Adjust these indices based on your desired 'bass' range (e.g., 0-60 Hz)
        // analyser.fftSize = 256 means each bin is about 44100 / 2 / 256 = ~86 Hz
        // So, indices 0-3 (0-258 Hz) could be considered bass
        let bassSum = 0;
        const bassRangeEnd = Math.floor(analyser.fftSize * (60 / audioContext.sampleRate / 2)); // Up to approx 60Hz
        // Ensure bassRangeEnd is at least 1 and within bounds
        const actualBassEnd = Math.max(1, Math.min(dataArray.length, 5)); // Taking first 5 bins as a common bass range approximation

        for (let i = 0; i < actualBassEnd; i++) {
            bassSum += dataArray[i];
        }
        let averageBass = bassSum / actualBassEnd;

        // Map averageBass (0-255) to a scale factor (e.g., 1.0 to 1.05)
        const minScale = 1.0;
        const maxScale = 1.05; // Max scale for the "jump" effect
        // Normalizing bass to 0-1, then scaling to minScale-maxScale range
        // Add a threshold so small bass doesn't always trigger a pulse
        const bassThreshold = 50; // Only react if bass is above this level
        
        let dynamicScale = minScale;
        if (averageBass > bassThreshold) {
            dynamicScale = minScale + ((averageBass - bassThreshold) / (255 - bassThreshold)) * (maxScale - minScale);
        }
        dynamicScale = Math.min(maxScale, Math.max(minScale, dynamicScale)); // Clamp value

        // Apply combined transforms: mouse tilt + bass scale
        // We get the current transform from the element's style.
        // The tilt effect's mousemove listener already applies `rotateX(...) rotateY(...)`.
        // We need to parse that out and add `scale()`.
        // A more robust way is to store rotateX/Y in variables and combine them.
        // For simplicity, let's make the bass effect modify the *existing* transform string.

        // Get the current transform (applied by mousemove or previous bass calculation)
        const currentTransform = tiltBox.style.transform;
        
        // Remove any existing scale() from the string to re-add it
        const cleanedTransform = currentTransform.replace(/scale\([^)]*\)/g, '').trim();

        // Apply the new combined transform
        tiltBox.style.transform = `${cleanedTransform} scale(${dynamicScale})`;

        // You could also apply it to glitchElement directly if you want it to jump separately
        // glitchElement.style.transform = `scale(${dynamicScale})`;
    }
    // No explicit call to drawBassVisualization here; it's called after initAudioContext
    // which happens on the first play click.
});
