// glitch-effect.js

alert("Script is running!"); // Keep this for now

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

let currentTiltTransform = '';

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
    console.log("Audio Loaded Metadata. Duration:", musicTrack.duration); // NEW LOG
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
    console.log("Audio can play through."); // NEW LOG
    if (!isNaN(musicTrack.duration) && isFinite(musicTrack.duration) && musicTrack.duration > 0) {
        totalTimeSpan.textContent = formatTime(musicTrack.duration);
        progressBar.max = musicTrack.duration;
    }
});

// NEW LOGS FOR PLAY/PAUSE EVENTS
musicTrack.addEventListener('play', () => {
    console.log("Audio 'play' event fired. musicTrack.paused:", musicTrack.paused);
});

musicTrack.addEventListener('pause', () => {
    console.log("Audio 'pause' event fired. musicTrack.paused:", musicTrack.paused);
});

musicTrack.addEventListener('error', (e) => {
    console.error("Audio error event:", e.target.error.code, e.target.error.message); // CRITICAL NEW LOG
});

// Play/Pause button click handler - SIMPLIFIED FOR DEBUGGING
playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        console.log("Button clicked: isPlaying is TRUE. Attempting to PAUSE musicTrack.");
        musicTrack.pause();
        playPauseBtn.querySelector('.material-icons').textContent = 'play_arrow';
    } else {
        console.log("Button clicked: isPlaying is FALSE. Attempting to PLAY musicTrack.");
        musicTrack.play()
            .then(() => {
                console.log("musicTrack.play() Promise RESOLVED.");
            })
            .catch(e => {
                console.error("musicTrack.play() Promise REJECTED:", e);
                playPauseBtn.querySelector('.material-icons').textContent = 'play_arrow';
                isPlaying = false;
            });
        playPauseBtn.querySelector('.material-icons').textContent = 'pause';
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
enterSiteBtn.addEventListener('click', () => {
    entryScreen.classList.add('fade-out');
    entryScreen.addEventListener('transitionend', () => {
        entryScreen.style.display = 'none';
        siteContent.classList.add('active');

        musicTrack.play()
            .then(() => {
                console.log("Initial musicTrack.play() Promise RESOLVED after entry."); // NEW LOG
                isPlaying = true;
                playPauseBtn.querySelector('.material-icons').textContent = 'pause';
                titleGlitchInterval = setInterval(applyTitleGlitch, 300);

                if (!isNaN(musicTrack.duration) && isFinite(musicTrack.duration)) {
                    totalTimeSpan.textContent = formatTime(musicTrack.duration);
                    progressBar.max = musicTrack.duration;
                }
            })
            .catch(error => {
                console.error("Initial musicTrack.play() Promise REJECTED after entry:", error); // NEW LOG
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

// COMMENTED OUT FOR DEBUGGING: Entire Web Audio API Section (STILL COMMENTED OUT)
/*
async function initAudioAnalysis() { ... }
function animateBass() { ... }
*/
