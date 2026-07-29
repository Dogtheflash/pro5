import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  SITE, INFO_NAV, LEGAL_NAV, POLICIES, ABOUT, STATS, ARTICLES, NEWS, NEWS_CATEGORIES, SITEMAP, HELP,
  type LegalPage as LegalPageData, type Article,
} from './content'
import { navigate, useColorMode } from './router'
import { SiteFooter } from './footer'
import { useT } from '../i18n'
import { Tx } from '../i18n/Tx'
import LanguageSwitcher from '../i18n/LanguageSwitcher'

// ─── SEO / head management ──────────────────────────────────────────────────
function useSEO(opts: { title: string; description: string; type?: string; jsonLd?: object }) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = `${opts.title} · ${SITE.name}`

    const metas: HTMLMetaElement[] = []
    const set = (attr: 'name' | 'property', key: string, content: string) => {
      const m = document.createElement('meta')
      m.setAttribute(attr, key)
      m.setAttribute('content', content)
      document.head.appendChild(m)
      metas.push(m)
    }
    set('name', 'description', opts.description)
    set('property', 'og:title', opts.title)
    set('property', 'og:description', opts.description)
    set('property', 'og:type', opts.type ?? 'website')
    set('property', 'og:site_name', SITE.name)
    set('name', 'twitter:card', 'summary_large_image')

    let ld: HTMLScriptElement | null = null
    if (opts.jsonLd) {
      ld = document.createElement('script')
      ld.type = 'application/ld+json'
      ld.textContent = JSON.stringify(opts.jsonLd)
      document.head.appendChild(ld)
    }
    return () => {
      document.title = prevTitle
      metas.forEach((m) => m.remove())
      ld?.remove()
    }
  }, [opts.title, opts.description, opts.type, opts.jsonLd])
}

const readingTime = (words: number) => Math.max(1, Math.round(words / 220))

// ─── Shared chrome ──────────────────────────────────────────────────────────
function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="no-print inline-flex items-center justify-center w-9 h-9 rounded-full glass lift"
      style={{ color: 'var(--s-fg)' }}
    >
      {children}
    </button>
  )
}

function shareCurrent(title: string) {
  const url = window.location.href
  if (navigator.share) navigator.share({ title, url }).catch(() => {})
  else navigator.clipboard?.writeText(url).then(() => alert('Link copied to clipboard'))
}

function Breadcrumb({ trail }: { trail: { label: string; slug?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="no-print">
      <ol className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--s-muted)' }}>
        {trail.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            {c.slug !== undefined ? (
              <button className="link-underline" onClick={() => (c.slug === '' ? backToApp() : navigate(c.slug!))} style={{ color: 'inherit' }}>
                {c.label}
              </button>
            ) : (
              <span style={{ color: 'var(--s-fg)' }}>{c.label}</span>
            )}
            {i < trail.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

function backToApp() {
  window.location.hash = ''
}

// Top bar: brand, back, dark-mode toggle. Sticky + glass.
function TopBar() {
  const { mode, toggle } = useColorMode()
  const t = useT()
  return (
    <header className="no-print sticky top-0 z-30 glass-strong">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={backToApp} className="flex items-center gap-2 font-display text-lg" style={{ color: 'var(--s-fg)' }} aria-label={t('backToJournal')}>
          <span aria-hidden className="inline-flex w-7 h-7 items-center justify-center rounded-md" style={{ background: 'var(--s-accent)', color: '#fff' }}>◑</span>
          {SITE.name}
        </button>
        <div className="flex items-center gap-2">
          <LanguageSwitcher compact />
          <IconBtn label={t('back')} onClick={() => window.history.length > 1 ? window.history.back() : backToApp()}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </IconBtn>
          <IconBtn label={mode === 'dark' ? t('lightMode') : t('darkMode')} onClick={toggle}>
            {mode === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.4" /><g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6L13 13M13 3l-1.4 1.4M4.4 11.6L3 13" /></g></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.5 9.5A5.5 5.5 0 016.5 2.5a5.5 5.5 0 107 7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
            )}
          </IconBtn>
        </div>
      </div>
    </header>
  )
}

// Full-height scoped shell with scroll-to-top on mount + background.
function Shell({ children }: { children: ReactNode }) {
  const { mode } = useColorMode()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])
  return (
    <div className={`site-scope ${mode === 'dark' ? 'dark' : ''}`} style={{ minHeight: '100vh', background: 'var(--s-bg)', color: 'var(--s-fg)', fontFamily: 'var(--font-body)' }}>
      {/* soft ambient glow behind the glass */}
      <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', background: 'radial-gradient(60% 50% at 15% 0%, color-mix(in srgb, var(--s-accent) 14%, transparent), transparent 70%), radial-gradient(50% 40% at 100% 20%, color-mix(in srgb, var(--s-accent-2) 12%, transparent), transparent 70%)' }} />
      <div style={{ position: 'relative' }}>
        <TopBar />
        <main className="page-rise">{children}</main>
        <SiteFooter />
      </div>
    </div>
  )
}

function ActionRow({ title }: { title: string }) {
  const t = useT()
  return (
    <div className="no-print flex items-center gap-2">
      <IconBtn label={t('print')} onClick={() => window.print()}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6V2h8v4M4 12H3a1 1 0 01-1-1V8a1 1 0 011-1h10a1 1 0 011 1v3a1 1 0 01-1 1h-1M4 10h8v4H4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
      </IconBtn>
      <IconBtn label={t('share')} onClick={() => shareCurrent(title)}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="4" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.4" /><circle cx="12" cy="4" r="1.8" stroke="currentColor" strokeWidth="1.4" /><circle cx="12" cy="12" r="1.8" stroke="currentColor" strokeWidth="1.4" /><path d="M5.6 7.1l4.8-2.2M5.6 8.9l4.8 2.2" stroke="currentColor" strokeWidth="1.4" /></svg>
      </IconBtn>
    </div>
  )
}

function FAQ({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((f, i) => (
        <details key={i} className="glass rounded-xl overflow-hidden lift group">
          <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between gap-4 font-display text-lg">
            <span><Tx>{f.q}</Tx></span>
            <span aria-hidden className="transition-transform duration-300 group-open:rotate-45 text-2xl leading-none" style={{ color: 'var(--s-accent)' }}>+</span>
          </summary>
          <p className="px-5 pb-5 -mt-1" style={{ color: 'var(--s-muted)' }}><Tx>{f.a}</Tx></p>
        </details>
      ))}
    </div>
  )
}

const H1 = ({ children }: { children: ReactNode }) => (
  <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', lineHeight: 1.05, letterSpacing: '-0.02em' }}>{children}</h1>
)

// ─── Legal / policy page ──────────────────────────────────────────────────────
function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function LegalPageView({ data }: { data: LegalPageData }) {
  const t = useT()
  const words = useMemo(
    () => data.sections.reduce((n, s) => n + s.body.join(' ').split(/\s+/).length + (s.bullets?.join(' ').split(/\s+/).length ?? 0), 0),
    [data],
  )
  useSEO({
    title: data.title,
    description: data.summary,
    type: 'article',
    jsonLd: {
      '@context': 'https://schema.org', '@type': 'WebPage', name: data.title, description: data.summary,
      dateModified: data.updated, publisher: { '@type': 'Organization', name: SITE.legalName },
    },
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumb trail={[{ label: t('home'), slug: '' }, { label: t('termsPolicies') }, { label: data.title }]} />

      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <H1><Tx>{data.title}</Tx></H1>
          <p className="mt-3 max-w-2xl text-lg" style={{ color: 'var(--s-muted)' }}><Tx>{data.summary}</Tx></p>
        </div>
        <ActionRow title={data.title} />
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs uppercase tracking-wider" style={{ color: 'var(--s-muted)' }}>
        <span>{t('lastUpdated')}: {data.updated}</span>
        <span>{t('version')} {data.version}</span>
        <span>{t('minRead', { n: readingTime(words) })}</span>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr]">
        {/* Sticky in-page navigation */}
        <aside className="no-print hidden lg:block">
          <nav aria-label={t('onThisPage')} className="sticky top-24 glass rounded-xl p-4">
            <p className="font-mono text-[11px] uppercase tracking-widest mb-3" style={{ color: 'var(--s-muted)' }}>{t('onThisPage')}</p>
            <ol className="space-y-2 text-sm">
              {data.sections.map((s, i) => (
                <li key={i}>
                  <a href={`#sec-${slugify(s.heading)}`} className="link-underline" style={{ color: 'var(--s-muted)' }}>
                    {i + 1}. <Tx>{s.heading}</Tx>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="max-w-3xl">
          {data.sections.map((s, i) => (
            <section key={i} id={`sec-${slugify(s.heading)}`} className="mb-10 scroll-mt-24">
              <h2 className="font-display text-2xl mb-3">
                <span style={{ color: 'var(--s-accent)' }}>{i + 1}.</span> <Tx>{s.heading}</Tx>
              </h2>
              {s.body.map((p, j) => (
                <p key={j} className="mb-3 leading-relaxed" style={{ color: 'var(--s-fg)' }}><Tx>{p}</Tx></p>
              ))}
              {s.bullets && (
                <ul className="mt-3 space-y-2">
                  {s.bullets.map((b, j) => (
                    <li key={j} className="flex gap-3 leading-relaxed">
                      <span aria-hidden style={{ color: 'var(--s-accent)' }}>—</span>
                      <span><Tx>{b}</Tx></span>
                    </li>
                  ))}
                </ul>
              )}
              {s.highlight && (
                <div className="mt-4 glass rounded-xl p-4 border-l-4" style={{ borderColor: 'var(--s-accent)' }}>
                  <p className="font-mono text-[11px] uppercase tracking-widest mb-1" style={{ color: 'var(--s-accent)' }}><Tx>Important</Tx></p>
                  <p style={{ color: 'var(--s-fg)' }}><Tx>{s.highlight}</Tx></p>
                </div>
              )}
            </section>
          ))}

          {data.faqs && data.faqs.length > 0 && (
            <section className="mb-10">
              <h2 className="font-display text-2xl mb-4">{t('faqTitle')}</h2>
              <FAQ items={data.faqs} />
            </section>
          )}

          <button onClick={backToApp} className="no-print link-underline font-mono text-sm uppercase tracking-wider" style={{ color: 'var(--s-accent)' }}>
            ← {t('back')}
          </button>
        </article>
      </div>
    </div>
  )
}

// ─── About ────────────────────────────────────────────────────────────────────
function AboutView() {
  useSEO({
    title: 'About Us', description: `${SITE.name} — ${SITE.tagline}`, type: 'website',
    jsonLd: { '@context': 'https://schema.org', '@type': 'Organization', name: SITE.legalName, url: SITE.url, foundingDate: String(SITE.founded), email: SITE.email, address: SITE.address },
  })
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumb trail={[{ label: 'Home', slug: '' }, { label: 'About Us' }]} />
      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--s-accent)' }}>Since {SITE.founded} · Singapore</p>
          <H1>About {SITE.name}</H1>
        </div>
        <ActionRow title="About Us" />
      </div>
      <p className="mt-6 max-w-3xl text-xl leading-relaxed"><Tx>{ABOUT.intro}</Tx></p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {ABOUT.sections.map((s) => (
          <section key={s.heading} className="glass rounded-2xl p-6 lift">
            <h2 className="font-display text-xl mb-2"><Tx>{s.heading}</Tx></h2>
            <p style={{ color: 'var(--s-muted)' }}><Tx>{s.body}</Tx></p>
          </section>
        ))}
      </div>

      <h2 className="font-display text-2xl mt-14 mb-5"><Tx>Core Values</Tx></h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ABOUT.values.map((v) => (
          <div key={v.title} className="glass rounded-2xl p-5 lift">
            <p className="font-display text-lg" style={{ color: 'var(--s-accent)' }}><Tx>{v.title}</Tx></p>
            <p className="mt-1 text-sm" style={{ color: 'var(--s-muted)' }}><Tx>{v.body}</Tx></p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-2xl mt-14 mb-5"><Tx>Our Team</Tx></h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ABOUT.team.map((m) => (
          <div key={m.name} className="glass rounded-2xl p-5 lift">
            <div aria-hidden className="w-12 h-12 rounded-full mb-3 flex items-center justify-center font-display text-lg" style={{ background: 'color-mix(in srgb, var(--s-accent) 20%, transparent)', color: 'var(--s-accent)' }}>
              {m.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <p className="font-display text-lg">{m.name}</p>
            <p className="text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--s-accent)' }}><Tx>{m.role}</Tx></p>
            <p className="mt-2 text-sm" style={{ color: 'var(--s-muted)' }}><Tx>{m.bio}</Tx></p>
          </div>
        ))}
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <section className="glass rounded-2xl p-6">
          <h2 className="font-display text-2xl mb-4"><Tx>Awards & Achievements</Tx></h2>
          <ul className="space-y-2">
            {ABOUT.awards.map((a) => (
              <li key={a} className="flex gap-3"><span aria-hidden style={{ color: 'var(--s-accent-2)' }}>★</span><span><Tx>{a}</Tx></span></li>
            ))}
          </ul>
        </section>
        <section className="glass rounded-2xl p-6">
          <h2 className="font-display text-2xl mb-4"><Tx>Global Partnerships</Tx></h2>
          <ul className="space-y-2">
            {ABOUT.partners.map((p) => (
              <li key={p} className="flex gap-3"><span aria-hidden style={{ color: 'var(--s-accent)' }}>◆</span><span><Tx>{p}</Tx></span></li>
            ))}
          </ul>
        </section>
      </div>

      <h2 className="font-display text-2xl mt-14 mb-5"><Tx>Customer Testimonials</Tx></h2>
      <div className="grid gap-4 md:grid-cols-3">
        {ABOUT.testimonials.map((t) => (
          <figure key={t.author} className="glass rounded-2xl p-6 lift">
            <blockquote className="font-display italic text-lg leading-snug">“<Tx>{t.quote}</Tx>”</blockquote>
            <figcaption className="mt-3 text-sm font-mono" style={{ color: 'var(--s-muted)' }}>— {t.author}</figcaption>
          </figure>
        ))}
      </div>

      <section className="mt-14 glass-strong rounded-2xl p-8 text-center">
        <h2 className="font-display text-2xl mb-2"><Tx>Contact Information</Tx></h2>
        <p style={{ color: 'var(--s-muted)' }}>{SITE.legalName}</p>
        <p style={{ color: 'var(--s-muted)' }}>{SITE.address}</p>
        <p className="mt-2">
          <a className="link-underline" href={`mailto:${SITE.email}`} style={{ color: 'var(--s-accent)' }}>{SITE.email}</a>
          {'  ·  '}
          <a className="link-underline" href={`tel:${SITE.hotline.replace(/\s/g, '')}`} style={{ color: 'var(--s-accent)' }}>{SITE.hotline}</a>
        </p>
      </section>
    </div>
  )
}

// ─── Visa statistics dashboard ─────────────────────────────────────────────────
function VisaStatsView() {
  useSEO({ title: 'Visa Approval Statistics', description: 'Reference statistics on visa approval rates, processing times, and trends.', type: 'website' })
  const maxApps = Math.max(...STATS.byCountry.map((c) => c.apps))
  const donutColors = ['var(--s-accent)', 'var(--s-accent-2)', '#4a8f7b', '#5a7db0', '#9a6ea8']
  let acc = 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumb trail={[{ label: 'Home', slug: '' }, { label: 'Visa Approval Statistics' }]} />
      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <H1>Visa Approval Statistics</H1>
          <p className="mt-3 max-w-2xl text-lg" style={{ color: 'var(--s-muted)' }}>A transparent look at the visa applications we have assisted. Updated {STATS.updated}.</p>
        </div>
        <ActionRow title="Visa Approval Statistics" />
      </div>

      <div className="mt-4 glass rounded-xl p-4 border-l-4" style={{ borderColor: 'var(--s-accent)' }}>
        <p className="font-mono text-[11px] uppercase tracking-widest mb-1" style={{ color: 'var(--s-accent)' }}>Disclaimer</p>
        <p style={{ color: 'var(--s-fg)' }}>{STATS.disclaimer}</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.headline.map((h) => (
          <div key={h.label} className="glass rounded-2xl p-5 lift">
            <p className="font-display" style={{ fontSize: '2rem', color: 'var(--s-accent)' }}>{h.value}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--s-muted)' }}>{h.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Approval rate + processing time by country */}
        <section className="glass rounded-2xl p-6">
          <h2 className="font-display text-xl mb-4">Approval Rate & Processing Time by Destination</h2>
          <div className="space-y-4">
            {STATS.byCountry.map((c) => (
              <div key={c.country}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{c.country}</span>
                  <span style={{ color: 'var(--s-muted)' }}>{c.rate}% · {c.days}d · {c.apps.toLocaleString()} apps</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'color-mix(in srgb, var(--s-fg) 10%, transparent)' }}>
                  <div style={{ width: `${c.rate}%`, height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, var(--s-accent-2), var(--s-accent))', animation: 'grow-w 1s cubic-bezier(0.22,1,0.36,1) both' }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* By visa type — donut */}
        <section className="glass rounded-2xl p-6">
          <h2 className="font-display text-xl mb-4">Success by Visa Type</h2>
          <div className="flex items-center gap-6">
            <svg width="160" height="160" viewBox="0 0 42 42" aria-hidden style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="21" cy="21" r="15.915" fill="none" stroke="color-mix(in srgb, var(--s-fg) 8%, transparent)" strokeWidth="6" />
              {STATS.byType.map((t, i) => {
                const dash = `${t.share} ${100 - t.share}`
                const off = 100 - acc
                acc += t.share
                return <circle key={t.type} cx="21" cy="21" r="15.915" fill="none" stroke={donutColors[i % donutColors.length]} strokeWidth="6" strokeDasharray={dash} strokeDashoffset={off} />
              })}
            </svg>
            <ul className="space-y-2 text-sm">
              {STATS.byType.map((t, i) => (
                <li key={t.type} className="flex items-center gap-2">
                  <span aria-hidden className="w-3 h-3 rounded-sm" style={{ background: donutColors[i % donutColors.length] }} />
                  <span>{t.type}</span>
                  <span style={{ color: 'var(--s-muted)' }}>{t.share}%</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Monthly trend — area/line */}
        <section className="glass rounded-2xl p-6 lg:col-span-2">
          <h2 className="font-display text-xl mb-4">Monthly Application Trend (2025, relative index)</h2>
          <MonthlyChart data={STATS.monthly} />
        </section>

        {/* Volume by country + popular destinations */}
        <section className="glass rounded-2xl p-6 lg:col-span-2">
          <h2 className="font-display text-xl mb-4">Popular Destinations by Volume</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[...STATS.byCountry].sort((a, b) => b.apps - a.apps).map((c) => (
              <div key={c.country} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-sm">{c.country}</span>
                <div className="flex-1 h-4 rounded" style={{ background: 'color-mix(in srgb, var(--s-fg) 8%, transparent)' }}>
                  <div style={{ width: `${(c.apps / maxApps) * 100}%`, height: '100%', borderRadius: 4, background: 'var(--s-accent-2)', animation: 'grow-w 1.1s cubic-bezier(0.22,1,0.36,1) both' }} />
                </div>
                <span className="w-16 text-right text-xs font-mono" style={{ color: 'var(--s-muted)' }}>{(c.apps / 1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function MonthlyChart({ data }: { data: number[] }) {
  const w = 720, h = 200, pad = 24
  const max = Math.max(...data), min = Math.min(...data)
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2)
    const y = h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2)
    return [x, y]
  })
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const area = `${line} L${pts[pts.length - 1][0]},${h - pad} L${pts[0][0]},${h - pad} Z`
  const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Monthly application trend line chart">
      <defs>
        <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--s-accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--s-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#area-fill)" />
      <path d={line} fill="none" stroke="var(--s-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r="3" fill="var(--s-accent)" />
          <text x={p[0]} y={h - 6} textAnchor="middle" fontSize="11" fill="var(--s-muted)">{months[i]}</text>
        </g>
      ))}
    </svg>
  )
}

// ─── Magazine ───────────────────────────────────────────────────────────────
function ArticleCard({ a }: { a: Article }) {
  return (
    <button onClick={() => navigate(`magazine/${a.slug}`)} className="glass rounded-2xl overflow-hidden lift text-left group">
      <div className="aspect-[3/2] overflow-hidden">
        <img src={a.image} alt={a.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: 'var(--s-accent)' }}><Tx>{a.category}</Tx> · {a.minutes} min</p>
        <h3 className="font-display text-xl mt-1 leading-snug"><Tx>{a.title}</Tx></h3>
        <p className="mt-2 text-sm" style={{ color: 'var(--s-muted)' }}><Tx>{a.summary}</Tx></p>
        <p className="mt-3 text-xs font-mono" style={{ color: 'var(--s-muted)' }}>{a.author} · {a.date}</p>
      </div>
    </button>
  )
}

function MagazineView() {
  useSEO({ title: 'Travel Magazine', description: 'Long-form travel guides and stories from across Asia and the world.', type: 'website' })
  const [cat, setCat] = useState('All')
  const cats = ['All', ...Array.from(new Set(ARTICLES.map((a) => a.category)))]
  const shown = cat === 'All' ? ARTICLES : ARTICLES.filter((a) => a.category === cat)
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumb trail={[{ label: 'Home', slug: '' }, { label: 'Travel Magazine' }]} />
      <div className="mt-6"><H1>Travel Magazine</H1></div>
      <p className="mt-3 max-w-2xl text-lg" style={{ color: 'var(--s-muted)' }}>Guides, stories, and dispatches to help you travel deeper.</p>

      <div className="no-print mt-6 flex flex-wrap gap-2">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className="px-4 py-1.5 rounded-full text-sm font-mono uppercase tracking-wider glass lift" style={{ color: cat === c ? '#fff' : 'var(--s-fg)', background: cat === c ? 'var(--s-accent)' : undefined }}>
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((a) => <ArticleCard key={a.slug} a={a} />)}
      </div>
    </div>
  )
}

function ArticleView({ a }: { a: Article }) {
  const t = useT()
  const words = a.body.join(' ').split(/\s+/).length
  useSEO({
    title: a.title, description: a.summary, type: 'article',
    jsonLd: {
      '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.summary,
      image: a.image, datePublished: a.date, author: { '@type': 'Person', name: a.author },
      publisher: { '@type': 'Organization', name: SITE.legalName },
    },
  })
  const related = ARTICLES.filter((x) => x.slug !== a.slug && x.category === a.category).slice(0, 3)
  const relatedFallback = related.length ? related : ARTICLES.filter((x) => x.slug !== a.slug).slice(0, 3)
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumb trail={[{ label: t('home'), slug: '' }, { label: 'Magazine', slug: 'magazine' }, { label: a.title }]} />
      <div className="mt-6 flex items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--s-accent)' }}><Tx>{a.category}</Tx></p>
          <H1><Tx>{a.title}</Tx></H1>
          <p className="mt-3 text-xl font-display italic" style={{ color: 'var(--s-muted)' }}><Tx>{a.subtitle}</Tx></p>
        </div>
        <ActionRow title={a.title} />
      </div>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs uppercase tracking-wider" style={{ color: 'var(--s-muted)' }}>
        <span>By {a.author}</span><span>{a.date}</span><span>{t('minRead', { n: readingTime(words) })}</span>
      </div>

      <div className="mt-8 rounded-2xl overflow-hidden glass">
        <img src={a.image} alt={a.title} className="w-full aspect-[16/7] object-cover" />
      </div>

      <article className="mt-8 max-w-3xl mx-auto">
        <p className="text-xl leading-relaxed font-display" style={{ color: 'var(--s-fg)' }}><Tx>{a.summary}</Tx></p>
        {a.body.map((p, i) => (
          <p key={i} className="mt-5 leading-relaxed text-lg"><Tx>{p}</Tx></p>
        ))}
        <div className="mt-8 flex flex-wrap gap-2">
          {a.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full text-xs font-mono glass" style={{ color: 'var(--s-muted)' }}>#{tag}</span>
          ))}
        </div>
      </article>

      <section className="mt-14">
        <h2 className="font-display text-2xl mb-5">{t('relatedArticles')}</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {relatedFallback.map((r) => <ArticleCard key={r.slug} a={r} />)}
        </div>
      </section>
    </div>
  )
}

// ─── News ───────────────────────────────────────────────────────────────────
function NewsView() {
  useSEO({ title: 'News', description: 'Latest travel news, visa updates, alerts, and announcements.', type: 'website' })
  const [cat, setCat] = useState('All')
  const cats = ['All', ...NEWS_CATEGORIES]
  const shown = cat === 'All' ? NEWS : NEWS.filter((n) => n.category === cat)
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumb trail={[{ label: 'Home', slug: '' }, { label: 'News' }]} />
      <div className="mt-6"><H1>Newsroom</H1></div>
      <p className="mt-3 max-w-2xl text-lg" style={{ color: 'var(--s-muted)' }}>Updates on visas, policies, alerts, and what’s new at {SITE.name}.</p>

      <div className="no-print mt-6 flex flex-wrap gap-2">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className="px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider glass lift" style={{ color: cat === c ? '#fff' : 'var(--s-fg)', background: cat === c ? 'var(--s-accent)' : undefined }}>
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {shown.map((n) => (
          <article key={n.title} className="glass rounded-2xl p-6 lift">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider" style={{ background: 'color-mix(in srgb, var(--s-accent) 16%, transparent)', color: 'var(--s-accent)' }}><Tx>{n.category}</Tx></span>
              <time className="text-xs font-mono" style={{ color: 'var(--s-muted)' }}>{n.date}</time>
            </div>
            <h2 className="font-display text-xl leading-snug"><Tx>{n.title}</Tx></h2>
            <p className="mt-2" style={{ color: 'var(--s-muted)' }}><Tx>{n.body}</Tx></p>
          </article>
        ))}
      </div>
    </div>
  )
}

// ─── Sitemap ────────────────────────────────────────────────────────────────
function SitemapView() {
  useSEO({ title: 'Sitemap', description: 'A structured map of everything on the site.', type: 'website' })
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumb trail={[{ label: 'Home', slug: '' }, { label: 'Sitemap' }]} />
      <div className="mt-6"><H1>Sitemap</H1></div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SITEMAP.map((g) => (
          <section key={g.group} className="glass rounded-2xl p-6">
            <h2 className="font-display text-lg mb-3" style={{ color: 'var(--s-accent)' }}>{g.group}</h2>
            <ul className="space-y-2">
              {g.links.map((l, i) => (
                <li key={i}>
                  <button className="foot-link" onClick={() => (l.slug === 'home' ? backToApp() : ['destinations', 'tours', 'flights', 'hotels'].includes(l.slug) ? backToApp() : navigate(l.slug))}>
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="mt-8 text-sm" style={{ color: 'var(--s-muted)' }}>Explore links (Home, Destinations, Tours, Flights, Hotels) return to the main journal experience.</p>
    </div>
  )
}

// ─── Help center ────────────────────────────────────────────────────────────
function HelpView() {
  const t = useT()
  useSEO({
    title: 'Help Center', description: 'FAQs, guides, and every way to reach our 24/7 support team.', type: 'website',
    jsonLd: { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: HELP.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  })
  const [q, setQ] = useState('')
  const faqs = HELP.faqs.filter((f) => (f.q + f.a).toLowerCase().includes(q.trim().toLowerCase()))
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumb trail={[{ label: 'Home', slug: '' }, { label: 'Help Center' }]} />
      <div className="mt-6"><H1><Tx>Help Center</Tx></H1></div>
      <p className="mt-3 max-w-2xl text-lg" style={{ color: 'var(--s-muted)' }}><Tx>Answers, step-by-step guides, and a real team on call 24/7.</Tx></p>

      <div className="no-print mt-6 max-w-xl">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search help articles…" className="w-full glass rounded-full px-5 py-3 outline-none" style={{ color: 'var(--s-fg)' }} aria-label="Search help" />
      </div>

      <h2 className="font-display text-2xl mt-12 mb-5"><Tx>Contact & Channels</Tx></h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HELP.channels.map((c) => (
          <div key={c.title} className="glass rounded-2xl p-5 lift">
            <p className="font-display text-lg"><Tx>{c.title}</Tx></p>
            <p className="mt-1 text-sm"><Tx>{c.desc}</Tx></p>
            <p className="mt-2 text-xs font-mono" style={{ color: 'var(--s-accent)' }}>{c.detail}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-2xl mt-12 mb-5"><Tx>Guides</Tx></h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {HELP.guides.map((g) => (
          <section key={g.title} className="glass rounded-2xl p-5 lift">
            <h3 className="font-display text-lg mb-1"><Tx>{g.title}</Tx></h3>
            <p className="text-sm" style={{ color: 'var(--s-muted)' }}><Tx>{g.body}</Tx></p>
          </section>
        ))}
      </div>

      <h2 className="font-display text-2xl mt-12 mb-5">{t('faqTitle')}</h2>
      {faqs.length ? <FAQ items={faqs} /> : <p style={{ color: 'var(--s-muted)' }}>No results. Try a different search or contact us directly.</p>}

      {/* Contact form + report a problem */}
      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <ContactForm title="Contact Form" intro="Send us a message and we'll reply within two business days." />
        <ContactForm title="Report a Problem" intro="Tell us what went wrong. Include your booking reference for the fastest help." withRef />
      </section>
    </div>
  )
}

function ContactForm({ title, intro, withRef }: { title: string; intro: string; withRef?: boolean }) {
  const t = useT()
  const [sent, setSent] = useState(false)
  return (
    <form
      className="glass rounded-2xl p-6"
      onSubmit={(e) => { e.preventDefault(); setSent(true) }}
    >
      <h3 className="font-display text-xl mb-1"><Tx>{title}</Tx></h3>
      <p className="text-sm mb-4" style={{ color: 'var(--s-muted)' }}><Tx>{intro}</Tx></p>
      {sent ? (
        <p className="glass rounded-xl p-4" style={{ color: 'var(--s-accent)' }}><Tx>Thank you — your message has been received. (Demo form.)</Tx></p>
      ) : (
        <div className="space-y-3">
          <input required placeholder="Your name" aria-label="Your name" className="w-full glass rounded-lg px-4 py-2.5 outline-none" style={{ color: 'var(--s-fg)' }} />
          <input required type="email" placeholder="Email" aria-label="Email" className="w-full glass rounded-lg px-4 py-2.5 outline-none" style={{ color: 'var(--s-fg)' }} />
          {withRef && <input placeholder="Booking reference (optional)" aria-label="Booking reference" className="w-full glass rounded-lg px-4 py-2.5 outline-none" style={{ color: 'var(--s-fg)' }} />}
          <textarea required rows={4} placeholder="How can we help?" aria-label="Message" className="w-full glass rounded-lg px-4 py-2.5 outline-none resize-none" style={{ color: 'var(--s-fg)' }} />
          <button type="submit" className="px-5 py-2.5 rounded-full font-mono text-sm uppercase tracking-wider lift" style={{ background: 'var(--s-accent)', color: '#fff' }}>{t('sendMessage')}</button>
        </div>
      )}
    </form>
  )
}

// ─── Route resolver ───────────────────────────────────────────────────────────
function NotFound({ slug }: { slug: string }) {
  useSEO({ title: 'Page not found', description: 'The page you were looking for could not be found.' })
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <H1>Page not found</H1>
      <p className="mt-4" style={{ color: 'var(--s-muted)' }}>We couldn’t find “{slug}”.</p>
      <button onClick={backToApp} className="mt-8 px-6 py-3 rounded-full font-mono text-sm uppercase tracking-wider lift" style={{ background: 'var(--s-accent)', color: '#fff' }}>Return home</button>
    </div>
  )
}

export function SitePage({ slug }: { slug: string }) {
  let content: ReactNode

  if (slug.startsWith('magazine/')) {
    const a = ARTICLES.find((x) => x.slug === slug.slice('magazine/'.length))
    content = a ? <ArticleView a={a} /> : <NotFound slug={slug} />
  } else if (slug === 'about') content = <AboutView />
  else if (slug === 'visa-statistics') content = <VisaStatsView />
  else if (slug === 'magazine') content = <MagazineView />
  else if (slug === 'news') content = <NewsView />
  else if (slug === 'sitemap') content = <SitemapView />
  else if (slug === 'help') content = <HelpView />
  else if (POLICIES[slug]) content = <LegalPageView data={POLICIES[slug]} />
  else content = <NotFound slug={slug} />

  return <Shell>{content}</Shell>
}

// Re-export the nav lists so the footer stays in sync.
export { INFO_NAV, LEGAL_NAV }
