// Web Audio API Synthesizer - Realistic Paper Flip & Ambient Music Box

class SoundEffects {
  constructor() {
    this.ctx = null;
    this.bgmPlaying = false;
    this.bgmTimer = null;
  }

  init() {
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
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // White noise buffer for paper texture
      const bufferSize = this.ctx.sampleRate * 0.22;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      // Filter to simulate soft paper whoosh
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, now);
      filter.frequency.exponentialRampToValueAtTime(320, now + 0.22);
      filter.Q.setValueAtTime(2.2, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.22);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Soft celebratory sparkle chime
  playChime() {
    try {
      this.init();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.12, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.65);
      });
    } catch {}
  }

  // Soft romantic music box melody loop
  toggleBGM(onStateChange) {
    this.init();
    if (!this.ctx) return false;

    if (this.bgmPlaying) {
      this.stopBGM();
      if (onStateChange) onStateChange(false);
      return false;
    } else {
      this.startBGM();
      if (onStateChange) onStateChange(true);
      return true;
    }
  }

  startBGM() {
    this.bgmPlaying = true;
    // Sweet, romantic melody line (Cheri Cheri / celebration feel)
    const melody = [
      { note: 392.00, dur: 0.4 }, // G4
      { note: 440.00, dur: 0.4 }, // A4
      { note: 523.25, dur: 0.6 }, // C5
      { note: 587.33, dur: 0.4 }, // D5
      { note: 659.25, dur: 0.8 }, // E5
      { note: 587.33, dur: 0.4 }, // D5
      { note: 523.25, dur: 0.8 }, // C5
      { note: 440.00, dur: 0.4 }, // A4
      { note: 392.00, dur: 0.8 }, // G4
      { note: 523.25, dur: 0.8 }, // C5
      { note: 659.25, dur: 0.8 }, // E5
      { note: 783.99, dur: 1.2 }, // G5
    ];

    let noteIndex = 0;
    const playNextNote = () => {
      if (!this.bgmPlaying || !this.ctx) return;

      const item = melody[noteIndex % melody.length];
      const now = this.ctx.currentTime;

      // Celesta / Music Box chime oscillator
      const osc = this.ctx.createOscillator();
      const oscHarmonic = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(item.note, now);

      oscHarmonic.type = 'triangle';
      oscHarmonic.frequency.setValueAtTime(item.note * 2, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + item.dur * 1.5);

      osc.connect(gain);
      oscHarmonic.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      oscHarmonic.start(now);
      osc.stop(now + item.dur * 1.5);
      oscHarmonic.stop(now + item.dur * 1.5);

      noteIndex++;
      this.bgmTimer = setTimeout(playNextNote, item.dur * 850);
    };

    playNextNote();
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const soundManager = new SoundEffects();

