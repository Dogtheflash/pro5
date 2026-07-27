import { useEffect, useRef } from "react";

import type { AuroraMood } from "@/lib/aurora";

const BAR_COUNT = 72;
/** Ridge draws a denser waveform so the horizontal scan reads as continuous. */
const WAVE_POINTS = 128;

type Props = {
  /** Reads the live chime loudness, 0..1. */
  getLevel: () => number;
  /** Base hue of the current aurora tint, in degrees. */
  hue: number;
  /** Atmosphere preset — decides the visualizer's whole geometry. */
  mood: AuroraMood;
};

/**
 * Audio-reactive overlay driven by the real analyser while the startup chime
 * rings out. Geometry follows the wallpaper mood: Nebula and Vapor bloom
 * radially from the centre, Ridge scans across as a horizontal waveform.
 */
export const ChimeVisualizer = ({ getLevel, hue, mood }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hueRef = useRef<number>(hue);
  const levelFnRef = useRef<() => number>(getLevel);

  useEffect(() => {
    hueRef.current = hue;
  }, [hue]);

  useEffect(() => {
    levelFnRef.current = getLevel;
  }, [getLevel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Soft additive glow hides the resolution drop, and 1.5x shades ~45% fewer
    // pixels than 2x — the difference between smooth and janky on the burst.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const isRidge = mood === "ridge";
    const isVapor = mood === "vapor";
    let raf = 0;
    let w = 0;
    let h = 0;
    let smoothed = 0;
    let phase = 0;
    // Per-node amplitudes so neighbours lag slightly behind each other.
    const nodes = new Float32Array(isRidge ? WAVE_POINTS : BAR_COUNT);

    /*
     * Gradients and glow sprites depend only on the hue and the canvas width,
     * never on the audio level — that rides on globalAlpha instead. Caching them
     * turns dozens of allocations per frame into a handful for the whole run.
     */
    const waveCache = new Map<number, CanvasGradient>();
    let bandCache: HTMLCanvasElement | null = null;
    let coreCache: HTMLCanvasElement | null = null;
    let cachedHue = -1;

    const invalidateCaches = () => {
      waveCache.clear();
      bandCache = null;
      coreCache = null;
    };

    /** Left-to-right hue sweep for one waveform pass, at full opacity. */
    const waveGradient = (light: number): CanvasGradient => {
      const hit = waveCache.get(light);
      if (hit) return hit;
      const baseHue = hueRef.current;
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, `hsla(${baseHue}, 96%, ${light}%, 0)`);
      grad.addColorStop(0.5, `hsl(${(baseHue + 30) % 360}, 98%, ${light}%)`);
      grad.addColorStop(1, `hsla(${(baseHue + 60) % 360}, 96%, ${light}%, 0)`);
      waveCache.set(light, grad);
      return grad;
    };

    /** 1x64 vertical fade, stretched to whatever band height the level needs. */
    const bandSprite = (): HTMLCanvasElement => {
      if (bandCache) return bandCache;
      const sprite = document.createElement("canvas");
      sprite.width = 1;
      sprite.height = 64;
      const sctx = sprite.getContext("2d");
      if (sctx) {
        const baseHue = hueRef.current;
        const grad = sctx.createLinearGradient(0, 0, 0, 64);
        grad.addColorStop(0, `hsla(${baseHue}, 92%, 74%, 0)`);
        grad.addColorStop(0.5, `hsl(${baseHue}, 92%, 74%)`);
        grad.addColorStop(1, `hsla(${baseHue}, 92%, 74%, 0)`);
        sctx.fillStyle = grad;
        sctx.fillRect(0, 0, 1, 64);
      }
      bandCache = sprite;
      return sprite;
    };

    /** Radial core bloom, scaled up at draw time. */
    const coreSprite = (): HTMLCanvasElement => {
      if (coreCache) return coreCache;
      const size = 128;
      const half = size / 2;
      const sprite = document.createElement("canvas");
      sprite.width = size;
      sprite.height = size;
      const sctx = sprite.getContext("2d");
      if (sctx) {
        const baseHue = hueRef.current;
        const grad = sctx.createRadialGradient(half, half, 0, half, half, half);
        grad.addColorStop(0, `hsl(${baseHue}, 92%, 80%)`);
        grad.addColorStop(1, `hsla(${baseHue}, 92%, 70%, 0)`);
        sctx.fillStyle = grad;
        sctx.beginPath();
        sctx.arc(half, half, half, 0, Math.PI * 2);
        sctx.fill();
      }
      coreCache = sprite;
      return sprite;
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      invalidateCaches();
    };

    /** Horizontal oscilloscope trace — three offset harmonics travelling right. */
    const drawWaveform = () => {
      const cy = h / 2;
      const baseHue = hueRef.current;
      const amp = smoothed * Math.min(h * 0.3, 220);

      for (let i = 0; i < WAVE_POINTS; i += 1) {
        const t = i / (WAVE_POINTS - 1);
        // Travelling wave: harmonics drift right at different rates.
        const shape =
          Math.sin(t * 15 - phase * 3.4) * 0.6 +
          Math.sin(t * 31 - phase * 5.1) * 0.26 +
          Math.sin(t * 6 - phase * 1.7) * 0.34;
        // Taper the ends so the trace fades into the screen edges.
        const envelope = Math.sin(t * Math.PI) ** 0.7;
        const target = shape * envelope;
        nodes[i] += (target - nodes[i]) * 0.24;
      }

      // Three stacked passes: a bright core plus two wider, dimmer echoes.
      const passes = [
        { scale: 1, width: 2.4, alpha: 0.85, light: 84 },
        { scale: 0.62, width: 5.5, alpha: 0.24, light: 70 },
        { scale: 1.5, width: 1.2, alpha: 0.3, light: 92 },
      ];

      for (let p = 0; p < passes.length; p += 1) {
        const pass = passes[p];
        // Gradients are rebuilt only when the hue changes, not every frame;
        // the level rides on globalAlpha instead.
        const grad = waveGradient(pass.light);

        ctx.globalAlpha = pass.alpha * smoothed;
        ctx.strokeStyle = grad;
        ctx.lineWidth = pass.width;
        ctx.beginPath();
        for (let i = 0; i < WAVE_POINTS; i += 1) {
          const x = (i / (WAVE_POINTS - 1)) * w;
          const y = cy + nodes[i] * amp * pass.scale;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Vertical tick marks under the peaks — an oscilloscope grid feel.
      // Batched into one path with one stroke instead of 32 separate strokes.
      ctx.lineWidth = 1.4;
      ctx.globalAlpha = 0.22 * smoothed;
      ctx.strokeStyle = `hsl(${(baseHue + 20) % 360}, 96%, 78%)`;
      ctx.beginPath();
      for (let i = 2; i < WAVE_POINTS; i += 4) {
        const x = (i / (WAVE_POINTS - 1)) * w;
        const y = cy + nodes[i] * amp;
        const tick = Math.abs(nodes[i]) * amp * 0.4;
        if (tick < 1) continue;
        ctx.moveTo(x, y - tick);
        ctx.lineTo(x, y + tick);
      }
      ctx.stroke();

      // Soft horizontal band of light behind the trace, blitted from a cached
      // sprite so no gradient object is allocated per frame.
      ctx.globalAlpha = 0.1 * smoothed;
      ctx.drawImage(bandSprite(), 0, cy - amp, w, amp * 2);
      ctx.globalAlpha = 1;
    };

    /** Radial bars blooming out of the screen centre. */
    const drawRadial = () => {
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * (isVapor ? 0.13 : 0.19);
      const baseHue = hueRef.current;

      ctx.lineCap = "round";

      for (let i = 0; i < BAR_COUNT; i += 1) {
        const angle = (i / BAR_COUNT) * Math.PI * 2 - Math.PI / 2;
        // Standing-wave shape so the ring breathes instead of pulsing flat.
        const wave =
          0.55 + 0.45 * Math.sin(i * 0.55 + phase * 2.4) * Math.cos(i * 0.17 - phase);
        const target = smoothed * wave;
        // Vapor lags further behind for a heavier, slower swell.
        nodes[i] += (target - nodes[i]) * (isVapor ? 0.1 : 0.22);

        const length = nodes[i] * Math.min(w, h) * (isVapor ? 0.3 : 0.2);
        if (length < 0.6) continue;

        const x1 = cx + Math.cos(angle) * radius;
        const y1 = cy + Math.sin(angle) * radius;
        const x2 = cx + Math.cos(angle) * (radius + length);
        const y2 = cy + Math.sin(angle) * (radius + length);

        // Solid stroke + globalAlpha: no gradient allocation per bar per frame.
        const barHue = (baseHue + i * 1.6) % 360;
        ctx.globalAlpha = 0.42 * smoothed;
        ctx.strokeStyle = `hsl(${barHue}, 96%, 74%)`;
        ctx.lineWidth = isVapor ? 7 : 2.2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Soft core glow that swells with the chord — cached sprite.
      const glowRadius = radius * (isVapor ? 3.4 : 2.1);
      ctx.globalAlpha = 0.16 * smoothed;
      ctx.drawImage(
        coreSprite(),
        cx - glowRadius,
        cy - glowRadius,
        glowRadius * 2,
        glowRadius * 2,
      );
      ctx.globalAlpha = 1;
    };

    resize();

    let painted = false;

    const draw = () => {
      const level = levelFnRef.current();
      smoothed += (level - smoothed) * 0.16;

      if (hueRef.current !== cachedHue) {
        cachedHue = hueRef.current;
        invalidateCaches();
      }

      if (smoothed > 0.004) {
        phase += 0.02;
        ctx.clearRect(0, 0, w, h);
        painted = true;
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        if (isRidge) drawWaveform();
        else drawRadial();
        ctx.restore();
      } else if (painted) {
        // Silence: clear once, then leave the canvas untouched so the browser
        // has nothing to composite for this layer until the chime returns.
        ctx.clearRect(0, 0, w, h);
        painted = false;
      }

      raf = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [mood]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-20 h-full w-full"
      aria-hidden="true"
    />
  );
};
