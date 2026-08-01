import React, { useState } from 'react'
import { ASIAN_COUNTRIES, type DishData } from './EastAsiaCulinaryData'

export function FlavorComparatorModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const allDishes: { countryName: string; flag: string; dish: DishData }[] = []
  ASIAN_COUNTRIES.forEach((c) => {
    c.dishes.forEach((d) => {
      allDishes.push({ countryName: c.name, flag: c.flag, dish: d })
    })
  })

  const [dish1Id, setDish1Id] = useState<string>(allDishes[0]?.dish.id || '')
  const [dish2Id, setDish2Id] = useState<string>(allDishes[2]?.dish.id || '')

  if (!isOpen) return null

  const selected1 = allDishes.find((x) => x.dish.id === dish1Id) || allDishes[0]
  const selected2 = allDishes.find((x) => x.dish.id === dish2Id) || allDishes[2]

  const metricsList = [
    { key: 'spiciness', label: '🔥 Độ Cay', color1: '#ef4444', color2: '#f97316' },
    { key: 'umami', label: '🍲 Độ Umami Đậm Đà', color1: '#8b5cf6', color2: '#a855f7' },
    { key: 'sweetness', label: '🍯 Độ Ngọt Thanh', color1: '#f59e0b', color2: '#eab308' },
    { key: 'sourness', label: '🍋 Độ Chua Dịu', color1: '#84cc16', color2: '#10b981' },
    { key: 'aroma', label: '🌿 Hương Thảo Mộc', color1: '#06b6d4', color2: '#3b82f6' },
  ] as const

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#1a120c] border border-amber-800/40 text-amber-100 p-6 sm:p-10 text-left shadow-2xl space-y-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-amber-900/40 pb-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold">
              ⚖️ Công Cụ So Sánh Hương Vị Đông Á & ĐNA
            </span>
            <h3 className="font-display text-2xl sm:text-4xl font-700 text-white mt-1">
              Flavor Profile Comparator
            </h3>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-amber-950/80 text-amber-300 flex items-center justify-center hover:bg-amber-900 cursor-pointer text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Dish Selection Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dish 1 Select */}
          <div className="p-4 rounded-2xl bg-[#251b14] border border-amber-700/50 space-y-3">
            <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              Món Ăn Thứ Nhất (Dish A)
            </label>
            <select
              value={dish1Id}
              onChange={(e) => setDish1Id(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#1a120c] border border-amber-800/60 text-white font-mono text-sm outline-none cursor-pointer"
            >
              {allDishes.map((item) => (
                <option key={item.dish.id} value={item.dish.id}>
                  {item.flag} {item.countryName} — {item.dish.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-3 pt-2">
              <img
                src={selected1.dish.image}
                alt={selected1.dish.name}
                className="h-16 w-24 rounded-xl object-cover border border-amber-700/50"
              />
              <div>
                <div className="font-display font-600 text-base text-white">{selected1.dish.name}</div>
                <div className="font-mono text-xs text-amber-400">${selected1.dish.priceUsd} USD</div>
              </div>
            </div>
          </div>

          {/* Dish 2 Select */}
          <div className="p-4 rounded-2xl bg-[#251b14] border border-amber-700/50 space-y-3">
            <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              Món Ăn Thứ Hai (Dish B)
            </label>
            <select
              value={dish2Id}
              onChange={(e) => setDish2Id(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#1a120c] border border-amber-800/60 text-white font-mono text-sm outline-none cursor-pointer"
            >
              {allDishes.map((item) => (
                <option key={item.dish.id} value={item.dish.id}>
                  {item.flag} {item.countryName} — {item.dish.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-3 pt-2">
              <img
                src={selected2.dish.image}
                alt={selected2.dish.name}
                className="h-16 w-24 rounded-xl object-cover border border-amber-700/50"
              />
              <div>
                <div className="font-display font-600 text-base text-white">{selected2.dish.name}</div>
                <div className="font-mono text-xs text-amber-400">${selected2.dish.priceUsd} USD</div>
              </div>
            </div>
          </div>
        </div>

        {/* Side-by-Side Metric Radar Bars */}
        <div className="space-y-5 p-6 rounded-2xl bg-[#221811] border border-amber-900/50">
          <h4 className="font-display text-xl font-700 text-white text-center">
            Bảng So Sánh Chỉ Số Vị Giác (1–5 Điểm)
          </h4>

          <div className="space-y-4">
            {metricsList.map((m) => {
              const val1 = selected1.dish.metrics[m.key]
              const val2 = selected2.dish.metrics[m.key]
              return (
                <div key={m.key} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-amber-300 font-bold">{selected1.dish.name}: {val1}/5</span>
                    <span className="text-slate-300 font-bold">{m.label}</span>
                    <span className="text-amber-400 font-bold">{selected2.dish.name}: {val2}/5</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Bar 1 */}
                    <div className="h-3 rounded-full bg-slate-900 overflow-hidden flex justify-end">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${(val1 / 5) * 100}%`, backgroundColor: m.color1 }}
                      />
                    </div>
                    {/* Bar 2 */}
                    <div className="h-3 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${(val2 / 5) * 100}%`, backgroundColor: m.color2 }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Summary Verdict */}
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/40 font-body text-sm text-amber-100/90 leading-relaxed">
          💡 <strong>Góc Nhìn Ẩm Thực:</strong> Món <strong>{selected1.dish.name}</strong> ({selected1.flag}) sở hữu độ {selected1.dish.metrics.spiciness > selected2.dish.metrics.spiciness ? 'cay nồng hơn' : 'thanh dịu hơn'} và vị thảo mộc nổi bật, trong khi món <strong>{selected2.dish.name}</strong> ({selected2.flag}) thể hiện độ umami béo thơm đặc trưng của nền ẩm thực bản địa.
        </div>
      </div>
    </div>
  )
}
