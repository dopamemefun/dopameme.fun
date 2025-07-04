document.addEventListener('DOMContentLoaded', () => {
    // --- Entry Screen Elements ---
    const entryScreen = document.getElementById('entryScreen');
    const enterSiteBtn = document.getElementById('enterSiteBtn');
    const siteContent = document.getElementById('siteContent'); // Get the new siteContent div

    // --- Shared Glitch Logic ---
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*+=|;:",./?~`';

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

    // --- Tilt Effect Logic ---
    const tiltBox = document.querySelector('.main-content-wrapper');
    const maxTilt = 10; // Maximum tilt in degrees

    tiltBox.dataset.rotateX = 0;
    tiltBox.dataset.rotateY = 0;
    tiltBox.dataset.scale = 1.0;

    function updateCombinedTransform() {
        const currentRotateX = parseFloat(tiltBox.dataset.rotateX) || 0;
        const currentRotateY = parseFloat(tiltBox.dataset.rotateY) || 0;
        const dynamicScale = parseFloat(tiltBox.dataset.scale) || 1.0;

        tiltBox.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) scale(${dynamicScale})`;
    }

    document.addEventListener('mousemove', (e) => {
        // Only apply tilt if siteContent is active (visible)
        if (siteContent.classList.contains('active')) {
            const rect = tiltBox.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const mouseX = (e.clientX - centerX) / (rect.width / 2);
            const mouseY = (e.clientY - centerY) / (rect.height / 2);

            const rotateY = mouseX * maxTilt;
            const rotateX = -mouseY * maxTilt;

            tiltBox.dataset.rotateX = rotateX;
            tiltBox.dataset.rotateY = rotateY;

            updateCombinedTransform();
        }
    });

    document.addEventListener('mouseleave', () => {
        if (siteContent.classList.contains('active')) { // Only reset tilt if siteContent is active
            tiltBox.dataset.rotateX = 0;
            tiltBox.dataset.rotateY = 0;
            updateCombinedTransform();
        }
    });


    // --- Audio Player, Bass Visualization, and Volume Logic ---
    const musicTrack = document.getElementById('musicTrack');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progressBar = document.getElementById('progressBar');
    const progressBarFill = document.getElementById('progressBarFill');
    const currentTimeSpan = document.getElementById('currentTime');
    const totalTimeSpan = document.getElementById('totalTime');
    const playPauseIcon = playPauseBtn.querySelector('.material-icons');

    const volumeBar = document.getElementById('volumeBar');
    const volumeIcon = document.getElementById('volumeIcon');

    let audioContext;
    let analyser;
    let source;
    const dataArray = new Uint8Array(128);

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
            analyser.fftSize = 256;

            source.connect(analyser);
            analyser.connect(audioContext.destination);

            // Start the visualization loop
            drawBassVisualization();
        }
    }

    // Handle "Click to Enter" button click
    enterSiteBtn.addEventListener('click', () => {
        // 1. Play Music
        initAudioContext(); // Initialize audio context
        musicTrack.play();
        playPauseIcon.textContent = 'pause'; // Set play/pause button to pause

        // 2. Fade out entry screen
        entryScreen.classList.add('fade-out');
        
        // 3. Reveal and unblur site content
        siteContent.classList.add('active'); // Add active class to siteContent

        // Optional: Remove entry screen from DOM after transition to clean up
        entryScreen.addEventListener('transitionend', () => {
            entryScreen.remove();
        }, { once: true });
        
        // Start other animations/glitches only after entering
        startBodyGlitchCycle();
        startTitleGlitchCycle();
    });


    // Play/Pause Button Logic
    playPauseBtn.addEventListener('click', () => {
        // Ensure this button only works after the site is fully active
        if (!siteContent.classList.contains('active')) {
            return; // Do nothing if site content is not active
        }

        if (musicTrack.paused) {
            musicTrack.play();
            playPauseIcon.textContent = 'pause';
        } else {
            musicTrack.pause();
            playPauseIcon.textContent = 'play_arrow';
        }
    });

    // Update Time and Progress Bar
    musicTrack.addEventListener('loadedmetadata', () => {
        // Check if duration is a valid number
        if (!isNaN(musicTrack.duration) && isFinite(musicTrack.duration)) {
            totalTimeSpan.textContent = formatTime(musicTrack.duration);
            progressBar.max = musicTrack.duration;
        } else {
            totalTimeSpan.textContent = "00:00"; // Default or placeholder
            progressBar.max = 0; // Set max to 0 if duration is invalid
        }
        musicTrack.volume = parseFloat(volumeBar.value);
        updateVolumeIcon();
    });

    // Added canplaythrough for more reliable duration
    musicTrack.addEventListener('canplaythrough', () => {
        if (!isNaN(musicTrack.duration) && isFinite(musicTrack.duration) && musicTrack.duration > 0) {
            totalTimeSpan.textContent = formatTime(musicTrack.duration);
            progressBar.max = musicTrack.duration;
        }
    });

    musicTrack.addEventListener('timeupdate', () => {
        currentTimeSpan.textContent = formatTime(musicTrack.currentTime);
        // Only update progress bar if duration is valid to prevent calculation errors
        if (!isNaN(musicTrack.duration) && isFinite(musicTrack.duration) && musicTrack.duration > 0) {
            const progressPercent = (musicTrack.currentTime / musicTrack.duration) * 100;
            progressBarFill.style.width = `${progressPercent}%`;
            progressBar.value = musicTrack.currentTime;
        }
    });

    // Handle user seeking on the progress bar
    progressBar.addEventListener('input', () => {
        musicTrack.currentTime = progressBar.value;
    });
    
    // Reset play button icon if audio ends
    musicTrack.addEventListener('ended', () => {
        playPauseIcon.textContent = 'play_arrow';
    });


    // Volume Control Logic
    function updateVolumeIcon() {
        if (musicTrack.volume === 0 || musicTrack.muted) {
            volumeIcon.textContent = 'volume_off';
        } else if (musicTrack.volume < 0.5) {
            volumeIcon.textContent = 'volume_down';
        } else {
            volumeIcon.textContent = 'volume_up';
        }
    }

    volumeBar.addEventListener('input', () => {
        musicTrack.volume = parseFloat(volumeBar.value);
        musicTrack.muted = false;
        updateVolumeIcon();
    });

    volumeIcon.addEventListener('click', () => {
        if (musicTrack.muted) {
            musicTrack.muted = false;
            musicTrack.volume = parseFloat(volumeBar.value) === 0 ? 0.5 : parseFloat(volumeBar.value);
            volumeBar.value = musicTrack.volume;
        } else {
            musicTrack.muted = true;
            volumeBar.value = 0;
        }
        updateVolumeIcon();
    });

    // Initialize volume on load (if script loads after HTML, which it does)
    musicTrack.volume = parseFloat(volumeBar.value);
    updateVolumeIcon();


    // Bass Visualization Loop
    function drawBassVisualization() {
        requestAnimationFrame(drawBassVisualization);

        // Only run visualization if analyser is ready AND music is playing AND site is active
        if (!analyser || musicTrack.paused || !siteContent.classList.contains('active')) {
            tiltBox.dataset.scale = 1.0;
            updateCombinedTransform();
            return;
        }

        analyser.getByteFrequencyData(dataArray);

        let bassSum = 0;
        const bassBandCount = 5;
        
        for (let i = 0; i < bassBandCount; i++) {
            bassSum += dataArray[i];
        }
        let averageBass = bassSum / bassBandCount;

        const minScale = 1.0;
        const maxScale = 1.03;
        const bassThreshold = 60;
        
        let dynamicScale = minScale;
        if (averageBass > bassThreshold) {
            dynamicScale = minScale + ((averageBass - bassThreshold) / (255 - bassThreshold)) * (maxScale - minScale);
        }
        dynamicScale = Math.min(maxScale, Math.max(minScale, dynamicScale));

        tiltBox.dataset.scale = dynamicScale;
        
        updateCombinedTransform();
    }
    
    // Initial call to set the combined transform for mouseleave and initial load
    updateCombinedTransform();
});
