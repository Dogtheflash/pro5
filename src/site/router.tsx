import { useSyncExternalStore } from 'react'

// ─── Tiny hash router ──────────────────────────────────────────────────────
// Footer pages live at  #/p/<slug>  (articles at #/p/magazine/<slug>).
// Keeping it hash-based means it drops into any static host with zero config
// and coexists with the existing `#lang-demo` preview route.

export const PAGE_PREFIX = '#/p/'

export function navigate(slug: string) {
  window.location.hash = PAGE_PREFIX + slug
  // hashchange fires async; scroll handled by the page shell on mount.
}

function subscribe(cb: () => void) {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}
function getHash() {
  return window.location.hash
}

/** Returns the current page slug, or null when we're on the main app. */
export function useRoute(): string | null {
  const hash = useSyncExternalStore(subscribe, getHash, () => '')
  if (hash.startsWith(PAGE_PREFIX)) return decodeURIComponent(hash.slice(PAGE_PREFIX.length))
  return null
}

// ─── Dark mode ─────────────────────────────────────────────────────────────
const MODE_KEY = 'siteColorMode'

function modeSubscribe(cb: () => void) {
  window.addEventListener('site-mode', cb)
  window.addEventListener('storage', cb)
  return () => {
    window.removeEventListener('site-mode', cb)
    window.removeEventListener('storage', cb)
  }
}
function getMode(): 'light' | 'dark' {
  const saved = localStorage.getItem(MODE_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useColorMode() {
  const mode = useSyncExternalStore(modeSubscribe, getMode, () => 'light' as const)
  const toggle = () => {
    const next = getMode() === 'dark' ? 'light' : 'dark'
    localStorage.setItem(MODE_KEY, next)
    window.dispatchEvent(new Event('site-mode'))
  }
  return { mode, toggle }
}
