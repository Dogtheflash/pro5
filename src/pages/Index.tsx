import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { RotateCcw, Volume2 } from "lucide-react";

import { ChimeVisualizer } from "@/components/effects/ChimeVisualizer";
import { DynamicIsland } from "@/components/effects/DynamicIsland";
import { ParticleField } from "@/components/effects/ParticleField";
import { RippleLayer } from "@/components/effects/RippleLayer";
import { SpeedSlider } from "@/components/effects/SpeedSlider";
import { StatusBar } from "@/components/effects/StatusBar";
import { NameReveal } from "@/components/effects/NameReveal";
import { useHaptics } from "@/hooks/useHaptics";
import { usePointerParallax } from "@/hooks/usePointerParallax";
import { useStartupChime } from "@/hooks/useStartupChime";
import { buildAuroraColors, hexToHue, type AuroraMood } from "@/lib/aurora";

/** Chime length in ms — kept in sync with useStartupChime's DURATION. */
const CHIME_MS = 4200;

/** Fixed wallpaper: a pink bloom in the heavy, slow-drifting vapor atmosphere. */
const AURORA_HEX = "#f0399c";
const MOOD: AuroraMood = "vapor";

const AURORA_STYLE: CSSProperties = (() => {
  const [c1, c2, c3, c4] = buildAuroraColors(AURORA_HEX);
  return {
    "--aurora-1": c1,
    "--aurora-2": c2,
    "--aurora-3": c3,
    "--aurora-4": c4,
  } as CSSProperties;
})();

const AURORA_HUE = hexToHue(AURORA_HEX);

type Stage = "boot" | "hello" | "ready";

const APPLE_PATH =
  "M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z";

const BOOT_LINES: readonly string[] = [
  "Preparing iOS 26…",
  "Mounting Liquid Glass…",
  "Calibrating Taptic Engine…",
  "Restoring your Apple ID…",
  "Almost there…",
];

/** Simulated boot progress with Apple-like uneven pacing. */
function useBootProgress(active: boolean, runKey: number, onComplete: () => void) {
  const [progress, setProgress] = useState<number>(0);
  const rafRef = useRef<number>(0);
  const doneRef = useRef<boolean>(false);
  // Kept in a ref so an unstable callback can never restart the animation loop.
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    if (!active) {
      setProgress(0);
      return;
    }
    doneRef.current = false;
    setProgress(0);
    const start = performance.now();
    const duration = 4800;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased =
        t < 0.35
          ? t * 1.8
          : t < 0.55
            ? 0.63 + (t - 0.35) * 0.35
            : t < 0.8
              ? 0.7 + (t - 0.55) * 0.6
              : 0.85 + (t - 0.8) * 0.75;
      setProgress(Math.min(eased, 1));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else if (!doneRef.current) {
        doneRef.current = true;
        completeRef.current();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, runKey]);

  return progress;
}

const Index = () => {
  const [stage, setStage] = useState<Stage>("boot");
  const [runKey, setRunKey] = useState<number>(0);
  const [flash, setFlash] = useState<boolean>(false);
  const timersRef = useRef<number[]>([]);

  const parallax = usePointerParallax();
  const { tap, settle } = useHaptics();
  const chime = useStartupChime();
  const [soundBlocked, setSoundBlocked] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const pickSpeed = useCallback(
    (next: number) => {
      setSpeed(next);
      // Detent tick when the slider passes through 1.00x.
      if (Math.abs(next - 1) < 0.03) tap("light");
    },
    [tap],
  );

  const schedule = useCallback((fn: () => void, delay: number) => {
    timersRef.current.push(window.setTimeout(fn, delay));
  }, []);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const handleBootComplete = useCallback(() => {
    // Startup chime fires in lockstep with the heavy haptic at 100%.
    chime.play();
    setSoundBlocked(!chime.isUnlocked());
    tap("heavy");
    setFlash(true);
    schedule(() => setFlash(false), 700);
    schedule(() => setStage("hello"), 340);
    // Soft double pulse as the chime's tail dies away — the device "settling".
    schedule(settle, CHIME_MS);
    schedule(() => setStage("ready"), 4200);
  }, [chime, schedule, settle, tap]);

  const progress = useBootProgress(stage === "boot", runKey, handleBootComplete);

  const replay = useCallback(() => {
    tap("medium");
    setSoundBlocked(false);
    clearTimers();
    setStage("boot");
    setRunKey((k) => k + 1);
  }, [clearTimers, tap]);

  const lineIndex = Math.min(
    BOOT_LINES.length - 1,
    Math.floor(progress * BOOT_LINES.length),
  );

  const energy = stage === "boot" ? 0.25 + progress * 0.85 : stage === "hello" ? 1 : 0.5;

  return (
    <div
      className={`mood-${MOOD} relative min-h-screen w-full overflow-hidden bg-black font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Helvetica_Neue',sans-serif] antialiased`}
      style={AURORA_STYLE}
    >
      <div className="relative flex min-h-screen w-full items-center justify-center">
        {/* Ambient depth background */}
        <div
          className="pointer-events-none absolute inset-0 will-change-transform"
          style={{
            transform: `translate3d(${parallax.x * -26}px, ${parallax.y * -26}px, 0) scale(1.08)`,
          }}
        >
          <div className="aurora aurora-1" />
          <div className="aurora aurora-2" />
          <div className="aurora aurora-3" />
          <div className="aurora aurora-4" />
          <div className="mesh-grid absolute inset-0" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_28%,rgba(0,0,0,0.9)_100%)]" />
        </div>

        <ParticleField energy={energy} hue={AURORA_HUE} mood={MOOD} speed={speed} />
        {/* Frosted glass pane over the wallpaper — the iOS depth layer */}
        <div className="screen-glass pointer-events-none absolute inset-0" />
        <div className="top-frost pointer-events-none absolute inset-x-0 top-0 h-40" />
        <div className="noise pointer-events-none absolute inset-0" />
        <div className="scanline pointer-events-none absolute inset-0" />

        {/* Shockwave rings burst outward from the logo the moment boot lands */}
        {flash && (
          <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center">
            <span className="shockwave" />
            <span className="shockwave" style={{ animationDelay: "140ms" }} />
            <span className="shockwave" style={{ animationDelay: "280ms" }} />
          </div>
        )}

        {flash && (
          <div className="flash pointer-events-none absolute inset-0 z-30 bg-white" />
        )}

        {/* ===== BOOT ===== */}
        {stage === "boot" && (
          <div
            key={runKey}
            className="relative z-10 flex flex-col items-center"
            style={{
              transform: `translate3d(${parallax.x * 14}px, ${parallax.y * 14}px, 0)`,
            }}
          >
            <button
              onClick={() => tap("light")}
              className="logo-enter relative cursor-pointer"
              aria-label="Apple logo"
            >
              <div className="halo absolute inset-0 -m-14 rounded-full" />
              <span className="pulse-ring" />
              <span className="pulse-ring" style={{ animationDelay: "1.3s" }} />
              <span className="pulse-ring" style={{ animationDelay: "2.6s" }} />

              <div className="logo-breathe absolute inset-0 scale-[1.6] rounded-full bg-white/10 blur-3xl" />
              <svg
                viewBox="0 0 384 512"
                className="logo-float relative h-28 w-28 md:h-32 md:w-32"
              >
                <defs>
                  <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="45%" stopColor="#e8e8ee" />
                    <stop offset="70%" stopColor="#b9bac4" />
                    <stop offset="100%" stopColor="#d9dae2" />
                  </linearGradient>
                  <linearGradient
                    id="shine"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="white" stopOpacity="0" />
                    <stop offset="45%" stopColor="white" stopOpacity="0" />
                    <stop offset="50%" stopColor="white" stopOpacity="0.95" />
                    <stop offset="55%" stopColor="white" stopOpacity="0" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                    <animateTransform
                      attributeName="gradientTransform"
                      type="translate"
                      from="-384 0"
                      to="384 0"
                      dur="2.6s"
                      repeatCount="indefinite"
                    />
                  </linearGradient>
                  <clipPath id="appleClip">
                    <path d={APPLE_PATH} />
                  </clipPath>
                </defs>
                <path
                  d={APPLE_PATH}
                  fill="none"
                  stroke="rgba(255,255,255,0.85)"
                  strokeWidth="6"
                  className="logo-trace"
                />
                <path d={APPLE_PATH} fill="url(#chrome)" className="logo-fill" />
                <rect
                  width="384"
                  height="512"
                  clipPath="url(#appleClip)"
                  fill="url(#shine)"
                />
              </svg>
            </button>

            {/* Signature line, directly beneath the Apple mark */}
            <div className="mt-9">
              <NameReveal />
            </div>

            {/* Progress */}
            <div className="progress-enter mt-12 w-60 md:w-72">
              <div className="relative h-[5px] w-full overflow-hidden rounded-full bg-white/12 backdrop-blur-sm">
                <div
                  className="relative h-full rounded-full bg-white"
                  style={{ width: `${progress * 100}%` }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/40 via-white to-white" />
                  <div className="absolute -right-1 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white blur-[3px]" />
                </div>
                <div className="bar-sheen absolute inset-0" />
              </div>

              <div className="mt-5 flex h-5 items-center justify-center">
                <p
                  key={lineIndex}
                  className="line-swap text-[13px] font-medium tracking-wide text-white/45"
                >
                  {BOOT_LINES[lineIndex]}
                </p>
              </div>
              <p className="mt-1 text-center text-[11px] font-semibold tracking-[0.2em] text-white/25 tabular-nums">
                {Math.round(progress * 100)}%
              </p>
            </div>
          </div>
        )}

        {/* ===== HELLO ===== */}
        {stage === "hello" && (
          <div className="relative z-10 flex flex-col items-center px-6">
            <svg
              viewBox="0 0 520 200"
              className="hello-fade w-[330px] md:w-[460px]"
              aria-label="hello"
            >
              <defs>
                <linearGradient id="helloGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7dd3fc">
                    <animate
                      attributeName="stop-color"
                      values="#7dd3fc;#f9a8d4;#fcd34d;#7dd3fc"
                      dur="6s"
                      repeatCount="indefinite"
                    />
                  </stop>
                  <stop offset="50%" stopColor="#c4b5fd">
                    <animate
                      attributeName="stop-color"
                      values="#c4b5fd;#fcd34d;#7dd3fc;#c4b5fd"
                      dur="6s"
                      repeatCount="indefinite"
                    />
                  </stop>
                  <stop offset="100%" stopColor="#fcd34d">
                    <animate
                      attributeName="stop-color"
                      values="#fcd34d;#7dd3fc;#c4b5fd;#fcd34d"
                      dur="6s"
                      repeatCount="indefinite"
                    />
                  </stop>
                </linearGradient>
                <filter id="helloGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <text
                x="50%"
                y="62%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="hello-text"
                fill="none"
                stroke="url(#helloGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#helloGlow)"
              >
                hello
              </text>
            </svg>
            <p className="hello-sub mt-6 text-[14px] font-medium tracking-[0.25em] text-white/35">
              H E L L O
            </p>
          </div>
        )}

        {/* ===== READY ===== */}
        {stage === "ready" && (
          <div className="relative z-10 flex flex-col items-center gap-8 px-6">
            <div className="done-rise flex flex-col items-center gap-3">
              <p className="text-[42px] font-thin tracking-[-0.03em] text-white">
                iOS 26
              </p>
              <p className="text-[14px] font-medium tracking-wide text-white/45">
                Tap the Dynamic Island to explore
              </p>
            </div>

            <button
              onClick={replay}
              onPointerDown={() => tap("light")}
              className="glass-btn group relative overflow-hidden rounded-full px-8 py-3.5 text-[15px] font-semibold text-white transition-transform duration-200 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                <RotateCcw className="h-4 w-4" strokeWidth={2.5} />
                Replay boot animation
              </span>
              <span className="btn-sheen pointer-events-none absolute inset-0" />
            </button>

            <button
              onClick={() => {
                chime.play();
                setSoundBlocked(false);
                tap("heavy");
              }}
              className="done-rise flex items-center gap-2 text-[12px] font-medium tracking-wide text-white/40 transition-colors hover:text-white/75"
            >
              <Volume2 className="h-3.5 w-3.5" strokeWidth={2.5} />
              {soundBlocked ? "Tap to hear the startup chime" : "Play startup chime"}
            </button>
          </div>
        )}
      </div>

      {/* Fixed chrome overlays */}
      <StatusBar />
      <ChimeVisualizer getLevel={chime.getLevel} hue={AURORA_HUE} mood={MOOD} />
      <RippleLayer />
      <DynamicIsland />
      <div className="pointer-events-none fixed inset-x-0 bottom-7 z-30 flex justify-center px-5">
        <SpeedSlider value={speed} onChange={pickSpeed} visible={stage === "ready"} />
      </div>
    </div>
  );
};

export default Index;
