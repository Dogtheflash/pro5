import { SITE, INFO_NAV, LEGAL_GROUPS } from './content'
import { navigate, useColorMode } from './router'
import { useT } from '../i18n'
import LanguageSwitcher from '../i18n/LanguageSwitcher'

const BODY_FONT = "'Manrope', ui-sans-serif, system-ui, sans-serif"

function FootLink({ slug, label }: { slug: string; label: string }) {
  return (
    <li>
      <button className="foot-link group inline-flex items-start gap-2 text-left text-[13.5px] leading-relaxed" onClick={() => navigate(slug)}>
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden className="mt-[7px] shrink-0 opacity-40 transition-opacity group-hover:opacity-100">
          <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>{label}</span>
      </button>
    </li>
  )
}

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.14em]" style={{ color: 'var(--s-fg)' }}>
      <span aria-hidden className="inline-block h-3 w-[3px] rounded-full" style={{ background: 'var(--s-accent)' }} />
      {children}
    </h3>
  )
}

export function SiteFooter() {
  const { mode, toggle } = useColorMode()
  const t = useT()
  const year = new Date().getFullYear()

  return (
    // Self-contained scope so glass tokens + dark mode work anywhere it's mounted.
    <div className={`site-scope ${mode === 'dark' ? 'dark' : ''}`} style={{ fontFamily: BODY_FONT }}>
      <footer className="relative mt-16" style={{ color: 'var(--s-fg)' }} aria-labelledby="site-footer-heading">
        <h2 id="site-footer-heading" className="sr-only">Site footer</h2>

        <div className="glass-strong">
          <div className="mx-auto max-w-6xl px-6 py-16">

            {/* Top band: brand + newsletter */}
            <div className="grid gap-12 border-b pb-12 lg:grid-cols-[1.3fr_1fr]" style={{ borderColor: 'var(--s-border)' }}>
              <div>
                <div className="flex items-center gap-3">
                  <span aria-hidden className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-lg" style={{ background: 'var(--s-accent)', color: '#fff' }}>◑</span>
                  <span className="font-display text-3xl" style={{ fontFamily: "'Fraunces', serif" }}>{SITE.name}</span>
                </div>
                <p className="mt-5 max-w-sm text-[15px] leading-relaxed" style={{ color: 'var(--s-muted)' }}>{SITE.tagline}</p>
              </div>

              <div>
                <label className="text-[12px] font-extrabold uppercase tracking-[0.14em]" style={{ color: 'var(--s-fg)' }}>{t('newsletter')}</label>
                <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: 'var(--s-muted)' }}>{SITE.tagline}</p>
                <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    aria-label="Email address"
                    className="glass min-w-0 flex-1 rounded-2xl px-5 py-3.5 text-[15px] outline-none transition focus:ring-2"
                    style={{ color: 'var(--s-fg)' }}
                  />
                  <button className="lift shrink-0 rounded-2xl px-7 py-3.5 text-[14px] font-bold" style={{ background: 'var(--s-accent)', color: '#fff' }}>
                    {t('join')}
                  </button>
                </form>
              </div>
            </div>

            {/* Link columns: Information + 3 policy sub-groups = 4-col grid */}
            <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              <nav aria-label={t('information')}>
                <ColumnHeading>{t('information')}</ColumnHeading>
                <ul className="space-y-3">
                  {INFO_NAV.map((n) => <FootLink key={n.slug} slug={n.slug} label={n.label} />)}
                </ul>
              </nav>

              {LEGAL_GROUPS.map((group) => (
                <nav key={group.title} aria-label={group.title}>
                  <ColumnHeading>{group.title}</ColumnHeading>
                  <ul className="space-y-3">
                    {group.links.map((n) => <FootLink key={n.slug} slug={n.slug} label={n.label} />)}
                  </ul>
                </nav>
              ))}
            </div>

            {/* Preferences */}
            <div className="mt-12 flex flex-wrap items-center gap-3">
              <LanguageSwitcher />
              <button
                onClick={toggle}
                className="lift inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-[13.5px]"
                aria-label={mode === 'dark' ? t('lightMode') : t('darkMode')}
              >
                <span aria-hidden>{mode === 'dark' ? '☀' : '☾'}</span>
                {mode === 'dark' ? t('lightMode') : t('darkMode')}
              </button>
            </div>

            {/* Bottom bar */}
            <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t pt-6 sm:flex-row sm:items-center" style={{ borderColor: 'var(--s-border)' }}>
              <p className="text-[12.5px]" style={{ color: 'var(--s-muted)' }}>{t('allRights', { year, name: SITE.legalName })}</p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12.5px]">
                <button className="foot-link" onClick={() => navigate('privacy-policy')}>{t('privacy')}</button>
                <button className="foot-link" onClick={() => navigate('cookie-policy')}>{t('cookies')}</button>
                <button className="foot-link" onClick={() => navigate('terms-of-service')}>{t('terms')}</button>
                <button className="foot-link" onClick={() => navigate('help')}>{t('help') ?? 'Help'}</button>
              </div>
            </div>

          </div>
        </div>
      </footer>
    </div>
  )
}
