/** Aurora palette helpers — turns a single base colour into a harmonised set of blobs. */

export type AuroraColors = readonly [string, string, string, string];

export type AuroraPreset = {
  readonly id: string;
  readonly label: string;
  readonly hex: string;
};

export const AURORA_PRESETS: readonly AuroraPreset[] = [
  { id: "default", label: "Aurora", hex: "#3882f6" },
  { id: "sunset", label: "Sunset", hex: "#ff5a3c" },
  { id: "mint", label: "Mint", hex: "#2dd4bf" },
  { id: "bloom", label: "Bloom", hex: "#f0399c" },
  { id: "amber", label: "Amber", hex: "#ffb02e" },
  { id: "graphite", label: "Graphite", hex: "#8e9aad" },
];

/** Wallpaper geometry + particle behaviour presets. */
export type AuroraMood = "nebula" | "ridge" | "vapor";

export type AuroraMoodPreset = {
  readonly id: AuroraMood;
  readonly label: string;
  /** Short description of the atmosphere, shown under the switcher. */
  readonly caption: string;
};

export const AURORA_MOODS: readonly AuroraMoodPreset[] = [
  { id: "nebula", label: "Nebula", caption: "Soft orbs rising through deep space" },
  { id: "ridge", label: "Ridge", caption: "Fast light streaks over angled bands" },
  { id: "vapor", label: "Vapor", caption: "Heavy slow drift in a thick haze" },
];

type Hsl = { h: number; s: number; l: number };

function hexToHsl(hex: string): Hsl {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const l = (max + min) / 2;

  if (delta === 0) return { h: 0, s: 0, l };

  const s = delta / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === r) h = ((g - b) / delta) % 6;
  else if (max === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  return { h: (h * 60 + 360) % 360, s, l };
}

function hsla({ h, s, l }: Hsl, alpha: number): string {
  const sat = Math.round(Math.min(1, Math.max(0.35, s)) * 100);
  const light = Math.round(Math.min(0.72, Math.max(0.42, l)) * 100);
  return `hsla(${Math.round((h + 360) % 360)}, ${sat}%, ${light}%, ${alpha})`;
}

/** Base hue of a hex colour, in degrees. Tints particles and the visualizer. */
export function hexToHue(hex: string): number {
  return Math.round(hexToHsl(hex).h);
}

/**
 * Builds four analogous aurora colours around the given base hex so any picked
 * colour still reads as a cohesive iOS wallpaper rather than a flat wash.
 */
export function buildAuroraColors(hex: string): AuroraColors {
  const base = hexToHsl(hex);
  return [
    hsla(base, 0.5),
    hsla({ ...base, h: base.h + 42, l: base.l * 1.05 }, 0.45),
    hsla({ ...base, h: base.h - 36, l: base.l * 0.95 }, 0.4),
    hsla({ ...base, h: base.h + 84 }, 0.32),
  ];
}
