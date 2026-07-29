import { useEffect, useRef, useState } from 'react'

// ─── Standalone language-switcher demo ────────────────────────────────────
// Mirrors the plain HTML/CSS/JS version, but as a previewable React page.
// It fetches the per-language JSON files served from /lang-demo/locales/.
// Open it in the running app at:  <preview-url>/#lang-demo

const LANGS = [
  { code: 'vi', flag: '🇻🇳', name: 'Tiếng Việt' },
  { code: 'id', flag: '🇮🇩', name: 'Bahasa Indonesia' },
  { code: 'th', flag: '🇹🇭', name: 'ไทย' },
  { code: 'ms', flag: '🇲🇾', name: 'Bahasa Melayu' },
  { code: 'fil', flag: '🇵🇭', name: 'Filipino' },
  { code: 'km', flag: '🇰🇭', name: 'ភាសាខ្មែរ' },
  { code: 'lo', flag: '🇱🇦', name: 'ລາວ' },
  { code: 'my', flag: '🇲🇲', name: 'မြန်မာ' },
  { code: 'en', flag: '🇸🇬', name: 'English' },
]
const DEFAULT_LANG = 'en'
const STORAGE_KEY = 'preferredLang'
const LOCALE_PATH = '/lang-demo/locales'

type Dict = Record<string, unknown>

// Saved choice → browser language → default.
function detectLang(): string {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && LANGS.some((l) => l.code === saved)) return saved
  const nav = (navigator.language || '').toLowerCase()
  const base = nav.split('-')[0]
  const match = LANGS.find((l) => l.code === nav || l.code === base)
  return match ? match.code : DEFAULT_LANG
}

function get(obj: Dict, path: string): string | undefined {
  const v = path.split('.').reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Dict)[k] : undefined), obj)
  return typeof v === 'string' ? v : undefined
}

export default function LangSwitcherDemo() {
  const [lang, setLang] = useState(detectLang)
  const [dict, setDict] = useState<Dict>({})
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const cache = useRef<Record<string, Dict>>({})
  const rootRef = useRef<HTMLDivElement>(null)

  // Load the active locale (cached), then translate.
  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!cache.current[lang]) {
        const res = await fetch(`${LOCALE_PATH}/${lang}.json`)
        cache.current[lang] = await res.json()
      }
      if (!cancelled) setDict(cache.current[lang])
    }
    run()
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
    return () => {
      cancelled = true
    }
  }, [lang])

  // Close when clicking outside / pressing Escape.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const current = LANGS.find((l) => l.code === lang)!
  const t = (key: string, fallback: string) => get(dict, key) ?? fallback
  const filtered = LANGS.filter(
    (l) => l.name.toLowerCase().includes(query.trim().toLowerCase()) || l.code.includes(query.trim().toLowerCase()),
  )

  const accent = '#0a7d6b'

  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8', color: '#1a1a1a', fontFamily: 'system-ui, sans-serif' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          background: '#fff',
          borderBottom: '1px solid #e3e6ea',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 16 }}>The Asia Grand Tour</span>

        <div ref={rootRef} style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setOpen((o) => !o)
              setQuery('')
            }}
            aria-haspopup="listbox"
            aria-expanded={open}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              height: 36,
              padding: '0 12px',
              background: '#fff',
              border: `1px solid ${open ? accent : '#d7dbe0'}`,
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              color: '#1a1a1a',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>{current.flag}</span>
            <span>{current.code.toUpperCase()}</span>
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              aria-hidden="true"
              style={{ transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none', color: '#6b7280' }}
            >
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>

          {open && (
            <div
              role="listbox"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: 260,
                background: '#fff',
                border: '1px solid #e3e6ea',
                borderRadius: 12,
                boxShadow: '0 8px 28px rgba(0,0,0,.14)',
                overflow: 'hidden',
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 12px',
                  borderBottom: '1px solid #eef0f3',
                  color: '#6b7280',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search language"
                  style={{ border: 0, outline: 0, width: '100%', fontSize: 14, color: '#1a1a1a', background: 'transparent' }}
                />
              </div>

              <ul style={{ listStyle: 'none', margin: 0, padding: 6, maxHeight: 320, overflowY: 'auto' }}>
                {filtered.map((l) => {
                  const selected = l.code === lang
                  return (
                    <li
                      key={l.code}
                      role="option"
                      aria-selected={selected}
                      onClick={() => {
                        setLang(l.code)
                        setOpen(false)
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '9px 10px',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: selected ? 600 : 400,
                        background: selected ? 'rgba(10,125,107,.08)' : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (!selected) e.currentTarget.style.background = '#f2f4f7'
                      }}
                      onMouseLeave={(e) => {
                        if (!selected) e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <span style={{ fontSize: 16, lineHeight: 1 }}>{l.flag}</span>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</span>
                      <span style={{ marginLeft: 'auto', color: selected ? accent : '#9aa1ab', fontSize: 12, textTransform: 'uppercase' }}>
                        {selected ? '✓' : l.code}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px' }}>
        <h1 style={{ fontSize: 34, margin: '0 0 12px' }}>{t('hero.title', 'Welcome to the Asia Grand Tour')}</h1>
        <p style={{ fontSize: 18, color: '#4b5563', margin: '0 0 28px' }}>{t('hero.subtitle', 'Plan your trip across Southeast Asia.')}</p>
        <button style={{ background: accent, color: '#fff', border: 0, borderRadius: 10, padding: '12px 22px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          {t('cta.explore', 'Explore now')}
        </button>
        <input
          type="text"
          placeholder={t('search.placeholder', 'Search destinations')}
          style={{ display: 'block', marginTop: 24, width: '100%', maxWidth: 360, padding: '11px 14px', border: '1px solid #d7dbe0', borderRadius: 10, fontSize: 15 }}
        />
      </main>
    </div>
  )
}
