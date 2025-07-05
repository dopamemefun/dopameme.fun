// DOM Elements
const glitchTextElement = document.getElementById('glitchText');
const musicTrack = document.getElementById('musicTrack');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const progressBarFill = document.getElementById('progressBarFill');
const currentTimeSpan = document.getElementById('currentTime');
const totalTimeSpan = document.getElementById('totalTime');
const volumeBar = document.getElementById('volumeBar');
const volumeIcon = document.getElementById('volumeIcon');
const mainContentWrapper = document.querySelector('.main-content-wrapper');

// Audio Analysis Variables
let audioContext, analyser, audioSource, dataArray;
let animationFrameId = null;
let currentTiltTransform = '';

// State
let lastKnownVolume = 0.5;
let isPlaying = false;

// Fixed Play/Pause Functionality
playPauseBtn.addEventListener('click', async () => {
    try {
        if (musicTrack.paused) {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;
                dataArray = new Uint8Array(analyser.frequencyBinCount);
                audioSource = audioContext.createMediaElementSource(musicTrack);
                audioSource.connect(analyser);
                analyser.connect(audioContext.destination);
            }
            await audioContext.resume();
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
        playPauseBtn.style.color = "#ff5555";
        setTimeout(() => playPauseBtn.style.color = "", 1000);
    }
});

// Rest of your existing code (time display, volume control, etc.) remains the same...
// [Keep all your existing event listeners and helper functions below]
// Only the play/pause related code above was modified

// Make sure to keep all these existing functions:
function formatTime(seconds) { /* ... */ }
function setLoadingState(isLoading) { /* ... */ }
function updateVolumeIcon() { /* ... */ }
function animateBass() { /* ... */ }
function updatePlayPauseBtnIcon() { /* ... */ }

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
