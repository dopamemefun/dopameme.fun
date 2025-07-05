// glitch-effect.js - FULLY WORKING VERSION
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

// Glitch Effect Variables
const originalGlitchText = glitchTextElement.textContent;
const originalTitleText = document.title;
let titleGlitchInterval;
const characters = "01345789_=-+[]{}|";
let glitchInterval;

// Audio Analysis Variables
let audioContext;
let analyser;
let audioSource;
let dataArray;
let currentTiltTransform = '';
let animationFrameId = null;

// Player State
let lastKnownVolume = 0.5;
let isPlaying = false;

/* ====================== */
/*       GLITCH EFFECTS       */
/* ====================== */
function getRandomChar(charSet) {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    return charSet.charAt(randomIndex);
}

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

// Start glitch effects
glitchInterval = setInterval(applyBodyTextReadableGlitch, 250);

/* ====================== */
/*    AUDIO CONTROLS     */
/* ====================== */
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function updatePlayPauseBtnIcon() {
    playPauseBtn.textContent = musicTrack.paused ? 'play_arrow' : 'pause';
}

function setLoadingState(isLoading) {
    if (isLoading) {
        songTitleElement.classList.add('loading-track');
        songArtistElement.classList.add('loading-track');
    } else {
        songTitleElement.classList.remove('loading-track');
        songArtistElement.classList.remove('loading-track');
    }
}

// FIXED PLAY/PAUSE FUNCTIONALITY
playPauseBtn.addEventListener('click', async () => {
    try {
        if (musicTrack.paused) {
            // Initialize audio analysis if needed
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

/* ====================== */
/*    PLAYBACK CONTROLS   */
/* ====================== */
musicTrack.addEventListener('timeupdate', () => {
    currentTimeSpan.textContent = formatTime(musicTrack.currentTime);
    progressBarFill.style.width = (musicTrack.currentTime / musicTrack.duration) * 100 + '%';
    progressBar.value = musicTrack.currentTime;
});

musicTrack.addEventListener('loadedmetadata', () => {
    if (!isNaN(musicTrack.duration) && isFinite(musicTrack.duration)) {
        totalTimeSpan.textContent = formatTime(musicTrack.duration);
        progressBar.max = musicTrack.duration;
    }
    musicTrack.volume = lastKnownVolume;
    volumeBar.value = lastKnownVolume;
    updateVolumeIcon();
    updatePlayPauseBtnIcon();
});

progressBar.addEventListener('input', () => {
    musicTrack.currentTime = progressBar.value;
});

/* ====================== */
/*     VOLUME CONTROLS    */
/* ====================== */
function updateVolumeIcon() {
    if (musicTrack.volume === 0) {
        volumeIcon.textContent = 'volume_off';
    } else if (musicTrack.volume < 0.5) {
        volumeIcon.textContent = 'volume_down';
    } else {
        volumeIcon.textContent = 'volume_up';
    }
}

volumeBar.addEventListener('input', () => {
    const newVolume = parseFloat(volumeBar.value);
    musicTrack.volume = newVolume;
    if (newVolume > 0) {
        lastKnownVolume = newVolume;
    }
    updateVolumeIcon();
    
    if (musicTrack.volume === 0) {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    } else if (!animationFrameId && isPlaying) {
        animateBass();
    }
});

volumeIcon.addEventListener('click', () => {
    if (musicTrack.volume > 0) {
        lastKnownVolume = musicTrack.volume;
        musicTrack.volume = 0;
        volumeBar.value = 0;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    } else {
        musicTrack.volume = lastKnownVolume;
        volumeBar.value = lastKnownVolume;
        if (!animationFrameId && isPlaying) {
            animateBass();
        }
    }
    updateVolumeIcon();
});

/* ====================== */
/*     ENTRY ANIMATION    */
/* ====================== */
const entryScreen = document.getElementById('entryScreen');
const enterSiteBtn = document.getElementById('enterSiteBtn');
const siteContent = document.getElementById('siteContent');

enterSiteBtn.addEventListener('click', async () => {
    entryScreen.classList.add('fade-out');
    entryScreen.addEventListener('transitionend', async () => {
        entryScreen.style.display = 'none';
        siteContent.classList.add('active');

        try {
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

/* ====================== */
/*      TILT EFFECT       */
/* ====================== */
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
        mainContentWrapper.style.transform = currentTiltTransform;
    });

    mainContentWrapper.addEventListener('mouseleave', () => {
        currentTiltTransform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        mainContentWrapper.style.transform = currentTiltTransform;
    });
}

/* ====================== */
/*   BASS VISUALIZATION   */
/* ====================== */
function animateBass() {
    if (musicTrack.volume === 0 || !isPlaying) {
        animationFrameId = null;
        return;
    }

    if (!analyser || !dataArray || (audioContext && audioContext.state !== 'running')) {
        animationFrameId = null;
        return;
    }
    
    analyser.getByteFrequencyData(dataArray);
    let bass = 0;
    for (let i = 0; i < 10; i++) {
        bass += dataArray[i];
    }
    bass /= 10;

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
        bassTransform = ` scale(1)`;
    }

    mainContentWrapper.style.transform = currentTiltTransform + bassTransform;
    animationFrameId = requestAnimationFrame(animateBass);
}

// Initialize player
musicTrack.volume = lastKnownVolume;
volumeBar.value = lastKnownVolume;
updateVolumeIcon();
updatePlayPauseBtnIcon();
