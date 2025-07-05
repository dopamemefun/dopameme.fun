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

    function animateBounceByVolume() {
        if (!analyser) return;

        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

        const maxScaleIncrease = 0.05;
        const scale = 1 + Math.min(volume / 1024, maxScaleIncrease);

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
                el.style.transform = `scale(${scale})`;
            }
        });

        requestAnimationFrame(animateBounceByVolume);
    }

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

    elements.volumeBar.addEventListener('input', () => {
        const vol = parseFloat(elements.volumeBar.value);
        elements.musicTrack.volume = vol;
        state.lastVolume = vol;
        updateVolumeIcon(vol);
        updateVolumeFill(vol);
    });

    function updateVolumeIcon(volume) {
        if (volume === 0) {
            elements.volumeIcon.textContent = 'volume_off';
        } else if (volume < 0.5) {
            elements.volumeIcon.textContent = 'volume_down';
        } else {
            elements.volumeIcon.textContent = 'volume_up';
        }
    }

    function updateVolumeFill(volume) {
        const fill = document.querySelector('.volume-fill');
        if (fill) fill.style.width = `${volume * 100}%`;
    }

    elements.musicTrack.volume = state.lastVolume;
    elements.volumeBar.value = state.lastVolume;
    updateVolumeIcon(state.lastVolume);
    updateVolumeFill(state.lastVolume);

    elements.progressBar.addEventListener('input', () => {
        elements.musicTrack.currentTime = elements.progressBar.value;
    });

    const entryScreen = document.querySelector('.entry-screen');
    const enterBtn = document.getElementById('enterSiteBtn');
    enterBtn.addEventListener('click', async () => {
        entryScreen.classList.add('fade-out');
        elements.siteContent.classList.add('active');

        try {
            await elements.musicTrack.play();
            state.isPlaying = true;
            elements.playPauseBtn.textContent = 'pause';
            if (!audioCtx) initAudioAnalyzer();
            startBounceEffect();
        } catch (err) {
            console.error('Autoplay/playback failed:', err);
        }
    });

    const tiltTarget = elements.mainWrapper;
    let tiltX = 0, tiltY = 0;
    document.addEventListener('mousemove', e => {
        const rect = tiltTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        tiltX = ((e.clientY - centerY) / 100) * 5;
        tiltY = (-(e.clientX - centerX) / 100) * 5;
    });

    function applyTilt() {
        elements.mainWrapper.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(0.9)`;
        requestAnimationFrame(applyTilt);
    }
    applyTilt();

    let bounceAnimationId = null;
    function startBounceEffect() {
        if (!bounceAnimationId) {
            bounceAnimationId = requestAnimationFrame(animateBounceByVolume);
        }
    }
    function stopBounceEffect() {
        if (bounceAnimationId) {
            cancelAnimationFrame(bounceAnimationId);
            bounceAnimationId = null;
        }
    }
});
