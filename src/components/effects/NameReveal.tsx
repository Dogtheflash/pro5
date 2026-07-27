const NAME = "Tú Xinh Trai";

/** Per-letter stagger, in milliseconds. */
const STEP = 62;
/** Delay before the first letter appears, so the logo lands first. */
const LEAD = 620;
/** Entrance duration — used to start the idle bob only after landing. */
const ENTER_MS = 900;

const LETTERS = Array.from(NAME);
const DOTS = [0, 1, 2];

/**
 * The signature line that sits under the Apple mark.
 *
 * Each letter materialises with a springy iOS easing curve (transform/opacity
 * only — no filter blur, so the GPU just composites), then keeps drifting
 * gently on the same element. One span per letter, two animations.
 */
export const NameReveal = () => {
  return (
    <div className="name-wrap" aria-label={`${NAME}...`}>
      <span className="name-halo" aria-hidden="true" />

      {LETTERS.map((char, i) => {
        const enterDelay = LEAD + i * STEP;
        return (
          <span
            key={`${char}-${i}`}
            className="name-glyph"
            style={
              {
                "--enter": `${enterDelay}ms`,
                // Idle bob begins only once the entrance has settled.
                "--bob": `${enterDelay + ENTER_MS + i * 110}ms`,
              } as React.CSSProperties
            }
            aria-hidden="true"
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}

      <span className="name-dots" aria-hidden="true">
        {DOTS.map((d) => (
          <span
            key={d}
            className="name-dot"
            style={
              {
                "--d": `${LEAD + LETTERS.length * STEP + d * 190}ms`,
              } as React.CSSProperties
            }
          />
        ))}
      </span>
    </div>
  );
};
