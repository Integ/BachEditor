class AudioEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeOscillators: Map<string, OscillatorNode[]> = new Map();
  private marioNoteIndex: number = 0;

  private readonly marioMelody: number[] = [
    329.63,
    329.63,
    392.00,
    392.00,
    440.00,
    440.00,
    392.00,
    349.23,
    349.23,
    329.63,
    329.63,
    293.66,
    293.66,
    261.63,
    392.00,
    392.00,
    349.23,
    349.23,
    329.63,
    329.63,
    261.63,
    261.63,
    293.66,
    261.63,
    392.00,
    349.23,
    440.00,
    440.00,
    392.00,
    349.23,
    349.23,
    329.63,
    329.63,
    261.63,
    261.63,
    293.66,
    261.63,
    523.25,
    523.25,
    493.88,
    493.88,
    440.00,
    440.00,
    392.00,
  ];

  constructor() {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new AudioContext();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.3;
    }
  }

  private async ensureContext(): Promise<AudioContext | null> {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      if (typeof window !== 'undefined' && 'AudioContext' in window) {
        this.audioContext = new AudioContext();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.connect(this.audioContext.destination);
        this.masterGain.gain.value = 0.3;
      } else {
        return null;
      }
    }

    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    return this.audioContext;
  }

  async initialize(): Promise<void> {
    await this.ensureContext();
  }

  async playNote(frequency: number, duration: number = 0.3, type: OscillatorType = 'sine') {
    const ctx = await this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);

    const key = `${frequency}-${type}`;
    if (!this.activeOscillators.has(key)) {
      this.activeOscillators.set(key, []);
    }
    this.activeOscillators.get(key)!.push(oscillator);

    setTimeout(() => {
      const oscillators = this.activeOscillators.get(key);
      if (oscillators) {
        const index = oscillators.indexOf(oscillator);
        if (index > -1) {
          oscillators.splice(index, 1);
        }
      }
    }, duration * 1000);
  }

  async playChord(frequencies: number[], duration: number = 0.5) {
    frequencies.forEach(freq => {
      this.playNote(freq, duration);
    });
  }

  playPentatonic(keyIndex: number) {
    const pentatonicScale = [
      261.63,
      293.66,
      329.63,
      392.00,
      440.00,
      523.25,
      587.33,
      659.25,
      783.99,
      880.00
    ];

    const index = keyIndex % pentatonicScale.length;
    const frequency = pentatonicScale[index];
    
    this.playNote(frequency, 0.25, 'sine');
  }

  async playMarimba() {
    const frequency = this.marioMelody[this.marioNoteIndex % this.marioMelody.length];
    this.marioNoteIndex++;

    const ctx = await this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(frequency * 4, ctx.currentTime);
    filter.Q.setValueAtTime(2, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  }

  playTypingTone(charCode: number) {
    const tones = [261.63, 293.66, 329.63, 349.23, 392.00];
    const index = charCode % tones.length;
    const frequency = tones[index];
    
    this.playNote(frequency, 0.15, 'triangle');
  }

  async playSpaceTone() {
    const frequency = this.marioMelody[this.marioNoteIndex % this.marioMelody.length];
    this.marioNoteIndex++;

    this.playChord([frequency, frequency * 1.5], 0.3);
  }

  setVolume(value: number) {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, value)), this.audioContext!.currentTime);
    }
  }

  getVolume(): number {
    return this.masterGain ? this.masterGain.gain.value : 0;
  }

  cleanup() {
    this.activeOscillators.forEach(oscillators => {
      oscillators.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
        }
      });
    });
    this.activeOscillators.clear();
  }
}

export const audioEngine = new AudioEngine();
