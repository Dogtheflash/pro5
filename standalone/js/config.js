/* ============================================================
   iOS 26 Loading Screen — Configuration & Helpers
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

/* ===== Aurora color helpers ===== */
export function hexToHsl(hex) {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const delta = max - min;
  const l = (max + min) / 2;
  if (delta === 0) return { h: 0, s: 0, l: l };
  const s = delta / (1 - Math.abs(2 * l - 1));
  let h;
  if (max === r) h = ((g - b) / delta) % 6;
  else if (max === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  return { h: (h * 60 + 360) % 360, s: s, l: l };
}

export function hexToHue(hex) { return Math.round(hexToHsl(hex).h); }

export function hsla(hsl, alpha) {
  const sat = Math.round(Math.min(1, Math.max(0.35, hsl.s)) * 100);
  const light = Math.round(Math.min(0.72, Math.max(0.42, hsl.l)) * 100);
  return 'hsla(' + Math.round((hsl.h + 360) % 360) + ', ' + sat + '%, ' + light + '%, ' + alpha + ')';
}

export function buildAuroraColors(hex) {
  const base = hexToHsl(hex);
  return [
    hsla(base, 0.5),
    hsla({ h: base.h + 42, s: base.s, l: base.l * 1.05 }, 0.45),
    hsla({ h: base.h - 36, s: base.s, l: base.l * 0.95 }, 0.4),
    hsla({ h: base.h + 84, s: base.s, l: base.l }, 0.32),
  ];
}

export const AURORA_HUE = hexToHue(AURORA_HEX);

/* Apply aurora CSS vars to root */
export function applyAuroraVars() {
  const colors = buildAuroraColors(AURORA_HEX);
  const app = document.getElementById('app');
  if (app) {
    app.style.setProperty('--aurora-1', colors[0]);
    app.style.setProperty('--aurora-2', colors[1]);
    app.style.setProperty('--aurora-3', colors[2]);
    app.style.setProperty('--aurora-4', colors[3]);
  }
}
