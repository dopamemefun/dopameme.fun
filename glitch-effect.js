// glitch-effect.js - FINAL WORKING VERSION
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
        originalTitle: document.title,
        originalGlitchText: elements.glitchText.textContent
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
        document.title = result;
    }

    // Start glitch intervals
    setInterval(glitchText, 250);
    setInterval(glitchTitle, 400);

    // ======================
    // SMOOTH TILT EFFECT
    // ======================
    function handleTilt(e) {
        const rect = elements.mainWrapper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        state.tilt.x = ((e.clientY - centerY) / (rect.height / 2)) * 5;
        state.tilt.y = ((e.clientX - centerX) / (rect.width / 2)) * -5;
        applyEffects();
    }

    function resetTilt() {
        state.tilt.x = 0;
        state.tilt.y = 0;
        applyEffects();
    }

    elements.mainWrapper.addEventListener('mousemove', handleTilt);
    elements.mainWrapper.addEventListener('mouseleave', resetTilt);

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
                startBassAnalysis();
            } else {
                elements.musicTrack.pause();
                state.isPlaying = false;
                elements.playPauseBtn.textContent = 'play_arrow';
                cancelAnimationFrame(state.animationId);
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

    elements.volumeIcon.addEventListener('click', () => {
        if (elements.musicTrack.volume > 0) {
            state.lastVolume = elements.musicTrack.volume;
            elements.musicTrack.volume = 0;
            elements.volumeBar.value = 0;
            elements.volumeIcon.textContent = 'volume_off';
        } else {
            elements.musicTrack.volume = state.lastVolume;
            elements.volumeBar.value = state.lastVolume;
            elements.volumeIcon.textContent = state.lastVolume < 0.5 ? 'volume_down' : 'volume_up';
        }
    });

    // ======================
    // BASS VISUALIZATION
    // ======================
    function startBassAnalysis() {
        const data = new Uint8Array(state.analyser.frequencyBinCount);
        
        function analyze() {
            state.analyser.getByteFrequencyData(data);
            let bass = 0;
            for (let i = 0; i < 5; i++) bass += data[i];
            bass /= 5;
            
            if (bass > 30) {
                const intensity = bass / 255;
                const shakeX = (Math.random() - 0.5) * 2 * intensity * 3;
                const shakeY = (Math.random() - 0.5) * 2 * intensity * 3;
                state.bassEffect = `translate(${shakeX}px, ${shakeY}px)`;
            } else {
                state.bassEffect = '';
            }
            
            applyEffects();
            if (state.isPlaying) state.animationId = requestAnimationFrame(analyze);
        }
        
        state.animationId = requestAnimationFrame(analyze);
    }

    // ======================
    // EFFECTS APPLICATION
    // ======================
    function applyEffects() {
        elements.mainWrapper.style.transform = `
            perspective(1000px)
            rotateX(${state.tilt.x}deg)
            rotateY(${state.tilt.y}deg)
            ${state.bassEffect || ''}
        `;
    }

    // ======================
    // TIME DISPLAY (FIXED)
    // ======================
    function formatTime(sec) {
        const mins = Math.floor(sec / 60);
        const secs = Math.floor(sec % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    elements.musicTrack.addEventListener('timeupdate', () => {
        elements.currentTime.textContent = formatTime(elements.musicTrack.currentTime);
        elements.progressFill.style.width = `${(elements.musicTrack.currentTime / elements.musicTrack.duration) * 100}%`;
        elements.progressBar.value = elements.musicTrack.currentTime;
    });

    elements.musicTrack.addEventListener('loadedmetadata', () => {
        elements.totalTime.textContent = formatTime(elements.musicTrack.duration);
        elements.progressBar.max = elements.musicTrack.duration;
    });

    elements.progressBar.addEventListener('input', () => {
        elements.musicTrack.currentTime = elements.progressBar.value;
    });

    // ======================
    // ENTRY ANIMATION
    // ======================
    document.getElementById('enterSiteBtn')?.addEventListener('click', async () => {
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
});
