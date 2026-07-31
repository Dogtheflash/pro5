import React, { useState } from 'react'

export interface AuroraDestination {
  id: string
  name: string
  country: string
  flag: string
  category: 'luxury' | 'culture' | 'beach' | 'alpine' | 'wildlife'
  image: string
  pricePerPerson: number
  days: number
  rating: number
  reviewCount: number
  accentColor: string // e.g. '#10b981', '#6366f1', '#f43f5e', '#f59e0b', '#06b6d4', '#ec4899'
  highlights: string[]
  description: string
  included: string[]
}

export const DESTINATIONS: AuroraDestination[] = [
  {
    id: 'kyoto-blossom',
    name: 'Kyoto Cherry Blossom Sanctuary',
    country: 'Japan',
    flag: '🇯🇵',
    category: 'culture',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&fit=crop&auto=format',
    pricePerPerson: 1450,
    days: 7,
    rating: 4.98,
    reviewCount: 342,
    accentColor: '#ec4899', // Pink blossom
    highlights: ['Arashiyama Bamboo Forest', 'Private Tea Ceremony', 'Gion Geisha Evening Walk'],
    description: 'Immersion in ancient shrines, Zen gardens, and blooming sakura avenues with private traditional ryokan stay.',
    included: ['5-Star Ryokan Accommodation', 'Bullet Train JR Pass', 'Private Cultural Guide', 'Daily Gourmet Kaiseki'],
  },
  {
    id: 'ha-long-emerald',
    name: 'Ha Long Bay Emerald Luxury Cruise',
    country: 'Vietnam',
    flag: '🇻🇳',
    category: 'luxury',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&fit=crop&auto=format',
    pricePerPerson: 890,
    days: 4,
    rating: 4.96,
    reviewCount: 289,
    accentColor: '#10b981', // Emerald green
    highlights: ['5-Star Boutique Junk Sail', 'Sung Sot Cave Kayaking', 'Sunset Wine Tasting on Deck'],
    description: 'Drift through limestone karst towers on an ultra-luxury wooden junk boat with private balcony suites.',
    included: ['Ocean-Suite Cabin', 'All Gourmet Seafood Meals', 'Guided Cave Kayaking', 'Helicopter Transfer Option'],
  },
  {
    id: 'bali-sanctuary',
    name: 'Bali Celestial Tropical Haven',
    country: 'Indonesia',
    flag: '🇮🇩',
    category: 'beach',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&fit=crop&auto=format',
    pricePerPerson: 1200,
    days: 6,
    rating: 4.95,
    reviewCount: 412,
    accentColor: '#06b6d4', // Cyan ocean
    highlights: ['Ubud Infinity Pool Villa', 'Tanah Lot Sunset Temple', 'Sound Bath & Holistic Spa'],
    description: 'Rejuvenate your soul amidst lush jungle ravines, cliffside infinity pools, and sacred sea temples.',
    included: ['Private Pool Villa', 'Daily Holistic Spa & Yoga', 'Private Driver & SUV', 'Floating Breakfast Experience'],
  },
  {
    id: 'santorini-sunset',
    name: 'Santorini Crimson Sunset Resort',
    country: 'Greece',
    flag: '🇬🇷',
    category: 'luxury',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&fit=crop&auto=format',
    pricePerPerson: 2100,
    days: 8,
    rating: 4.99,
    reviewCount: 520,
    accentColor: '#6366f1', // Sapphire blue
    highlights: ['Oia Caldera Cliffside Cave', 'Catamaran Volcanic Cruise', 'Assyrtiko Wine Cellar Tasting'],
    description: 'Iconic whitewashed architecture, subterranean cave suites, and world-famous Aegean volcanic sunsets.',
    included: ['Cliffside Cave Suite', 'Private Yacht Catamaran Tour', 'Sommelier Wine Tasting', 'Daily Sunset Champagne'],
  },
  {
    id: 'swiss-matterhorn',
    name: 'Swiss Alpine Glacier Express',
    country: 'Switzerland',
    flag: '🇨🇭',
    category: 'alpine',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&fit=crop&auto=format',
    pricePerPerson: 2650,
    days: 9,
    rating: 4.97,
    reviewCount: 198,
    accentColor: '#f59e0b', // Sunset amber
    highlights: ['Excellence Class Glacier Train', 'Zermatt Matterhorn Chalet', 'Jungfraujoch Top of Europe'],
    description: 'Panoramas of snow-capped peaks, alpine lakes, and historic panoramic train journeys through pristine valleys.',
    included: ['Glacier Express First-Class', 'Luxury Chalet Hotel Stay', 'Swiss Travel Pass Unlimited', 'Fondue & Wine Dinners'],
  },
  {
    id: 'serengeti-safari',
    name: 'Serengeti Golden Wildlife Safari',
    country: 'Tanzania',
    flag: '🇹🇿',
    category: 'wildlife',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&fit=crop&auto=format',
    pricePerPerson: 3100,
    days: 10,
    rating: 4.99,
    reviewCount: 374,
    accentColor: '#f43f5e', // Wild crimson
    highlights: ['Great Migration Tracking', 'Hot Air Balloon at Sunrise', 'Ngorongoro Crater Game Drive'],
    description: 'Witness nature’s greatest spectacle in luxury canvas lodges under the boundless starry African sky.',
    included: ['Luxury Tented Camp Lodges', '4x4 Open Safari Vehicle', 'Private Ranger & Tracker', 'Hot Air Balloon Safari & Champagne'],
  },
]

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sophia & Alexander Wright',
    location: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop&auto=format',
    trip: 'Kyoto Cherry Blossom Sanctuary',
    rating: 5,
    comment: 'The private ryokan experience and secret tea ceremony in Kyoto exceeded every expectation. The Aurora Travel concierge handled every detail seamlessly!',
  },
  {
    id: 2,
    name: 'Marcus Vance',
    location: 'New York, USA',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&fit=crop&auto=format',
    trip: 'Ha Long Bay Emerald Cruise',
    rating: 5,
    comment: 'Waking up on a luxury junk boat surrounded by misty limestone towers was pure magic. The seafood banquet and private kayaking were unforgettable.',
  },
  {
    id: 3,
    name: 'Elena Rostova',
    location: 'Zurich, Switzerland',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&fit=crop&auto=format',
    trip: 'Santorini Crimson Sunset Resort',
    rating: 5,
    comment: 'Watching the Oia sunset from our private infinity plunge pool with champagne was the highlight of our 10th anniversary. 10/10 travel planning!',
  },
]

export function AuroraTravelAgencySection({
  onAddToCart,
}: {
  onAddToCart?: (item: { id: string; name: string; country: string; flag: string; priceUsd: number }) => void
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [activeBookingItem, setActiveBookingItem] = useState<AuroraDestination | null>(null)
  const [guests, setGuests] = useState(2)
  const [tier, setTier] = useState<'standard' | 'luxury' | 'vip'>('luxury')
  const [addons, setAddons] = useState<{ [key: string]: boolean }>({ flight: true, dining: false, guide: true })
  const [bookingSuccess, setBookingSuccess] = useState(false)

  // Step wizard state for Trip Planner CTA
  const [plannerStep, setPlannerStep] = useState(1)
  const [vibe, setVibe] = useState('Tropical Beach')
  const [duration, setDuration] = useState('7-10 Days')
  const [budgetStyle, setBudgetStyle] = useState('5-Star Luxury Resort')
  const [plannerGenerated, setPlannerGenerated] = useState(false)

  const filteredDestinations = selectedCategory === 'all'
    ? DESTINATIONS
    : DESTINATIONS.filter((d) => d.category === selectedCategory)

  // Calculate live booking total
  const tierMultiplier = tier === 'standard' ? 1 : tier === 'luxury' ? 1.35 : 1.8
  const addonsTotal = (addons.flight ? 250 : 0) + (addons.dining ? 180 : 0) + (addons.guide ? 150 : 0)
  const calculatedTotal = activeBookingItem
    ? Math.round((activeBookingItem.pricePerPerson * tierMultiplier + addonsTotal) * guests)
    : 0

  return (
    <section className="relative w-full overflow-hidden bg-[#070913] text-[#f8fafc] py-20 px-4 sm:px-8">
      {/* ── Background Aurora Light Blobs ───────────────────────────────────── */}
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/20 blur-[140px] pointer-events-none aurora-glow-1" />
      <div className="absolute top-1/3 right-1/4 h-[600px] w-[600px] rounded-full bg-indigo-600/25 blur-[160px] pointer-events-none aurora-glow-2" />
      <div className="absolute bottom-10 left-1/3 h-[550px] w-[550px] rounded-full bg-rose-500/20 blur-[150px] pointer-events-none aurora-glow-3" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-20">
        {/* ── 1. Hero Header Section ───────────────────────────────────────── */}
        <div className="text-center space-y-6 max-w-4xl mx-auto pt-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full aurora-glass border border-emerald-500/30 text-xs font-mono uppercase tracking-widest text-emerald-400 shadow-lg">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Aurora Escapes · Premier Travel Agency</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-700 leading-[1.08] tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
            Journey Beyond Boundaries. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Vibrant Destinations Await.
            </span>
          </h1>

          <p className="font-body text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Curated luxury escapes, tailor-made itineraries, and unforgettable authentic encounters across the world’s most mesmerizing landscapes.
          </p>

          {/* Quick Search & Filter Bar */}
          <div className="pt-6">
            <div className="p-3 rounded-2xl aurora-glass aurora-border-glow shadow-2xl flex flex-col md:flex-row items-center gap-3">
              <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
                <span className="text-xl">📍</span>
                <div className="text-left w-full">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">Destination</label>
                  <input
                    type="text"
                    placeholder="Where do you dream of going?"
                    className="w-full bg-transparent text-sm font-body text-white outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="w-full md:w-48 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
                <span className="text-xl">📅</span>
                <div className="text-left">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">Duration</label>
                  <select className="bg-transparent text-sm font-body text-white outline-none cursor-pointer">
                    <option className="bg-slate-900 text-white">4–7 Days</option>
                    <option className="bg-slate-900 text-white">8–12 Days</option>
                    <option className="bg-slate-900 text-white">14+ Days Grand Tour</option>
                  </select>
                </div>
              </div>

              <div className="w-full md:w-40 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
                <span className="text-xl">👥</span>
                <div className="text-left">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">Travelers</label>
                  <select className="bg-transparent text-sm font-body text-white outline-none cursor-pointer">
                    <option className="bg-slate-900 text-white">2 Guests</option>
                    <option className="bg-slate-900 text-white">1 Guest</option>
                    <option className="bg-slate-900 text-white">Family (4+)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => {
                  const el = document.getElementById('destinations-grid')
                  el?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="w-full md:w-auto px-8 py-4 rounded-xl font-mono text-xs uppercase tracking-widest bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500 hover:from-emerald-400 hover:to-indigo-400 text-slate-950 font-700 shadow-xl shadow-emerald-500/20 cursor-pointer transition-all hover:scale-[1.02]"
              >
                Search Journeys
              </button>
            </div>
          </div>
        </div>

        {/* ── 2. Destination Showcase Grid ─────────────────────────────────── */}
        <div id="destinations-grid" className="space-y-10 pt-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-6">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-emerald-400 mb-2 flex items-center gap-2">
                <span>✦ Destination Showcase</span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-700 text-white text-left">
                Featured <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Handpicked Escapes</span>
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Escapes' },
                { id: 'luxury', label: '✨ Luxury Resort' },
                { id: 'culture', label: '🏯 Cultural Heritage' },
                { id: 'beach', label: '🏝️ Tropical Beach' },
                { id: 'alpine', label: '🏔️ Alpine Express' },
                { id: 'wildlife', label: '🦁 Wild Safari' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-700 border-emerald-400 shadow-lg shadow-emerald-500/20'
                      : 'aurora-glass text-slate-300 border-slate-700/60 hover:border-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((dest) => (
              <div
                key={dest.id}
                className="group relative overflow-hidden rounded-2xl aurora-glass aurora-border-glow border border-slate-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(16,185,129,0.25)] flex flex-col justify-between"
              >
                <div>
                  {/* Card Cover Image */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#070913] via-transparent to-black/30" />

                    {/* Country & Flag Badge top-left */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs font-mono text-white">
                      <span>{dest.flag}</span>
                      <span>{dest.country}</span>
                    </div>

                    {/* Rating top-right */}
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-slate-950 font-mono text-xs font-700 shadow-md">
                      <span>★</span>
                      <span>{dest.rating}</span>
                      <span className="text-[10px] opacity-80">({dest.reviewCount})</span>
                    </div>

                    {/* Days Tag bottom-left */}
                    <div className="absolute bottom-3 left-3 z-10">
                      <span className="px-3 py-1 rounded-md bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 text-emerald-300 font-mono text-xs">
                        ⏱️ {dest.days} Days / {dest.days - 1} Nights
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4 text-left">
                    <h3 className="font-display text-2xl font-700 text-white group-hover:text-cyan-300 transition-colors">
                      {dest.name}
                    </h3>

                    <p className="font-body text-sm text-slate-300 line-clamp-2 leading-relaxed">
                      {dest.description}
                    </p>

                    {/* Highlights List */}
                    <div className="space-y-1.5 pt-1">
                      {dest.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-mono text-slate-400">
                          <span style={{ color: dest.accentColor }}>✦</span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="p-6 pt-0 border-t border-slate-800/80 mt-4 flex items-center justify-between gap-4">
                  <div>
                    <span className="block text-[10px] font-mono uppercase text-slate-400">From</span>
                    <span className="font-mono text-2xl font-700 text-white" style={{ color: dest.accentColor }}>
                      ${dest.pricePerPerson}
                    </span>
                    <span className="text-xs text-slate-400 font-mono"> / guest</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setActiveBookingItem(dest)
                        setBookingSuccess(false)
                      }}
                      className="px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-widest bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-700 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer hover:scale-105"
                    >
                      Book Tour
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. Traveler Testimonials Section ─────────────────────────────── */}
        <div className="space-y-10 pt-10">
          <div className="text-center space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">✦ Verified Traveler Stories</span>
            <h2 className="font-display text-3xl sm:text-5xl font-700 text-white">
              Loved by <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">Global Explorers</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="p-6 rounded-2xl aurora-glass aurora-border-glow space-y-4 text-left">
                <div className="flex items-center gap-4">
                  <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full object-cover border-2 border-emerald-400/50" />
                  <div>
                    <h4 className="font-display text-base font-600 text-white">{t.name}</h4>
                    <p className="font-mono text-xs text-slate-400">{t.location}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {t.trip}
                  </span>
                  <span className="text-amber-400 font-bold">★★★★★</span>
                </div>

                <p className="font-body text-sm text-slate-300 leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. Interactive Trip Planner Wizard CTA ───────────────────────── */}
        <div className="p-8 sm:p-12 rounded-3xl aurora-glass aurora-border-glow border border-indigo-500/30 text-left space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-emerald-400">✦ Instant Customizer</span>
              <h2 className="font-display text-3xl sm:text-4xl font-700 text-white mt-1">
                Design Your <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">Dream Escape</span>
              </h2>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
              <span>Step {plannerStep} of 3</span>
              <div className="flex gap-1.5">
                {[1, 2, 3].map((s) => (
                  <span
                    key={s}
                    className={`h-2 rounded-full transition-all ${
                      s === plannerStep ? 'w-6 bg-emerald-400' : 'w-2 bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Wizard Steps */}
          {plannerStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="font-mono text-sm uppercase tracking-wider text-slate-300">1. Select Preferred Vibe & Landscape:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { title: 'Tropical Beach', icon: '🏝️', desc: 'Turquoise waters & coral lagoons' },
                  { title: 'Cultural Heritage', icon: '🏯', desc: 'Ancient temples & UNESCO sites' },
                  { title: 'Alpine Peaks', icon: '🏔️', desc: 'Glaciers, trains & mountain vistas' },
                  { title: 'Wild Safari', icon: '🦁', desc: 'Great migration & lodges' },
                ].map((v) => (
                  <button
                    key={v.title}
                    onClick={() => setVibe(v.title)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      vibe === v.title
                        ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-2xl mb-2">{v.icon}</div>
                    <div className="font-display font-600 text-base">{v.title}</div>
                    <div className="font-mono text-[11px] mt-1 opacity-70">{v.desc}</div>
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setPlannerStep(2)}
                  className="px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-widest bg-emerald-500 text-slate-950 font-700 cursor-pointer hover:bg-emerald-400"
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {plannerStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="font-mono text-sm uppercase tracking-wider text-slate-300">2. Travel Duration & Pace:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: '3–5 Days', label: 'Weekend Escape', detail: 'Concise highlights & relaxation' },
                  { title: '7–10 Days', label: 'Classic Immersion', detail: 'Comprehensive regional exploration' },
                  { title: '14+ Days', label: 'Grand Expedition', detail: 'Multi-country slow luxury travel' },
                ].map((d) => (
                  <button
                    key={d.title}
                    onClick={() => setDuration(d.title)}
                    className={`p-5 rounded-xl border text-left transition-all cursor-pointer ${
                      duration === d.title
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-mono text-xs text-cyan-400">{d.label}</div>
                    <div className="font-display text-2xl font-700 my-1">{d.title}</div>
                    <div className="font-mono text-[11px] opacity-70">{d.detail}</div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setPlannerStep(1)}
                  className="px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-widest border border-slate-700 text-slate-300 cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setPlannerStep(3)}
                  className="px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-widest bg-cyan-500 text-slate-950 font-700 cursor-pointer hover:bg-cyan-400"
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {plannerStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="font-mono text-sm uppercase tracking-wider text-slate-300">3. Accommodation & Service Tier:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: 'Boutique Resort', price: '$1,200 avg', desc: 'Charming 4-star boutique hotels' },
                  { title: '5-Star Luxury Resort', price: '$2,400 avg', desc: 'Private villas, fine dining & spa' },
                  { title: 'Royal VIP Private', price: '$4,800 avg', desc: 'Private yacht, helicopter & butler' },
                ].map((b) => (
                  <button
                    key={b.title}
                    onClick={() => setBudgetStyle(b.title)}
                    className={`p-5 rounded-xl border text-left transition-all cursor-pointer ${
                      budgetStyle === b.title
                        ? 'bg-indigo-500/20 border-indigo-400 text-white shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-display font-600 text-lg">{b.title}</div>
                    <div className="font-mono text-xs text-indigo-400 my-1">{b.price}</div>
                    <div className="font-mono text-[11px] opacity-70">{b.desc}</div>
                  </button>
                ))}
              </div>

              {plannerGenerated ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-400/40 text-left space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-widest">
                    <span>✓ Custom Itinerary Generated</span>
                  </div>
                  <h4 className="font-display text-2xl font-700 text-white">
                    {vibe} · {duration} ({budgetStyle})
                  </h4>
                  <p className="font-body text-sm text-slate-300">
                    Your bespoke travel package has been calculated. Estimated price: <strong className="text-emerald-400">$1,850 – $3,200 per guest</strong>. Includes private transfers, boutique accommodations, and curated activities.
                  </p>
                  <button
                    onClick={() => {
                      if (onAddToCart) {
                        onAddToCart({
                          id: 'custom-trip-' + Date.now(),
                          name: `Custom ${vibe} Expedition (${duration})`,
                          country: 'Bespoke Package',
                          flag: '✨',
                          priceUsd: 1850,
                        })
                      }
                      alert('Your tailor-made itinerary has been added to your cart!')
                    }}
                    className="px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-widest bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-700 shadow-lg cursor-pointer"
                  >
                    🛒 Add Custom Package to Booking Cart ($1,850)
                  </button>
                </div>
              ) : (
                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setPlannerStep(2)}
                    className="px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-widest border border-slate-700 text-slate-300 cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setPlannerGenerated(true)}
                    className="px-8 py-3.5 rounded-xl font-mono text-xs uppercase tracking-widest bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500 hover:from-emerald-400 hover:to-indigo-400 text-slate-950 font-700 shadow-xl cursor-pointer"
                  >
                    ✨ Generate Custom Itinerary
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── 5. Booking Preview Modal ───────────────────────────────────────── */}
      {activeBookingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={() => setActiveBookingItem(null)}
        >
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl aurora-glass border border-emerald-500/40 shadow-2xl text-left text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
              <img src={activeBookingItem.image} alt={activeBookingItem.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070913] via-transparent to-black/40" />

              <button
                onClick={() => setActiveBookingItem(null)}
                className="absolute top-4 right-4 z-20 h-9 w-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black cursor-pointer"
              >
                ✕
              </button>

              <div className="absolute bottom-4 left-4 z-20">
                <span className="font-mono text-xs px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-700">
                  {activeBookingItem.flag} {activeBookingItem.country}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-700 text-white mt-1">
                  {activeBookingItem.name}
                </h3>
              </div>
            </div>

            {/* Modal Body & Interactive Calculator */}
            <div className="p-6 sm:p-8 space-y-6">
              {bookingSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="text-5xl">🎉</div>
                  <h4 className="font-display text-3xl font-700 text-emerald-400">Reservation Confirmed!</h4>
                  <p className="font-body text-slate-300 max-w-md mx-auto">
                    Your spot for <strong>{activeBookingItem.name}</strong> ({guests} Guests) has been reserved. Our concierge will contact you with your flight details.
                  </p>
                  <button
                    onClick={() => setActiveBookingItem(null)}
                    className="px-8 py-3 rounded-xl bg-emerald-500 text-slate-950 font-mono text-xs uppercase tracking-widest font-700 cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  {/* Tier Selector */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">Select Escape Package Tier:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'standard', name: 'Classic', desc: 'Standard 4★' },
                        { id: 'luxury', name: 'Luxury Resort', desc: '5★ Resort Villa' },
                        { id: 'vip', name: 'VIP Private', desc: 'Helicopter & Butler' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setTier(t.id as any)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            tier === t.id
                              ? 'bg-emerald-500/20 border-emerald-400 text-white'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400'
                          }`}
                        >
                          <div className="font-mono text-xs font-600">{t.name}</div>
                          <div className="font-mono text-[10px] text-slate-400 mt-0.5">{t.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Guest Counter */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div>
                      <span className="block font-mono text-xs uppercase tracking-wider text-slate-300">Traveler Count</span>
                      <span className="text-xs text-slate-400 font-mono">${activeBookingItem.pricePerPerson} per person</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="h-8 w-8 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-mono text-lg font-bold w-6 text-center">{guests}</span>
                      <button
                        onClick={() => setGuests(guests + 1)}
                        className="h-8 w-8 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Add-ons */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">Included Services & Upgrades:</label>
                    <div className="space-y-2">
                      {[
                        { key: 'flight', label: 'Airport Limousine & Fast-Track Customs', price: 250 },
                        { key: 'dining', label: 'Gourmet Michelin Wine Tasting Experience', price: 180 },
                        { key: 'guide', label: 'Dedicated Private Historian Guide', price: 150 },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-800 cursor-pointer hover:bg-slate-800/50">
                          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                            <input
                              type="checkbox"
                              checked={!!addons[item.key]}
                              onChange={(e) => setAddons({ ...addons, [item.key]: e.target.checked })}
                              className="accent-emerald-500 h-4 w-4 rounded cursor-pointer"
                            />
                            <span>{item.label}</span>
                          </div>
                          <span className="font-mono text-xs text-emerald-400">+${item.price}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Calculation Summary & CTA */}
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <span className="block text-[10px] font-mono uppercase text-slate-400">Total Price ({guests} Guests)</span>
                      <span className="font-mono text-3xl font-700 text-emerald-400">
                        ${calculatedTotal.toLocaleString('en-US')}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (onAddToCart) {
                            onAddToCart({
                              id: activeBookingItem.id + '-' + Date.now(),
                              name: activeBookingItem.name,
                              country: activeBookingItem.country,
                              flag: activeBookingItem.flag,
                              priceUsd: calculatedTotal,
                            })
                          }
                          setBookingSuccess(true)
                        }}
                        className="px-8 py-3.5 rounded-xl font-mono text-xs uppercase tracking-widest bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-700 shadow-xl cursor-pointer"
                      >
                        ⚡ Reserve Spot Now
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
