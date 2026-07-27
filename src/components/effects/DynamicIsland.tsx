/**
 * iOS 26 Dynamic Island — the idle hardware cutout only.
 *
 * Deliberately inert: no live activities, no expansion, no tap target. It reads
 * as part of the device bezel rather than a running app.
 */
export const DynamicIsland = () => {
  return (
    <div className="pointer-events-none fixed left-1/2 top-3 z-40 -translate-x-1/2">
      {/* Soft light bloom the island casts onto the wallpaper behind it */}
      <span className="island-bloom" aria-hidden="true" />

      <div className="island island-pill" aria-hidden="true">
        {/* Specular highlight along the top edge of the glass */}
        <span className="island-specular" />
        {/* Front camera lens */}
        <span className="island-lens" />
      </div>
    </div>
  );
};
