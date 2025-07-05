// glitch-effect.js - Fixed Version

const glitchTextElement = document.getElementById('glitchText');
const musicTrack = document.getElementById('musicTrack');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const progressBarFill = document.getElementById('progressBarFill');
const currentTimeSpan = document.getElementById('currentTime');
const totalTimeSpan = document.getElementById('totalTime');
const volumeBar = document.getElementById('volumeBar');
const volumeIcon = document.getElementById('volumeIcon');
const albumArt = document.getElementById('albumArt');
const songTitleElement = document.querySelector('.song-title');
const songArtistElement = document.querySelector('.song-artist');
const customHeaderImage = document.getElementById('customHeaderImage');

const originalGlitchText = glitchTextElement.textContent;
const originalTitleText = document.title;
let titleGlitchInterval;

const characters = "01345789_=-+[]{}|";
let glitchInterval;

let audioContext;
let analyser;
let audioSource;
let dataArray;
let currentTiltTransform = '';
let animationFrameId = null;

let lastKnownVolume = 0.5;
let isPlaying = false;

// Initialize audio when clicking play
async function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        audioSource = audioContext.createMediaElementSource(musicTrack);
        audioSource.connect(analyser);
        analyser.connect(audioContext.destination);
    }
    
    if (audioContext.state === 'suspended') {
        await audioContext.resume();
    }
}

// Play/Pause functionality
playPauseBtn.addEventListener('click', async () => {
    try {
        if (musicTrack.paused) {
            await initAudio();
            await musicTrack.play();
            isPlaying = true;
            if (!animationFrameId && musicTrack.volume > 0) {
                animateBass();
            }
        } else {
            musicTrack.pause();
            isPlaying = false;
        }
        updatePlayPauseBtnIcon();
    } catch (error) {
        console.error("Play/Pause error:", error);
    }
});

function updatePlayPauseBtnIcon() {
    playPauseBtn.textContent = musicTrack.paused ? 'play_arrow' : 'pause';
}

// Rest of your existing code (time display, volume control, etc.) remains the same...
// [Keep all your existing event listeners and helper functions below]
// Only the play/pause related code above was modified

// Make sure to keep all these existing functions:
function formatTime(seconds) { /* ... */ }
function setLoadingState(isLoading) { /* ... */ }
function updateVolumeIcon() { /* ... */ }
function animateBass() { /* ... */ }

// Keep all these existing event listeners:
musicTrack.addEventListener('timeupdate', () => { /* ... */ });
musicTrack.addEventListener('loadedmetadata', () => { /* ... */ });
musicTrack.addEventListener('canplaythrough', () => { /* ... */ });
musicTrack.addEventListener('play', () => { /* ... */ });
musicTrack.addEventListener('pause', () => { /* ... */ });
musicTrack.addEventListener('error', (e) => { /* ... */ });
musicTrack.addEventListener('stalled', () => { /* ... */ });
musicTrack.addEventListener('waiting', () => { /* ... */ });
musicTrack.addEventListener('playing', () => { /* ... */ });
progressBar.addEventListener('input', () => { /* ... */ });
volumeBar.addEventListener('input', () => { /* ... */ });
volumeIcon.addEventListener('click', () => { /* ... */ });
musicTrack.addEventListener('canplay', () => { /* ... */ });

// Keep your entry screen code:
const entryScreen = document.getElementById('entryScreen');
const enterSiteBtn = document.getElementById('enterSiteBtn');
const siteContent = document.getElementById('siteContent');

enterSiteBtn.addEventListener('click', async () => {
    entryScreen.classList.add('fade-out');
    entryScreen.addEventListener('transitionend', async () => {
        entryScreen.style.display = 'none';
        siteContent.classList.add('active');

        try {
            await initAudio();
            await musicTrack.play();
            isPlaying = true;
            titleGlitchInterval = setInterval(applyTitleGlitch, 300);

            if (!animationFrameId && musicTrack.volume > 0) {
                animateBass();
            }
        } catch (error) {
            console.error("Initial play error:", error);
            isPlaying = false;
        }
    }, { once: true });
});

// Keep your mouse move effects:
if (mainContentWrapper) {
    mainContentWrapper.addEventListener('mousemove', (e) => { /* ... */ });
    mainContentWrapper.addEventListener('mouseleave', () => { /* ... */ });
}
