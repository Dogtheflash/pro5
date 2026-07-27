import { useEffect, useMemo, useState } from "react";

/** Minimal iOS lock-screen digital clock + indicators flanking the Dynamic Island. */
export const StatusBar = () => {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    let id = 0;

    /**
     * Re-aligns to the next whole second on every tick, so the clock never
     * drifts the way a plain 1000ms interval does after tab throttling.
     */
    const scheduleNextTick = () => {
      const next = new Date();
      setNow(next);
      id = window.setTimeout(scheduleNextTick, 1000 - (next.getTime() % 1000));
    };

    const onVisibility = () => {
      if (document.visibilityState !== "visible") return;
      window.clearTimeout(id);
      scheduleNextTick();
    };

    scheduleNextTick();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearTimeout(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const time = useMemo<string>(
    () =>
      now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    [now],
  );

  const seconds = useMemo<string>(
    () => String(now.getSeconds()).padStart(2, "0"),
    [now],
  );

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex h-[58px] items-center justify-between px-7">
      {/* Digital clock, left of the island */}
      <div className="status-in flex items-baseline gap-[3px] text-white">
        <span className="text-[15px] font-semibold tracking-[-0.01em] tabular-nums">
          {time}
        </span>
        <span className="text-[10px] font-medium tabular-nums text-white/35">
          {seconds}
        </span>
      </div>

      {/* Signal · wifi · battery, right of the island */}
      <div className="status-in flex items-center gap-[7px] text-white/85">
        <span className="flex items-end gap-[2px]">
          {[5, 8, 11, 14].map((h, i) => (
            <span
              key={h}
              className="w-[3px] rounded-[1px]"
              style={{
                height: h,
                background: i < 3 ? "currentColor" : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </span>

        <svg viewBox="0 0 18 14" className="h-[13px] w-[16px]" aria-hidden="true">
          <path
            d="M9 12.4 6.7 9.9a3.3 3.3 0 0 1 4.6 0Z"
            fill="currentColor"
          />
          <path
            d="M4.4 7.4a6.6 6.6 0 0 1 9.2 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M1.9 4.7a10.2 10.2 0 0 1 14.2 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>

        <span className="relative flex h-[12px] w-[24px] items-center rounded-[4px] border border-white/40 px-[2px]">
          <span className="battery-fill h-[7px] rounded-[2px]" />
          <span className="absolute -right-[3px] h-[4px] w-[1.5px] rounded-r-sm bg-white/40" />
        </span>
      </div>
    </div>
  );
};
