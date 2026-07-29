import { useEffect, useRef, useState } from 'react'
import { useLocale, useT } from './index'
import { useColorMode } from '../site/router'

// Global language switcher — Southeast Asian locales only. Reads/writes the
// centralized store, so selecting a language re-renders every subscribed
// surface at once (no reload). Glassmorphism + dark-mode aware.
export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { code, meta, setLocale, locales } = useLocale()
  const { mode } = useColorMode()
  const t = useT()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className={`site-scope ${mode === 'dark' ? 'dark' : ''} relative inline-block`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('chooseLanguage')}
        className="glass lift inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-xs"
        style={{ color: 'var(--s-fg)' }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden style={{ color: 'var(--s-accent)' }}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
          <path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18" stroke="currentColor" strokeWidth="1.8" />
        </svg>
        <span className="text-base leading-none">{meta.flag}</span>
        {!compact && <span className="hidden sm:inline">{meta.native}</span>}
        <span className={`text-[10px] transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden>▾</span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t('chooseLanguage')}
          className="glass-strong absolute right-0 z-[60] mt-2 max-h-80 w-60 overflow-y-auto rounded-2xl p-1.5"
        >
          {locales.map((l) => {
            const active = l.code === code
            return (
              <li key={l.code} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    setLocale(l.code)
                    setOpen(false)
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors"
                  style={{ background: active ? 'var(--s-accent)' : 'transparent', color: active ? '#fff' : 'var(--s-fg)' }}
                >
                  <span className="text-lg leading-none">{l.flag}</span>
                  <span className="flex-1">
                    <span className="block font-mono text-xs leading-tight">{l.label}</span>
                    <span className="block text-sm leading-tight" style={{ opacity: active ? 0.9 : 0.7 }}>{l.native}</span>
                  </span>
                  {active && <span className="text-xs">✓</span>}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
