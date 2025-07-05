// glitch-effect.js - FULLY WORKING VERSION
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const elements = {
        glitchText: document.getElementById('glitchText'),
        musicTrack: document.getElementById('musicTrack'),
        playPauseBtn: document.getElementById('playPauseBtn'),
        progressBar: document.getElementById('progressBar'),
        progressFill: document.getElementById('progressBarFill'),
        currentTime: document.getElementById('currentTime'),
        totalTime: document.getElementById('totalTime'),
        volumeBar: document.getElementById('volumeBar'),
        volumeIcon: document.getElementById('volumeIcon'),
        mainWrapper: document.querySelector('.main-content-wrapper')
    };

    // State
    const state = {
        isPlaying: false,
        lastVolume: 0.5,
        audioContext: null,
        analyser: null,
        animationId: null,
        tilt: { x: 0, y: 0 },
        originalTitle: "Dopameme.fun", // Fixed tab title
        originalGlitchText: "Dopameme" // Only glitch this text
    };

    // ======================
    // GLITCH EFFECT (Dopameme only)
    // ======================
    function glitchText() {
        let result = '';
        for (let i = 0; i < state.originalGlitchText.length; i++) {
            result += Math.random() < 0.3 ? 
                "\\/|_[]"[Math.floor(Math.random() * 5)] : 
                state.originalGlitchText[i];
        }
        elements.glitchText.textContent = result;
    }

    function glitchTitle() {
        let result = '';
        for (let i = 0; i < state.originalTitle.length; i++) {
            result += Math.random() < 0.2 ? "_[]"[Math.floor(Math.random() * 3)] : state.originalTitle[i];
        }
        document.title = result || state.originalTitle; // Fallback
    }

    // Start glitch intervals
    setInterval(glitchText, 250);
    setInterval(glitchTitle, 400);

    // ======================
    // AUDIO SYSTEM (FIXED)
    // ======================
    function initAudio() {
        state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        state.analyser = state.audioContext.createAnalyser();
        state.analyser.fftSize = 64;
        const source = state.audioContext.createMediaElementSource(elements.musicTrack);
        source.connect(state.analyser);
        state.analyser.connect(state.audioContext.destination);
    }

    // WORKING Play/Pause Button
    elements.playPauseBtn.addEventListener('click', async () => {
        try {
            if (elements.musicTrack.paused) {
                if (!state.audioContext) initAudio();
                if (state.audioContext.state === 'suspended') await state.audioContext.resume();
                await elements.musicTrack.play();
                state.isPlaying = true;
                elements.playPauseBtn.textContent = 'pause';
            } else {
                elements.musicTrack.pause();
                state.isPlaying = false;
                elements.playPauseBtn.textContent = 'play_arrow';
            }
        } catch (err) {
            console.error("Playback error:", err);
        }
    });

    // WORKING Volume Control
    elements.volumeBar.addEventListener('input', () => {
        const vol = parseFloat(elements.volumeBar.value);
        elements.musicTrack.volume = vol;
        state.lastVolume = vol;
        elements.volumeIcon.textContent = vol === 0 ? 'volume_off' : vol < 0.5 ? 'volume_down' : 'volume_up';
    });

    // ======================
    // TIME DISPLAY (FIXED)
    // ======================
    function formatTime(sec) {
        if (isNaN(sec)) return "00:00";
        const mins = Math.floor(sec / 60);
        const secs = Math.floor(sec % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    elements.musicTrack.addEventListener('timeupdate', () => {
        elements.currentTime.textContent = formatTime(elements.musicTrack.currentTime);
        elements.progressFill.style.width = elements.musicTrack.duration ? 
            `${(elements.musicTrack.currentTime / elements.musicTrack.duration) * 100}%` : '0%';
        elements.progressBar.value = elements.musicTrack.currentTime;
    });

    elements.musicTrack.addEventListener('loadedmetadata', () => {
        elements.totalTime.textContent = formatTime(elements.musicTrack.duration);
        elements.progressBar.max = elements.musicTrack.duration;
    });

    elements.progressBar.addEventListener('input', () => {
        if (elements.musicTrack.duration) {
            elements.musicTrack.currentTime = elements.progressBar.value;
        }
    });

    // ======================
    // ENTRY ANIMATION
    // ======================
    document.getElementById('enterSiteBtn').addEventListener('click', () => {
        const entryScreen = document.getElementById('entryScreen');
        entryScreen.classList.add('fade-out');
        entryScreen.addEventListener('transitionend', () => {
            entryScreen.style.display = 'none';
            document.getElementById('siteContent').classList.add('active');
        }, { once: true });
    });

    // Initialize
    elements.musicTrack.volume = state.lastVolume;
    elements.volumeBar.value = state.lastVolume;
    elements.totalTime.textContent = "00:00"; // Initialize display
});
