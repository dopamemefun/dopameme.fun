document.addEventListener('DOMContentLoaded', () => {
    const glitchText = document.getElementById('glitchText');
    const enterSiteBtn = document.getElementById('enterSiteBtn');
    const entryScreen = document.querySelector('.entry-screen');
    const siteContent = document.getElementById('siteContent'); // Changed from .site-content to #siteContent
    const mainContentWrapper = document.querySelector('.main-content-wrapper');

    // Audio Elements
    const musicTrack = document.getElementById('musicTrack');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playPauseIcon = document.getElementById('playPauseIcon');
    const progressBar = document.getElementById('progressBar');
    const progressBarFill = document.getElementById('progressBarFill');
    const currentTimeDisplay = document.getElementById('currentTime');
    const durationDisplay = document.getElementById('duration');
    const volumeBar = document.getElementById('volumeBar');
    const volumeIcon = document.getElementById('volumeIcon');

    // Web Audio API for Bass Effect
    let audioContext;
    let analyser;
    let source;
    let gainNode; // For master volume control

    const initAudioContext = () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            source = audioContext.createMediaElementSource(musicTrack);
            gainNode = audioContext.createGain(); // Create a GainNode for volume control

            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256; // Smaller FFT size for quicker bass detection
            
            // Connect the source -> analyser -> gainNode -> destination
            source.connect(analyser);
            analyser.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Set initial volume from the slider
            gainNode.gain.value = volumeBar.value;
        }
    };

    // Glitch effect for Dopameme text
    if (glitchText) {
        setInterval(() => {
            glitchText.textContent = 'DOPAMEME'; // Reset text
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*+=|;:,.?';
            let glitch = '';
            for (let i = 0; i < glitchText.textContent.length; i++) {
                if (Math.random() < 0.2) { // 20% chance to glitch a character
                    glitch += chars.charAt(Math.floor(Math.random() * chars.length));
                } else {
                    glitch += glitchText.textContent.charAt(i);
                }
            }
            glitchText.textContent = glitch;
        }, 100); // Glitch every 100ms
    }

    // "Click to Enter" button logic
    if (enterSiteBtn) {
        enterSiteBtn.addEventListener('click', () => {
            // 1. Play Music
            initAudioContext(); // Initialize audio context
            musicTrack.play();
            playPauseIcon.textContent = 'pause'; // Update icon to pause, even if hidden

            // 2. Fade out entry screen and fade in site content
            entryScreen.classList.add('fade-out');
            
            // Allow a brief moment for the fade-out to start before showing content
            setTimeout(() => {
                entryScreen.style.display = 'none'; // Completely hide entry screen
                siteContent.classList.add('active'); // Show and unblur site content
            }, 500); // Match this with your CSS transition duration
        });
    }

    // Play/Pause button logic
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (musicTrack.paused) {
                initAudioContext(); // Ensure context is running if paused for a long time
                musicTrack.play();
                playPauseIcon.textContent = 'pause';
            } else {
                musicTrack.pause();
                playPauseIcon.textContent = 'play_arrow';
            }
        });
    }

    // Update progress bar
    musicTrack.addEventListener('timeupdate', () => {
        const progress = (musicTrack.currentTime / musicTrack.duration) * 100;
        progressBarFill.style.width = `${progress}%`;
        currentTimeDisplay.textContent = formatTime(musicTrack.currentTime);
    });

    // Display total duration when metadata is loaded
    musicTrack.addEventListener('loadedmetadata', () => {
        durationDisplay.textContent = formatTime(musicTrack.duration);
        progressBar.max = musicTrack.duration; // Set max value for slider
    });

    // Seek functionality
    progressBar.addEventListener('input', () => {
        musicTrack.currentTime = progressBar.value;
    });

    // Volume control
    volumeBar.addEventListener('input', () => {
        const newVolume = parseFloat(volumeBar.value);
        if (gainNode) { // Only set gain if AudioContext is initialized
            gainNode.gain.value = newVolume;
        } else {
            // Fallback for direct HTMLMediaElement volume if AudioContext not yet active
            musicTrack.volume = newVolume; 
        }
        updateVolumeIcon(newVolume);
    });

    // Initial volume icon state
    if (volumeBar) {
        updateVolumeIcon(volumeBar.value);
    }
    
    // Mute/Unmute functionality (optional, but good for UX)
    if (volumeIcon) {
        let lastVolume = volumeBar ? volumeBar.value : 1; // Store last non-zero volume
        volumeIcon.addEventListener('click', () => {
            if (gainNode && gainNode.gain.value > 0 || musicTrack.volume > 0) { // If currently not muted
                lastVolume = gainNode ? gainNode.gain.value : musicTrack.volume;
                if (gainNode) gainNode.gain.value = 0;
                musicTrack.volume = 0; // Fallback
                if (volumeBar) volumeBar.value = 0;
                updateVolumeIcon(0);
            } else { // If currently muted
                const targetVolume = lastVolume > 0 ? lastVolume : 0.5; // Default to 0.5 if lastVolume was 0
                if (gainNode) gainNode.gain.value = targetVolume;
                musicTrack.volume = targetVolume; // Fallback
                if (volumeBar) volumeBar.value = targetVolume;
                updateVolumeIcon(targetVolume);
            }
        });
    }

    function updateVolumeIcon(volume) {
        if (!volumeIcon) return;
        if (volume == 0) {
            volumeIcon.textContent = 'volume_off';
        } else if (volume < 0.5) {
            volumeIcon.textContent = 'volume_down';
        } else {
            volumeIcon.textContent = 'volume_up';
        }
    }


    // Format time for display (e.g., 0:00)
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // 3D Tilt Effect
    if (mainContentWrapper) {
        document.addEventListener('mousemove', (e) => {
            const rect = mainContentWrapper.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const rotateX = (e.clientY - centerY) / 50; // Invert for natural feel
            const rotateY = (centerX - e.clientX) / 50; // Invert for natural feel

            mainContentWrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        // Reset tilt when mouse leaves
        mainContentWrapper.addEventListener('mouseleave', () => {
            mainContentWrapper.style.transform = `rotateX(0deg) rotateY(0deg)`;
        });
    }

    // Bass-driven scaling effect
    const applyBassEffect = () => {
        if (!analyser || !mainContentWrapper) return;

        const bufferLength = analyser.frequencyBinData.length;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        // Get average bass frequency (adjust band range as needed)
        let bassSum = 0;
        const bassStart = 0; // Lower frequencies
        const bassEnd = 10;  // Up to around 10-20 will capture bass well
        for (let i = bassStart; i < bassEnd; i++) {
            bassSum += dataArray[i];
        }
        const bassAverage = bassSum / (bassEnd - bassStart);

        // Normalize bassAverage to a 0-1 range based on expected max (e.g., 255 for 8-bit data)
        const normalizedBass = bassAverage / 255; 

        // Map normalized bass to a scale factor. Smallest scale (no bass) to largest (max bass)
        // Adjust these values to control the intensity of the wobble
        const minScale = 1;      // Base scale
        const maxScale = 1.03;   // Max scale on strong bass hits
        const scale = minScale + (maxScale - minScale) * normalizedBass;
        
        // Apply the scale transformation. We combine it with the existing tilt
        // We read the current transform to preserve tilt
        const currentTransform = mainContentWrapper.style.transform;
        
        // This is a simplified way. A more robust solution would parse the matrix
        // For simple rotateX/rotateY, we can just append the scale.
        // If your transform gets more complex, consider using a transform-origin for scale or parsing the matrix
        mainContentWrapper.style.transform = `${currentTransform} scale(${scale})`;

        requestAnimationFrame(applyBassEffect);
    };

    // Start the bass effect loop when audio is playing
    musicTrack.addEventListener('play', () => {
        // Ensure AudioContext is running
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
        applyBassEffect();
    });

    // You might want to stop or pause the bass effect loop when audio is paused
    musicTrack.addEventListener('pause', () => {
        // No explicit stop needed for requestAnimationFrame, it just won't be re-requested
        // if play() isn't called again.
    });
});
