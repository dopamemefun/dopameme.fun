document.addEventListener('DOMContentLoaded', () => {
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
        headerImage: document.getElementById('customHeaderImage'),
        joinBtn: document.getElementById('joinNowBtn'),
        audioPlayer: document.querySelector('.audio-player-container'),
        songTitle: document.querySelector('.song-title'),
        albumArt: document.getElementById('albumArt'),
        timeDisplay: document.querySelector('.time-display')
    };

    const state = {
        isPlaying: false,
        lastVolume: 0.5,
        originalTitle: "Dopameme.fun",
        originalGlitchText: "Dopameme",
        duration: 0
    };

    // ====================== GLITCH EFFECT ======================
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

    // ====================== AUDIO ANALYZER ======================
    let audioCtx, sourceNode, analyser, dataArray;

    function initAudioAnalyzer() {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        sourceNode = audioCtx.createMediaElementSource(elements.musicTrack);
        analyser = audioCtx.createAnalyser();

        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        sourceNode.connect(analyser);
        analyser.connect(audioCtx.destination);

        animateBounceByVolume();
    }

    // Tilt variables
    let tiltX = 0, tiltY = 0;
    let currentX = 0, currentY = 0;

    function animateBounceByVolume() {
        if (!analyser) return;

        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        const scale = 1 + (volume / 512);

        const bounceTargets = [
            elements.glitchText,
            elements.headerImage,
            elements.joinBtn,
            elements.playPauseBtn,
            elements.audioPlayer,
            elements.songTitle,
            elements.albumArt,
            elements.mainWrapper
        ];

        bounceTargets.forEach(el => {
            if (el) {
                el.style.transform = `scale(${scale}) rotateX(${currentX}deg) rotateY(${currentY}deg)`;
            }
        });

        requestAnimationFrame(animateBounceByVolume);
    }

    // ====================== PLAY/PAUSE CONTROL ======================
    elements.playPauseBtn.addEventListener('click', async () => {
        try {
            if (elements.musicTrack.paused) {
                await elements.musicTrack.play();
                state.isPlaying = true;
                elements.playPauseBtn.textContent = 'pause';
                startBounceEffect();
                if (!audioCtx) initAudioAnalyzer();
            } else {
                elements.musicTrack.pause();
                state.isPlaying = false;
                elements.playPauseBtn.textContent = 'play_arrow';
                stopBounceEffect();
                document.querySelectorAll('.main-content-wrapper *').forEach(el => {
                    el.style.transform = '';
                });
            }
        } catch (err) {
            console.error("Playback error:", err);
        }
    });

    // ====================== TIME DISPLAY ======================
    function formatTime(seconds) {
        if (isNaN(seconds)) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    elements.musicTrack.addEventListener('timeupdate', () => {
        const current = elements.musicTrack.currentTime;
        const duration = elements.musicTrack.duration || state.duration;
        
        elements.currentTime.textContent = formatTime(current);
        elements.totalTime.textContent = formatTime(duration);
        
        if (duration) {
            elements.progressFill.style.width = `${(current / duration) * 100}%`;
            elements.progressBar.value = current;
        }
    });

    elements.musicTrack.addEventListener('loadedmetadata', () => {
        state.duration = elements.musicTrack.duration;
        elements.progressBar.max = state.duration;
        elements.totalTime.textContent = formatTime(state.duration);
    });

    // ====================== VOLUME CONTROL ======================
    elements.volumeBar.addEventListener('input', () => {
        const vol = parseFloat(elements.volumeBar.value);
        elements.musicTrack.volume = vol;
        state.lastVolume = vol;
        elements.volumeIcon.textContent = vol === 0 ? 'volume_off' : vol < 0.5 ? 'volume_down' : 'volume_up';
    });

    // ====================== ENTRY BUTTON ======================
    document.getElementById('enterSiteBtn').addEventListener('click', async () => {
        const entryScreen = document.getElementById('entryScreen');

        try {
            await elements.musicTrack.play();
            state.isPlaying = true;
            elements.playPauseBtn.textContent = 'pause';
            startBounceEffect();
            initAudioAnalyzer();
        } catch (err) {
            console.warn('Autoplay failed:', err);
        }

        entryScreen.classList.add('fade-out');
        entryScreen.addEventListener('transitionend', () => {
            entryScreen.style.display = 'none';
            elements.siteContent.classList.add('active');
        }, { once: true });
    });

    // ====================== INITIAL SETUP ======================
    elements.musicTrack.volume = state.lastVolume;
    elements.volumeBar.value = state.lastVolume;
    elements.totalTime.textContent = "00:00";
    elements.progressBar.value = 0;
    elements.progressFill.style.width = "0%";
    elements.timeDisplay.style.fontFeatureSettings = '"tnum"';

    // ====================== STATIC BOUNCE (Fallback) ======================
    function startBounceEffect() {
        const bounceEls = [
            elements.glitchText,
            elements.headerImage,
            elements.joinBtn,
            elements.playPauseBtn,
            elements.audioPlayer,
            elements.songTitle,
            elements.albumArt,
            elements.timeDisplay,
            elements.mainWrapper
        ];
        bounceEls.forEach(el => {
            if (el) el.classList.add('bounce-active');
        });
    }

    function stopBounceEffect() {
        document.querySelectorAll('.bounce-active').forEach(el => {
            el.classList.remove('bounce-active');
        });
    }

    // ====================== MOUSE-BASED TILT ======================
    document.addEventListener('mousemove', e => {
        const rect = elements.mainWrapper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        tiltX = (e.clientY - centerY) / 40;
        tiltY = -(e.clientX - centerX) / 40;
    });

    function updateTilt() {
        currentX += (tiltX - currentX) * 0.07;
        currentY += (tiltY - currentY) * 0.07;
        requestAnimationFrame(updateTilt);
    }

    updateTilt(); // Start tilt loop
});
