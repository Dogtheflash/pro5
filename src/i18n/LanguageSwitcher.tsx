import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocale, useT } from './index'
import type { Locale } from './index'
import { useColorMode } from '../site/router'

// Global language switcher for the Southeast-Asian travel platform.
// - Globe trigger showing the active flag + native name
// - Searchable, keyboard-navigable flyout (desktop) / bottom sheet (mobile)
// - Fade + scale animation, active row highlighted with an accent + checkmark
// - Reads/writes the centralized store, so a selection re-renders every
//   subscribed surface at once (chrome via useT, editorial/legal via <Tx>,
//   dates & currency via useFormat) with no reload, and persists to storage.
export default function LanguageSwitcher({ compact = false, forceDark = false }: { compact?: boolean; forceDark?: boolean }) {
  const { code, meta, setLocale, locales } = useLocale()
  const { mode } = useColorMode()
  const dark = forceDark || mode === 'dark'
  const t = useT()

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0) // highlighted index for keyboard nav
  const [isMobile, setIsMobile] = useState(false)

  const rootRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // Filter by native name, English label, or code.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return locales
    return locales.filter(
      (l) =>
        l.native.toLowerCase().includes(q) ||
        l.label.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q),
    )
  }, [query, locales])

  // When opening: reset the query and highlight the current language.
  useEffect(() => {
    if (!open) return
    setQuery('')
    const idx = locales.findIndex((l) => l.code === code)
    setActive(idx < 0 ? 0 : idx)
    const id = requestAnimationFrame(() => searchRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [open, code, locales])

  // Keep the highlighted index in range as the filter narrows.
  useEffect(() => {
    setActive((a) => Math.min(a, Math.max(0, filtered.length - 1)))
  }, [filtered.length])

  // Outside-click close (desktop). The sheet has its own backdrop.
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  // Lock body scroll while the mobile sheet is up.
  useEffect(() => {
    if (!open || !isMobile) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open, isMobile])

  function choose(l: Locale) {
    setLocale(l.code)
    setOpen(false)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setOpen(false)
      return
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!filtered.length) return
      setActive((a) => {
        const next = e.key === 'ArrowDown' ? (a + 1) % filtered.length : (a - 1 + filtered.length) % filtered.length
        listRef.current?.querySelectorAll('[role=option]')[next]?.scrollIntoView({ block: 'nearest' })
        return next
      })
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const pick = filtered[active]
      if (pick) choose(pick)
    }
  }

  function Row({ l, i }: { l: Locale; i: number }) {
    const isActive = l.code === code
    const isHi = i === active
    return (
      <li role="option" aria-selected={isActive}>
        <button
          type="button"
          onClick={() => choose(l)}
          onMouseEnter={() => setActive(i)}
          className="ls-opt flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left"
          style={{
            background: isActive ? 'var(--s-accent)' : isHi ? 'var(--s-hi)' : 'transparent',
            color: isActive ? '#fff' : 'var(--s-fg)',
          }}
        >
          <span className="text-xl leading-none">{l.flag}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[15px] font-600 leading-tight">{l.native}</span>
            <span className="block truncate text-xs leading-tight" style={{ opacity: isActive ? 0.85 : 0.6 }}>
              {l.label}
            </span>
          </span>
          {isActive && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M13 4.5L6.5 11 3 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </li>
    )
  }

  const panelBody = (
    <>
      <div className="p-2" style={{ borderBottom: '1px solid var(--s-border)' }}>
        <div className="glass flex items-center gap-2 rounded-xl px-3 py-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden style={{ color: 'var(--s-muted)' }}>
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t('search')}
            aria-label={t('search')}
            role="combobox"
            aria-expanded
            aria-controls="ls-listbox"
            className="w-full bg-transparent text-sm outline-none"
            style={{ color: 'var(--s-fg)' }}
          />
        </div>
      </div>
      <ul
        id="ls-listbox"
        ref={listRef}
        role="listbox"
        aria-label={t('chooseLanguage')}
        className="max-h-[min(60vh,22rem)] overflow-y-auto p-1.5"
      >
        {filtered.length ? (
          filtered.map((l, i) => <Row key={l.code} l={l} i={i} />)
        ) : (
          <li className="px-3 py-6 text-center text-sm" style={{ color: 'var(--s-muted)' }}>
            —
          </li>
        )}
      </ul>
    </>
  )

  return (
    <div className={`site-scope ${dark ? 'dark' : ''} relative inline-block`} ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('chooseLanguage')}
        className="glass lift inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2"
        style={{ color: 'var(--s-fg)', ['--tw-ring-color' as string]: 'var(--s-accent)' }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden style={{ color: 'var(--s-accent)' }}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
          <path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18" stroke="currentColor" strokeWidth="1.8" />
        </svg>
        <span className="text-base leading-none">{meta.flag}</span>
        {!compact && <span className="hidden font-600 sm:inline">{meta.native}</span>}
        <span className={`text-[10px] transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden>
          ▾
        </span>
      </button>

      {/* Desktop flyout */}
      {open && !isMobile && (
        <div
          className="ls-flyout glass-strong absolute right-0 z-[70] mt-2 w-72 overflow-hidden rounded-2xl"
          role="dialog"
          aria-label={t('chooseLanguage')}
        >
          {panelBody}
        </div>
      )}

      {/* Mobile bottom sheet (portaled so it escapes header stacking contexts) */}
      {open &&
        isMobile &&
        createPortal(
          <div className={`site-scope ${dark ? 'dark' : ''}`}>
            <div
              className="ls-backdrop fixed inset-0 z-[90]"
              style={{ background: 'rgba(0,0,0,0.45)' }}
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <div
              className="ls-sheet glass-strong fixed inset-x-0 bottom-0 z-[91] max-h-[85vh] overflow-hidden rounded-t-3xl pb-[env(safe-area-inset-bottom)]"
              role="dialog"
              aria-modal="true"
              aria-label={t('chooseLanguage')}
            >
              <div className="flex justify-center pt-3">
                <div className="h-1.5 w-10 rounded-full" style={{ background: 'var(--s-border)' }} aria-hidden />
              </div>
              <div className="flex items-center justify-between px-4 py-2">
                <h2 className="text-sm font-700" style={{ color: 'var(--s-fg)' }}>
                  {t('chooseLanguage')}
                </h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t('close')}
                  className="rounded-full px-2 py-1 text-lg"
                  style={{ color: 'var(--s-muted)' }}
                >
                  ✕
                </button>
              </div>
              {panelBody}
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}
