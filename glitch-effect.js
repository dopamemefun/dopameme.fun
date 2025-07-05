// glitch-effect.js - REVISED VERSION
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const elements = {
        glitchText: document.getElementById('glitchText'),
        musicTrack: document.getElementById('musicTrack'),
        playPauseBtn: document.getElementById('playPauseBtn'),
        progressBar: document.getElementById('progressBar'),
        progressBarFill: document.getElementById('progressBarFill'),
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
        tiltTransform: ''
    };

    // Glitch Effect
    const glitchEffect = {
        chars: "01345789_=-+[]{}|",
        interval: null,
        applyTextGlitch() {
            let result = '';
            const original = elements.glitchText.textContent;
            for (let i = 0; i < original.length; i++) {
                result += Math.random() < 0.4 ? 
                    this.chars[Math.floor(Math.random() * this.chars.length)] : 
                    original[i];
            }
            elements.glitchText.textContent = result;
        },
        start() {
            this.interval = setInterval(this.applyTextGlitch.bind(this), 250);
        }
    };

    // Audio System
    const audioSystem = {
        init() {
            elements.musicTrack.volume = state.lastVolume;
            elements.volumeBar.value = state.lastVolume;
            this.setupEventListeners();
        },

        setupEventListeners() {
            // Play/Pause with more reliable handling
            elements.playPauseBtn.addEventListener('click', () => {
                if (elements.musicTrack.paused) {
                    this.play();
                } else {
                    this.pause();
                }
            });

            // Progress bar
            elements.progressBar.addEventListener('input', () => {
                elements.musicTrack.currentTime = elements.progressBar.value;
            });

            // Volume controls
            elements.volumeBar.addEventListener('input', () => {
                const vol = parseFloat(elements.volumeBar.value);
                elements.musicTrack.volume = vol;
                state.lastVolume = vol > 0 ? vol : state.lastVolume;
                this.updateVolumeIcon();
                this.handleBassState();
            });

            elements.volumeIcon.addEventListener('click', this.toggleMute.bind(this));

            // Time updates
            elements.musicTrack.addEventListener('timeupdate', () => {
                elements.currentTime.textContent = this.formatTime(elements.musicTrack.currentTime);
                elements.progressBarFill.style.width = 
                    (elements.musicTrack.currentTime / elements.musicTrack.duration) * 100 + '%';
                elements.progressBar.value = elements.musicTrack.currentTime;
            });
        },

        async play() {
            try {
                // Initialize audio context if needed
                if (!state.audioContext) {
                    state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    state.analyser = state.audioContext.createAnalyser();
                    state.analyser.fftSize = 256;
                    
                    const source = state.audioContext.createMediaElementSource(elements.musicTrack);
                    source.connect(state.analyser);
                    state.analyser.connect(state.audioContext.destination);
                }

                // Handle suspended state (Chrome autoplay policy)
                if (state.audioContext.state === 'suspended') {
                    await state.audioContext.resume();
                }

                await elements.musicTrack.play();
                state.isPlaying = true;
                this.updatePlayPauseIcon();
                this.handleBassState();
            } catch (err) {
                console.error("Playback failed:", err);
                this.showErrorFeedback();
            }
        },

        pause() {
            elements.musicTrack.pause();
            state.isPlaying = false;
            this.updatePlayPauseIcon();
            if (state.animationId) {
                cancelAnimationFrame(state.animationId);
                state.animationId = null;
            }
        },

        toggleMute() {
            if (elements.musicTrack.volume > 0) {
                state.lastVolume = elements.musicTrack.volume;
                elements.musicTrack.volume = 0;
                elements.volumeBar.value = 0;
            } else {
                elements.musicTrack.volume = state.lastVolume;
                elements.volumeBar.value = state.lastVolume;
            }
            this.updateVolumeIcon();
            this.handleBassState();
        },

        handleBassState() {
            if (elements.musicTrack.volume === 0 || !state.isPlaying) {
                if (state.animationId) {
                    cancelAnimationFrame(state.animationId);
                    state.animationId = null;
                }
            } else if (!state.animationId && state.isPlaying) {
                bassVisualizer.start();
            }
        },

        updatePlayPauseIcon() {
            elements.playPauseBtn.textContent = 
                elements.musicTrack.paused ? 'play_arrow' : 'pause';
        },

        updateVolumeIcon() {
            const vol = elements.musicTrack.volume;
            elements.volumeIcon.textContent = 
                vol === 0 ? 'volume_off' : 
                vol < 0.5 ? 'volume_down' : 'volume_up';
        },

        formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        },

        showErrorFeedback() {
            elements.playPauseBtn.style.color = "#ff5555";
            setTimeout(() => elements.playPauseBtn.style.color = "", 1000);
        }
    };

    // Bass Visualizer
    const bassVisualizer = {
        dataArray: new Uint8Array(256),
        start() {
            if (!state.analyser) return;
            state.animationId = requestAnimationFrame(this.analyze.bind(this));
        },

        analyze() {
            state.analyser.getByteFrequencyData(this.dataArray);
            
            // Calculate bass (low frequencies)
            let bass = 0;
            for (let i = 0; i < 10; i++) bass += this.dataArray[i];
            bass /= 10;

            // Apply effects only when bass is strong enough
            const threshold = 50;
            let transform = '';
            
            if (bass > threshold) {
                const intensity = (bass - threshold) / (255 - threshold);
                const shakeX = (Math.random() - 0.5) * 2 * 5 * intensity;
                const shakeY = (Math.random() - 0.5) * 2 * 5 * intensity;
                const scale = 1 + (intensity * 0.03);
                transform = `translateX(${shakeX}px) translateY(${shakeY}px) scale(${scale})`;
            }

            elements.mainWrapper.style.transform = state.tiltTransform + ' ' + transform;
            state.animationId = requestAnimationFrame(this.analyze.bind(this));
        }
    };

    // Tilt Effect
    const tiltEffect = {
        init() {
            if (!elements.mainWrapper) return;
            
            elements.mainWrapper.addEventListener('mousemove', (e) => {
                const rect = elements.mainWrapper.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * -8;
                const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * 8;
                
                state.tiltTransform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                elements.mainWrapper.style.transform = state.tiltTransform;
            });

            elements.mainWrapper.addEventListener('mouseleave', () => {
                state.tiltTransform = 'perspective(1000px) rotateX(0) rotateY(0)';
                elements.mainWrapper.style.transform = state.tiltTransform;
            });
        }
    };

    // Entry Animation
    const entryAnimation = {
        init() {
            const entryScreen = document.getElementById('entryScreen');
            const enterBtn = document.getElementById('enterSiteBtn');
            const siteContent = document.getElementById('siteContent');

            if (!enterBtn) return;

            enterBtn.addEventListener('click', async () => {
                entryScreen.classList.add('fade-out');
                entryScreen.addEventListener('transitionend', async () => {
                    entryScreen.style.display = 'none';
                    siteContent.classList.add('active');
                    await audioSystem.play();
                }, { once: true });
            });
        }
    };

    // Initialize everything
    glitchEffect.start();
    audioSystem.init();
    tiltEffect.init();
    entryAnimation.init();
});
