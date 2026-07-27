import { useEffect, useState } from "react";

export type ParallaxOffset = { x: number; y: number };

/**
 * Tracks normalized pointer position (-1..1) with smooth easing,
 * used to drive depth parallax on background and foreground layers.
 */
export function usePointerParallax(): ParallaxOffset {
  const [offset, setOffset] = useState<ParallaxOffset>({ x: 0, y: 0 });

  useEffect(() => {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const onOrientation = (e: DeviceOrientationEvent) => {
      const gamma = e.gamma ?? 0;
      const beta = e.beta ?? 0;
      targetX = Math.max(-1, Math.min(1, gamma / 35));
      targetY = Math.max(-1, Math.min(1, (beta - 45) / 35));
    };

    const loop = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      setOffset({ x: currentX, y: currentY });
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("deviceorientation", onOrientation);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("deviceorientation", onOrientation);
      cancelAnimationFrame(raf);
    };
  }, []);

  return offset;
}
