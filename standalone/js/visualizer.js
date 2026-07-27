/* ============================================================
   iOS 26 Loading Screen — Chime Audio Visualizer (Canvas)
   ============================================================ */
'use strict';

import { MOOD, AURORA_HUE } from './config.js';
import { chimeGetLevel } from './chime.js';

export const VIZ_BAR_COUNT = 72;
export const VIZ_WAVE_POINTS = 128;

export const vizState = {
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
  const canvas = document.getElementById('visualizer');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const isVapor = MOOD === 'vapor';
  const isRidge = MOOD === 'ridge';
  vizState.nodes = new Float32Array(isRidge ? VIZ_WAVE_POINTS : VIZ_BAR_COUNT);
  vizState.waveCache = new Map();
  vizState.dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  function invalidateCaches() {
    vizState.waveCache.clear();
    vizState.bandCache = null;
    vizState.coreCache = null;
  }

  function waveGradient(light) {
    const hit = vizState.waveCache.get(light);
    if (hit) return hit;
    const baseHue = AURORA_HUE;
    const grad = ctx.createLinearGradient(0, 0, vizState.w, 0);
    grad.addColorStop(0, 'hsla(' + baseHue + ', 96%, ' + light + '%, 0)');
    grad.addColorStop(0.5, 'hsl(' + ((baseHue + 30) % 360) + ', 98%, ' + light + '%)');
    grad.addColorStop(1, 'hsla(' + ((baseHue + 60) % 360) + ', 96%, ' + light + '%, 0)');
    vizState.waveCache.set(light, grad);
    return grad;
  }

  function bandSprite() {
    if (vizState.bandCache) return vizState.bandCache;
    const sprite = document.createElement('canvas');
    sprite.width = 1; sprite.height = 64;
    const sctx = sprite.getContext('2d');
    if (sctx) {
      const baseHue = AURORA_HUE;
      const grad = sctx.createLinearGradient(0, 0, 0, 64);
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
    const size = 128, half = size / 2;
    const sprite = document.createElement('canvas');
    sprite.width = size; sprite.height = size;
    const sctx = sprite.getContext('2d');
    if (sctx) {
      const baseHue = AURORA_HUE;
      const grad = sctx.createRadialGradient(half, half, 0, half, half, half);
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

  function drawWaveform() {
    const w = vizState.w, h = vizState.h;
    const cy = h / 2;
    const baseHue = AURORA_HUE;
    const amp = vizState.smoothed * Math.min(h * 0.3, 220);

    for (let i = 0; i < VIZ_WAVE_POINTS; i++) {
      const t = i / (VIZ_WAVE_POINTS - 1);
      const shape = Math.sin(t * 15 - vizState.phase * 3.4) * 0.6 + Math.sin(t * 31 - vizState.phase * 5.1) * 0.26 + Math.sin(t * 6 - vizState.phase * 1.7) * 0.34;
      const envelope = Math.pow(Math.sin(t * Math.PI), 0.7);
      vizState.nodes[i] += (shape * envelope - vizState.nodes[i]) * 0.24;
    }

    const passes = [
      { scale: 1, width: 2.4, alpha: 0.85, light: 84 },
      { scale: 0.62, width: 5.5, alpha: 0.24, light: 70 },
      { scale: 1.5, width: 1.2, alpha: 0.3, light: 92 },
    ];

    for (let p = 0; p < passes.length; p++) {
      const pass = passes[p];
      const grad = waveGradient(pass.light);
      ctx.globalAlpha = pass.alpha * vizState.smoothed;
      ctx.strokeStyle = grad;
      ctx.lineWidth = pass.width;
      ctx.beginPath();
      for (let i2 = 0; i2 < VIZ_WAVE_POINTS; i2++) {
        const x = (i2 / (VIZ_WAVE_POINTS - 1)) * w;
        const y = cy + vizState.nodes[i2] * amp * pass.scale;
        if (i2 === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    ctx.lineWidth = 1.4;
    ctx.globalAlpha = 0.22 * vizState.smoothed;
    ctx.strokeStyle = 'hsl(' + ((baseHue + 20) % 360) + ', 96%, 78%)';
    ctx.beginPath();
    for (let i3 = 2; i3 < VIZ_WAVE_POINTS; i3 += 4) {
      const x2 = (i3 / (VIZ_WAVE_POINTS - 1)) * w;
      const y2 = cy + vizState.nodes[i3] * amp;
      const tick = Math.abs(vizState.nodes[i3]) * amp * 0.4;
      if (tick < 1) continue;
      ctx.moveTo(x2, y2 - tick);
      ctx.lineTo(x2, y2 + tick);
    }
    ctx.stroke();

    ctx.globalAlpha = 0.1 * vizState.smoothed;
    ctx.drawImage(bandSprite(), 0, cy - amp, w, amp * 2);
    ctx.globalAlpha = 1;
  }

  function drawRadial() {
    const w = vizState.w, h = vizState.h;
    const cx = w / 2, cy = h / 2;
    const radius = Math.min(w, h) * (isVapor ? 0.13 : 0.19);
    const baseHue = AURORA_HUE;

    ctx.lineCap = 'round';
    for (let i = 0; i < VIZ_BAR_COUNT; i++) {
      const angle = (i / VIZ_BAR_COUNT) * Math.PI * 2 - Math.PI / 2;
      const wave = 0.55 + 0.45 * Math.sin(i * 0.55 + vizState.phase * 2.4) * Math.cos(i * 0.17 - vizState.phase);
      const target = vizState.smoothed * wave;
      vizState.nodes[i] += (target - vizState.nodes[i]) * (isVapor ? 0.1 : 0.22);
      const length = vizState.nodes[i] * Math.min(w, h) * (isVapor ? 0.3 : 0.2);
      if (length < 0.6) continue;
      const x1 = cx + Math.cos(angle) * radius;
      const y1 = cy + Math.sin(angle) * radius;
      const x2 = cx + Math.cos(angle) * (radius + length);
      const y2 = cy + Math.sin(angle) * (radius + length);
      const barHue = (baseHue + i * 1.6) % 360;
      ctx.globalAlpha = 0.42 * vizState.smoothed;
      ctx.strokeStyle = 'hsl(' + barHue + ', 96%, 74%)';
      ctx.lineWidth = isVapor ? 7 : 2.2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    const glowRadius = radius * (isVapor ? 3.4 : 2.1);
    ctx.globalAlpha = 0.16 * vizState.smoothed;
    ctx.drawImage(coreSprite(), cx - glowRadius, cy - glowRadius, glowRadius * 2, glowRadius * 2);
    ctx.globalAlpha = 1;
  }

  resize();

  function draw() {
    const level = chimeGetLevel();
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
      if (isRidge) drawWaveform(); else drawRadial();
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
