import { useCallback, useEffect, useMemo, useRef } from "react";

/**
 * F#2 major voicing — the classic Apple startup chime.
 * Ordered low → high so the bloom can arpeggiate upward.
 */
const CHORD_HZ: readonly number[] = [
  46.25, 92.5, 185, 277.18, 369.99, 554.37, 739.99, 1108.73,
];

const DURATION = 4.2;

export type ChimeApi = {
  /** Plays the startup chime. Safe to call repeatedly. */
  play: () => void;
  /** Whether audio is currently allowed to run. */
  isUnlocked: () => boolean;
  /**
   * Current loudness of the chime, 0..1. Reads live from the analyser so
   * visuals can react to the actual waveform rather than a fake timeline.
   */
  getLevel: () => number;
};

/** Builds a short exponential-decay stereo impulse response for the reverb bus. */
function createImpulseResponse(ctx: AudioContext, seconds: number): AudioBuffer {
  const frames = Math.floor(ctx.sampleRate * seconds);
  const ir = ctx.createBuffer(2, frames, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel += 1) {
    const data = ir.getChannelData(channel);
    for (let i = 0; i < frames; i += 1) {
      const decay = (1 - i / frames) ** 2.6;
      data[i] = (Math.random() * 2 - 1) * decay;
    }
  }
  return ir;
}

/** Gentle saturation curve — glues the partials together like an analog bus. */
function createSoftClipCurve(): Float32Array<ArrayBuffer> {
  const n = 1024;
  const curve = new Float32Array(new ArrayBuffer(n * 4));
  for (let i = 0; i < n; i += 1) {
    const x = (i / (n - 1)) * 2 - 1;
    curve[i] = Math.tanh(x * 1.6) / Math.tanh(1.6);
  }
  return curve;
}

/**
 * Synthesizes an Apple-style startup chime with the Web Audio API:
 * sub-bass thump, upward-arpeggiated chord bloom, stereo-spread partials,
 * shimmer octave, convolution reverb tail and a soft-clipped master bus.
 * The context unlocks on the first user gesture, as browsers require.
 */
export function useStartupChime(): ChimeApi {
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const unlockedRef = useRef<boolean>(false);
  const activeUntilRef = useRef<number>(0);

  const getContext = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;
    if (ctxRef.current) return ctxRef.current;
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    try {
      ctxRef.current = new Ctor();
      return ctxRef.current;
    } catch {
      return null;
    }
  }, []);

  // Unlock audio on the first interaction anywhere on the page.
  useEffect(() => {
    const unlock = () => {
      const ctx = getContext();
      if (!ctx) return;
      void ctx.resume().then(() => {
        unlockedRef.current = ctx.state === "running";
      });
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [getContext]);

  useEffect(
    () => () => {
      void ctxRef.current?.close();
      ctxRef.current = null;
      analyserRef.current = null;
    },
    [],
  );

  const play = useCallback(() => {
    const ctx = getContext();
    if (!ctx) return;
    void ctx.resume();
    if (ctx.state !== "running") return;

    const now = ctx.currentTime + 0.03;

    // ---- Master chain: soft clip → analyser → out -------------------------
    const master = ctx.createGain();
    master.gain.value = 0.92;

    const shaper = ctx.createWaveShaper();
    shaper.curve = createSoftClipCurve();
    shaper.oversample = "2x";

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.72;
    analyserRef.current = analyser;
    dataRef.current = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));

    master.connect(shaper);
    shaper.connect(analyser);
    analyser.connect(ctx.destination);

    // ---- Reverb send ------------------------------------------------------
    const convolver = ctx.createConvolver();
    convolver.buffer = createImpulseResponse(ctx, 2.6);
    const wet = ctx.createGain();
    wet.gain.value = 0.34;
    convolver.connect(wet);
    wet.connect(master);

    // Dry bus with a bright-but-not-harsh top end.
    const dry = ctx.createGain();
    dry.gain.value = 0.78;
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.setValueAtTime(1200, now);
    // Filter opens as the chord blooms — the signature "swell".
    tone.frequency.exponentialRampToValueAtTime(6800, now + 0.7);
    tone.frequency.exponentialRampToValueAtTime(2600, now + DURATION);
    tone.Q.value = 0.6;

    dry.connect(tone);
    tone.connect(master);
    tone.connect(convolver);

    // ---- Sub-bass thump: the physical "chest" of the chime ----------------
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = "sine";
    sub.frequency.setValueAtTime(110, now);
    sub.frequency.exponentialRampToValueAtTime(46.25, now + 0.5);
    subGain.gain.setValueAtTime(0.0001, now);
    subGain.gain.exponentialRampToValueAtTime(0.42, now + 0.03);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
    sub.connect(subGain);
    subGain.connect(master);
    sub.start(now);
    sub.stop(now + 1.9);

    // ---- Chord bloom: partials arrive bottom-up, spread across stereo -----
    CHORD_HZ.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const pan = ctx.createStereoPanner();

      osc.type = i < 2 ? "triangle" : "sine";
      osc.frequency.value = freq;
      // Slight detune per partial keeps the chord alive rather than sterile.
      osc.detune.value = (i % 2 === 0 ? 1 : -1) * (2 + i * 1.4);
      // Alternate left/right, widening toward the top of the voicing.
      pan.pan.value = (i % 2 === 0 ? -1 : 1) * Math.min(0.62, i * 0.11);

      // Upward arpeggio: ~26ms between partials reads as one struck chord.
      const start = now + i * 0.026;
      const peak = 0.3 / (1 + i * 0.42);
      const attack = 0.014 + i * 0.008;

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(peak, start + attack);
      gain.gain.exponentialRampToValueAtTime(peak * 0.46, start + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + DURATION);

      osc.connect(gain);
      gain.connect(pan);
      pan.connect(dry);
      osc.start(start);
      osc.stop(start + DURATION + 0.05);

      // Shimmer: a quiet octave above that fades in late for sparkle.
      if (i >= 4) {
        const shimmer = ctx.createOscillator();
        const shimmerGain = ctx.createGain();
        shimmer.type = "sine";
        shimmer.frequency.value = freq * 2;
        shimmer.detune.value = 6;
        shimmerGain.gain.setValueAtTime(0.0001, start);
        shimmerGain.gain.exponentialRampToValueAtTime(0.035, start + 0.5);
        shimmerGain.gain.exponentialRampToValueAtTime(0.0001, start + DURATION);
        shimmer.connect(shimmerGain);
        shimmerGain.connect(convolver);
        shimmer.start(start);
        shimmer.stop(start + DURATION);
      }
    });

    // ---- Percussive noise strike -----------------------------------------
    const frames = Math.floor(ctx.sampleRate * 0.2);
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / frames) ** 3;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 1800;
    noiseFilter.Q.value = 0.8;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.16, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(dry);
    noise.start(now);

    unlockedRef.current = true;
    activeUntilRef.current = now + DURATION + 1;
  }, [getContext]);

  const isUnlocked = useCallback(() => unlockedRef.current, []);

  const getLevel = useCallback((): number => {
    const analyser = analyserRef.current;
    const ctx = ctxRef.current;
    const data = dataRef.current;
    if (!analyser || !ctx || !data) return 0;
    if (ctx.currentTime > activeUntilRef.current) return 0;

    analyser.getByteFrequencyData(data);
    let sum = 0;
    // Weight the low/mid bins — that is where the chord energy lives.
    const bins = Math.floor(data.length * 0.6);
    for (let i = 0; i < bins; i += 1) sum += data[i];
    return Math.min(1, sum / bins / 150);
  }, []);

  return useMemo<ChimeApi>(
    () => ({ play, isUnlocked, getLevel }),
    [play, isUnlocked, getLevel],
  );
}
