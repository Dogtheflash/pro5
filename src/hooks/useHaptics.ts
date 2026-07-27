import { useCallback, useMemo } from "react";

export type HapticStrength = "light" | "medium" | "heavy";

const VIBRATION_MS: Record<HapticStrength, number> = {
  light: 8,
  medium: 16,
  heavy: 30,
};

/**
 * Two quick taps with a breath between them — played as the startup chime's
 * tail dies away, the way iOS confirms it has finished settling.
 */
const SETTLE_PATTERN: readonly number[] = [14, 90, 22];

function vibrate(pattern: number | number[]): void {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // Vibration unsupported or blocked by the browser — ignore silently.
  }
}

/**
 * Fires a real device vibration where the Vibration API is available.
 * No screen movement is applied — feedback stays purely tactile.
 */
export function useHaptics() {
  const tap = useCallback((next: HapticStrength = "light") => {
    vibrate(VIBRATION_MS[next]);
  }, []);

  /** Soft double pulse marking the end of the startup chime. */
  const settle = useCallback(() => {
    vibrate([...SETTLE_PATTERN]);
  }, []);

  return useMemo(() => ({ tap, settle }), [tap, settle]);
}
