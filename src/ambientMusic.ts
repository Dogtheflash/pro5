/* Ambient Music Helper for Asia Grand Tour */

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isMuted = false;
let isStarted = false;

export function startMusic() {
  if (isStarted) return;
  isStarted = true;
  try {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    audioContext = new Ctor();
    masterGain = audioContext.createGain();
    masterGain.gain.setValueAtTime(isMuted ? 0 : 0.08, audioContext.currentTime);
    masterGain.connect(audioContext.destination);

    // Soft ambient synth pad chime
    const frequencies = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    frequencies.forEach((freq, idx) => {
      if (!audioContext || !masterGain) return;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioContext.currentTime);
      gain.gain.setValueAtTime(0.015, audioContext.currentTime);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(audioContext.currentTime + idx * 0.2);
    });
  } catch (e) {
    console.warn('Ambient music initialization skipped:', e);
  }
}

export function setMuted(muted: boolean) {
  isMuted = muted;
  if (masterGain && audioContext) {
    masterGain.gain.setValueAtTime(muted ? 0 : 0.08, audioContext.currentTime);
  }
}
