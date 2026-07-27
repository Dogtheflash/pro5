/* ============================================================
   iOS 26 Loading Screen — Startup Chime Synthesizer (Web Audio API)
   ============================================================ */
'use strict';

export const CHORD_HZ = [46.25, 92.5, 185, 277.18, 369.99, 554.37, 739.99, 1108.73];
export const DURATION = 4.2;

let chimeCtx = null;
let chimeAnalyser = null;
let chimeData = null;
let chimeUnlocked = false;
let chimeActiveUntil = 0;

export function getChimeContext() {
  if (chimeCtx) return chimeCtx;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  try { chimeCtx = new Ctor(); return chimeCtx; } catch (e) { return null; }
}

export function createImpulseResponse(ctx, seconds) {
  const frames = Math.floor(ctx.sampleRate * seconds);
  const ir = ctx.createBuffer(2, frames, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = ir.getChannelData(ch);
    for (let i = 0; i < frames; i++) {
      const decay = Math.pow(1 - i / frames, 2.6);
      data[i] = (Math.random() * 2 - 1) * decay;
    }
  }
  return ir;
}

export function createSoftClipCurve() {
  const n = 1024;
  const curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1;
    curve[i] = Math.tanh(x * 1.6) / Math.tanh(1.6);
  }
  return curve;
}

export function chimePlay() {
  const ctx = getChimeContext();
  if (!ctx) return;
  ctx.resume();
  if (ctx.state !== 'running') return;

  const now = ctx.currentTime + 0.03;

  const master = ctx.createGain();
  master.gain.value = 0.92;

  const shaper = ctx.createWaveShaper();
  shaper.curve = createSoftClipCurve();
  shaper.oversample = '2x';

  const analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  analyser.smoothingTimeConstant = 0.72;
  chimeAnalyser = analyser;
  chimeData = new Uint8Array(analyser.frequencyBinCount);

  master.connect(shaper);
  shaper.connect(analyser);
  analyser.connect(ctx.destination);

  const convolver = ctx.createConvolver();
  convolver.buffer = createImpulseResponse(ctx, 2.6);
  const wet = ctx.createGain();
  wet.gain.value = 0.34;
  convolver.connect(wet);
  wet.connect(master);

  const dry = ctx.createGain();
  dry.gain.value = 0.78;
  const tone = ctx.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.setValueAtTime(1200, now);
  tone.frequency.exponentialRampToValueAtTime(6800, now + 0.7);
  tone.frequency.exponentialRampToValueAtTime(2600, now + DURATION);
  tone.Q.value = 0.6;
  dry.connect(tone);
  tone.connect(master);
  tone.connect(convolver);

  /* Sub-bass thump */
  const sub = ctx.createOscillator();
  const subGain = ctx.createGain();
  sub.type = 'sine';
  sub.frequency.setValueAtTime(110, now);
  sub.frequency.exponentialRampToValueAtTime(46.25, now + 0.5);
  subGain.gain.setValueAtTime(0.0001, now);
  subGain.gain.exponentialRampToValueAtTime(0.42, now + 0.03);
  subGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
  sub.connect(subGain);
  subGain.connect(master);
  sub.start(now);
  sub.stop(now + 1.9);

  /* Chord bloom */
  CHORD_HZ.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const pan = ctx.createStereoPanner();
    osc.type = i < 2 ? 'triangle' : 'sine';
    osc.frequency.value = freq;
    osc.detune.value = (i % 2 === 0 ? 1 : -1) * (2 + i * 1.4);
    pan.pan.value = (i % 2 === 0 ? -1 : 1) * Math.min(0.62, i * 0.11);
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

    if (i >= 4) {
      const shimmer = ctx.createOscillator();
      const shimmerGain = ctx.createGain();
      shimmer.type = 'sine';
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

  /* Noise strike */
  const frames = Math.floor(ctx.sampleRate * 0.2);
  const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / frames, 3);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.value = 1800;
  noiseFilter.Q.value = 0.8;
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.16, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(dry);
  noise.start(now);

  chimeUnlocked = true;
  chimeActiveUntil = now + DURATION + 1;
}

export function chimeGetLevel() {
  if (!chimeAnalyser || !chimeCtx || !chimeData) return 0;
  if (chimeCtx.currentTime > chimeActiveUntil) return 0;
  chimeAnalyser.getByteFrequencyData(chimeData);
  let sum = 0;
  const bins = Math.floor(chimeData.length * 0.6);
  for (let i = 0; i < bins; i++) sum += chimeData[i];
  return Math.min(1, sum / bins / 150);
}

export function unlockAudio() {
  function unlock() {
    const ctx = getChimeContext();
    if (!ctx) return;
    ctx.resume().then(() => { chimeUnlocked = ctx.state === 'running'; });
  }
  window.addEventListener('pointerdown', unlock);
  window.addEventListener('keydown', unlock);
}
