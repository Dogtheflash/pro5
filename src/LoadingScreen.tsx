import { useEffect, useRef, useState } from 'react'

interface SEAGreeting {
  flag: string
  text: string
  lang: string
  roman: string
}

const SEA_GREETINGS: SEAGreeting[] = [
  { flag: '🇻🇳', text: 'Xin Chào', lang: 'Vietnam', roman: 'Xin Chào' },
  { flag: '🇹🇭', text: 'สวัสดี', lang: 'Thailand', roman: 'Sawatdee' },
  { flag: '🇮🇩', text: 'Selamat Datang', lang: 'Indonesia', roman: 'Selamat Datang' },
  { flag: '🇵🇭', text: 'Mabuhay', lang: 'Philippines', roman: 'Mabuhay' },
  { flag: '🇰🇭', text: 'សួស្ដី', lang: 'Cambodia', roman: 'Suostei' },
  { flag: '🇱🇦', text: 'ສະບາຍດີ', lang: 'Laos', roman: 'Sabaidee' },
  { flag: '🇲🇲', text: 'မင်္ဂလာပါ', lang: 'Myanmar', roman: 'Mingalaba' },
  { flag: '🇲🇾', text: 'Apa Khabar', lang: 'Malaysia', roman: 'Apa Khabar' },
  { flag: '🇸🇬', text: 'Welcome', lang: 'Singapore', roman: 'Welcome' },
  { flag: '🇧🇳', text: 'Selamat Datang', lang: 'Brunei', roman: 'Selamat Datang' },
  { flag: '🇹🇱', text: 'Bem-vindo', lang: 'East Timor', roman: 'Bem-vindo' },
  { flag: '🇯🇵', text: 'こんにちは', lang: 'Japan', roman: 'Konnichiwa' },
  { flag: '🇨🇳', text: '你好', lang: 'China', roman: 'Nǐ Hǎo' },
]

/**
 * iOS 26 "Liquid Glass" loading screen with dynamic Southeast Asian greetings.
 *
 * A living gradient mesh drifts behind a frosted, spring-loaded glass squircle
 * with a rotating specular highlight. After ~2 seconds, greetings automatically
 * switch through all Southeast Asian languages with smooth transitions.
 */
export default function LoadingScreen({ onDone, montage = [] }: { onDone: () => void; montage?: string[] }) {
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const [dismissing, setDismissing] = useState(false)
  const [scene, setScene] = useState(0)
  const [greetingIdx, setGreetingIdx] = useState(0)
  const [fadeGreeting, setFadeGreeting] = useState(true)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const duration = 3000
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

  // Wait about 2 seconds, then cycle greetings every 1.6s
  useEffect(() => {
    let interval: NodeJS.Timeout
    const initialTimer = setTimeout(() => {
      interval = setInterval(() => {
        setFadeGreeting(false)
        setTimeout(() => {
          setGreetingIdx((prev) => (prev + 1) % SEA_GREETINGS.length)
          setFadeGreeting(true)
        }, 220)
      }, 1600)
    }, 2000)

    return () => {
      clearTimeout(initialTimer)
      if (interval) clearInterval(interval)
    }
  }, [])

  const pct = Math.round(progress * 100)
  const currentGreeting = SEA_GREETINGS[greetingIdx]

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
            className="relative flex h-36 w-36 items-center justify-center overflow-hidden border border-white/25 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.6)] p-3"
            style={{
              borderRadius: '38px',
              background:
                'linear-gradient(145deg, rgba(255,255,255,0.22), rgba(255,255,255,0.04))',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
            }}
          >
            {/* Rotating specular sweep */}
            <div
              className="ios-specular absolute -inset-1/2 opacity-70 pointer-events-none"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.5) 40deg, transparent 90deg, transparent 360deg)',
              }}
            />
            {/* Glass edge highlight */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ borderRadius: '38px', boxShadow: 'inset 0 -12px 24px rgba(0,0,0,0.25)' }}
            />
            {/* Dynamic greeting mark with smooth crossfade */}
            <div
              className={`relative flex flex-col items-center justify-center text-center transition-all duration-300 ${
                fadeGreeting ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
              <span className="text-4xl leading-none drop-shadow-md mb-1">{currentGreeting.flag}</span>
              <span className="font-display text-sm font-600 text-white leading-tight max-w-[110px] truncate drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                {currentGreeting.text}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Country Greeting Pill */}
        <div
          className={`ios-rise mt-5 text-center transition-all duration-300 ${
            fadeGreeting ? 'opacity-100 translateY(0)' : 'opacity-0 translateY(2px)'
          }`}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-mono text-xs text-white/90 backdrop-blur-md shadow-lg">
            <span>{currentGreeting.flag}</span>
            <span className="font-600">{currentGreeting.lang}</span>
            <span className="text-white/40">·</span>
            <span className="text-amber-300 font-medium">{currentGreeting.roman}</span>
          </span>
        </div>

        {/* Wordmark */}
        <div className="ios-rise mt-6 text-center" style={{ animationDelay: '0.35s' }}>
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
        <div className="mt-10 flex h-20 w-64 max-w-[70vw] items-start justify-center">
          {ready ? (
            <button
              type="button"
              onClick={() => setDismissing(true)}
              className="ios-spring-in group relative flex items-center gap-3 overflow-hidden rounded-full border border-white/25 px-9 py-3.5 font-mono text-sm uppercase tracking-[0.25em] text-white transition-transform duration-300 ease-out hover:scale-[1.04] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 cursor-pointer"
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
