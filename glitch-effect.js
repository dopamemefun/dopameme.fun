// glitch-effect.js - FULLY WORKING VERSION (Tilt + Bass + Audio)

// Elements
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

/* ==================== */
/*  CORE FUNCTIONALITY  */
/* ==================== */

// Initialize Audio Context
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

// Play/Pause Control
playPauseBtn.addEventListener('click', async () => {
    try {
        if (musicTrack.paused) {
            await initAudio();
            await musicTrack.play();
            isPlaying = true;
            startBassAnimation();
        } else {
            musicTrack.pause();
            isPlaying = false;
            stopBassAnimation();
        }
        updatePlayPauseBtnIcon();
    } catch (error) {
        console.error("Play/Pause error:", error);
    }
});

function updatePlayPauseBtnIcon() {
    playPauseBtn.textContent = musicTrack.paused ? 'play_arrow' : 'pause';
}

/* ================= */
/*  BASS VISUALIZER  */
/* ================= */

function startBassAnimation() {
    if (!animationFrameId && musicTrack.volume > 0) {
        animateBass();
    }
}

function stopBassAnimation() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        // Reset transform when stopped
        mainContentWrapper.style.transform = currentTiltTransform;
    }
}

function animateBass() {
    if (!isPlaying || musicTrack.volume === 0) {
        stopBassAnimation();
        return;
    }

    analyser.getByteFrequencyData(dataArray);
    
    // Calculate bass intensity (low frequencies)
    let bass = 0;
    for (let i = 0; i < 10; i++) bass += dataArray[i];
    bass /= 10;

    // Apply effects only when bass exceeds threshold
    const minBassThreshold = 30;
    let bassTransform = '';
    
    if (bass > minBassThreshold) {
        const intensity = (bass - minBassThreshold) / (255 - minBassThreshold);
        
        // Shake effect
        const maxShake = 5;
        const shakeX = (Math.random() - 0.5) * 2 * maxShake * intensity;
        const shakeY = (Math.random() - 0.5) * 2 * maxShake * intensity;
        
        // Pulse effect
        const pulseScale = 1 + (intensity * 0.05);
        
        bassTransform = `translateX(${shakeX}px) translateY(${shakeY}px) scale(${pulseScale})`;
    }

    // Combine with current tilt transform
    mainContentWrapper.style.transform = `${currentTiltTransform} ${bassTransform}`;
    
    animationFrameId = requestAnimationFrame(animateBass);
}

/* ================ */
/*  TILT EFFECT  */
/* ================ */

if (mainContentWrapper) {
    mainContentWrapper.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = mainContentWrapper.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        
        // Calculate mouse position relative to center
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        // Normalize values (-1 to 1)
        const rotateY = (mouseX / (width / 2)) * 8;  // Max 8 degrees tilt
        const rotateX = -(mouseY / (height / 2)) * 8;
        
        currentTiltTransform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        mainContentWrapper.style.transform = currentTiltTransform;
    });

    mainContentWrapper.addEventListener('mouseleave', () => {
        currentTiltTransform = 'perspective(1000px) rotateX(0) rotateY(0)';
        mainContentWrapper.style.transform = currentTiltTransform;
    });
}

/* ================== */
/*  AUDIO CONTROLS  */
/* ================== */

// Time Display
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.
