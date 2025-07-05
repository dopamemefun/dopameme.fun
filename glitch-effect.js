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

// Save the original text to revert to or glitch from
const originalGlitchText = glitchTextElement.textContent;

// Define the "good" characters for the glitch effect.
// These are chosen to be visually consistent in width for pixel fonts
// and evoke a "glitch" or "hacked text" feel, like d0p4m3m3 or d0pam=m=.
const characters = "01345789_=-+[]{}|"; // Only these characters will be used for glitches.

let glitchInterval; // To hold the interval ID for clearing

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

// Function to revert the "Dopameme" text to its original state
function revertBodyTextToOriginal() {
    glitchTextElement.textContent = originalGlitchText;
}

// Start the glitch effect
glitchInterval = setInterval(applyBodyTextReadableGlitch, 150); // Glitch every 150ms

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
    } else {
        musicTrack.play();
        playPauseBtn.querySelector('.material-icons').textContent = 'pause';
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

        // Set initial total time and progress bar max on entry, just in case
        if (!isNaN(musicTrack.duration) && isFinite(musicTrack.duration)) {
            totalTimeSpan.textContent = formatTime(musicTrack.duration);
            progressBar.max = musicTrack.duration;
        }

    }, { once: true }); // Ensure this listener only runs once
});


// --- Tilt Effect Logic (from previous context) ---
const mainContentWrapper = document.querySelector('.main-content-wrapper');

if (mainContentWrapper) {
    mainContentWrapper.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = mainContentWrapper.getBoundingClientRect();

        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const rotateX = (clientY - centerY) / height * -20; // Max 20 degrees rotation
        const rotateY = (clientX - centerX) / width * 20;

        mainContentWrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
    });

    mainContentWrapper.addEventListener('mouseleave', () => {
        mainContentWrapper.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0)';
    });
}

// --- Bass Effect (Placeholder, from previous context) ---
// This part is conceptual. Actual audio reactive bass effect requires Web Audio API.
// For now, this is a visual placeholder for the idea.
function applyBassEffect() {
    // Example: slightly scale the wrapper or add/remove a class for pulse
    // This is not actual audio reactivity, but a visual pulse.
    // If you want real bass reaction, you'd need Web Audio API for frequency analysis.
    const pulseStrength = 0.005; // Small scale change
    const currentScale = parseFloat(mainContentWrapper.style.transform.match(/scale\(([^)]+)\)/)?.[1] || 1);
    const newScale = 1 + Math.random() * pulseStrength - (pulseStrength / 2); // Random small pulse

    // Preserve existing rotation if tilt is active
    const currentTransform = mainContentWrapper.style.transform;
    const rotateXMatch = currentTransform.match(/rotateX\(([^)]+)\)/);
    const rotateYMatch = currentTransform.match(/rotateY\(([^)]+)\)/);
    const existingRotateX = rotateXMatch ? rotateXMatch[0] : 'rotateX(0deg)';
    const existingRotateY = rotateYMatch ? rotateYMatch[0] : 'rotateY(0deg)';

    mainContentWrapper.style.transform = `${existingRotateX} ${existingRotateY} scale(${newScale}) translateZ(0)`;

    // Revert scale after a short delay
    setTimeout(() => {
        mainContentWrapper.style.transform = `${existingRotateX} ${existingRotateY} scale(1) translateZ(0)`;
    }, 100); // Quick pulse
}

// Trigger bass effect periodically (this is NOT audio-reactive)
// setInterval(applyBassEffect, 500); // Every 0.5 seconds for a visual pulse
