import { useCallback } from "react";
import { Gauge } from "lucide-react";

export const SPEED_MIN = 0.5;
export const SPEED_MAX = 2;

type Props = {
  value: number;
  onChange: (speed: number) => void;
  /** Slides in once the boot sequence has finished. */
  visible: boolean;
};

/** Glass slider controlling how fast the particle field drifts. */
export const SpeedSlider = ({ value, onChange, visible }: Props) => {
  const handle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(e.target.value));
    },
    [onChange],
  );

  if (!visible) return null;

  const fill = ((value - SPEED_MIN) / (SPEED_MAX - SPEED_MIN)) * 100;

  return (
    <div className="picker-in speed-bar pointer-events-auto flex items-center gap-3">
      <Gauge className="h-3.5 w-3.5 shrink-0 text-white/45" strokeWidth={2.4} />

      <input
        type="range"
        min={SPEED_MIN}
        max={SPEED_MAX}
        step={0.05}
        value={value}
        onChange={handle}
        className="speed-range"
        style={{ "--fill": `${fill}%` } as React.CSSProperties}
        aria-label="Particle speed"
        aria-valuetext={`${value.toFixed(2)} times speed`}
      />

      <span className="w-[42px] shrink-0 text-right text-[11px] font-semibold tabular-nums tracking-tight text-white/70">
        {value.toFixed(2)}x
      </span>
    </div>
  );
};
