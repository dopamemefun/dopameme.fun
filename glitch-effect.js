// glitch-effect.js - FINAL PERFECTED VERSION
const glitchTextElement = document.getElementById('glitchText');
const musicTrack = document.getElementById('musicTrack');
const playPauseBtn = document.getElementById('playPauseBtn');
const mainWrapper = document.querySelector('.main-content-wrapper');

// =============================================
// CORE STATE (with performance optimizations)
// =============================================
const state = {
  isPlaying: false,
  audioContext: null,
  analyser: null,
  animationId: null,
  currentTilt: '',
  currentBass: '',
  originalTitle: document.title,
  originalGlitchText: glitchTextElement.textContent
};

// =============================================
// FIXED GLITCH EFFECTS (only on "Dopameme")
// =============================================
function applyTextGlitch() {
  let glitched = '';
  const original = state.originalGlitchText;
  for (let i = 0; i < original.length; i++) {
    glitched += Math.random() < 0.3 ? 
      "01|/\\_[]{}"[Math.floor(Math.random() * 9)] : 
      original[i];
  }
  glitchTextElement.textContent = glitched;
}

function applyTitleGlitch() {
  let glitched = '';
  for (let i = 0; i < state.originalTitle.length; i++) {
    glitched += Math.random() < 0.2 ? 
      "01|_[]"[Math.floor(Math.random() * 5)] : 
      state.originalTitle[i];
  }
  document.title = glitched;
}

// Start glitch effects
const glitchInterval = setInterval(applyTextGlitch, 200);
const titleGlitchInterval = setInterval(applyTitleGlitch, 300);

// =============================================
// BUTTERY SMOOTH TILT EFFECT
// =============================================
let lastTiltUpdate = 0;
const tiltSmoothing = 0.2; // Lower = smoother

mainWrapper.addEventListener('mousemove', (e) => {
  const now = performance.now();
  if (now - lastTiltUpdate < 16) return; // Limit to ~60fps
  lastTiltUpdate = now;

  const rect = mainWrapper.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  // Smoother interpolation
  const targetRotateY = ((e.clientX - centerX) / (rect.width / 2)) * -8;
  const targetRotateX = ((e.clientY - centerY) / (rect.height / 2)) * 8;
  
  // Smoothing
  state.currentTilt = `perspective(1000px) 
    rotateX(${targetRotateX * tiltSmoothing}deg) 
    rotateY(${targetRotateY * tiltSmoothing}deg)`;
    
  applyCombinedEffects();
});

mainWrapper.addEventListener('mouseleave', () => {
  state.currentTilt = 'perspective(1000px) rotateX(0) rotateY(0)';
  applyCombinedEffects();
});

// =============================================
// PERFECTED BASS VISUALIZATION
// =============================================
function startBassAnalysis() {
  if (!state.analyser) return;
  
  const dataArray = new Uint8Array(state.analyser.frequencyBinCount);
  let lastBassUpdate = 0;

  function analyze() {
    const now = performance.now();
    if (now - lastBassUpdate < 50) { // Limit bass updates
      state.animationId = requestAnimationFrame(analyze);
      return;
    }
    lastBassUpdate = now;

    state.analyser.getByteFrequencyData(dataArray);
    
    // Calculate bass (low frequencies 0-100hz)
    let bass = 0;
    for (let i = 0; i < 5; i++) bass += dataArray[i];
    bass /= 5;

    // Apply effect only when bass is strong
    if (bass > 40) {
      const intensity = Math.min(bass / 255, 1);
      const shakeX = (Math.random() - 0.5) * 3 * intensity;
      const shakeY = (Math.random() - 0.5) * 3 * intensity;
      state.currentBass = `translate(${shakeX}px, ${shakeY}px)`;
    } else {
      state.currentBass = '';
    }

    applyCombinedEffects();
    state.animationId = requestAnimationFrame(analyze);
  }

  state.animationId = requestAnimationFrame(analyze);
}

// =============================================
// EFFECTS COMBINER (optimized rendering)
// =============================================
function applyCombinedEffects() {
  // Use will-change for optimized rendering
  mainWrapper.style.willChange = 'transform';
  mainWrapper.style.transform = `${state.currentTilt} ${state.currentBass}`;
  
  // Force synchronous layout update
  void mainWrapper.offsetHeight;
  
  // Reset will-change after animation frame
  requestAnimationFrame(() => {
    mainWrapper.style.willChange = 'auto';
  });
}

// =============================================
// BULLETPROOF PLAY/PAUSE BUTTON
// =============================================
playPauseBtn.addEventListener('click', async (e) => {
  e.stopPropagation();
  
  try {
    if (musicTrack.paused) {
      // Initialize audio context if needed
      if (!state.audioContext) {
        state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        state.analyser = state.audioContext.createAnalyser();
        state.analyser.fftSize = 256;
        const source = state.audioContext.createMediaElementSource(musicTrack);
        source.connect(state.analyser);
        state.analyser.connect(state.audioContext.destination);
      }
      
      // Handle suspended state
      if (state.audioContext.state === 'suspended') {
        await state.audioContext.resume();
      }
      
      await musicTrack.play();
      state.isPlaying = true;
      playPauseBtn.textContent = 'pause';
      startBassAnalysis();
    } else {
      musicTrack.pause();
      state.isPlaying = false;
      playPauseBtn.textContent = 'play_arrow';
      cancelAnimationFrame(state.animationId);
      state.animationId = null;
      state.currentBass = '';
      applyCombinedEffects();
    }
  } catch (err) {
    console.error("Playback error:", err);
    playPauseBtn.style.color = "#ff5555";
    setTimeout(() => playPauseBtn.style.color = "", 500);
  }
});

// =============================================
// INITIALIZATION
// =============================================
// Set initial volume
musicTrack.volume = 0.5;
document.getElementById('volumeBar').value = 0.5;

// Time display updates
musicTrack.addEventListener('timeupdate', () => {
  const current = document.getElementById('currentTime');
  const progress = document.getElementById('progressBarFill');
  current.textContent = formatTime(musicTrack.currentTime);
  progress.style.width = `${(musicTrack.currentTime / musicTrack.duration) * 100}%`;
});

// Format time helper
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

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
      playPauseBtn.textContent = 'pause';
      startBassAnalysis();
    } catch (err) {
      console.error("Autoplay failed:", err);
    }
  }, { once: t
