/* ============================================================
   iOS 26 Loading Screen — Haptics / Vibration API
   ============================================================ */
'use strict';

export const VIBRATION_MS = { light: 8, medium: 16, heavy: 30 };
export const SETTLE_PATTERN = [14, 90, 22];

export function vibrate(pattern) {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
  try { navigator.vibrate(pattern); } catch (e) {}
}

export function hapticTap(strength) { vibrate(VIBRATION_MS[strength || 'light']); }
export function hapticSettle() { vibrate(SETTLE_PATTERN.slice()); }
