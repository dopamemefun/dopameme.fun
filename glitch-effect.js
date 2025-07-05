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
// const joinNowBtn = document.getElementById('joinNowBtn'); // Removed: No longer needed for JS redirect

// Save the original text for the main glitch effect
const originalGlitchText = glitchTextElement.textContent;

// Save the original title text for the tab glitch effect
const originalTitleText = document.title;
let titleGlitchInterval; // Variable to store the title glitch interval ID

// Define the "good" characters for the glitch effect.
// These are chosen to be visually consistent in width for pixel fonts
// and evoke a "glitch" or "hacked text" feel, like d0p4m3m3 or d0pam=m=.
const characters = "01345789_=-+[]{}|"; // Only these characters will be used for glitches.

let glitchInterval; // To hold the interval ID for clearing
let bassEffectInterval; // NEW: To hold the interval ID for the bass effect

// NEW: Global variables for Web Audio API
let audioContext;
let analyser;
let audioSource;
let dataArray;
let currentTiltTransform = ''; // To store the tilt transform and combine with bass shake

// Function to get a random character from the defined set
function getRandomChar(charSet) {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    return charSet.charAt(randomIndex);
}

// Function to apply the glitch effect to the "Dopameme" text
function applyBodyTextReadableGlitch() {
    let glitchedText = '';
    // Ensure the glitched text always has the same length as the original
    for (let i = 0; i < originalGlitchText.length; i++) {
        if (Math.random() < 0.4) { // 40% chance to glitch a character
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
        if (Math.random() < 0.3) { // 30% chance to glitch a character in the title
            glitchedTitle += getRandomChar(characters);
        } else {
            glitchedTitle += originalTitleText[i];
        }
    }
    document.title = glitchedTitle;
}


// Function to revert the "Dopameme" text to its original state (not currently used)
function revertBodyTextToOriginal() {
    glitchTextElement.textContent = originalGlitchText;
}

// Start the main glitch effect (slower now)
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
        totalTimeSpan.textContent = "00:00"; // Default or placeholder
        progressBar.max = 0; // Set max to 0 if duration is invalid
    }
    // Set initial volume based on the volume bar value
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
        if (bassEffectInterval) {
            clearInterval(bassEffectInterval); // Stop bass effect on pause
            bassEffectInterval = null;
        }
    } else {
        // Ensure audio context is resumed or started on play
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
        musicTrack.play();
        playPauseBtn.querySelector('.material-icons').textContent = 'pause';
        // Start bass effect if not already running
        if (!bassEffectInterval) { // Prevent multiple intervals
            initAudioAnalysis(); // Initialize and start animation loop
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
    entryScreen.classList.add('fade-out'); // Start fade-out animation
    // After fade-out, hide entry screen and show site content
    entryScreen.addEventListener('transitionend', () => {
        entryScreen.style.display = 'none'; // Hide completely after animation
        siteContent.classList.add('active'); // Activate site content (removes blur, shows)

        // Only start playing music after user interaction and site content is visible
        musicTrack.play();
        isPlaying = true;
        playPauseBtn.querySelector('.material-icons').textContent = 'pause';

        // Start the tab title glitch
        titleGlitchInterval = setInterval(applyTitleGlitch, 300); // Glitch the tab title every 300ms

        // Initialize and start the Web Audio API bass effect when music starts playing
        initAudioAnalysis();

        // Set initial total time and progress bar max on entry, just in case
        if (!isNaN(musicTrack.duration) && isFinite(musicTrack.duration)) {
            totalTimeSpan.textContent = formatTime(musicTrack.duration);
            progressBar.max = musicTrack.duration;
        }

    }, { once: true }); // Ensure this listener only runs once
});


// --- Tilt Effect Logic ---
const mainContentWrapper = document.querySelector('.main-content-wrapper');

if (mainContentWrapper) {
    mainContentWrapper.addEventListener('mousemove', (e) => {
        const { offsetWidth: width, offsetHeight: height } = mainContentWrapper;
        const { clientX: mouseX, clientY: mouseY } = e;

        const centerX = mainContentWrapper.getBoundingClientRect().left + width / 2;
        const centerY = mainContentWrapper.getBoundingClientRect().top + height / 2;

        const percentX = (mouseX - centerX) / (width / 2); // -1 to 1
        const percentY = (mouseY - centerY) / (height / 2); // -1 to 1

        const rotateX = percentY * 8; // Increased from 5 to 8 for stronger tilt
        const rotateY = percentX * -8; // Increased from -5 to -8 for stronger tilt

        // Store the tilt transform separately to combine with bass effect
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
    if (!audioContext) { // Only initialize once
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256; // Good balance for bass responsiveness
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        audioSource = audioContext.createMediaElementSource(musicTrack);
        audioSource.connect(analyser);
        analyser.connect(audioContext.destination); // Connect to speakers

        animateBass(); // Start the animation loop
    }
}

function animateBass() {
    analyser.getByteFrequencyData(dataArray);
    let bass = 0;
    // Average the first few bins for low frequencies (bass)
    for (let i = 0; i < 5; i++) { // Can adjust this range (e.g., 0-8) for more bass frequencies
        bass += dataArray[i];
    }
    bass /= 5; // Normalize bass value

    const intensityFactor = 0.8; // Controls how much the bass affects the visual, adjusted for stronger effect
    const minBassThreshold = 100; // Minimum bass value to trigger effect, adjust if needed
    const maxShakeTranslate = 8; // Max pixels to shake, increased for stronger shake
    const maxScaleIncrease = 0.015; // Max scale increase (e.g., 1.5%)

    let bassTransform = '';
    if (bass > minBassThreshold) {
        const shakeAmount = (bass - minBassThreshold) * intensityFactor / 255; // Normalize and scale

        // Add random translation (shake)
        const translateX = (Math.random() - 0.5) * 2 * maxShakeTranslate * shakeAmount;
        const translateY = (Math.random() - 0.5) * 2 * maxShakeTranslate * shakeAmount;
        bassTransform += ` translateX(${translateX}px) translateY(${translateY}px)`;

        // Add subtle scale effect (pulse)
        const scaleAmount = 1 + (shakeAmount * maxScaleIncrease);
        bassTransform += ` scale(${scaleAmount})`;
    } else {
        // When bass is low, ensure elements return to their original scale/position
        bassTransform = ` scale(1)`; // Ensure scale reverts to 1
    }

    // Combine current tilt transform with the bass transform
    mainContentWrapper.style.transform = currentTiltTransform + bassTransform;

    // Continue the animation loop
    bassEffectInterval = requestAnimationFrame(animateBass);
}
// The bass effect interval is now managed by the play/pause button and entry screen logic.
// This line below is commented out because it's now controlled dynamically.
// setInterval(applyBassEffect, 500);

// --- Join Now Button Redirection ---
// The redirection is now handled directly in HTML using an <a> tag.
// No JavaScript needed here for simple redirection.
// Make sure your index.html has:
// <a href="https://discord.gg/pepe" target="_blank" id="joinNowLink">
//     <button id="joinNowBtn">
//         <span class="material-icons">discord</span> Join Now!
//     </button>
// </a>
