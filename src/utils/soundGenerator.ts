// Web Audio API generative ambient sound synthesizer
// Plays soothing ambient noise (Coffee Shop, Lofi Rain, Deep Drone, White Noise) client-side without external audio files.

class AmbientSoundEngine {
  private audioCtx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTrack: string = 'Coffee Shop';
  private masterGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private oscillatorNode: OscillatorNode | null = null;
  private volume: number = 0.5;

  private initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public play(track: string = 'Coffee Shop') {
    this.stop();
    this.initContext();
    if (!this.audioCtx || !this.masterGain) return;

    this.currentTrack = track;
    this.isPlaying = true;

    // Create 5 seconds buffer of stereo noise
    const bufferSize = this.audioCtx.sampleRate * 5;
    const buffer = this.audioCtx.createBuffer(2, bufferSize, this.audioCtx.sampleRate);
    const leftChannel = buffer.getChannelData(0);
    const rightChannel = buffer.getChannelData(1);

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      leftChannel[i] = white * 0.25;
      rightChannel[i] = (Math.random() * 2 - 1) * 0.25;
    }

    this.noiseNode = this.audioCtx.createBufferSource();
    this.noiseNode.buffer = buffer;
    this.noiseNode.loop = true;

    this.filterNode = this.audioCtx.createBiquadFilter();

    if (track === 'Coffee Shop') {
      this.filterNode.type = 'bandpass';
      this.filterNode.frequency.setValueAtTime(650, this.audioCtx.currentTime);
      this.filterNode.Q.setValueAtTime(0.8, this.audioCtx.currentTime);
    } else if (track === 'Lofi Rain') {
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(900, this.audioCtx.currentTime);
    } else if (track === 'Deep Drone') {
      this.oscillatorNode = this.audioCtx.createOscillator();
      this.oscillatorNode.type = 'sine';
      this.oscillatorNode.frequency.setValueAtTime(216, this.audioCtx.currentTime);
      const oscGain = this.audioCtx.createGain();
      oscGain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      this.oscillatorNode.connect(oscGain);
      oscGain.connect(this.masterGain);
      this.oscillatorNode.start();

      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(400, this.audioCtx.currentTime);
    } else {
      this.filterNode.type = 'bandpass';
      this.filterNode.frequency.setValueAtTime(1200, this.audioCtx.currentTime);
      this.filterNode.Q.setValueAtTime(0.5, this.audioCtx.currentTime);
    }

    this.noiseNode.connect(this.filterNode);
    this.filterNode.connect(this.masterGain);
    this.noiseNode.start();
  }

  public stop() {
    this.isPlaying = false;
    if (this.noiseNode) {
      try {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
      } catch {
        // Ignored
      }
      this.noiseNode = null;
    }
    if (this.oscillatorNode) {
      try {
        this.oscillatorNode.stop();
        this.oscillatorNode.disconnect();
      } catch {
        // Ignored
      }
      this.oscillatorNode = null;
    }
  }

  public toggle(track?: string): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play(track || this.currentTrack);
      return true;
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
    }
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      track: this.currentTrack,
      volume: this.volume,
    };
  }
}

export const ambientSound = new AmbientSoundEngine();
