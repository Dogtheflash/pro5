import React, { useState, useEffect, useRef } from 'react'
import { TRANSLATIONS, type LanguageCode } from '../i18n/asiaTranslations'
import { ASIAN_COUNTRIES, type CountryChapter, type DishData } from './EastAsiaCulinaryData'
import { FlavorComparatorModal } from './FlavorComparatorModal'

export function AsianCulinaryApp({
  onAddToCart,
}: {
  onAddToCart?: (item: { id: string; name: string; country: string; flag: string; priceUsd: number }) => void
}) {
  // ── Language State with LocalStorage Persistence ─────────────────────────
  const [lang, setLang] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('asian_lang_pref')
      if (saved && ['vi', 'en', 'ja', 'ko', 'th', 'id'].includes(saved)) {
        return saved as LanguageCode
      }
    } catch {
      /* fallback */
    }
    return 'vi'
  })

  const t = TRANSLATIONS[lang] || TRANSLATIONS.vi

  const changeLanguage = (code: LanguageCode) => {
    setLang(code)
    try {
      localStorage.setItem('asian_lang_pref', code)
    } catch {
      /* ignore */
    }
  }

  // ── Audio Toggle State ───────────────────────────────────────────────────
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const toggleAudio = () => {
    if (!audioRef.current) return
    if (isAudioPlaying) {
      audioRef.current.pause()
      setIsAudioPlaying(false)
    } else {
      audioRef.current.play().then(() => setIsAudioPlaying(true)).catch(() => {})
    }
  }

  // ── Hero Slideshow State ─────────────────────────────────────────────────
  const [heroSlide, setHeroSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % ASIAN_COUNTRIES.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [])

  const activeHeroCountry = ASIAN_COUNTRIES[heroSlide]

  // ── Tour & Tasting Booking Form State ─────────────────────────────────────
  const [selectedCountryId, setSelectedCountryId] = useState<string>(ASIAN_COUNTRIES[0].id)
  const [bookingGuests, setBookingGuests] = useState(2)
  const [bookingDate, setBookingDate] = useState('2026-09-10')
  const [bookingConfirmed, setBookingConfirmed] = useState(false)

  // Bistro Tasting Reservation State
  const [bistroCountryId, setBistroCountryId] = useState<string>(ASIAN_COUNTRIES[0].id)
  const [bistroGuests, setBistroGuests] = useState(2)
  const [bistroTime, setBistroTime] = useState('19:00')
  const [bistroConfirmed, setBistroConfirmed] = useState(false)

  // ── Flavor Comparator Modal State ────────────────────────────────────────
  const [isComparatorOpen, setIsComparatorOpen] = useState(false)

  // Calculate Tour Cost based on selected country
  const currentTourCountry = ASIAN_COUNTRIES.find((c) => c.id === selectedCountryId) || ASIAN_COUNTRIES[0]
  const estimatedTourTotal = currentTourCountry.tourBasePriceUsd * bookingGuests

  return (
    <div className="relative w-full bg-[#120c08] text-[#fbf7ee] font-sans overflow-hidden">
      {/* Hidden Traditional Background Audio Loop */}
      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=asian-traditional-bamboo-flute-112328.mp3"
        loop
      />

      {/* ── 1. Sticky Navigation & Language Selector Bar ────────────────────── */}
      <header className="sticky top-0 z-40 w-full bg-[#170e09]/90 backdrop-blur-md border-b border-amber-900/40 text-amber-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="h-9 w-9 rounded-full bg-gradient-to-tr from-amber-600 to-red-600 flex items-center justify-center text-lg font-bold shadow-lg text-white">
              🌏
            </span>
            <div className="text-left">
              <span className="font-display font-700 text-lg text-white block leading-none">
                Đông Á & Đông Nam Á
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400">
                Hành Trình Vạn Hương Vị
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 font-mono text-xs uppercase tracking-wider text-amber-200/80">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-amber-400 cursor-pointer">
              {t.navHome}
            </button>
            <button onClick={() => document.getElementById('country-chapters')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-amber-400 cursor-pointer">
              {t.navCountries}
            </button>
            <button onClick={() => document.getElementById('tour-booking')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-amber-400 cursor-pointer">
              {t.navBooking}
            </button>
            <button onClick={() => document.getElementById('bistro-tasting')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-amber-400 cursor-pointer">
              {t.navBistro}
            </button>
            <button onClick={() => setIsComparatorOpen(true)} className="hover:text-amber-400 text-amber-400 font-bold flex items-center gap-1 cursor-pointer">
              <span>⚖️</span> {t.navCompare}
            </button>
          </nav>

          {/* Language Selector Dropdown & Ambient Audio Toggle */}
          <div className="flex items-center gap-3">
            {/* Audio Toggle Button */}
            <button
              onClick={toggleAudio}
              className={`h-9 px-3 rounded-full border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                isAudioPlaying
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-lg shadow-amber-500/20'
                  : 'bg-[#241710] text-amber-300 border-amber-800/60 hover:border-amber-500'
              }`}
              title={isAudioPlaying ? t.audioOn : t.audioOff}
            >
              <span>{isAudioPlaying ? '🎵' : '🔇'}</span>
              <span className="hidden sm:inline">{isAudioPlaying ? t.audioOn : t.audioOff}</span>
            </button>

            {/* Language Switcher Dropdown */}
            <div className="relative group">
              <select
                value={lang}
                onChange={(e) => changeLanguage(e.target.value as LanguageCode)}
                className="h-9 px-3 rounded-full bg-[#241710] border border-amber-700/60 text-amber-200 font-mono text-xs outline-none cursor-pointer hover:border-amber-400"
              >
                <option value="vi">🇻🇳 Tiếng Việt</option>
                <option value="en">🇬🇧 English</option>
                <option value="ja">🇯🇵 日本語</option>
                <option value="ko">🇰🇷 한국어</option>
                <option value="th">🇹🇭 ภาษาไทย</option>
                <option value="id">🇮🇩 B. Indonesia</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* ── 2. Fullscreen Hero Section (Ken Burns Effect Carousel) ──────────── */}
      <section className="relative w-full h-[88vh] overflow-hidden bg-black text-[#fbf7ee]">
        {ASIAN_COUNTRIES.map((c, idx) => {
          const isActive = idx === heroSlide
          return (
            <div
              key={c.id}
              className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={c.heroImage}
                alt={c.name}
                className={`h-full w-full object-cover transition-transform duration-[8000ms] ease-out ${
                  isActive ? 'scale-110' : 'scale-100'
                }`}
              />
            </div>
          )
        })}

        {/* Aurora Dark Vignette Overlay */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#120c08] via-[#120c08]/60 to-black/30 pointer-events-none" />
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-[#120c08] via-[#120c08]/70 to-transparent w-full md:w-3/4 pointer-events-none" />

        {/* Hero Content Container */}
        <div className="relative z-30 h-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-end pb-16 text-left">
          <div className="max-w-3xl space-y-5">
            {/* Country Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/70 border border-amber-600/50 backdrop-blur-md font-mono text-xs text-amber-300">
              <span className="text-base">{activeHeroCountry.flag}</span>
              <span>{activeHeroCountry.name} · {activeHeroCountry.capital}</span>
              <span className="text-amber-500">|</span>
              <span className="text-amber-400">🎶 {activeHeroCountry.instrument}</span>
            </div>

            {/* Tagline */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-700 leading-[1.08] text-white drop-shadow-xl">
              {t.heroTagline}
            </h1>

            <p className="font-body text-base sm:text-xl text-amber-100/80 leading-relaxed max-w-2xl">
              {t.heroSub}
            </p>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-wrap gap-4">
              <button
                onClick={() => document.getElementById('country-chapters')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-full font-mono text-xs uppercase tracking-widest bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-700 shadow-xl shadow-amber-600/30 cursor-pointer transition-all hover:scale-105"
              >
                {t.exploreBtn}
              </button>

              <button
                onClick={() => document.getElementById('tour-booking')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-full font-mono text-xs uppercase tracking-widest border border-amber-500/50 bg-[#1f140d]/60 text-amber-200 hover:bg-amber-900/60 backdrop-blur-md transition-all cursor-pointer"
              >
                {t.bookBtn}
              </button>
            </div>
          </div>

          {/* Carousel Slide Dots */}
          <div className="absolute bottom-12 right-6 sm:right-12 z-30 flex items-center gap-2">
            {ASIAN_COUNTRIES.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setHeroSlide(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  i === heroSlide ? 'w-8 bg-amber-500' : 'w-2 bg-amber-100/30 hover:bg-amber-100'
                }`}
                title={c.name}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Interactive East & SE Asian Country Map Selector Bar ─────────── */}
      <section id="country-chapters" className="py-8 bg-[#180f0a] border-y border-amber-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-thin">
            {ASIAN_COUNTRIES.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  const el = document.getElementById(`chapter-${c.id}`)
                  el?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#241710] hover:bg-amber-900/60 border border-amber-800/40 text-amber-100 font-mono text-xs whitespace-nowrap cursor-pointer transition-all hover:scale-105"
              >
                <span className="text-base">{c.flag}</span>
                <span className="font-bold">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Country Storytelling Chapters ────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 space-y-32">
        {ASIAN_COUNTRIES.map((country) => (
          <section key={country.id} id={`chapter-${country.id}`} className="space-y-12 text-left">
            {/* Chapter Header */}
            <div className="relative p-8 sm:p-12 rounded-3xl bg-[#1b120c] border border-amber-900/40 space-y-4 overflow-hidden shadow-2xl">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{country.flag}</span>
                <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold">
                  {country.capital} · {t.countryTitle}
                </span>
              </div>

              <h2 className="font-display text-4xl sm:text-5xl font-700 text-white">
                Hành Trình Văn Hóa <span className="text-amber-400">{country.name}</span>
              </h2>

              <p className="font-body text-base sm:text-lg text-amber-100/80 max-w-3xl leading-relaxed">
                {country.culturalStory}
              </p>

              {/* Daily Food Vocabulary Card */}
              <div className="pt-4 flex flex-wrap gap-4">
                <div className="p-4 rounded-2xl bg-[#271910] border border-amber-800/40 font-mono text-xs flex items-center gap-4">
                  <span className="text-2xl">📖</span>
                  <div>
                    <span className="text-amber-400 font-bold uppercase tracking-wider">{t.vocabTitle}:</span>
                    <div className="text-white text-sm font-bold mt-0.5">
                      "{country.vocabulary.word}" {country.vocabulary.phonetic}
                    </div>
                    <div className="text-amber-200/70 text-[11px]">{country.vocabulary.meaning}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Iconic Dishes Showcase */}
            <div className="space-y-6">
              <h3 className="font-display text-2xl font-700 text-white flex items-center gap-2">
                <span>🍲</span> {t.iconicDishes} — {country.name}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {country.dishes.map((dish) => (
                  <div key={dish.id} className="rounded-2xl bg-[#1d130c] border border-amber-900/40 p-6 space-y-4 shadow-xl text-left flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-black">
                        <img src={dish.image} alt={dish.name} className="h-full w-full object-cover" />
                        <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-mono text-sm font-bold">
                          ${dish.priceUsd} USD
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-display text-xl font-700 text-white">{dish.name}</h4>
                          <span className="font-mono text-xs text-amber-400">{dish.nativeName}</span>
                        </div>
                      </div>

                      <p className="font-body text-sm text-amber-100/70 leading-relaxed">
                        {dish.description}
                      </p>

                      {/* Flavor Metric Radar Bar */}
                      <div className="space-y-1.5 p-3 rounded-xl bg-[#241710] text-[11px] font-mono">
                        <div className="flex justify-between text-amber-300 font-bold">
                          <span>🌶️ Cay: {dish.metrics.spiciness}/5</span>
                          <span>🍲 Umami: {dish.metrics.umami}/5</span>
                          <span>🌿 Thảo Mộc: {dish.metrics.aroma}/5</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-amber-900/30 flex items-center justify-between">
                      <span className="text-xs font-mono text-amber-300/70">Nguyên Liệu Tươi Nghệ Nhân</span>
                      {onAddToCart && (
                        <button
                          onClick={() => onAddToCart({
                            id: dish.id,
                            name: dish.name,
                            country: country.name,
                            flag: country.flag,
                            priceUsd: dish.priceUsd,
                          })}
                          className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-mono text-xs uppercase font-bold cursor-pointer"
                        >
                          🛒 Đặt Thưởng Thức (${dish.priceUsd})
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Souvenirs & Suggested Itinerary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Souvenirs */}
              <div className="p-6 rounded-2xl bg-[#1d130c] border border-amber-900/40 space-y-4">
                <h4 className="font-display text-xl font-700 text-white flex items-center gap-2">
                  <span>🎁</span> {t.souvenirs}
                </h4>

                <div className="space-y-3">
                  {country.souvenirs.map((s, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-[#261910] border border-amber-900/30">
                      <img src={s.image} alt={s.name} className="h-14 w-14 rounded-lg object-cover" />
                      <div className="flex-1 text-left">
                        <div className="font-display font-600 text-sm text-white">{s.name}</div>
                        <div className="font-body text-xs text-amber-100/70">{s.description}</div>
                      </div>
                      <span className="font-mono text-sm font-bold text-amber-400">${s.priceUsd}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chef Story */}
              <div className="p-6 rounded-2xl bg-[#1d130c] border border-amber-900/40 space-y-4">
                <h4 className="font-display text-xl font-700 text-white flex items-center gap-2">
                  <span>👨‍🍳</span> {t.chefStoryTitle}
                </h4>

                <div className="flex items-start gap-4">
                  <img src={country.chef.image} alt={country.chef.name} className="h-20 w-20 rounded-xl object-cover border border-amber-700/50" />
                  <div className="text-left space-y-1">
                    <div className="font-display font-700 text-base text-white">{country.chef.name}</div>
                    <div className="font-mono text-xs text-amber-400">{country.chef.title}</div>
                    <p className="font-body text-xs text-amber-100/70 leading-relaxed italic">
                      "{country.chef.bio}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* ── 5. Interactive Tour Booking System ─────────────────────────────── */}
      <section id="tour-booking" className="py-20 bg-[#170e09] border-t border-amber-900/40 text-left">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold">✦ Trải Nghiệm Du Lịch Văn Hóa</span>
            <h2 className="font-display text-3xl sm:text-5xl font-700 text-white">
              {t.bookTour} Đông Á & Đông Nam Á
            </h2>
            <p className="font-body text-sm text-amber-100/70">
              Chọn quốc gia yêu thích, số lượng người và ngày khởi hành để nhận báo giá trọn gói tức thời.
            </p>
          </div>

          {bookingConfirmed ? (
            <div className="p-8 rounded-3xl bg-amber-500/10 border border-amber-400 text-center space-y-4">
              <div className="text-5xl">✈️</div>
              <h3 className="font-display text-3xl font-700 text-amber-400">Đặt Chuyến Đi Thành Công!</h3>
              <p className="font-body text-amber-100">
                Chúc mừng bạn! Chuyến đi khám phá <strong>{currentTourCountry.name}</strong> ({bookingGuests} Khách) khởi hành ngày <strong>{bookingDate}</strong> đã được giữ chỗ thành công. Tổng chi phí tạm tính: <strong>${estimatedTourTotal.toLocaleString('en-US')} USD</strong>.
              </p>
              <button
                onClick={() => setBookingConfirmed(false)}
                className="px-6 py-2.5 rounded-full bg-amber-500 text-slate-950 font-mono text-xs uppercase font-bold cursor-pointer"
              >
                Đặt Chuyến Đi Khác
              </button>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-[#1f140d] border border-amber-800/40 space-y-6 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">Chọn Quốc Gia</label>
                  <select
                    value={selectedCountryId}
                    onChange={(e) => setSelectedCountryId(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[#120c08] border border-amber-800/60 text-white font-mono text-sm outline-none cursor-pointer"
                  >
                    {ASIAN_COUNTRIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">Ngày Khởi Hành</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[#120c08] border border-amber-800/60 text-white font-mono text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">{t.guests}</label>
                  <select
                    value={bookingGuests}
                    onChange={(e) => setBookingGuests(Number(e.target.value))}
                    className="w-full p-3.5 rounded-xl bg-[#120c08] border border-amber-800/60 text-white font-mono text-sm outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 6, 8].map((n) => (
                      <option key={n} value={n}>{n} Khách</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cost Calculation Box */}
              <div className="p-4 rounded-xl bg-[#120c08] border border-amber-900/50 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-mono text-amber-400 uppercase">{t.totalPrice}</span>
                  <span className="font-mono text-3xl font-700 text-amber-300">
                    ${estimatedTourTotal.toLocaleString('en-US')} USD
                  </span>
                </div>
                <button
                  onClick={() => setBookingConfirmed(true)}
                  className="px-8 py-3.5 rounded-xl font-mono text-xs uppercase tracking-widest bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-bold shadow-lg cursor-pointer"
                >
                  {t.confirmBooking}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 6. Bistro Tasting Reservation System ───────────────────────────── */}
      <section id="bistro-tasting" className="py-20 bg-[#120c08] border-t border-amber-900/40 text-left">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold">✦ Trải Nghiệm Ẩm Thực Đỉnh Cao</span>
            <h2 className="font-display text-3xl sm:text-5xl font-700 text-white">
              {t.reserveTable} Bản Địa
            </h2>
          </div>

          {bistroConfirmed ? (
            <div className="p-8 rounded-3xl bg-amber-500/10 border border-amber-400 text-center space-y-4">
              <div className="text-5xl">🍷</div>
              <h3 className="font-display text-3xl font-700 text-amber-400">Đặt Bàn Thưởng Thức Thành Công!</h3>
              <p className="font-body text-amber-100">
                Bàn tiệc ẩm thực <strong>{ASIAN_COUNTRIES.find(c => c.id === bistroCountryId)?.name}</strong> cho <strong>{bistroGuests} Khách</strong> lúc <strong>{bistroTime}</strong> đã được chuẩn bị.
              </p>
              <button
                onClick={() => setBistroConfirmed(false)}
                className="px-6 py-2.5 rounded-full bg-amber-500 text-slate-950 font-mono text-xs uppercase font-bold cursor-pointer"
              >
                Đặt Bàn Khác
              </button>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-[#1b120c] border border-amber-800/40 space-y-6 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">Phong Cách Ẩm Thực</label>
                  <select
                    value={bistroCountryId}
                    onChange={(e) => setBistroCountryId(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[#120c08] border border-amber-800/60 text-white font-mono text-sm outline-none cursor-pointer"
                  >
                    {ASIAN_COUNTRIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        Bàn Tiệc {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">Giờ Dùng Bữa</label>
                  <select
                    value={bistroTime}
                    onChange={(e) => setBistroTime(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[#120c08] border border-amber-800/60 text-white font-mono text-sm outline-none cursor-pointer"
                  >
                    <option>18:00 — Hoàng Hôn</option>
                    <option>19:30 — Đêm Tiệc Ánh Nến</option>
                    <option>21:00 — Dạ Tiệc Đêm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">Số Khách</label>
                  <select
                    value={bistroGuests}
                    onChange={(e) => setBistroGuests(Number(e.target.value))}
                    className="w-full p-3.5 rounded-xl bg-[#120c08] border border-amber-800/60 text-white font-mono text-sm outline-none cursor-pointer"
                  >
                    {[1, 2, 4, 6, 10].map((n) => (
                      <option key={n} value={n}>{n} Khách</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => setBistroConfirmed(true)}
                className="w-full py-4 rounded-xl font-mono text-xs uppercase tracking-widest bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 text-slate-950 font-bold shadow-xl cursor-pointer"
              >
                ⚡ Xác Nhận Đặt Bàn Thưởng Thức
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── 7. Newsletter Footer Section ───────────────────────────────────── */}
      <footer className="py-16 bg-[#0e0704] border-t border-amber-900/50 text-center space-y-8">
        <div className="max-w-2xl mx-auto px-4 space-y-4">
          <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold">📬 Thư Tin Văn Hóa</span>
          <h3 className="font-display text-3xl font-700 text-white">{t.newsletterTitle}</h3>
          <p className="font-body text-sm text-amber-100/70 leading-relaxed">{t.newsletterSub}</p>

          <form onSubmit={(e) => { e.preventDefault(); alert('Cảm ơn bạn đã đăng ký nhận bản tin ẩm thực!'); }} className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Nhập email của bạn..."
              required
              className="flex-1 p-3.5 rounded-full bg-[#1c120a] border border-amber-800/60 text-white font-mono text-sm outline-none placeholder:text-amber-100/40"
            />
            <button
              type="submit"
              className="px-6 py-3.5 rounded-full font-mono text-xs uppercase tracking-widest bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold cursor-pointer shadow-lg"
            >
              {t.subscribeBtn}
            </button>
          </form>
        </div>

        <div className="text-xs font-mono text-amber-100/40 pt-8 border-t border-amber-950">
          © 2026 Đông Á & Đông Nam Á — Hành Trình Văn Hóa & Ẩm Thực Di Sản. All rights reserved.
        </div>
      </footer>

      {/* Interactive Flavor Comparator Modal */}
      <FlavorComparatorModal
        isOpen={isComparatorOpen}
        onClose={() => setIsComparatorOpen(false)}
      />
    </div>
  )
}
