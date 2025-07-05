// glitch-effect.js - SYNCED EFFECTS VERSION
const glitchTextElement = document.getElementById('glitchText');
const musicTrack = document.getElementById('musicTrack');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const progressBarFill = document.getElementById('progressBarFill');
const currentTimeSpan = document.getElementById('currentTime');
const totalTimeSpan = document.getElementById('totalTime');
const volumeBar = document.getElementById('volumeBar');
const volumeIcon = document.getElementById('volumeIcon');
const mainWrapper = document.querySelector('.main-content-wrapper');

// ======================
// CORE STATE MANAGEMENT
// ======================
const state = {
  isPlaying: false,
  lastVolume: 0.5,
  audioContext: null,
  analyser: null,
  bassAnimationId: null,
  currentTilt: '',
  isInteracting: false
};

// ======================
// PLAY/PAUSE FIX (with pointer-events protection)
// ======================
playPauseBtn.addEventListener('click', async (e) => {
  // Prevent double-triggers from animations
  e.stopPropagation();
  
  try {
    if (musicTrack.paused) {
      // Initialize audio if needed
      if (!state.audioContext) {
        state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        state.analyser = state.audioContext.createAnalyser();
        state.analyser.fftSize = 256;
        const source = state.audioContext.createMediaElementSource(musicTrack);
        source.connect(state.analyser);
        state.analyser.connect(state.audioContext.destination);
      }
      
      // Resume if suspended (Chrome autoplay policy)
      if (state.audioContext.state === 'suspended') {
        await state.audioContext.resume();
      }
      
      await musicTrack.play();
      state.isPlaying = true;
      updatePlayPauseIcon();
      startBassVisualization();
    } else {
      musicTrack.pause();
      state.isPlaying = false;
      updatePlayPauseIcon();
      stopBassVisualization();
    }
  } catch (err) {
    console.error("Playback error:", err);
    playPauseBtn.style.color = "#ff5555";
    setTimeout(() => playPauseBtn.style.color = "", 500);
  }
});

// ======================
// TILT EFFECT (with click protection)
// ======================
mainWrapper.addEventListener('mousemove', (e) => {
  if (state.isInteracting) return;
  
  const rect = mainWrapper.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * -8;
  const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * 8;
  
  state.currentTilt = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  applyVisualEffects(); // Combines tilt + bass
});

mainWrapper.addEventListener('mouseleave', () => {
  state.currentTilt = 'perspective(1000px) rotateX(0) rotateY(0)';
  applyVisualEffects();
});

// ======================
// BASS VISUALIZATION (synced with tilt)
// ======================
let bassData = new Uint8Array(256);

function startBassVisualization() {
  if (!state.analyser || musicTrack.volume === 0) return;
  state.bassAnimationId = requestAnimationFrame(updateBassEffects);
}

function stopBassVisualization() {
  if (state.bassAnimationId) {
    cancelAnimationFrame(state.bassAnimationId);
    state.bassAnimationId = null;
  }
  applyVisualEffects(); // Apply without bass
}

function updateBassEffects() {
  state.analyser.getByteFrequencyData(bassData);
  
  // Calculate bass intensity (low frequencies)
  let bass = 0;
  for (let i = 0; i < 10; i++) bass += bassData[i];
  bass /= 10;

  // Only apply effects when bass is strong enough
  const threshold = 30;
  let bassEffect = '';
  
  if (bass > threshold) {
    const intensity = (bass - threshold) / (255 - threshold);
    const shakeX = (Math.random() - 0.5) * 2 * 4 * intensity;
    const shakeY = (Math.random() - 0.5) * 2 * 4 * intensity;
    bassEffect = `translate(${shakeX}px, ${shakeY}px)`;
  }

  // Store bass effect separately
  state.currentBass = bassEffect;
  applyVisualEffects();
  
  if (state.isPlaying) {
    state.bassAnimationId = requestAnimationFrame(updateBassEffects);
  }
}

// ======================
// EFFECTS APPLIER (combines tilt + bass safely)
// ======================
function applyVisualEffects() {
  // Use transform matrix to prevent interference
  mainWrapper.style.transform = `${state.currentTilt} ${state.currentBass || ''}`;
  
  // Temporarily disable pointer events during animations
  mainWrapper.style.pointerEvents = 'none';
  setTimeout(() => {
    mainWrapper.style.pointerEvents = 'auto';
  }, 50);
}

// ======================
// VOLUME & PROGRESS CONTROLS
// ======================
volumeBar.addEventListener('input', () => {
  const vol = parseFloat(volumeBar.value);
  musicTrack.volume = vol;
  state.lastVolume = vol > 0 ? vol : state.lastVolume;
  updateVolumeIcon();
  
  if (vol > 0 && state.isPlaying && !state.bassAnimationId) {
    startBassVisualization();
  } else if (vol === 0) {
    stopBassVisualization();
  }
});

progressBar.addEventListener('input', () => {
  musicTrack.currentTime = progressBar.value;
});

volumeIcon.addEventListener('click', () => {
  if (musicTrack.volume > 0) {
    musicTrack.volume = 0;
    volumeBar.value = 0;
    stopBassVisualization();
  } else {
    musicTrack.volume = state.lastVolume;
    volumeBar.value = state.lastVolume;
    if (state.isPlaying) startBassVisualization();
  }
  updateVolumeIcon();
});

// ======================
// HELPER FUNCTIONS
// ======================
function updatePlayPauseIcon() {
  playPauseBtn.textContent = musicTrack.paused ? 'play_arrow' : 'pause';
}

function updateVolumeIcon() {
  const vol = musicTrack.volume;
  volumeIcon.textContent = vol === 0 ? 'volume_off' : 
                         vol < 0.5 ? 'volume_down' : 'volume_up';
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ======================
// INITIALIZATION
// ======================
musicTrack.addEventListener('timeupdate', () => {
  currentTimeSpan.textContent = formatTime(musicTrack.currentTime);
  progressBarFill.style.width = `${(musicTrack.currentTime / musicTrack.duration) * 100}%`;
  progressBar.value = musicTrack.currentTime;
});

musicTrack.addEventListener('loadedmetadata', () => {
  totalTimeSpan.textContent = formatTime(musicTrack.duration);
  progressBar.max = musicTrack.duration;
  musicTrack.volume = state.lastVolume;
  volumeBar.value = state.lastVolume;
  updateVolumeIcon();
});

// Entry animation
document.getElementById('enterSiteBtn')?.addEventListener('click', async () => {
  const entryScreen = document.getElementById('entryScreen');
  entryScreen.classList.add('fade-out');
  entryScreen.addEventListener('transitionend', async () => {
    entryScreen.style.display = 'none';
    document.getElementById('siteContent').classList.add('active');
    try {
      await musicTrack.play();
      state.isPlaying = true;
      updatePlayPauseIcon();
      startBassVisualization();
    } catch (err) {
      console.error("Autoplay failed:", err);
    }
  }, { once: true });
});

// Start glitch effect
setInterval(() => {
  let glitched = '';
  const original = glitchTextElement.textContent;
  for (let i = 0; i < original.length; i++) {
    glitched += Math.random() < 0.4 ? 
      "01345789_=-+[]{}|"[Math.floor(Math.random() * 16)] : 
      original[i];
  }
  glitchTextElement.textContent = glitched;
}, 250);
