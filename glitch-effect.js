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
const albumArt = document.getElementById('albumArt');
const songTitleElement = document.querySelector('.song-title');
const songArtistElement = document.querySelector('.song-artist');
const customHeaderImage = document.getElementById('customHeaderImage');

// Save the original text for the main glitch effect
const originalGlitchText = glitchTextElement.textContent;

// Save the original title text for the tab glitch effect
const originalTitleText = document.title;
let titleGlitchInterval;

const characters = "01345789_=-+[]{}|";

let glitchInterval;

// COMMENTED OUT FOR DEBUGGING: Web Audio API global variables
// let audioContext;
// let analyser;
// let audioSource;
// let dataArray;
let currentTiltTransform = '';
// let animationFrameId = null; // COMMENTED OUT FOR DEBUGGING

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

glitchInterval = setInterval(applyBodyTextReadableGlitch, 250);

let isPlaying = false;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

musicTrack.addEventListener('timeupdate', () => {
    currentTimeSpan.textContent = formatTime(musicTrack.currentTime);
    progressBarFill.style.width = (musicTrack.currentTime / musicTrack.duration) * 100 + '%';
    progressBar.value = musicTrack.currentTime;
});

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

musicTrack.addEventListener('canplaythrough', () => {
    if (!isNaN(musicTrack.duration) && isFinite(musicTrack.duration) && musicTrack.duration > 0) {
        totalTimeSpan.textContent = formatTime(musicTrack.duration);
        progressBar.max = musicTrack.duration;
    }
});

// Play/Pause button click handler - SIMPLIFIED FOR DEBUGGING
playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        console.log("Attempting to PAUSE musicTrack (Web Audio API bypassed).");
        musicTrack.pause();
        playPauseBtn.querySelector('.material-icons').textContent = 'play_arrow';
        // COMMENTED OUT FOR DEBUGGING: Web Audio API specific lines
        // if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = null; }
        // if (audioContext && audioContext.state === 'running') { audioContext.suspend(); }
    } else {
        console.log("Attempting to PLAY musicTrack (Web Audio API bypassed).");
        musicTrack.play()
            .then(() => {
                console.log("musicTrack.play() successful.");
            })
            .catch(e => {
                console.error("musicTrack.play() failed:", e);
                // If play fails, revert UI to play state
                playPauseBtn.querySelector('.material-icons').textContent = 'play_arrow';
                isPlaying = false; // Keep isPlaying false if play failed
            });
        playPauseBtn.querySelector('.material-icons').textContent = 'pause';
        // COMMENTED OUT FOR DEBUGGING: Web Audio API specific lines
        // initAudioAnalysis();
        // if (!animationFrameId) { animateBass(); }
    }
    isPlaying = !isPlaying;
    console.log("isPlaying toggled to:", isPlaying);
});

progressBar.addEventListener('input', () => {
    musicTrack.currentTime = progressBar.value;
});

volumeBar.addEventListener('input', () => {
    musicTrack.volume = parseFloat(volumeBar.value);
    updateVolumeIcon();
});

function updateVolumeIcon() {
    if (musicTrack.volume === 0) {
        volumeIcon.textContent = 'volume_off';
    } else if (musicTrack.volume < 0.5) {
        volumeIcon.textContent = 'volume_down';
    } else {
        volumeIcon.textContent = 'volume_up';
    }
}

volumeIcon.addEventListener('click', () => {
    if (musicTrack.volume > 0) {
        musicTrack.volume = 0;
        volumeBar.value = 0;
    } else {
        musicTrack.volume = 0.5;
        volumeBar.value = 0.5;
    }
    updateVolumeIcon();
});

musicTrack.addEventListener('canplay', updateVolumeIcon);


const entryScreen = document.getElementById('entryScreen');
const enterSiteBtn = document.getElementById('enterSiteBtn');
const siteContent = document.getElementById('siteContent');

// Entry button click handler - SIMPLIFIED FOR DEBUGGING
enterSiteBtn.addEventListener('click', () => { // Removed async
    entryScreen.classList.add('fade-out');
    entryScreen.addEventListener('transitionend', () => { // Removed async
        entryScreen.style.display = 'none';
        siteContent.classList.add('active');

        // Play music immediately after entering
        musicTrack.play()
            .then(() => {
                isPlaying = true;
                playPauseBtn.querySelector('.material-icons').textContent = 'pause';
                titleGlitchInterval = setInterval(applyTitleGlitch, 300);

                // COMMENTED OUT FOR DEBUGGING: Web Audio API specific lines
                // initAudioAnalysis();
                // if (!animationFrameId) { animateBass(); }

                if (!isNaN(musicTrack.duration) && isFinite(musicTrack.duration)) {
                    totalTimeSpan.textContent = formatTime(musicTrack.duration);
                    progressBar.max = musicTrack.duration;
                }
            })
            .catch(error => {
                console.error("Failed to play music after site entry:", error);
                isPlaying = false;
                playPauseBtn.querySelector('.material-icons').textContent = 'play_arrow';
            });

    }, { once: true });
});


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

// COMMENTED OUT FOR DEBUGGING: Entire Web Audio API Section
/*
async function initAudioAnalysis() {
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
        return audioContext.resume();
    }
    return Promise.resolve();
}


function animateBass() {
    if (!analyser || !dataArray || (audioContext && audioContext.state === 'suspended')) {
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
*/
