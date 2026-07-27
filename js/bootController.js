/* ============================================================
   iOS 26 Loading Screen — Boot Stage Machine & Progress Controller
   ============================================================ */
'use strict';

import { CHIME_MS, BOOT_LINES } from './config.js';
import { hapticTap, hapticSettle } from './haptics.js';
import { chimePlay } from './chime.js';
import { particleState } from './particles.js';
import { renderName } from './nameReveal.js';

export const bootState = {
  stage: 'boot',
  runKey: 0,
  bootRaf: 0,
  bootDone: false,
  timers: [],
};

export function schedule(fn, delay) {
  const id = setTimeout(fn, delay);
  bootState.timers.push(id);
  return id;
}

export function clearTimers() {
  bootState.timers.forEach(id => clearTimeout(id));
  bootState.timers = [];
}

export function showStage(name) {
  const stages = ['boot', 'hello', 'ready'];
  stages.forEach(s => {
    const el = document.getElementById('stage-' + s);
    if (el) el.style.display = (s === name) ? 'flex' : 'none';
  });
}

export function setBootEnergy(progress) {
  particleState.energy = 0.25 + progress * 0.85;
}

export function showFlash() {
  const flashLayer = document.getElementById('flash-layer');
  const shockwaveLayer = document.getElementById('shockwaves');
  if (flashLayer) flashLayer.innerHTML = '<div class="flash"></div>';
  if (shockwaveLayer) shockwaveLayer.innerHTML = '<span class="shockwave"></span><span class="shockwave" style="animation-delay:140ms"></span><span class="shockwave" style="animation-delay:280ms"></span>';
}

export function hideFlash() {
  const flashLayer = document.getElementById('flash-layer');
  const shockwaveLayer = document.getElementById('shockwaves');
  if (flashLayer) flashLayer.innerHTML = '';
  if (shockwaveLayer) shockwaveLayer.innerHTML = '';
}

export function showSlider() {
  const slider = document.getElementById('speed-slider');
  if (slider) slider.style.display = 'flex';
}

export function hideSlider() {
  const slider = document.getElementById('speed-slider');
  if (slider) slider.style.display = 'none';
}

export function handleBootComplete() {
  chimePlay();
  hapticTap('heavy');
  showFlash();
  schedule(() => { hideFlash(); }, 700);
  schedule(() => { bootState.stage = 'hello'; showStage('hello'); }, 340);
  schedule(hapticSettle, CHIME_MS);
  schedule(() => { bootState.stage = 'ready'; showStage('ready'); showSlider(); }, 4200);
}

export function startBootProgress() {
  bootState.bootDone = false;
  let progress = 0;
  const start = performance.now();
  const duration = 4800;
  const fillEl = document.getElementById('progress-fill');
  const lineEl = document.getElementById('boot-line');
  const pctEl = document.getElementById('boot-percent');
  let lastLineIndex = -1;

  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    let eased;
    if (t < 0.35) eased = t * 1.8;
    else if (t < 0.55) eased = 0.63 + (t - 0.35) * 0.35;
    else if (t < 0.8) eased = 0.7 + (t - 0.55) * 0.6;
    else eased = 0.85 + (t - 0.8) * 0.75;
    progress = Math.min(eased, 1);

    if (fillEl) fillEl.style.width = (progress * 100) + '%';
    if (pctEl) pctEl.textContent = Math.round(progress * 100) + '%';
    setBootEnergy(progress);

    const lineIndex = Math.min(BOOT_LINES.length - 1, Math.floor(progress * BOOT_LINES.length));
    if (lineIndex !== lastLineIndex && lineEl) {
      lastLineIndex = lineIndex;
      lineEl.textContent = BOOT_LINES[lineIndex];
      lineEl.classList.remove('line-swap');
      void lineEl.offsetWidth;
      lineEl.classList.add('line-swap');
    }

    if (t < 1) {
      bootState.bootRaf = requestAnimationFrame(tick);
    } else if (!bootState.bootDone) {
      bootState.bootDone = true;
      handleBootComplete();
    }
  }
  bootState.bootRaf = requestAnimationFrame(tick);
}

export function replay() {
  hapticTap('medium');
  clearTimers();
  hideFlash();
  hideSlider();
  cancelAnimationFrame(bootState.bootRaf);
  bootState.stage = 'boot';
  bootState.runKey++;
  showStage('boot');
  renderName();
  const bootEl = document.getElementById('stage-boot');
  if (bootEl) {
    bootEl.style.animation = 'none';
    void bootEl.offsetWidth;
    bootEl.style.animation = '';
  }
  startBootProgress();
}
