document.addEventListener('DOMContentLoaded', () => {

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

    const tiltBox = document.querySelector('.main-content-wrapper'); 

    const maxTilt = 10; // Maximum tilt in degrees



    // Global variables to store current rotation values from mousemove

    // These will be updated by mousemove and used by drawBassVisualization

    tiltBox.dataset.rotateX = 0; // Initialize custom data attributes

    tiltBox.dataset.rotateY = 0;

    tiltBox.dataset.scale = 1.0; // Initialize scale



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

        updateCombinedTransform(); // Update transform to reset

    });





    // --- Audio Player, Bass Visualization, and NEW: Volume Logic ---

    const musicTrack = document.getElementById('musicTrack');

    const playPauseBtn = document.getElementById('playPauseBtn');

    const progressBar = document.getElementById('progressBar');

    const progressBarFill = document.getElementById('progressBarFill');

    const currentTimeSpan = document.getElementById('currentTime');

    const totalTimeSpan = document.getElementById('totalTime');

    const playPauseIcon = playPauseBtn.querySelector('.material-icons'); // Get the icon element

    

    // NEW: Volume elements

    const volumeBar = document.getElementById('volumeBar');

    const volumeIcon = document.getElementById('volumeIcon');



    let audioContext;

    let analyser;

    let source;

    const dataArray = new Uint8Array(128); // analyser.fftSize / 2 (since fftSize is 256)



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

            analyser.fftSize = 256; 



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

        progressBar.max = musicTrack.duration; 

        musicTrack.volume = parseFloat(volumeBar.value); // Set initial volume from slider

        updateVolumeIcon(); // Set initial volume icon

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





    // NEW: Volume Control Logic

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

        musicTrack.muted = false; // Unmute if user adjusts volume

        updateVolumeIcon();

    });



    // Optional: Click volume icon to mute/unmute

    volumeIcon.addEventListener('click', () => {

        if (musicTrack.muted) {

            musicTrack.muted = false;

            // Restore volume to last known value or default (0.5) if it was 0

            musicTrack.volume = parseFloat(volumeBar.value) === 0 ? 0.5 : parseFloat(volumeBar.value);

            volumeBar.value = musicTrack.volume; // Sync slider

        } else {

            musicTrack.muted = true;

            volumeBar.value = 0; // Sync slider to 0

        }

        updateVolumeIcon();

    });



    // Initialize volume on load (if script loads after HTML, which it does)

    musicTrack.volume = parseFloat(volumeBar.value);

    updateVolumeIcon();





    // Bass Visualization Loop

    function drawBassVisualization() {

        requestAnimationFrame(drawBassVisualization); 



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

});
