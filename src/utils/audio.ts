// Web Audio API Synthesizer for Classroom Wheel
// 100% self-contained: no external audio dependencies, safe and non-blocking

class ClassroomSoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  // Crisp mechanical tick when wheel needle strikes a pin
  playTick(velocity = 1.0) {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      const baseFreq = 540 + Math.random() * 60 + velocity * 100;
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.035);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      filter.Q.setValueAtTime(3, ctx.currentTime);

      const vol = Math.min(0.5, 0.15 + velocity * 0.2);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.045);
    } catch {
      // Audio is non-critical, fail silently
    }
  }

  // Triumphant victory fanfare when landing on winner
  playFanfare() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      // Joyful celebratory notes: C5, E5, G5, C6, E6
      const notes = [
        { f: 523.25, time: 0.0, dur: 0.14 },
        { f: 659.25, time: 0.12, dur: 0.14 },
        { f: 783.99, time: 0.24, dur: 0.16 },
        { f: 1046.50, time: 0.38, dur: 0.45 },
        { f: 1318.51, time: 0.62, dur: 0.75 },
      ];

      notes.forEach(({ f, time, dur }) => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, ctx.currentTime + time);

          gain.gain.setValueAtTime(0.001, ctx.currentTime + time);
          gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + time + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + dur);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(ctx.currentTime + time);
          osc.stop(ctx.currentTime + time + dur + 0.05);
        } catch {}
      });

      // Layered bells shimmer
      this.playShimmer(0.4);
    } catch {}
  }

  // Shimmering magic bell sound
  private playShimmer(delaySec: number) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const bells = [1200, 1500, 1800, 2400];
      bells.forEach((freq, i) => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + delaySec + i * 0.06);

          gain.gain.setValueAtTime(0.001, ctx.currentTime + delaySec + i * 0.06);
          gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + delaySec + i * 0.06 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delaySec + i * 0.06 + 0.35);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + delaySec + i * 0.06);
          osc.stop(ctx.currentTime + delaySec + i * 0.06 + 0.4);
        } catch {}
      });
    } catch {}
  }

  // Rewarding star sound
  playStarSound() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    } catch {}
  }

  // Button click / Pop sound
  playPop() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(840, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch {}
  }

  // Classic bugle race call "First Call / Call to the Post" before horse race
  playRaceHorn() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      // Bugle notes: G4 (392Hz), C5 (523Hz), E5 (659Hz), G5 (784Hz)
      const fanfare = [
        { f: 392.0, t: 0.0, d: 0.12 },
        { f: 523.25, t: 0.14, d: 0.12 },
        { f: 659.25, t: 0.28, d: 0.12 },
        { f: 783.99, t: 0.42, d: 0.35 },
        { f: 659.25, t: 0.78, d: 0.12 },
        { f: 783.99, t: 0.92, d: 0.45 },
      ];

      fanfare.forEach(({ f, t, d }) => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(f, ctx.currentTime + t);

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1600, ctx.currentTime + t);

          gain.gain.setValueAtTime(0.001, ctx.currentTime + t);
          gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + d);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(ctx.currentTime + t);
          osc.stop(ctx.currentTime + t + d + 0.05);
        } catch {}
      });
    } catch {}
  }

  // Hoofbeat gallop sound effect (two-tone clip-clop)
  playGallop() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const beat1 = ctx.currentTime;
      const beat2 = ctx.currentTime + 0.08;

      [beat1, beat2].forEach((time, idx) => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(idx === 0 ? 180 : 130, time);
          osc.frequency.exponentialRampToValueAtTime(60, time + 0.04);

          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(idx === 0 ? 450 : 320, time);
          filter.Q.setValueAtTime(4, time);

          gain.gain.setValueAtTime(0.18, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.045);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(time);
          osc.stop(time + 0.05);
        } catch {}
      });
    } catch {}
  }
}

export const soundEngine = new ClassroomSoundEngine();
