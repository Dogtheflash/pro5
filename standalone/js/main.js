/* ============================================================
   iOS 26 Loading Screen — Main Entry Point (ES Module)
   ============================================================ */
'use strict';

import { applyAuroraVars } from './config.js';
import { hapticTap } from './haptics.js';
import { initParallax } from './parallax.js';
import { chimePlay, unlockAudio } from './chime.js';
import { particleState, initParticles } from './particles.js';
import { initVisualizer } from './visualizer.js';
import { renderName } from './nameReveal.js';
import { startBootProgress, replay } from './bootController.js';

/* ===== Ripples ===== */
function initRipples() {
  const layer = document.getElementById('ripple-layer');
  if (!layer) return;
  let idCounter = 0;
  window.addEventListener('pointerdown', function (e) {
    idCounter++;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    layer.appendChild(ripple);
    setTimeout(function () { if (ripple.parentNode) ripple.parentNode.removeChild(ripple); }, 1000);
  });
}

/* ===== Clock ===== */
function initClock() {
  const timeEl = document.getElementById('clock-time');
  const secEl = document.getElementById('clock-seconds');
  if (!timeEl || !secEl) return;
  let id = 0;

  function tick() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
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

/* ===== Speed Slider Controls ===== */
function initSlider() {
  const range = document.getElementById('speed-range');
  const readout = document.getElementById('speed-readout');
  if (!range || !readout) return;
  const SPEED_MIN = 0.5, SPEED_MAX = 2;

  function update() {
    const val = parseFloat(range.value);
    particleState.speed = val;
    const fill = ((val - SPEED_MIN) / (SPEED_MAX - SPEED_MIN)) * 100;
    range.style.setProperty('--fill', fill + '%');
    readout.textContent = val.toFixed(2) + 'x';
    if (Math.abs(val - 1) < 0.03) hapticTap('light');
  }

  range.addEventListener('input', update);
  update();
}

/* ===== Button Event Handlers ===== */
function initButtons() {
  const logoBtn = document.getElementById('logo-btn');
  if (logoBtn) {
    logoBtn.addEventListener('click', function () { hapticTap('light'); });
  }

  const replayBtn = document.getElementById('replay-btn');
  if (replayBtn) {
    replayBtn.addEventListener('pointerdown', function () { hapticTap('light'); });
    replayBtn.addEventListener('click', replay);
  }

  const chimeBtn = document.getElementById('chime-btn');
  if (chimeBtn) {
    chimeBtn.addEventListener('click', function () {
      chimePlay();
      hapticTap('heavy');
      const txt = document.getElementById('chime-btn-text');
      if (txt) txt.textContent = 'Play startup chime';
    });
  }
}

/* ===== Initialize Everything ===== */
function init() {
  applyAuroraVars();
  unlockAudio();
  initParallax();
  initRipples();
  initClock();
  initSlider();
  initButtons();
  renderName();
  initParticles();
  initVisualizer();
  startBootProgress();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
