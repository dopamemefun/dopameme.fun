document.addEventListener('DOMContentLoaded', () => {
    // --- Entry Screen Elements ---
    const entryScreen = document.getElementById('entryScreen');
    const enterSiteBtn = document.getElementById('enterSiteBtn');

    // --- Shared Glitch Logic ---
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_+-=|;:",./?~`';

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
    });

    document.addEventListener('mouseleave', () => {
        tiltBox.dataset.rotateX = 0;
        tiltBox.dataset.rotateY = 0;
        updateCombinedTransform(); 
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

    // NEW: Handle "Click to Enter" button click
    enterSiteBtn.addEventListener('click', () => {
        // 1. Play Music
        initAudioContext(); // Initialize audio context
        musicTrack.play();
        playPauseIcon.textContent = 'pause'; // Set play/pause button to pause

        // 2. Fade out entry screen and remove blur
        entryScreen.classList.add('fade-out');
        document.body.classList.add('site-entered');

        // Optional: Remove entry screen from DOM after transition to clean up
        entryScreen.addEventListener('transitionend', () => {
            entryScreen.remove();
        }, { once: true }); // Use { once: true } to remove listener after it fires once
        
        // Start other animations/glitches only after entering
        startBodyGlitchCycle();
        startTitleGlitchCycle();
    });


    // Play/Pause Button Logic (modified slightly for initial state)
    playPauseBtn.addEventListener('click', () => {
        // If the site hasn't been entered yet, this button won't function for playing.
        // It's assumed initAudioContext() and musicTrack.play() happen on enterSiteBtn click.
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
        totalTimeSpan.textContent = formatTime(musicTrack.duration);
        progressBar.max = musicTrack.duration; 
        musicTrack.volume = parseFloat(volumeBar.value); 
        updateVolumeIcon(); 
    });

    musicTrack.addEventListener('timeupdate', () => {
        currentTimeSpan.textContent = formatTime(musicTrack.currentTime);
        const progressPercent = (musicTrack.currentTime / musicTrack.duration) * 100;
        progressBarFill.style.width = `${progressPercent}%`;
        progressBar.value = musicTrack.currentTime; 
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

        // Only run visualization if analyser is ready AND music is playing
        if (!analyser || musicTrack.paused) {
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

    // IMPORTANT: Remove initial calls to startBodyGlitchCycle() and startTitleGlitchCycle() from here
    // These are now called ONLY after the user clicks "Enter Site".
    // This prevents the glitches from running while the entry screen is visible.
    // If you want the glitches to run BEFORE entry, move them back outside the enterSiteBtn listener.
    // I've commented them out below, but ensure they are not duplicated if you keep them.
    // startBodyGlitchCycle(); // This line should be removed or commented out.
    // startTitleGlitchCycle(); // This line should be removed or commented out.
});
