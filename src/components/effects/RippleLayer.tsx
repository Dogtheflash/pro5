import { useCallback, useEffect, useRef, useState } from "react";

type Ripple = { id: number; x: number; y: number };

/** Expanding glass ripple wherever the user taps anywhere on screen. */
export const RippleLayer = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const idRef = useRef<number>(0);

  const remove = useCallback((id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const id = (idRef.current += 1);
      setRipples((prev) => [...prev.slice(-5), { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => remove(id), 1000);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [remove]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {ripples.map((r) => (
        <span
          key={r.id}
          className="ripple"
          style={{ left: r.x, top: r.y }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};
