/* ============================================================
   PARALLAX, 3D TILT & POINTER GLOW MODULE
   ============================================================ */
'use strict';

import { activeInnerPage } from './color-tool.js';

export let activeTiltTarget = null;
export let rippleCooldown = 0;
export let pageRippleCooldown = 0;

export const CARD_RIPPLE_INTERVAL = 920;
export const PAGE_RIPPLE_INTERVAL = 1250;

export function updateGlobalPointer(event) {
  if (window.__LOW_PERF) return;
  document.body.style.setProperty('--pointer-x', `${event.clientX}px`);
  document.body.style.setProperty('--pointer-y', `${event.clientY}px`);
  document.body.classList.add('pointer-active');
}

export function spawnPageRipple(event) {
  if (window.__LOW_PERF) return;
  if (document.body.classList.contains('terminal-active')) return;
  const now = Date.now();
  if (event.type === 'pointermove' && now - pageRippleCooldown < PAGE_RIPPLE_INTERVAL) return;
  pageRippleCooldown = now;
  const ripple = document.createElement('span');
  ripple.className = 'page-ripple';
  ripple.style.setProperty('--ripple-x', `${event.clientX}px`);
  ripple.style.setProperty('--ripple-y', `${event.clientY}px`);
  document.body.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
}

export function getTiltTarget(interactiveCard) {
  if (!interactiveCard) return null;
  if (activeInnerPage && !activeInnerPage.classList.contains('hidden')) return activeInnerPage;
  return interactiveCard;
}

export function updateCardPointer(event, interactiveCard) {
  if (window.__LOW_PERF) return;
  const target = getTiltTarget(interactiveCard);
  if (!target) return;
  if (activeTiltTarget && activeTiltTarget !== target) resetCardPointer(interactiveCard);
  activeTiltTarget = target;
  const rect = target.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const px = x / rect.width;
  const py = y / rect.height;
  const tiltY = (px - 0.5) * 9;
  const tiltX = (0.5 - py) * 9;
  target.style.setProperty('--glow-x', `${px * 100}%`);
  target.style.setProperty('--glow-y', `${py * 100}%`);
  target.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
  target.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
  target.classList.add('interactive-hover');
}

export function resetCardPointer(interactiveCard) {
  const target = activeTiltTarget || interactiveCard || document.querySelector('.profile-console');
  if (!target) return;
  target.classList.remove('interactive-hover');
  target.style.setProperty('--tilt-x', '0deg');
  target.style.setProperty('--tilt-y', '0deg');
  activeTiltTarget = null;
}

export function spawnCardRipple(event, interactiveCard) {
  if (window.__LOW_PERF) return;
  const target = getTiltTarget(interactiveCard);
  if (!target) return;
  const now = Date.now();
  if (event.type === 'pointermove' && now - rippleCooldown < CARD_RIPPLE_INTERVAL) return;
  rippleCooldown = now;
  const rect = target.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'hover-ripple';
  ripple.style.setProperty('--ripple-x', `${event.clientX - rect.left}px`);
  ripple.style.setProperty('--ripple-y', `${event.clientY - rect.top}px`);
  target.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
}

export function initParallaxBanner() {
  if (window.__LOW_PERF) return;
  var card = document.querySelector('.profile-console');
  var layers = document.querySelectorAll('.plx-layer');
  if (!card || !layers.length) return;

  var MX = 200;
  var MY = 120;
  var ticking = false;

  function onMove(e) {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var rect = card.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;

      for (var i = 0; i < layers.length; i++) {
        var depth = parseFloat(layers[i].dataset.depth) || 0;
        var dx = (px * depth * MX).toFixed(2);
        var dy = (py * depth * MY).toFixed(2);
        layers[i].style.transform = 'translate3d(' + dx + 'px,' + dy + 'px,0)';
      }
      ticking = false;
    });
  }

  function onLeave() {
    for (var i = 0; i < layers.length; i++) {
      layers[i].style.transform = 'translate3d(0,0,0)';
    }
  }

  card.addEventListener('pointermove', onMove, { passive: true });
  card.addEventListener('pointerleave', onLeave);
}

export function initPointerGlow() {
  const pointerGlow = document.getElementById('pointer-glow');
  const interactiveCard = document.querySelector('.profile-console');

  if (pointerGlow) {
    document.addEventListener('pointermove', (event) => {
      updateGlobalPointer(event);
      spawnPageRipple(event);
    });
    document.addEventListener('pointerdown', (event) => {
      updateGlobalPointer(event);
      spawnPageRipple(event);
    });
    document.addEventListener('pointerleave', () => document.body.classList.remove('pointer-active'));
  }

  if (interactiveCard) {
    document.addEventListener('pointermove', (event) => {
      const target = getTiltTarget(interactiveCard);
      if (!target || !target.contains(event.target)) {
        if (activeTiltTarget) resetCardPointer(interactiveCard);
        return;
      }
      updateCardPointer(event, interactiveCard);
      spawnCardRipple(event, interactiveCard);
    });
    document.addEventListener('pointerdown', (event) => {
      const target = getTiltTarget(interactiveCard);
      if (!target || !target.contains(event.target)) return;
      spawnCardRipple(event, interactiveCard);
    });
    document.addEventListener('pointerover', (event) => {
      const target = getTiltTarget(interactiveCard);
      if (target && target.contains(event.target)) activeTiltTarget = target;
    });
    document.addEventListener('pointerout', (event) => {
      const target = activeTiltTarget;
      if (target && !target.contains(event.relatedTarget)) resetCardPointer(interactiveCard);
    });
  }

  initParallaxBanner();
}
