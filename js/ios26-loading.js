/* ============================================================
   iOS 26 Loading Screen — Standalone Module
   ============================================================ */
'use strict';

export const CHIME_MS = 4200;
export const AURORA_HEX = '#f0399c';
export const MOOD = 'vapor';

export const BOOT_LINES = [
  'Preparing iOS 26\u2026',
  'Mounting Liquid Glass\u2026',
  'Calibrating Taptic Engine\u2026',
  'Restoring your Apple ID\u2026',
  'Almost there\u2026',
];

export const NAME = 'T\xFA Xinh Trai';
export const STEP = 62;
export const LEAD = 620;
export const ENTER_MS = 900;

export function hexToHsl(hex) {
  var clean = hex.replace('#', '');
  var full = clean.length === 3 ? clean.split('').map(function (c) { return c + c; }).join('') : clean;
  var r = parseInt(full.slice(0, 2), 16) / 255;
  var g = parseInt(full.slice(2, 4), 16) / 255;
  var b = parseInt(full.slice(4, 6), 16) / 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var delta = max - min;
  var l = (max + min) / 2;
  if (delta === 0) return { h: 0, s: 0, l: l };
  var s = delta / (1 - Math.abs(2 * l - 1));
  var h;
  if (max === r) h = ((g - b) / delta) % 6;
  else if (max === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  return { h: (h * 60 + 360) % 360, s: s, l: l };
}

export function hexToHue(hex) { return Math.round(hexToHsl(hex).h); }

export function hsla(hsl, alpha) {
  var sat = Math.round(Math.min(1, Math.max(0.35, hsl.s)) * 100);
  var light = Math.round(Math.min(0.72, Math.max(0.42, hsl.l)) * 100);
  return 'hsla(' + Math.round((hsl.h + 360) % 360) + ', ' + sat + '%, ' + light + '%, ' + alpha + ')';
}

export function buildAuroraColors(hex) {
  var base = hexToHsl(hex);
  return [
    hsla(base, 0.5),
    hsla({ h: base.h + 42, s: base.s, l: base.l * 1.05 }, 0.45),
    hsla({ h: base.h - 36, s: base.s, l: base.l * 0.95 }, 0.4),
    hsla({ h: base.h + 84, s: base.s, l: base.l }, 0.32),
  ];
}

export const AURORA_HUE = hexToHue(AURORA_HEX);

export function applyAuroraVars() {
  var colors = buildAuroraColors(AURORA_HEX);
  var app = document.getElementById('app');
  if (!app) return;
  app.style.setProperty('--aurora-1', colors[0]);
  app.style.setProperty('--aurora-2', colors[1]);
  app.style.setProperty('--aurora-3', colors[2]);
  app.style.setProperty('--aurora-4', colors[3]);
}

export var VIBRATION_MS = { light: 8, medium: 16, heavy: 30 };
export var SETTLE_PATTERN = [14, 90, 22];

export function vibrate(pattern) {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
  try { navigator.vibrate(pattern); } catch (e) {}
}
export function hapticTap(strength) { vibrate(VIBRATION_MS[strength || 'light']); }
export function hapticSettle() { vibrate(SETTLE_PATTERN.slice()); }

export var parallax = { x: 0, y: 0 };
export function initParallax() {
  var targetX = 0, targetY = 0, currentX = 0, currentY = 0;
  var raf = 0;
  var bgLayer = document.getElementById('bg-layer');

  function onMove(e) {
    targetX = (e.clientX / window.innerWidth) * 2 - 1;
    targetY = (e.clientY / window.innerHeight) * 2 - 1;
  }
  function onOrientation(e) {
    var gamma = e.gamma || 0;
    var beta = e.beta || 0;
    targetX = Math.max(-1, Math.min(1, gamma / 35));
    targetY = Math.max(-1, Math.min(1, (beta - 45) / 35));
  }
  function loop() {
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;
    parallax.x = currentX;
    parallax.y = currentY;
    if (bgLayer) {
      bgLayer.style.transform = 'translate3d(' + (currentX * -26) + 'px, ' + (currentY * -26) + 'px, 0) scale(1.08)';
    }
    var bootEl = document.getElementById('stage-boot');
    if (bootEl && bootEl.style.display !== 'none') {
      bootEl.style.transform = 'translate3d(' + (currentX * 14) + 'px, ' + (currentY * 14) + 'px, 0)';
    }
    raf = requestAnimationFrame(loop);
  }
  window.addEventListener('pointermove', onMove);
  window.addEventListener('deviceorientation', onOrientation);
  raf = requestAnimationFrame(loop);
}

export var CHORD_HZ = [46.25, 92.5, 185, 277.18, 369.99, 554.37, 739.99, 1108.73];
export var DURATION = 4.2;

var chimeCtx = null;
var chimeAnalyser = null;
var chimeData = null;
var chimeUnlocked = false;
var chimeActiveUntil = 0;

export function getChimeContext() {
  if (chimeCtx) return chimeCtx;
  var Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  try { chimeCtx = new Ctor(); return chimeCtx; } catch (e) { return null; }
}

export function createImpulseResponse(ctx, seconds) {
  var frames = Math.floor(ctx.sampleRate * seconds);
  var ir = ctx.createBuffer(2, frames, ctx.sampleRate);
  for (var ch = 0; ch < 2; ch++) {
    var data = ir.getChannelData(ch);
    for (var i = 0; i < frames; i++) {
      var decay = Math.pow(1 - i / frames, 2.6);
      data[i] = (Math.random() * 2 - 1) * decay;
    }
  }
  return ir;
}

export function createSoftClipCurve() {
  var n = 1024;
  var curve = new Float32Array(n);
  for (var i = 0; i < n; i++) {
    var x = (i / (n - 1)) * 2 - 1;
    curve[i] = Math.tanh(x * 1.6) / Math.tanh(1.6);
  }
  return curve;
}

export function chimePlay() {
  var ctx = getChimeContext();
  if (!ctx) return;
  ctx.resume();
  if (ctx.state !== 'running') return;

  var now = ctx.currentTime + 0.03;

  var master = ctx.createGain();
  master.gain.value = 0.92;

  var shaper = ctx.createWaveShaper();
  shaper.curve = createSoftClipCurve();
  shaper.oversample = '2x';

  var analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  analyser.smoothingTimeConstant = 0.72;
  chimeAnalyser = analyser;
  chimeData = new Uint8Array(analyser.frequencyBinCount);

  master.connect(shaper);
  shaper.connect(analyser);
  analyser.connect(ctx.destination);

  var convolver = ctx.createConvolver();
  convolver.buffer = createImpulseResponse(ctx, 2.6);
  var wet = ctx.createGain();
  wet.gain.value = 0.34;
  convolver.connect(wet);
  wet.connect(master);

  var dry = ctx.createGain();
  dry.gain.value = 0.78;
  var tone = ctx.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.setValueAtTime(1200, now);
  tone.frequency.exponentialRampToValueAtTime(6800, now + 0.7);
  tone.frequency.exponentialRampToValueAtTime(2600, now + DURATION);
  tone.Q.value = 0.6;
  dry.connect(tone);
  tone.connect(master);
  tone.connect(convolver);

  var sub = ctx.createOscillator();
  var subGain = ctx.createGain();
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

  CHORD_HZ.forEach(function (freq, i) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    var pan = ctx.createStereoPanner();
    osc.type = i < 2 ? 'triangle' : 'sine';
    osc.frequency.value = freq;
    osc.detune.value = (i % 2 === 0 ? 1 : -1) * (2 + i * 1.4);
    pan.pan.value = (i % 2 === 0 ? -1 : 1) * Math.min(0.62, i * 0.11);
    var start = now + i * 0.026;
    var peak = 0.3 / (1 + i * 0.42);
    var attack = 0.014 + i * 0.008;
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
      var shimmer = ctx.createOscillator();
      var shimmerGain = ctx.createGain();
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

  var frames = Math.floor(ctx.sampleRate * 0.2);
  var buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
  var data = buffer.getChannelData(0);
  for (var i = 0; i < frames; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / frames, 3);
  }
  var noise = ctx.createBufferSource();
  noise.buffer = buffer;
  var noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.value = 1800;
  noiseFilter.Q.value = 0.8;
  var noiseGain = ctx.createGain();
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
  var sum = 0;
  var bins = Math.floor(chimeData.length * 0.6);
  for (var i = 0; i < bins; i++) sum += chimeData[i];
  return Math.min(1, sum / bins / 150);
}

export function unlockAudio() {
  function unlock() {
    var ctx = getChimeContext();
    if (!ctx) return;
    ctx.resume().then(function () { chimeUnlocked = ctx.state === 'running'; });
  }
  window.addEventListener('pointerdown', unlock);
  window.addEventListener('keydown', unlock);
}

var SPRITE_SIZE = 64;
var HUE_STEP = 15;
var VAPOR_CFG = { density: 0.6, size: 2.3, rise: -0.34, sway: 0.5, spread: 150, bloom: 10, trail: 0, flicker: 0.4 };

export function buildSprites(coreRatio) {
  var sprites = [];
  var half = SPRITE_SIZE / 2;
  for (var hue = 0; hue < 360; hue += HUE_STEP) {
    var sprite = document.createElement('canvas');
    sprite.width = SPRITE_SIZE;
    sprite.height = SPRITE_SIZE;
    var sctx = sprite.getContext('2d');
    if (!sctx) continue;
    var grad = sctx.createRadialGradient(half, half, 0, half, half, half);
    grad.addColorStop(0, 'hsla(' + hue + ', 95%, 82%, 0.66)');
    grad.addColorStop(1, 'hsla(' + hue + ', 95%, 70%, 0)');
    sctx.fillStyle = grad;
    sctx.beginPath();
    sctx.arc(half, half, half, 0, Math.PI * 2);
    sctx.fill();
    sctx.fillStyle = '#ffffff';
    sctx.beginPath();
    sctx.arc(half, half, Math.max(0.5, half * coreRatio), 0, Math.PI * 2);
    sctx.fill();
    sprites.push(sprite);
  }
  return sprites;
}

export var particleState = {
  speed: 1,
  energy: 0.25,
  hue: AURORA_HUE,
  particles: [],
  sprites: [],
  raf: 0,
  w: 0, h: 0,
  dpr: 1.5,
};

export function initParticles() {
  var canvas = document.getElementById('particles');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var cfg = VAPOR_CFG;
  var count = 90;
  var total = Math.max(12, Math.round(count * cfg.density));
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  particleState.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  particleState.sprites = buildSprites(0.5 / cfg.bloom);

  function resize() {
    particleState.w = window.innerWidth;
    particleState.h = window.innerHeight;
    canvas.width = Math.floor(particleState.w * particleState.dpr);
    canvas.height = Math.floor(particleState.h * particleState.dpr);
    canvas.style.width = particleState.w + 'px';
    canvas.style.height = particleState.h + 'px';
    ctx.setTransform(particleState.dpr, 0, 0, particleState.dpr, 0, 0);
  }

  function seed() {
    particleState.particles = [];
    for (var i = 0; i < total; i++) {
      var z = Math.random();
      particleState.particles.push({
        x: Math.random() * particleState.w,
        y: Math.random() * particleState.h,
        z: z,
        r: (0.5 + z * 2.1) * cfg.size,
        vy: -(0.08 + z * 0.55) * -cfg.rise,
        vx: cfg.trail > 0 ? (0.45 + z * 0.75) * cfg.sway : (Math.random() - 0.5) * 0.22 * cfg.sway,
        hue: (Math.random() - 0.5) * cfg.spread,
        twinkle: Math.random() * Math.PI * 2,
      });
    }
  }

  resize();
  seed();

  function draw() {
    var e = particleState.energy;
    var s = particleState.speed;
    var w = particleState.w, h = particleState.h;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';

    var particles = particleState.particles;
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      if (!reduce) {
        p.y += p.vy * (0.6 + e * 2.4) * s;
        p.x += p.vx * (0.6 + e * 1.6) * s;
        p.twinkle += (0.03 + p.z * 0.05) * cfg.flicker * s;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.y > h + 10) { p.y = -10; p.x = Math.random() * w; }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
      }
      var alpha = (0.18 + p.z * 0.5) * (0.6 + 0.4 * Math.sin(p.twinkle)) * (0.5 + e * 0.7);
      var tint = (particleState.hue + p.hue + 360) % 360;
      var glow = p.r * cfg.bloom;

      var sprite = particleState.sprites[Math.floor(tint / HUE_STEP) % particleState.sprites.length];
      if (sprite) {
        ctx.globalAlpha = Math.min(alpha * 1.5, 0.9);
        ctx.drawImage(sprite, p.x - glow, p.y - glow, glow * 2, glow * 2);
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    particleState.raf = requestAnimationFrame(draw);
  }

  function onResize() { resize(); seed(); }
  window.addEventListener('resize', onResize);
  particleState.raf = requestAnimationFrame(draw);
}

var VIZ_BAR_COUNT = 72;
var VIZ_WAVE_POINTS = 128;

export var vizState = {
  smoothed: 0,
  phase: 0,
  nodes: null,
  raf: 0,
  w: 0, h: 0,
  dpr: 1.5,
  waveCache: null,
  bandCache: null,
  coreCache: null,
  cachedHue: -1,
  painted: false,
};

export function initVisualizer() {
  var canvas = document.getElementById('visualizer');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var isVapor = MOOD === 'vapor';
  var isRidge = MOOD === 'ridge';
  vizState.nodes = new Float32Array(isRidge ? VIZ_WAVE_POINTS : VIZ_BAR_COUNT);
  vizState.waveCache = new Map();
  vizState.dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  function invalidateCaches() {
    vizState.waveCache.clear();
    vizState.bandCache = null;
    vizState.coreCache = null;
  }

  function waveGradient(light) {
    var hit = vizState.waveCache.get(light);
    if (hit) return hit;
    var baseHue = AURORA_HUE;
    var grad = ctx.createLinearGradient(0, 0, vizState.w, 0);
    grad.addColorStop(0, 'hsla(' + baseHue + ', 96%, ' + light + '%, 0)');
    grad.addColorStop(0.5, 'hsl(' + ((baseHue + 30) % 360) + ', 98%, ' + light + '%)');
    grad.addColorStop(1, 'hsla(' + ((baseHue + 60) % 360) + ', 96%, ' + light + '%, 0)');
    vizState.waveCache.set(light, grad);
    return grad;
  }

  function bandSprite() {
    if (vizState.bandCache) return vizState.bandCache;
    var sprite = document.createElement('canvas');
    sprite.width = 1; sprite.height = 64;
    var sctx = sprite.getContext('2d');
    if (sctx) {
      var baseHue = AURORA_HUE;
      var grad = sctx.createLinearGradient(0, 0, 0, 64);
      grad.addColorStop(0, 'hsla(' + baseHue + ', 92%, 74%, 0)');
      grad.addColorStop(0.5, 'hsl(' + baseHue + ', 92%, 74%)');
      grad.addColorStop(1, 'hsla(' + baseHue + ', 92%, 74%, 0)');
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, 1, 64);
    }
    vizState.bandCache = sprite;
    return sprite;
  }

  function coreSprite() {
    if (vizState.coreCache) return vizState.coreCache;
    var size = 128, half = size / 2;
    var sprite = document.createElement('canvas');
    sprite.width = size; sprite.height = size;
    var sctx = sprite.getContext('2d');
    if (sctx) {
      var baseHue = AURORA_HUE;
      var grad = sctx.createRadialGradient(half, half, 0, half, half, half);
      grad.addColorStop(0, 'hsl(' + baseHue + ', 92%, 80%)');
      grad.addColorStop(1, 'hsla(' + baseHue + ', 92%, 70%, 0)');
      sctx.fillStyle = grad;
      sctx.beginPath();
      sctx.arc(half, half, half, 0, Math.PI * 2);
      sctx.fill();
    }
    vizState.coreCache = sprite;
    return sprite;
  }

  function resize() {
    vizState.w = window.innerWidth;
    vizState.h = window.innerHeight;
    canvas.width = Math.floor(vizState.w * vizState.dpr);
    canvas.height = Math.floor(vizState.h * vizState.dpr);
    canvas.style.width = vizState.w + 'px';
    canvas.style.height = vizState.h + 'px';
    ctx.setTransform(vizState.dpr, 0, 0, vizState.dpr, 0, 0);
    invalidateCaches();
  }

  function drawRadial() {
    var w = vizState.w, h = vizState.h;
    var cx = w / 2, cy = h / 2;
    var radius = Math.min(w, h) * (isVapor ? 0.13 : 0.19);
    var baseHue = AURORA_HUE;

    ctx.lineCap = 'round';
    for (var i = 0; i < VIZ_BAR_COUNT; i++) {
      var angle = (i / VIZ_BAR_COUNT) * Math.PI * 2 - Math.PI / 2;
      var wave = 0.55 + 0.45 * Math.sin(i * 0.55 + vizState.phase * 2.4) * Math.cos(i * 0.17 - vizState.phase);
      var target = vizState.smoothed * wave;
      vizState.nodes[i] += (target - vizState.nodes[i]) * (isVapor ? 0.1 : 0.22);
      var length = vizState.nodes[i] * Math.min(w, h) * (isVapor ? 0.3 : 0.2);
      if (length < 0.6) continue;
      var x1 = cx + Math.cos(angle) * radius;
      var y1 = cy + Math.sin(angle) * radius;
      var x2 = cx + Math.cos(angle) * (radius + length);
      var y2 = cy + Math.sin(angle) * (radius + length);
      var barHue = (baseHue + i * 1.6) % 360;
      ctx.globalAlpha = 0.42 * vizState.smoothed;
      ctx.strokeStyle = 'hsl(' + barHue + ', 96%, 74%)';
      ctx.lineWidth = isVapor ? 7 : 2.2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    var glowRadius = radius * (isVapor ? 3.4 : 2.1);
    ctx.globalAlpha = 0.16 * vizState.smoothed;
    ctx.drawImage(coreSprite(), cx - glowRadius, cy - glowRadius, glowRadius * 2, glowRadius * 2);
    ctx.globalAlpha = 1;
  }

  resize();

  function draw() {
    var level = chimeGetLevel();
    vizState.smoothed += (level - vizState.smoothed) * 0.16;

    if (AURORA_HUE !== vizState.cachedHue) {
      vizState.cachedHue = AURORA_HUE;
      invalidateCaches();
    }

    if (vizState.smoothed > 0.004) {
      vizState.phase += 0.02;
      ctx.clearRect(0, 0, vizState.w, vizState.h);
      vizState.painted = true;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      drawRadial();
      ctx.restore();
    } else if (vizState.painted) {
      ctx.clearRect(0, 0, vizState.w, vizState.h);
      vizState.painted = false;
    }

    vizState.raf = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  vizState.raf = requestAnimationFrame(draw);
}

export function initRipples() {
  var layer = document.getElementById('ripple-layer');
  if (!layer) return;
  var idCounter = 0;
  window.addEventListener('pointerdown', function (e) {
    var id = ++idCounter;
    var ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    layer.appendChild(ripple);
    setTimeout(function () { if (ripple.parentNode) ripple.parentNode.removeChild(ripple); }, 1000);
  });
}

export function initClock() {
  var timeEl = document.getElementById('clock-time');
  var secEl = document.getElementById('clock-seconds');
  if (!timeEl || !secEl) return;
  var id = 0;

  function tick() {
    var now = new Date();
    var hh = String(now.getHours()).padStart(2, '0');
    var mm = String(now.getMinutes()).padStart(2, '0');
    var ss = String(now.getSeconds()).padStart(2, '0');
    timeEl.textContent = hh + ':' + mm;
    secEl.textContent = ss;
    id = setTimeout(tick, 1000 - (now.getTime() % 1000));
  }

  function onVisibility() {
    if (document.visibilityState !== 'visible') return;
    clearTimeout(id);
    tick();
  }

  tick();
  document.addEventListener('visibilitychange', onVisibility);
}

export function renderName() {
  var mount = document.getElementById('name-mount');
  if (!mount) return;
  mount.innerHTML = '';

  var wrap = document.createElement('div');
  wrap.className = 'name-wrap';
  wrap.setAttribute('aria-label', NAME + '...');

  var halo = document.createElement('span');
  halo.className = 'name-halo';
  wrap.appendChild(halo);

  var letters = Array.from(NAME);
  letters.forEach(function (char, i) {
    var enterDelay = LEAD + i * STEP;
    var span = document.createElement('span');
    span.className = 'name-glyph';
    span.style.setProperty('--enter', enterDelay + 'ms');
    span.style.setProperty('--bob', (enterDelay + ENTER_MS + i * 110) + 'ms');
    span.textContent = char === ' ' ? '\u00A0' : char;
    wrap.appendChild(span);
  });

  var dotsWrap = document.createElement('span');
  dotsWrap.className = 'name-dots';
  [0, 1, 2].forEach(function (d) {
    var dot = document.createElement('span');
    dot.className = 'name-dot';
    dot.style.setProperty('--d', (LEAD + letters.length * STEP + d * 190) + 'ms');
    dotsWrap.appendChild(dot);
  });
  wrap.appendChild(dotsWrap);

  mount.appendChild(wrap);
}

var stage = 'boot';
var runKey = 0;
var bootRaf = 0;
var bootDone = false;
var timers = [];

export function schedule(fn, delay) { timers.push(setTimeout(fn, delay)); }
export function clearTimers() { timers.forEach(function (id) { clearTimeout(id); }); timers = []; }

export function showStage(name) {
  var stages = ['boot', 'hello', 'ready'];
  stages.forEach(function (s) {
    var el = document.getElementById('stage-' + s);
    if (el) el.style.display = (s === name) ? 'flex' : 'none';
  });
}

export function setBootEnergy(progress) {
  particleState.energy = 0.25 + progress * 0.85;
}

export function handleBootComplete() {
  chimePlay();
  hapticTap('heavy');
  showFlash();
  schedule(function () { hideFlash(); }, 700);
  schedule(function () { stage = 'hello'; showStage('hello'); }, 340);
  schedule(hapticSettle, CHIME_MS);

  schedule(function () {
    var appEl = document.getElementById('app');
    if (appEl) {
      appEl.style.transition = 'opacity 0.8s ease';
      appEl.style.opacity = '0';
      setTimeout(function () {
        appEl.style.display = 'none';
        var terminal = document.getElementById('terminal-screen');
        if (terminal) {
          terminal.style.visibility = 'visible';
          terminal.style.opacity = '0';
          terminal.style.transition = 'opacity 0.6s ease';
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              terminal.style.opacity = '1';
              if (typeof window.initCmd === 'function') {
                window.initCmd();
              }
            });
          });
        }
      }, 800);
    }
  }, 3200);
}

export function showFlash() {
  var flashLayer = document.getElementById('flash-layer');
  var shockwaveLayer = document.getElementById('shockwaves');
  if (flashLayer) flashLayer.innerHTML = '<div class="flash"></div>';
  if (shockwaveLayer) shockwaveLayer.innerHTML = '<span class="shockwave"></span><span class="shockwave" style="animation-delay:140ms"></span><span class="shockwave" style="animation-delay:280ms"></span>';
}

export function hideFlash() {
  var flashLayer = document.getElementById('flash-layer');
  var shockwaveLayer = document.getElementById('shockwaves');
  if (flashLayer) flashLayer.innerHTML = '';
  if (shockwaveLayer) shockwaveLayer.innerHTML = '';
}

export function showSlider() {
  var el = document.getElementById('speed-slider');
  if (el) el.style.display = 'flex';
}

export function hideSlider() {
  var el = document.getElementById('speed-slider');
  if (el) el.style.display = 'none';
}

export function startBootProgress() {
  bootDone = false;
  var progress = 0;
  var start = performance.now();
  var duration = 4800;
  var fillEl = document.getElementById('progress-fill');
  var lineEl = document.getElementById('boot-line');
  var pctEl = document.getElementById('boot-percent');
  var lastLineIndex = -1;

  function tick(now) {
    var t = Math.min((now - start) / duration, 1);
    var eased;
    if (t < 0.35) eased = t * 1.8;
    else if (t < 0.55) eased = 0.63 + (t - 0.35) * 0.35;
    else if (t < 0.8) eased = 0.7 + (t - 0.55) * 0.6;
    else eased = 0.85 + (t - 0.8) * 0.75;
    progress = Math.min(eased, 1);

    if (fillEl) fillEl.style.width = (progress * 100) + '%';
    if (pctEl) pctEl.textContent = Math.round(progress * 100) + '%';
    setBootEnergy(progress);

    var lineIndex = Math.min(BOOT_LINES.length - 1, Math.floor(progress * BOOT_LINES.length));
    if (lineIndex !== lastLineIndex) {
      lastLineIndex = lineIndex;
      if (lineEl) {
        lineEl.textContent = BOOT_LINES[lineIndex];
        lineEl.classList.remove('line-swap');
        void lineEl.offsetWidth;
        lineEl.classList.add('line-swap');
      }
    }

    if (t < 1) {
      bootRaf = requestAnimationFrame(tick);
    } else if (!bootDone) {
      bootDone = true;
      handleBootComplete();
    }
  }
  bootRaf = requestAnimationFrame(tick);
}

export function replay() {
  hapticTap('medium');
  clearTimers();
  hideFlash();
  hideSlider();
  cancelAnimationFrame(bootRaf);

  var appEl = document.getElementById('app');
  if (appEl) {
    appEl.style.display = 'block';
    appEl.style.opacity = '1';
  }

  stage = 'boot';
  runKey++;
  showStage('boot');
  renderName();
  var bootEl = document.getElementById('stage-boot');
  if (bootEl) {
    bootEl.style.animation = 'none';
    void bootEl.offsetWidth;
    bootEl.style.animation = '';
  }
  startBootProgress();
}

export function initSlider() {
  var range = document.getElementById('speed-range');
  var readout = document.getElementById('speed-readout');
  if (!range || !readout) return;
  var SPEED_MIN = 0.5, SPEED_MAX = 2;

  function update() {
    var val = parseFloat(range.value);
    particleState.speed = val;
    var fill = ((val - SPEED_MIN) / (SPEED_MAX - SPEED_MIN)) * 100;
    range.style.setProperty('--fill', fill + '%');
    readout.textContent = val.toFixed(2) + 'x';
    if (Math.abs(val - 1) < 0.03) hapticTap('light');
  }

  range.addEventListener('input', update);
  update();
}

export function runIOS26Loading() {
  applyAuroraVars();
  unlockAudio();
  initParallax();
  renderName();
  initParticles();
  initVisualizer();
  initRipples();
  initClock();
  initSlider();

  var logoBtn = document.getElementById('logo-btn');
  if (logoBtn) logoBtn.addEventListener('click', function () { hapticTap('light'); });

  var replayBtn = document.getElementById('replay-btn');
  if (replayBtn) {
    replayBtn.addEventListener('pointerdown', function () { hapticTap('light'); });
    replayBtn.addEventListener('click', replay);
  }

  var chimeBtn = document.getElementById('chime-btn');
  if (chimeBtn) {
    chimeBtn.addEventListener('click', function () {
      chimePlay();
      hapticTap('heavy');
      var textEl = document.getElementById('chime-btn-text');
      if (textEl) textEl.textContent = 'Play startup chime';
    });
  }

  startBootProgress();
}
