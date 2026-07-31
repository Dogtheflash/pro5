import React, { useState } from 'react'

export interface MenuItem {
  id: string
  name: string
  category: 'starters' | 'mains' | 'desserts' | 'drinks'
  price: number
  image: string
  description: string
  tags: string[]
  isChefSpecial?: boolean
  spiceLevel?: number // 0-3
}

export const RESTAURANT_MENU: MenuItem[] = [
  {
    id: 'pho-bo-wagyu',
    name: 'Wagyu Beef Pho Supreme',
    category: 'mains',
    price: 26,
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&fit=crop&auto=format',
    description: '24-hour slow-simmered bone broth with star anise, cinnamon, thinly sliced A5 Wagyu beef, fresh rice noodles, and heirloom herbs.',
    tags: ['Signature', 'Gluten-Free'],
    isChefSpecial: true,
    spiceLevel: 1,
  },
  {
    id: 'banh-xeo-crispy',
    name: 'Crispy Saffron Crepe (Bánh Xèo)',
    category: 'starters',
    price: 18,
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&fit=crop&auto=format',
    description: 'Golden turmeric & coconut rice crepe stuffed with wild tiger prawns, berkshire pork belly, bean sprouts, served with mustard leaf wraps & sweet chili dip.',
    tags: ['Crispy', 'Popular'],
    isChefSpecial: false,
    spiceLevel: 1,
  },
  {
    id: 'cha-ca-la-vong',
    name: 'Hanoi Turmeric Fish (Chả Cá Lạ Vọng)',
    category: 'mains',
    price: 32,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&fit=crop&auto=format',
    description: 'Sizzling pan-seared red snapper marinated in galangal & turmeric, tossed with heaps of fresh dill & scallions over vermicelli noodles.',
    tags: ['Chef Special', 'Farm-to-Table'],
    isChefSpecial: true,
    spiceLevel: 0,
  },
  {
    id: 'gỏi-cuốn-spring-rolls',
    name: 'Fresh Garden Summer Rolls',
    category: 'starters',
    price: 14,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&fit=crop&auto=format',
    description: 'Hand-rolled rice paper filled with poach shrimp, aromatic Thai basil, mint, cucumber, and vermicelli with roasted peanut dipping sauce.',
    tags: ['Fresh', 'Vegan Option'],
    isChefSpecial: false,
    spiceLevel: 0,
  },
  {
    id: 'che-xoai-mango',
    name: 'Golden Mango Coconut Sago Dessert',
    category: 'desserts',
    price: 12,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&fit=crop&auto=format',
    description: 'Ripe sweet Cat Chu mango slices served over chilled coconut milk tapioca pearls with toasted coconut flakes & mint.',
    tags: ['Sweet', 'Gluten-Free'],
    isChefSpecial: true,
    spiceLevel: 0,
  },
  {
    id: 'cocktail-saigon-sunset',
    name: 'Saigon Sunset Craft Cocktail',
    category: 'drinks',
    price: 16,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&fit=crop&auto=format',
    description: 'Artisanal Vietnamese spiced rum, passion fruit puree, lemongrass syrup, fresh lime juice, and a rim of chili sea salt.',
    tags: ['Craft Spirits', 'Refreshing'],
    isChefSpecial: true,
    spiceLevel: 1,
  },
]

export function WarmRestaurantSection({
  onAddToCart,
}: {
  onAddToCart?: (item: { id: string; name: string; country: string; flag: string; priceUsd: number }) => void
}) {
  const [activeMenuTab, setActiveMenuTab] = useState<'all' | 'starters' | 'mains' | 'desserts' | 'drinks'>('all')

  // Reservation state
  const [resDate, setResDate] = useState('2026-08-05')
  const [resTime, setResTime] = useState('19:00')
  const [resGuests, setResGuests] = useState(2)
  const [resSeating, setResSeating] = useState('Main Dining Hall')
  const [resName, setResName] = useState('')
  const [resPhone, setResPhone] = useState('')
  const [resConfirmed, setResConfirmed] = useState(false)

  const filteredMenu = activeMenuTab === 'all'
    ? RESTAURANT_MENU
    : RESTAURANT_MENU.filter((m) => m.category === activeMenuTab)

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!resName || !resPhone) {
      alert('Please fill in your name and phone number.')
      return
    }
    setResConfirmed(true)
  }

  return (
    <section className="relative w-full bg-[#1c140e] text-[#fef3c7] py-20 px-4 sm:px-8 overflow-hidden">
      {/* Background Warm Glows */}
      <div className="absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-amber-600/15 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 h-[600px] w-[600px] rounded-full bg-orange-700/15 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-24">
        {/* ── 1. Warm Hero Banner ─────────────────────────────────────────── */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#291e18] via-[#38261b] to-[#291e18] border border-amber-800/40 p-8 sm:p-16 text-left shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-xs font-mono uppercase tracking-widest text-amber-300">
                <span>🔥 L'Aroma Heritage Bistro & Bar</span>
              </div>

              <h1 className="font-display text-4xl sm:text-6xl font-700 leading-tight text-white">
                Savor the Warmth of <br />
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                  Authentic Culinary Passion
                </span>
              </h1>

              <p className="font-body text-base sm:text-lg text-amber-100/80 leading-relaxed max-w-xl">
                Experience wood-fired specialties, slow-simmered artisanal broths, and hand-crafted botanical cocktails served in an inviting, candle-lit atmosphere.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    const el = document.getElementById('menu-preview')
                    el?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="px-8 py-4 rounded-xl font-mono text-xs uppercase tracking-widest bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-slate-950 font-700 shadow-xl shadow-amber-600/30 cursor-pointer transition-all hover:scale-105"
                >
                  Explore Our Menu
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('table-reservation')
                    el?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="px-8 py-4 rounded-xl font-mono text-xs uppercase tracking-widest border border-amber-500/50 bg-amber-950/40 text-amber-200 hover:bg-amber-900/60 transition-all cursor-pointer"
                >
                  Reserve a Table
                </button>
              </div>
            </div>

            {/* Hero Image Collage */}
            <div className="relative aspect-square max-w-md mx-auto w-full rounded-2xl overflow-hidden border-2 border-amber-600/30 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&fit=crop&auto=format"
                alt="Warm restaurant dining table with appetizing food"
                className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c140e] via-transparent to-transparent opacity-60" />

              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#291e18]/90 backdrop-blur-md border border-amber-700/50 text-left space-y-1">
                <div className="flex items-center justify-between text-xs font-mono text-amber-400 font-bold">
                  <span>★ 4.97 / 5 Michelin Recommended</span>
                  <span>Farm Fresh</span>
                </div>
                <div className="font-display font-600 text-lg text-white">Daily Chef Special Degustation</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. Menu Preview Section ─────────────────────────────────────── */}
        <div id="menu-preview" className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-amber-900/40 pb-6">
            <div className="text-left">
              <span className="font-mono text-xs uppercase tracking-widest text-amber-400">✦ Culinary Offerings</span>
              <h2 className="font-display text-3xl sm:text-5xl font-700 text-white mt-1">
                Vibrant <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Menu Selection</span>
              </h2>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Dishes' },
                { id: 'starters', label: '🥗 Starters' },
                { id: 'mains', label: '🍲 Signature Mains' },
                { id: 'desserts', label: '🥭 Sweets & Desserts' },
                { id: 'drinks', label: '🍸 Craft Drinks' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveMenuTab(tab.id as any)}
                  className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                    activeMenuTab === tab.id
                      ? 'bg-amber-500 text-slate-950 font-700 border-amber-400 shadow-lg shadow-amber-500/20'
                      : 'bg-[#291e18] text-amber-200/70 border-amber-900/50 hover:border-amber-500 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMenu.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl bg-[#251b14] border border-amber-900/40 hover:border-amber-500/60 transition-all duration-300 hover:-translate-y-2 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {item.isChefSpecial && (
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-mono text-[10px] font-700 uppercase tracking-widest shadow-md">
                        Chef's Choice
                      </span>
                    )}

                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-600/40 text-amber-400 font-mono text-sm font-700">
                      ${item.price}
                    </span>
                  </div>

                  <div className="p-6 space-y-3 text-left">
                    <h3 className="font-display text-xl font-700 text-white group-hover:text-amber-300 transition-colors">
                      {item.name}
                    </h3>
                    <p className="font-body text-sm text-amber-100/70 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {item.tags.map((t) => (
                        <span key={t} className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-amber-900/30 mt-4 flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-400/80">Fresh Ingredients</span>
                  {onAddToCart && (
                    <button
                      onClick={() => onAddToCart({
                        id: item.id,
                        name: item.name,
                        country: 'Restaurant Signature',
                        flag: '🍽️',
                        priceUsd: item.price,
                      })}
                      className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-mono text-xs uppercase font-700 transition-colors cursor-pointer"
                    >
                      🛒 Add to Order (${item.price})
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. Chef Story Section ───────────────────────────────────────── */}
        <div className="p-8 sm:p-14 rounded-3xl bg-[#291e18] border border-amber-800/40 text-left shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-amber-700/50 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&fit=crop&auto=format"
                alt="Executive Chef preparing artisanal dishes"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#291e18] via-transparent to-transparent opacity-40" />
            </div>

            <div className="space-y-6">
              <span className="font-mono text-xs uppercase tracking-widest text-amber-400">✦ Master Culinary Craftsman</span>
              <h2 className="font-display text-3xl sm:text-4xl font-700 text-white">
                Chef Minh & The Philosophy of <span className="text-amber-400">Heartfelt Warmth</span>
              </h2>

              <p className="font-body text-base text-amber-100/80 leading-relaxed">
                "Cooking is a warm embrace passed from one generation to the next. We source our organic herbs from local micro-farms every morning, simmering our broths over applewood coals to capture deep, nostalgic aromas."
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-amber-900/50 font-mono text-center">
                <div className="p-3 rounded-xl bg-[#1c140e] border border-amber-900/40">
                  <div className="text-2xl font-700 text-amber-400">25+</div>
                  <div className="text-[10px] text-amber-200/60 uppercase">Years Heritage</div>
                </div>
                <div className="p-3 rounded-xl bg-[#1c140e] border border-amber-900/40">
                  <div className="text-2xl font-700 text-amber-400">100%</div>
                  <div className="text-[10px] text-amber-200/60 uppercase">Organic Farm</div>
                </div>
                <div className="p-3 rounded-xl bg-[#1c140e] border border-amber-900/40">
                  <div className="text-2xl font-700 text-amber-400">4.97★</div>
                  <div className="text-[10px] text-amber-200/60 uppercase">Guest Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4. Table Reservation System ─────────────────────────────────── */}
        <div id="table-reservation" className="p-8 sm:p-12 rounded-3xl bg-[#251b14] border border-amber-800/40 text-left shadow-2xl">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-amber-400">✦ Instant Online Booking</span>
              <h2 className="font-display text-3xl sm:text-5xl font-700 text-white">
                Reserve Your <span className="bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent">Dining Experience</span>
              </h2>
              <p className="font-body text-sm text-amber-100/70">
                Book a table in our warm main dining hall, peaceful garden terrace, or private chef's counter.
              </p>
            </div>

            {resConfirmed ? (
              <div className="p-8 rounded-2xl bg-amber-500/10 border border-amber-400 text-center space-y-4">
                <div className="text-5xl">🥂</div>
                <h3 className="font-display text-3xl font-700 text-amber-400">Reservation Confirmed!</h3>
                <p className="font-body text-amber-100 max-w-md mx-auto">
                  Thank you, <strong>{resName}</strong>! Your table for <strong>{resGuests} Guests</strong> has been booked for <strong>{resDate} at {resTime}</strong> in the {resSeating}.
                </p>
                <button
                  onClick={() => setResConfirmed(false)}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-mono text-xs uppercase tracking-widest font-700 cursor-pointer"
                >
                  Make Another Reservation
                </button>
              </div>
            ) : (
              <form onSubmit={handleReservationSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-amber-300 mb-1">Reservation Date</label>
                    <input
                      type="date"
                      value={resDate}
                      onChange={(e) => setResDate(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[#1c140e] border border-amber-800/60 text-white font-mono text-sm outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-amber-300 mb-1">Preferred Time</label>
                    <select
                      value={resTime}
                      onChange={(e) => setResTime(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[#1c140e] border border-amber-800/60 text-white font-mono text-sm outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option className="bg-[#1c140e]">17:30 — Early Dinner</option>
                      <option className="bg-[#1c140e]">18:30 — Evening Prime</option>
                      <option className="bg-[#1c140e]">19:30 — Peak Candlelight</option>
                      <option className="bg-[#1c140e]">20:30 — Late Supper</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-amber-300 mb-1">Number of Guests</label>
                    <select
                      value={resGuests}
                      onChange={(e) => setResGuests(Number(e.target.value))}
                      className="w-full p-3 rounded-xl bg-[#1c140e] border border-amber-800/60 text-white font-mono text-sm outline-none focus:border-amber-400 cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                        <option key={n} value={n} className="bg-[#1c140e]">{n} Guests</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-amber-300 mb-1">Seating Area</label>
                    <select
                      value={resSeating}
                      onChange={(e) => setResSeating(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[#1c140e] border border-amber-800/60 text-white font-mono text-sm outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option className="bg-[#1c140e]">Main Dining Hall</option>
                      <option className="bg-[#1c140e]">Garden Terrace</option>
                      <option className="bg-[#1c140e]">Private Chef Counter</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-amber-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Eleanor Vance"
                      value={resName}
                      onChange={(e) => setResName(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[#1c140e] border border-amber-800/60 text-white font-body text-sm outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-amber-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. +1 (555) 234-5678"
                      value={resPhone}
                      onChange={(e) => setResPhone(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[#1c140e] border border-amber-800/60 text-white font-mono text-sm outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl font-mono text-xs uppercase tracking-widest bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-slate-950 font-700 shadow-xl shadow-amber-600/20 transition-all cursor-pointer hover:scale-[1.01]"
                >
                  Confirm Table Reservation
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── 5. Location Map & Contact Info ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
          <div className="p-8 rounded-3xl bg-[#291e18] border border-amber-800/40 space-y-6">
            <span className="font-mono text-xs uppercase tracking-widest text-amber-400">📍 Find Us</span>
            <h3 className="font-display text-3xl font-700 text-white">Location & Hours</h3>

            <div className="space-y-4 font-mono text-sm text-amber-100/80">
              <div className="flex items-start gap-3">
                <span className="text-xl">🏛️</span>
                <div>
                  <div className="text-white font-bold">Address</div>
                  <div>128 Trang Tien Street, Hoan Kiem District, Hanoi, Vietnam</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-xl">🕒</span>
                <div>
                  <div className="text-white font-bold">Opening Hours</div>
                  <div>Lunch: 11:30 – 14:30 | Dinner: 17:30 – 22:30 (Daily)</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-xl">📞</span>
                <div>
                  <div className="text-white font-bold">Direct Line & Concierge</div>
                  <div>+84 (0) 24 3825 9999 | concierge@laromabistro.vn</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-[#251b14] border border-amber-800/40 p-8 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-widest text-amber-400">🗺️ Map & Valet Parking</span>
              <h4 className="font-display text-2xl font-700 text-white">Valet Service Available</h4>
              <p className="font-body text-sm text-amber-100/70">
                Complimentary valet parking is available at our main entrance on Trang Tien Street.
              </p>
            </div>

            <div className="pt-6">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-widest bg-amber-500 hover:bg-amber-400 text-slate-950 font-700 shadow-lg cursor-pointer transition-colors"
              >
                <span>📍 Get Google Maps Directions</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
