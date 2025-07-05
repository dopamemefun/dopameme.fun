// glitch-effect.js

// Make sure these elements are correctly identified
const glitchTextElement = document.getElementById('glitchText');
const musicTrack = document.getElementById('musicTrack');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const progressBarFill = document.getElementById('progressBarFill');
const currentTimeSpan = document.getElementById('currentTime');
const totalTimeSpan = document.getElementById('totalTime');
const volumeBar = document.getElementById('volumeBar');
const volumeIcon = document.getElementById('volumeIcon');
const albumArt = document.getElementById('albumArt'); // Assuming album art element
const songTitleElement = document.querySelector('.song-title');
const songArtistElement = document.querySelector('.song-artist');
const customHeaderImage = document.getElementById('customHeaderImage'); // New: reference to custom header image

// Save the original text for the main glitch effect
const originalGlitchText = glitchTextElement.textContent;

// Save the original title text for the tab glitch effect
const originalTitleText = document.title;
let titleGlitchInterval; // Variable to store the title glitch interval ID

// Define the "good" characters for the glitch effect.
const characters = "01345789_=-+[]{}|";

let glitchInterval; // To hold the interval ID for clearing

// NEW: Global variables for Web Audio API
let audioContext;
let analyser;
let audioSource; // Declared globally
let dataArray;
let currentTiltTransform = ''; // To store the tilt transform and combine with bass shake
let animationFrameId = null; // Stores the ID for requestAnimationFrame for bass effect

// Function to get a random character from the defined set
function getRandomChar(charSet) {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    return charSet.charAt(randomIndex);
}

// Function to apply the glitch effect to the "Dopameme" text
function applyBodyTextReadableGlitch() {
    let glitchedText = '';
    for (let i = 0; i < originalGlitchText.length; i++) {
        if (Math.random() < 0.4) {
            glitchedText += getRandomChar(characters);
        } else {
            glitchedText += originalGlitchText[i];
        }
    }
    glitchTextElement.textContent = glitchedText;
}

// Function to apply glitch to the browser tab title
function applyTitleGlitch() {
    let glitchedTitle = '';
    for (let i = 0; i < originalTitleText.length; i++) {
        if (Math.random() < 0.3) {
            glitchedTitle += getRandomChar(characters);
        } else {
            glitchedTitle += originalTitleText[i];
        }
    }
    document.title = glitchedTitle;
}

// Start the main glitch effect
glitchInterval = setInterval(applyBodyTextReadableGlitch, 250);

// --- Audio Player Logic ---

let isPlaying = false; // Initial state

// Function to format time into MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Update time display and progress bar
musicTrack.addEventListener('timeupdate', () => {
    currentTimeSpan.textContent = formatTime(musicTrack.currentTime);
    progressBarFill.style.width = (musicTrack.currentTime / musicTrack.duration) * 100 + '%';
    progressBar.value = musicTrack.currentTime;
});

// When metadata is loaded, set total time and max for progress bar
musicTrack.addEventListener('loadedmetadata', () => {
    if (!isNaN(musicTrack.duration) && isFinite(musicTrack.duration)) {
        totalTimeSpan.textContent = formatTime(musicTrack.duration);
        progressBar.max = musicTrack.duration;
    } else {
        totalTimeSpan.textContent = "00:00";
        progressBar.max = 0;
    }
    musicTrack.volume = parseFloat(volumeBar.value);
    updateVolumeIcon();
});

// Fallback for duration if loadedmetadata doesn't provide it immediately
musicTrack.addEventListener('canplaythrough', () => {
    if (!isNaN(musicTrack.duration) && isFinite(musicTrack.duration) && musicTrack.duration > 0) {
        totalTimeSpan.textContent = formatTime(musicTrack.duration);
        progressBar.max = musicTrack.duration;
    }
});

// Play/Pause button click handler
playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        musicTrack.pause();
        playPauseBtn.querySelector('.material-icons').textContent = 'play_arrow';
        if (animationFrameId) { // If animation is running, stop it
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        // Suspend the audio context when paused to save resources
        if (audioContext && audioContext.state === 'running') {
            audioContext.suspend();
        }
    } else {
        // Ensure audio context is initialized and resumed on play
        initAudioAnalysis(); // Initialize or resume context
        musicTrack.play();
        playPauseBtn.querySelector('.material-icons').textContent = 'pause';
        
        // Start animation if it's not running
        if (!animationFrameId) {
            animateBass();
        }
    }
    isPlaying = !isPlaying;
});

// Progress bar (scrubber) functionality
progressBar.addEventListener('input', () => {
    musicTrack.currentTime = progressBar.value;
});

// Volume bar functionality
volumeBar.addEventListener('input', () => {
    musicTrack.volume = parseFloat(volumeBar.value);
    updateVolumeIcon();
});

// Update volume icon based on volume level
function updateVolumeIcon() {
    if (musicTrack.volume === 0) {
        volumeIcon.textContent = 'volume_off';
    } else if (musicTrack.volume < 0.5) {
        volumeIcon.textContent = 'volume_down';
    } else {
        volumeIcon.textContent = 'volume_up';
    }
}

// Mute/unmute on volume icon click (optional, if you want this feature)
volumeIcon.addEventListener('click', () => {
    if (musicTrack.volume > 0) {
        musicTrack.volume = 0;
        volumeBar.value = 0;
    } else {
        musicTrack.volume = 0.5; // Restore to a default level
        volumeBar.value = 0.5;
    }
    updateVolumeIcon();
});

// Set initial volume icon state on load
musicTrack.addEventListener('canplay', updateVolumeIcon);


// --- Entry Screen Logic ---
const entryScreen = document.getElementById('entryScreen');
const enterSiteBtn = document.getElementById('enterSiteBtn');
const siteContent = document.getElementById('siteContent');

enterSiteBtn.addEventListener('click', () => {
    entryScreen.classList.add('fade-out');
    entryScreen.addEventListener('transitionend', () => {
        entryScreen.style.display = 'none';
        siteContent.classList.add('active');

        // Play music immediately after entering
        musicTrack.play();
        isPlaying = true;
        playPauseBtn.querySelector('.material-icons').textContent = 'pause';

        titleGlitchInterval = setInterval(applyTitleGlitch, 300);

        // Initialize and start the Web Audio API bass effect when music starts playing
        initAudioAnalysis(); // Ensure context is ready
        if (!animationFrameId) { // Prevent multiple calls to animateBass
            animateBass();
        }

        if (!isNaN(musicTrack.duration) && isFinite(musicTrack.duration)) {
            totalTimeSpan.textContent = formatTime(musicTrack.duration);
            progressBar.max = musicTrack.duration;
        }

    }, { once: true });
});


// --- Tilt Effect Logic ---
const mainContentWrapper = document.querySelector('.main-content-wrapper');

if (mainContentWrapper) {
    mainContentWrapper.addEventListener('mousemove', (e) => {
        const { offsetWidth: width, offsetHeight: height } = mainContentWrapper;
        const { clientX: mouseX, clientY: mouseY } = e;

        const centerX = mainContentWrapper.getBoundingClientRect().left + width / 2;
        const centerY = mainContentWrapper.getBoundingClientRect().top + height / 2;

        const percentX = (mouseX - centerX) / (width / 2);
        const percentY = (mouseY - centerY) / (height / 2);

        const rotateX = percentY * 8;
        const rotateY = percentX * -8;

        currentTiltTransform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        // Apply immediately for smooth mouse response
        mainContentWrapper.style.transform = currentTiltTransform;
    });

    mainContentWrapper.addEventListener('mouseleave', () => {
        currentTiltTransform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)'; // Reset tilt
        mainContentWrapper.style.transform = currentTiltTransform;
    });
}

// --- Web Audio API Bass Effect ---
function initAudioAnalysis() {
    if (!audioContext) { // Only create AudioContext if it doesn't exist
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount); // Correct property name

        // Create audioSource only once
        audioSource = audioContext.createMediaElementSource(musicTrack);
        audioSource.connect(analyser);
        analyser.connect(audioContext.destination);
    } 
    
    // Always try to resume context if it's suspended, on any user interaction
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log('AudioContext resumed successfully!');
        }).catch(e => console.error('Error resuming AudioContext:', e));
    }
}


function animateBass() {
    // Ensure analyser and dataArray are ready
    if (!analyser || !dataArray || audioContext.state === 'suspended') {
        // If suspended or not initialized, stop the animation.
        // This is crucial for stopping animation when paused.
        animationFrameId = null;
        return;
    }
    
    analyser.getByteFrequencyData(dataArray);
    let bass = 0;
    // Consider slightly more bass bins if your music has deep bass notes
    // Using 10 bins for more prominent bass detection
    for (let i = 0; i < 10; i++) { 
        bass += dataArray[i];
    }
    bass /= 10; // Adjust divisor based on new loop limit

    const intensityFactor = 0.8;
    const minBassThreshold = 100;
    const maxShakeTranslate = 8;
    const maxScaleIncrease = 0.015;

    let bassTransform = '';
    if (bass > minBassThreshold) {
        const shakeAmount = (bass - minBassThreshold) * intensityFactor / 255;

        const translateX = (Math.random() - 0.5) * 2 * maxShakeTranslate * shakeAmount;
        const translateY = (Math.random() - 0.5) * 2 * maxShakeTranslate * shakeAmount;
        bassTransform += ` translateX(${translateX}px) translateY(${translateY}px)`;

        const scaleAmount = 1 + (shakeAmount * maxScaleIncrease);
        bassTransform += ` scale(${scaleAmount})`;
    } else {
        bassTransform = ` scale(1)`; // Reset scale when bass is below threshold
    }

    // Combine current tilt transform with the bass transform
    mainContentWrapper.style.transform = currentTiltTransform + bassTransform;

    // Continue the animation loop
    animationFrameId = requestAnimationFrame(animateBass);
}
