import { useCallback, useEffect, useRef, useState } from 'react'
import { useColorMode } from './site/router'
import { useLocale, useT, detectBrowserLocale, getLocaleMeta, baseOf, type Locale } from './i18n'

// ─── Language Detection & Switching Modal ───────────────────────────────────
// On first visit, detects the browser language; if it maps to a supported
// Southeast-Asian locale that differs from the current one, offers a premium
// glassmorphism modal to switch. Switching goes through the centralized i18n
// store, so the whole site updates at once — no reload. Shown once, then
// remembered. `onSwitch` optionally bridges the choice to the host app.

const SEEN_KEY = 'langModalSeen'

// "vi-VN" → "Vietnamese (Vietnam)", generated dynamically via Intl.
function describeLocale(locale: string): string {
  try {
    const [lang, region] = locale.split('-')
    const langName = new Intl.DisplayNames(['en'], { type: 'language' }).of(lang) ?? lang
    const cap = langName.charAt(0).toUpperCase() + langName.slice(1)
    if (region) {
      const regionName = new Intl.DisplayNames(['en'], { type: 'region' }).of(region.toUpperCase())
      if (regionName) return `${cap} (${regionName})`
    }
    return cap
  } catch {
    return locale
  }
}

function GlobeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export default function LanguageDetectModal({ onSwitch }: { onSwitch?: (code: string) => void }) {
  const { code, setLocale } = useLocale()
  const { mode } = useColorMode()
  const t = useT()
  const currentMeta = getLocaleMeta(code)

  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [suggestion, setSuggestion] = useState<{ lang: Locale; description: string } | null>(null)
  const [dontShow, setDontShow] = useState(true)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ text: string; closing: boolean } | null>(null)

  const cardRef = useRef<HTMLDivElement>(null)
  const primaryRef = useRef<HTMLButtonElement>(null)
  const lastFocused = useRef<Element | null>(null)

  // ── Detection (once per visitor) ───────────────────────────────────────
  useEffect(() => {
    if (localStorage.getItem(SEEN_KEY)) return
    const rawLocale = navigator.language || (navigator.languages && navigator.languages[0]) || 'en'
    const detectedCode = detectBrowserLocale()
    if (!detectedCode) return
    if (baseOf(detectedCode) === baseOf(code)) return // already appropriate
    lastFocused.current = document.activeElement
    setSuggestion({ lang: getLocaleMeta(detectedCode), description: describeLocale(rawLocale) })
    const id = window.setTimeout(() => setOpen(true), 600)
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const finish = useCallback((remember: boolean) => {
    if (remember) localStorage.setItem(SEEN_KEY, '1')
    setClosing(true)
    window.setTimeout(() => {
      setOpen(false)
      setClosing(false)
      ;(lastFocused.current as HTMLElement | null)?.focus?.()
    }, 210)
  }, [])

  const showToast = useCallback((text: string) => {
    setToast({ text, closing: false })
    window.setTimeout(() => setToast((x) => (x ? { ...x, closing: true } : x)), 2400)
    window.setTimeout(() => setToast(null), 2750)
  }, [])

  const handleSwitch = useCallback(() => {
    if (!suggestion) return
    setLoading(true)
    // Brief indicator, then switch translations live across the whole site.
    window.setTimeout(() => {
      setLocale(suggestion.lang.code)
      onSwitch?.(suggestion.lang.code)
      setLoading(false)
      finish(true)
      showToast(t('langChanged'))
    }, 480)
  }, [suggestion, setLocale, onSwitch, finish, showToast, t])

  const dismiss = useCallback(() => finish(dontShow), [finish, dontShow])

  // Keyboard: ESC + focus trap + autofocus
  useEffect(() => {
    if (!open) return
    primaryRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        dismiss()
      } else if (e.key === 'Tab') {
        const f = cardRef.current?.querySelectorAll<HTMLElement>('button, input, [href], [tabindex]:not([tabindex="-1"])')
        if (!f || f.length === 0) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, dismiss])

  return (
    <>
      {open && suggestion && (
        <div className={`site-scope ${mode === 'dark' ? 'dark' : ''}`} role="presentation">
          <div
            className="lang-overlay fixed inset-0 z-[9999] flex items-center justify-center p-4"
            data-closing={closing}
            style={{ background: 'rgba(10, 8, 6, 0.5)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) dismiss()
            }}
          >
            <div
              ref={cardRef}
              className="lang-card glass-strong relative w-full max-w-md rounded-3xl p-7"
              data-closing={closing}
              role="dialog"
              aria-modal="true"
              aria-labelledby="lang-modal-title"
              aria-describedby="lang-modal-desc"
              style={{ color: 'var(--s-fg)' }}
            >
              <button
                onClick={dismiss}
                aria-label={t('close')}
                className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full glass lift"
                style={{ color: 'var(--s-fg)' }}
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 3l9 9M12 3l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
              </button>

              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest" style={{ color: 'var(--s-accent)' }}>
                <GlobeIcon />
                {t('langRecommend')}
              </div>

              <h2 id="lang-modal-title" className="font-display mt-3" style={{ fontSize: '1.7rem', lineHeight: 1.1 }}>
                {t('chooseLanguage')}
              </h2>

              <div className="mt-5 flex items-center justify-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-4xl leading-none" aria-hidden>{currentMeta.flag}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--s-muted)' }}>{t('current')}</span>
                  <span className="text-xs">{currentMeta.label}</span>
                </div>
                <svg width="28" height="16" viewBox="0 0 28 16" fill="none" aria-hidden style={{ color: 'var(--s-accent)' }}>
                  <path d="M2 8h22M18 3l6 5-6 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-4xl leading-none" aria-hidden>{suggestion.lang.flag}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--s-accent)' }}>{t('suggested')}</span>
                  <span className="text-xs font-semibold">{suggestion.lang.native}</span>
                </div>
              </div>

              <p id="lang-modal-desc" className="mt-5 text-center leading-relaxed" style={{ color: 'var(--s-muted)' }}>
                {t('browserNote', { locale: suggestion.description, lang: suggestion.lang.label })}
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  ref={primaryRef}
                  onClick={handleSwitch}
                  disabled={loading}
                  className="lift inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-mono text-sm uppercase tracking-wider disabled:opacity-70"
                  style={{ background: 'var(--s-accent)', color: '#fff' }}
                >
                  {loading ? (
                    <>
                      <span className="lang-spin inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white" aria-hidden />
                      {t('switching')}
                    </>
                  ) : (
                    t('switchTo', { lang: suggestion.lang.label })
                  )}
                </button>
                <button
                  onClick={dismiss}
                  disabled={loading}
                  className="lift rounded-full px-6 py-3 font-mono text-sm uppercase tracking-wider glass"
                  style={{ color: 'var(--s-fg)' }}
                >
                  {t('stayIn', { lang: currentMeta.label })}
                </button>
              </div>

              <label className="mt-5 flex items-center justify-center gap-2 text-xs cursor-pointer select-none" style={{ color: 'var(--s-muted)' }}>
                <input type="checkbox" checked={dontShow} onChange={(e) => setDontShow(e.target.checked)} style={{ accentColor: 'var(--s-accent)' }} />
                {t('dontShowAgain')}
              </label>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`site-scope ${mode === 'dark' ? 'dark' : ''}`}>
          <div
            role="status"
            aria-live="polite"
            className="lang-toast glass-strong fixed left-1/2 bottom-6 z-[10000] flex items-center gap-2.5 rounded-full px-5 py-3 text-sm"
            data-closing={toast.closing}
            style={{ color: 'var(--s-fg)' }}
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full" style={{ background: 'var(--s-accent)', color: '#fff' }} aria-hidden>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            {toast.text}
          </div>
        </div>
      )}
    </>
  )
}
