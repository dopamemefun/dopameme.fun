// glitch-effect.js - WITH SIMPLIFIED IN-PLACE BOUNCE
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
        mainWrapper: document.querySelector('.main-content-wrapper'),
        siteContent: document.getElementById('siteContent'),
        songTitle: document.querySelector('.song-title'),
        albumArt: document.querySelector('#albumArt')
    };

    // State
    const state = {
        isPlaying: false,
        lastVolume: 0.5,
        audioContext: null,
        analyser: null,
        animationId: null,
        originalTitle: "Dopameme.fun",
        originalGlitchText: "Dopameme",
        duration: 0
    };

    // ======================
    // GLITCH EFFECT
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
        document.title = result || state.originalTitle;
    }

    setInterval(glitchText, 250);
    setInterval(glitchTitle, 400);

    // ======================
    // AUDIO SYSTEM WITH SIMPLE BOUNCE
    // ======================
    function initAudio() {
        state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        state.analyser = state.audioContext.createAnalyser();
        state.analyser.fftSize = 32;
        const source = state.audioContext.createMediaElementSource(elements.musicTrack);
        source.connect(state.analyser);
        state.analyser.connect(state.audioContext.destination);
    }

    function startBounceEffect() {
        // Add bounce class to key elements
        elements.songTitle.classList.add('beat-bounce');
        elements.albumArt.classList.add('beat-bounce');
        elements.playPauseBtn.classList.add('beat-bounce');
    }

    function stopBounceEffect() {
        // Remove bounce class
        elements.songTitle.classList.remove('beat-bounce');
        elements.albumArt.classList.remove('beat-bounce');
        elements.playPauseBtn.classList.remove('beat-bounce');
    }

    // ======================
    // PLAY/PAUSE CONTROL
    // ======================
    elements.playPauseBtn.addEventListener('click', async () => {
        try {
            if (elements.musicTrack.paused) {
                if (!state.audioContext) initAudio();
                if (state.audioContext.state === 'suspended') await state.audioContext.resume();
                await elements.musicTrack.play();
                state.isPlaying = true;
                elements.playPauseBtn.textContent = 'pause';
                startBounceEffect();
            } else {
                elements.musicTrack.pause();
                state.isPlaying = false;
                elements.playPauseBtn.textContent = 'play_arrow';
                stopBounceEffect();
            }
        } catch (err) {
            console.error("Playback error:", err);
        }
    });

    // ======================
    // TIME DISPLAY
    // ======================
    function formatTime(seconds) {
        if (isNaN(seconds)) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    elements.musicTrack.addEventListener('timeupdate', () => {
        elements.currentTime.textContent = formatTime(elements.musicTrack.currentTime);
        if (state.duration) {
            elements.progressFill.style.width = `${(elements.musicTrack.currentTime / state.duration) * 100}%`;
            elements.progressBar.value = elements.musicTrack.currentTime;
        }
    });

    elements.musicTrack.addEventListener('loadedmetadata', () => {
        if (elements.musicTrack.duration !== Infinity) {
            state.duration = elements.musicTrack.duration;
            elements.totalTime.textContent = formatTime(state.duration);
            elements.progressBar.max = state.duration;
        }
    });

    // ======================
    // VOLUME CONTROL
    // ======================
    elements.volumeBar.addEventListener('input', () => {
        const vol = parseFloat(elements.volumeBar.value);
        elements.musicTrack.volume = vol;
        state.lastVolume = vol;
        elements.volumeIcon.textContent = vol === 0 ? 'volume_off' : vol < 0.5 ? 'volume_down' : 'volume_up';
    });

    // ======================
    // ENTRY ANIMATION
    // ======================
    document.getElementById('enterSiteBtn').addEventListener('click', () => {
        const entryScreen = document.getElementById('entryScreen');
        entryScreen.classList.add('fade-out');
        entryScreen.addEventListener('transitionend', () => {
            entryScreen.style.display = 'none';
            elements.siteContent.classList.add('active');
        }, { once: true });
    });

    // Initialize
    elements.musicTrack.volume = state.lastVolume;
    elements.volumeBar.value = state.lastVolume;
    elements.totalTime.textContent = "00:00";
    elements.progressBar.value = 0;
    elements.progressFill.style.width = "0%";
});
