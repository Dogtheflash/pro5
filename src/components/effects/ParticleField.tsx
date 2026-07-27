import { useEffect, useRef } from "react";

import type { AuroraMood } from "@/lib/aurora";

type Particle = {
  x: number;
  y: number;
  z: number;
  r: number;
  vy: number;
  vx: number;
  /** Offset from the base hue so the wallpaper tint can change live. */
  hue: number;
  twinkle: number;
};

type MoodConfig = {
  /** Multiplier applied to the requested particle count. */
  density: number;
  /** Base radius multiplier. */
  size: number;
  /** Vertical drift speed. Negative values rise. */
  rise: number;
  /** Horizontal drift speed. */
  sway: number;
  /** Hue spread across the field, in degrees. */
  spread: number;
  /** Glow radius multiplier — bigger reads as softer, foggier motes. */
  bloom: number;
  /** Motion-blur trail length in frames. 0 disables streaks. */
  trail: number;
  /** Twinkle speed. */
  flicker: number;
};

const MOODS: Record<AuroraMood, MoodConfig> = {
  nebula: {
    density: 1,
    size: 1,
    rise: -1,
    sway: 1,
    spread: 90,
    bloom: 6,
    trail: 0,
    flicker: 1,
  },
  ridge: {
    density: 1.45,
    size: 0.7,
    rise: -2.6,
    sway: 3.4,
    spread: 46,
    bloom: 3.4,
    trail: 13,
    flicker: 2.1,
  },
  vapor: {
    density: 0.6,
    size: 2.3,
    rise: -0.34,
    sway: 0.5,
    spread: 150,
    bloom: 10,
    trail: 0,
    flicker: 0.4,
  },
};

type Props = {
  /** 0..1 — higher energy speeds up drift and brightens particles. */
  energy?: number;
  count?: number;
  /** Base hue in degrees, so motes match the chosen wallpaper tint. */
  hue?: number;
  /** Atmosphere preset controlling density, speed, size and trails. */
  mood?: AuroraMood;
  /** User-controlled drift multiplier, 0.5x – 2.0x. */
  speed?: number;
};

/** Sprite resolution for the pre-rendered glow. 64px covers the largest mote. */
const SPRITE_SIZE = 64;
/** Hues are bucketed so a handful of sprites cover the whole field. */
const HUE_STEP = 15;

/**
 * Pre-renders one glow-plus-core sprite per hue bucket. Building a radial
 * gradient per particle per frame is the single most expensive thing a canvas
 * field can do; blitting a cached sprite instead is roughly an order of
 * magnitude cheaper and keeps the completion burst at a solid frame rate.
 */
function buildSprites(coreRatio: number): HTMLCanvasElement[] {
  const sprites: HTMLCanvasElement[] = [];
  const half = SPRITE_SIZE / 2;

  for (let hue = 0; hue < 360; hue += HUE_STEP) {
    const sprite = document.createElement("canvas");
    sprite.width = SPRITE_SIZE;
    sprite.height = SPRITE_SIZE;
    const sctx = sprite.getContext("2d");
    if (!sctx) continue;

    const grad = sctx.createRadialGradient(half, half, 0, half, half, half);
    // Baked at partial alpha so the caller's globalAlpha lands on the same
    // brightness the old per-frame gradient produced.
    grad.addColorStop(0, `hsla(${hue}, 95%, 82%, 0.66)`);
    grad.addColorStop(1, `hsla(${hue}, 95%, 70%, 0)`);
    sctx.fillStyle = grad;
    sctx.beginPath();
    sctx.arc(half, half, half, 0, Math.PI * 2);
    sctx.fill();

    sctx.fillStyle = "#ffffff";
    sctx.beginPath();
    sctx.arc(half, half, Math.max(0.5, half * coreRatio), 0, Math.PI * 2);
    sctx.fill();

    sprites.push(sprite);
  }

  return sprites;
}

/** Canvas starfield of drifting glowing motes with depth, twinkle and moods. */
export const ParticleField = ({
  energy = 0.4,
  count = 90,
  hue = 220,
  mood = "nebula",
  speed = 1,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const energyRef = useRef<number>(energy);
  const hueRef = useRef<number>(hue);
  const speedRef = useRef<number>(speed);

  useEffect(() => {
    energyRef.current = energy;
  }, [energy]);

  useEffect(() => {
    hueRef.current = hue;
  }, [hue]);

  // Held in a ref so dragging the slider retunes the field without reseeding it.
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cfg = MOODS[mood];
    const total = Math.max(12, Math.round(count * cfg.density));

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    // The field is entirely soft glows, so 1.5x is indistinguishable from 2x
    // while shading ~45% fewer pixels per frame.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const particles: Particle[] = [];
    const sprites = buildSprites(0.5 / cfg.bloom);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      particles.length = 0;
      for (let i = 0; i < total; i += 1) {
        const z = Math.random();
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: (0.5 + z * 2.1) * cfg.size,
          vy: -(0.08 + z * 0.55) * -cfg.rise,
          // Ridge biases every mote the same way so the field reads as one flow.
          vx:
            cfg.trail > 0
              ? (0.45 + z * 0.75) * cfg.sway
              : (Math.random() - 0.5) * 0.22 * cfg.sway,
          hue: (Math.random() - 0.5) * cfg.spread,
          twinkle: Math.random() * Math.PI * 2,
        });
      }
    };

    resize();
    seed();

    const draw = () => {
      const e = energyRef.current;
      const s = speedRef.current;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      for (const p of particles) {
        if (!reduce) {
          p.y += p.vy * (0.6 + e * 2.4) * s;
          p.x += p.vx * (0.6 + e * 1.6) * s;
          p.twinkle += (0.03 + p.z * 0.05) * cfg.flicker * s;
          if (p.y < -10) {
            p.y = h + 10;
            p.x = Math.random() * w;
          }
          if (p.y > h + 10) {
            p.y = -10;
            p.x = Math.random() * w;
          }
          if (p.x < -20) p.x = w + 20;
          if (p.x > w + 20) p.x = -20;
        }

        const alpha =
          (0.18 + p.z * 0.5) * (0.6 + 0.4 * Math.sin(p.twinkle)) * (0.5 + e * 0.7);
        const tint = (hueRef.current + p.hue + 360) % 360;
        const glow = p.r * cfg.bloom;

        if (cfg.trail > 0) {
          // Streak: a line along the mote's own velocity vector. Solid stroke
          // with globalAlpha rather than a fresh gradient every frame.
          // Trails stretch with speed, so 2x genuinely reads as faster.
          const tailX = p.x - p.vx * cfg.trail * (0.6 + e) * s;
          const tailY = p.y - p.vy * cfg.trail * (0.6 + e) * s;
          ctx.globalAlpha = alpha * 0.75;
          ctx.strokeStyle = `hsl(${tint}, 98%, 84%)`;
          ctx.lineWidth = p.r * 1.5;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }

        const sprite = sprites[Math.floor(tint / HUE_STEP) % sprites.length];
        if (sprite) {
          ctx.globalAlpha = Math.min(alpha * 1.5, 0.9);
          ctx.drawImage(sprite, p.x - glow, p.y - glow, glow * 2, glow * 2);
        }
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(draw);
    };

    const onResize = () => {
      resize();
      seed();
    };

    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [count, mood]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
};
