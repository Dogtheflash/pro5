/* ============================================================
   UNITY RICH TEXT COLORIZER MODULE
   ============================================================ */
'use strict';

import { resetCardPointer } from './parallax.js';

export const colorTool = {
  page: null,
  profile: null,
  open: null,
  back: null,
  text: null,
  effect: null,
  font: null,
  size: null,
  c1: null,
  c2: null,
  c3: null,
  bold: null,
  italic: null,
  word: null,
  colorLabels: [],
  preview: null,
  output: null,
  copy: null,
};

export let activeInnerPage = null;

export function hexToRgb(hex) {
  const value = hex.replace('#', '');
  return [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16));
}

export function rgbToHex([r, g, b]) {
  return [r, g, b].map((value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0')).join('').toUpperCase();
}

export function lerpColor(start, end, step, total) {
  const ratio = total <= 1 ? 0 : step / (total - 1);
  return start.map((value, index) => value + (end[index] - value) * ratio);
}

export function colorAt(index, total, effect) {
  const first = hexToRgb(colorTool.c1.value);
  const mid = hexToRgb(colorTool.c2.value);
  const last = hexToRgb(colorTool.c3.value);
  if (effect === 'solid') return rgbToHex(first);
  if (effect === 'rainbow') {
    const hue = Math.round((index / Math.max(1, total)) * 300);
    const tmp = document.createElement('span');
    tmp.style.color = `hsl(${hue}, 100%, 62%)`;
    document.body.appendChild(tmp);
    const rgb = getComputedStyle(tmp).color.match(/\d+/g).slice(0, 3).map(Number);
    tmp.remove();
    return rgbToHex(rgb);
  }
  if (effect === 'three') {
    const half = Math.max(1, Math.floor((total - 1) / 2));
    return index <= half ? rgbToHex(lerpColor(first, mid, index, half + 1)) : rgbToHex(lerpColor(mid, last, index - half, total - half));
  }
  if (effect === 'mirror') {
    const half = Math.max(1, Math.floor((total - 1) / 2));
    return index <= half ? rgbToHex(lerpColor(first, mid, index, half + 1)) : rgbToHex(lerpColor(mid, first, index - half, total - half));
  }
  return rgbToHex(lerpColor(first, last, index, total));
}

export function updateColorPickState() {
  if (!colorTool.effect) return;
  const effect = colorTool.effect.value;
  const enabledMap = {
    two: [true, false, true],
    mirror: [true, true, false],
    three: [true, true, true],
    solid: [true, false, false],
    random: [false, false, false],
    rainbow: [false, false, false],
  };
  const enabled = enabledMap[effect] || [true, true, true];
  colorTool.colorLabels.forEach((label, index) => {
    label.classList.toggle('disabled', !enabled[index]);
    const input = label.querySelector('input');
    if (input) input.disabled = !enabled[index];
  });
  if (colorTool.word) {
    colorTool.word.closest('label')?.classList.toggle('disabled', effect !== 'random');
    colorTool.word.disabled = effect !== 'random';
  }
}

export function buildUnityRichText() {
  if (!colorTool.text || !colorTool.effect) return;
  updateColorPickState();
  const raw = colorTool.text.value || '';
  const effect = colorTool.effect.value;
  const tokens = effect === 'random' && colorTool.word?.checked ? raw.split(/(\s+)/) : [...raw];
  const visibleTokens = tokens.filter((token) => token.trim()).length || raw.length || 1;
  let visibleIndex = 0;
  let html = '';
  let rich = '';

  tokens.forEach((token) => {
    if (!token.trim()) {
      html += token;
      rich += token;
      return;
    }
    const color = effect === 'random'
      ? rgbToHex([Math.random() * 255, Math.random() * 255, Math.random() * 255])
      : colorAt(visibleIndex, visibleTokens, effect);
    html += `<span style="color:#${color}">${token}</span>`;
    rich += `<color=#${color}>${token}</color>`;
    visibleIndex += 1;
  });

  if (colorTool.font?.value) {
    html = `<span style="font-family:${colorTool.font.value}">${html}</span>`;
  }
  if (colorTool.size?.value !== '0') {
    html = `<span style="font-size:${colorTool.size.value}px">${html}</span>`;
    rich = `<size=${colorTool.size.value}>${rich}</size>`;
  }
  if (colorTool.italic?.checked) {
    html = `<i>${html}</i>`;
    rich = `<i>${rich}</i>`;
  }
  if (colorTool.bold?.checked) {
    html = `<b>${html}</b>`;
    rich = `<b>${rich}</b>`;
  }

  if (colorTool.preview) colorTool.preview.innerHTML = html || 'Preview sẽ hiện ở đây';
  if (colorTool.output) colorTool.output.value = rich;
}

export function showInnerPage(page, afterShow, wide = false) {
  if (!page || !colorTool.profile) return;
  resetCardPointer();
  activeInnerPage?.classList.add('hidden');
  activeInnerPage?.classList.remove('leaving');
  activeInnerPage = page;
  page.style.setProperty('--tilt-x', '0deg');
  page.style.setProperty('--tilt-y', '0deg');
  document.body.classList.add('color-page-active');
  if (wide) document.body.classList.add('wide-page-active');
  else document.body.classList.remove('wide-page-active');
  colorTool.profile.classList.remove('slide-to-home');
  colorTool.profile.classList.add('slide-to-color', 'page-mode');
  page.classList.remove('hidden', 'leaving');
  const player = document.getElementById('music-player');
  if (player) player.classList.add('hidden');
  afterShow?.();
  setTimeout(() => {
    colorTool.profile.classList.remove('slide-to-color');
    resetCardPointer();
  }, 440);
}

export function hideInnerPage(page) {
  if (!page || !colorTool.profile) return;
  resetCardPointer();
  page.classList.add('leaving');
  colorTool.profile.classList.remove('slide-to-color');
  colorTool.profile.classList.add('slide-to-home');
  setTimeout(() => {
    document.body.classList.remove('color-page-active');
    document.body.classList.remove('wide-page-active');
    colorTool.profile.classList.remove('page-mode', 'slide-to-home');
    page.classList.add('hidden');
    page.classList.remove('leaving');
    if (activeInnerPage === page) activeInnerPage = null;
    const player = document.getElementById('music-player');
    if (player) player.classList.remove('hidden');
    resetCardPointer();
  }, 300);
}

export function showColorPage() {
  showInnerPage(colorTool.page, buildUnityRichText);
}

export function hideColorPage() {
  hideInnerPage(colorTool.page);
}

export function initColorTool() {
  colorTool.page = document.getElementById('color-page');
  colorTool.profile = document.querySelector('.profile-console');
  colorTool.open = document.getElementById('mal-link');
  colorTool.back = document.getElementById('color-back');
  colorTool.text = document.getElementById('tc-input-text');
  colorTool.effect = document.getElementById('tc-effect');
  colorTool.font = document.getElementById('tc-font');
  colorTool.size = document.getElementById('tc-size');
  colorTool.c1 = document.getElementById('tc-color-1');
  colorTool.c2 = document.getElementById('tc-color-2');
  colorTool.c3 = document.getElementById('tc-color-3');
  colorTool.bold = document.getElementById('tc-bold');
  colorTool.italic = document.getElementById('tc-italic');
  colorTool.word = document.getElementById('tc-word');
  colorTool.colorLabels = [...document.querySelectorAll('.color-picks label')];
  colorTool.preview = document.getElementById('tc-preview');
  colorTool.output = document.getElementById('tc-output');
  colorTool.copy = document.getElementById('tc-copy');

  if (colorTool.open) colorTool.open.addEventListener('click', (e) => { e.preventDefault(); showColorPage(); });
  if (colorTool.back) colorTool.back.addEventListener('click', hideColorPage);

  if (colorTool.text) colorTool.text.addEventListener('input', buildUnityRichText);
  if (colorTool.effect) colorTool.effect.addEventListener('change', buildUnityRichText);
  if (colorTool.font) colorTool.font.addEventListener('change', buildUnityRichText);
  if (colorTool.size) colorTool.size.addEventListener('change', buildUnityRichText);
  if (colorTool.c1) colorTool.c1.addEventListener('input', buildUnityRichText);
  if (colorTool.c2) colorTool.c2.addEventListener('input', buildUnityRichText);
  if (colorTool.c3) colorTool.c3.addEventListener('input', buildUnityRichText);
  if (colorTool.bold) colorTool.bold.addEventListener('change', buildUnityRichText);
  if (colorTool.italic) colorTool.italic.addEventListener('change', buildUnityRichText);
  if (colorTool.word) colorTool.word.addEventListener('change', buildUnityRichText);

  if (colorTool.copy) {
    colorTool.copy.addEventListener('click', () => {
      if (!colorTool.output) return;
      colorTool.output.select();
      navigator.clipboard.writeText(colorTool.output.value).then(() => {
        const original = colorTool.copy.textContent;
        colorTool.copy.textContent = 'Đã copy!';
        setTimeout(() => { colorTool.copy.textContent = original; }, 1500);
      });
    });
  }
}
