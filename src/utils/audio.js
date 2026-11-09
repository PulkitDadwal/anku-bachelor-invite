// Audio Manager - Plays background MP3 track with autoplay + paper flip & chime effects

class SoundEffects {
  constructor() {
    this.ctx = null;
    this.bgm = null;
    this.bgmPlaying = false;
    this.userMuted = false; // Tracks if the user intentionally turned off the music
    this.subscribers = new Set();
    this.autoplayRegistered = false;

    // Initialize HTML5 Audio element for background music
    if (typeof window !== 'undefined') {
      this.initBGM();
    }
  }

  initBGM() {
    if (this.bgm) return;
    try {
      this.bgm = new Audio('/bgm.mp3');
      this.bgm.loop = true;
      this.bgm.volume = 0.65;
      this.bgm.preload = 'auto';

      this.bgm.addEventListener('play', () => {
        this.bgmPlaying = true;
        this.notifySubscribers(true);
      });

      this.bgm.addEventListener('pause', () => {
        this.bgmPlaying = false;
        this.notifySubscribers(false);
      });

      this.bgm.addEventListener('ended', () => {
        this.bgmPlaying = false;
        this.notifySubscribers(false);
      });
    } catch (e) {
      console.warn('Audio init warning:', e);
    }
  }

  notifySubscribers(isPlaying) {
    this.subscribers.forEach((cb) => {
      try {
        cb(isPlaying);
      } catch {}
    });
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    callback(this.bgmPlaying);
    return () => this.subscribers.delete(callback);
  }

  // Web Audio Context for sound effects
  initAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Realistic paper turn / rustle sound
  playPageTurn() {
    try {
      this.initAudioContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.22;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, now);
      filter.frequency.exponentialRampToValueAtTime(320, now + 0.22);
      filter.Q.setValueAtTime(2.2, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.22);
    } catch {}
  }

  // Soft celebratory chime
  playChime() {
    try {
      this.initAudioContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.1, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.55);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.6);
      });
    } catch {}
  }

  // Crisp wax seal crack & paper slide whoosh
  playUnsealSound() {
    try {
      this.initAudioContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Wax "crack / pop"
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);

      // 2. Paper slide rustle
      setTimeout(() => {
        this.playPageTurn();
      }, 70);

      // 3. Celebratory chime
      setTimeout(() => {
        this.playChime();
      }, 240);
    } catch {}
  }

  // Silky fabric unravelling rustle sound
  playSilkSound() {
    try {
      this.initAudioContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const bufferSize = this.ctx.sampleRate * 0.35;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(280, now + 0.35);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.16, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.36);
    } catch {}
  }

  // Play background music track (respects userMuted unless force = true)
  startBGM(force = false) {
    if (this.userMuted && !force) {
      return Promise.resolve(false);
    }

    this.initBGM();
    if (!this.bgm) return Promise.resolve(false);

    const playPromise = this.bgm.play();
    if (playPromise !== undefined) {
      return playPromise
        .then(() => {
          this.bgmPlaying = true;
          this.notifySubscribers(true);
          return true;
        })
        .catch(() => {
          this.bgmPlaying = false;
          this.notifySubscribers(false);
          return false;
        });
    }
    return Promise.resolve(false);
  }

  // Pause background music
  stopBGM(userInitiated = false) {
    if (userInitiated) {
      this.userMuted = true;
    }
    if (this.bgm) {
      this.bgm.pause();
      this.bgmPlaying = false;
      this.notifySubscribers(false);
    }
  }

  // Toggle background music
  toggleBGM(onStateChange) {
    if (this.bgmPlaying) {
      // User explicitly turned off the music
      this.stopBGM(true);
      if (onStateChange) onStateChange(false);
      return false;
    } else {
      // User explicitly turned on the music
      this.userMuted = false;
      this.startBGM(true).then((playing) => {
        if (onStateChange) onStateChange(playing);
      });
      return true;
    }
  }

  // Setup automatic playback on initial site open
  setupAutoplay(onPlayCallback) {
    this.initBGM();

    // Do not autoplay if user has already explicitly muted
    if (this.userMuted) return;

    // 1. Try immediate autoplay
    this.startBGM(false).then((started) => {
      if (started) {
        if (onPlayCallback) onPlayCallback(true);
      } else {
        // 2. Fall back to first user interaction
        if (this.autoplayRegistered) return;
        this.autoplayRegistered = true;

        const unlockAudio = () => {
          if (!this.userMuted && !this.bgmPlaying) {
            this.startBGM(false).then((success) => {
              if (success && onPlayCallback) {
                onPlayCallback(true);
              }
            });
          }
          window.removeEventListener('click', unlockAudio, true);
          window.removeEventListener('touchstart', unlockAudio, true);
          window.removeEventListener('keydown', unlockAudio, true);
          window.removeEventListener('scroll', unlockAudio, true);
        };

        window.addEventListener('click', unlockAudio, true);
        window.addEventListener('touchstart', unlockAudio, true);
        window.addEventListener('keydown', unlockAudio, true);
        window.addEventListener('scroll', unlockAudio, true);
      }
    });
  }
}

export const soundManager = new SoundEffects();
