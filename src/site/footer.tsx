import { useState } from 'react'
import { SITE, INFO_NAV, LEGAL_NAV } from './content'
import { navigate, useColorMode } from './router'
import { useT } from '../i18n'
import LanguageSwitcher from '../i18n/LanguageSwitcher'
import Tx from '../i18n/Tx'

function FootLink({ slug, label }: { slug: string; label: string }) {
  return (
    <li className="w-full">
      <button className="foot-link text-sm text-left w-full flex items-start" onClick={() => navigate(slug)}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden className="mt-1 flex-shrink-0"><path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span className="flex-1 text-left leading-snug"><Tx>{label}</Tx></span>
      </button>
    </li>
  )
}

export function SiteFooter() {
  const { mode, toggle } = useColorMode()
  const t = useT()
  const [showAll, setShowAll] = useState(false)
  const shownLegal = showAll ? LEGAL_NAV : LEGAL_NAV.slice(0, 12)
  const year = new Date().getFullYear()

  return (
    // Self-contained scope so glass tokens + dark mode work anywhere it's mounted.
    <div className={`site-scope ${mode === 'dark' ? 'dark' : ''}`}>
      <footer className="relative mt-16" style={{ color: 'var(--s-fg)' }} aria-labelledby="site-footer-heading">
        <h2 id="site-footer-heading" className="sr-only">Site footer</h2>

        <div className="glass-strong">
          <div className="max-w-6xl mx-auto px-4 py-14">
            <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1.6fr] items-start">
              {/* Brand + newsletter */}
              <div className="text-left">
                <div className="flex items-center gap-2 font-display text-2xl">
                  <span aria-hidden className="inline-flex w-8 h-8 items-center justify-center rounded-md" style={{ background: 'var(--s-accent)', color: '#fff' }}>◑</span>
                  {SITE.name}
                </div>
                <p className="mt-4 max-w-xs text-left" style={{ color: 'var(--s-muted)' }}><Tx>{SITE.tagline}</Tx></p>

                <form className="mt-6 max-w-xs text-left" onSubmit={(e) => e.preventDefault()}>
                  <label className="font-mono text-[11px] uppercase tracking-widest block text-left" style={{ color: 'var(--s-muted)' }}>{t('newsletter')}</label>
                  <div className="mt-2 flex glass rounded-full overflow-hidden p-1">
                    <input type="email" required placeholder="you@email.com" aria-label="Email address" className="flex-1 bg-transparent px-4 outline-none text-sm text-left" style={{ color: 'var(--s-fg)' }} />
                    <button className="px-4 py-2 rounded-full text-sm font-mono uppercase tracking-wider lift cursor-pointer" style={{ background: 'var(--s-accent)', color: '#fff' }}>{t('join')}</button>
                  </div>
                </form>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <LanguageSwitcher />
                  <button
                    onClick={toggle}
                    className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm lift cursor-pointer"
                    aria-label={mode === 'dark' ? t('lightMode') : t('darkMode')}
                  >
                    <span aria-hidden>{mode === 'dark' ? '☀' : '☾'}</span>
                    {mode === 'dark' ? t('lightMode') : t('darkMode')}
                  </button>
                </div>
              </div>

              {/* Column 1: Information */}
              <nav aria-label={t('information')} className="text-left">
                <h3 className="font-mono text-[11px] uppercase tracking-widest mb-4 text-left" style={{ color: 'var(--s-accent)' }}>{t('information')}</h3>
                <ul className="space-y-2.5 text-left">
                  {INFO_NAV.map((n) => <FootLink key={n.slug} slug={n.slug} label={n.label} />)}
                </ul>
              </nav>

              {/* Column 2: Terms & Policies */}
              <nav aria-label={t('termsPolicies')} className="text-left">
                <h3 className="font-mono text-[11px] uppercase tracking-widest mb-4 text-left" style={{ color: 'var(--s-accent)' }}>{t('termsPolicies')}</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 items-start text-left">
                  {shownLegal.map((n) => <FootLink key={n.slug} slug={n.slug} label={n.label} />)}
                </ul>
                {!showAll && (
                  <button onClick={() => setShowAll(true)} className="mt-5 link-underline font-mono text-xs uppercase tracking-wider block text-left cursor-pointer" style={{ color: 'var(--s-accent)' }}>
                    + {t('showAllPolicies', { n: LEGAL_NAV.length })}
                  </button>
                )}
              </nav>
            </div>

            {/* Bottom bar */}
            <div className="mt-12 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ borderTop: '1px solid var(--s-border)' }}>
              <p className="text-xs font-mono" style={{ color: 'var(--s-muted)' }}>{t('allRights', { year, name: SITE.legalName })}</p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono">
                <button className="foot-link" onClick={() => navigate('privacy-policy')}>{t('privacy')}</button>
                <button className="foot-link" onClick={() => navigate('cookie-policy')}>{t('cookies')}</button>
                <button className="foot-link" onClick={() => navigate('terms-of-service')}>{t('terms')}</button>
                <button className="foot-link" onClick={() => navigate('accessibility')}>{t('accessibility')}</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
