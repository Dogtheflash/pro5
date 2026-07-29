import { useEffect, useRef, useState } from 'react'

/**
 * iOS 26 "Liquid Glass" loading screen.
 *
 * A living gradient mesh drifts behind a frosted, spring-loaded glass squircle
 * with a rotating specular highlight. A progress pill fills with fluid easing,
 * then the whole screen dismisses with the signature blur-and-scale reveal.
 */
export default function LoadingScreen({ onDone, montage = [] }: { onDone: () => void; montage?: string[] }) {
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const [dismissing, setDismissing] = useState(false)
  const [scene, setScene] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const duration = 2600
    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      // easeOutExpo — quick lead, long graceful settle, very Apple
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      setProgress(eased)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setTimeout(() => setReady(true), 300)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Cinematic montage — cycle characteristic moments from each country.
  useEffect(() => {
    if (montage.length === 0) return
    const id = setInterval(() => setScene((s) => (s + 1) % montage.length), 2200)
    return () => clearInterval(id)
  }, [montage.length])

  const pct = Math.round(progress * 100)

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-[#0d0a08] ${dismissing ? 'ios-dismiss' : ''}`}
      style={{ width: '100vw', height: '100dvh' }}
      onAnimationEnd={(e) => {
        if (e.animationName === 'ios-dismiss') onDone()
      }}
      aria-label="Loading"
      role="status"
    >
      {/* Deep base ground */}
      <div className="absolute inset-0 bg-[#0d0a08]" />

      {/* Cinematic montage — characteristic moments from each country */}
      <div className="absolute inset-0 overflow-hidden">
        {montage.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden="true"
            className={`kenburns-active absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-in-out ${
              i === scene ? 'opacity-40' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* Living gradient mesh — drifting color blobs */}
      <div className="absolute inset-0">
        <div className="ios-blob-a absolute left-1/2 top-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#c0392b_0%,transparent_62%)] opacity-70 blur-3xl" />
        <div className="ios-blob-b absolute left-1/3 top-2/3 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#e8894a_0%,transparent_60%)] opacity-55 blur-3xl" />
        <div className="ios-blob-c absolute left-2/3 top-1/4 h-[55vmax] w-[55vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#7b2d8e_0%,transparent_60%)] opacity-45 blur-3xl" />
      </div>

      {/* Subtle grain / vignette for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />

      {/* Foreground stack */}
      <div className="relative flex h-full w-full flex-col items-center justify-center px-6">
        {/* Glass squircle app-mark */}
        <div className="ios-spring-in relative">
          {/* Breathing glow behind the glass */}
          <div className="ios-breathe absolute -inset-8 rounded-[42%] bg-[radial-gradient(circle,rgba(224,137,74,0.6),transparent_70%)] blur-2xl" />

          <div
            className="relative flex h-32 w-32 items-center justify-center overflow-hidden border border-white/25 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.6)]"
            style={{
              borderRadius: '34px',
              background:
                'linear-gradient(145deg, rgba(255,255,255,0.22), rgba(255,255,255,0.04))',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
            }}
          >
            {/* Rotating specular sweep */}
            <div
              className="ios-specular absolute -inset-1/2 opacity-70"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.5) 40deg, transparent 90deg, transparent 360deg)',
              }}
            />
            {/* Glass edge highlight */}
            <div
              className="absolute inset-0"
              style={{ borderRadius: '34px', boxShadow: 'inset 0 -12px 24px rgba(0,0,0,0.25)' }}
            />
            {/* The mark — a torii, nodding to the journal within */}
            <span className="relative font-display text-6xl font-600 leading-none text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
              鳥
            </span>
          </div>
        </div>

        {/* Wordmark */}
        <div className="ios-rise mt-10 text-center" style={{ animationDelay: '0.35s' }}>
          <h1 className="ios-shimmer-text font-display text-3xl font-600 tracking-tight">
            The Asia Grand Tour
          </h1>
        </div>
        <div
          className="ios-rise mt-2 text-center"
          style={{ animationDelay: '0.5s' }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-white/55">
            Ten Countries · One Journey
          </p>
        </div>

        {/* Progress pill → Start button */}
        <div className="mt-12 flex h-20 w-64 max-w-[70vw] items-start justify-center">
          {ready ? (
            <button
              type="button"
              onClick={() => setDismissing(true)}
              className="ios-spring-in group relative flex items-center gap-3 overflow-hidden rounded-full border border-white/25 px-9 py-3.5 font-mono text-sm uppercase tracking-[0.25em] text-white transition-transform duration-300 ease-out hover:scale-[1.04] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.28), rgba(255,255,255,0.06))',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                boxShadow:
                  '0 14px 40px -10px rgba(232,137,74,0.5), inset 0 1px 1px rgba(255,255,255,0.6)',
              }}
            >
              {/* Sheen sweeping on hover */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.5),transparent)] transition-transform duration-700 ease-out group-hover:translate-x-full" />
              <span className="relative">Start</span>
              <span className="relative text-base transition-transform duration-300 ease-out group-hover:translate-x-1">
                →
              </span>
            </button>
          ) : (
            <div className="ios-rise w-full" style={{ animationDelay: '0.65s' }}>
              <div
                className="relative h-2 w-full overflow-hidden rounded-full border border-white/15"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              >
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: 'linear-gradient(90deg, #e8894a, #ffd9b3)',
                    boxShadow: '0 0 16px rgba(232,137,74,0.7)',
                    transition: 'width 90ms linear',
                  }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-white/50">
                <span>Preparing your itinerary</span>
                <span className="tabular-nums text-white/70">{pct}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
