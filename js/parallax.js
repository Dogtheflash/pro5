/* ============================================================
   iOS 26 Loading Screen — Parallax Motion Handler
   ============================================================ */
'use strict';

export const parallax = { x: 0, y: 0 };

export function initParallax() {
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
  let raf = 0;
  const bgLayer = document.getElementById('bg-layer');

  function onMove(e) {
    targetX = (e.clientX / window.innerWidth) * 2 - 1;
    targetY = (e.clientY / window.innerHeight) * 2 - 1;
  }
  function onOrientation(e) {
    const gamma = e.gamma || 0;
    const beta = e.beta || 0;
    targetX = Math.max(-1, Math.min(1, gamma / 35));
    targetY = Math.max(-1, Math.min(1, (beta - 45) / 35));
  }
  function loop() {
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;
    parallax.x = currentX;
    parallax.y = currentY;
    if (bgLayer) {
      bgLayer.style.transform = 'translate3d(' + (currentX * -26) + 'px, ' + (currentY * -26) + 'px, 0) scale(1.08)';
    }
    const bootEl = document.getElementById('stage-boot');
    if (bootEl && bootEl.style.display !== 'none') {
      bootEl.style.transform = 'translate3d(' + (currentX * 14) + 'px, ' + (currentY * 14) + 'px, 0)';
    }
    raf = requestAnimationFrame(loop);
  }
  window.addEventListener('pointermove', onMove);
  window.addEventListener('deviceorientation', onOrientation);
  raf = requestAnimationFrame(loop);

  return function cleanup() {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('deviceorientation', onOrientation);
    cancelAnimationFrame(raf);
  };
}
