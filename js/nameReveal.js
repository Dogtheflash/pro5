/* ============================================================
   iOS 26 Loading Screen — Signature Name Reveal (DOM)
   ============================================================ */
'use strict';

import { NAME, LEAD, STEP, ENTER_MS } from './config.js';

export function renderName() {
  const mount = document.getElementById('name-mount');
  if (!mount) return;
  mount.innerHTML = '';

  const wrap = document.createElement('div');
  wrap.className = 'name-wrap';
  wrap.setAttribute('aria-label', NAME + '...');

  const halo = document.createElement('span');
  halo.className = 'name-halo';
  wrap.appendChild(halo);

  const letters = Array.from(NAME);
  letters.forEach((char, i) => {
    const enterDelay = LEAD + i * STEP;
    const span = document.createElement('span');
    span.className = 'name-glyph';
    span.style.setProperty('--enter', enterDelay + 'ms');
    span.style.setProperty('--bob', (enterDelay + ENTER_MS + i * 110) + 'ms');
    span.textContent = char === ' ' ? '\u00A0' : char;
    wrap.appendChild(span);
  });

  const dotsWrap = document.createElement('span');
  dotsWrap.className = 'name-dots';
  [0, 1, 2].forEach(d => {
    const dot = document.createElement('span');
    dot.className = 'name-dot';
    dot.style.setProperty('--d', (LEAD + letters.length * STEP + d * 190) + 'ms');
    dotsWrap.appendChild(dot);
  });
  wrap.appendChild(dotsWrap);

  mount.appendChild(wrap);
}
