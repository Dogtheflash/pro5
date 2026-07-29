// The Asia Grand Tour — multi-country travel journal
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import LoadingScreen from './LoadingScreen'
import { SiteFooter } from './site/footer'
import LanguageDetectModal from './LanguageDetectModal'
import { getLocale, setLocale, isSupported, useLocale } from './i18n'
import { Tx } from './i18n/Tx'

interface Activity {
  time: string
  title: string
  description: string
  cost: number
  category: 'transport' | 'food' | 'attraction' | 'accommodation' | 'other'
}

interface Day {
  day: number
  date: string
  city: string
  coverImage: string
  coverAlt: string
  transport: string
  activities: Activity[]
}

const ITINERARY: Day[] = [
  {
    day: 1,
    date: 'Aug 4',
    city: 'Tokyo — Arrival & Shinjuku',
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'Tokyo skyline at dusk with neon lights',
    transport: 'Narita Express → Shinjuku (¥3,070)',
    activities: [
      { time: '14:00', title: 'Arrive at Narita Airport', description: 'Clear customs, pick up JR Pass and Suica card at the airport counter.', cost: 3070, category: 'transport' },
      { time: '16:30', title: 'Check in — Hotel Gracery Shinjuku', description: 'Iconic hotel with Godzilla head on the terrace. Rest and freshen up.', cost: 18000, category: 'accommodation' },
      { time: '18:30', title: 'Shinjuku Kabukicho stroll', description: 'Walk the neon-drenched entertainment district. Visit the famous Robot Restaurant area.', cost: 0, category: 'attraction' },
      { time: '20:00', title: 'Dinner — Omoide Yokocho', description: 'Memory Lane: yakitori skewers, cold Sapporo draft, smoke-filled tiny stalls.', cost: 2800, category: 'food' },
    ],
  },
  {
    day: 2,
    date: 'Aug 5',
    city: 'Tokyo — Asakusa & Akihabara',
    coverImage: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'Senso-ji temple gate in Asakusa with lanterns',
    transport: 'Tokyo Metro Day Pass (¥600)',
    activities: [
      { time: '07:00', title: 'Senso-ji Temple at dawn', description: "Arrive before the crowds. The ancient incense smoke and Kaminarimon gate glow in morning light. Tokyo's oldest temple.", cost: 0, category: 'attraction' },
      { time: '09:00', title: 'Breakfast — Nakamise street', description: 'Ningyo-yaki cakes, matcha soft serve, and taiyaki fish-shaped waffles from the market stalls.', cost: 900, category: 'food' },
      { time: '11:00', title: 'Sumida River cruise', description: '40-minute ferry to Hamarikyu Gardens. Pass under ancient bridges with the Tokyo skyline as backdrop.', cost: 1720, category: 'transport' },
      { time: '14:00', title: 'Akihabara Electric Town', description: 'Multi-floor electronics stores, retro game shops, manga cafes. Yodobashi Camera for cameras and gadgets.', cost: 0, category: 'attraction' },
      { time: '19:00', title: 'Dinner — Kanda curry street', description: 'Kanda is the curry capital of Tokyo. Try Maji Curry for the legendary 0→10 spice scale.', cost: 1400, category: 'food' },
    ],
  },
  {
    day: 3,
    date: 'Aug 6',
    city: 'Tokyo — Harajuku, Shibuya & Roppongi',
    coverImage: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'Shibuya crossing at night bustling with pedestrians',
    transport: 'Yamanote Line (included in JR Pass)',
    activities: [
      { time: '09:00', title: 'Meiji Shrine forest walk', description: "A 100-year-old forest in the heart of Tokyo. The towering torii gate and graveled paths create total calm.", cost: 0, category: 'attraction' },
      { time: '10:30', title: 'Takeshita Street, Harajuku', description: 'Crepe shops, pastel fashion, vintage Americana. Watch the fashion subcultures parade past.', cost: 800, category: 'food' },
      { time: '13:00', title: 'Lunch — Omotesando Hills', description: 'Upscale open-air mall. Try the basement food hall for artisan sandwiches and specialty coffee.', cost: 1800, category: 'food' },
      { time: '15:30', title: 'Shibuya Sky observation deck', description: 'Open-air rooftop with 360° Tokyo views. Book ahead — timed entry required.', cost: 2000, category: 'attraction' },
      { time: '17:00', title: 'Shibuya Crossing', description: 'The world\'s busiest intersection. Scramble with 3,000 people at the same time, or watch from Mag\'s Park above.', cost: 0, category: 'attraction' },
      { time: '20:00', title: 'Dinner — Gonpachi Nishiazabu', description: 'The "Kill Bill" restaurant. Multi-level izakaya with grilled chicken skewers and sake flights.', cost: 4200, category: 'food' },
    ],
  },
  {
    day: 4,
    date: 'Aug 7',
    city: 'Tokyo — Ueno, Ginza & teamLab',
    coverImage: 'https://images.unsplash.com/photo-1703437874711-d6d3de1e0013?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'Visitors immersed in glowing digital art at a teamLab installation',
    transport: 'Tokyo Metro Day Pass (¥600)',
    activities: [
      { time: '08:30', title: 'Tsukiji Outer Market breakfast', description: 'Tamagoyaki skewers, fresh uni, and grilled scallops among the surviving stalls of the old fish market.', cost: 2000, category: 'food' },
      { time: '10:30', title: 'Ueno Park & National Museum', description: 'Japan\'s oldest museum holds the finest collection of samurai armour, Buddhist art, and ukiyo-e prints.', cost: 1000, category: 'attraction' },
      { time: '13:00', title: 'Lunch — Ameyoko market', description: 'A raucous post-war market arcade. Grab kebabs, takoyaki, and bubble tea between discount shops.', cost: 1400, category: 'food' },
      { time: '15:00', title: 'Ginza & Itoya stationery', description: 'Tokyo\'s most refined shopping street. Twelve floors of paper goods at Itoya, flagship boutiques all around.', cost: 0, category: 'other' },
      { time: '17:30', title: 'teamLab Planets, Toyosu', description: 'Wade barefoot through knee-deep water rooms and infinite mirrored light gardens. Book a timed slot ahead.', cost: 3800, category: 'attraction' },
      { time: '20:30', title: 'Dinner — Ginza sushi counter', description: 'Omakase at an intimate counter. Edomae-style nigiri, one piece at a time, straight from the chef\'s hands.', cost: 6000, category: 'food' },
    ],
  },
  {
    day: 5,
    date: 'Aug 8',
    city: 'Nikko — Day Trip',
    coverImage: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'Ornate Tosho-gu shrine complex in Nikko surrounded by cedars',
    transport: 'Shinkansen Tokyo → Utsunomiya → Nikko (¥5,210, JR Pass)',
    activities: [
      { time: '07:30', title: 'Depart Tokyo → Nikko', description: 'Shinkansen to Utsunomiya, then local train up into the mountains. 2 hrs total.', cost: 5210, category: 'transport' },
      { time: '10:00', title: 'Tosho-gu Shrine complex', description: 'The most elaborately decorated shrine in Japan. Find the three wise monkeys and the sleeping cat carvings.', cost: 1300, category: 'attraction' },
      { time: '12:00', title: 'Lunch — Gyoza no Ohsho', description: 'Classic Nikko yuba (tofu skin) cuisine: silky, delicate, served warm with dipping sauce.', cost: 1600, category: 'food' },
      { time: '13:30', title: 'Kegon Falls', description: "97-meter waterfall fed by Lake Chuzenji. Elevator to the base observation platform (¥570).", cost: 570, category: 'attraction' },
      { time: '15:00', title: 'Shinkyo Sacred Bridge', description: 'The red lacquered bridge arching over the Daiya River. One of Japan\'s three great bridges.', cost: 300, category: 'attraction' },
      { time: '18:30', title: 'Return to Tokyo', description: 'Evening train back. Grab bento from the station kiosk.', cost: 800, category: 'food' },
    ],
  },
  {
    day: 6,
    date: 'Aug 9',
    city: 'Kamakura & Enoshima — Day Trip',
    coverImage: 'https://images.unsplash.com/photo-1662554471428-d036dfbc6c45?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'The Great Buddha of Kamakura seated in a temple courtyard',
    transport: 'JR Yokosuka Line → Kamakura (¥940)',
    activities: [
      { time: '08:30', title: 'Train to Kamakura', description: 'One hour south of Tokyo to the seaside former capital of the shogunate.', cost: 940, category: 'transport' },
      { time: '10:00', title: 'Kotoku-in Great Buddha', description: 'The 13-metre bronze Daibutsu has sat in the open air since a tsunami swept away its hall in 1498.', cost: 300, category: 'attraction' },
      { time: '11:30', title: 'Hase-dera temple', description: 'Hillside temple of the eleven-headed Kannon, with hydrangea paths and a sweeping view of Sagami Bay.', cost: 400, category: 'attraction' },
      { time: '13:00', title: 'Lunch — Komachi-dori', description: 'Shirasu-don (baby whitebait over rice), a Kamakura specialty, along the buzzing approach street.', cost: 1600, category: 'food' },
      { time: '15:00', title: 'Enoden line to Enoshima', description: 'The vintage tram rattles between houses and along the coast, framing the Pacific at every turn.', cost: 260, category: 'transport' },
      { time: '16:00', title: 'Enoshima Shrine & Sea Candle', description: 'Climb the island shrine to the lighthouse observation tower for a golden-hour panorama.', cost: 500, category: 'attraction' },
      { time: '18:30', title: 'Dinner — seaside grill', description: 'Charcoal-grilled sazae shellfish and cold beer with the sunset over the water.', cost: 3000, category: 'food' },
    ],
  },
  {
    day: 7,
    date: 'Aug 10',
    city: 'Hakone — Mt Fuji & Open-Air Art',
    coverImage: 'https://images.unsplash.com/photo-1749352133990-67bf2a652149?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'Lake Ashi torii gate with Mount Fuji rising behind',
    transport: 'Hakone Free Pass + Romancecar (¥6,100)',
    activities: [
      { time: '08:00', title: 'Romancecar to Hakone-Yumoto', description: 'Reserved limited express with panoramic windows through the mountains of the Fuji-Hakone-Izu park.', cost: 6100, category: 'transport' },
      { time: '10:00', title: 'Hakone Open-Air Museum', description: 'Sculpture park set against the hills, with a dedicated Picasso pavilion and a stained-glass tower.', cost: 1600, category: 'attraction' },
      { time: '12:30', title: 'Lunch — handmade soba', description: 'Buckwheat noodles ground on-site, served cold with mountain wasabi near Gora.', cost: 1500, category: 'food' },
      { time: '14:00', title: 'Owakudani volcanic valley', description: 'Ride the ropeway over sulphur vents and eat a kuro-tamago black egg said to add seven years of life.', cost: 500, category: 'attraction' },
      { time: '15:30', title: 'Lake Ashi pirate cruise', description: 'Sail to the red Hakone Shrine torii standing in the water, with Fuji reflected on a clear day.', cost: 1200, category: 'transport' },
      { time: '18:00', title: 'Ryokan — kaiseki & onsen', description: 'Tatami suite with a private hot-spring bath and a multi-course dinner served in your room.', cost: 24000, category: 'accommodation' },
    ],
  },
  {
    day: 8,
    date: 'Aug 11',
    city: 'Kawaguchiko — Fuji Five Lakes',
    coverImage: 'https://images.unsplash.com/photo-1606918801925-e2c914c4b503?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'Mount Fuji mirrored in the calm water of Lake Kawaguchi',
    transport: 'Fujikyu bus Hakone → Kawaguchiko (¥2,300)',
    activities: [
      { time: '09:00', title: 'Bus to Kawaguchiko', description: 'Cross to the northern foot of Fuji, the base for the Five Lakes region.', cost: 2300, category: 'transport' },
      { time: '11:00', title: 'Chureito Pagoda viewpoint', description: 'Climb 400 steps to the five-storey pagoda framing Fuji — the postcard shot of Japan.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch — Fuji hoto noodles', description: 'Thick flat udon simmered with pumpkin and vegetables in miso broth, a Yamanashi mountain dish.', cost: 1500, category: 'food' },
      { time: '14:30', title: 'Oshino Hakkai springs', description: 'Eight crystal ponds fed by Fuji snowmelt in a preserved thatched-roof village.', cost: 0, category: 'attraction' },
      { time: '16:00', title: 'Mt Kachi Kachi Ropeway', description: 'Cable car to a ridge deck overlooking the lake and the full cone of Fuji.', cost: 900, category: 'attraction' },
      { time: '18:00', title: 'Lakeside ryokan stay', description: 'Onsen inn on the shore with a Fuji-facing bath — best at dawn before the clouds gather.', cost: 20000, category: 'accommodation' },
    ],
  },
  {
    day: 9,
    date: 'Aug 12',
    city: 'Matsumoto — Castle & Alps Gateway',
    coverImage: 'https://images.unsplash.com/photo-1714999667643-d811c009309e?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'Matsumoto Castle, a black keep reflected in its moat',
    transport: 'Fujikyu + JR to Matsumoto (¥4,500)',
    activities: [
      { time: '08:30', title: 'Train to Matsumoto', description: 'Climb into Nagano prefecture and the edge of the Northern Alps.', cost: 4500, category: 'transport' },
      { time: '12:00', title: 'Matsumoto Castle', description: 'The "Crow Castle" — an original 1594 black keep, one of only five designated national treasures.', cost: 700, category: 'attraction' },
      { time: '13:30', title: 'Lunch — Nawate-dori', description: 'The frog street along the river: soba, taiyaki, and craft snacks in a Taisho-era lane.', cost: 1300, category: 'food' },
      { time: '15:00', title: 'City Museum of Art — Kusama', description: 'Home town of Yayoi Kusama; polka-dotted everything, including an infinity mirror room.', cost: 410, category: 'attraction' },
      { time: '17:00', title: 'Nakamachi storehouse street', description: 'White-walled kura merchant houses now holding cafes, sake, and craft studios.', cost: 0, category: 'other' },
      { time: '19:00', title: 'Dinner — Shinshu soba', description: 'Nagano is Japan\'s soba heartland. Wild mountain vegetables and fresh wasabi on the side.', cost: 2200, category: 'food' },
    ],
  },
  {
    day: 10,
    date: 'Aug 13',
    city: 'Kamikochi — Alpine Valley',
    coverImage: 'https://images.unsplash.com/photo-1754390032135-00ecfaa00cc0?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'The Azusa River winding through the green Kamikochi valley',
    transport: 'Private bus Matsumoto → Kamikochi (¥2,570)',
    activities: [
      { time: '06:30', title: 'Early bus to Kamikochi', description: 'Private cars are banned; the shuttle winds up to 1,500m in the heart of the Northern Alps.', cost: 2570, category: 'transport' },
      { time: '09:00', title: 'Kappa-bashi bridge', description: 'The wooden suspension bridge over the milky Azusa River, with the Hotaka peaks behind.', cost: 0, category: 'attraction' },
      { time: '10:30', title: 'Hike to Myojin Pond', description: 'A flat 3km riverside trail to a sacred, glass-still pond beneath Mt Myojin.', cost: 500, category: 'attraction' },
      { time: '13:00', title: 'Lunch — riverside lodge', description: 'Mountain-vegetable set meal and iwana char grilled over charcoal.', cost: 1600, category: 'food' },
      { time: '15:00', title: 'Taisho Pond walk', description: 'Dead trees standing in a pale-blue pond formed by an 1915 eruption — utterly still and eerie.', cost: 0, category: 'attraction' },
      { time: '18:00', title: 'Return to Matsumoto', description: 'Descend by bus and check into a station-side hotel.', cost: 12000, category: 'accommodation' },
    ],
  },
  {
    day: 11,
    date: 'Aug 14',
    city: 'Takayama — Old Town & Markets',
    coverImage: 'https://images.unsplash.com/photo-1676917350107-964194678afa?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'A narrow street of dark wooden merchant houses in Takayama',
    transport: 'Ltd Express Hida (¥4,000)',
    activities: [
      { time: '07:30', title: 'Train to Takayama', description: 'The Hida line follows river gorges deep into the mountains of Gifu.', cost: 4000, category: 'transport' },
      { time: '10:00', title: 'Miyagawa morning market', description: 'Riverside stalls of pickles, sarubobo dolls, and fresh Hida produce — a 600-year tradition.', cost: 800, category: 'food' },
      { time: '11:00', title: 'Sanmachi old town', description: 'Preserved Edo merchant quarter of sake breweries hung with green cedar balls at brewing time.', cost: 500, category: 'attraction' },
      { time: '13:00', title: 'Lunch — Hida beef', description: 'Marbled local wagyu as sushi on rice crackers and grilled skewers along the lanes.', cost: 2500, category: 'food' },
      { time: '15:00', title: 'Takayama Jinya', description: 'The only surviving Edo-period provincial government house, with tatami halls and rice storehouses.', cost: 440, category: 'attraction' },
      { time: '17:00', title: 'Higashiyama walking course', description: 'A temple trail along the eastern hills linking a dozen shrines and a ruined castle park.', cost: 0, category: 'attraction' },
      { time: '19:30', title: 'Dinner — hoba miso', description: 'Miso and vegetables grilled on a magnolia leaf over a tabletop flame, with Hida beef.', cost: 4500, category: 'food' },
    ],
  },
  {
    day: 12,
    date: 'Aug 15',
    city: 'Shirakawa-go — Gassho Villages',
    coverImage: 'https://images.unsplash.com/photo-1756285338914-fc6e567d96bc?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'Thatched gassho-zukuri farmhouses in a green mountain valley',
    transport: 'Nohi Bus Takayama → Shirakawa-go (¥2,600)',
    activities: [
      { time: '08:30', title: 'Bus to Shirakawa-go', description: 'Cross the mountains to the UNESCO valley of steep-thatched farmhouses.', cost: 2600, category: 'transport' },
      { time: '10:00', title: 'Shiroyama viewpoint', description: 'The classic panorama over Ogimachi\'s gassho-zukuri roofs and rice paddies.', cost: 0, category: 'attraction' },
      { time: '11:00', title: 'Wada House farmhouse', description: 'Step inside a 300-year-old silk-farming home with its soaring beamed attic.', cost: 400, category: 'attraction' },
      { time: '12:30', title: 'Lunch — grilled ayu & soba', description: 'Salt-grilled sweetfish on a skewer and cold buckwheat noodles by the paddies.', cost: 1500, category: 'food' },
      { time: '14:00', title: 'Ogimachi village wander', description: 'Cross the suspension bridge and walk the lanes between working farms and water channels.', cost: 0, category: 'attraction' },
      { time: '16:00', title: 'Bus to Kanazawa', description: 'Descend from the mountains to the Sea of Japan coast.', cost: 1850, category: 'transport' },
      { time: '19:00', title: 'Kanazawa hotel & dinner', description: 'Check in near the station and settle in with a light local meal.', cost: 15000, category: 'accommodation' },
    ],
  },
  {
    day: 13,
    date: 'Aug 16',
    city: 'Kanazawa — Kenroku-en & Chaya',
    coverImage: 'https://images.unsplash.com/photo-1637846931849-d1748990481b?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'Stone lanterns and pines in the landscaped Kenroku-en garden',
    transport: 'Kanazawa Loop Bus (¥600)',
    activities: [
      { time: '08:00', title: 'Omicho Market breakfast', description: 'A 300-year-old market; build a kaisen-don bowl of snow crab, sweet shrimp, and sea urchin.', cost: 2500, category: 'food' },
      { time: '09:30', title: 'Kenroku-en Garden', description: 'One of Japan\'s three great gardens — winding streams, the oldest fountain, and the two-legged lantern.', cost: 320, category: 'attraction' },
      { time: '11:00', title: 'Kanazawa Castle Park', description: 'Reconstructed turrets and the elegant Gyokusen-inmaru garden beside Kenroku-en.', cost: 0, category: 'attraction' },
      { time: '12:30', title: '21st Century Museum of Art', description: 'A circular glass museum with Leandro Erlich\'s famous walk-in "Swimming Pool".', cost: 1200, category: 'attraction' },
      { time: '14:30', title: 'Higashi Chaya district', description: 'Wooden teahouse streets where geisha still perform; try gold-leaf ice cream (Kanazawa makes 99% of Japan\'s).', cost: 1000, category: 'other' },
      { time: '16:00', title: 'Nagamachi samurai district', description: 'Earthen-walled lanes of former samurai residences, one open with its garden intact.', cost: 550, category: 'attraction' },
      { time: '19:00', title: 'Dinner — Kaga cuisine', description: 'Jibuni duck stew and the region\'s refined seafood, plated on Kutani porcelain.', cost: 4000, category: 'food' },
    ],
  },
  {
    day: 14,
    date: 'Aug 17',
    city: 'Tateyama–Kurobe Alpine Route',
    coverImage: 'https://images.unsplash.com/photo-1586012007759-e302826262e9?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'A high alpine plateau of grass and snow-streaked peaks',
    transport: 'Alpine Route through-ticket (¥9,800)',
    activities: [
      { time: '07:00', title: 'Train to Tateyama', description: 'The Toyama Chitetsu line runs to the western gateway of the alpine crossing.', cost: 3000, category: 'transport' },
      { time: '09:00', title: 'Cablecar & bus to Murodo', description: 'A chain of cablecars, ropeways, and a tunnel bus climbs to 2,450m — Japan\'s highest station.', cost: 9800, category: 'transport' },
      { time: '11:00', title: 'Mikurigaike Pond walk', description: 'A caldera lake mirroring the Tateyama peaks; alpine flowers and possibly a ptarmigan.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch at Murodo', description: 'Toyama white-shrimp rice and hot soba at the mountaintop terminal.', cost: 1800, category: 'food' },
      { time: '15:00', title: 'Kurobe Dam', description: 'Japan\'s tallest dam, 186m, with a thundering summer water release you feel in your chest.', cost: 0, category: 'attraction' },
      { time: '18:00', title: 'Descend to Nagano', description: 'Exit the eastern side and overnight before the run to Kyoto.', cost: 13000, category: 'accommodation' },
    ],
  },
  {
    day: 15,
    date: 'Aug 18',
    city: 'Kyoto — Arrival & Gion',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'Fushimi Inari torii gates path in Kyoto',
    transport: 'Shinkansen Nagano → Kyoto via Nagoya (¥13,000)',
    activities: [
      { time: '08:00', title: 'Shinkansen to Kyoto', description: 'Down from the Alps to Nagoya, then west on the Tokaido line to the old capital.', cost: 13000, category: 'transport' },
      { time: '12:00', title: 'Check in — Kyomachiya Gion', description: 'A restored 100-year-old townhouse with tatami rooms, a bamboo garden, and a stone bath.', cost: 22000, category: 'accommodation' },
      { time: '13:30', title: 'Fushimi Inari-taisha', description: '10,000 vermillion torii gates winding 4km up Mount Inari. Start by 2pm to avoid peak heat.', cost: 0, category: 'attraction' },
      { time: '17:00', title: 'Gion district walk', description: "Hanamikoji Street at dusk. Spot maiko (apprentice geisha) heading to engagements in the evening.", cost: 0, category: 'attraction' },
      { time: '19:30', title: 'Dinner — Kikunoi Roan', description: "Kaiseki dinner: 8-course seasonal tasting menu. Reserve well in advance. Japan's quiet haute cuisine.", cost: 12000, category: 'food' },
    ],
  },
  {
    day: 16,
    date: 'Aug 19',
    city: 'Kyoto — Higashiyama & Kiyomizu',
    coverImage: 'https://images.unsplash.com/photo-1751607202684-b916c57c3411?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'A visitor before a wooden Kyoto temple among green trees',
    transport: 'Kyoto City Bus Day Pass (¥700)',
    activities: [
      { time: '07:00', title: 'Kiyomizu-dera at opening', description: 'The great wooden stage juts over the hillside; arrive early for the quiet and the valley haze.', cost: 500, category: 'attraction' },
      { time: '08:30', title: 'Sannen-zaka slopes', description: 'Stone-paved lanes of tea houses and craft shops descending from the temple — Kyoto at its most timeless.', cost: 800, category: 'other' },
      { time: '10:00', title: 'Kodai-ji temple', description: 'Zen gardens, a lantern-lit bamboo grove, and lacquer halls founded by a warlord\'s widow.', cost: 600, category: 'attraction' },
      { time: '11:30', title: 'Yasaka Shrine & Maruyama', description: 'The vermillion shrine at the foot of Gion opening onto Kyoto\'s favourite strolling park.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch — obanzai', description: 'Kyoto home-style small plates: seasonal vegetables, tofu, and pickles in a machiya cafe.', cost: 2200, category: 'food' },
      { time: '15:00', title: 'Ginkaku-ji Silver Pavilion', description: 'The Zen retreat of a shogun, famed for its raked sand cone and moss gardens.', cost: 500, category: 'attraction' },
      { time: '16:30', title: "Philosopher's Path", description: 'A canal-side walk under the trees linking Ginkaku-ji to Nanzen-ji, named for a professor\'s daily stroll.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 17,
    date: 'Aug 20',
    city: 'Kyoto — Arashiyama & Nishiki',
    coverImage: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'Arashiyama bamboo grove path in morning light',
    transport: 'Kyoto City Bus Day Pass (¥700)',
    activities: [
      { time: '06:30', title: 'Arashiyama Bamboo Grove', description: 'The iconic bamboo corridor is magical before 8am. Bring a light jacket — the grove stays cool.', cost: 0, category: 'attraction' },
      { time: '08:00', title: 'Tenryu-ji temple gardens', description: 'UNESCO garden designed in 1345. The borrowed landscape uses the Arashiyama mountains as backdrop.', cost: 500, category: 'attraction' },
      { time: '10:00', title: 'Monkey Park Iwatayama', description: '120+ wild Japanese macaques on the mountain. Views of Kyoto below from the summit.', cost: 550, category: 'attraction' },
      { time: '13:00', title: 'Nishiki Market', description: '"Kyoto\'s Kitchen" — 400-year-old covered market. Sample pickled plum, grilled skewers, fresh tofu, mochi.', cost: 1500, category: 'food' },
      { time: '15:30', title: 'Nijo Castle', description: 'Shogun\'s Kyoto residence with "nightingale" floors that chirp to warn of intruders.', cost: 1300, category: 'attraction' },
      { time: '19:00', title: 'Dinner — Pontocho Alley', description: 'Narrow lantern-lit alley along the Kamogawa River. Pick any izakaya with river-platform seating.', cost: 3500, category: 'food' },
    ],
  },
  {
    day: 18,
    date: 'Aug 21',
    city: 'Kyoto — Golden Pavilion & Zen',
    coverImage: 'https://images.unsplash.com/photo-1552748014-ca24da8e243f?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'A Japanese castle keep surrounded by a still moat',
    transport: 'Kyoto City Bus Day Pass (¥700)',
    activities: [
      { time: '08:30', title: 'Kinkaku-ji Golden Pavilion', description: 'The gold-leaf temple mirrored in Kyoko-chi pond. Arrive at opening before the crowds and the heat.', cost: 500, category: 'attraction' },
      { time: '10:00', title: 'Ryoan-ji rock garden', description: 'Fifteen stones in raked gravel — Japan\'s most famous Zen garden, never fully seen at once.', cost: 600, category: 'attraction' },
      { time: '11:30', title: 'Ninna-ji temple', description: 'A former imperial monastery with a five-storey pagoda and palatial garden halls.', cost: 500, category: 'attraction' },
      { time: '13:00', title: 'Lunch — yudofu', description: 'Simmering tofu hot pot, the Buddhist temple cuisine of the western hills.', cost: 3000, category: 'food' },
      { time: '15:00', title: 'Daitoku-ji sub-temples', description: 'A walled complex of intimate Zen gardens; a few open their moss and gravel courtyards to visitors.', cost: 1000, category: 'attraction' },
      { time: '17:00', title: 'Kamogawa river stroll', description: 'Join Kyoto locals cooling their feet along the stepping-stones at golden hour.', cost: 0, category: 'other' },
      { time: '19:00', title: 'Dinner — kappo counter', description: 'Seasonal chef\'s-choice cooking at a lively counter, one course at a time.', cost: 6000, category: 'food' },
    ],
  },
  {
    day: 19,
    date: 'Aug 22',
    city: 'Nara — Deer Park & Todai-ji',
    coverImage: 'https://images.unsplash.com/photo-1723569199334-c702187819e0?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'Sika deer grazing on a green lawn in Nara Park',
    transport: 'Kintetsu Ltd Express Kyoto → Nara (¥760)',
    activities: [
      { time: '08:30', title: 'Train to Nara', description: 'Forty-five minutes to Japan\'s 8th-century first permanent capital.', cost: 760, category: 'transport' },
      { time: '10:00', title: 'Todai-ji Great Buddha', description: 'The world\'s largest bronze Buddha in the largest wooden hall — a 15-metre seated Vairocana.', cost: 800, category: 'attraction' },
      { time: '11:30', title: 'Nara Park deer', description: '1,200 free-roaming sacred deer that bow for shika-senbei crackers sold across the park.', cost: 200, category: 'attraction' },
      { time: '13:00', title: 'Lunch — kakinoha-zushi', description: 'Pressed mackerel sushi wrapped in fragrant persimmon leaves, a landlocked Nara tradition.', cost: 1600, category: 'food' },
      { time: '14:30', title: 'Kasuga Taisha shrine', description: 'A vermillion shrine in the forest lined with 3,000 bronze and stone lanterns.', cost: 500, category: 'attraction' },
      { time: '16:00', title: 'Isuien Garden', description: 'A strolling garden borrowing the temple gates and Mt Wakakusa into its composition.', cost: 900, category: 'attraction' },
      { time: '18:00', title: 'Return to Kyoto & dinner', description: 'Back to the city for a relaxed evening meal near the station.', cost: 2500, category: 'food' },
    ],
  },
  {
    day: 20,
    date: 'Aug 23',
    city: 'Koyasan — Temple Stay',
    coverImage: 'https://images.unsplash.com/photo-1669876104285-1f96e48fa343?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'Moss-covered stone statues among cedars at Koyasan',
    transport: 'Nankai train + cablecar (¥3,500)',
    activities: [
      { time: '08:00', title: 'Journey to Koyasan', description: 'Through Osaka, then a steep cablecar up to the 1,200-year-old mountain monastery of Shingon Buddhism.', cost: 3500, category: 'transport' },
      { time: '12:00', title: 'Kongobu-ji head temple', description: 'The sect\'s headquarters, with Japan\'s largest rock garden and gold-leaf screen rooms.', cost: 1000, category: 'attraction' },
      { time: '13:30', title: 'Lunch — shojin-ryori', description: 'Buddhist vegetarian cuisine: sesame tofu, mountain vegetables, and pickles, no meat or onion.', cost: 2000, category: 'food' },
      { time: '15:00', title: 'Danjo Garan complex', description: 'The sacred core of the mountain, dominated by the vermillion Konpon Daito pagoda.', cost: 500, category: 'attraction' },
      { time: '17:00', title: 'Check in — Eko-in shukubo', description: 'Sleep in a working temple: tatami room, futon, and the option to join morning prayers.', cost: 18000, category: 'accommodation' },
      { time: '19:30', title: 'Okunoin night tour', description: 'A monk leads a lantern walk through the vast forest cemetery to Kobo Daishi\'s mausoleum.', cost: 2500, category: 'attraction' },
    ],
  },
  {
    day: 21,
    date: 'Aug 24',
    city: 'Osaka — Castle & Dotonbori',
    coverImage: 'https://images.unsplash.com/photo-1589452271712-64b8a66c7b71?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'Dotonbori canal in Osaka at night with glowing signs',
    transport: 'Nankai → Namba, Osaka (¥1,650)',
    activities: [
      { time: '08:30', title: 'Descend to Osaka', description: 'Down the mountain and into Japan\'s brash, food-obsessed second city.', cost: 1650, category: 'transport' },
      { time: '10:30', title: 'Osaka Castle', description: "Toyotomi Hideyoshi's golden castle, its museum tracing his unification of Japan.", cost: 600, category: 'attraction' },
      { time: '12:30', title: 'Lunch — Shinsekai kushikatsu', description: 'Deep-fried skewers in the retro district under Tsutenkaku tower — no double-dipping the sauce.', cost: 2000, category: 'food' },
      { time: '14:30', title: 'Umeda Sky Building', description: 'Two towers joined by a floating rooftop garden observatory with a 360° city view.', cost: 1500, category: 'attraction' },
      { time: '16:30', title: 'Shinsaibashi arcade', description: "Japan's most famous covered shopping street, from Uniqlo flagships to vintage Americana.", cost: 0, category: 'other' },
      { time: '19:00', title: 'Dotonbori street-food crawl', description: 'Takoyaki, okonomiyaki, and grilled crab beneath the Glico running man and glowing signs.', cost: 3500, category: 'food' },
    ],
  },
  {
    day: 22,
    date: 'Aug 25',
    city: 'Himeji & Kobe — Castle & Beef',
    coverImage: 'https://images.unsplash.com/photo-1491884662610-dfcd28f30cfb?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'The white keep of Himeji Castle against a blue sky',
    transport: 'Shinkansen Osaka → Himeji (¥3,280, JR Pass)',
    activities: [
      { time: '08:00', title: 'Shinkansen to Himeji', description: 'Thirty minutes west to Japan\'s finest surviving feudal castle.', cost: 3280, category: 'transport' },
      { time: '09:30', title: 'Himeji Castle', description: 'The "White Heron" — an original hilltop keep of gleaming white plaster, a UNESCO treasure.', cost: 1000, category: 'attraction' },
      { time: '11:00', title: 'Koko-en Garden', description: 'Nine walled Edo-style gardens beside the castle, with a carp-filled stream and tea house.', cost: 310, category: 'attraction' },
      { time: '12:30', title: 'Train to Kobe', description: 'Back east to the elegant port city on the bay.', cost: 950, category: 'transport' },
      { time: '13:30', title: 'Lunch — Kobe beef teppanyaki', description: 'Legendary marbled wagyu seared at the counter before you, at its birthplace.', cost: 8000, category: 'food' },
      { time: '15:30', title: 'Kitano Ijinkan', description: 'A hillside of Western merchant houses from Kobe\'s days as a treaty port.', cost: 700, category: 'attraction' },
      { time: '17:00', title: 'Nunobiki Herb Garden', description: 'A ropeway to terraced gardens overlooking the harbour, best as the city lights come on.', cost: 1800, category: 'attraction' },
      { time: '19:30', title: 'Kobe harbour hotel', description: 'Overnight at Harborland with the illuminated port tower on the water.', cost: 14000, category: 'accommodation' },
    ],
  },
  {
    day: 23,
    date: 'Aug 26',
    city: 'Okayama & Naoshima — Art Island',
    coverImage: 'https://images.unsplash.com/photo-1728013934217-a0a941ccc0ad?w=1200&h=500&fit=crop&auto=format',
    coverAlt: "Yayoi Kusama's yellow pumpkin sculpture on a Naoshima pier",
    transport: 'Shinkansen + ferry (¥5,000)',
    activities: [
      { time: '07:00', title: 'Shinkansen to Okayama', description: 'West along the Inland Sea to the gateway of the art islands.', cost: 3000, category: 'transport' },
      { time: '08:30', title: 'Korakuen & Okayama Castle', description: 'One of Japan\'s three great gardens beside a black "Crow Castle" on the river.', cost: 900, category: 'attraction' },
      { time: '10:00', title: 'Train + ferry to Naoshima', description: 'Cross to the island Tadao Ando and Benesse turned into a living art project.', cost: 2000, category: 'transport' },
      { time: '12:00', title: 'Benesse House & pumpkin', description: 'Seaside museum-hotel and Yayoi Kusama\'s yellow polka-dot pumpkin on the pier.', cost: 1300, category: 'attraction' },
      { time: '14:00', title: 'Chichu Art Museum', description: 'Ando\'s buried concrete galleries holding Monet water lilies and James Turrell light rooms.', cost: 2100, category: 'attraction' },
      { time: '16:00', title: 'Art House Project', description: 'Old village houses in Honmura reworked into immersive installations.', cost: 1050, category: 'attraction' },
      { time: '18:30', title: 'Ferry back & Okayama dinner', description: 'Return to the mainland and overnight with a local demi-katsu meal.', cost: 2500, category: 'food' },
    ],
  },
  {
    day: 24,
    date: 'Aug 27',
    city: 'Hiroshima — Peace Memorial',
    coverImage: 'https://images.unsplash.com/photo-1648609854487-99ac03dc0d37?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'The skeletal dome of the Hiroshima Peace Memorial',
    transport: 'Shinkansen Okayama → Hiroshima (¥5,610, JR Pass)',
    activities: [
      { time: '08:00', title: 'Shinkansen to Hiroshima', description: 'Forty minutes west to the city rebuilt after 1945.', cost: 5610, category: 'transport' },
      { time: '09:30', title: 'Peace Memorial Park', description: 'The preserved A-Bomb Dome, the cenotaph, and the eternal flame along the river.', cost: 0, category: 'attraction' },
      { time: '10:30', title: 'Peace Memorial Museum', description: 'An unflinching, essential record of the bombing and a plea for a world without nuclear weapons.', cost: 200, category: 'attraction' },
      { time: '13:00', title: 'Lunch — okonomiyaki', description: 'Hiroshima-style: layered with noodles and cabbage, griddled before you at Okonomi-mura.', cost: 1200, category: 'food' },
      { time: '14:30', title: 'Hiroshima Castle', description: 'A faithfully rebuilt keep and museum of the castle-town\'s history.', cost: 370, category: 'attraction' },
      { time: '16:00', title: 'Shukkeien Garden', description: 'A miniature "shrunken scenery" garden of ponds, islets, and arched bridges.', cost: 260, category: 'attraction' },
      { time: '19:00', title: 'Dinner — oysters', description: 'Hiroshima grows most of Japan\'s oysters; grilled, fried, and raw with lemon sour.', cost: 3500, category: 'food' },
    ],
  },
  {
    day: 25,
    date: 'Aug 28',
    city: 'Miyajima — Floating Torii',
    coverImage: 'https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'The red Itsukushima torii gate standing in the sea',
    transport: 'JR + ferry to Miyajima (¥360)',
    activities: [
      { time: '08:00', title: 'Ferry to Miyajima', description: 'A short crossing to the sacred island of Itsukushima in the Inland Sea.', cost: 360, category: 'transport' },
      { time: '09:00', title: 'Itsukushima Shrine', description: 'The vermillion shrine on stilts and its great torii that floats at high tide.', cost: 300, category: 'attraction' },
      { time: '10:30', title: 'Mount Misen ropeway', description: 'Cable car then a summit hike among ancient boulders and wild deer, with Inland Sea views.', cost: 2000, category: 'attraction' },
      { time: '13:00', title: 'Lunch — anago-meshi', description: 'Grilled saltwater eel over rice, the island specialty.', cost: 2200, category: 'food' },
      { time: '14:30', title: 'Daisho-in temple', description: 'A hillside Shingon temple of spinning prayer wheels and hundreds of small stone statues.', cost: 0, category: 'attraction' },
      { time: '16:00', title: 'Momiji manju street snacks', description: 'Maple-leaf cakes filled with red bean, custard, and cheese, fried fresh off the griddle.', cost: 800, category: 'food' },
      { time: '19:00', title: 'Return to Hiroshima', description: 'Back to the city for a final Honshu night.', cost: 13000, category: 'accommodation' },
    ],
  },
  {
    day: 26,
    date: 'Aug 29',
    city: 'Sapporo — Fly North to Hokkaido',
    coverImage: 'https://images.unsplash.com/photo-1601702598611-174d5f7c68ac?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'The red-brick former Hokkaido government building in Sapporo',
    transport: 'Flight Hiroshima → Sapporo (¥28,000)',
    activities: [
      { time: '08:00', title: 'Flight to Hokkaido', description: 'Fly the length of Japan to New Chitose, then the rapid train into Sapporo.', cost: 28000, category: 'transport' },
      { time: '12:00', title: 'Hotel check-in', description: 'Drop bags at a central hotel near Odori Park.', cost: 15000, category: 'accommodation' },
      { time: '13:00', title: 'Lunch — miso ramen', description: 'Sapporo invented miso ramen; slurp a rich, buttery bowl in Ramen Alley.', cost: 1200, category: 'food' },
      { time: '14:30', title: 'Odori Park & TV Tower', description: 'The green spine of the city, with a retro tower observation deck.', cost: 1000, category: 'attraction' },
      { time: '16:00', title: 'Former Government Building', description: 'The red-brick "Akarenga", a American-influenced relic of Hokkaido\'s frontier era.', cost: 0, category: 'attraction' },
      { time: '18:00', title: 'Sapporo Beer Museum', description: 'Japan\'s oldest beer brand; a tasting flight in the historic brick brewery.', cost: 2500, category: 'food' },
      { time: '20:00', title: 'Susukino izakaya', description: 'The north\'s biggest nightlife district — crab, scallops, and cold sake.', cost: 4000, category: 'food' },
    ],
  },
  {
    day: 27,
    date: 'Aug 30',
    city: 'Otaru & Yoichi — Canal & Whisky',
    coverImage: 'https://images.unsplash.com/photo-1598176314960-249219ed5409?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'Stone warehouses lining the historic Otaru canal',
    transport: 'JR Hakodate Line → Otaru (¥750)',
    activities: [
      { time: '08:30', title: 'Train to Otaru', description: 'A coastal ride to the romantic former herring port.', cost: 750, category: 'transport' },
      { time: '09:30', title: 'Otaru Canal', description: 'Gas lamps and stone warehouses along the water, prettiest reflected in the morning light.', cost: 0, category: 'attraction' },
      { time: '10:30', title: 'Sakaimachi street', description: 'Glassblowing studios, the steam-clock, and a hall of hundreds of music boxes.', cost: 1500, category: 'other' },
      { time: '12:00', title: 'Lunch — Otaru sushi row', description: 'Some of Japan\'s freshest sushi, straight off the northern boats.', cost: 4500, category: 'food' },
      { time: '14:00', title: 'Nikka Yoichi distillery', description: 'The seaside home of Japanese whisky, with coal-fired pot stills and a tasting bar.', cost: 2000, category: 'food' },
      { time: '16:30', title: 'LeTAO & the harbour', description: 'Melt-in-the-mouth double-cheesecake and a last look at the port.', cost: 800, category: 'food' },
      { time: '19:00', title: 'Dinner — Genghis Khan', description: 'Back in Sapporo for jingisukan: grilled lamb on a domed cast-iron skillet.', cost: 3500, category: 'food' },
    ],
  },
  {
    day: 28,
    date: 'Aug 31',
    city: 'Furano & Biei — Flower Fields',
    coverImage: 'https://images.unsplash.com/photo-1762886457606-ece40185cdf0?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'Rows of vivid flowers running toward gentle hills',
    transport: 'JR + sightseeing bus (¥4,500)',
    activities: [
      { time: '06:30', title: 'Train to Furano', description: 'Into the rolling farm country at the centre of Hokkaido.', cost: 4500, category: 'transport' },
      { time: '10:00', title: 'Farm Tomita lavender', description: 'Hillsides striped purple with lavender in full late-summer bloom.', cost: 0, category: 'attraction' },
      { time: '11:30', title: 'Lavender soft serve & melon', description: 'Floral ice cream and a wedge of famous Hokkaido melon at the farm.', cost: 900, category: 'food' },
      { time: '13:00', title: 'Biei Panorama Road', description: 'Cycle the patchwork hills of the "patchwork" and "panorama" roads between lone trees.', cost: 1500, category: 'attraction' },
      { time: '14:30', title: 'Blue Pond (Aoiike)', description: 'A pond of surreal cobalt blue from mineral runoff, dead larches standing in the water.', cost: 0, category: 'attraction' },
      { time: '16:00', title: 'Shikisai-no-oka hills', description: 'Ribbon-striped flower fields across a broad hillside, viewable by tractor-bus.', cost: 500, category: 'attraction' },
      { time: '19:00', title: 'Return to Sapporo', description: 'Back to the city for the final northern night.', cost: 15000, category: 'accommodation' },
    ],
  },
  {
    day: 29,
    date: 'Sep 1',
    city: 'Sapporo — Markets & Mt Moiwa',
    coverImage: 'https://images.unsplash.com/photo-1741225235666-5fd931fd40e1?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'A lively Sapporo street lined with buildings',
    transport: 'Sapporo subway & ropeway (¥2,100)',
    activities: [
      { time: '08:00', title: 'Nijo Market breakfast', description: 'Build a kaisendon of sea urchin and salmon roe at the century-old downtown fish market.', cost: 3500, category: 'food' },
      { time: '10:00', title: 'Shiroi Koibito Park', description: 'A whimsical European-style chocolate factory behind Hokkaido\'s famous cookie.', cost: 800, category: 'attraction' },
      { time: '12:30', title: 'Lunch — soup curry', description: 'Sapporo\'s own invention: a fragrant spiced broth with a whole roast chicken leg and vegetables.', cost: 1300, category: 'food' },
      { time: '14:00', title: 'Maruyama & Hokkaido Shrine', description: 'A shrine in a forested park, guardian of the island\'s frontier settlers.', cost: 0, category: 'attraction' },
      { time: '16:00', title: 'Mount Moiwa sunset', description: 'A ropeway and cable car to a ridge for one of Japan\'s three great night views as the sun sets.', cost: 2100, category: 'attraction' },
      { time: '19:00', title: 'Farewell northern dinner', description: 'A last spread of Hokkaido crab, scallops, and sake.', cost: 5000, category: 'food' },
    ],
  },
  {
    day: 30,
    date: 'Sep 2',
    city: 'Tokyo — Final Day & Departure',
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=500&fit=crop&auto=format',
    coverAlt: 'Tokyo skyline glowing at dusk',
    transport: 'Flight Sapporo → Tokyo Haneda (¥18,000)',
    activities: [
      { time: '07:30', title: 'Flight to Tokyo', description: 'South from Hokkaido to Haneda for the last day of the journey.', cost: 18000, category: 'transport' },
      { time: '10:00', title: 'Tokyo Station & souvenirs', description: 'Store bags and browse Character Street for last-minute Ghibli, Pokémon, and stationery finds.', cost: 2000, category: 'other' },
      { time: '11:00', title: 'Imperial Palace East Gardens', description: 'The former Edo Castle grounds — stone ramparts and manicured lawns in the city\'s heart.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Last lunch — Ramen Street', description: 'A final bowl at Tokyo Station\'s underground alley of famous ramen shops.', cost: 1400, category: 'food' },
      { time: '15:00', title: 'Ginza final shopping', description: 'One last sweep of the department-store food halls and Don Quijote for gifts to carry home.', cost: 5000, category: 'other' },
      { time: '18:00', title: 'Haneda departure', description: 'To the airport for the flight home. Sayonara, Japan — one time, one meeting.', cost: 3000, category: 'transport' },
    ],
  },
]

const CATEGORY_COLORS: Record<Activity['category'], string> = {
  transport: '#2563eb',
  food: '#d97706',
  attraction: '#16a34a',
  accommodation: '#7c3aed',
  other: '#64748b',
}

const CATEGORY_LABELS: Record<Activity['category'], string> = {
  transport: 'Transport',
  food: 'Food',
  attraction: 'Sights',
  accommodation: 'Stay',
  other: 'Other',
}

interface Highlight {
  title: string
  blurb: string
  image: string
  alt: string
  tag: string
}

interface Country {
  id: string
  name: string
  nameLocal: string
  flag: string
  tagline: string
  intro: string
  accent: string
  currencySymbol: string
  currencyCode: string
  fxPerUsd: number
  motto: string
  film: string[]
  highlights: Highlight[]
  itinerary: Day[]
}

const img = (id: string, w = 1600, h = 900) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`

// ─── Vietnam ───────────────────────────────────────────────────────────

const VIETNAM_ITINERARY: Day[] = [
  {
    day: 1,
    date: 'Oct 3',
    city: 'Hanoi — Arrival & Old Quarter',
    coverImage: img('1543355890-20bc0a26fda1', 1200, 500),
    coverAlt: 'Motorbikes streaming through the streets of the Hanoi Old Quarter',
    transport: 'Airport taxi → Old Quarter (₫250,000)',
    activities: [
      { time: '13:00', title: 'Arrive Noi Bai Airport', description: 'Land in the thousand-year-old capital and transfer into the tangle of the Old Quarter.', cost: 250000, category: 'transport' },
      { time: '15:00', title: 'Check in — boutique townhouse', description: 'A narrow "tube house" hotel on a lane named for the goods once sold there.', cost: 1200000, category: 'accommodation' },
      { time: '16:30', title: 'Hoan Kiem Lake & Ngoc Son', description: 'The legend of the returned sword, a red bridge, and a temple on an islet in the heart of town.', cost: 50000, category: 'attraction' },
      { time: '18:00', title: 'Bia hoi corner', description: 'Perch on a plastic stool for the world\'s cheapest fresh-brewed draft beer.', cost: 80000, category: 'food' },
      { time: '19:30', title: 'Dinner — bun cha', description: 'Grilled pork patties in a sweet-sour broth with herbs and nem spring rolls, Obama-style.', cost: 180000, category: 'food' },
    ],
  },
  {
    day: 2,
    date: 'Oct 4',
    city: 'Hanoi — Culture & Cuisine',
    coverImage: img('1764745021303-c3d97bedd2c6', 1200, 500),
    coverAlt: 'People eating at low tables outside a Hanoi street cafe',
    transport: 'Walking + Grab bikes (₫120,000)',
    activities: [
      { time: '08:00', title: 'Pho breakfast at a street stall', description: 'The national bowl at dawn — beef broth simmered overnight, ladled over rice noodles.', cost: 60000, category: 'food' },
      { time: '09:30', title: 'Ho Chi Minh Mausoleum', description: 'The solemn granite tomb of "Uncle Ho" and the stilt house and One Pillar Pagoda behind it.', cost: 0, category: 'attraction' },
      { time: '11:00', title: 'Temple of Literature', description: "Vietnam's first university, founded 1070, with courtyards of stelae on stone tortoises.", cost: 70000, category: 'attraction' },
      { time: '13:00', title: 'Egg coffee at Cafe Giang', description: 'The Hanoi invention: whipped egg yolk and condensed milk over strong coffee, like tiramisu.', cost: 40000, category: 'food' },
      { time: '15:00', title: 'Museum of Ethnology', description: 'Full-scale longhouses of Vietnam\'s 54 ethnic groups in the garden.', cost: 60000, category: 'attraction' },
      { time: '20:00', title: 'Water puppet theatre', description: 'A 1,000-year-old art form performed on a pool, with live traditional music.', cost: 200000, category: 'attraction' },
    ],
  },
  {
    day: 3,
    date: 'Oct 5',
    city: 'Ha Long Bay — Overnight Cruise',
    coverImage: img('1593994602837-530142086918', 1200, 500),
    coverAlt: 'Boats sailing among the limestone islands of Ha Long Bay',
    transport: 'Limousine van Hanoi → Ha Long (₫450,000)',
    activities: [
      { time: '08:00', title: 'Transfer to Lan Ha Bay', description: 'Ride out to the quieter southern reaches of the great karst seascape.', cost: 450000, category: 'transport' },
      { time: '12:30', title: 'Board a traditional junk', description: 'All-inclusive overnight cruise: cabin with a balcony over jade water, meals, and activities.', cost: 3200000, category: 'accommodation' },
      { time: '14:00', title: 'Kayak the hidden lagoons', description: 'Paddle through low sea-caves into lagoons ringed by sheer limestone.', cost: 0, category: 'attraction' },
      { time: '16:00', title: 'Ti Top Island viewpoint', description: 'Climb 400 steps for the classic panorama of islands scattered to the horizon.', cost: 50000, category: 'attraction' },
      { time: '18:00', title: 'Sunset cooking class', description: 'Roll fresh spring rolls on the sundeck as the light goes gold.', cost: 0, category: 'food' },
      { time: '20:00', title: 'Squid fishing off the deck', description: 'Drop a line under the boat lights into the still night bay.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 4,
    date: 'Oct 6',
    city: 'Ninh Binh — Trang An & Tam Coc',
    coverImage: img('1656692197297-cb1340b4d538', 1200, 500),
    coverAlt: 'A rowboat gliding past karst cliffs on the Trang An river',
    transport: 'Cruise → Ninh Binh transfer (₫600,000)',
    activities: [
      { time: '09:00', title: 'Disembark & drive inland', description: 'Head to the "Ha Long Bay on land" — karst towers rising from rice paddies.', cost: 600000, category: 'transport' },
      { time: '11:00', title: 'Trang An sampan caves', description: 'A rower poles you through flooded limestone tunnels and past riverside temples.', cost: 250000, category: 'attraction' },
      { time: '13:00', title: 'Lunch — goat & crispy rice', description: 'Ninh Binh\'s specialty: mountain goat with com chay, golden fried rice crust.', cost: 200000, category: 'food' },
      { time: '15:00', title: 'Hang Mua viewpoint', description: 'Climb 500 stone steps to a dragon ridge above the whole valley.', cost: 100000, category: 'attraction' },
      { time: '17:00', title: 'Bai Dinh Pagoda', description: 'The largest temple complex in Vietnam, lined with 500 arhat statues.', cost: 0, category: 'attraction' },
      { time: '19:00', title: 'Eco-homestay dinner', description: 'A bungalow among the paddies with a home-cooked family meal.', cost: 700000, category: 'accommodation' },
    ],
  },
  {
    day: 5,
    date: 'Oct 7',
    city: 'Sapa — Rice Terraces & Hill Tribes',
    coverImage: img('1609412058473-c199497c3c5d', 1200, 500),
    coverAlt: 'Terraced green rice fields cascading down a Sapa hillside',
    transport: 'Overnight sleeper → Lao Cai + van (₫900,000)',
    activities: [
      { time: '06:00', title: 'Arrive in the highlands', description: 'Wake in the cool mountains near the Chinese border, cloud in the valleys.', cost: 900000, category: 'transport' },
      { time: '09:00', title: 'Trek to Cat Cat village', description: 'Descend past waterfalls to a Black Hmong village of indigo weavers.', cost: 150000, category: 'attraction' },
      { time: '12:00', title: 'Lunch with a Hmong family', description: 'A home meal of foraged greens, smoked pork, and rice wine.', cost: 150000, category: 'food' },
      { time: '14:00', title: 'Muong Hoa valley trek', description: 'Walk the ridgeline paths between the most photographed terraces in Vietnam.', cost: 100000, category: 'attraction' },
      { time: '17:00', title: 'Fansipan cable car', description: 'Ride to the 3,143m "Roof of Indochina" summit and its cloud-wreathed shrines.', cost: 800000, category: 'attraction' },
      { time: '19:30', title: 'Sapa hotel & hot pot', description: 'A steaming lau dinner to warm up from the mountain chill.', cost: 1000000, category: 'accommodation' },
    ],
  },
  {
    day: 6,
    date: 'Oct 8',
    city: 'Hue — Imperial Citadel',
    coverImage: img('1616486410185-81af2d32a2af', 1200, 500),
    coverAlt: 'A pale imperial building beside the river in Hue',
    transport: 'Flight Hanoi → Hue (Phu Bai) (₫1,600,000)',
    activities: [
      { time: '08:00', title: 'Fly south to Hue', description: 'To the former seat of the Nguyen emperors on the Perfume River.', cost: 1600000, category: 'transport' },
      { time: '11:00', title: 'Imperial Citadel', description: 'Walled palaces and the Forbidden Purple City, modelled on Beijing.', cost: 200000, category: 'attraction' },
      { time: '13:00', title: 'Lunch — bun bo Hue', description: 'The fiery lemongrass beef noodle soup born in this royal city.', cost: 90000, category: 'food' },
      { time: '15:00', title: 'Perfume River dragon boat', description: 'Sail upstream past pagodas on a hand-painted dragon boat.', cost: 150000, category: 'transport' },
      { time: '16:00', title: 'Thien Mu Pagoda', description: 'The seven-tiered icon of Hue on a bluff over the river.', cost: 0, category: 'attraction' },
      { time: '18:00', title: 'Tu Duc Royal Tomb', description: 'A poet-emperor\'s garden mausoleum of pavilions and lotus ponds.', cost: 150000, category: 'attraction' },
      { time: '20:00', title: 'Riverside hotel & dinner', description: 'Royal-style "imperial" small plates by the water.', cost: 1100000, category: 'accommodation' },
    ],
  },
  {
    day: 7,
    date: 'Oct 9',
    city: 'Da Nang — Golden Bridge & Beach',
    coverImage: img('1741138327956-dfa75763b50d', 1200, 500),
    coverAlt: 'The Golden Bridge held aloft by two giant stone hands',
    transport: 'Hai Van Pass drive → Da Nang (₫500,000)',
    activities: [
      { time: '08:00', title: 'Hai Van Pass drive', description: 'The cloud-catcher mountain road with sweeping views of the South China Sea.', cost: 500000, category: 'transport' },
      { time: '10:30', title: 'Ba Na Hills & Golden Bridge', description: 'A cable car to the hill station and the walkway cradled in two giant hands.', cost: 900000, category: 'attraction' },
      { time: '13:00', title: 'Lunch — mi quang', description: 'Central Vietnam\'s turmeric noodles with shrimp, pork, and a crisp rice cracker.', cost: 100000, category: 'food' },
      { time: '15:00', title: 'Marble Mountains', description: 'Five marble-and-limestone hills honeycombed with caves and Buddhist shrines.', cost: 80000, category: 'attraction' },
      { time: '17:00', title: 'My Khe Beach sunset', description: 'A swim off one of the finest city beaches in Asia.', cost: 0, category: 'attraction' },
      { time: '19:30', title: 'Seafood on the sand', description: 'Grilled scallops and clams with garlic butter at a beachfront grill.', cost: 350000, category: 'food' },
    ],
  },
  {
    day: 8,
    date: 'Oct 10',
    city: 'Hoi An — Lantern Old Town',
    coverImage: img('1755709986407-f72e45084ff2', 1200, 500),
    coverAlt: 'Silk lanterns glowing over a night market in Hoi An',
    transport: 'Short transfer Da Nang → Hoi An (₫300,000)',
    activities: [
      { time: '09:00', title: 'Custom tailoring fitting', description: 'Hoi An\'s famous tailors — a bespoke ao dai or linen suit ready by evening.', cost: 1500000, category: 'other' },
      { time: '11:00', title: 'Old Town walk', description: 'The Japanese Covered Bridge, Chinese assembly halls, and ochre merchant houses.', cost: 120000, category: 'attraction' },
      { time: '13:00', title: 'Cao lau & white rose', description: 'Two dishes found only here: smoky noodles and translucent shrimp dumplings.', cost: 120000, category: 'food' },
      { time: '15:00', title: 'Tra Que herb-village class', description: 'Cycle to an organic herb village for a hands-on Vietnamese cooking class.', cost: 700000, category: 'food' },
      { time: '18:30', title: 'Float a river lantern', description: 'Set a paper lantern adrift on the Thu Bon at dusk for luck.', cost: 30000, category: 'attraction' },
      { time: '20:00', title: 'Night market & bridge lights', description: 'The whole town glows; browse silk, street food, and lantern stalls.', cost: 150000, category: 'food' },
    ],
  },
  {
    day: 9,
    date: 'Oct 11',
    city: 'Ho Chi Minh City — Saigon',
    coverImage: img('1521019795854-14e15f600980', 1200, 500),
    coverAlt: 'The riverside skyline of Ho Chi Minh City',
    transport: 'Flight Da Nang → HCMC (₫1,400,000)',
    activities: [
      { time: '07:30', title: 'Fly to Saigon', description: 'South to the frenetic economic heart of Vietnam.', cost: 1400000, category: 'transport' },
      { time: '10:00', title: 'War Remnants Museum', description: 'An unflinching account of the American War from the Vietnamese side.', cost: 40000, category: 'attraction' },
      { time: '11:30', title: 'Reunification Palace', description: 'The 1975 gates-crashing tank site, frozen in mid-century decor.', cost: 40000, category: 'attraction' },
      { time: '13:00', title: 'Banh mi & ca phe sua da', description: 'A crackling baguette sandwich and iced coffee, French colonialism made delicious.', cost: 60000, category: 'food' },
      { time: '15:00', title: 'Cu Chi Tunnels', description: 'Crawl a section of the 250km guerrilla tunnel network outside the city.', cost: 400000, category: 'attraction' },
      { time: '19:00', title: 'Rooftop bar over the city', description: 'Cocktails high above the motorbike rivers and neon.', cost: 350000, category: 'food' },
      { time: '21:00', title: 'Ben Thanh night market', description: 'Last-minute lacquerware, coffee, and knock-off finds.', cost: 200000, category: 'other' },
    ],
  },
  {
    day: 10, date: 'Oct 12', city: 'Can Tho — Deep Mekong',
    coverImage: img('1543411789-1a67a2ac05c6', 1200, 500),
    coverAlt: 'Boats trading produce at a Mekong floating market',
    transport: 'Van Saigon → Can Tho (₫350,000)',
    activities: [
      { time: '06:00', title: 'Drive into the delta', description: 'South to the largest city of the "nine dragons" river country.', cost: 350000, category: 'transport' },
      { time: '10:00', title: 'Ninh Kieu riverfront', description: 'A palm-lined promenade where the Hau River bends past the market.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch — hu tieu', description: 'The clear pork-and-seafood noodle soup that the delta claims as its own.', cost: 70000, category: 'food' },
      { time: '16:00', title: 'Bang Lang stork sanctuary', description: 'Thousands of white storks wheeling home to the orchard at dusk.', cost: 40000, category: 'attraction' },
    ],
  },
  {
    day: 11, date: 'Oct 13', city: 'Chau Doc — Sam Mountain',
    coverImage: img('1543411789-1a67a2ac05c6', 1200, 500),
    coverAlt: 'A river town on the Cambodian border of the Mekong Delta',
    transport: 'Boat & road to Chau Doc (₫300,000)',
    activities: [
      { time: '07:00', title: 'Tra Su cajuput forest', description: 'A sampan glides across a carpet of green duckweed beneath flooded trees.', cost: 150000, category: 'attraction' },
      { time: '11:00', title: 'Floating fish farms', description: 'Houses on the river with pens of basa catfish teeming beneath the floor.', cost: 100000, category: 'attraction' },
      { time: '13:00', title: 'Lunch — bun ca Chau Doc', description: 'A turmeric fish noodle soup flavoured with the local prahok paste.', cost: 60000, category: 'food' },
      { time: '16:30', title: 'Sam Mountain sunset', description: 'Climb the border hill for a view across the rice plains into Cambodia.', cost: 50000, category: 'attraction' },
    ],
  },
  {
    day: 12, date: 'Oct 14', city: 'Rach Gia — Gulf Crossing',
    coverImage: img('1593994602837-530142086918', 1200, 500),
    coverAlt: 'A ferry crossing calm gulf waters in southern Vietnam',
    transport: 'Bus + fast ferry to the coast (₫250,000)',
    activities: [
      { time: '08:00', title: 'Cross to the gulf coast', description: 'Down to the port town at the western edge of the delta.', cost: 250000, category: 'transport' },
      { time: '11:00', title: 'Nguyen Trung Truc Temple', description: 'A shrine to the resistance hero who burned a French warship here.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Seafood at the port', description: 'Blood cockles and grilled squid straight off the returning boats.', cost: 180000, category: 'food' },
      { time: '15:00', title: 'Ferry to Phu Quoc', description: 'The fast catamaran out across the Gulf of Thailand.', cost: 400000, category: 'transport' },
    ],
  },
  {
    day: 13, date: 'Oct 15', city: 'Phu Quoc — Island Arrival',
    coverImage: img('1593994602837-530142086918', 1200, 500),
    coverAlt: 'A white-sand beach fringed with palms on Phu Quoc',
    transport: 'Island scooter hire (₫150,000)',
    activities: [
      { time: '09:00', title: 'Check in near Long Beach', description: 'A bungalow on the 20km strand down the island\'s west coast.', cost: 1100000, category: 'accommodation' },
      { time: '11:00', title: 'Fish-sauce distillery', description: 'Towering wooden vats ageing the nuoc mam that made the island famous.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch — herring salad', description: 'Goi ca trich, raw herring tossed with coconut and rice-paper rolls.', cost: 120000, category: 'food' },
      { time: '17:30', title: 'Sunset over the gulf', description: 'The island faces west — the day ends in fire over the sea.', cost: 100000, category: 'food' },
    ],
  },
  {
    day: 14, date: 'Oct 16', city: 'Phu Quoc — Beaches & Pepper',
    coverImage: img('1656692197297-cb1340b4d538', 1200, 500),
    coverAlt: 'Rows of green pepper vines on a Phu Quoc farm',
    transport: 'Scooter around the north (₫0)',
    activities: [
      { time: '08:00', title: 'Pepper plantation', description: 'Trellised vines of the prized Phu Quoc black pepper in the red earth.', cost: 30000, category: 'attraction' },
      { time: '10:00', title: 'Starfish Beach', description: 'Shallow, glass-clear water dotted with red starfish in the north.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Grilled sea urchin lunch', description: 'Nhum nuong mo hanh, urchin with spring onion oil and peanuts.', cost: 150000, category: 'food' },
      { time: '19:00', title: 'Dinh Cau night market', description: 'Tanks of live seafood picked and grilled to order by the harbour.', cost: 250000, category: 'food' },
    ],
  },
  {
    day: 15, date: 'Oct 17', city: 'Phu Quoc — An Thoi Islands',
    coverImage: img('1593994602837-530142086918', 1200, 500),
    coverAlt: 'A cable car spanning turquoise water between islands',
    transport: 'Sea cable car & boat (₫300,000)',
    activities: [
      { time: '08:00', title: 'World\'s longest sea cable car', description: 'Nearly 8km over the islets to Hon Thom in a glass gondola.', cost: 300000, category: 'transport' },
      { time: '10:30', title: 'Snorkel the An Thoi reefs', description: 'Coral gardens and clownfish in the warm southern shallows.', cost: 250000, category: 'attraction' },
      { time: '13:00', title: 'Beach picnic lunch', description: 'Barbecued mackerel and cold coconuts on a deserted cay.', cost: 0, category: 'food' },
      { time: '16:00', title: 'Sao Beach', description: 'The island\'s finest crescent of blinding white sand.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 16, date: 'Oct 18', city: 'Con Dao — Wild Archipelago',
    coverImage: img('1741138327956-dfa75763b50d', 1200, 500),
    coverAlt: 'A quiet forested island rising from a calm sea',
    transport: 'Flight Phu Quoc → Con Dao (₫1,500,000)',
    activities: [
      { time: '08:00', title: 'Fly to the Con Dao islands', description: 'To the remote, forested archipelago off the far southern coast.', cost: 1500000, category: 'transport' },
      { time: '11:00', title: 'Con Dao Prison', description: 'The French "tiger cages" that made these islands a byword for defiance.', cost: 40000, category: 'attraction' },
      { time: '13:00', title: 'Lunch by the pier', description: 'Simple island fare — grilled fish and morning-glory greens.', cost: 130000, category: 'food' },
      { time: '16:00', title: 'Hang Duong cemetery', description: 'Locals light incense at midnight for the martyr Vo Thi Sau.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 17, date: 'Oct 19', city: 'Con Dao — Reefs & Turtles',
    coverImage: img('1593994602837-530142086918', 1200, 500),
    coverAlt: 'A sea turtle gliding over a coral reef',
    transport: 'National park boat (₫400,000)',
    activities: [
      { time: '07:00', title: 'Bay Canh turtle island', description: 'A protected beach where green turtles haul up to nest in season.', cost: 400000, category: 'attraction' },
      { time: '10:00', title: 'Snorkel over live coral', description: 'Some of the healthiest reefs left in Vietnam, in a marine park.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Seafood on Dam Trau beach', description: 'A crescent below the runway where planes skim the palms.', cost: 200000, category: 'food' },
      { time: '17:00', title: 'Ma Thien Lanh bridge', description: 'A forest walk to a haunting unfinished colonial bridge.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 18, date: 'Oct 20', city: 'Mui Ne — Sand & Sea',
    coverImage: img('1741138327956-dfa75763b50d', 1200, 500),
    coverAlt: 'Orange sand dunes meeting a blue sky at Mui Ne',
    transport: 'Flight + coast drive (₫1,300,000)',
    activities: [
      { time: '08:00', title: 'Fly to the mainland coast', description: 'Back to Saigon and out along the coast to the fishing town of Mui Ne.', cost: 1300000, category: 'transport' },
      { time: '15:00', title: 'Fairy Stream walk', description: 'Wade a warm ankle-deep creek between red-and-white sandstone bluffs.', cost: 20000, category: 'attraction' },
      { time: '17:00', title: 'Red sand dunes sunset', description: 'Slide down warm ochre dunes as the light turns the sand to copper.', cost: 50000, category: 'attraction' },
      { time: '19:30', title: 'Grilled seafood dinner', description: 'Scallops with peanuts and spring onion at a beach-road grill.', cost: 250000, category: 'food' },
    ],
  },
  {
    day: 19, date: 'Oct 21', city: 'Mui Ne — Dunes & Kites',
    coverImage: img('1741138327956-dfa75763b50d', 1200, 500),
    coverAlt: 'Kitesurfers on a windy stretch of the Mui Ne coast',
    transport: 'Jeep dune tour (₫200,000)',
    activities: [
      { time: '05:00', title: 'White dunes sunrise jeep', description: 'A dawn ride over the vast pale dunes above a lotus lake.', cost: 200000, category: 'attraction' },
      { time: '09:00', title: 'Fishing village at dawn', description: 'Round coracles bobbing in as the night\'s catch is sorted on the sand.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch — banh canh cha ca', description: 'Thick noodle soup with the town\'s springy fish cakes.', cost: 70000, category: 'food' },
      { time: '15:00', title: 'Kitesurfing lesson', description: 'The steady cross-shore wind makes this a world kitesurfing capital.', cost: 900000, category: 'attraction' },
    ],
  },
  {
    day: 20, date: 'Oct 22', city: 'Da Lat — City of Eternal Spring',
    coverImage: img('1609412058473-c199497c3c5d', 1200, 500),
    coverAlt: 'Pine-clad hills and a lake in the Da Lat highlands',
    transport: 'Mountain road to Da Lat (₫400,000)',
    activities: [
      { time: '08:00', title: 'Climb into the highlands', description: 'Up through pine forest to the cool French hill station on the plateau.', cost: 400000, category: 'transport' },
      { time: '12:00', title: 'Xuan Huong Lake', description: 'A crescent lake at the heart of town ringed by flower gardens.', cost: 0, category: 'attraction' },
      { time: '13:30', title: 'Lunch — banh mi xiu mai', description: 'A highland breakfast bowl of pork meatballs with a warm baguette.', cost: 50000, category: 'food' },
      { time: '16:00', title: 'Da Lat railway & old villas', description: 'The art-deco station and lanes of pastel colonial mansions.', cost: 30000, category: 'attraction' },
    ],
  },
  {
    day: 21, date: 'Oct 23', city: 'Da Lat — Waterfalls & Coffee',
    coverImage: img('1764745021303-c3d97bedd2c6', 1200, 500),
    coverAlt: 'Rows of coffee cherries drying on a highland farm',
    transport: 'Scooter & canyon shuttle (₫150,000)',
    activities: [
      { time: '08:00', title: 'Datanla canyoning', description: 'Abseil waterfalls and slide natural rock chutes in the pine gorge.', cost: 1200000, category: 'attraction' },
      { time: '13:00', title: 'Weasel-coffee farm', description: 'Taste the highland arabica and the curious ca phe chon.', cost: 100000, category: 'food' },
      { time: '15:30', title: 'Elephant Falls', description: 'A thundering cascade you scramble behind on slick black rock.', cost: 20000, category: 'attraction' },
      { time: '18:00', title: 'Night market artichoke tea', description: 'Grilled rice paper "Da Lat pizza" and hot artichoke tea in the cold.', cost: 80000, category: 'food' },
    ],
  },
  {
    day: 22, date: 'Oct 24', city: 'Da Lat — Gardens & Whimsy',
    coverImage: img('1609412058473-c199497c3c5d', 1200, 500),
    coverAlt: 'A surreal organic-shaped building among trees in Da Lat',
    transport: 'Local taxis (₫120,000)',
    activities: [
      { time: '08:30', title: 'Crazy House (Hang Nga)', description: 'A Gaudi-esque guesthouse of twisting concrete trees and tunnels.', cost: 60000, category: 'attraction' },
      { time: '10:30', title: 'Linh Phuoc mosaic pagoda', description: 'A dragon temple entirely clad in shards of broken pottery and glass.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch — nem nuong', description: 'Grilled pork sausage rolled at the table with herbs and rice paper.', cost: 80000, category: 'food' },
      { time: '15:00', title: 'Flower & strawberry farms', description: 'Greenhouses of hydrangea and hillsides of hydroponic berries.', cost: 50000, category: 'attraction' },
    ],
  },
  {
    day: 23, date: 'Oct 25', city: 'Nha Trang — Coastal Resort',
    coverImage: img('1593994602837-530142086918', 1200, 500),
    coverAlt: 'A long city beach curving beside a bright blue bay',
    transport: 'Pass road down to the coast (₫350,000)',
    activities: [
      { time: '08:00', title: 'Descend to the sea', description: 'A switchback road from the pines down to the beach city of Nha Trang.', cost: 350000, category: 'transport' },
      { time: '12:00', title: 'Po Nagar Cham Towers', description: 'Brick Hindu towers from the 8th-century Cham kingdom over the river mouth.', cost: 30000, category: 'attraction' },
      { time: '14:00', title: 'Thap Ba mud baths', description: 'Soak in warm mineral mud and hot springs above the bay.', cost: 300000, category: 'attraction' },
      { time: '19:00', title: 'Bo nuong & seafood street', description: 'Table-top beef barbecue and fresh oysters down Thap Ba road.', cost: 300000, category: 'food' },
    ],
  },
  {
    day: 24, date: 'Oct 26', city: 'Nha Trang — Islands & Reefs',
    coverImage: img('1593994602837-530142086918', 1200, 500),
    coverAlt: 'Snorkelling boats anchored off an island near Nha Trang',
    transport: 'Island-hopping boat (₫450,000)',
    activities: [
      { time: '08:00', title: 'Bay island-hopping', description: 'A boat day out to Mun and Tam islands in the marine reserve.', cost: 450000, category: 'transport' },
      { time: '10:00', title: 'Snorkel the coral', description: 'Warm clear water over reef in Vietnam\'s first marine protected area.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Floating seafood lunch', description: 'Steamed clams and grilled fish on a raft restaurant.', cost: 250000, category: 'food' },
      { time: '16:00', title: 'Hon Chong promontory', description: 'Giant tumbled boulders and the legend of the giant\'s handprint.', cost: 30000, category: 'attraction' },
    ],
  },
  {
    day: 25, date: 'Oct 27', city: 'Quy Nhon — Quiet Coast',
    coverImage: img('1741138327956-dfa75763b50d', 1200, 500),
    coverAlt: 'An empty golden beach backed by green hills',
    transport: 'Coastal train north (₫300,000)',
    activities: [
      { time: '08:00', title: 'Scenic coast train', description: 'The rails hug the shore north to the underrated town of Quy Nhon.', cost: 300000, category: 'transport' },
      { time: '13:00', title: 'Ky Co & Eo Gio', description: 'A hidden cove of clear water and the windy "eye of heaven" cliffs.', cost: 200000, category: 'attraction' },
      { time: '16:00', title: 'Banh xeo tom nhay lunch', description: 'Crispy pancakes with "jumping shrimp" straight from the lagoon.', cost: 90000, category: 'food' },
      { time: '18:00', title: 'Fishing-town promenade', description: 'A long uncrowded beach for an evening stroll among locals.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 26, date: 'Oct 28', city: 'Quy Nhon — Cham Heritage',
    coverImage: img('1616486410185-81af2d32a2af', 1200, 500),
    coverAlt: 'Ancient brick Cham towers on a green hilltop',
    transport: 'Local car hire (₫250,000)',
    activities: [
      { time: '08:00', title: 'Banh It Cham Towers', description: 'A cluster of 11th-century brick towers on a hill above the paddies.', cost: 20000, category: 'attraction' },
      { time: '10:30', title: 'Thap Doi twin towers', description: 'A pair of restored Cham sanctuaries right in the modern town.', cost: 20000, category: 'attraction' },
      { time: '13:00', title: 'Lunch — bun cha ca', description: 'The central-coast fish-cake noodle soup, light and clear.', cost: 60000, category: 'food' },
      { time: '16:00', title: 'Trung Luong beach cove', description: 'A sheltered bay for a last swim before turning inland.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 27, date: 'Oct 29', city: 'Kon Tum — Central Highlands',
    coverImage: img('1609412058473-c199497c3c5d', 1200, 500),
    coverAlt: 'A wooden stilt communal house in a highland village',
    transport: 'Mountain road inland (₫400,000)',
    activities: [
      { time: '07:00', title: 'Climb the Truong Son', description: 'Inland and up to the ethnic-minority heartland near the Laos border.', cost: 400000, category: 'transport' },
      { time: '12:00', title: 'Kon Klor rong house', description: 'A soaring bamboo-and-thatch Bahnar communal hall by the river.', cost: 0, category: 'attraction' },
      { time: '13:30', title: 'Lunch — com lam & grilled chicken', description: 'Rice roasted in bamboo tubes with free-range highland chicken.', cost: 80000, category: 'food' },
      { time: '16:00', title: 'Wooden church of Kon Tum', description: 'A century-old timber cathedral built by the Bahnar in Roman style.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 28, date: 'Oct 30', city: 'Buon Ma Thuot — Coffee Capital',
    coverImage: img('1764745021303-c3d97bedd2c6', 1200, 500),
    coverAlt: 'A wide waterfall thundering over dark basalt rock',
    transport: 'Highland highway (₫350,000)',
    activities: [
      { time: '08:00', title: 'Drive to coffee country', description: 'Across the red-earth plateau that grows most of Vietnam\'s robusta.', cost: 350000, category: 'transport' },
      { time: '11:00', title: 'Dray Nur & Dray Sap falls', description: 'Twin "husband and wife" waterfalls on the Serepok river.', cost: 30000, category: 'attraction' },
      { time: '13:00', title: 'World Coffee Museum', description: 'A striking museum tracing the bean from Ethiopia to the highlands.', cost: 75000, category: 'food' },
      { time: '16:00', title: 'Ako Dhong village', description: 'An Ede longhouse village of coffee gardens tucked inside the city.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 29, date: 'Oct 31', city: 'Cat Tien — Jungle Return',
    coverImage: img('1609412058473-c199497c3c5d', 1200, 500),
    coverAlt: 'Dense rainforest canopy in a Vietnamese national park',
    transport: 'Road & river ferry (₫400,000)',
    activities: [
      { time: '07:00', title: 'Descend toward Saigon', description: 'Off the plateau to the lowland rainforest of Cat Tien National Park.', cost: 400000, category: 'transport' },
      { time: '12:00', title: 'Gibbon dawn trek', description: 'Walk the forest to hear wild golden-cheeked gibbons calling at first light.', cost: 300000, category: 'attraction' },
      { time: '15:00', title: 'Crocodile Lake hike', description: 'A jungle trail to a lake where siamese crocodiles bask.', cost: 100000, category: 'attraction' },
      { time: '19:00', title: 'Riverside lodge dinner', description: 'A last highland meal to the sound of the forest.', cost: 500000, category: 'accommodation' },
    ],
  },
  {
    day: 30,
    date: 'Nov 1',
    city: 'Mekong Delta — Farewell',
    coverImage: img('1543411789-1a67a2ac05c6', 1200, 500),
    coverAlt: 'A wooden boat carrying travellers on a Mekong Delta canal',
    transport: 'Van → My Tho / Ben Tre (₫450,000)',
    activities: [
      { time: '07:00', title: 'Drive to the Mekong', description: 'Out to the "rice bowl" delta, a maze of channels and floating life.', cost: 450000, category: 'transport' },
      { time: '09:00', title: 'Sampan through coconut canals', description: 'A hand-rowed boat under the palms in a conical hat.', cost: 300000, category: 'attraction' },
      { time: '10:30', title: 'Cai Rang floating market', description: 'Wholesalers trade produce boat-to-boat, wares hung from tall poles.', cost: 0, category: 'attraction' },
      { time: '11:30', title: 'Coconut candy workshop', description: 'Watch sticky coconut candy pulled and cut, with honey-ginger tea.', cost: 100000, category: 'food' },
      { time: '13:00', title: 'Elephant-ear fish lunch', description: 'A whole crispy fish wrapped into fresh rice-paper rolls at a garden restaurant.', cost: 250000, category: 'food' },
      { time: '16:00', title: 'Return to Saigon', description: 'A last Vietnamese coffee before the airport.', cost: 60000, category: 'food' },
      { time: '20:00', title: 'Departure — tam biet', description: 'To the airport with a suitcase of silk and spice. Until next time, Vietnam.', cost: 300000, category: 'transport' },
    ],
  },
]

// ─── China ─────────────────────────────────────────────────────────────

const CHINA_ITINERARY: Day[] = [
  {
    day: 1,
    date: 'Nov 1',
    city: 'Beijing — Forbidden City & Tiananmen',
    coverImage: img('1603120527222-33f28c2ce89e', 1200, 500),
    coverAlt: 'Aerial view over the golden rooftops of the Forbidden City',
    transport: 'Airport Express → city (CN¥25)',
    activities: [
      { time: '11:00', title: 'Arrive Beijing Capital', description: 'Land in the 3,000-year-old capital and ride the maglev-fast Airport Express in.', cost: 25, category: 'transport' },
      { time: '13:00', title: 'Check in — courtyard hotel', description: 'A restored siheyuan courtyard house in a hutong near Wangfujing.', cost: 750, category: 'accommodation' },
      { time: '14:30', title: 'Tiananmen Square', description: 'The vast ceremonial heart of the nation, ringed by monumental halls.', cost: 0, category: 'attraction' },
      { time: '15:30', title: 'The Forbidden City', description: 'Nine thousand rooms behind vermillion walls — the imperial palace of 24 emperors.', cost: 60, category: 'attraction' },
      { time: '18:00', title: 'Jingshan Park sunset', description: 'Climb the hill behind the palace for the golden-hour view over its rooftops.', cost: 10, category: 'attraction' },
      { time: '19:30', title: 'Dinner — Peking duck', description: 'Lacquered duck carved tableside, rolled with scallion and plum sauce at Siji Minfu.', cost: 320, category: 'food' },
    ],
  },
  {
    day: 2,
    date: 'Nov 2',
    city: 'Beijing — Great Wall at Mutianyu',
    coverImage: img('1608037521277-154cd1b89191', 1200, 500),
    coverAlt: 'The Great Wall of China snaking over forested mountains',
    transport: 'Private car to Mutianyu (CN¥400)',
    activities: [
      { time: '07:30', title: 'Drive to Mutianyu', description: 'The best-restored, least-crowded stretch of the Wall, 90 minutes north.', cost: 400, category: 'transport' },
      { time: '09:30', title: 'Cable car to the ramparts', description: 'Rise to the ridgeline where the Wall runs tower to tower into the haze.', cost: 120, category: 'attraction' },
      { time: '10:00', title: 'Hike towers 6 to 20', description: 'Walk the battlements for miles with the mountains falling away on both sides.', cost: 45, category: 'attraction' },
      { time: '12:30', title: 'Toboggan down & lunch', description: 'Ride a metal luge back to the base, then a courtyard farmhouse meal.', cost: 150, category: 'food' },
      { time: '15:00', title: 'Summer Palace', description: 'The imperial lakeside retreat: the Long Corridor and the marble boat.', cost: 60, category: 'attraction' },
      { time: '19:00', title: 'Ghost Street food crawl', description: 'A red-lantern avenue of spicy crayfish and hotpot open late into the night.', cost: 180, category: 'food' },
    ],
  },
  {
    day: 3,
    date: 'Nov 3',
    city: 'Xi\'an — Terracotta Army',
    coverImage: img('1527922891260-918d42a4efc8', 1200, 500),
    coverAlt: 'Rows of life-size terracotta warriors in an excavation pit',
    transport: 'High-speed rail G-train (CN¥515)',
    activities: [
      { time: '08:00', title: 'Bullet train to Xi\'an', description: 'Glide 1,200km in 4.5 hours at 300km/h to the start of the Silk Road.', cost: 515, category: 'transport' },
      { time: '13:30', title: 'Check in near the Bell Tower', description: 'A hotel in the walled old city, minutes from the drum and bell towers.', cost: 620, category: 'accommodation' },
      { time: '15:00', title: 'The Terracotta Army', description: 'Thousands of clay soldiers, each with a unique face, guarding an emperor\'s tomb since 210 BC.', cost: 120, category: 'attraction' },
      { time: '18:00', title: 'City Wall bike ride', description: 'Cycle the full 14km circuit atop the intact Ming-era ramparts at dusk.', cost: 90, category: 'attraction' },
      { time: '20:00', title: 'Dinner — biang biang noodles', description: 'Belt-wide hand-pulled noodles under chilli oil, named for the sound of the slap.', cost: 60, category: 'food' },
    ],
  },
  {
    day: 4,
    date: 'Nov 4',
    city: 'Xi\'an — Muslim Quarter & Pagoda',
    coverImage: img('1563245372-f21724e3856d', 1200, 500),
    coverAlt: 'Steamer baskets of Chinese dumplings',
    transport: 'Metro & walking (CN¥20)',
    activities: [
      { time: '09:00', title: 'Big Wild Goose Pagoda', description: 'A 7th-century brick pagoda built to house sutras carried back from India.', cost: 50, category: 'attraction' },
      { time: '11:00', title: 'Shaanxi History Museum', description: 'Tang gold, Zhou bronzes, and Silk Road treasures — one of China\'s finest collections.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Muslim Quarter street food', description: 'Roujiamo "Chinese burgers", lamb skewers, and yang rou paomo bread soup.', cost: 120, category: 'food' },
      { time: '15:30', title: 'Great Mosque of Xi\'an', description: 'A 1,200-year-old mosque built entirely in Chinese temple style.', cost: 25, category: 'attraction' },
      { time: '18:00', title: 'Tang dumpling banquet', description: 'Eighteen kinds of jiaozi shaped like the creatures they contain.', cost: 200, category: 'food' },
      { time: '20:00', title: 'Datang Everbright light show', description: 'A Tang-themed boulevard ablaze with performers and lanterns.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 5,
    date: 'Nov 5',
    city: 'Chengdu — Pandas & Sichuan',
    coverImage: img('1625859043880-56acbcb6a6ac', 1200, 500),
    coverAlt: 'A giant panda resting on a tree branch',
    transport: 'Flight Xi\'an → Chengdu (CN¥700)',
    activities: [
      { time: '07:30', title: 'Fly to Chengdu', description: 'West to the laid-back capital of Sichuan, land of pandas and chilli.', cost: 700, category: 'transport' },
      { time: '10:00', title: 'Giant Panda Base', description: 'Arrive early to catch the pandas at their bamboo breakfast, cubs and all.', cost: 55, category: 'attraction' },
      { time: '13:00', title: 'Lunch — mapo tofu', description: 'The numbing-hot Sichuan classic with dan dan noodles on the side.', cost: 90, category: 'food' },
      { time: '15:00', title: 'Wuhou Shrine & Jinli Street', description: 'A Three Kingdoms memorial temple beside a bustling old-style snack street.', cost: 50, category: 'attraction' },
      { time: '17:00', title: 'Renmin Park teahouse', description: 'Sip covered-bowl tea and try the famous ear-cleaning among local retirees.', cost: 40, category: 'food' },
      { time: '20:00', title: 'Sichuan opera face-changing', description: 'The secret art of bian lian — masks flipping colour in the blink of an eye.', cost: 220, category: 'attraction' },
    ],
  },
  {
    day: 6,
    date: 'Nov 6',
    city: 'Zhangjiajie — Avatar Mountains',
    coverImage: img('1514920735211-8c697444a248', 1200, 500),
    coverAlt: 'Sandstone pillars rising through mist at Zhangjiajie',
    transport: 'Flight Chengdu → Zhangjiajie (CN¥650)',
    activities: [
      { time: '07:00', title: 'Fly to Zhangjiajie', description: 'To the forest of sandstone spires that inspired the floating peaks of Avatar.', cost: 650, category: 'transport' },
      { time: '10:00', title: 'Bailong glass elevator', description: 'A 326m glass lift bolted to a cliff face — the tallest outdoor lift on earth.', cost: 72, category: 'attraction' },
      { time: '11:00', title: 'Hallelujah Mountain views', description: 'Walk the ridge platforms among the mist-wrapped, tree-topped pillars.', cost: 225, category: 'attraction' },
      { time: '13:00', title: 'Lunch — Tujia smoked pork', description: 'Cured mountain pork stir-fried with dried chilli, a hill-people staple.', cost: 90, category: 'food' },
      { time: '15:00', title: 'Zhangjiajie Glass Bridge', description: 'A transparent span 300m above the canyon floor — not for the faint of heart.', cost: 138, category: 'attraction' },
      { time: '18:00', title: 'Mountain hotel & dinner', description: 'A Tujia-style inn near the park gate with a hotpot supper.', cost: 700, category: 'accommodation' },
    ],
  },
  {
    day: 7,
    date: 'Nov 7',
    city: 'Guilin & Yangshuo — Li River',
    coverImage: img('1636964886908-7b28097bc746', 1200, 500),
    coverAlt: 'Karst peaks rising along the misty Li River',
    transport: 'Flight Zhangjiajie → Guilin (CN¥600)',
    activities: [
      { time: '07:30', title: 'Fly to Guilin', description: 'South to the karst-country river town on every 20-yuan note.', cost: 600, category: 'transport' },
      { time: '10:00', title: 'Li River raft cruise', description: 'Drift by bamboo raft past sugarloaf peaks and cormorant fishermen to Yangshuo.', cost: 300, category: 'transport' },
      { time: '13:00', title: 'Lunch — Yangshuo beer fish', description: 'River fish braised with local beer, tomato, and chilli.', cost: 80, category: 'food' },
      { time: '15:00', title: 'Cycle the Yulong River', description: 'Pedal country lanes between the paddies and water buffalo.', cost: 60, category: 'attraction' },
      { time: '18:00', title: 'Impression Sanjie Liu', description: 'A Zhang Yimou light show staged on the river itself with 600 performers.', cost: 320, category: 'attraction' },
      { time: '20:00', title: 'West Street evening', description: 'Yangshuo\'s lively old lane of bars, snacks, and lantern light.', cost: 120, category: 'food' },
    ],
  },
  {
    day: 8,
    date: 'Nov 8',
    city: 'Huangshan — Yellow Mountains',
    coverImage: img('1591116446368-2078ad1c0fea', 1200, 500),
    coverAlt: 'Peaks of Huangshan rising above a sea of clouds',
    transport: 'Flight + bus to Huangshan (CN¥750)',
    activities: [
      { time: '07:00', title: 'Travel to Huangshan', description: 'To the granite peaks that shaped a thousand years of Chinese landscape painting.', cost: 750, category: 'transport' },
      { time: '10:00', title: 'Cable car to the ridge', description: 'Rise into the pines and sculpted rock of the summit region.', cost: 90, category: 'transport' },
      { time: '11:00', title: 'West Sea Canyon hike', description: 'The most spectacular trail, threading stairways cut into the cliffs.', cost: 190, category: 'attraction' },
      { time: '14:00', title: 'Lunch on the mountain', description: 'Simple noodles and pickles at a summit lodge, carried up by porters.', cost: 120, category: 'food' },
      { time: '16:00', title: 'Bright Summit clouds', description: 'Wait on the peak for the sea of clouds to roll between the pinnacles.', cost: 0, category: 'attraction' },
      { time: '18:00', title: 'Summit hotel for sunrise', description: 'Sleep on the mountain to catch the famous dawn from the Refreshing Terrace.', cost: 900, category: 'accommodation' },
    ],
  },
  {
    day: 9,
    date: 'Nov 9',
    city: 'Hangzhou — West Lake',
    coverImage: img('1588252910189-9c9f5535646b', 1200, 500),
    coverAlt: 'A pagoda among trees above West Lake in Hangzhou',
    transport: 'High-speed rail → Hangzhou (CN¥280)',
    activities: [
      { time: '08:00', title: 'Bullet train to Hangzhou', description: 'Down from the mountains to the city Marco Polo called the finest in the world.', cost: 280, category: 'transport' },
      { time: '11:00', title: 'West Lake boat & causeway', description: 'A classic boat across the lake and a stroll along the willow-lined Su Causeway.', cost: 70, category: 'attraction' },
      { time: '13:00', title: 'Lunch — Longjing shrimp', description: 'River shrimp stir-fried with the local green tea, and Dongpo braised pork.', cost: 150, category: 'food' },
      { time: '15:00', title: 'Lingyin Temple', description: 'A great Chan Buddhist monastery beside a hill of ancient rock-cut carvings.', cost: 75, category: 'attraction' },
      { time: '17:00', title: 'Longjing tea village', description: 'Tasting Dragon Well tea straight from the terraced hills where it grows.', cost: 100, category: 'food' },
      { time: '19:30', title: 'Impression West Lake', description: 'A dreamlike night show performed on a stage just beneath the water\'s surface.', cost: 300, category: 'attraction' },
    ],
  },
  {
    day: 10,
    date: 'Nov 10',
    city: 'Shanghai — The Bund & Farewell',
    coverImage: img('1474181487882-5abf3f0ba6c2', 1200, 500),
    coverAlt: 'The illuminated skyline of Shanghai across the river at night',
    transport: 'High-speed rail → Shanghai (CN¥170)',
    activities: [
      { time: '08:00', title: 'Bullet train to Shanghai', description: 'A last high-speed hop to the dazzling city of the future.', cost: 170, category: 'transport' },
      { time: '10:00', title: 'Yu Garden & bazaar', description: 'A Ming-dynasty scholar\'s garden of rockeries and ponds in the old town.', cost: 40, category: 'attraction' },
      { time: '12:00', title: 'Xiaolongbao at Nanxiang', description: 'The original soup dumplings, pleated eighteen folds each.', cost: 90, category: 'food' },
      { time: '14:00', title: 'Shanghai Tower deck', description: 'Up to the 128th floor of China\'s tallest building for a god\'s-eye view.', cost: 180, category: 'attraction' },
      { time: '16:00', title: 'French Concession stroll', description: 'Plane-tree lanes, Art Deco villas, and the boutiques of Tianzifang.', cost: 0, category: 'other' },
      { time: '18:30', title: 'The Bund at dusk', description: 'Colonial facades on one bank, the neon Pudong skyline blazing on the other.', cost: 0, category: 'attraction' },
      { time: '21:00', title: 'Departure — zaijian', description: 'To the airport, the whole Middle Kingdom crossed in ten days. Zaijian, China.', cost: 200, category: 'transport' },
    ],
  },
]

// ─── Thailand ──────────────────────────────────────────────────────────

const THAILAND_ITINERARY: Day[] = [
  {
    day: 1, date: 'Jan 5', city: 'Bangkok — Temples & River',
    coverImage: img('1510379872535-9310dc6fd6a7', 1200, 500),
    coverAlt: 'Wat Arun rising over the Chao Phraya river in Bangkok',
    transport: 'Airport Rail Link → city (฿45)',
    activities: [
      { time: '13:00', title: 'Arrive Suvarnabhumi', description: 'Land in the City of Angels and ride the rail link into the heat and hum.', cost: 45, category: 'transport' },
      { time: '15:00', title: 'The Grand Palace & Wat Phra Kaew', description: 'Gilded spires and the revered Emerald Buddha in the old royal compound.', cost: 500, category: 'attraction' },
      { time: '17:00', title: 'Wat Arun at golden hour', description: 'Climb the porcelain-studded prang of the Temple of Dawn over the river.', cost: 100, category: 'attraction' },
      { time: '19:00', title: 'Dinner — pad thai & boat noodles', description: 'Street woks along a khlong, finished with lime, chilli, and crushed peanut.', cost: 180, category: 'food' },
      { time: '21:00', title: 'Rooftop bar over the skyline', description: 'A sky-high cocktail above the glittering sprawl of the megacity.', cost: 450, category: 'food' },
    ],
  },
  {
    day: 2, date: 'Jan 6', city: 'Bangkok — Markets & Canals',
    coverImage: img('1613672803979-a6edfc5a179b', 1200, 500),
    coverAlt: 'People walking near a temple in Bangkok',
    transport: 'Longtail boat & BTS Skytrain (฿120)',
    activities: [
      { time: '07:00', title: 'Damnoen Saduak floating market', description: 'Vendors paddle sampans laden with mango, pomelo, and coconut ice cream.', cost: 400, category: 'attraction' },
      { time: '11:00', title: 'Chatuchak weekend market', description: 'Fifteen thousand stalls — the largest market in Southeast Asia.', cost: 300, category: 'other' },
      { time: '13:00', title: 'Lunch — som tam & grilled chicken', description: 'Pounded green-papaya salad with sticky rice and gai yang.', cost: 150, category: 'food' },
      { time: '16:00', title: 'Jim Thompson House', description: 'A teak compound of the American who revived Thai silk, hung with art.', cost: 200, category: 'attraction' },
      { time: '20:00', title: 'Chinatown food crawl on Yaowarat', description: 'Neon, woks, and oyster omelettes down the old Chinese quarter.', cost: 300, category: 'food' },
    ],
  },
  {
    day: 3, date: 'Jan 7', city: 'Chiang Mai — Old City',
    coverImage: img('1613672803979-a6edfc5a179b', 1200, 500),
    coverAlt: 'A Lanna-style temple in Chiang Mai',
    transport: 'Flight Bangkok → Chiang Mai (฿1,200)',
    activities: [
      { time: '08:00', title: 'Fly north to Lanna country', description: 'Up to the cool northern capital ringed by its old moat and walls.', cost: 1200, category: 'transport' },
      { time: '11:00', title: 'Wat Phra That Doi Suthep', description: 'A golden chedi on a mountain reached by a 300-step naga staircase.', cost: 50, category: 'attraction' },
      { time: '13:00', title: 'Khao soi lunch', description: 'The north\'s signature curried noodle soup with crisp egg noodles on top.', cost: 90, category: 'food' },
      { time: '15:00', title: 'Old City temple wander', description: 'Wat Chedi Luang\'s ruined stupa and quiet teak monasteries.', cost: 40, category: 'attraction' },
      { time: '18:00', title: 'Sunday walking street', description: 'Handicrafts, lanterns, and northern snacks down the old high street.', cost: 250, category: 'other' },
    ],
  },
  {
    day: 4, date: 'Jan 8', city: 'Chiang Mai — Elephants & Jungle',
    coverImage: img('1613672803979-a6edfc5a179b', 1200, 500),
    coverAlt: 'Jungle hills around Chiang Mai',
    transport: 'Sanctuary shuttle (฿0, incl.)',
    activities: [
      { time: '08:00', title: 'Ethical elephant sanctuary', description: 'A full day feeding and bathing rescued elephants — no riding, no hooks.', cost: 2500, category: 'attraction' },
      { time: '13:00', title: 'Riverside Thai lunch', description: 'A home-style spread beside the jungle stream.', cost: 0, category: 'food' },
      { time: '15:30', title: 'Sticky Waterfalls of Bua Tong', description: 'Climb the limestone falls barefoot — the mineral rock grips your feet.', cost: 60, category: 'attraction' },
      { time: '18:30', title: 'Thai cooking class', description: 'Pound your own curry paste for a green curry and mango sticky rice.', cost: 900, category: 'food' },
    ],
  },
  {
    day: 5, date: 'Jan 9', city: 'Krabi — Railay & Islands',
    coverImage: img('1504214208698-ea1916a2195a', 1200, 500),
    coverAlt: 'Longtail boats on turquoise water in Krabi',
    transport: 'Flight + longtail to Railay (฿1,600)',
    activities: [
      { time: '08:00', title: 'Fly south to the Andaman', description: 'Down to the limestone-cliff coast of the turquoise sea.', cost: 1600, category: 'transport' },
      { time: '12:00', title: 'Railay Beach', description: 'A cliff-locked peninsula reachable only by boat, beloved of climbers.', cost: 0, category: 'attraction' },
      { time: '14:00', title: 'Four Islands longtail tour', description: 'Snorkel off Chicken Island and wade the sandbar at low tide.', cost: 800, category: 'attraction' },
      { time: '18:00', title: 'Beachfront seafood', description: 'Grilled tiger prawns and whole snapper as the sun drops.', cost: 500, category: 'food' },
    ],
  },
  {
    day: 6, date: 'Jan 10', city: 'Ayutthaya — Ancient Capital',
    coverImage: img('1613672803979-a6edfc5a179b', 1200, 500),
    coverAlt: 'Ruined brick prangs of the old Siamese capital Ayutthaya',
    transport: 'Fly north + train to Ayutthaya (฿1,400)',
    activities: [
      { time: '08:00', title: 'Return to the mainland', description: 'Fly back up to the plains and out to the old royal island city.', cost: 1400, category: 'transport' },
      { time: '12:00', title: 'Wat Mahathat', description: 'The serene sandstone Buddha head cradled in the roots of a banyan.', cost: 50, category: 'attraction' },
      { time: '14:00', title: 'Wat Chaiwatthanaram', description: 'A Khmer-style riverside temple, the grandest ruin of the old capital.', cost: 50, category: 'attraction' },
      { time: '17:00', title: 'Boat around the ruins', description: 'Circle the island at dusk as the prangs turn amber.', cost: 200, category: 'attraction' },
    ],
  },
  {
    day: 7, date: 'Jan 11', city: 'Kanchanaburi — River Kwai',
    coverImage: img('1546228139-87f5312cac42', 1200, 500),
    coverAlt: 'The iron bridge over the River Kwai at Kanchanaburi',
    transport: 'Train west to Kanchanaburi (฿300)',
    activities: [
      { time: '08:00', title: 'Ride the Death Railway', description: 'The wartime line clinging to a cliff above the jade river.', cost: 300, category: 'transport' },
      { time: '11:00', title: 'Bridge over the River Kwai', description: 'The infamous span built by Allied POWs and forced labourers.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch on a floating raft', description: 'Tom yum goong at a bamboo restaurant moored on the river.', cost: 200, category: 'food' },
      { time: '15:00', title: 'Hellfire Pass memorial', description: 'A moving museum and walk through the rock cutting in the jungle.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 8, date: 'Jan 12', city: 'Kanchanaburi — Erawan Falls',
    coverAlt: 'Turquoise tiered pools of Erawan waterfall in the jungle',
    coverImage: img('1613672803979-a6edfc5a179b', 1200, 500),
    transport: 'Songthaew to the park (฿150)',
    activities: [
      { time: '08:00', title: 'Erawan seven-tier falls', description: 'Climb emerald pools where fish nibble your toes to the top cascade.', cost: 300, category: 'attraction' },
      { time: '13:00', title: 'Riverside lunch', description: 'Grilled river prawns and som tam under the trees.', cost: 180, category: 'food' },
      { time: '15:00', title: 'Prasat Muang Sing', description: 'A far-flung Khmer temple outpost on the old western frontier.', cost: 100, category: 'attraction' },
      { time: '18:00', title: 'Night by the river', description: 'A raft-house stay lulled by the current.', cost: 900, category: 'accommodation' },
    ],
  },
  {
    day: 9, date: 'Jan 13', city: 'Sukhothai — Dawn of Siam',
    coverImage: img('1546228139-87f5312cac42', 1200, 500),
    coverAlt: 'A seated Buddha among ruins of the Sukhothai historical park',
    transport: 'Overnight bus north (฿500)',
    activities: [
      { time: '08:00', title: 'Sukhothai Historical Park', description: 'The 13th-century first Thai kingdom, its serene Buddhas among lily ponds.', cost: 100, category: 'attraction' },
      { time: '11:00', title: 'Wat Si Chum', description: 'A vast Buddha peering through a slot in a brick mondop.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Sukhothai noodles', description: 'The local kuaitiao with pork rind, green beans, and palm sugar.', cost: 60, category: 'food' },
      { time: '16:00', title: 'Cycle the old walls', description: 'Pedal the quiet ruins as the light goes long and gold.', cost: 50, category: 'attraction' },
    ],
  },
  {
    day: 10, date: 'Jan 14', city: 'Chiang Rai — White Temple',
    coverImage: img('1613672803979-a6edfc5a179b', 1200, 500),
    coverAlt: 'The ornate all-white Wat Rong Khun in Chiang Rai',
    transport: 'Bus to the far north (฿400)',
    activities: [
      { time: '08:00', title: 'North to Chiang Rai', description: 'Up to the northernmost province near the Myanmar-Laos borders.', cost: 400, category: 'transport' },
      { time: '13:00', title: 'Wat Rong Khun', description: 'The dazzling white temple, a contemporary artist\'s glittering vision.', cost: 100, category: 'attraction' },
      { time: '15:00', title: 'Blue Temple (Wat Rong Suea Ten)', description: 'A sapphire-and-gold sanctuary glowing with sculpted flame.', cost: 0, category: 'attraction' },
      { time: '18:00', title: 'Night bazaar dinner', description: 'Northern sausage and khao soi at the food-hall stalls.', cost: 150, category: 'food' },
    ],
  },
  {
    day: 11, date: 'Jan 15', city: 'Chiang Rai — Golden Triangle',
    coverImage: img('1546228139-87f5312cac42', 1200, 500),
    coverAlt: 'The Mekong at the meeting of Thailand, Laos and Myanmar',
    transport: 'Day tour to the border (฿600)',
    activities: [
      { time: '08:00', title: 'The Golden Triangle', description: 'Where three countries meet across the Mekong and Ruak rivers.', cost: 600, category: 'transport' },
      { time: '10:00', title: 'Opium Museum', description: 'The dark history of the poppy trade that named this corner.', cost: 200, category: 'attraction' },
      { time: '13:00', title: 'Lunch in Mae Sai', description: 'Border-town noodles at the northern tip of Thailand.', cost: 90, category: 'food' },
      { time: '16:00', title: 'Choui Fong tea hills', description: 'Rolling emerald tea terraces with a cup on the terrace.', cost: 80, category: 'attraction' },
    ],
  },
  {
    day: 12, date: 'Jan 16', city: 'Pai — Mountain Town',
    coverImage: img('1613672803979-a6edfc5a179b', 1200, 500),
    coverAlt: 'Mist over green mountains around the town of Pai',
    transport: 'The 762-curve road to Pai (฿250)',
    activities: [
      { time: '08:00', title: 'The road of 762 curves', description: 'A famously winding minibus ride up into the misty hills.', cost: 250, category: 'transport' },
      { time: '13:00', title: 'Pai Canyon', description: 'Walk narrow red-earth ridges above the valley.', cost: 0, category: 'attraction' },
      { time: '16:00', title: 'Tha Pai hot springs', description: 'Soak in steaming pools in the teak forest.', cost: 300, category: 'attraction' },
      { time: '19:00', title: 'Walking street', description: 'A hippie-town night market of banana rotis and live guitars.', cost: 150, category: 'food' },
    ],
  },
  {
    day: 13, date: 'Jan 17', city: 'Pai — Waterfalls & Fields',
    coverImage: img('1546228139-87f5312cac42', 1200, 500),
    coverAlt: 'A bamboo bridge crossing bright green rice fields',
    transport: 'Scooter around the valley (฿150)',
    activities: [
      { time: '08:00', title: 'Boon Ko Ku So bamboo bridge', description: 'A woven walkway snaking across the paddies to a forest temple.', cost: 30, category: 'attraction' },
      { time: '11:00', title: 'Mo Paeng Waterfall', description: 'Natural rock slides into cool jungle pools.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch — northern larb', description: 'The herbal, spice-heavy Lanna version of the minced-meat salad.', cost: 80, category: 'food' },
      { time: '17:30', title: 'Yun Lai viewpoint sunset', description: 'A Chinese-village terrace above a sea of evening mist.', cost: 20, category: 'attraction' },
    ],
  },
  {
    day: 14, date: 'Jan 18', city: 'Mae Hong Son — Hill Villages',
    coverImage: img('1613672803979-a6edfc5a179b', 1200, 500),
    coverAlt: 'A lakeside temple reflected in still water at dawn',
    transport: 'Loop road to Mae Hong Son (฿300)',
    activities: [
      { time: '08:00', title: 'Over the far hills', description: 'Deeper into the remote northwest near the Myanmar border.', cost: 300, category: 'transport' },
      { time: '12:00', title: 'Ban Rak Thai tea village', description: 'A Yunnanese settlement of tea and clay houses by a lake.', cost: 0, category: 'attraction' },
      { time: '14:00', title: 'Su Tong Pae bamboo bridge', description: 'A long monk\'s bridge floating over golden paddies.', cost: 0, category: 'attraction' },
      { time: '18:00', title: 'Jong Kham lake temple', description: 'Burmese-style spires mirrored in the town lake at dusk.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 15, date: 'Jan 19', city: 'Khao Sok — Rainforest Lake',
    coverImage: img('1504214208698-ea1916a2195a', 1200, 500),
    coverAlt: 'Limestone karsts rising from an emerald reservoir lake',
    transport: 'Fly south + van to the park (฿1,600)',
    activities: [
      { time: '07:00', title: 'Fly to the deep south', description: 'Back down to the peninsula and the oldest rainforest on earth.', cost: 1600, category: 'transport' },
      { time: '13:00', title: 'Cheow Lan Lake boat', description: 'A longtail weaving between sheer karsts on jade water.', cost: 500, category: 'transport' },
      { time: '15:00', title: 'Floating raft house', description: 'Bamboo bungalows moored beneath the cliffs, only the jungle for company.', cost: 1200, category: 'accommodation' },
      { time: '17:00', title: 'Swim off the deck', description: 'A dip in the still lake as hornbills cross overhead.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 16, date: 'Jan 20', city: 'Khao Sok — Jungle & Caves',
    coverImage: img('1442548520776-20acf66617df', 1200, 500),
    coverAlt: 'A canoe drifting through a flooded rainforest gorge',
    transport: 'Park longtail & trek (฿0, incl.)',
    activities: [
      { time: '06:00', title: 'Dawn safari canoe', description: 'Drift silent past gibbons and langurs waking in the canopy.', cost: 0, category: 'attraction' },
      { time: '09:00', title: 'Nam Talu cave trek', description: 'Wade a river through a bat-filled cavern under the mountain.', cost: 400, category: 'attraction' },
      { time: '13:00', title: 'Raft-house Thai lunch', description: 'A home-style spread as the mist lifts off the water.', cost: 0, category: 'food' },
      { time: '16:00', title: 'Kayak the flooded forest', description: 'Paddle among drowned trees in a hidden inlet.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 17, date: 'Jan 21', city: 'Phuket — Old Town',
    coverImage: img('1504214208698-ea1916a2195a', 1200, 500),
    coverAlt: 'Pastel Sino-Portuguese shophouses in Phuket old town',
    transport: 'Van to Phuket (฿700)',
    activities: [
      { time: '09:00', title: 'Drive to the island', description: 'Out to Thailand\'s largest island and its historic tin-trading port.', cost: 700, category: 'transport' },
      { time: '12:00', title: 'Sino-Portuguese old town', description: 'Pastel shophouses and Peranakan mansions along Thalang Road.', cost: 0, category: 'attraction' },
      { time: '13:30', title: 'Hokkien mee lunch', description: 'The island\'s Chinese-Thai noodles in a century-old kopitiam.', cost: 120, category: 'food' },
      { time: '17:00', title: 'Old Phuket cafes & shrines', description: 'Chinese clan shrines and coffee down the heritage lanes.', cost: 80, category: 'attraction' },
    ],
  },
  {
    day: 18, date: 'Jan 22', city: 'Phuket — Big Buddha & Beaches',
    coverImage: img('1519915247718-1703f9c6bb15', 1200, 500),
    coverAlt: 'A giant white Buddha statue on a hilltop above the sea',
    transport: 'Scooter around the south (฿250)',
    activities: [
      { time: '08:00', title: 'The Big Buddha', description: 'A 45m marble Buddha on a hilltop with the whole island below.', cost: 0, category: 'attraction' },
      { time: '11:00', title: 'Kata & Karon beaches', description: 'Long golden sweeps of the Andaman west coast.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Beach-club seafood', description: 'Grilled barracuda and papaya salad feet-in-the-sand.', cost: 350, category: 'food' },
      { time: '17:30', title: 'Promthep Cape sunset', description: 'The classic viewpoint at the island\'s southern tip.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 19, date: 'Jan 23', city: 'Phang Nga — James Bond Bay',
    coverImage: img('1504214208698-ea1916a2195a', 1200, 500),
    coverAlt: 'A leaning limestone islet in the calm Phang Nga Bay',
    transport: 'Longtail into the bay (฿900)',
    activities: [
      { time: '08:00', title: 'Phang Nga Bay', description: 'Sheer karst towers rising from mirror-still emerald water.', cost: 900, category: 'transport' },
      { time: '10:00', title: 'James Bond Island', description: 'The needle of rock made famous by The Man with the Golden Gun.', cost: 0, category: 'attraction' },
      { time: '11:30', title: 'Sea-cave canoeing', description: 'Paddle low tunnels into hidden hongs open to the sky.', cost: 400, category: 'attraction' },
      { time: '13:00', title: 'Koh Panyee fishing village', description: 'A Muslim stilt village with a floating football pitch.', cost: 200, category: 'food' },
    ],
  },
  {
    day: 20, date: 'Jan 24', city: 'Koh Lanta — Slow Island',
    coverImage: img('1519915247718-1703f9c6bb15', 1200, 500),
    coverAlt: 'A quiet palm-backed beach at sunset on Koh Lanta',
    transport: 'Ferry to Koh Lanta (฿400)',
    activities: [
      { time: '09:00', title: 'Ferry down the coast', description: 'To the mellow, long-beached island loved for its slow pace.', cost: 400, category: 'transport' },
      { time: '13:00', title: 'Old Town stilt houses', description: 'A sleepy Chinese-Muslim port on the island\'s quiet east side.', cost: 0, category: 'attraction' },
      { time: '15:00', title: 'Mu Ko Lanta lighthouse', description: 'A national-park headland of jungle trails and monkeys.', cost: 200, category: 'attraction' },
      { time: '18:00', title: 'Sunset beach bar', description: 'A driftwood bar and a fire show as the sky burns.', cost: 250, category: 'food' },
    ],
  },
  {
    day: 21, date: 'Jan 25', city: 'Koh Lanta — Rok & Haa Reefs',
    coverImage: img('1504214208698-ea1916a2195a', 1200, 500),
    coverAlt: 'Snorkellers over bright coral in clear turquoise water',
    transport: 'Speedboat snorkel tour (฿1,500)',
    activities: [
      { time: '08:00', title: 'Koh Rok twin islands', description: 'Powder-white beaches and coral gardens in a marine park.', cost: 1500, category: 'transport' },
      { time: '10:30', title: 'Koh Haa lagoon', description: 'A ring of islets around a lagoon nicknamed the Cathedral.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Beach barbecue lunch', description: 'Grilled chicken and pineapple on a castaway sand spit.', cost: 0, category: 'food' },
      { time: '16:00', title: 'Snorkel with turtles', description: 'Green turtles grazing seagrass in the warm shallows.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 22, date: 'Jan 26', city: 'Koh Samui — Gulf Crossing',
    coverImage: img('1519915247718-1703f9c6bb15', 1200, 500),
    coverAlt: 'Coconut palms leaning over a Koh Samui beach',
    transport: 'Cross to the gulf coast (฿1,200)',
    activities: [
      { time: '07:00', title: 'Cross the peninsula', description: 'Overland and by ferry to the palm-shaggy gulf island of Samui.', cost: 1200, category: 'transport' },
      { time: '13:00', title: 'Big Buddha temple', description: 'A golden 12m Buddha on a causeway islet.', cost: 0, category: 'attraction' },
      { time: '15:00', title: 'Na Muang jungle falls', description: 'A purple-rock waterfall with a swimmable pool.', cost: 0, category: 'attraction' },
      { time: '18:00', title: 'Fisherman\'s Village', description: 'Old teak shophouses and a Friday walking-street market.', cost: 250, category: 'food' },
    ],
  },
  {
    day: 23, date: 'Jan 27', city: 'Ang Thong — Marine Park',
    coverImage: img('1442548520776-20acf66617df', 1200, 500),
    coverAlt: 'An emerald inland lagoon ringed by jungle cliffs',
    transport: 'Day boat to Ang Thong (฿1,600)',
    activities: [
      { time: '08:00', title: 'Ang Thong archipelago', description: 'Forty-two jungle-clad islands that inspired the novel The Beach.', cost: 1600, category: 'transport' },
      { time: '10:00', title: 'Emerald Lagoon viewpoint', description: 'Climb to the hidden inland sea-lake glowing green in the crater.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch aboard', description: 'A Thai spread on deck between the islands.', cost: 0, category: 'food' },
      { time: '15:00', title: 'Kayak the sea caves', description: 'Paddle beaches and grottoes no boat can reach.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 24, date: 'Jan 28', city: 'Koh Phangan — Hidden Coves',
    coverImage: img('1519915247718-1703f9c6bb15', 1200, 500),
    coverAlt: 'A secluded rocky cove with clear water on Koh Phangan',
    transport: 'Ferry to Koh Phangan (฿300)',
    activities: [
      { time: '09:00', title: 'Hop to Phangan', description: 'The greener, quieter neighbour of Samui by day.', cost: 300, category: 'transport' },
      { time: '11:00', title: 'Bottle Beach', description: 'A boat-only cove of clear water and jungle backdrop in the north.', cost: 200, category: 'attraction' },
      { time: '13:00', title: 'Thai seafood on the sand', description: 'Grilled squid and green curry at a beach shack.', cost: 250, category: 'food' },
      { time: '16:00', title: 'Than Sadet viewpoint', description: 'A royal waterfall stream tumbling to a headland lookout.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 25, date: 'Jan 29', city: 'Koh Tao — Dive Day',
    coverImage: img('1504214208698-ea1916a2195a', 1200, 500),
    coverAlt: 'A dive boat anchored over a coral reef off Koh Tao',
    transport: 'Ferry to Koh Tao (฿600)',
    activities: [
      { time: '08:00', title: 'Sail to Turtle Island', description: 'To the tiny dive mecca of the Gulf of Thailand.', cost: 600, category: 'transport' },
      { time: '11:00', title: 'Discover scuba dive', description: 'A guided first dive over the coral of Japanese Gardens.', cost: 2500, category: 'attraction' },
      { time: '14:00', title: 'Lunch at the pier', description: 'Massaman curry looking out over the anchored longtails.', cost: 180, category: 'food' },
      { time: '17:30', title: 'John-Suwan viewpoint', description: 'Climb between two bays for the classic hourglass panorama.', cost: 50, category: 'attraction' },
    ],
  },
  {
    day: 26, date: 'Jan 30', city: 'Koh Tao — Nang Yuan',
    coverImage: img('1519915247718-1703f9c6bb15', 1200, 500),
    coverAlt: 'Three islets joined by a white sandbar at Koh Nang Yuan',
    transport: 'Longtail to Nang Yuan (฿200)',
    activities: [
      { time: '08:00', title: 'Koh Nang Yuan', description: 'Three islets joined by a shimmering triple sandbar.', cost: 200, category: 'transport' },
      { time: '10:00', title: 'Snorkel the sandbar', description: 'Reef sharks and parrotfish in the gin-clear channel.', cost: 100, category: 'attraction' },
      { time: '13:00', title: 'Island lunch', description: 'Pad see ew above the turquoise cove.', cost: 150, category: 'food' },
      { time: '16:00', title: 'Freedive Sail Rock', description: 'A pinnacle dive famed for its swirling barracuda tornado.', cost: 1500, category: 'attraction' },
    ],
  },
  {
    day: 27, date: 'Jan 31', city: 'Hua Hin — Royal Coast',
    coverImage: img('1442548520776-20acf66617df', 1200, 500),
    coverAlt: 'A quaint wooden railway station on the Gulf of Thailand',
    transport: 'Ferry + coach to Hua Hin (฿800)',
    activities: [
      { time: '07:00', title: 'Back to the mainland', description: 'Across the gulf to the royal seaside town of Hua Hin.', cost: 800, category: 'transport' },
      { time: '13:00', title: 'Historic railway station', description: 'A quaint Thai-style royal waiting pavilion in cream and red.', cost: 0, category: 'attraction' },
      { time: '15:00', title: 'Phraya Nakhon cave', description: 'A golden royal pavilion lit by a shaft of light in a collapsed cave.', cost: 200, category: 'attraction' },
      { time: '18:00', title: 'Cicada night market', description: 'An arty seaside market of crafts, music, and street food.', cost: 250, category: 'food' },
    ],
  },
  {
    day: 28, date: 'Feb 1', city: 'Bangkok — Final City Day',
    coverImage: img('1510379872535-9310dc6fd6a7', 1200, 500),
    coverAlt: 'The glittering night skyline of central Bangkok',
    transport: 'Coach back to Bangkok (฿300)',
    activities: [
      { time: '09:00', title: 'Return to the capital', description: 'North to the great city for a last taste of the mainland.', cost: 300, category: 'transport' },
      { time: '13:00', title: 'Wat Pho reclining Buddha', description: 'The 46m gilded reclining Buddha and the home of Thai massage.', cost: 200, category: 'attraction' },
      { time: '15:00', title: 'Traditional Thai massage', description: 'An hour of firm stretching at the temple\'s famous school.', cost: 500, category: 'other' },
      { time: '19:00', title: 'Chao Phraya dinner cruise', description: 'Floodlit temples slide past over a last Thai feast.', cost: 900, category: 'food' },
    ],
  },
  {
    day: 29, date: 'Feb 2', city: 'Krabi — Return to the Andaman',
    coverImage: img('1504214208698-ea1916a2195a', 1200, 500),
    coverAlt: 'Longtail boats below karst cliffs on a Krabi beach',
    transport: 'Fly south to Krabi (฿1,400)',
    activities: [
      { time: '08:00', title: 'Fly back to the Andaman', description: 'South once more to the karst coast for the final leg.', cost: 1400, category: 'transport' },
      { time: '12:00', title: 'Ao Nang beachfront', description: 'A last lazy afternoon on the longtail-lined bay.', cost: 0, category: 'attraction' },
      { time: '15:00', title: 'Hot springs & Emerald Pool', description: 'A jungle waterfall spa and a glowing spring-fed pool.', cost: 300, category: 'attraction' },
      { time: '19:00', title: 'Night market feast', description: 'Roti, moo ping, and mango sticky rice by the pier.', cost: 200, category: 'food' },
    ],
  },
  {
    day: 30, date: 'Feb 3', city: 'Phi Phi — Farewell',
    coverImage: img('1519915247718-1703f9c6bb15', 1200, 500),
    coverAlt: 'A longtail boat moored below Phi Phi cliffs',
    transport: 'Ferry → Phi Phi + return (฿700)',
    activities: [
      { time: '08:00', title: 'Ferry to Ko Phi Phi', description: 'Out to the emerald islands of the Andaman on the morning boat.', cost: 700, category: 'transport' },
      { time: '10:00', title: 'Maya Bay & Pileh Lagoon', description: 'The film-famous cove and a hidden turquoise lagoon ringed by cliffs.', cost: 900, category: 'attraction' },
      { time: '13:00', title: 'Lunch on the sand', description: 'A last massaman curry with the sea at your feet.', cost: 250, category: 'food' },
      { time: '17:00', title: 'Return to Krabi', description: 'The ferry back through the karst-dotted sea at dusk.', cost: 0, category: 'transport' },
      { time: '20:00', title: 'Departure — la gòn', description: 'To the airport, salt-tanned and content. Until next time, Thailand.', cost: 400, category: 'transport' },
    ],
  },
]

// ─── Cambodia ──────────────────────────────────────────────────────────

const CAMBODIA_ITINERARY: Day[] = [
  {
    day: 1, date: 'Feb 2', city: 'Siem Reap — Arrival',
    coverImage: img('1602649306240-b9a8b17d12c6', 1200, 500),
    coverAlt: 'A carved sandstone temple tower at Angkor',
    transport: 'Airport tuk-tuk → town ($8)',
    activities: [
      { time: '14:00', title: 'Arrive Siem Reap', description: 'Land at the gateway to Angkor and buzz into town by tuk-tuk.', cost: 8, category: 'transport' },
      { time: '16:00', title: 'Angkor Pass & Angkor Wat sunset', description: 'First sight of the largest religious monument on earth in evening light.', cost: 37, category: 'attraction' },
      { time: '19:00', title: 'Khmer amok dinner', description: 'Fish steamed in banana leaf with coconut and kroeung spice paste.', cost: 12, category: 'food' },
      { time: '21:00', title: 'Pub Street & night market', description: 'The neon heart of Siem Reap — Angkor beers and silk stalls.', cost: 10, category: 'other' },
    ],
  },
  {
    day: 2, date: 'Feb 3', city: 'Angkor — Sunrise & Temples',
    coverImage: img('1504639650150-bf773680d8c3', 1200, 500),
    coverAlt: 'Silhouette of Angkor Wat towers at sunrise',
    transport: 'Private tuk-tuk day ($20)',
    activities: [
      { time: '05:00', title: 'Angkor Wat sunrise', description: 'The five towers mirrored in the reflecting pool as dawn breaks — the classic.', cost: 0, category: 'attraction' },
      { time: '08:30', title: 'Angkor Thom & the Bayon', description: 'The walled royal city and 200 giant serene faces carved in stone.', cost: 0, category: 'attraction' },
      { time: '11:00', title: 'Ta Prohm', description: 'The "Tomb Raider" temple, strangled and cradled by giant spung roots.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch — lok lak', description: 'Peppery stir-fried beef over rice with a lime-Kampot-pepper dip.', cost: 10, category: 'food' },
      { time: '16:00', title: 'Pre Rup at golden hour', description: 'Climb the laterite temple-mountain for the view over the jungle canopy.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 3, date: 'Feb 4', city: 'Angkor — Grand Circuit',
    coverImage: img('1722052179738-659a771b5ff2', 1200, 500),
    coverAlt: 'People crossing a green field near Angkor',
    transport: 'Tuk-tuk grand loop ($25)',
    activities: [
      { time: '07:00', title: 'Banteay Srei', description: 'The "Citadel of Women" — pink sandstone carved in astonishing fine detail.', cost: 0, category: 'attraction' },
      { time: '10:00', title: 'Preah Khan', description: 'A vast mossy monastery-temple, still half-swallowed by the forest.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch at a local kitchen', description: 'Kdam chaa — stir-fried crab with green Kampot peppercorns.', cost: 12, category: 'food' },
      { time: '15:30', title: 'Landmine Museum', description: 'A sobering, hopeful account of clearing Cambodia\'s buried legacy.', cost: 5, category: 'attraction' },
      { time: '18:00', title: 'Phare Cambodian Circus', description: 'Acrobatics and storytelling by youth from a social-enterprise arts school.', cost: 38, category: 'attraction' },
    ],
  },
  {
    day: 4, date: 'Feb 5', city: 'Beng Mealea — Jungle Temple',
    coverImage: img('1602642977157-b7c8b8003afd', 1200, 500),
    coverAlt: 'A collapsed Khmer temple swallowed by jungle vines',
    transport: 'Car east of Siem Reap ($30)',
    activities: [
      { time: '08:00', title: 'Beng Mealea', description: 'A vast, un-restored temple half-drowned in forest and toppled stone.', cost: 5, category: 'attraction' },
      { time: '11:00', title: 'Roluos Group', description: 'The 9th-century brick temples that predate Angkor itself.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch — num banh chok', description: 'Khmer rice noodles under a green fish curry with raw herbs.', cost: 4, category: 'food' },
      { time: '16:00', title: 'Kampong Khleang', description: 'The largest and least-touristed stilt village on the great lake.', cost: 15, category: 'attraction' },
    ],
  },
  {
    day: 5, date: 'Feb 6', city: 'Koh Ker — Pyramid in the Forest',
    coverImage: img('1602649306240-b9a8b17d12c6', 1200, 500),
    coverAlt: 'A stepped sandstone pyramid temple rising from the jungle',
    transport: 'Long day drive north ($40)',
    activities: [
      { time: '07:00', title: 'Drive to Koh Ker', description: 'North to a briefly-lived 10th-century capital deep in the forest.', cost: 40, category: 'transport' },
      { time: '10:00', title: 'Prasat Thom pyramid', description: 'Climb the seven-tier jungle pyramid for a canopy view.', cost: 15, category: 'attraction' },
      { time: '13:00', title: 'Picnic among the ruins', description: 'A packed Khmer lunch beside scattered lingas and lion statues.', cost: 5, category: 'food' },
      { time: '15:00', title: 'Preah Vihear foothills', description: 'A glimpse toward the cliff-top temple on the Thai border.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 6, date: 'Feb 7', city: 'Phnom Kulen — Sacred Mountain',
    coverImage: img('1722052179738-659a771b5ff2', 1200, 500),
    coverAlt: 'A jungle waterfall on the holy mountain of Phnom Kulen',
    transport: 'Mountain track by jeep ($25)',
    activities: [
      { time: '08:00', title: 'River of a Thousand Lingas', description: 'Carved yoni and lingas in the riverbed of the Khmer holy mountain.', cost: 20, category: 'attraction' },
      { time: '11:00', title: 'Kulen waterfall', description: 'A wide two-tier fall with a swim beneath the birthplace of empire.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Reclining Buddha shrine', description: 'A giant Buddha carved into a boulder atop the mountain.', cost: 0, category: 'attraction' },
      { time: '16:00', title: 'Village pepper farm', description: 'A taste of the countryside\'s vines on the way down.', cost: 5, category: 'food' },
    ],
  },
  {
    day: 7, date: 'Feb 8', city: 'Battambang — Bamboo Train',
    coverImage: img('1602642977157-b7c8b8003afd', 1200, 500),
    coverAlt: 'A bamboo platform train on a single railway track',
    transport: 'Road to Battambang ($20)',
    activities: [
      { time: '08:00', title: 'West to Battambang', description: 'To the graceful French-colonial town on the Sangker River.', cost: 20, category: 'transport' },
      { time: '13:00', title: 'The bamboo train (norry)', description: 'Rattle down a single warped rail on a bamboo platform at speed.', cost: 5, category: 'attraction' },
      { time: '15:00', title: 'Colonial shophouse walk', description: 'The best-preserved streetscape of old Cambodia.', cost: 0, category: 'attraction' },
      { time: '18:00', title: 'Riverside Khmer dinner', description: 'Grilled river fish and amok by the water.', cost: 10, category: 'food' },
    ],
  },
  {
    day: 8, date: 'Feb 9', city: 'Battambang — Bat Caves',
    coverImage: img('1722052179738-659a771b5ff2', 1200, 500),
    coverAlt: 'A dark stream of millions of bats leaving a limestone cave',
    transport: 'Tuk-tuk to Phnom Sampeau ($12)',
    activities: [
      { time: '08:00', title: 'Phnom Banan temple', description: 'A five-tower hilltop temple that prefigured Angkor Wat.', cost: 3, category: 'attraction' },
      { time: '11:00', title: 'Well of Shadows', description: 'A sombre Khmer Rouge killing cave on Phnom Sampeau.', cost: 3, category: 'attraction' },
      { time: '13:00', title: 'Lunch — kuy teav', description: 'A morning-style pork noodle soup at a roadside stall.', cost: 3, category: 'food' },
      { time: '17:30', title: 'Bat cave exodus', description: 'Millions of bats pour out in a ribbon against the sunset sky.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 9, date: 'Feb 10', city: 'Kampong Chhnang — Pottery & Water',
    coverImage: img('1653959864991-c828b72c82a8', 1200, 500),
    coverAlt: 'Fishing boats on a broad river at a Cambodian town',
    transport: 'River road south ($20)',
    activities: [
      { time: '08:00', title: 'Down toward the capital', description: 'Along the Tonle Sap plain toward Phnom Penh.', cost: 20, category: 'transport' },
      { time: '10:30', title: 'Andong Russey pottery village', description: 'Women coil-build red earthenware pots by hand, as for centuries.', cost: 2, category: 'attraction' },
      { time: '13:00', title: 'Floating-village boat', description: 'A Cham and Vietnamese water community moored on the river.', cost: 10, category: 'attraction' },
      { time: '16:00', title: 'Lunch — prahok ktis', description: 'A rich dip of fermented fish, pork, and coconut with crudites.', cost: 4, category: 'food' },
    ],
  },
  {
    day: 10, date: 'Feb 11', city: 'Phnom Penh — Royal Capital',
    coverImage: img('1602649306240-b9a8b17d12c6', 1200, 500),
    coverAlt: 'The golden spires of the Royal Palace in Phnom Penh',
    transport: 'Arrive the capital ($15)',
    activities: [
      { time: '09:00', title: 'Into Phnom Penh', description: 'The riverside capital where the Mekong meets the Tonle Sap.', cost: 15, category: 'transport' },
      { time: '11:00', title: 'Royal Palace & Silver Pagoda', description: 'A working royal residence and a floor of five thousand silver tiles.', cost: 10, category: 'attraction' },
      { time: '14:00', title: 'National Museum', description: 'The world\'s finest collection of Khmer sculpture in a red pavilion.', cost: 10, category: 'attraction' },
      { time: '18:00', title: 'Sisowath Quay sunset', description: 'A riverside stroll and a cold Angkor beer as the boats drift.', cost: 5, category: 'food' },
    ],
  },
  {
    day: 11, date: 'Feb 12', city: 'Phnom Penh — Remembrance',
    coverImage: img('1602642977157-b7c8b8003afd', 1200, 500),
    coverAlt: 'A memorial stupa at the Choeung Ek killing fields',
    transport: 'Tuk-tuk around the city ($12)',
    activities: [
      { time: '08:00', title: 'Tuol Sleng (S-21)', description: 'A former school turned Khmer Rouge prison, now a sobering museum.', cost: 5, category: 'attraction' },
      { time: '11:00', title: 'Choeung Ek', description: 'The killing fields memorial — a quiet, essential reckoning.', cost: 6, category: 'attraction' },
      { time: '13:30', title: 'Lunch — bai sach chrouk', description: 'Grilled pork over broken rice, the classic Khmer breakfast, any time.', cost: 3, category: 'food' },
      { time: '16:00', title: 'Wat Phnom', description: 'The temple-topped hill that gave the city its name.', cost: 1, category: 'attraction' },
    ],
  },
  {
    day: 12, date: 'Feb 13', city: 'Phnom Penh — Markets & River',
    coverImage: img('1602649306240-b9a8b17d12c6', 1200, 500),
    coverAlt: 'The domed art-deco Central Market of Phnom Penh',
    transport: 'Walking & tuk-tuk ($8)',
    activities: [
      { time: '08:00', title: 'Central Market (Psar Thmey)', description: 'A vast ochre art-deco dome of gold, gems, and fabric.', cost: 5, category: 'other' },
      { time: '11:00', title: 'Russian Market', description: 'A cramped warren of silk, silver, and street eats.', cost: 8, category: 'other' },
      { time: '13:00', title: 'Lunch — lort cha', description: 'Stir-fried short rice noodles with beef and a fried egg.', cost: 3, category: 'food' },
      { time: '17:00', title: 'Sunset river cruise', description: 'A slow boat to the confluence as the palace lights come on.', cost: 12, category: 'transport' },
    ],
  },
  {
    day: 13, date: 'Feb 14', city: 'Kampong Cham — Bamboo Bridge',
    coverImage: img('1653959864991-c828b72c82a8', 1200, 500),
    coverAlt: 'A long hand-built bamboo bridge across the Mekong',
    transport: 'Road up the Mekong ($15)',
    activities: [
      { time: '08:00', title: 'Up the Mekong', description: 'North along the great river to the old rubber-plantation town.', cost: 15, category: 'transport' },
      { time: '11:00', title: 'Koh Paen bamboo bridge', description: 'A hand-built bridge rebuilt every dry season to a river island.', cost: 1, category: 'attraction' },
      { time: '13:00', title: 'Lunch by the river', description: 'Fresh Mekong fish with a tamarind dip.', cost: 4, category: 'food' },
      { time: '16:00', title: 'Wat Nokor Bachey', description: 'A modern temple grown inside an 11th-century sandstone shell.', cost: 2, category: 'attraction' },
    ],
  },
  {
    day: 14, date: 'Feb 15', city: 'Kratie — River Dolphins',
    coverImage: img('1653959864991-c828b72c82a8', 1200, 500),
    coverAlt: 'Sunset over a calm stretch of the Mekong at Kratie',
    transport: 'Continue up the Mekong ($15)',
    activities: [
      { time: '08:00', title: 'Drive to Kratie', description: 'Further upriver to the languid town famed for its dolphins.', cost: 15, category: 'transport' },
      { time: '15:00', title: 'Irrawaddy dolphins at Kampi', description: 'A boat out to watch the rare freshwater dolphins surface.', cost: 9, category: 'attraction' },
      { time: '17:30', title: 'Mekong sunset viewpoint', description: 'The river turns to beaten gold behind the flooded forest.', cost: 0, category: 'attraction' },
      { time: '19:00', title: 'Riverfront dinner', description: 'Khmer red curry at a colonial-front eatery.', cost: 5, category: 'food' },
    ],
  },
  {
    day: 15, date: 'Feb 16', city: 'Koh Trong — Island Life',
    coverImage: img('1722052179738-659a771b5ff2', 1200, 500),
    coverAlt: 'A dirt path through green fields on a Mekong island',
    transport: 'Ferry to Koh Trong ($2)',
    activities: [
      { time: '08:00', title: 'Bicycle the river island', description: 'A slow loop of Koh Trong past pomelo groves and stilt homes.', cost: 3, category: 'attraction' },
      { time: '11:00', title: 'Floating Vietnamese village', description: 'A community of houseboats moored off the island\'s far shore.', cost: 5, category: 'attraction' },
      { time: '13:00', title: 'Homestay lunch', description: 'A family meal of grilled chicken and morning glory.', cost: 4, category: 'food' },
      { time: '16:00', title: 'Sandbar sunset', description: 'A seasonal beach emerges from the low river for a swim.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 16, date: 'Feb 17', city: 'Mondulkiri — Elephant Hills',
    coverImage: img('1722052179738-659a771b5ff2', 1200, 500),
    coverAlt: 'Rolling green hills and pine forest in eastern Cambodia',
    transport: 'Road east to the highlands ($30)',
    activities: [
      { time: '07:00', title: 'Into the eastern highlands', description: 'Up to the cool, rolling hills of the Bunong people.', cost: 30, category: 'transport' },
      { time: '13:00', title: 'Ethical elephant forest', description: 'Walk with retired logging elephants in the jungle — no riding.', cost: 50, category: 'attraction' },
      { time: '16:00', title: 'Forest river bathe', description: 'Help the elephants bathe in a cool stream.', cost: 0, category: 'attraction' },
      { time: '19:00', title: 'Highland lodge dinner', description: 'A fire and a hearty meal in the cool hills.', cost: 8, category: 'accommodation' },
    ],
  },
  {
    day: 17, date: 'Feb 18', city: 'Mondulkiri — Bou Sra Falls',
    coverImage: img('1722052179738-659a771b5ff2', 1200, 500),
    coverAlt: 'A powerful two-tier waterfall in a jungle gorge',
    transport: 'Motorbike to the falls ($15)',
    activities: [
      { time: '08:00', title: 'Bou Sra waterfall', description: 'Cambodia\'s mightiest fall, plunging in two great tiers.', cost: 3, category: 'attraction' },
      { time: '11:00', title: 'Bunong village visit', description: 'The indigenous highlanders\' animist traditions and weaving.', cost: 5, category: 'attraction' },
      { time: '13:00', title: 'Wild-honey & rice lunch', description: 'Forest-foraged flavours in a highland kitchen.', cost: 5, category: 'food' },
      { time: '16:00', title: 'Sea Forest viewpoint', description: 'Grasslands rolling like green waves to the horizon.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 18, date: 'Feb 19', city: 'Kampot — Pepper & River',
    coverImage: img('1653959864991-c828b72c82a8', 1200, 500),
    coverAlt: 'A sleepy river town with a colonial bridge at dusk',
    transport: 'Long drive south ($40)',
    activities: [
      { time: '06:00', title: 'Cross to the coast', description: 'A long day south to the dreamy riverside town of Kampot.', cost: 40, category: 'transport' },
      { time: '14:00', title: 'Pepper plantation', description: 'The world-famous Kampot peppercorn, ripening green on the vine.', cost: 5, category: 'attraction' },
      { time: '16:00', title: 'Salt fields', description: 'Shimmering pans where sea salt is raked in the flats.', cost: 0, category: 'attraction' },
      { time: '18:00', title: 'Sunset river cruise', description: 'Fireflies in the mangroves and karst behind the water.', cost: 8, category: 'transport' },
    ],
  },
  {
    day: 19, date: 'Feb 20', city: 'Kampot — Bokor Mountain',
    coverImage: img('1602642977157-b7c8b8003afd', 1200, 500),
    coverAlt: 'A misty abandoned hill station on a cloud-wrapped plateau',
    transport: 'Road up Bokor ($15)',
    activities: [
      { time: '08:00', title: 'Bokor Hill Station', description: 'A ghostly French resort and casino wrapped in mountain cloud.', cost: 0, category: 'attraction' },
      { time: '11:00', title: 'Old Catholic church ruin', description: 'A weathered chapel standing alone on the misty plateau.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch — Kampot crab', description: 'Fried crab with the region\'s green pepper, the coast\'s signature dish.', cost: 10, category: 'food' },
      { time: '16:00', title: 'Popokvil Falls', description: 'A two-stage waterfall on the cool mountaintop.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 20, date: 'Feb 21', city: 'Kep — Crab & Islands',
    coverImage: img('1653959864991-c828b72c82a8', 1200, 500),
    coverAlt: 'Wooden crab traps stacked at a seaside market',
    transport: 'Short hop to Kep ($8)',
    activities: [
      { time: '08:00', title: 'Kep crab market', description: 'Live blue crabs hauled straight from the sea into the wok.', cost: 10, category: 'food' },
      { time: '10:30', title: 'Rabbit Island boat', description: 'A slow ferry to a castaway beach of hammocks and shacks.', cost: 8, category: 'transport' },
      { time: '13:00', title: 'Beach seafood lunch', description: 'Grilled squid with lime-and-pepper dip on the sand.', cost: 6, category: 'food' },
      { time: '17:00', title: 'Kep national park loop', description: 'A jungle trail above the gulf as the sun drops.', cost: 1, category: 'attraction' },
    ],
  },
  {
    day: 21, date: 'Feb 22', city: 'Koh Rong — Island Crossing',
    coverImage: img('1653959864991-c828b72c82a8', 1200, 500),
    coverAlt: 'A brilliant white-sand beach and clear sea on Koh Rong',
    transport: 'Ferry from Sihanoukville ($25)',
    activities: [
      { time: '08:00', title: 'Ferry to Koh Rong', description: 'Out to Cambodia\'s largest island and its powder beaches.', cost: 25, category: 'transport' },
      { time: '12:00', title: 'Long Beach', description: 'Seven kilometres of squeaky white sand and turquoise water.', cost: 0, category: 'attraction' },
      { time: '14:00', title: 'Snorkel the reef', description: 'Coral and clownfish just off the palm-fringed shore.', cost: 10, category: 'attraction' },
      { time: '19:00', title: 'Beach barbecue', description: 'Grilled barracuda and a bonfire under the stars.', cost: 8, category: 'food' },
    ],
  },
  {
    day: 22, date: 'Feb 23', city: 'Koh Rong — Bioluminescence',
    coverImage: img('1653959864991-c828b72c82a8', 1200, 500),
    coverAlt: 'Glowing blue plankton in dark night water',
    transport: 'Longtail around the island ($10)',
    activities: [
      { time: '09:00', title: 'Jungle trek to Sok San', description: 'A forest crossing to a quieter fishing-village beach.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Island lunch', description: 'Khmer fish amok in a beach bamboo hut.', cost: 6, category: 'food' },
      { time: '16:00', title: 'Kayak the coast', description: 'Paddle hidden coves along the wild shoreline.', cost: 8, category: 'attraction' },
      { time: '20:00', title: 'Bioluminescent swim', description: 'Wade into the dark sea and watch the plankton flare blue.', cost: 5, category: 'attraction' },
    ],
  },
  {
    day: 23, date: 'Feb 24', city: 'Koh Rong Sanloem — Saracen Bay',
    coverImage: img('1653959864991-c828b72c82a8', 1200, 500),
    coverAlt: 'A curving palm-lined bay of calm turquoise water',
    transport: 'Boat to Sanloem ($6)',
    activities: [
      { time: '09:00', title: 'Cross to Sanloem', description: 'The mellower sister island and its perfect crescent bay.', cost: 6, category: 'transport' },
      { time: '11:00', title: 'Lazy Beach walk', description: 'A jungle path over the spine to a wild western cove.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Bay lunch', description: 'A last island seafood plate at the water\'s edge.', cost: 7, category: 'food' },
      { time: '17:00', title: 'Lighthouse sunset', description: 'Climb to the old lighthouse for the view over the gulf.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 24, date: 'Feb 25', city: 'Takeo — Angkor Borei',
    coverImage: img('1602642977157-b7c8b8003afd', 1200, 500),
    coverAlt: 'An ancient brick hilltop temple above flooded rice plains',
    transport: 'Ferry back + road ($30)',
    activities: [
      { time: '07:00', title: 'Return to the mainland', description: 'Ferry back and inland to the cradle of the Funan kingdom.', cost: 30, category: 'transport' },
      { time: '13:00', title: 'Angkor Borei by boat', description: 'A wet-season boat to the earliest Khmer city and its museum.', cost: 10, category: 'attraction' },
      { time: '15:00', title: 'Phnom Da temple', description: 'A 6th-century brick tower on a hill in the flood plain.', cost: 2, category: 'attraction' },
      { time: '18:00', title: 'Country dinner', description: 'Grilled river fish in a Takeo garden restaurant.', cost: 4, category: 'food' },
    ],
  },
  {
    day: 25, date: 'Feb 26', city: 'Sambor Prei Kuk — Pre-Angkor',
    coverImage: img('1602642977157-b7c8b8003afd', 1200, 500),
    coverAlt: 'Octagonal brick towers in a peaceful forest',
    transport: 'Drive north to Kompong Thom ($30)',
    activities: [
      { time: '07:00', title: 'North to Kompong Thom', description: 'Toward the forest temples that predate Angkor by centuries.', cost: 30, category: 'transport' },
      { time: '13:00', title: 'Sambor Prei Kuk', description: 'A UNESCO grove of octagonal 7th-century brick towers.', cost: 10, category: 'attraction' },
      { time: '15:30', title: 'Tree-hugged sanctuaries', description: 'Strangler figs cradling shrines in a quiet wood.', cost: 0, category: 'attraction' },
      { time: '18:00', title: 'Provincial-town dinner', description: 'Bai sach chrouk and iced coffee on the main street.', cost: 3, category: 'food' },
    ],
  },
  {
    day: 26, date: 'Feb 27', city: 'Kompong Thom — Countryside',
    coverImage: img('1722052179738-659a771b5ff2', 1200, 500),
    coverAlt: 'Rice paddies and sugar palms across the Cambodian plain',
    transport: 'Local roads ($15)',
    activities: [
      { time: '08:00', title: 'Phnom Santuk', description: 'Climb 800 steps to hillside shrines and reclining Buddhas.', cost: 2, category: 'attraction' },
      { time: '11:00', title: 'Stone-carving village', description: 'Sandstone Buddhas and lions chiselled at the roadside.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch — samlor korko', description: 'The "national soup" of many vegetables, fish, and toasted rice.', cost: 4, category: 'food' },
      { time: '16:00', title: 'Sugar-palm countryside', description: 'A walk past the fan palms that define the Cambodian plain.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 27, date: 'Feb 28', city: 'Siem Reap — Return to Angkor',
    coverImage: img('1602649306240-b9a8b17d12c6', 1200, 500),
    coverAlt: 'A quiet moss-covered temple gate at Angkor',
    transport: 'Drive back to Siem Reap ($20)',
    activities: [
      { time: '08:00', title: 'Back to Siem Reap', description: 'Close the loop to the temple town for the final days.', cost: 20, category: 'transport' },
      { time: '13:00', title: 'Neak Pean', description: 'A tiny island temple in a healing-pool baray, reached by walkway.', cost: 0, category: 'attraction' },
      { time: '15:00', title: 'Ta Som', description: 'A small quiet temple with a gate throttled by a fig tree.', cost: 0, category: 'attraction' },
      { time: '17:30', title: 'Pre Rup sunset', description: 'The laterite temple-mountain glowing over the paddies again.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 28, date: 'Mar 1', city: 'Angkor — Distant Temples',
    coverImage: img('1602649306240-b9a8b17d12c6', 1200, 500),
    coverAlt: 'Fine pink sandstone carvings of a Khmer temple',
    transport: 'Tuk-tuk day ($20)',
    activities: [
      { time: '07:00', title: 'Banteay Samre', description: 'A superbly carved, rarely-crowded temple east of the main group.', cost: 0, category: 'attraction' },
      { time: '10:00', title: 'East Mebon elephants', description: 'Stone elephants guard the corners of this island-temple.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch — fish amok', description: 'A final banana-leaf steamed curry near the temples.', cost: 6, category: 'food' },
      { time: '17:30', title: 'Phnom Bakheng sunset', description: 'The hilltop temple with a distant view of Angkor Wat\'s towers.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 29, date: 'Mar 2', city: 'Siem Reap — Town & Crafts',
    coverImage: img('1722052179738-659a771b5ff2', 1200, 500),
    coverAlt: 'A lively lantern-lit street in Siem Reap at night',
    transport: 'Walking & tuk-tuk ($8)',
    activities: [
      { time: '09:00', title: 'Angkor National Museum', description: 'Context for all you have seen, in a hall of a thousand Buddhas.', cost: 12, category: 'attraction' },
      { time: '11:30', title: 'Silk farm', description: 'The whole silk journey from mulberry worm to woven scarf.', cost: 5, category: 'attraction' },
      { time: '13:00', title: 'Lunch — beef lok lak', description: 'A last peppery Khmer plate over rice.', cost: 6, category: 'food' },
      { time: '18:00', title: 'Made in Cambodia market', description: 'Ethical crafts and a farewell drink on Pub Street.', cost: 10, category: 'other' },
    ],
  },
  {
    day: 30, date: 'Mar 3', city: 'Tonlé Sap — Floating Villages',
    coverImage: img('1653959864991-c828b72c82a8', 1200, 500),
    coverAlt: 'Sunset over the wide waters of Tonlé Sap',
    transport: 'Boat on the great lake ($20)',
    activities: [
      { time: '08:00', title: 'Kampong Phluk stilt village', description: 'Houses on 10m stilts above the seasonal flood of the great lake.', cost: 20, category: 'attraction' },
      { time: '10:00', title: 'Flooded forest paddle', description: 'A quiet row through the drowned mangroves in a wooden canoe.', cost: 8, category: 'attraction' },
      { time: '13:00', title: 'Lunch — fish & rice', description: 'The lake\'s freshwater catch, grilled simply by the shore.', cost: 8, category: 'food' },
      { time: '16:00', title: 'Artisans Angkor workshop', description: 'Watch silk weaving and stone carving revive old Khmer crafts.', cost: 0, category: 'other' },
      { time: '19:00', title: 'Farewell Khmer feast', description: 'A tasting of curries, prahok, and palm-sugar desserts. Chum reap lear.', cost: 18, category: 'food' },
    ],
  },
]

// ─── Laos ──────────────────────────────────────────────────────────────

const LAOS_ITINERARY: Day[] = [
  {
    day: 1, date: 'Feb 8', city: 'Luang Prabang — Old Town',
    coverImage: img('1628128573898-262b312f707e', 1200, 500),
    coverAlt: 'A boat on the Mekong near Luang Prabang',
    transport: 'Airport van → town (₭80,000)',
    activities: [
      { time: '13:00', title: 'Arrive Luang Prabang', description: 'Into the drowsy, gold-and-teak UNESCO town on the Mekong bend.', cost: 80000, category: 'transport' },
      { time: '15:00', title: 'Wat Xieng Thong', description: 'The finest temple in Laos, its roofs sweeping almost to the ground.', cost: 20000, category: 'attraction' },
      { time: '17:00', title: 'Mount Phousi sunset', description: 'Climb 328 steps for the view over the two rivers and the hills.', cost: 20000, category: 'attraction' },
      { time: '19:00', title: 'Night market & Lao dinner', description: 'A handicraft lane and a vegetarian buffet piled from a single bowl.', cost: 60000, category: 'food' },
    ],
  },
  {
    day: 2, date: 'Feb 9', city: 'Kuang Si Falls',
    coverImage: img('1745331568774-cc043277ac58', 1200, 500),
    coverAlt: 'Sunset over a lake and mountains in Laos',
    transport: 'Tuk-tuk to the falls (₭150,000)',
    activities: [
      { time: '06:00', title: 'Alms-giving ceremony', description: 'At dawn, a silent line of saffron monks receives sticky rice from kneeling locals.', cost: 30000, category: 'attraction' },
      { time: '09:00', title: 'Kuang Si Waterfalls', description: 'Tiered turquoise pools cascading through the jungle — swim in the lower ones.', cost: 40000, category: 'attraction' },
      { time: '11:00', title: 'Bear rescue sanctuary', description: 'Moon bears saved from bile farms, beside the falls trail.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch — laap & sticky rice', description: 'The minced-meat national dish, zingy with lime, mint, and toasted rice.', cost: 50000, category: 'food' },
      { time: '18:00', title: 'Mekong sunset cruise', description: 'A slow boat with a Beerlao as the river turns molten.', cost: 120000, category: 'transport' },
    ],
  },
  {
    day: 3, date: 'Feb 10', city: 'Luang Prabang — Palace & Crafts',
    coverImage: img('1628128573898-262b312f707e', 1200, 500),
    coverAlt: 'A golden temple roof in the old town of Luang Prabang',
    transport: 'On foot around the peninsula (₭0)',
    activities: [
      { time: '08:00', title: 'Royal Palace Museum', description: 'The last king\'s riverside residence and the golden Prabang Buddha.', cost: 30000, category: 'attraction' },
      { time: '10:30', title: 'Wat Mai & Wat Sensoukharam', description: 'Gilded facades and shimmering mosaic walls in the old quarter.', cost: 20000, category: 'attraction' },
      { time: '13:00', title: 'Lunch — or lam', description: 'A Luang Prabang stew of buffalo, eggplant, and peppery sakhan wood.', cost: 50000, category: 'food' },
      { time: '16:00', title: 'UXO visitor centre', description: 'The sobering story of the most-bombed country on earth.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 4, date: 'Feb 11', city: 'Luang Prabang — Rice & Weaving',
    coverImage: img('1633984814807-672768a6923d', 1200, 500),
    coverAlt: 'A weaver at a wooden loom with bright silk threads',
    transport: 'Tuk-tuk to the outskirts (₭80,000)',
    activities: [
      { time: '08:00', title: 'Living Land rice farm', description: 'Try all fourteen steps of rice growing behind a water buffalo.', cost: 250000, category: 'attraction' },
      { time: '11:00', title: 'Ock Pop Tok weaving centre', description: 'Watch natural-dye silk woven on the riverbank and try the loom.', cost: 100000, category: 'attraction' },
      { time: '13:30', title: 'Lunch by the Mekong', description: 'Grilled Mekong fish stuffed with lemongrass.', cost: 60000, category: 'food' },
      { time: '16:00', title: 'Ban Xang Khong paper village', description: 'Saa mulberry paper and more silk down a quiet river lane.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 5, date: 'Feb 12', city: 'Nong Khiaw — River Cliffs',
    coverImage: img('1651670221939-2396cc2295c1', 1200, 500),
    coverAlt: 'Sheer limestone cliffs rising above a village on a river',
    transport: 'Boat up the Nam Ou (₭200,000)',
    activities: [
      { time: '08:00', title: 'Up the Nam Ou', description: 'A slow boat north through dramatic karst to Nong Khiaw.', cost: 200000, category: 'transport' },
      { time: '13:00', title: 'Riverside noodle lunch', description: 'Khao piak sen, soft rice noodles in a chicken broth.', cost: 40000, category: 'food' },
      { time: '15:00', title: 'Pha Daeng Peak viewpoint', description: 'A steep sweaty climb to a jaw-dropping bend of the river below.', cost: 20000, category: 'attraction' },
      { time: '18:00', title: 'Sunset on the bridge', description: 'The cliffs glow pink over the still water.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 6, date: 'Feb 13', city: 'Muang Ngoi — Riverside Village',
    coverImage: img('1628128573898-262b312f707e', 1200, 500),
    coverAlt: 'A tranquil car-free village on a bend of the Nam Ou',
    transport: 'Longboat further upriver (₭100,000)',
    activities: [
      { time: '09:00', title: 'Boat to Muang Ngoi', description: 'To a car-free village reached only by the river.', cost: 100000, category: 'transport' },
      { time: '11:00', title: 'Tham Kang cave', description: 'A wartime shelter cave with a stream through the rice fields.', cost: 20000, category: 'attraction' },
      { time: '13:00', title: 'Village lunch', description: 'Sticky rice, jeow bong chilli paste, and river weed.', cost: 40000, category: 'food' },
      { time: '17:30', title: 'Hammock over the river', description: 'Nothing to do but watch the water and the buffalo cross.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 7, date: 'Feb 14', city: 'Nong Khiaw — Hundred Waterfalls',
    coverImage: img('1745331568774-cc043277ac58', 1200, 500),
    coverAlt: 'A guide climbing beside a chain of small jungle waterfalls',
    transport: 'Boat + guided trek (₭150,000)',
    activities: [
      { time: '08:00', title: '100 Waterfalls trek', description: 'Climb straight up a staircase of countless cascades in the jungle.', cost: 300000, category: 'attraction' },
      { time: '13:00', title: 'Picnic in the forest', description: 'A packed lunch beside a pool halfway up the falls.', cost: 0, category: 'food' },
      { time: '15:30', title: 'Khmu village walk', description: 'Pass through a highland village on the way back down.', cost: 0, category: 'attraction' },
      { time: '19:00', title: 'Lao BBQ dinner', description: 'Sindad, a table-top grill-and-hotpot, back in Nong Khiaw.', cost: 60000, category: 'food' },
    ],
  },
  {
    day: 8, date: 'Feb 15', city: 'Phonsavan — Plain of Jars',
    coverImage: img('1745331568774-cc043277ac58', 1200, 500),
    coverAlt: 'Ancient stone jars scattered across a grassy plateau',
    transport: 'Mountain road to Xieng Khouang (₭250,000)',
    activities: [
      { time: '07:00', title: 'Drive to the plateau', description: 'A winding highland road to the mysterious plain of jars.', cost: 250000, category: 'transport' },
      { time: '13:00', title: 'Jar Site 1', description: 'Hundreds of giant stone jars up to 2,000 years old, purpose unknown.', cost: 25000, category: 'attraction' },
      { time: '15:30', title: 'Cratered landscape', description: 'Bomb craters still pock the fields beside the ancient jars.', cost: 0, category: 'attraction' },
      { time: '18:00', title: 'Local dinner', description: 'Larb and sticky rice in the quiet frontier town.', cost: 45000, category: 'food' },
    ],
  },
  {
    day: 9, date: 'Feb 16', city: 'Phonsavan — Secret War',
    coverImage: img('1633984814807-672768a6923d', 1200, 500),
    coverAlt: 'A grassy field with stone jars under a wide sky',
    transport: 'Local guide day (₭200,000)',
    activities: [
      { time: '08:00', title: 'Jar Sites 2 & 3', description: 'Quieter hilltop clusters of jars among the pines and paddies.', cost: 25000, category: 'attraction' },
      { time: '11:00', title: 'MAG bomb-clearance centre', description: 'How teams still clear millions of unexploded bomblets.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch — khao poon', description: 'A coconut-red rice-vermicelli soup, a Lao favourite.', cost: 40000, category: 'food' },
      { time: '15:00', title: 'Spoon village (Ban Napia)', description: 'Aluminium from war scrap melted into spoons and bracelets.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 10, date: 'Feb 17', city: 'Vang Vieng — Karst Country',
    coverImage: img('1745331568774-cc043277ac58', 1200, 500),
    coverAlt: 'Jagged limestone peaks rising behind a lazy river',
    transport: 'Scenic road south (₭300,000)',
    activities: [
      { time: '07:00', title: 'Drive to Vang Vieng', description: 'South to the surreal karst spires on the Nam Song.', cost: 300000, category: 'transport' },
      { time: '13:00', title: 'Blue Lagoon 1 & Tham Phu Kham', description: 'A jade swimming hole below a cave with a reclining Buddha.', cost: 30000, category: 'attraction' },
      { time: '16:00', title: 'Nam Xay viewpoint', description: 'Climb to the famous motorbike-on-a-cliff photo over the valley.', cost: 20000, category: 'attraction' },
      { time: '19:00', title: 'Riverside dinner', description: 'Wood-fired pizza and Beerlao as the karsts fade to black.', cost: 60000, category: 'food' },
    ],
  },
  {
    day: 11, date: 'Feb 18', city: 'Vang Vieng — Caves & Lagoons',
    coverImage: img('1745331568774-cc043277ac58', 1200, 500),
    coverAlt: 'Inner tubes floating on a calm river through karst hills',
    transport: 'Scooter loop (₭100,000)',
    activities: [
      { time: '08:00', title: 'Tham Chang cave', description: 'A lit cavern above a spring with a valley view from its mouth.', cost: 25000, category: 'attraction' },
      { time: '11:00', title: 'Kaeng Nyui waterfall', description: 'A forest fall reached on a short, pretty trail.', cost: 20000, category: 'attraction' },
      { time: '13:00', title: 'Lunch — ping pa', description: 'Whole grilled fish stuffed with lemongrass and herbs.', cost: 50000, category: 'food' },
      { time: '16:00', title: 'Tubing the Nam Song', description: 'Drift the river on an inner tube beneath the peaks.', cost: 60000, category: 'attraction' },
    ],
  },
  {
    day: 12, date: 'Feb 19', city: 'Vang Vieng — Balloon & Sky',
    coverImage: img('1745331568774-cc043277ac58', 1200, 500),
    coverAlt: 'A hot-air balloon drifting over misty karst at dawn',
    transport: 'Kayak transfer (₭80,000)',
    activities: [
      { time: '05:30', title: 'Sunrise hot-air balloon', description: 'Float above the mist-filled karst valley as the sun comes up.', cost: 900000, category: 'attraction' },
      { time: '09:00', title: 'Kayak the Nam Song', description: 'Paddle downstream through the spires with a cave stop.', cost: 150000, category: 'attraction' },
      { time: '13:00', title: 'Lunch on the bank', description: 'Sticky rice and grilled chicken by the river.', cost: 45000, category: 'food' },
      { time: '17:30', title: 'Pha Ngern sunset climb', description: 'A steep ridge with a 360-degree view of the whole valley.', cost: 20000, category: 'attraction' },
    ],
  },
  {
    day: 13, date: 'Feb 20', city: 'Vientiane — Riverside Capital',
    coverImage: img('1628128573898-262b312f707e', 1200, 500),
    coverAlt: 'A golden stupa gleaming under a blue sky in Vientiane',
    transport: 'Fast train to Vientiane (₭200,000)',
    activities: [
      { time: '08:00', title: 'Ride the new fast train', description: 'The China-Laos railway sweeps you south to the capital.', cost: 200000, category: 'transport' },
      { time: '13:00', title: 'Pha That Luang', description: 'The great gilded stupa, the national symbol of Laos.', cost: 30000, category: 'attraction' },
      { time: '15:30', title: 'Patuxai victory gate', description: 'A Lao arc de triomphe built, they say, from runway concrete.', cost: 20000, category: 'attraction' },
      { time: '18:00', title: 'Mekong sunset promenade', description: 'The riverside night market with Thailand across the water.', cost: 50000, category: 'food' },
    ],
  },
  {
    day: 14, date: 'Feb 21', city: 'Vientiane — Temples & COPE',
    coverImage: img('1628128573898-262b312f707e', 1200, 500),
    coverAlt: 'An ornate temple cloister lined with Buddha images',
    transport: 'Walking & tuk-tuk (₭80,000)',
    activities: [
      { time: '08:00', title: 'Wat Sisaket', description: 'A cloister of thousands of tiny Buddhas, the oldest temple in town.', cost: 30000, category: 'attraction' },
      { time: '10:00', title: 'Haw Phra Kaew', description: 'The former home of the Emerald Buddha, now a museum.', cost: 30000, category: 'attraction' },
      { time: '13:00', title: 'Lunch — Lao coffee & baguette', description: 'A French-Lao hybrid: strong coffee and a filled baguette.', cost: 40000, category: 'food' },
      { time: '15:00', title: 'COPE visitor centre', description: 'Prosthetics and the ongoing legacy of cluster bombs.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 15, date: 'Feb 22', city: 'Vientiane — Buddha Park',
    coverImage: img('1633984814807-672768a6923d', 1200, 500),
    coverAlt: 'Surreal concrete Buddhist and Hindu statues in a park',
    transport: 'Bus along the river (₭50,000)',
    activities: [
      { time: '08:00', title: 'Xieng Khuan Buddha Park', description: 'A field of eccentric concrete deities beside the Mekong.', cost: 30000, category: 'attraction' },
      { time: '11:00', title: 'Climb the pumpkin dome', description: 'Enter the giant sphere through a demon\'s mouth for a rooftop view.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch — tam mak hoong', description: 'The fiery Lao green-papaya salad with fermented crab.', cost: 40000, category: 'food' },
      { time: '16:00', title: 'Talat Sao morning market', description: 'Silver, silk, and textiles in the old capital market.', cost: 0, category: 'other' },
    ],
  },
  {
    day: 16, date: 'Feb 23', city: 'Thakhek — Loop Beginnings',
    coverImage: img('1651670221939-2396cc2295c1', 1200, 500),
    coverAlt: 'A quiet Mekong town square with faded colonial buildings',
    transport: 'Bus south to Thakhek (₭150,000)',
    activities: [
      { time: '08:00', title: 'South down the Mekong', description: 'To the sleepy river town that starts the famous motorbike loop.', cost: 150000, category: 'transport' },
      { time: '14:00', title: 'Buddha Cave (Tham Pha)', description: 'A cliff cave where 229 bronze Buddhas were found in 2004.', cost: 20000, category: 'attraction' },
      { time: '16:00', title: 'Blue lagoons', description: 'Spring-fed pools of impossible turquoise in the limestone.', cost: 20000, category: 'attraction' },
      { time: '18:00', title: 'Riverside dinner', description: 'Mok pa, fish steamed in banana leaf with dill.', cost: 50000, category: 'food' },
    ],
  },
  {
    day: 17, date: 'Feb 24', city: 'Kong Lor — River Cave',
    coverImage: img('1745331568774-cc043277ac58', 1200, 500),
    coverAlt: 'A longtail boat entering the black mouth of a huge cave',
    transport: 'Drive the loop east (₭200,000)',
    activities: [
      { time: '08:00', title: 'Into the loop', description: 'East through karst country toward the great river cave.', cost: 200000, category: 'transport' },
      { time: '13:00', title: 'Kong Lor Cave', description: 'A 7km boat ride through a pitch-black river tunnel under a mountain.', cost: 100000, category: 'attraction' },
      { time: '15:30', title: 'Emerge the far side', description: 'Sunlight and jungle at the cave\'s hidden downstream mouth.', cost: 0, category: 'attraction' },
      { time: '18:00', title: 'Village guesthouse', description: 'A simple family stay under the karst wall.', cost: 300000, category: 'accommodation' },
    ],
  },
  {
    day: 18, date: 'Feb 25', city: 'Thakhek Loop — Caves & Cliffs',
    coverImage: img('1745331568774-cc043277ac58', 1200, 500),
    coverAlt: 'A winding road through dramatic limestone mountains',
    transport: 'Motorbike loop (₭0)',
    activities: [
      { time: '08:00', title: 'Cool the loop road', description: 'Ride past reservoirs of drowned dead trees and towering karst.', cost: 0, category: 'transport' },
      { time: '11:00', title: 'Tham Nang Aen cave', description: 'A vast lit cavern of stalactites near the road.', cost: 20000, category: 'attraction' },
      { time: '13:00', title: 'Roadside noodle stop', description: 'Foe, the Lao rice-noodle soup, at a village stall.', cost: 40000, category: 'food' },
      { time: '17:00', title: 'Return to Thakhek', description: 'Close the loop as the light softens over the Mekong.', cost: 0, category: 'transport' },
    ],
  },
  {
    day: 19, date: 'Feb 26', city: 'Savannakhet — Colonial Calm',
    coverImage: img('1651670221939-2396cc2295c1', 1200, 500),
    coverAlt: 'Peeling French-colonial shophouses on a quiet square',
    transport: 'Bus further south (₭120,000)',
    activities: [
      { time: '08:00', title: 'Down to Savannakhet', description: 'A faded French-Indochina town on the Thai border.', cost: 120000, category: 'transport' },
      { time: '13:00', title: 'Old town square', description: 'Crumbling ochre villas around a dusty central plaza.', cost: 0, category: 'attraction' },
      { time: '15:00', title: 'Dinosaur museum', description: 'Fossils dug from the surrounding plains in a quirky little hall.', cost: 20000, category: 'attraction' },
      { time: '18:00', title: 'That Ing Hang stupa', description: 'A revered 16th-century stupa lit for the evening.', cost: 20000, category: 'attraction' },
    ],
  },
  {
    day: 20, date: 'Feb 27', city: 'Pakse — Gateway South',
    coverImage: img('1628128573898-262b312f707e', 1200, 500),
    coverAlt: 'The confluence of two rivers at the town of Pakse',
    transport: 'Bus to Pakse (₭130,000)',
    activities: [
      { time: '08:00', title: 'Continue to Pakse', description: 'The hub of the deep south where the Xe Don meets the Mekong.', cost: 130000, category: 'transport' },
      { time: '13:00', title: 'Wat Phou Salao', description: 'A golden Buddha on a hill with a view over the rivers.', cost: 0, category: 'attraction' },
      { time: '15:00', title: 'Dao Heuang market', description: 'Coffee, tea, and produce of the plateau piled high.', cost: 0, category: 'other' },
      { time: '18:00', title: 'Lunch — khao piak', description: 'A comforting bowl of hand-cut rice noodles.', cost: 40000, category: 'food' },
    ],
  },
  {
    day: 21, date: 'Feb 28', city: 'Champasak — Wat Phou',
    coverImage: img('1651670221939-2396cc2295c1', 1200, 500),
    coverAlt: 'A ruined Khmer temple on a hillside above a plain',
    transport: 'Boat & road to Champasak (₭100,000)',
    activities: [
      { time: '08:00', title: 'Down to Champasak', description: 'To the pre-Angkorian Khmer heartland of southern Laos.', cost: 100000, category: 'transport' },
      { time: '10:00', title: 'Wat Phou', description: 'A UNESCO Khmer temple climbing a holy mountain, older than Angkor Wat.', cost: 50000, category: 'attraction' },
      { time: '13:00', title: 'Lunch in the old town', description: 'Lao-French fare in a colonial guesthouse garden.', cost: 50000, category: 'food' },
      { time: '16:00', title: 'Riverside villas walk', description: 'Faded mansions of the old royal line of Champasak.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 22, date: 'Mar 1', city: 'Bolaven — Coffee Plateau',
    coverImage: img('1745331568774-cc043277ac58', 1200, 500),
    coverAlt: 'A tall waterfall plunging off a green highland plateau',
    transport: 'Climb the plateau (₭200,000)',
    activities: [
      { time: '08:00', title: 'Up the Bolaven', description: 'Into the cool volcanic highlands famed for coffee.', cost: 200000, category: 'transport' },
      { time: '11:00', title: 'Tad Fane twin falls', description: 'Two ribbons plunging 120m into a jungle gorge.', cost: 20000, category: 'attraction' },
      { time: '13:00', title: 'Coffee-farm tasting', description: 'Arabica and robusta grown in the rich basalt soil.', cost: 40000, category: 'food' },
      { time: '16:00', title: 'Tad Yuang waterfall', description: 'Walk behind the curtain of a wide, easy-to-reach fall.', cost: 20000, category: 'attraction' },
    ],
  },
  {
    day: 23, date: 'Mar 2', city: 'Bolaven — Tad Lo Villages',
    coverImage: img('1633984814807-672768a6923d', 1200, 500),
    coverAlt: 'A gentle waterfall beside a laid-back village',
    transport: 'Loop across the plateau (₭150,000)',
    activities: [
      { time: '08:00', title: 'Cross to Tad Lo', description: 'The plateau\'s mellow waterfall village of the Katu people.', cost: 150000, category: 'transport' },
      { time: '11:00', title: 'Katu weaving village', description: 'Ikat textiles and coffee among the ethnic hamlets.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Village lunch', description: 'Bamboo-steamed sticky rice and jeow.', cost: 40000, category: 'food' },
      { time: '16:30', title: 'Tad Lo falls sunset', description: 'Three cascades by the guesthouses where buffalo cool off.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 24, date: 'Mar 3', city: 'Si Phan Don — 4000 Islands',
    coverImage: img('1651670221939-2396cc2295c1', 1200, 500),
    coverAlt: 'Hammocks strung between palms over a wide calm Mekong',
    transport: 'Bus + boat to Don Det (₭150,000)',
    activities: [
      { time: '08:00', title: 'South to the islands', description: 'Where the Mekong braids into thousands of channels and islets.', cost: 150000, category: 'transport' },
      { time: '13:00', title: 'Settle on Don Det', description: 'A hammock, a river view, and nowhere to be.', cost: 300000, category: 'accommodation' },
      { time: '15:00', title: 'Bicycle the island', description: 'Pedal past paddies and old French railway relics.', cost: 30000, category: 'attraction' },
      { time: '18:00', title: 'Riverside sunset', description: 'A Beerlao as the widest reach of the Mekong turns gold.', cost: 40000, category: 'food' },
    ],
  },
  {
    day: 25, date: 'Mar 4', city: 'Don Khon — Falls & Dolphins',
    coverImage: img('1651670221939-2396cc2295c1', 1200, 500),
    coverAlt: 'A raging waterfall on a wide stretch of the Mekong',
    transport: 'Bicycle across the old bridge (₭0)',
    activities: [
      { time: '08:00', title: 'French railway bridge', description: 'Cross to Don Khon on the only railway the French built in Laos.', cost: 30000, category: 'attraction' },
      { time: '10:00', title: 'Li Phi (Somphamit) falls', description: 'A furious churn of white water through the rocks.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch — fried river weed', description: 'Kaipen, crisp Mekong weed with sesame, and grilled fish.', cost: 40000, category: 'food' },
      { time: '16:00', title: 'Irrawaddy dolphin boat', description: 'A boat to the deep pool where rare dolphins surface at dusk.', cost: 80000, category: 'attraction' },
    ],
  },
  {
    day: 26, date: 'Mar 5', city: 'Khone Phapheng — The Great Falls',
    coverImage: img('1745331568774-cc043277ac58', 1200, 500),
    coverAlt: 'A vast wall of thundering water across a river',
    transport: 'Boat & road to the falls (₭100,000)',
    activities: [
      { time: '08:00', title: 'Khone Phapheng', description: 'The largest waterfall by volume in Southeast Asia, a wall of thunder.', cost: 55000, category: 'attraction' },
      { time: '11:00', title: 'Viewpoint decks', description: 'Boardwalks over the roaring channels the French could never tame.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch by the water', description: 'Grilled fish with the roar of the falls behind you.', cost: 45000, category: 'food' },
      { time: '16:00', title: 'Return to Don Det', description: 'A last slow boat back to the hammock islands.', cost: 40000, category: 'transport' },
    ],
  },
  {
    day: 27, date: 'Mar 6', city: 'Don Det — Slow River Day',
    coverImage: img('1651670221939-2396cc2295c1', 1200, 500),
    coverAlt: 'A kayak on a glassy channel of the 4000 islands',
    transport: 'Kayak the channels (₭120,000)',
    activities: [
      { time: '08:00', title: 'Kayak the 4000 Islands', description: 'Paddle the maze of channels between palm-tufted islets.', cost: 120000, category: 'attraction' },
      { time: '12:00', title: 'Sandbank picnic', description: 'A packed lunch on an emerging river beach.', cost: 40000, category: 'food' },
      { time: '15:00', title: 'Island loop cycle', description: 'A final lazy ride past rice paddies and water buffalo.', cost: 30000, category: 'attraction' },
      { time: '18:00', title: 'Hammock sunset', description: 'The south\'s last golden hour over the braided river.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 28, date: 'Mar 7', city: 'Return North — Luang Prabang',
    coverImage: img('1628128573898-262b312f707e', 1200, 500),
    coverAlt: 'A small propeller plane on a runway in the Lao hills',
    transport: 'Fly Pakse → Luang Prabang (₭1,500,000)',
    activities: [
      { time: '07:00', title: 'Boat & drive to Pakse', description: 'Back up the river and road to the southern airport.', cost: 150000, category: 'transport' },
      { time: '12:00', title: 'Fly north', description: 'A short hop back over the mountains to Luang Prabang.', cost: 1500000, category: 'transport' },
      { time: '16:00', title: 'Mount Phousi again', description: 'The 328 steps for a farewell view over the two rivers.', cost: 20000, category: 'attraction' },
      { time: '19:00', title: 'Night-market buffet', description: 'The famous pile-it-high vegetarian bowl one more time.', cost: 60000, category: 'food' },
    ],
  },
  {
    day: 29, date: 'Mar 8', city: 'Luang Prabang — Last Rituals',
    coverImage: img('1628128573898-262b312f707e', 1200, 500),
    coverAlt: 'Saffron-robed monks receiving alms at dawn',
    transport: 'On foot around town (₭0)',
    activities: [
      { time: '05:30', title: 'Alms-giving at dawn', description: 'Kneel to offer sticky rice to the silent line of monks once more.', cost: 30000, category: 'attraction' },
      { time: '08:00', title: 'Morning market', description: 'Buffalo skin, river weed, and jungle greens at the local market.', cost: 0, category: 'other' },
      { time: '13:00', title: 'Lunch — khao soi Luang Prabang', description: 'The northern tomato-pork noodle soup, distinct from its Thai cousin.', cost: 45000, category: 'food' },
      { time: '16:00', title: 'TAEC textile museum', description: 'The weavings and stories of Laos\'s many highland peoples.', cost: 25000, category: 'attraction' },
    ],
  },
  {
    day: 30, date: 'Mar 9', city: 'Pak Ou & Farewell',
    coverImage: img('1651670221939-2396cc2295c1', 1200, 500),
    coverAlt: 'Wooden boats moored on the riverbank in Laos',
    transport: 'Longboat up the Mekong (₭200,000)',
    activities: [
      { time: '08:00', title: 'Pak Ou Caves', description: 'Two river cliffs stuffed with thousands of retired Buddha statues.', cost: 30000, category: 'attraction' },
      { time: '10:00', title: 'Whisky village stop', description: 'Riverside Ban Xang Hai, where lao-lao rice spirit is distilled.', cost: 20000, category: 'other' },
      { time: '13:00', title: 'Khao soi Luang Prabang', description: 'The northern noodle soup, distinct from its Thai namesake.', cost: 45000, category: 'food' },
      { time: '15:00', title: 'TAEC textile museum', description: 'The weavings and stories of Laos\'s many highland peoples.', cost: 25000, category: 'attraction' },
      { time: '18:00', title: 'Departure — la kon', description: 'A last riverside coffee before the flight out. Farewell, Laos.', cost: 80000, category: 'transport' },
    ],
  },
]

// ─── Indonesia (Bali) ────────────────────────────────────────────────────

const INDONESIA_ITINERARY: Day[] = [
  {
    day: 1, date: 'Mar 4', city: 'Ubud — Rice & Ritual',
    coverImage: img('1559628233-eb1b1a45564b', 1200, 500),
    coverAlt: 'Aerial view of Bali rice terraces',
    transport: 'Airport car → Ubud (Rp350,000)',
    activities: [
      { time: '13:00', title: 'Arrive Denpasar', description: 'Land on the Island of the Gods and drive up into the green heart at Ubud.', cost: 350000, category: 'transport' },
      { time: '16:00', title: 'Tegalalang rice terraces', description: 'The famous emerald staircase carved by the ancient subak water system.', cost: 50000, category: 'attraction' },
      { time: '18:00', title: 'Sacred Monkey Forest', description: 'Mossy temples and long-tailed macaques in a jungle ravine.', cost: 80000, category: 'attraction' },
      { time: '20:00', title: 'Dinner — babi guling', description: 'Balinese spit-roast suckling pig with sambal and crackling.', cost: 90000, category: 'food' },
    ],
  },
  {
    day: 2, date: 'Mar 5', city: 'Ubud — Temples & Volcano',
    coverImage: img('1682406187130-84561b4e0e78', 1200, 500),
    coverAlt: 'Lush palm-covered hillside in Bali',
    transport: 'Private driver day (Rp600,000)',
    activities: [
      { time: '04:00', title: 'Mount Batur sunrise trek', description: 'Hike an active volcano by torchlight to breakfast eggs cooked in steam.', cost: 500000, category: 'attraction' },
      { time: '10:00', title: 'Tirta Empul holy springs', description: 'Purify in the bubbling spouts of the sacred water temple.', cost: 50000, category: 'attraction' },
      { time: '13:00', title: 'Lunch — nasi campur', description: 'A "mixed rice" plate of satay, tempeh, greens, and sambal matah.', cost: 70000, category: 'food' },
      { time: '16:00', title: 'Campuhan Ridge walk', description: 'A breezy grass spine between two river valleys at golden hour.', cost: 0, category: 'attraction' },
      { time: '19:30', title: 'Legong dance at the palace', description: 'Gamelan and gilded costume in the Ubud royal courtyard.', cost: 100000, category: 'attraction' },
    ],
  },
  {
    day: 3, date: 'Mar 6', city: 'Uluwatu — Cliffs & Surf',
    coverImage: img('1557093793-e196ae071479', 1200, 500),
    coverAlt: 'Green mountain scenery in Bali',
    transport: 'Transfer to the Bukit (Rp450,000)',
    activities: [
      { time: '09:00', title: 'Drive to the south cliffs', description: 'Down to the limestone peninsula of surf breaks and clifftop temples.', cost: 450000, category: 'transport' },
      { time: '11:00', title: 'Padang Padang beach', description: 'A tiny cove reached through a cleft in the rock, framed by turquoise surf.', cost: 25000, category: 'attraction' },
      { time: '13:00', title: 'Seafood at a warung', description: 'Grilled snapper and morning-glory greens above the waves.', cost: 100000, category: 'food' },
      { time: '17:30', title: 'Uluwatu Temple & Kecak', description: 'A sea-cliff temple and the fire-lit chanting Kecak dance at sunset.', cost: 150000, category: 'attraction' },
      { time: '20:00', title: 'Single Fin sundowners', description: 'A clifftop bar over the famous left-hand break.', cost: 120000, category: 'food' },
    ],
  },
  {
    day: 4, date: 'Mar 7', city: 'Sidemen — East Bali Valley',
    coverImage: img('1559628233-eb1b1a45564b', 1200, 500),
    coverAlt: 'A lush rice valley beneath a volcano in east Bali',
    transport: 'Driver to Sidemen (Rp400,000)',
    activities: [
      { time: '09:00', title: 'Drive to Sidemen', description: 'East to a green rice valley under Mount Agung, the old Bali.', cost: 400000, category: 'transport' },
      { time: '12:00', title: 'Rice-terrace walk', description: 'A gentle trek between paddies and palm groves off the tourist trail.', cost: 0, category: 'attraction' },
      { time: '14:00', title: 'Songket weaving', description: 'Watch the gold-threaded ceremonial silk woven by hand.', cost: 50000, category: 'attraction' },
      { time: '18:00', title: 'Valley-view dinner', description: 'Nasi campur on a terrace as the volcano catches the last light.', cost: 90000, category: 'food' },
    ],
  },
  {
    day: 5, date: 'Mar 8', city: 'Amed — Coast & Wreck',
    coverImage: img('1557093793-e196ae071479', 1200, 500),
    coverAlt: 'Black-sand beach with jukung fishing boats in east Bali',
    transport: 'Coast road to Amed (Rp300,000)',
    activities: [
      { time: '08:00', title: 'Down to the coast', description: 'To the black-sand fishing coast of far east Bali.', cost: 300000, category: 'transport' },
      { time: '10:00', title: 'USAT Liberty wreck dive', description: 'Snorkel or dive a WWII wreck a few strokes off Tulamben beach.', cost: 500000, category: 'attraction' },
      { time: '13:00', title: 'Lunch — sate lilit', description: 'Minced-fish satay pressed on lemongrass sticks.', cost: 80000, category: 'food' },
      { time: '17:00', title: 'Jemeluk Bay sunset', description: 'Traditional jukung boats lined on the sand below the hills.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 6, date: 'Mar 9', city: 'Lempuyang — Gate of Heaven',
    coverImage: img('1682406187130-84561b4e0e78', 1200, 500),
    coverAlt: 'A split temple gate framing a distant volcano',
    transport: 'Mountain temple drive (Rp350,000)',
    activities: [
      { time: '06:00', title: 'Lempuyang Gates of Heaven', description: 'The split gate framing Mount Agung, an early start beats the queue.', cost: 100000, category: 'attraction' },
      { time: '10:00', title: 'Tirta Gangga water palace', description: 'A royal garden of stepping-stone ponds and fountains.', cost: 50000, category: 'attraction' },
      { time: '13:00', title: 'Lunch — betutu duck', description: 'Duck slow-cooked all day in banana leaf with jungle spices.', cost: 120000, category: 'food' },
      { time: '16:00', title: 'Taman Ujung', description: 'A serene floating water palace of the last Karangasem king.', cost: 50000, category: 'attraction' },
    ],
  },
  {
    day: 7, date: 'Mar 10', city: 'Gili Trawangan — Island Escape',
    coverImage: img('1555400038-63f5ba517a47', 1200, 500),
    coverAlt: 'A car-free white-sand island with clear turquoise water',
    transport: 'Fast boat to the Gilis (Rp500,000)',
    activities: [
      { time: '08:00', title: 'Fast boat to the Gilis', description: 'Across to the car-free island trio off Lombok.', cost: 500000, category: 'transport' },
      { time: '12:00', title: 'Cycle the island', description: 'A one-hour loop of the whole sandy, motor-free island.', cost: 50000, category: 'attraction' },
      { time: '14:00', title: 'Snorkel with turtles', description: 'Green turtles grazing in the shallows off the east shore.', cost: 150000, category: 'attraction' },
      { time: '18:00', title: 'Swing-over-the-sea sunset', description: 'The famous beach swings as the sky burns behind Bali\'s Agung.', cost: 100000, category: 'food' },
    ],
  },
  {
    day: 8, date: 'Mar 11', city: 'Gili Air — Reef & Rest',
    coverImage: img('1555400038-63f5ba517a47', 1200, 500),
    coverAlt: 'A hammock over shallow clear water at a small island',
    transport: 'Local boat between Gilis (Rp85,000)',
    activities: [
      { time: '08:00', title: 'Hop to Gili Air', description: 'The quietest, most local of the three islands.', cost: 85000, category: 'transport' },
      { time: '10:00', title: 'Glass-bottom reef tour', description: 'Coral gardens and turtles between the three islands.', cost: 250000, category: 'attraction' },
      { time: '13:00', title: 'Beach-shack lunch', description: 'Grilled snapper with sambal matah, feet in the sand.', cost: 90000, category: 'food' },
      { time: '17:00', title: 'Hammock sunset', description: 'A last still evening before returning to the mainland.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 9, date: 'Mar 12', city: 'Kuta Lombok — Southern Beaches',
    coverImage: img('1557093793-e196ae071479', 1200, 500),
    coverAlt: 'Rolling green headlands above an empty Lombok beach',
    transport: 'Boat + car to south Lombok (Rp400,000)',
    activities: [
      { time: '08:00', title: 'Cross to Lombok', description: 'To the wild, surf-blessed south coast of Bali\'s bigger neighbour.', cost: 400000, category: 'transport' },
      { time: '12:00', title: 'Tanjung Aan beach', description: 'A double bay of pepper-grain sand between green headlands.', cost: 20000, category: 'attraction' },
      { time: '14:00', title: 'Merese Hill viewpoint', description: 'Walk the grassy ridge above the turquoise coves.', cost: 0, category: 'attraction' },
      { time: '18:00', title: 'Lunch — ayam taliwang', description: 'Lombok\'s fiery grilled chicken with water-spinach greens.', cost: 70000, category: 'food' },
    ],
  },
  {
    day: 10, date: 'Mar 13', city: 'Tetebatu — Sasak Highlands',
    coverImage: img('1559628233-eb1b1a45564b', 1200, 500),
    coverAlt: 'Emerald rice terraces on the slopes below a volcano',
    transport: 'Drive up Rinjani\'s skirts (Rp300,000)',
    activities: [
      { time: '08:00', title: 'Into the highlands', description: 'Up the green flank of Rinjani to a cool rice-terrace village.', cost: 300000, category: 'transport' },
      { time: '11:00', title: 'Sasak village visit', description: 'Thatched rice barns and back-strap weaving in a traditional hamlet.', cost: 30000, category: 'attraction' },
      { time: '13:00', title: 'Lunch — nasi balap', description: 'A Lombok rice plate with shredded spiced chicken and beans.', cost: 50000, category: 'food' },
      { time: '15:30', title: 'Monkey-forest waterfall', description: 'A short jungle walk to a fall through the black-monkey woods.', cost: 30000, category: 'attraction' },
    ],
  },
  {
    day: 11, date: 'Mar 14', city: 'Sembalun — Rinjani Foot',
    coverImage: img('1557093793-e196ae071479', 1200, 500),
    coverAlt: 'A high green valley beneath the cone of a volcano',
    transport: 'Mountain road to Sembalun (Rp250,000)',
    activities: [
      { time: '08:00', title: 'Sembalun valley', description: 'A high garlic-and-strawberry valley at the foot of Rinjani.', cost: 250000, category: 'transport' },
      { time: '11:00', title: 'Bukit Selong viewpoint', description: 'Patchwork fields spread below the volcano from a little hill.', cost: 20000, category: 'attraction' },
      { time: '13:00', title: 'Highland lunch', description: 'Grilled corn and sweet strawberries from the valley farms.', cost: 60000, category: 'food' },
      { time: '16:00', title: 'Pusuk Sembalun', description: 'A pine-ridge lookout over the whole eastern range.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 12, date: 'Mar 15', city: 'Labuan Bajo — Flores Gateway',
    coverImage: img('1555400038-63f5ba517a47', 1200, 500),
    coverAlt: 'A harbour of phinisi boats below dry green hills',
    transport: 'Fly to Labuan Bajo (Rp900,000)',
    activities: [
      { time: '08:00', title: 'Fly east to Flores', description: 'Over the Lesser Sundas to the gateway of Komodo.', cost: 900000, category: 'transport' },
      { time: '13:00', title: 'Harbour & market', description: 'A frontier port of dive boats, fishermen, and traders.', cost: 0, category: 'attraction' },
      { time: '16:00', title: 'Bukit Cinta sunset', description: 'A hill over the island-scattered bay as the sun sinks.', cost: 20000, category: 'attraction' },
      { time: '19:00', title: 'Grilled-fish dinner', description: 'The day\'s catch at the night market on the waterfront.', cost: 100000, category: 'food' },
    ],
  },
  {
    day: 13, date: 'Mar 16', city: 'Komodo — Dragons & Reefs',
    coverImage: img('1557093793-e196ae071479', 1200, 500),
    coverAlt: 'A Komodo dragon on a dry savannah island',
    transport: 'Day boat to the park (Rp1,200,000)',
    activities: [
      { time: '06:00', title: 'Boat to Rinca Island', description: 'Into Komodo National Park at first light.', cost: 1200000, category: 'transport' },
      { time: '08:30', title: 'Trek with the dragons', description: 'A ranger-led walk among the giant monitor lizards.', cost: 150000, category: 'attraction' },
      { time: '12:00', title: 'Snorkel at Kelor', description: 'Vivid coral and reef fish in the current-swept channels.', cost: 0, category: 'attraction' },
      { time: '15:00', title: 'Kalong flying-fox island', description: 'Wait for thousands of giant fruit bats to lift off at dusk.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 14, date: 'Mar 17', city: 'Komodo — Padar & Pink Beach',
    coverImage: img('1555400038-63f5ba517a47', 1200, 500),
    coverAlt: 'The famous three-bay view from Padar Island',
    transport: 'Overnight phinisi (Rp1,500,000)',
    activities: [
      { time: '05:00', title: 'Padar Island sunrise', description: 'Climb to the iconic ridge over three crescent bays of different sand.', cost: 100000, category: 'attraction' },
      { time: '09:00', title: 'Pink Beach', description: 'Sand blushed rose by red coral, over a rainbow reef.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch aboard', description: 'A seafood spread on the deck of a wooden phinisi.', cost: 0, category: 'food' },
      { time: '15:00', title: 'Manta Point snorkel', description: 'Drift over giant manta rays feeding in the channel.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 15, date: 'Mar 18', city: 'Flores — Road to Wae Rebo',
    coverImage: img('1557093793-e196ae071479', 1200, 500),
    coverAlt: 'A winding mountain road through the green hills of Flores',
    transport: 'Cross-Flores drive (Rp600,000)',
    activities: [
      { time: '07:00', title: 'Trans-Flores highway', description: 'A serpentine drive east through rice terraces and coffee hills.', cost: 600000, category: 'transport' },
      { time: '11:00', title: 'Cancar spiderweb fields', description: 'Rice paddies laid out in radial "lingko" webs from above.', cost: 30000, category: 'attraction' },
      { time: '13:00', title: 'Ruteng town lunch', description: 'A highland market meal of rice, greens, and local coffee.', cost: 60000, category: 'food' },
      { time: '16:00', title: 'Trek to Denge trailhead', description: 'Reach the village where the Wae Rebo path begins.', cost: 0, category: 'transport' },
    ],
  },
  {
    day: 16, date: 'Mar 19', city: 'Wae Rebo — Village Above Clouds',
    coverImage: img('1682406187130-84561b4e0e78', 1200, 500),
    coverAlt: 'Conical thatched houses in a mist-ringed mountain village',
    transport: 'Three-hour jungle trek (Rp0)',
    activities: [
      { time: '07:00', title: 'Trek up to Wae Rebo', description: 'A steep forest climb to a village of seven conical Mbaru Niang houses.', cost: 350000, category: 'attraction' },
      { time: '11:00', title: 'Welcome ceremony', description: 'The elders welcome guests in the drum house with betel and coffee.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Village lunch', description: 'A shared meal of rice and garden vegetables in the clouds.', cost: 0, category: 'food' },
      { time: '18:00', title: 'Night among the cones', description: 'Sleep in a traditional house under a canopy of stars.', cost: 400000, category: 'accommodation' },
    ],
  },
  {
    day: 17, date: 'Mar 20', city: 'Kelimutu — Coloured Lakes',
    coverImage: img('1557093793-d149a38a1be8', 1200, 500),
    coverAlt: 'Three crater lakes of different colours on a volcano',
    transport: 'Descend & drive east (Rp700,000)',
    activities: [
      { time: '06:00', title: 'Trek down to Denge', description: 'Back down the mountain and onward east across Flores.', cost: 700000, category: 'transport' },
      { time: '14:00', title: 'Reach Moni village', description: 'A cool mountain hamlet at the foot of sacred Kelimutu.', cost: 0, category: 'attraction' },
      { time: '16:00', title: 'Hot springs & waterfall', description: 'A soak in a natural spring after the long road.', cost: 20000, category: 'attraction' },
      { time: '19:00', title: 'Flores coffee dinner', description: 'Home-cooked rice and the region\'s renowned coffee.', cost: 60000, category: 'food' },
    ],
  },
  {
    day: 18, date: 'Mar 21', city: 'Kelimutu — Sunrise Craters',
    coverImage: img('1557093793-d149a38a1be8', 1200, 500),
    coverAlt: 'Turquoise and dark crater lakes side by side at dawn',
    transport: 'Pre-dawn climb (Rp150,000)',
    activities: [
      { time: '04:00', title: 'Kelimutu sunrise', description: 'Climb to the rim where three crater lakes glow in shifting colours.', cost: 150000, category: 'attraction' },
      { time: '08:00', title: 'Sit with the lakes', description: 'Locals believe the souls of the dead rest in these waters.', cost: 0, category: 'attraction' },
      { time: '11:00', title: 'Traditional Ende village', description: 'Megalithic stones and ikat weaving on the way down.', cost: 30000, category: 'attraction' },
      { time: '18:00', title: 'Ende coast dinner', description: 'Grilled fish where Sukarno was once exiled.', cost: 70000, category: 'food' },
    ],
  },
  {
    day: 19, date: 'Mar 22', city: 'Yogyakarta — Heart of Java',
    coverImage: img('1682406187130-84561b4e0e78', 1200, 500),
    coverAlt: 'A busy street of the Javanese cultural city of Yogyakarta',
    transport: 'Fly to Yogyakarta (Rp1,100,000)',
    activities: [
      { time: '08:00', title: 'Fly west to Java', description: 'To the soul of Javanese art, the sultanate of Yogyakarta.', cost: 1100000, category: 'transport' },
      { time: '13:00', title: 'The Kraton palace', description: 'The living sultan\'s court, with gamelan and shadow-puppet tradition.', cost: 15000, category: 'attraction' },
      { time: '15:00', title: 'Taman Sari water castle', description: 'The sultan\'s pleasure garden of bathing pools and tunnels.', cost: 15000, category: 'attraction' },
      { time: '19:00', title: 'Malioboro street food', description: 'Gudeg, sweet jackfruit stew, down the famous shopping street.', cost: 40000, category: 'food' },
    ],
  },
  {
    day: 20, date: 'Mar 23', city: 'Borobudur — Sunrise Temple',
    coverImage: img('1682406187130-84561b4e0e78', 1200, 500),
    coverAlt: 'Stupas of Borobudur silhouetted against a misty dawn',
    transport: 'Pre-dawn drive to the temple (Rp250,000)',
    activities: [
      { time: '04:30', title: 'Borobudur at dawn', description: 'The world\'s largest Buddhist monument emerging from the morning mist.', cost: 460000, category: 'attraction' },
      { time: '08:00', title: 'The relief galleries', description: 'Walk 2,600 carved panels spiralling up the mandala terraces.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch — ayam goreng', description: 'Javanese fried chicken with sambal and fresh lalapan.', cost: 50000, category: 'food' },
      { time: '16:00', title: 'Mendut & Pawon temples', description: 'Two smaller temples aligned with Borobudur along the plain.', cost: 25000, category: 'attraction' },
    ],
  },
  {
    day: 21, date: 'Mar 24', city: 'Prambanan — Hindu Spires',
    coverImage: img('1682406187130-84561b4e0e78', 1200, 500),
    coverAlt: 'The tall Hindu temple spires of Prambanan at sunset',
    transport: 'Local car (Rp200,000)',
    activities: [
      { time: '08:00', title: 'Prambanan temple', description: 'Soaring 9th-century Hindu spires dedicated to Shiva.', cost: 400000, category: 'attraction' },
      { time: '11:00', title: 'Ratu Boko palace', description: 'A hilltop royal ruin with a view back to the temple towers.', cost: 250000, category: 'attraction' },
      { time: '13:00', title: 'Lunch — bakmi jawa', description: 'Javanese noodles cooked over a charcoal flame.', cost: 40000, category: 'food' },
      { time: '19:30', title: 'Ramayana ballet', description: 'The epic danced with gamelan under the floodlit spires.', cost: 200000, category: 'attraction' },
    ],
  },
  {
    day: 22, date: 'Mar 25', city: 'Yogyakarta — Batik & Merapi',
    coverImage: img('1557093793-e196ae071479', 1200, 500),
    coverAlt: 'Jeeps on the volcanic slopes of Mount Merapi',
    transport: 'Jeep tour (Rp350,000)',
    activities: [
      { time: '06:00', title: 'Merapi lava jeep', description: 'Bounce across the ash fields of Java\'s most active volcano.', cost: 350000, category: 'attraction' },
      { time: '10:00', title: 'Batik workshop', description: 'Draw hot wax on cloth in the craft that defines the city.', cost: 100000, category: 'attraction' },
      { time: '13:00', title: 'Lunch — gudeg Yu Djum', description: 'The definitive plate of the city\'s beloved jackfruit stew.', cost: 45000, category: 'food' },
      { time: '16:00', title: 'Kotagede silver quarter', description: 'The old capital\'s lanes of fine filigree silverwork.', cost: 0, category: 'other' },
    ],
  },
  {
    day: 23, date: 'Mar 26', city: 'Mount Bromo — Sea of Sand',
    coverImage: img('1557093793-d149a38a1be8', 1200, 500),
    coverAlt: 'A smoking volcanic cone in a vast caldera of ash',
    transport: 'Train + jeep to Bromo (Rp600,000)',
    activities: [
      { time: '07:00', title: 'East to the volcanoes', description: 'Train and jeep to the Tengger caldera of East Java.', cost: 600000, category: 'transport' },
      { time: '15:00', title: 'The Sea of Sand', description: 'A moonscape of grey ash ringing the smoking cone.', cost: 320000, category: 'attraction' },
      { time: '16:30', title: 'Pura Luhur Poten', description: 'A lone Hindu temple of the Tengger people on the ash plain.', cost: 0, category: 'attraction' },
      { time: '19:00', title: 'Crater-rim guesthouse', description: 'A cold night at altitude before the dawn climb.', cost: 500000, category: 'accommodation' },
    ],
  },
  {
    day: 24, date: 'Mar 27', city: 'Bromo — Sunrise & Crater',
    coverImage: img('1557093793-d149a38a1be8', 1200, 500),
    coverAlt: 'Volcanic peaks glowing above a sea of cloud at sunrise',
    transport: 'Dawn jeep (Rp0, incl.)',
    activities: [
      { time: '03:30', title: 'Penanjakan sunrise', description: 'The classic viewpoint over the cones floating in a sea of cloud.', cost: 0, category: 'attraction' },
      { time: '06:00', title: 'Climb Bromo crater', description: 'Up the 250 steps to peer into the sulphur-belching vent.', cost: 0, category: 'attraction' },
      { time: '10:00', title: 'Whispering-sand crossing', description: 'Ride back across the caldera floor as the mist lifts.', cost: 0, category: 'transport' },
      { time: '18:00', title: 'Drive to Ijen', description: 'On east to the base of the next great volcano.', cost: 400000, category: 'transport' },
    ],
  },
  {
    day: 25, date: 'Mar 28', city: 'Ijen — Blue Fire Crater',
    coverImage: img('1557093793-d149a38a1be8', 1200, 500),
    coverAlt: 'Electric-blue flames of burning sulphur in a dark crater',
    transport: 'Midnight trek (Rp150,000)',
    activities: [
      { time: '01:00', title: 'Ijen blue-fire hike', description: 'A dark climb to the eerie electric-blue flames of burning sulphur.', cost: 150000, category: 'attraction' },
      { time: '05:00', title: 'Turquoise crater lake', description: 'Dawn reveals the world\'s largest acid lake, an unreal turquoise.', cost: 0, category: 'attraction' },
      { time: '06:00', title: 'Sulphur miners', description: 'Meet the men who haul 80kg baskets of yellow rock from the vent.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch — rujak soto', description: 'A Banyuwangi mash-up of salad and beef-tripe soup.', cost: 40000, category: 'food' },
    ],
  },
  {
    day: 26, date: 'Mar 29', city: 'Jakarta — The Capital',
    coverImage: img('1682406187130-84561b4e0e78', 1200, 500),
    coverAlt: 'The skyline of Jakarta with the National Monument',
    transport: 'Fly to Jakarta (Rp1,000,000)',
    activities: [
      { time: '08:00', title: 'Fly to the megacity', description: 'West to the sprawling capital of the archipelago.', cost: 1000000, category: 'transport' },
      { time: '13:00', title: 'National Monument (Monas)', description: 'The flame-topped obelisk of independence, with a city view.', cost: 20000, category: 'attraction' },
      { time: '15:00', title: 'Istiqlal & the cathedral', description: 'Southeast Asia\'s largest mosque facing a cathedral across the road.', cost: 0, category: 'attraction' },
      { time: '19:00', title: 'Dinner — soto betawi', description: 'A creamy Jakarta beef soup rich with coconut.', cost: 70000, category: 'food' },
    ],
  },
  {
    day: 27, date: 'Mar 30', city: 'Jakarta — Old Batavia',
    coverImage: img('1682406187130-84561b4e0e78', 1200, 500),
    coverAlt: 'Dutch-colonial buildings around a square in old Jakarta',
    transport: 'Commuter rail & walking (Rp30,000)',
    activities: [
      { time: '08:00', title: 'Kota Tua old town', description: 'The faded Dutch colonial heart of Batavia around Fatahillah Square.', cost: 0, category: 'attraction' },
      { time: '10:00', title: 'Jakarta History Museum', description: 'The old city hall telling four centuries of the port city.', cost: 10000, category: 'attraction' },
      { time: '13:00', title: 'Glodok Chinatown lunch', description: 'Bakmi and kopi in the winding lanes of old Chinatown.', cost: 50000, category: 'food' },
      { time: '16:00', title: 'Sunda Kelapa harbour', description: 'Wooden pinisi schooners still loading at the old spice port.', cost: 10000, category: 'attraction' },
    ],
  },
  {
    day: 28, date: 'Mar 31', city: 'Back to Bali — Canggu',
    coverImage: img('1559628233-eb1b1a45564b', 1200, 500),
    coverAlt: 'Surfers on a black-sand Bali beach at sunset',
    transport: 'Fly back to Bali (Rp900,000)',
    activities: [
      { time: '08:00', title: 'Fly back to Bali', description: 'Return to the Island of the Gods for the final days.', cost: 900000, category: 'transport' },
      { time: '13:00', title: 'Canggu rice-paddy cafes', description: 'Smoothie bowls and surf culture in the trendy west.', cost: 90000, category: 'food' },
      { time: '16:00', title: 'Learn to surf at Batu Bolong', description: 'A mellow beach break perfect for a lesson.', cost: 200000, category: 'attraction' },
      { time: '18:30', title: 'Echo Beach sunset', description: 'Cold Bintang on the black sand as the surfers come in.', cost: 60000, category: 'food' },
    ],
  },
  {
    day: 29, date: 'Apr 1', city: 'Bali — Tanah Lot & Temples',
    coverImage: img('1682406187130-84561b4e0e78', 1200, 500),
    coverAlt: 'A sea temple on a rock at sunset in Bali',
    transport: 'West-coast driver (Rp400,000)',
    activities: [
      { time: '09:00', title: 'Taman Ayun temple', description: 'A serene royal water temple with a moat and tiered meru shrines.', cost: 30000, category: 'attraction' },
      { time: '12:00', title: 'Jatiluwih rice terraces', description: 'The UNESCO subak terraces rolling to the horizon.', cost: 50000, category: 'attraction' },
      { time: '14:00', title: 'Lunch — bebek goreng', description: 'Crispy fried duck over a terrace of green paddies.', cost: 100000, category: 'food' },
      { time: '17:30', title: 'Tanah Lot sunset', description: 'The famous sea temple silhouetted on its rock at low tide.', cost: 60000, category: 'attraction' },
    ],
  },
  {
    day: 30, date: 'Apr 2', city: 'Nusa Penida — Farewell',
    coverImage: img('1555400038-63f5ba517a47', 1200, 500),
    coverAlt: 'Green rice field in Indonesia',
    transport: 'Fast boat to Nusa Penida (Rp300,000)',
    activities: [
      { time: '07:00', title: 'Speedboat to Nusa Penida', description: 'A half-hour crossing to the wild island off Bali\'s southeast.', cost: 300000, category: 'transport' },
      { time: '09:00', title: 'Kelingking Beach viewpoint', description: 'The T-Rex cliff plunging to a hidden white-sand cove — Bali\'s iconic shot.', cost: 50000, category: 'attraction' },
      { time: '11:00', title: 'Angel\'s Billabong & Broken Beach', description: 'A natural infinity pool and a sea arch carved in the cliff.', cost: 25000, category: 'attraction' },
      { time: '13:00', title: 'Island lunch', description: 'Mie goreng with a cold young coconut, feet in the sand.', cost: 60000, category: 'food' },
      { time: '17:00', title: 'Return & departure — sampai jumpa', description: 'Boat back for the flight out. Terima kasih, Indonesia.', cost: 300000, category: 'transport' },
    ],
  },
]

// ─── Singapore ─────────────────────────────────────────────────────────

const SINGAPORE_ITINERARY: Day[] = [
  {
    day: 1, date: 'Mar 10', city: 'Marina Bay & Gardens',
    coverImage: img('1525625293386-3f8f99389edd', 1200, 500),
    coverAlt: 'Marina Bay Sands reflected in the bay at dusk',
    transport: 'MRT from Changi (S$2.50)',
    activities: [
      { time: '13:00', title: 'Arrive Changi Airport', description: 'Land at the world\'s best airport — the indoor Rain Vortex waterfall welcomes you.', cost: 3, category: 'transport' },
      { time: '15:00', title: 'Gardens by the Bay', description: 'The Supertree Grove and cool-mist Cloud Forest dome.', cost: 53, category: 'attraction' },
      { time: '18:00', title: 'Marina Bay Sands SkyPark', description: 'Up to the ship-shaped deck for the whole glittering skyline.', cost: 32, category: 'attraction' },
      { time: '19:45', title: 'Spectra light & water show', description: 'A free nightly show dancing across the bay.', cost: 0, category: 'attraction' },
      { time: '20:30', title: 'Chilli crab at a seafood hall', description: 'The messy national dish, mopped up with fried mantou buns.', cost: 60, category: 'food' },
    ],
  },
  {
    day: 2, date: 'Mar 11', city: 'Neighbourhoods & Hawkers',
    coverImage: img('1496939376851-89342e90adcd', 1200, 500),
    coverAlt: 'The Singapore riverfront and skyline',
    transport: 'MRT day pass (S$10)',
    activities: [
      { time: '08:00', title: 'Kaya toast breakfast', description: 'Coconut-jam toast, soft eggs, and kopi at an old kopitiam.', cost: 6, category: 'food' },
      { time: '10:00', title: 'Chinatown & Sri Mariamman', description: 'A Buddhist tooth relic temple and the oldest Hindu temple in the city.', cost: 0, category: 'attraction' },
      { time: '12:30', title: 'Maxwell Hawker Centre', description: 'Michelin-starred chicken rice in a food-court institution.', cost: 8, category: 'food' },
      { time: '15:00', title: 'Kampong Glam & Haji Lane', description: 'The Sultan Mosque, Arab Street textiles, and a mural-splashed alley.', cost: 0, category: 'other' },
      { time: '17:00', title: 'Little India & Tekka', description: 'Garland stalls, spice shops, and a banana-leaf thali.', cost: 12, category: 'food' },
      { time: '20:00', title: 'Singapore Sling at Raffles', description: 'The gin cocktail born at the Long Bar, peanut shells on the floor.', cost: 40, category: 'food' },
    ],
  },
  {
    day: 3, date: 'Mar 12', city: 'Civic District — Colonial Core',
    coverImage: img('1496939376851-89342e90adcd', 1200, 500),
    coverAlt: 'Colonial civic buildings beside the Singapore River',
    transport: 'MRT & walking (S$4)',
    activities: [
      { time: '09:00', title: 'National Museum of Singapore', description: 'The nation\'s story from fishing village to global city in a glass rotunda.', cost: 15, category: 'attraction' },
      { time: '12:00', title: 'Lunch — Hainanese curry rice', description: 'A heritage plate of pork chop, curry, and cabbage over rice.', cost: 8, category: 'food' },
      { time: '14:00', title: 'St Andrew\'s & the Padang', description: 'The white cathedral and the cricket green of the colonial core.', cost: 0, category: 'attraction' },
      { time: '17:00', title: 'Fort Canning Hill', description: 'The photogenic spiral tree stairwell and a hilltop of history.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 4, date: 'Mar 13', city: 'National Gallery & River',
    coverImage: img('1496939376851-89342e90adcd', 1200, 500),
    coverAlt: 'The illuminated Cavenagh Bridge over the Singapore River',
    transport: 'Walking (S$0)',
    activities: [
      { time: '09:30', title: 'National Gallery', description: 'Southeast Asian art in the old Supreme Court and City Hall.', cost: 20, category: 'attraction' },
      { time: '13:00', title: 'Lunch — chicken rice', description: 'The national dish, poached and fragrant, at a heritage restaurant.', cost: 10, category: 'food' },
      { time: '15:00', title: 'Asian Civilisations Museum', description: 'Trade, faith, and craft across Asia on the riverfront.', cost: 12, category: 'attraction' },
      { time: '18:00', title: 'Bumboat on the river', description: 'A wooden boat past the old godowns to Merlion Park.', cost: 28, category: 'transport' },
    ],
  },
  {
    day: 5, date: 'Mar 14', city: 'Chinatown — Deep Dive',
    coverImage: img('1516422641841-cd9803ab02c6', 1200, 500),
    coverAlt: 'Red lanterns strung over a Chinatown street in Singapore',
    transport: 'MRT day pass (S$10)',
    activities: [
      { time: '09:00', title: 'Buddha Tooth Relic Temple', description: 'A Tang-style temple with a golden stupa holding a sacred relic.', cost: 0, category: 'attraction' },
      { time: '11:00', title: 'Chinatown Heritage Centre', description: 'Recreated shophouse cubicles of early immigrant life.', cost: 15, category: 'attraction' },
      { time: '13:00', title: 'Maxwell hawker lunch', description: 'A food-court feast from the Michelin-listed stalls.', cost: 8, category: 'food' },
      { time: '16:00', title: 'Thian Hock Keng temple', description: 'The oldest Hokkien temple, built facing the vanished sea.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 6, date: 'Mar 15', city: 'Little India & Kampong Glam',
    coverImage: img('1516422641841-cd9803ab02c6', 1200, 500),
    coverAlt: 'Colourful shophouses and a mosque in a Singapore quarter',
    transport: 'MRT & walking (S$4)',
    activities: [
      { time: '08:00', title: 'Tekka Centre breakfast', description: 'Thosai and teh tarik in the buzzing Little India market.', cost: 6, category: 'food' },
      { time: '10:00', title: 'Sri Veeramakaliamman temple', description: 'A riot of painted deities in the heart of Little India.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Banana-leaf lunch', description: 'A South Indian thali eaten by hand off a banana leaf.', cost: 12, category: 'food' },
      { time: '16:00', title: 'Sultan Mosque & Haji Lane', description: 'The golden dome and the mural-splashed hipster alley.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 7, date: 'Mar 16', city: 'Gardens by the Bay',
    coverImage: img('1525625293386-3f8f99389edd', 1200, 500),
    coverAlt: 'The Supertree Grove lit up at night in Gardens by the Bay',
    transport: 'MRT to Bayfront (S$3)',
    activities: [
      { time: '09:00', title: 'Cloud Forest dome', description: 'A 35m indoor waterfall wrapped in a misty mountain of orchids.', cost: 53, category: 'attraction' },
      { time: '11:30', title: 'Flower Dome', description: 'The world\'s largest glass greenhouse of Mediterranean flora.', cost: 0, category: 'attraction' },
      { time: '14:00', title: 'OCBC Skyway', description: 'A walkway strung between the giant solar Supertrees.', cost: 14, category: 'attraction' },
      { time: '19:45', title: 'Garden Rhapsody light show', description: 'The Supertrees pulse to music after dark.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 8, date: 'Mar 17', city: 'Botanic Gardens & Orchard',
    coverImage: img('1628221680019-f28a2716e727', 1200, 500),
    coverAlt: 'A tranquil lake and lush lawns in the Botanic Gardens',
    transport: 'MRT (S$4)',
    activities: [
      { time: '08:30', title: 'Botanic Gardens', description: 'The UNESCO tropical garden, from rainforest to swan lake.', cost: 0, category: 'attraction' },
      { time: '10:30', title: 'National Orchid Garden', description: 'Sixty thousand orchids, including named diplomatic hybrids.', cost: 15, category: 'attraction' },
      { time: '13:00', title: 'Lunch — laksa', description: 'A coconut-curry noodle bowl in a Holland Village cafe.', cost: 10, category: 'food' },
      { time: '16:00', title: 'Orchard Road', description: 'The tree-lined shopping boulevard of malls and flagship stores.', cost: 0, category: 'other' },
    ],
  },
  {
    day: 9, date: 'Mar 18', city: 'Mandai — Zoo & River',
    coverImage: img('1628221680019-f28a2716e727', 1200, 500),
    coverAlt: 'A lush open-concept zoo enclosure with tropical planting',
    transport: 'MRT + shuttle (S$6)',
    activities: [
      { time: '09:00', title: 'Singapore Zoo', description: 'The pioneering open-concept zoo, from orangutans to white tigers.', cost: 48, category: 'attraction' },
      { time: '13:00', title: 'Lunch among the trees', description: 'Breakfast-with-orangutans cafe in the rainforest.', cost: 20, category: 'food' },
      { time: '15:00', title: 'River Wonders', description: 'Habitats along the world\'s rivers, and the giant pandas.', cost: 42, category: 'attraction' },
      { time: '17:00', title: 'Amazon river boat', description: 'A gentle ride past manatees and jaguars.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 10, date: 'Mar 19', city: 'Mandai — Night Safari',
    coverImage: img('1628221680019-f28a2716e727', 1200, 500),
    coverAlt: 'A dimly lit nocturnal animal trail at night',
    transport: 'Shuttle (S$6)',
    activities: [
      { time: '11:00', title: 'Bird Paradise', description: 'Walk-through aviaries from African wetlands to Amazon jungle.', cost: 48, category: 'attraction' },
      { time: '14:00', title: 'Rainforest Wild', description: 'The newest park, deep-jungle immersion with waterfalls.', cost: 40, category: 'attraction' },
      { time: '19:15', title: 'Night Safari tram', description: 'The world\'s first nocturnal zoo, alive under moon-glow lighting.', cost: 55, category: 'attraction' },
      { time: '21:00', title: 'Creatures of the Night show', description: 'Owls, otters, and civets on the after-dark stage.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 11, date: 'Mar 20', city: 'Jurong — Science & Lake',
    coverImage: img('1569288063643-5d29ad64df09', 1200, 500),
    coverAlt: 'A modern lakeside garden in western Singapore',
    transport: 'MRT to the west (S$4)',
    activities: [
      { time: '09:00', title: 'Science Centre', description: 'Hands-on physics, a tornado, and the Omni-Theatre dome.', cost: 12, category: 'attraction' },
      { time: '13:00', title: 'Lunch — fish head curry', description: 'A Singaporean Indian-Chinese fusion classic in the west.', cost: 15, category: 'food' },
      { time: '15:00', title: 'Chinese & Japanese Gardens', description: 'Pagodas, bonsai, and arched bridges around Jurong Lake.', cost: 0, category: 'attraction' },
      { time: '17:30', title: 'Jurong Lake Gardens', description: 'A revamped lakeside park of boardwalks and swamp forest.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 12, date: 'Mar 21', city: 'Southern Ridges & Faber',
    coverImage: img('1569288063643-5d29ad64df09', 1200, 500),
    coverAlt: 'The wave-shaped Henderson Waves bridge in the treetops',
    transport: 'MRT + walking (S$4)',
    activities: [
      { time: '08:30', title: 'Henderson Waves', description: 'The undulating timber bridge high above the forest canopy.', cost: 0, category: 'attraction' },
      { time: '10:30', title: 'Forest & canopy walk', description: 'The green ridgeline trail linking Mount Faber to Kent Ridge.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch — bak kut teh', description: 'A peppery pork-rib soup with dough fritters.', cost: 10, category: 'food' },
      { time: '17:30', title: 'Mount Faber sunset', description: 'A hilltop park with a view to the harbour and Sentosa.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 13, date: 'Mar 22', city: 'Katong — Peranakan East',
    coverImage: img('1516422641841-cd9803ab02c6', 1200, 500),
    coverAlt: 'A row of pastel Peranakan shophouses with ornate tiles',
    transport: 'MRT & bus (S$4)',
    activities: [
      { time: '09:00', title: 'Koon Seng Road shophouses', description: 'The most photographed row of ornate Peranakan facades.', cost: 0, category: 'attraction' },
      { time: '11:00', title: 'Intan Peranakan home museum', description: 'A private collector\'s trove of Straits Chinese heritage.', cost: 20, category: 'attraction' },
      { time: '13:00', title: 'Lunch — katong laksa', description: 'The local laksa eaten with a spoon, noodles cut short.', cost: 8, category: 'food' },
      { time: '16:00', title: 'Joo Chiat lanes', description: 'Cafes and craft shops down the colourful heritage street.', cost: 0, category: 'other' },
    ],
  },
  {
    day: 14, date: 'Mar 23', city: 'East Coast & Changi',
    coverImage: img('1628221680019-f28a2716e727', 1200, 500),
    coverAlt: 'Cyclists on a palm-lined coastal park path',
    transport: 'Bus & bike (S$8)',
    activities: [
      { time: '09:00', title: 'East Coast Park cycle', description: 'Pedal the palm-shaded coast where locals picnic and swim.', cost: 12, category: 'attraction' },
      { time: '13:00', title: 'Seafood lunch — chilli crab', description: 'The messy signature dish at an East Coast seafood centre.', cost: 45, category: 'food' },
      { time: '16:00', title: 'Changi Village & boardwalk', description: 'A sleepy old corner with nasi lemak and a sea walk.', cost: 5, category: 'attraction' },
      { time: '18:00', title: 'Changi Point sunset', description: 'Watch the sun set over the strait toward Malaysia.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 15, date: 'Mar 24', city: 'Pulau Ubin — Old Kampong',
    coverImage: img('1628221680019-f28a2716e727', 1200, 500),
    coverAlt: 'A rustic wooden jetty at a forested island',
    transport: 'Bumboat to Pulau Ubin (S$4)',
    activities: [
      { time: '08:00', title: 'Bumboat to Ubin', description: 'A ten-minute crossing to the last rustic kampong island.', cost: 4, category: 'transport' },
      { time: '09:00', title: 'Cycle the island', description: 'Dirt tracks past old granite quarries and wooden houses.', cost: 15, category: 'attraction' },
      { time: '11:00', title: 'Chek Jawa wetlands', description: 'A boardwalk over six ecosystems where sea meets forest.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Seafood lunch on the jetty', description: 'The island\'s one restaurant, fresh from the sea.', cost: 25, category: 'food' },
    ],
  },
  {
    day: 16, date: 'Mar 25', city: 'MacRitchie — Rainforest Walk',
    coverImage: img('1628221680019-f28a2716e727', 1200, 500),
    coverAlt: 'A suspension bridge in the treetops of a rainforest reserve',
    transport: 'MRT & bus (S$4)',
    activities: [
      { time: '08:00', title: 'MacRitchie boardwalk', description: 'A trail along the reservoir where monkeys and monitors roam.', cost: 0, category: 'attraction' },
      { time: '10:30', title: 'TreeTop Walk', description: 'A 250m suspension bridge slung across the forest canopy.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch — nasi lemak', description: 'Coconut rice, sambal, and fried chicken at a coffeeshop.', cost: 6, category: 'food' },
      { time: '15:30', title: 'Kayak the reservoir', description: 'Paddle the still water fringed by jungle.', cost: 30, category: 'attraction' },
    ],
  },
  {
    day: 17, date: 'Mar 26', city: 'Bukit Timah & Rail Corridor',
    coverImage: img('1628221680019-f28a2716e727', 1200, 500),
    coverAlt: 'A green disused railway path winding through the city',
    transport: 'MRT & walking (S$4)',
    activities: [
      { time: '08:00', title: 'Bukit Timah summit', description: 'Climb the highest hill through primary rainforest.', cost: 0, category: 'attraction' },
      { time: '11:00', title: 'The Green Corridor', description: 'Walk the old KTM railway line, now a linear jungle park.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch — Hokkien mee', description: 'Wok-fried prawn noodles at a heritage stall.', cost: 8, category: 'food' },
      { time: '16:00', title: 'Old Bukit Timah station', description: 'The preserved black-and-white railway station and truss bridge.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 18, date: 'Mar 27', city: 'Marina Bay by Night',
    coverImage: img('1525625293386-3f8f99389edd', 1200, 500),
    coverAlt: 'The lotus-shaped ArtScience Museum lit at night',
    transport: 'MRT (S$3)',
    activities: [
      { time: '11:00', title: 'ArtScience Museum', description: 'The lotus-shaped museum and its Future World light rooms.', cost: 30, category: 'attraction' },
      { time: '14:00', title: 'Merlion Park', description: 'The half-lion, half-fish icon spouting into the bay.', cost: 0, category: 'attraction' },
      { time: '18:00', title: 'Satay by the Bay dinner', description: 'Skewers and stingray at an open-air hawker garden.', cost: 20, category: 'food' },
      { time: '20:00', title: 'Spectra light show', description: 'The nightly water-and-light spectacle across the bay.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 19, date: 'Mar 28', city: 'Day Trip — Bintan Island',
    coverImage: img('1569288063643-5d29ad64df09', 1200, 500),
    coverAlt: 'A resort beach with clear water on an Indonesian island',
    transport: 'Ferry to Bintan, Indonesia (S$60)',
    activities: [
      { time: '08:00', title: 'Ferry to Indonesia', description: 'An hour across the strait to the resort island of Bintan.', cost: 60, category: 'transport' },
      { time: '11:00', title: 'Beach & mangrove', description: 'White sand and a river safari through the mangroves.', cost: 40, category: 'attraction' },
      { time: '13:00', title: 'Lunch — gonggong', description: 'Steamed sea snails and grilled fish, a Riau island specialty.', cost: 15, category: 'food' },
      { time: '18:00', title: 'Ferry back to the city', description: 'Return across the water as the lights come up.', cost: 0, category: 'transport' },
    ],
  },
  {
    day: 20, date: 'Mar 29', city: 'Day Trip — Johor & Legoland',
    coverImage: img('1569288063643-5d29ad64df09', 1200, 500),
    coverAlt: 'A colourful theme-park entrance across the causeway',
    transport: 'Bus across the causeway (S$10)',
    activities: [
      { time: '08:00', title: 'Cross to Malaysia', description: 'Over the causeway to Johor Bahru for a day across the border.', cost: 10, category: 'transport' },
      { time: '10:00', title: 'Legoland Malaysia', description: 'Brick-built miniland and rides just over the strait.', cost: 60, category: 'attraction' },
      { time: '14:00', title: 'Lunch — JB street food', description: 'Cheaper, richer laksa and satay on the Malaysian side.', cost: 8, category: 'food' },
      { time: '19:00', title: 'Return to Singapore', description: 'Back over the causeway to the island by night.', cost: 0, category: 'transport' },
    ],
  },
  {
    day: 21, date: 'Mar 30', city: 'Kranji — Wetlands & Farms',
    coverImage: img('1628221680019-f28a2716e727', 1200, 500),
    coverAlt: 'A mangrove boardwalk over tidal wetlands',
    transport: 'MRT & farm shuttle (S$6)',
    activities: [
      { time: '08:00', title: 'Sungei Buloh wetlands', description: 'A mangrove reserve of mudskippers, crabs, and migratory birds.', cost: 0, category: 'attraction' },
      { time: '11:00', title: 'Kranji countryside farms', description: 'Hydroponic greens and a goat dairy in the rural northwest.', cost: 10, category: 'attraction' },
      { time: '13:00', title: 'Farm-to-table lunch', description: 'A frog-leg porridge lunch beside the fish ponds.', cost: 15, category: 'food' },
      { time: '16:00', title: 'Kranji war memorial', description: 'The hillside cemetery honouring the fallen of the region.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 22, date: 'Mar 31', city: 'Haw Par Villa & Pasir Panjang',
    coverImage: img('1516422641841-cd9803ab02c6', 1200, 500),
    coverAlt: 'Vivid painted statues in a mythological theme garden',
    transport: 'MRT (S$3)',
    activities: [
      { time: '09:00', title: 'Haw Par Villa', description: 'A surreal 1930s garden of Chinese myth and the Ten Courts of Hell.', cost: 0, category: 'attraction' },
      { time: '11:30', title: 'Hell\'s Museum', description: 'A witty, macabre tour of afterlife beliefs worldwide.', cost: 20, category: 'attraction' },
      { time: '13:00', title: 'Lunch — carrot cake', description: 'Fried radish cake with egg, a hawker classic, black or white.', cost: 6, category: 'food' },
      { time: '16:00', title: 'Reflections at Bukit Chandu', description: 'The Malay Regiment\'s last stand, in a black-and-white bungalow.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 23, date: 'Apr 1', city: 'Tiong Bahru — Old & New',
    coverImage: img('1516422641841-cd9803ab02c6', 1200, 500),
    coverAlt: 'Streamline-moderne walk-up apartments and a cafe',
    transport: 'MRT (S$3)',
    activities: [
      { time: '08:00', title: 'Tiong Bahru Market breakfast', description: 'Chwee kueh and lor mee in the beloved hawker centre.', cost: 6, category: 'food' },
      { time: '10:00', title: 'Art-deco estate walk', description: 'The 1930s streamline-moderne walk-ups, now full of cafes.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Independent bookshops & bakeries', description: 'Browse the indie shops that made the district famous.', cost: 12, category: 'other' },
      { time: '16:00', title: 'Monkey God temple', description: 'A small vivid temple and the old air-raid shelter beneath a block.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 24, date: 'Apr 2', city: 'Orchard & Emerald Hill',
    coverImage: img('1496939376851-89342e90adcd', 1200, 500),
    coverAlt: 'A tree-lined shopping boulevard with tall malls',
    transport: 'MRT & walking (S$3)',
    activities: [
      { time: '10:00', title: 'ION Orchard & the malls', description: 'Flagship stores down the great shopping boulevard.', cost: 0, category: 'other' },
      { time: '13:00', title: 'Lunch — popiah & rojak', description: 'A fresh spring roll and a tangy fruit salad in a food hall.', cost: 8, category: 'food' },
      { time: '15:00', title: 'Emerald Hill', description: 'A cul-de-sac of grand restored Peranakan terrace houses.', cost: 0, category: 'attraction' },
      { time: '18:00', title: 'Dhoby Ghaut greens', description: 'A last leafy stroll where three MRT lines meet.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 25, date: 'Apr 3', city: 'Singapore River & Quays',
    coverImage: img('1496939376851-89342e90adcd', 1200, 500),
    coverAlt: 'Restored warehouses lit up along the river quays at night',
    transport: 'Walking & MRT (S$3)',
    activities: [
      { time: '10:00', title: 'Raffles Landing Site', description: 'Where the founder is said to have first stepped ashore in 1819.', cost: 0, category: 'attraction' },
      { time: '12:00', title: 'Boat Quay lunch', description: 'Riverside seafood in a converted godown.', cost: 30, category: 'food' },
      { time: '15:00', title: 'Clarke Quay & Read Bridge', description: 'The colourful warehouse district by day.', cost: 0, category: 'attraction' },
      { time: '19:00', title: 'Riverside evening', description: 'Drinks along the water as the quays light up.', cost: 25, category: 'food' },
    ],
  },
  {
    day: 26, date: 'Apr 4', city: 'Marina East & Barrage',
    coverImage: img('1525625293386-3f8f99389edd', 1200, 500),
    coverAlt: 'Kites flying above a grassy dam with the skyline behind',
    transport: 'MRT & walking (S$3)',
    activities: [
      { time: '09:00', title: 'Marina Barrage', description: 'A dam-turned-park where families fly kites over the reservoir.', cost: 0, category: 'attraction' },
      { time: '11:00', title: 'Gardens by the Bay East', description: 'The quieter, wilder half of the great gardens.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch — oyster omelette', description: 'Orh luak, a crispy-gooey hawker favourite.', cost: 8, category: 'food' },
      { time: '17:00', title: 'Helix Bridge sunset', description: 'The DNA-shaped footbridge as the bay lights ignite.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 27, date: 'Apr 5', city: 'Changi Jewel & Chinatown Night',
    coverImage: img('1525625293386-3f8f99389edd', 1200, 500),
    coverAlt: 'A giant indoor waterfall in a glass-domed airport atrium',
    transport: 'MRT (S$4)',
    activities: [
      { time: '10:00', title: 'Jewel Changi', description: 'The Rain Vortex — the world\'s tallest indoor waterfall in a jungle dome.', cost: 0, category: 'attraction' },
      { time: '12:00', title: 'Canopy Park', description: 'Sky nets and hedge mazes suspended above the falls.', cost: 8, category: 'attraction' },
      { time: '14:00', title: 'Lunch — Peranakan set', description: 'A Nyonya spread of ayam buah keluak and kueh.', cost: 22, category: 'food' },
      { time: '19:00', title: 'Chinatown by night', description: 'Lantern-lit food street and a nightcap in a hidden bar.', cost: 20, category: 'food' },
    ],
  },
  {
    day: 28, date: 'Apr 6', city: 'Southern Islands — St John\'s',
    coverImage: img('1569288063643-5d29ad64df09', 1200, 500),
    coverAlt: 'A quiet island lagoon a short ferry from the city',
    transport: 'Ferry from Marina (S$18)',
    activities: [
      { time: '09:00', title: 'Ferry to St John\'s Island', description: 'A quiet former quarantine island off the south coast.', cost: 18, category: 'transport' },
      { time: '10:30', title: 'Lazarus Island', description: 'Cross the causeway to an almost-empty crescent of white sand.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Picnic on the sand', description: 'A packed hawker lunch with the skyline on the horizon.', cost: 10, category: 'food' },
      { time: '16:00', title: 'Kusu Island temple', description: 'A Chinese temple and Malay shrines on the turtle island.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 29, date: 'Apr 7', city: 'HarbourFront & Mount Faber',
    coverImage: img('1569288063643-5d29ad64df09', 1200, 500),
    coverAlt: 'A cable car crossing the harbour toward Sentosa at dusk',
    transport: 'MRT & cable car (S$35)',
    activities: [
      { time: '10:00', title: 'VivoCity waterfront', description: 'The rooftop sky park over the harbour and Sentosa gateway.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch — seafood white bee hoon', description: 'Milky vermicelli with prawns at a HarbourFront zi char.', cost: 20, category: 'food' },
      { time: '17:00', title: 'Mount Faber cable car', description: 'Glide over the harbour for the golden-hour view.', cost: 35, category: 'transport' },
      { time: '19:00', title: 'Faber Peak dinner', description: 'A hilltop meal overlooking tomorrow\'s island.', cost: 45, category: 'food' },
    ],
  },
  {
    day: 30, date: 'Apr 8', city: 'Sentosa & Farewell',
    coverImage: img('1569288063643-5d29ad64df09', 1200, 500),
    coverAlt: 'Marina Bay Sands hotel by day',
    transport: 'Sentosa Express (S$4)',
    activities: [
      { time: '09:00', title: 'Cable car to Sentosa', description: 'Glide over the harbour to the resort island of beaches and rides.', cost: 35, category: 'transport' },
      { time: '10:30', title: 'S.E.A. Aquarium', description: 'One of the largest aquariums on earth, with a vast open-ocean window.', cost: 44, category: 'attraction' },
      { time: '13:00', title: 'Lunch — laksa', description: 'Coconut-curry noodle soup, Singapore\'s Peranakan classic.', cost: 10, category: 'food' },
      { time: '15:00', title: 'Southern Ridges canopy walk', description: 'The wave-form Henderson Waves bridge high in the rainforest.', cost: 0, category: 'attraction' },
      { time: '18:00', title: 'Departure — see you again', description: 'MRT back to Changi, dazzled by the Lion City. Selamat jalan.', cost: 3, category: 'transport' },
    ],
  },
]

// ─── Philippines ─────────────────────────────────────────────────────────

const PHILIPPINES_ITINERARY: Day[] = [
  {
    day: 1, date: 'Apr 6', city: 'El Nido — Arrival',
    coverImage: img('1697135756100-7b610c8fe92e', 1200, 500),
    coverAlt: 'Boats on the blue water of El Nido, Palawan',
    transport: 'Flight + van to El Nido (₱1,500)',
    activities: [
      { time: '13:00', title: 'Arrive Palawan', description: 'Fly to the last frontier and drive the coast into the limestone town of El Nido.', cost: 1500, category: 'transport' },
      { time: '16:00', title: 'Las Cabañas Beach sunset', description: 'A zipline over the bay and a San Miguel as the sun drops behind the islands.', cost: 500, category: 'attraction' },
      { time: '19:00', title: 'Dinner — grilled seafood', description: 'The day\'s catch over coals with garlic rice and calamansi.', cost: 400, category: 'food' },
    ],
  },
  {
    day: 2, date: 'Apr 7', city: 'Bacuit Bay — Island Hopping',
    coverImage: img('1697473259118-473211915531', 1200, 500),
    coverAlt: 'Karst islands rising from the water in Palawan',
    transport: 'Bangka outrigger tour (₱1,400)',
    activities: [
      { time: '08:30', title: 'Big & Small Lagoons', description: 'Kayak into cathedral-walled lagoons of impossibly clear jade water.', cost: 1400, category: 'attraction' },
      { time: '11:00', title: 'Secret Lagoon & Shimizu', description: 'Duck through a rock keyhole and snorkel over coral gardens.', cost: 0, category: 'attraction' },
      { time: '12:30', title: 'Beach barbecue lunch', description: 'Grilled tuna, pork, and tropical fruit served on a castaway beach.', cost: 0, category: 'food' },
      { time: '14:30', title: 'Seven Commandos Beach', description: 'Powder sand and coconut palms for the afternoon swim.', cost: 0, category: 'attraction' },
      { time: '19:00', title: 'Reggae bar on the strand', description: 'Live music and fresh mango shakes down the beach road.', cost: 300, category: 'food' },
    ],
  },
  {
    day: 3, date: 'Apr 8', city: 'Coron — Wrecks & Lakes',
    coverImage: img('1763581616094-c1b4097972d4', 1200, 500),
    coverAlt: 'Aerial view of boats in a tropical lagoon',
    transport: 'Ferry El Nido → Coron (₱2,200)',
    activities: [
      { time: '07:00', title: 'Fast ferry to Coron', description: 'Across to the island of shipwrecks and jagged limestone.', cost: 2200, category: 'transport' },
      { time: '11:00', title: 'Kayangan Lake', description: 'Climb to the viewpoint over "the cleanest lake in the Philippines".', cost: 400, category: 'attraction' },
      { time: '13:00', title: 'Twin Lagoon', description: 'Swim between two lagoons through a gap beneath the cliff.', cost: 200, category: 'attraction' },
      { time: '15:00', title: 'WWII wreck snorkel', description: 'Sunken Japanese ships in clear shallow water, alive with fish.', cost: 0, category: 'attraction' },
      { time: '18:00', title: 'Maquinit hot springs', description: 'A saltwater hot spring in the mangroves to end the day.', cost: 200, category: 'attraction' },
    ],
  },
  {
    day: 4, date: 'Apr 9', city: 'Coron — Lakes & Reefs',
    coverImage: img('1763581616094-c1b4097972d4', 1200, 500),
    coverAlt: 'A calm emerald lagoon ringed by limestone in Coron',
    transport: 'Bangka island tour (₱1,300)',
    activities: [
      { time: '08:00', title: 'Barracuda Lake', description: 'Swim a thermocline lake where warm and cold water blur the view.', cost: 1300, category: 'attraction' },
      { time: '11:00', title: 'Malcapuya Island', description: 'A postcard beach of powder sand and clear shallows.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Beach barbecue lunch', description: 'Grilled tuna and fresh fruit on a castaway beach.', cost: 0, category: 'food' },
      { time: '16:00', title: 'Siete Pecados snorkel', description: 'A marine sanctuary of coral gardens and darting fish.', cost: 200, category: 'attraction' },
    ],
  },
  {
    day: 5, date: 'Apr 10', city: 'Puerto Princesa — Underground River',
    coverImage: img('1771533679967-1b6f3a10be02', 1200, 500),
    coverAlt: 'A paddle boat entering a limestone cave river mouth',
    transport: 'Fly to Puerto Princesa (₱2,000)',
    activities: [
      { time: '07:00', title: 'Fly south down Palawan', description: 'To the island\'s capital and its UNESCO river cave.', cost: 2000, category: 'transport' },
      { time: '11:00', title: 'Subterranean River', description: 'Paddle 8km of navigable cave river beneath a karst mountain.', cost: 700, category: 'attraction' },
      { time: '13:00', title: 'Lunch — tamilok & seafood', description: 'The daring will try woodworm ceviche; the rest, grilled fish.', cost: 400, category: 'food' },
      { time: '16:00', title: 'Sabang mangrove paddle', description: 'A guided canoe through the coastal mangrove forest.', cost: 300, category: 'attraction' },
    ],
  },
  {
    day: 6, date: 'Apr 11', city: 'Puerto Princesa — Honda Bay',
    coverImage: img('1697135756100-7b610c8fe92e', 1200, 500),
    coverAlt: 'Island-hopping boats on a calm turquoise bay',
    transport: 'Bangka in Honda Bay (₱1,400)',
    activities: [
      { time: '08:00', title: 'Honda Bay hopping', description: 'Cowrie, Luli, and Starfish islands in a bright shallow bay.', cost: 1400, category: 'attraction' },
      { time: '11:00', title: 'Snorkel the sandbars', description: 'Clear water over coral and drifting sea stars.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Island lunch', description: 'Grilled squid and chicken inasal on the sand.', cost: 0, category: 'food' },
      { time: '17:00', title: 'Baywalk sunset', description: 'The city seafront promenade as the sky turns.', cost: 200, category: 'food' },
    ],
  },
  {
    day: 7, date: 'Apr 12', city: 'Cebu — Queen City of the South',
    coverImage: img('1771533679967-1b6f3a10be02', 1200, 500),
    coverAlt: 'A historic stone fort in the heart of Cebu City',
    transport: 'Fly to Cebu (₱2,500)',
    activities: [
      { time: '08:00', title: 'Fly to the Visayas', description: 'East to Cebu, the cradle of Philippine Christianity.', cost: 2500, category: 'transport' },
      { time: '12:00', title: 'Magellan\'s Cross & Basilica', description: 'The cross planted in 1521 and the Santo Nino it protects.', cost: 0, category: 'attraction' },
      { time: '14:00', title: 'Fort San Pedro', description: 'The oldest triangular bastion fort in the country.', cost: 30, category: 'attraction' },
      { time: '19:00', title: 'Dinner — lechon Cebu', description: 'The famous crackling roast suckling pig, best in the land.', cost: 400, category: 'food' },
    ],
  },
  {
    day: 8, date: 'Apr 13', city: 'Kawasan — Canyoneering',
    coverImage: img('1763581616094-c1b4097972d4', 1200, 500),
    coverAlt: 'A turquoise waterfall pool in a lush canyon',
    transport: 'Van to the south coast (₱1,000)',
    activities: [
      { time: '06:00', title: 'Drive to Badian', description: 'South across the island to the canyoneering country.', cost: 1000, category: 'transport' },
      { time: '09:00', title: 'Kawasan canyoneering', description: 'Jump, swim, and slide down a gorge of impossible-blue pools.', cost: 1500, category: 'attraction' },
      { time: '13:00', title: 'Lunch — Cebuano feast', description: 'Sinigang and grilled fish after the adventure.', cost: 350, category: 'food' },
      { time: '16:00', title: 'Kawasan Falls', description: 'End at the three-tier turquoise fall you climbed above.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 9, date: 'Apr 14', city: 'Moalboal — Sardine Run',
    coverImage: img('1697473259118-473211915531', 1200, 500),
    coverAlt: 'A vast swirling silver school of sardines underwater',
    transport: 'Coast road to Moalboal (₱300)',
    activities: [
      { time: '08:00', title: 'The sardine run', description: 'Snorkel into a shimmering tornado of millions of sardines off the shore.', cost: 500, category: 'attraction' },
      { time: '10:30', title: 'Pescador Island dive', description: 'A wall of coral alive with turtles and jacks.', cost: 1200, category: 'attraction' },
      { time: '13:00', title: 'Panagsama lunch', description: 'A beach-shack meal looking over the drop-off.', cost: 350, category: 'food' },
      { time: '17:30', title: 'Cliffside sunset', description: 'The sky burns over the Tanon Strait.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 10, date: 'Apr 15', city: 'Oslob — Whale Sharks & Sumilon',
    coverImage: img('1697473259118-473211915531', 1200, 500),
    coverAlt: 'A sandbar curving off a small island in clear water',
    transport: 'Van to Oslob (₱400)',
    activities: [
      { time: '06:00', title: 'Tumalog Falls', description: 'A veil-like curtain fall in the cool early morning.', cost: 100, category: 'attraction' },
      { time: '09:00', title: 'Sumilon sandbar', description: 'A shifting white spit off a marine-sanctuary island.', cost: 1000, category: 'attraction' },
      { time: '13:00', title: 'Lunch by the sea', description: 'Grilled tuna belly and rice on the coast.', cost: 350, category: 'food' },
      { time: '16:00', title: 'Ferry toward Bohol', description: 'Cross the strait to the next Visayan island.', cost: 800, category: 'transport' },
    ],
  },
  {
    day: 11, date: 'Apr 16', city: 'Bohol — Chocolate Hills',
    coverImage: img('1771533679967-1b6f3a10be02', 1200, 500),
    coverAlt: 'Hundreds of conical green hills across a wide plain',
    transport: 'Countryside tour (₱1,500)',
    activities: [
      { time: '08:00', title: 'Chocolate Hills', description: 'Over 1,200 near-identical conical hills, brown in the dry season.', cost: 100, category: 'attraction' },
      { time: '11:00', title: 'Man-made forest', description: 'A dense mahogany tunnel planted along the ridge road.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Loboc river cruise lunch', description: 'A floating buffet drifting past jungle and serenading singers.', cost: 750, category: 'food' },
      { time: '16:00', title: 'Baclayon church', description: 'One of the oldest coral-stone churches in the country.', cost: 50, category: 'attraction' },
    ],
  },
  {
    day: 12, date: 'Apr 17', city: 'Bohol — Tarsiers & Panglao',
    coverImage: img('1697135756100-7b610c8fe92e', 1200, 500),
    coverAlt: 'A tiny wide-eyed tarsier clinging to a branch',
    transport: 'Drive to Panglao (₱400)',
    activities: [
      { time: '08:00', title: 'Tarsier sanctuary', description: 'The world\'s smallest primate, huge-eyed, in a protected forest.', cost: 120, category: 'attraction' },
      { time: '11:00', title: 'Hinagdanan cave', description: 'A limestone cavern with a swimmable underground pool.', cost: 50, category: 'attraction' },
      { time: '13:00', title: 'Alona Beach lunch', description: 'Seafood on the busy strip of Panglao Island.', cost: 400, category: 'food' },
      { time: '17:00', title: 'Alona sunset', description: 'A quiet beach evening before the dive day.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 13, date: 'Apr 18', city: 'Balicasag — Turtle Diving',
    coverImage: img('1697473259118-473211915531', 1200, 500),
    coverAlt: 'A sea turtle gliding over a vibrant coral wall',
    transport: 'Bangka to Balicasag (₱1,800)',
    activities: [
      { time: '06:00', title: 'Dolphin watching', description: 'Pods of spinner dolphins racing the dawn bow-wave.', cost: 1800, category: 'attraction' },
      { time: '09:00', title: 'Balicasag reef', description: 'A marine sanctuary wall thick with turtles and jackfish.', cost: 500, category: 'attraction' },
      { time: '12:00', title: 'Virgin Island sandbar', description: 'A crescent of white sand with vendors selling sea urchin.', cost: 0, category: 'food' },
      { time: '16:00', title: 'Panglao rest', description: 'An easy afternoon before the next island.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 14, date: 'Apr 19', city: 'Siquijor — Mystic Island',
    coverImage: img('1763581616094-c1b4097972d4', 1200, 500),
    coverAlt: 'A giant old balete tree over a spring on a quiet island',
    transport: 'Ferry to Siquijor (₱600)',
    activities: [
      { time: '08:00', title: 'Ferry to Siquijor', description: 'To the island of folk healers, faith, and quiet beaches.', cost: 600, category: 'transport' },
      { time: '12:00', title: 'Century-old balete tree', description: 'A vast ancient tree over a fish-foot-spa spring.', cost: 20, category: 'attraction' },
      { time: '14:00', title: 'Lazi convent & church', description: 'One of the largest colonial-era wooden convents in Asia.', cost: 0, category: 'attraction' },
      { time: '17:30', title: 'Paliton Beach sunset', description: 'A palm-fringed white cove for the golden hour.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 15, date: 'Apr 20', city: 'Siquijor — Falls & Sea',
    coverImage: img('1763581616094-c1b4097972d4', 1200, 500),
    coverAlt: 'A rope swing over a turquoise multi-tier waterfall',
    transport: 'Scooter around the island (₱350)',
    activities: [
      { time: '08:00', title: 'Cambugahay Falls', description: 'Tiered turquoise pools with rope swings into the water.', cost: 20, category: 'attraction' },
      { time: '11:00', title: 'Salagdoong cliff jump', description: 'A forest-backed cove with platforms into the blue sea.', cost: 30, category: 'attraction' },
      { time: '13:00', title: 'Lunch — grilled seafood', description: 'The catch of the day on a beachside grill.', cost: 300, category: 'food' },
      { time: '16:00', title: 'Guiwanon mangrove sanctuary', description: 'A bamboo boardwalk built over the tidal mangroves.', cost: 50, category: 'attraction' },
    ],
  },
  {
    day: 16, date: 'Apr 21', city: 'Apo Island — Turtle Sanctuary',
    coverImage: img('1697473259118-473211915531', 1200, 500),
    coverAlt: 'Snorkellers above seagrass with a green turtle',
    transport: 'Ferry + bangka via Dumaguete (₱1,200)',
    activities: [
      { time: '07:00', title: 'Cross to Apo Island', description: 'Via the university town of Dumaguete to a pioneering marine reserve.', cost: 1200, category: 'transport' },
      { time: '10:00', title: 'Snorkel with turtles', description: 'Green sea turtles grazing seagrass in the shallows.', cost: 300, category: 'attraction' },
      { time: '13:00', title: 'Island lunch', description: 'A simple fish-and-rice meal in the fishing village.', cost: 300, category: 'food' },
      { time: '18:00', title: 'Dumaguete boulevard', description: 'Silvanas and tempura by the sea on the return.', cost: 200, category: 'food' },
    ],
  },
  {
    day: 17, date: 'Apr 22', city: 'Siargao — Surf Capital',
    coverImage: img('1771533679967-1b6f3a10be02', 1200, 500),
    coverAlt: 'A wooden boardwalk over the sea toward a surf break',
    transport: 'Fly to Siargao (₱3,000)',
    activities: [
      { time: '08:00', title: 'Fly to the teardrop isle', description: 'To the palm-shagged surf island of Mindanao\'s northeast.', cost: 3000, category: 'transport' },
      { time: '13:00', title: 'Cloud 9 boardwalk', description: 'The legendary reef break and its iconic viewing tower.', cost: 0, category: 'attraction' },
      { time: '15:00', title: 'Surf lesson', description: 'A beginner break on the warm Pacific-facing coast.', cost: 800, category: 'attraction' },
      { time: '19:00', title: 'General Luna dinner', description: 'Kinilaw and coconut curry on the palm-lined main strip.', cost: 400, category: 'food' },
    ],
  },
  {
    day: 18, date: 'Apr 23', city: 'Siargao — Island Hopping',
    coverImage: img('1697135756100-7b610c8fe92e', 1200, 500),
    coverAlt: 'A tiny sandbar island with a single hut and palms',
    transport: 'Bangka three-island tour (₱1,500)',
    activities: [
      { time: '08:00', title: 'Naked Island', description: 'A pure sandbar with nothing on it but sky and sea.', cost: 1500, category: 'attraction' },
      { time: '10:30', title: 'Daku & Guyam', description: 'A palm island for lunch and a tiny islet for photos.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Beach grill lunch', description: 'A whole grilled fish and rice on Daku Island.', cost: 0, category: 'food' },
      { time: '16:00', title: 'Snorkel the reefs', description: 'Coral gardens between the islands.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 19, date: 'Apr 24', city: 'Siargao — Lagoons & Rock Pools',
    coverImage: img('1697135756100-7b610c8fe92e', 1200, 500),
    coverAlt: 'A green lagoon of mangroves with a paddleboard',
    transport: 'Van & boat around the isle (₱800)',
    activities: [
      { time: '07:00', title: 'Sugba Lagoon', description: 'Paddleboard and dive-board over a jade mangrove lagoon.', cost: 800, category: 'attraction' },
      { time: '11:00', title: 'Magpupungko rock pools', description: 'Tidal pools in a rock shelf, revealed only at low tide.', cost: 100, category: 'attraction' },
      { time: '13:00', title: 'Coconut-country lunch', description: 'Fresh buko and grilled pork among the palms.', cost: 300, category: 'food' },
      { time: '16:00', title: 'Maasin palm river', description: 'The leaning-coconut swing over a jungle river.', cost: 50, category: 'attraction' },
    ],
  },
  {
    day: 20, date: 'Apr 25', city: 'Camiguin — Island Born of Fire',
    coverImage: img('1771533679967-1b6f3a10be02', 1200, 500),
    coverAlt: 'A volcanic island with a white sandbar offshore',
    transport: 'Fly + ferry to Camiguin (₱2,500)',
    activities: [
      { time: '07:00', title: 'Cross to Camiguin', description: 'To the tiny volcano island of seven cones.', cost: 2500, category: 'transport' },
      { time: '13:00', title: 'White Island sandbar', description: 'A bare crescent of white sand off the volcanic shore.', cost: 400, category: 'attraction' },
      { time: '15:00', title: 'Sunken cemetery', description: 'A giant cross marks a graveyard drowned by an 1871 eruption.', cost: 0, category: 'attraction' },
      { time: '18:00', title: 'Lunch — pastel & kiping', description: 'The island\'s custard buns and rice-wafer snacks.', cost: 200, category: 'food' },
    ],
  },
  {
    day: 21, date: 'Apr 26', city: 'Camiguin — Springs & Falls',
    coverImage: img('1763581616094-c1b4097972d4', 1200, 500),
    coverAlt: 'A cold spring pool in a lush volcanic forest',
    transport: 'Scooter loop (₱350)',
    activities: [
      { time: '08:00', title: 'Sto. Nino cold spring', description: 'An icy volcanic spring bubbling up through white sand.', cost: 30, category: 'attraction' },
      { time: '10:00', title: 'Katibawasan Falls', description: 'A 70m ribbon fall into a cold jungle pool.', cost: 30, category: 'attraction' },
      { time: '13:00', title: 'Lunch by the sea', description: 'Grilled fish with the volcano at your back.', cost: 250, category: 'food' },
      { time: '16:00', title: 'Ardent hot springs', description: 'Warm volcanic pools to end the island day.', cost: 100, category: 'attraction' },
    ],
  },
  {
    day: 22, date: 'Apr 27', city: 'Boracay — White Beach',
    coverImage: img('1697135756100-7b610c8fe92e', 1200, 500),
    coverAlt: 'A long white-sand beach lined with palms and boats',
    transport: 'Fly to Caticlan + boat (₱3,500)',
    activities: [
      { time: '08:00', title: 'Fly to Boracay', description: 'To the country\'s most famous four-kilometre beach.', cost: 3500, category: 'transport' },
      { time: '13:00', title: 'White Beach stroll', description: 'Powder-fine sand from Station 1 to Station 3.', cost: 0, category: 'attraction' },
      { time: '15:00', title: 'Puka Shell Beach', description: 'A quieter northern beach of coarse white shell sand.', cost: 100, category: 'attraction' },
      { time: '18:00', title: 'Sunset & D\'Talipapa', description: 'Pick your seafood at the wet market and have it grilled.', cost: 600, category: 'food' },
    ],
  },
  {
    day: 23, date: 'Apr 28', city: 'Boracay — Sail & Hop',
    coverImage: img('1697135756100-7b610c8fe92e', 1200, 500),
    coverAlt: 'A traditional paraw sailboat on a bright turquoise sea',
    transport: 'Paraw & bangka (₱1,200)',
    activities: [
      { time: '09:00', title: 'Island hopping', description: 'Crystal Cove, Crocodile Island, and reef snorkel stops.', cost: 1200, category: 'attraction' },
      { time: '13:00', title: 'Boat lunch', description: 'Grilled pork and mango on the water.', cost: 0, category: 'food' },
      { time: '15:00', title: 'Helmet diving or kite', description: 'Walk the seabed or ride the wind off Bulabog.', cost: 800, category: 'attraction' },
      { time: '17:30', title: 'Paraw sunset sail', description: 'A traditional outrigger sailboat into the sinking sun.', cost: 500, category: 'attraction' },
    ],
  },
  {
    day: 24, date: 'Apr 29', city: 'Manila — Old & New',
    coverImage: img('1771533679967-1b6f3a10be02', 1200, 500),
    coverAlt: 'The stone walls and old church of Intramuros, Manila',
    transport: 'Fly to Manila (₱2,500)',
    activities: [
      { time: '08:00', title: 'Fly to the capital', description: 'North to the sprawling, layered heart of the country.', cost: 2500, category: 'transport' },
      { time: '12:00', title: 'Intramuros walled city', description: 'Fort Santiago and San Agustin, the old Spanish citadel.', cost: 200, category: 'attraction' },
      { time: '15:00', title: 'National Museum', description: 'Spoliarium and the treasures of the Philippine story.', cost: 0, category: 'attraction' },
      { time: '19:00', title: 'Dinner — kamayan feast', description: 'A hands-on banana-leaf spread of Filipino classics.', cost: 500, category: 'food' },
    ],
  },
  {
    day: 25, date: 'Apr 30', city: 'Banaue — Rice Terraces',
    coverImage: img('1763581616094-c1b4097972d4', 1200, 500),
    coverAlt: 'Ancient rice terraces stepping up steep green mountains',
    transport: 'Night coach to the Cordillera (₱1,200)',
    activities: [
      { time: '07:00', title: 'Arrive the highlands', description: 'Wake in the mountains after the overnight climb north.', cost: 1200, category: 'transport' },
      { time: '10:00', title: 'Banaue viewpoint', description: 'The 2,000-year-old Ifugao terraces, an "eighth wonder".', cost: 50, category: 'attraction' },
      { time: '13:00', title: 'Lunch — pinikpikan', description: 'A smoky Cordillera chicken broth with etag pork.', cost: 250, category: 'food' },
      { time: '16:00', title: 'Tam-an village', description: 'Ifugao houses and wood carvers below the terraces.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 26, date: 'May 1', city: 'Batad — Amphitheatre Terraces',
    coverImage: img('1763581616094-c1b4097972d4', 1200, 500),
    coverAlt: 'A vast amphitheatre of stone-walled rice terraces',
    transport: 'Jeep + trek to Batad (₱800)',
    activities: [
      { time: '07:00', title: 'Trek into Batad', description: 'A hike to the stone-walled terraces curved like a great amphitheatre.', cost: 800, category: 'transport' },
      { time: '11:00', title: 'Tappiya Falls', description: 'A steep descent to a powerful fall below the village.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Village homestay lunch', description: 'Rice and greens grown on the terraces themselves.', cost: 200, category: 'food' },
      { time: '17:00', title: 'Terrace sunset', description: 'The stone walls glow as the valley falls into shadow.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 27, date: 'May 2', city: 'Sagada — Hanging Coffins',
    coverImage: img('1763581616094-c1b4097972d4', 1200, 500),
    coverAlt: 'Wooden coffins hung on a limestone cliff in a gorge',
    transport: 'Mountain road to Sagada (₱600)',
    activities: [
      { time: '08:00', title: 'Drive to Sagada', description: 'Across the Cordillera to the cool pine-clad Igorot town.', cost: 600, category: 'transport' },
      { time: '11:00', title: 'Echo Valley hanging coffins', description: 'Coffins fixed high on the cliffs in an ancient burial rite.', cost: 100, category: 'attraction' },
      { time: '13:00', title: 'Lunch — Sagada yoghurt & pinuneg', description: 'Mountain yoghurt and blood sausage in a cosy cafe.', cost: 250, category: 'food' },
      { time: '15:00', title: 'Sumaguing Cave', description: 'A muddy scramble through a vast limestone cavern.', cost: 500, category: 'attraction' },
    ],
  },
  {
    day: 28, date: 'May 3', city: 'Vigan — Spanish Colonial',
    coverImage: img('1771533679967-1b6f3a10be02', 1200, 500),
    coverAlt: 'A cobbled colonial street of old Spanish mansions at dusk',
    transport: 'Descend to the coast (₱700)',
    activities: [
      { time: '08:00', title: 'Down to the lowlands', description: 'West off the mountains to the coastal town of Vigan.', cost: 700, category: 'transport' },
      { time: '12:00', title: 'Calle Crisologo', description: 'A cobbled street of preserved Spanish-era mestizo houses.', cost: 0, category: 'attraction' },
      { time: '14:00', title: 'Lunch — Vigan empanada', description: 'A crisp orange empanada with longganisa and egg.', cost: 150, category: 'food' },
      { time: '18:00', title: 'Kalesa & dancing fountain', description: 'A horse-cart ride and the evening plaza show.', cost: 200, category: 'attraction' },
    ],
  },
  {
    day: 29, date: 'May 4', city: 'Return to Palawan — Coron',
    coverImage: img('1697473259118-473211915531', 1200, 500),
    coverAlt: 'A small plane over the karst islands of Coron',
    transport: 'Fly via Manila to Coron (₱4,000)',
    activities: [
      { time: '07:00', title: 'Fly back to the islands', description: 'South via Manila to close the loop in Palawan.', cost: 4000, category: 'transport' },
      { time: '15:00', title: 'Maquinit hot springs', description: 'A warm saltwater soak in the mangroves after the journey.', cost: 200, category: 'attraction' },
      { time: '17:30', title: 'Mount Tapyas sunset', description: 'Climb 700 steps to the hilltop cross over Coron town.', cost: 0, category: 'attraction' },
      { time: '19:30', title: 'Dinner — kinilaw & sisig', description: 'A last Filipino feast on the waterfront.', cost: 400, category: 'food' },
    ],
  },
  {
    day: 30, date: 'May 5', city: 'Coron — Farewell',
    coverImage: img('1771533679967-1b6f3a10be02', 1200, 500),
    coverAlt: 'Jagged green islands in the Philippine sea',
    transport: 'Airport van (₱300)',
    activities: [
      { time: '08:00', title: 'Mount Tapyas sunrise', description: 'Climb 700 steps to the giant hilltop cross over the harbour.', cost: 0, category: 'attraction' },
      { time: '10:00', title: 'Coron town market', description: 'Dried fish, pearls, and cashews down the busy port lanes.', cost: 300, category: 'other' },
      { time: '12:00', title: 'Lunch — kinilaw & sinigang', description: 'Ceviche-style raw fish and a sour tamarind soup.', cost: 350, category: 'food' },
      { time: '15:00', title: 'Departure — paalam', description: 'To the little island airport, sun-drunk and salty. Salamat, Philippines.', cost: 300, category: 'transport' },
    ],
  },
]

// ─── Malaysia ──────────────────────────────────────────────────────────

const MALAYSIA_ITINERARY: Day[] = [
  {
    day: 1, date: 'Apr 12', city: 'Kuala Lumpur — City of Towers',
    coverImage: img('1506320775314-84c60bff00ff', 1200, 500),
    coverAlt: 'The Petronas Twin Towers rising into the sky',
    transport: 'KLIA Ekspres → city (RM55)',
    activities: [
      { time: '13:00', title: 'Arrive KL', description: 'Land in the melting-pot capital and ride the express train into town.', cost: 55, category: 'transport' },
      { time: '15:00', title: 'Petronas Twin Towers', description: 'Up the skybridge and deck of the silver towers that defined the skyline.', cost: 98, category: 'attraction' },
      { time: '17:30', title: 'KLCC Park & fountains', description: 'The tower reflected in the lake as the light-and-water show begins.', cost: 0, category: 'attraction' },
      { time: '19:30', title: 'Jalan Alor street food', description: 'Char kway teow, satay, and durian down the neon hawker lane.', cost: 45, category: 'food' },
    ],
  },
  {
    day: 2, date: 'Apr 13', city: 'KL — Caves & Culture',
    coverImage: img('1597148543182-830ef7bbb904', 1200, 500),
    coverAlt: 'The Kuala Lumpur skyline at night',
    transport: 'KTM Komuter & Grab (RM40)',
    activities: [
      { time: '08:00', title: 'Batu Caves', description: 'A giant golden Murugan and 272 rainbow steps into a limestone cave temple.', cost: 0, category: 'attraction' },
      { time: '11:00', title: 'Merdeka Square & old KL', description: 'Mughal-style colonial facades around the independence field.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch — nasi lemak', description: 'The national dish: coconut rice, sambal, anchovies, and egg in banana leaf.', cost: 15, category: 'food' },
      { time: '15:00', title: 'Islamic Arts Museum', description: 'Domes, textiles, and manuscripts in one of Asia\'s finest collections.', cost: 20, category: 'attraction' },
      { time: '19:00', title: 'Heli Lounge rooftop', description: 'Sunset drinks on an actual helipad ringed by skyscrapers.', cost: 50, category: 'food' },
    ],
  },
  {
    day: 3, date: 'Apr 14', city: 'Penang — George Town',
    coverImage: img('1585031039436-16a906da2f05', 1200, 500),
    coverAlt: 'A busy street beneath high-rises in Malaysia',
    transport: 'Flight KL → Penang (RM120)',
    activities: [
      { time: '08:00', title: 'Fly to Penang', description: 'North to the food capital and heritage streets of George Town.', cost: 120, category: 'transport' },
      { time: '11:00', title: 'Street art & clan jetties', description: 'The famous wall murals and stilt villages of the old waterfront clans.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Char kway teow crawl', description: 'Penang\'s smoky wok-fried noodles, the best in the country.', cost: 12, category: 'food' },
      { time: '15:30', title: 'Kek Lok Si Temple', description: 'A hillside pagoda blending Chinese, Thai, and Burmese styles.', cost: 0, category: 'attraction' },
      { time: '18:00', title: 'Penang Hill funicular', description: 'Ride to the cool summit for the sunset over the strait.', cost: 30, category: 'attraction' },
    ],
  },
  {
    day: 4, date: 'Apr 15', city: 'Penang — Food & Heritage',
    coverImage: img('1585835310560-5b850cc2b771', 1200, 500),
    coverAlt: 'A Peranakan mansion interior of teak and coloured tiles',
    transport: 'Walking George Town (RM0)',
    activities: [
      { time: '08:00', title: 'Wet market breakfast', description: 'Dim sum and kaya toast among the morning traders.', cost: 15, category: 'food' },
      { time: '10:00', title: 'Pinang Peranakan Mansion', description: 'The lavish teak-and-tile home of a Straits Chinese magnate.', cost: 25, category: 'attraction' },
      { time: '13:00', title: 'Assam laksa & cendol', description: 'Tangy tamarind fish noodles and shaved-ice dessert.', cost: 14, category: 'food' },
      { time: '16:00', title: 'Khoo Kongsi clan house', description: 'The most ornate Chinese clan temple in the country.', cost: 15, category: 'attraction' },
    ],
  },
  {
    day: 5, date: 'Apr 16', city: 'Langkawi — Island of Legends',
    coverImage: img('1585031039436-16a906da2f05', 1200, 500),
    coverAlt: 'Cable cars rising over rainforest to a sky bridge',
    transport: 'Ferry to Langkawi (RM70)',
    activities: [
      { time: '08:00', title: 'Ferry north to Langkawi', description: 'Across to the duty-free archipelago near the Thai border.', cost: 70, category: 'transport' },
      { time: '13:00', title: 'SkyCab & Sky Bridge', description: 'A steep cable car to a curved bridge slung over the rainforest.', cost: 85, category: 'attraction' },
      { time: '16:00', title: 'Eagle Square', description: 'The giant reddish-brown eagle that gives the island its name.', cost: 0, category: 'attraction' },
      { time: '19:00', title: 'Pantai Cenang dinner', description: 'Grilled seafood on the main beach strip.', cost: 40, category: 'food' },
    ],
  },
  {
    day: 6, date: 'Apr 17', city: 'Langkawi — Mangroves & Bays',
    coverImage: img('1585031039436-16a906da2f05', 1200, 500),
    coverAlt: 'A boat winding through a limestone mangrove river',
    transport: 'Mangrove boat tour (RM60)',
    activities: [
      { time: '08:00', title: 'Kilim Geoforest mangroves', description: 'A boat through karst mangroves of eagles, otters, and bat caves.', cost: 60, category: 'attraction' },
      { time: '11:00', title: 'Fish farm & eagle feeding', description: 'Brahminy kites wheeling over the estuary.', cost: 20, category: 'attraction' },
      { time: '13:00', title: 'Lunch — nasi campur', description: 'A mixed-rice plate at a floating restaurant.', cost: 18, category: 'food' },
      { time: '16:00', title: 'Tanjung Rhu beach', description: 'A quiet northern spit of pale sand and shallow water.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 7, date: 'Apr 18', city: 'Langkawi — Island Hopping',
    coverImage: img('1585031039436-16a906da2f05', 1200, 500),
    coverAlt: 'Small tropical islands scattered in a calm blue sea',
    transport: 'Speedboat hopping (RM45)',
    activities: [
      { time: '09:00', title: 'Pregnant Maiden Lake', description: 'A freshwater lake on an island, said to aid fertility.', cost: 45, category: 'attraction' },
      { time: '11:00', title: 'Beras Basah island', description: 'A powder-sand islet for a swim and a coconut.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Seafood lunch', description: 'Chilli prawns back on Pantai Tengah.', cost: 40, category: 'food' },
      { time: '18:00', title: 'Sunset cruise', description: 'A catamaran into the Andaman sunset.', cost: 90, category: 'attraction' },
    ],
  },
  {
    day: 8, date: 'Apr 19', city: 'Ipoh — Caves & White Coffee',
    coverImage: img('1585835310560-5b850cc2b771', 1200, 500),
    coverAlt: 'A cave temple set into a limestone cliff near a town',
    transport: 'Ferry back + drive to Ipoh (RM90)',
    activities: [
      { time: '08:00', title: 'To the tin-mining town', description: 'Back to the mainland and inland to genteel old Ipoh.', cost: 90, category: 'transport' },
      { time: '13:00', title: 'Sam Poh Tong cave temple', description: 'A Buddhist temple built inside a limestone cavern.', cost: 0, category: 'attraction' },
      { time: '15:00', title: 'Ipoh white coffee', description: 'The town\'s famous palm-margarine-roasted coffee in an old kopitiam.', cost: 8, category: 'food' },
      { time: '17:00', title: 'Old town murals', description: 'Concubine Lane and the heritage streets of shophouses.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 9, date: 'Apr 20', city: 'Cameron Highlands — Tea Country',
    coverImage: img('1585031039436-16a906da2f05', 1200, 500),
    coverAlt: 'Rolling green tea plantations on misty highland slopes',
    transport: 'Winding road up (RM50)',
    activities: [
      { time: '08:00', title: 'Climb to the highlands', description: 'Up switchbacks to the cool colonial hill station.', cost: 50, category: 'transport' },
      { time: '11:00', title: 'BOH tea plantation', description: 'Emerald tea terraces and a cup on a cantilevered deck.', cost: 20, category: 'attraction' },
      { time: '13:00', title: 'Steamboat lunch', description: 'A highland hotpot in the cool mountain air.', cost: 35, category: 'food' },
      { time: '16:00', title: 'Strawberry & bee farms', description: 'Pick-your-own berries and highland honey.', cost: 15, category: 'attraction' },
    ],
  },
  {
    day: 10, date: 'Apr 21', city: 'Cameron Highlands — Mossy Forest',
    coverImage: img('1585031039436-16a906da2f05', 1200, 500),
    coverAlt: 'A misty highland forest draped in green moss',
    transport: 'Jeep to the summit trail (RM60)',
    activities: [
      { time: '07:00', title: 'Gunung Brinchang mossy forest', description: 'A boardwalk through a cloud forest dripping with moss.', cost: 60, category: 'attraction' },
      { time: '10:00', title: 'Mardi rose garden', description: 'Terraced flower gardens on the highest slopes.', cost: 10, category: 'attraction' },
      { time: '13:00', title: 'Scones & tea', description: 'A very British highland afternoon tea.', cost: 20, category: 'food' },
      { time: '15:30', title: 'Sam Poh temple & market', description: 'A hilltop temple and the night-market stalls.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 11, date: 'Apr 22', city: 'Taman Negara — Ancient Rainforest',
    coverImage: img('1569878698898-3d112b16d123', 1200, 500),
    coverAlt: 'A longboat on a jungle river in dense rainforest',
    transport: 'Road + longboat (RM120)',
    activities: [
      { time: '07:00', title: 'Cross to the jungle', description: 'To one of the oldest rainforests on earth, 130 million years old.', cost: 120, category: 'transport' },
      { time: '13:00', title: 'Riverboat to the park', description: 'A longboat up the Tembeling into the green interior.', cost: 0, category: 'transport' },
      { time: '15:00', title: 'Jungle orientation walk', description: 'A first trail among giant tualang trees and buttress roots.', cost: 20, category: 'attraction' },
      { time: '20:00', title: 'Night jungle safari', description: 'Spotlight for tapir, deer, and glowing eyes in the dark.', cost: 40, category: 'attraction' },
    ],
  },
  {
    day: 12, date: 'Apr 23', city: 'Taman Negara — Canopy & Rapids',
    coverImage: img('1569878698898-3d112b16d123', 1200, 500),
    coverAlt: 'A rope canopy walkway high in the rainforest trees',
    transport: 'Park longboat & trek (RM50)',
    activities: [
      { time: '08:00', title: 'Canopy walkway', description: 'The world\'s longest canopy bridge, swaying 40m up.', cost: 20, category: 'attraction' },
      { time: '10:30', title: 'Bukit Teresek climb', description: 'A sweaty trail to a viewpoint over the endless canopy.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Orang Asli village', description: 'Meet the indigenous Batek and try their blowpipe.', cost: 30, category: 'attraction' },
      { time: '16:00', title: 'River rapids ride', description: 'A longboat splash up seven sets of rapids.', cost: 50, category: 'attraction' },
    ],
  },
  {
    day: 13, date: 'Apr 24', city: 'Kuala Lumpur — Culture Return',
    coverImage: img('1597148543182-830ef7bbb904', 1200, 500),
    coverAlt: 'A vividly painted Chinese temple in Kuala Lumpur',
    transport: 'Drive back to KL (RM100)',
    activities: [
      { time: '08:00', title: 'Return to the capital', description: 'Out of the jungle and back to the city of towers.', cost: 100, category: 'transport' },
      { time: '13:00', title: 'Thean Hou Temple', description: 'A six-tier Chinese temple of red lanterns on a hill.', cost: 0, category: 'attraction' },
      { time: '15:00', title: 'Central Market & Kasturi Walk', description: 'Batik, pewter, and crafts in an art-deco hall.', cost: 0, category: 'other' },
      { time: '18:00', title: 'Petronas by night', description: 'The silver towers ablaze over the KLCC fountains.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 14, date: 'Apr 25', city: 'Malacca — Historic Port',
    coverImage: img('1585835310560-5b850cc2b771', 1200, 500),
    coverAlt: 'A red Dutch church above a square in old Malacca',
    transport: 'Coach south to Malacca (RM40)',
    activities: [
      { time: '08:00', title: 'South to the strait', description: 'To the UNESCO port that Portuguese, Dutch, and British all prized.', cost: 40, category: 'transport' },
      { time: '12:00', title: 'Dutch Square & A Famosa', description: 'The rust-red Stadthuys and a Portuguese fort gate.', cost: 0, category: 'attraction' },
      { time: '14:00', title: 'St Paul\'s Hill', description: 'A ruined church with a view over the historic river mouth.', cost: 0, category: 'attraction' },
      { time: '18:00', title: 'Jonker Street night market', description: 'Nyonya laksa, chicken-rice balls, and durian puffs.', cost: 30, category: 'food' },
    ],
  },
  {
    day: 15, date: 'Apr 26', city: 'Malacca — Peranakan Heart',
    coverImage: img('1585835310560-5b850cc2b771', 1200, 500),
    coverAlt: 'A colourful trishaw decked in flowers on a heritage street',
    transport: 'Walking & river boat (RM30)',
    activities: [
      { time: '09:00', title: 'Baba & Nyonya Museum', description: 'A grand Straits-Chinese townhouse frozen in its heyday.', cost: 25, category: 'attraction' },
      { time: '11:00', title: 'Cheng Hoon Teng temple', description: 'The oldest functioning Chinese temple in the country.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch — Nyonya cuisine', description: 'Ayam pongteh and pineapple prawn curry, the fusion cooking born here.', cost: 35, category: 'food' },
      { time: '17:00', title: 'Malacca River cruise', description: 'Muralled riverbanks lit up in the evening.', cost: 30, category: 'transport' },
    ],
  },
  {
    day: 16, date: 'Apr 27', city: 'Perhentian — Island Paradise',
    coverImage: img('1585031039436-16a906da2f05', 1200, 500),
    coverAlt: 'A palm-fringed white beach and clear turquoise water',
    transport: 'Flight + boat to the east coast (RM250)',
    activities: [
      { time: '07:00', title: 'Cross to the east coast', description: 'Fly and boat to the pristine islands of the South China Sea.', cost: 250, category: 'transport' },
      { time: '13:00', title: 'Long Beach', description: 'Squeaky white sand and gin-clear shallows on the backpacker isle.', cost: 0, category: 'attraction' },
      { time: '15:00', title: 'Snorkel the house reef', description: 'Blacktip reef sharks patrol just off the beach.', cost: 40, category: 'attraction' },
      { time: '18:30', title: 'Beach barbecue', description: 'Grilled fish and a fire show on the sand.', cost: 35, category: 'food' },
    ],
  },
  {
    day: 17, date: 'Apr 28', city: 'Perhentian — Turtles & Reefs',
    coverImage: img('1585031039436-16a906da2f05', 1200, 500),
    coverAlt: 'A green turtle swimming over a coral reef',
    transport: 'Snorkel boat tour (RM50)',
    activities: [
      { time: '08:00', title: 'Turtle Point', description: 'Swim above grazing green turtles in the warm bay.', cost: 50, category: 'attraction' },
      { time: '10:30', title: 'Coral Bay & Shark Point', description: 'Reef gardens, clownfish, and cruising sharks.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Island lunch', description: 'Nasi goreng at a small beach kitchen.', cost: 15, category: 'food' },
      { time: '16:00', title: 'Jungle-trail crossing', description: 'A forest walk between the island\'s two main beaches.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 18, date: 'Apr 29', city: 'Kuala Terengganu — Malay Coast',
    coverImage: img('1585835310560-5b850cc2b771', 1200, 500),
    coverAlt: 'A crystal mosque appearing to float on the water',
    transport: 'Boat + drive to KT (RM90)',
    activities: [
      { time: '08:00', title: 'Back to the mainland', description: 'To the devoutly Malay heartland of the east coast.', cost: 90, category: 'transport' },
      { time: '12:00', title: 'Crystal Mosque', description: 'A steel-and-glass mosque that seems to float on the lagoon.', cost: 0, category: 'attraction' },
      { time: '14:00', title: 'Chinatown & Payang market', description: 'Batik, songket, and keropok fish crackers by the river.', cost: 20, category: 'other' },
      { time: '18:00', title: 'Lunch — nasi dagang', description: 'Coconut rice with tuna curry, the east-coast breakfast classic.', cost: 12, category: 'food' },
    ],
  },
  {
    day: 19, date: 'Apr 30', city: 'Kota Bharu — Kelantan Culture',
    coverImage: img('1585835310560-5b850cc2b771', 1200, 500),
    coverAlt: 'A busy covered market with women traders and produce',
    transport: 'Drive north to Kota Bharu (RM60)',
    activities: [
      { time: '08:00', title: 'Siti Khadijah market', description: 'A vivid women-run market under a spiral of ramps.', cost: 0, category: 'attraction' },
      { time: '11:00', title: 'Handicraft villages', description: 'Kite-making, batik, and songket weaving in the kampongs.', cost: 15, category: 'attraction' },
      { time: '13:00', title: 'Lunch — nasi kerabu', description: 'A striking blue herb rice with fish and salad.', cost: 10, category: 'food' },
      { time: '16:00', title: 'Wat Machimmaram', description: 'A giant seated Buddha at a Thai temple in Malay Kelantan.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 20, date: 'May 1', city: 'Kuching — Borneo Gateway',
    coverImage: img('1569878698898-3d112b16d123', 1200, 500),
    coverAlt: 'A riverfront city with a golden state assembly building',
    transport: 'Fly to Sarawak, Borneo (RM300)',
    activities: [
      { time: '08:00', title: 'Fly to Borneo', description: 'Across the sea to the "cat city" on the Sarawak River.', cost: 300, category: 'transport' },
      { time: '13:00', title: 'Waterfront & old bazaar', description: 'Chinese shophouses and the Astana across the water.', cost: 0, category: 'attraction' },
      { time: '15:00', title: 'Sarawak Museum', description: 'The natural history and indigenous cultures of Borneo.', cost: 0, category: 'attraction' },
      { time: '19:00', title: 'Dinner — Sarawak laksa', description: 'A prawn-and-sambal laksa Anthony Bourdain called a breakfast of gods.', cost: 12, category: 'food' },
    ],
  },
  {
    day: 21, date: 'May 2', city: 'Bako — Proboscis Monkeys',
    coverImage: img('1569878698898-3d112b16d123', 1200, 500),
    coverAlt: 'A long-nosed proboscis monkey in a mangrove tree',
    transport: 'Boat to Bako park (RM50)',
    activities: [
      { time: '07:00', title: 'Boat to Bako', description: 'A skiff along the coast to Sarawak\'s oldest national park.', cost: 50, category: 'transport' },
      { time: '09:00', title: 'Rainforest trek', description: 'Trails past pitcher plants to sea-stack viewpoints.', cost: 20, category: 'attraction' },
      { time: '13:00', title: 'Ranger-station lunch', description: 'A simple meal watched by cheeky macaques.', cost: 15, category: 'food' },
      { time: '16:00', title: 'Proboscis monkeys', description: 'The bizarre big-nosed, pot-bellied monkeys in the mangroves.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 22, date: 'May 3', city: 'Kuching — Orangutans & Culture',
    coverImage: img('1569878698898-3d112b16d123', 1200, 500),
    coverAlt: 'A wild orangutan on a feeding platform in the jungle',
    transport: 'Van to Semenggoh (RM40)',
    activities: [
      { time: '07:00', title: 'Semenggoh orangutans', description: 'Semi-wild orangutans swinging in for the morning feeding.', cost: 10, category: 'attraction' },
      { time: '11:00', title: 'Sarawak Cultural Village', description: 'Longhouses of the Iban, Bidayuh, and Orang Ulu peoples.', cost: 50, category: 'attraction' },
      { time: '13:00', title: 'Lunch — kolo mee', description: 'Springy dry-tossed egg noodles with char siu.', cost: 8, category: 'food' },
      { time: '16:00', title: 'Annah Rais longhouse', description: 'A Bidayuh bamboo longhouse still lived in today.', cost: 30, category: 'attraction' },
    ],
  },
  {
    day: 23, date: 'May 4', city: 'Mulu — Caves of Giants',
    coverImage: img('1569878698898-3d112b16d123', 1200, 500),
    coverAlt: 'The vast dark mouth of an enormous limestone cave',
    transport: 'Fly to Mulu (RM350)',
    activities: [
      { time: '08:00', title: 'Fly to Gunung Mulu', description: 'Over the jungle to the UNESCO cave park, reachable only by air.', cost: 350, category: 'transport' },
      { time: '13:00', title: 'Deer Cave', description: 'One of the largest cave passages on earth, big enough for a cathedral.', cost: 30, category: 'attraction' },
      { time: '15:00', title: 'Lang Cave formations', description: 'Delicate stalactites lit in the neighbouring chamber.', cost: 0, category: 'attraction' },
      { time: '17:30', title: 'Bat exodus', description: 'Millions of wrinkle-lipped bats spiral out into the dusk.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 24, date: 'May 5', city: 'Mulu — Clearwater & Canopy',
    coverImage: img('1569878698898-3d112b16d123', 1200, 500),
    coverAlt: 'An underground river flowing from a cave into jungle',
    transport: 'Longboat up the river (RM60)',
    activities: [
      { time: '08:00', title: 'Wind & Clearwater caves', description: 'A longboat to a river cave system carved over eons.', cost: 60, category: 'attraction' },
      { time: '11:00', title: 'Riverside swim', description: 'A dip in the cold clear pool at the cave mouth.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Penan craft stop', description: 'Rattan handicrafts of the nomadic forest people.', cost: 20, category: 'other' },
      { time: '15:00', title: 'Canopy skywalk', description: 'A 480m treetop walkway through the rainforest.', cost: 40, category: 'attraction' },
    ],
  },
  {
    day: 25, date: 'May 6', city: 'Kota Kinabalu — Sabah Coast',
    coverImage: img('1585031039436-16a906da2f05', 1200, 500),
    coverAlt: 'A fiery sunset over islands off a Borneo city waterfront',
    transport: 'Fly to Kota Kinabalu (RM300)',
    activities: [
      { time: '08:00', title: 'Fly to Sabah', description: 'North across Borneo to the capital beneath Mount Kinabalu.', cost: 300, category: 'transport' },
      { time: '13:00', title: 'Signal Hill & old town', description: 'A lookout over the sea-facing city and its markets.', cost: 0, category: 'attraction' },
      { time: '16:00', title: 'Mari Mari cultural village', description: 'Live demonstrations of Sabah\'s indigenous longhouse life.', cost: 90, category: 'attraction' },
      { time: '18:30', title: 'Waterfront sunset seafood', description: 'Butter prawns and famed KK sunset over the islands.', cost: 50, category: 'food' },
    ],
  },
  {
    day: 26, date: 'May 7', city: 'Kinabalu Park — Mountain Foot',
    coverImage: img('1569878698898-3d112b16d123', 1200, 500),
    coverAlt: 'The granite peak of Mount Kinabalu above cloud forest',
    transport: 'Drive to the park (RM80)',
    activities: [
      { time: '07:00', title: 'Up to Kinabalu Park', description: 'To the foot of Borneo\'s highest peak and its UNESCO flora.', cost: 80, category: 'transport' },
      { time: '10:00', title: 'Botanical garden walk', description: 'Wild orchids and pitcher plants on the mountain trails.', cost: 20, category: 'attraction' },
      { time: '13:00', title: 'Highland lunch', description: 'Bamboo-cooked chicken with the peak looming above.', cost: 25, category: 'food' },
      { time: '16:00', title: 'Poring hot springs', description: 'A soak in sulphur pools and a rainforest canopy walk.', cost: 15, category: 'attraction' },
    ],
  },
  {
    day: 27, date: 'May 8', city: 'Semporna — Diver\'s Dream',
    coverImage: img('1585031039436-16a906da2f05', 1200, 500),
    coverAlt: 'Stilt water villages over a turquoise sea in eastern Sabah',
    transport: 'Fly + drive to Semporna (RM250)',
    activities: [
      { time: '07:00', title: 'Cross to the east coast', description: 'To the jump-off town for the legendary Sipadan reefs.', cost: 250, category: 'transport' },
      { time: '13:00', title: 'Bajau stilt villages', description: 'Sea-gypsy communities living entirely over the water.', cost: 0, category: 'attraction' },
      { time: '15:00', title: 'Semporna waterfront', description: 'Prep for tomorrow\'s dive over grilled seafood.', cost: 40, category: 'food' },
      { time: '18:00', title: 'Island homestay', description: 'A night on a tiny reef island under the stars.', cost: 200, category: 'accommodation' },
    ],
  },
  {
    day: 28, date: 'May 9', city: 'Sipadan — Wall of Life',
    coverImage: img('1585031039436-16a906da2f05', 1200, 500),
    coverAlt: 'A swirling tornado of barracuda over a coral drop-off',
    transport: 'Dive boat to the reefs (RM0, incl.)',
    activities: [
      { time: '06:00', title: 'Sipadan dive', description: 'A 600m coral wall of turtles, sharks, and a barracuda tornado.', cost: 600, category: 'attraction' },
      { time: '11:00', title: 'Mabul macro reef', description: 'Muck-diving for frogfish and flamboyant cuttlefish.', cost: 0, category: 'attraction' },
      { time: '13:00', title: 'Lunch on Kapalai', description: 'A stilt-resort meal over a sandbank reef.', cost: 40, category: 'food' },
      { time: '16:00', title: 'Last snorkel', description: 'A final drift over the coral of eastern Borneo.', cost: 0, category: 'attraction' },
    ],
  },
  {
    day: 29, date: 'May 10', city: 'Return to Penang',
    coverImage: img('1506320775314-84c60bff00ff', 1200, 500),
    coverAlt: 'A plane window view over the Malaysian coastline',
    transport: 'Fly via KL to Penang (RM400)',
    activities: [
      { time: '08:00', title: 'Fly back to the peninsula', description: 'Across the sea from Borneo to close the loop in George Town.', cost: 400, category: 'transport' },
      { time: '15:00', title: 'Armenian Street cafes', description: 'A last wander past the famous "Kids on Bicycle" mural.', cost: 15, category: 'attraction' },
      { time: '17:00', title: 'Penang Hill funicular', description: 'A final ride up for the sunset over the strait.', cost: 30, category: 'attraction' },
      { time: '19:30', title: 'Gurney Drive hawker feast', description: 'One more round of char kway teow and rojak by the sea.', cost: 25, category: 'food' },
    ],
  },
  {
    day: 30, date: 'May 11', city: 'Penang — Farewell',
    coverImage: img('1585835310560-5b850cc2b771', 1200, 500),
    coverAlt: 'City buildings under a blue sky in Malaysia',
    transport: 'Airport taxi (RM45)',
    activities: [
      { time: '08:00', title: 'Wet market breakfast', description: 'Dim sum and kaya toast among the morning traders.', cost: 15, category: 'food' },
      { time: '10:00', title: 'Peranakan Mansion', description: 'The lavish teak-and-tile home of the Straits Chinese elite.', cost: 25, category: 'attraction' },
      { time: '12:00', title: 'Assam laksa & cendol', description: 'Tangy tamarind fish noodles and shaved-ice dessert to finish.', cost: 14, category: 'food' },
      { time: '15:00', title: 'Departure — jumpa lagi', description: 'To the airport, spice-fed and happy. Terima kasih, Malaysia.', cost: 45, category: 'transport' },
    ],
  },
]

// ─── Cinematic hero videos ──────────────────────────────────────────────
// A distinct landscape clip per itinerary landmark, keyed by a normalized
// slug of the day's city (e.g. "ha-long-bay"). A per-country fallback catches
// days without a specific clip, and if neither exists the hero falls back to
// the day's cover image — so the banner is never broken.
const DAY_VIDEO: Record<string, string> = {
  'tokyo-arrival-shinjuku': 'https://videos.pexels.com/video-files/19408337/19408337-hd_1920_1080_50fps.mp4',
  'tokyo-asakusa-akihabara': 'https://videos.pexels.com/video-files/32979943/14055962_1366_720_25fps.mp4',
  'tokyo-harajuku-shibuya-roppongi': 'https://videos.pexels.com/video-files/17422380/17422380-hd_1920_1080_60fps.mp4',
  'tokyo-ueno-ginza-teamlab': 'https://videos.pexels.com/video-files/37514850/15893658_1920_1080_30fps.mp4',
  'nikko-day-trip': 'https://videos.pexels.com/video-files/31233132/13340553_1920_1080_24fps.mp4',
  'kamakura-enoshima-day-trip': 'https://videos.pexels.com/video-files/6891916/6891916-hd_1920_1080_30fps.mp4',
  'hakone-mt-fuji-open-air-art': 'https://videos.pexels.com/video-files/10451691/10451691-hd_1920_1080_30fps.mp4',
  'kawaguchiko-fuji-five-lakes': 'https://videos.pexels.com/video-files/6602522/6602522-hd_1920_1080_30fps.mp4',
  'matsumoto-castle-alps-gateway': 'https://videos.pexels.com/video-files/15809475/15809475-hd_1920_1080_30fps.mp4',
  'kamikochi-alpine-valley': 'https://videos.pexels.com/video-files/34338786/14547473_1920_1080_30fps.mp4',
  'takayama-old-town-markets': 'https://videos.pexels.com/video-files/34654580/14688981_1920_1080_50fps.mp4',
  'shirakawa-go-gassho-villages': 'https://videos.pexels.com/video-files/30379203/13019366_1920_1080_25fps.mp4',
  'kanazawa-kenroku-en-chaya': 'https://videos.pexels.com/video-files/37593714/15932804_1920_1080_60fps.mp4',
  'tateyama-kurobe-alpine-route': 'https://videos.pexels.com/video-files/37590733/15930954_1920_1080_30fps.mp4',
  'kyoto-arrival-gion': 'https://videos.pexels.com/video-files/38556433/16376721_1920_1080_30fps.mp4',
  'kyoto-higashiyama-kiyomizu': 'https://videos.pexels.com/video-files/32111755/13690441_1920_1080_60fps.mp4',
  'kyoto-arashiyama-nishiki': 'https://videos.pexels.com/video-files/32111766/13690411_1920_1080_60fps.mp4',
  'kyoto-golden-pavilion-zen': 'https://videos.pexels.com/video-files/38556529/16376682_1920_1080_30fps.mp4',
  'nara-deer-park-todai-ji': 'https://videos.pexels.com/video-files/32111776/13690421_1920_1080_60fps.mp4',
  'koyasan-temple-stay': 'https://videos.pexels.com/video-files/37593714/15932804_1920_1080_60fps.mp4',
  'osaka-castle-dotonbori': 'https://videos.pexels.com/video-files/6536428/6536428-hd_1920_1080_24fps.mp4',
  'himeji-kobe-castle-beef': 'https://videos.pexels.com/video-files/7418360/7418360-hd_1920_1080_30fps.mp4',
  'okayama-naoshima-art-island': 'https://videos.pexels.com/video-files/15809475/15809475-hd_1920_1080_30fps.mp4',
  'hiroshima-peace-memorial': 'https://videos.pexels.com/video-files/11023781/11023781-hd_1920_1080_30fps.mp4',
  'miyajima-floating-torii': 'https://videos.pexels.com/video-files/35095532/14868063_1920_1080_25fps.mp4',
  'sapporo-fly-north-to-hokkaido': 'https://videos.pexels.com/video-files/10805786/10805786-hd_1920_1080_30fps.mp4',
  'otaru-yoichi-canal-whisky': 'https://videos.pexels.com/video-files/15809475/15809475-hd_1920_1080_30fps.mp4',
  'furano-biei-flower-fields': 'https://videos.pexels.com/video-files/28957677/12528020_1920_1080_60fps.mp4',
  'sapporo-markets-mt-moiwa': 'https://videos.pexels.com/video-files/10805786/10805786-hd_1280_720_30fps.mp4',
  'tokyo-final-day-departure': 'https://videos.pexels.com/video-files/31319187/13369894_1920_1080_30fps.mp4',
  'hanoi-arrival-old-quarter': 'https://videos.pexels.com/video-files/4229438/4229438-hd_1366_720_24fps.mp4',
  'hanoi-culture-cuisine': 'https://videos.pexels.com/video-files/30356704/13012138_1920_1080_30fps.mp4',
  'ha-long-bay-overnight-cruise': 'https://videos.pexels.com/video-files/3120431/3120431-hd_1920_1080_24fps.mp4',
  'ninh-binh-trang-an-tam-coc': 'https://videos.pexels.com/video-files/30468323/13055784_1920_1080_60fps.mp4',
  'sapa-rice-terraces-hill-tribes': 'https://videos.pexels.com/video-files/34202935/14496768_1920_1080_30fps.mp4',
  'hue-imperial-citadel': 'https://videos.pexels.com/video-files/19441726/19441726-hd_1920_1080_30fps.mp4',
  'da-nang-golden-bridge-beach': 'https://videos.pexels.com/video-files/25748308/11905537_1920_1080_24fps.mp4',
  'hoi-an-lantern-old-town': 'https://videos.pexels.com/video-files/15692758/15692758-hd_1920_1080_24fps.mp4',
  'ho-chi-minh-city-saigon': 'https://videos.pexels.com/video-files/31111825/13294162_1920_1080_30fps.mp4',
  'can-tho-deep-mekong': 'https://videos.pexels.com/video-files/32455709/13841840_1920_1080_30fps.mp4',
  'chau-doc-sam-mountain': 'https://videos.pexels.com/video-files/37969260/16111571_1920_1080_60fps.mp4',
  'rach-gia-gulf-crossing': 'https://videos.pexels.com/video-files/30735414/13148344_1920_1080_30fps.mp4',
  'phu-quoc-island-arrival': 'https://videos.pexels.com/video-files/19018185/19018185-hd_1920_1080_25fps.mp4',
  'phu-quoc-beaches-pepper': 'https://videos.pexels.com/video-files/19018185/19018185-hd_1280_720_25fps.mp4',
  'phu-quoc-an-thoi-islands': 'https://videos.pexels.com/video-files/19018185/19018185-sd_960_540_25fps.mp4',
  'con-dao-wild-archipelago': 'https://videos.pexels.com/video-files/19018185/19018185-hd_1920_1080_25fps.mp4',
  'con-dao-reefs-turtles': 'https://videos.pexels.com/video-files/18131670/18131670-hd_1920_1080_30fps.mp4',
  'mui-ne-sand-sea': 'https://videos.pexels.com/video-files/20075088/20075088-hd_1920_1080_60fps.mp4',
  'mui-ne-dunes-kites': 'https://videos.pexels.com/video-files/20075088/20075088-hd_1280_720_60fps.mp4',
  'da-lat-city-of-eternal-spring': 'https://videos.pexels.com/video-files/32457470/13843667_1920_1080_60fps.mp4',
  'da-lat-waterfalls-coffee': 'https://videos.pexels.com/video-files/32212253/13738470_1920_1080_50fps.mp4',
  'da-lat-gardens-whimsy': 'https://videos.pexels.com/video-files/19135704/19135704-hd_1920_1080_25fps.mp4',
  'nha-trang-coastal-resort': 'https://videos.pexels.com/video-files/32279311/13766029_1920_1080_60fps.mp4',
  'nha-trang-islands-reefs': 'https://videos.pexels.com/video-files/34068798/14449244_1920_1080_30fps.mp4',
  'quy-nhon-quiet-coast': 'https://videos.pexels.com/video-files/30045570/12888433_1920_1080_30fps.mp4',
  'quy-nhon-cham-heritage': 'https://videos.pexels.com/video-files/30045570/12888432_1280_720_30fps.mp4',
  'kon-tum-central-highlands': 'https://videos.pexels.com/video-files/35528891/15051652_1920_1080_30fps.mp4',
  'buon-ma-thuot-coffee-capital': 'https://videos.pexels.com/video-files/32970816/14053485_1920_1080_30fps.mp4',
  'cat-tien-jungle-return': 'https://videos.pexels.com/video-files/37887206/16074742_1920_1080_25fps.mp4',
  'mekong-delta-farewell': 'https://videos.pexels.com/video-files/15773410/15773410-hd_1920_1080_30fps.mp4',
  'beijing-forbidden-city-tiananmen': 'https://videos.pexels.com/video-files/33009933/14074638_1366_720_25fps.mp4',
  'beijing-great-wall-at-mutianyu': 'https://videos.pexels.com/video-files/30806149/13175852_1920_1080_60fps.mp4',
  'xi-an-terracotta-army': 'https://videos.pexels.com/video-files/36926089/15643075_1920_1080_25fps.mp4',
  'xi-an-muslim-quarter-pagoda': 'https://videos.pexels.com/video-files/35092274/14866855_1920_1080_24fps.mp4',
  'chengdu-pandas-sichuan': 'https://videos.pexels.com/video-files/33010216/14074525_1920_1080_25fps.mp4',
  'zhangjiajie-avatar-mountains': 'https://videos.pexels.com/video-files/5996220/5996220-hd_1920_1080_30fps.mp4',
  'guilin-yangshuo-li-river': 'https://videos.pexels.com/video-files/38368356/16294098_1920_1080_60fps.mp4',
  'huangshan-yellow-mountains': 'https://videos.pexels.com/video-files/38368356/16294098_1920_1080_60fps.mp4',
  'hangzhou-west-lake': 'https://videos.pexels.com/video-files/34339207/14547738_1920_1080_24fps.mp4',
  'shanghai-the-bund-farewell': 'https://videos.pexels.com/video-files/32594928/13899184_1920_1080_24fps.mp4',
  'bangkok-temples-river': 'https://videos.pexels.com/video-files/31151053/13311464_1920_1080_50fps.mp4',
  'bangkok-markets-canals': 'https://videos.pexels.com/video-files/31170331/13316458_1920_1080_60fps.mp4',
  'chiang-mai-old-city': 'https://videos.pexels.com/video-files/35523153/15049431_1920_1080_30fps.mp4',
  'chiang-mai-elephants-jungle': 'https://videos.pexels.com/video-files/35523153/15049426_1280_720_30fps.mp4',
  'krabi-railay-islands': 'https://videos.pexels.com/video-files/31454282/13413376_1366_720_25fps.mp4',
  'ayutthaya-ancient-capital': 'https://videos.pexels.com/video-files/15151692/15151692-hd_1920_1080_30fps.mp4',
  'kanchanaburi-river-kwai': 'https://videos.pexels.com/video-files/10866909/10866909-hd_1920_1080_24fps.mp4',
  'kanchanaburi-erawan-falls': 'https://videos.pexels.com/video-files/28870599/12500462_1920_1080_60fps.mp4',
  'sukhothai-dawn-of-siam': 'https://videos.pexels.com/video-files/35441673/15015641_1920_1080_30fps.mp4',
  'chiang-rai-white-temple': 'https://videos.pexels.com/video-files/36249381/15373046_1920_1080_30fps.mp4',
  'chiang-rai-golden-triangle': 'https://videos.pexels.com/video-files/36249379/15373080_1920_1080_30fps.mp4',
  'pai-mountain-town': 'https://videos.pexels.com/video-files/35441673/15015641_1920_1080_30fps.mp4',
  'pai-waterfalls-fields': 'https://videos.pexels.com/video-files/35441673/15015640_1280_720_30fps.mp4',
  'mae-hong-son-hill-villages': 'https://videos.pexels.com/video-files/35441673/15015641_1920_1080_30fps.mp4',
  'khao-sok-rainforest-lake': 'https://videos.pexels.com/video-files/13222535/13222535-hd_1920_1080_25fps.mp4',
  'khao-sok-jungle-caves': 'https://videos.pexels.com/video-files/36249390/15373086_1920_1080_30fps.mp4',
  'phuket-old-town': 'https://videos.pexels.com/video-files/38369529/16294670_1920_1080_25fps.mp4',
  'phuket-big-buddha-beaches': 'https://videos.pexels.com/video-files/33369068/14207603_1920_1080_30fps.mp4',
  'phang-nga-james-bond-bay': 'https://videos.pexels.com/video-files/12762054/12762054-hd_1920_1080_25fps.mp4',
  'koh-lanta-slow-island': 'https://videos.pexels.com/video-files/37046759/15694337_1920_1080_25fps.mp4',
  'koh-lanta-rok-haa-reefs': 'https://videos.pexels.com/video-files/37046759/15694336_1280_720_25fps.mp4',
  'koh-samui-gulf-crossing': 'https://videos.pexels.com/video-files/35175371/14902223_1920_1080_60fps.mp4',
  'ang-thong-marine-park': 'https://videos.pexels.com/video-files/35591244/15082942_1920_1080_60fps.mp4',
  'koh-phangan-hidden-coves': 'https://videos.pexels.com/video-files/7913483/7913483-hd_1920_1080_30fps.mp4',
  'koh-tao-dive-day': 'https://videos.pexels.com/video-files/17251971/17251971-hd_1920_1080_30fps.mp4',
  'koh-tao-nang-yuan': 'https://videos.pexels.com/video-files/14428423/14428423-hd_1920_1080_30fps.mp4',
  'hua-hin-royal-coast': 'https://videos.pexels.com/video-files/8174247/8174247-hd_1920_1080_24fps.mp4',
  'bangkok-final-city-day': 'https://videos.pexels.com/video-files/31155333/13311989_1920_1080_60fps.mp4',
  'krabi-return-to-the-andaman': 'https://videos.pexels.com/video-files/33437035/14229417_1920_1080_30fps.mp4',
  'phi-phi-farewell': 'https://videos.pexels.com/video-files/35874590/15214296_1920_1080_30fps.mp4',
  'siem-reap-arrival': 'https://videos.pexels.com/video-files/29045153/12556340_1920_1080_60fps.mp4',
  'angkor-sunrise-temples': 'https://videos.pexels.com/video-files/32926917/14033145_1920_1080_24fps.mp4',
  'angkor-grand-circuit': 'https://videos.pexels.com/video-files/20418914/20418914-hd_1920_1080_24fps.mp4',
  'beng-mealea-jungle-temple': 'https://videos.pexels.com/video-files/15444648/15444648-hd_1920_1080_30fps.mp4',
  'koh-ker-pyramid-in-the-forest': 'https://videos.pexels.com/video-files/31505792/13431801_1920_1080_25fps.mp4',
  'phnom-kulen-sacred-mountain': 'https://videos.pexels.com/video-files/32927056/14033510_1920_1080_24fps.mp4',
  'battambang-bamboo-train': 'https://videos.pexels.com/video-files/29073905/12565405_1920_1080_50fps.mp4',
  'battambang-bat-caves': 'https://videos.pexels.com/video-files/30575180/13093118_1920_1080_60fps.mp4',
  'kampong-chhnang-pottery-water': 'https://videos.pexels.com/video-files/8410174/8410174-hd_1920_1080_30fps.mp4',
  'phnom-penh-royal-capital': 'https://videos.pexels.com/video-files/32927008/14033476_1920_1080_24fps.mp4',
  'phnom-penh-remembrance': 'https://videos.pexels.com/video-files/32927008/14033475_1280_720_24fps.mp4',
  'phnom-penh-markets-river': 'https://videos.pexels.com/video-files/32927066/14033374_1920_1080_24fps.mp4',
  'kampong-cham-bamboo-bridge': 'https://videos.pexels.com/video-files/8410174/8410174-hd_1920_1080_30fps.mp4',
  'kratie-river-dolphins': 'https://videos.pexels.com/video-files/29073905/12565405_1920_1080_50fps.mp4',
  'koh-trong-island-life': 'https://videos.pexels.com/video-files/8426080/8426080-hd_1920_1080_30fps.mp4',
  'mondulkiri-elephant-hills': 'https://videos.pexels.com/video-files/29073905/12565405_1920_1080_50fps.mp4',
  'mondulkiri-bou-sra-falls': 'https://videos.pexels.com/video-files/28870599/12500462_1920_1080_60fps.mp4',
  'kampot-pepper-river': 'https://videos.pexels.com/video-files/29073905/12565405_1920_1080_50fps.mp4',
  'kampot-bokor-mountain': 'https://videos.pexels.com/video-files/18330883/18330883-hd_1920_1080_30fps.mp4',
  'kep-crab-islands': 'https://videos.pexels.com/video-files/29073905/12565405_1920_1080_50fps.mp4',
  'koh-rong-island-crossing': 'https://videos.pexels.com/video-files/8426080/8426080-hd_1920_1080_30fps.mp4',
  'koh-rong-bioluminescence': 'https://videos.pexels.com/video-files/8426080/8426080-hd_1280_720_60fps.mp4',
  'koh-rong-sanloem-saracen-bay': 'https://videos.pexels.com/video-files/8426080/8426080-hd_1920_1080_30fps.mp4',
  'takeo-angkor-borei': 'https://videos.pexels.com/video-files/29073905/12565405_1920_1080_50fps.mp4',
  'sambor-prei-kuk-pre-angkor': 'https://videos.pexels.com/video-files/31505792/13431801_1920_1080_25fps.mp4',
  'kompong-thom-countryside': 'https://videos.pexels.com/video-files/29059935/12561400_1920_1080_25fps.mp4',
  'siem-reap-return-to-angkor': 'https://videos.pexels.com/video-files/20418914/20418914-hd_1920_1080_24fps.mp4',
  'angkor-distant-temples': 'https://videos.pexels.com/video-files/29088807/12569395_1920_1080_25fps.mp4',
  'siem-reap-town-crafts': 'https://videos.pexels.com/video-files/29045153/12556338_1280_720_60fps.mp4',
  'tonl-sap-floating-villages': 'https://videos.pexels.com/video-files/32927342/14033677_1920_1080_24fps.mp4',
  'luang-prabang-old-town': 'https://videos.pexels.com/video-files/28232487/12335169_1920_1080_60fps.mp4',
  'kuang-si-falls': 'https://videos.pexels.com/video-files/28633948/12436973_1920_1080_60fps.mp4',
  'luang-prabang-palace-crafts': 'https://videos.pexels.com/video-files/28628010/12436558_1920_1080_25fps.mp4',
  'luang-prabang-rice-weaving': 'https://videos.pexels.com/video-files/28633944/12436818_1920_1080_60fps.mp4',
  'nong-khiaw-river-cliffs': 'https://videos.pexels.com/video-files/33821135/14354373_1920_1080_60fps.mp4',
  'muang-ngoi-riverside-village': 'https://videos.pexels.com/video-files/33821230/14354463_1920_1080_60fps.mp4',
  'nong-khiaw-hundred-waterfalls': 'https://videos.pexels.com/video-files/28599725/12430233_1920_1080_25fps.mp4',
  'phonsavan-plain-of-jars': 'https://videos.pexels.com/video-files/31170740/13319105_1920_1080_60fps.mp4',
  'phonsavan-secret-war': 'https://videos.pexels.com/video-files/33821230/14354463_1920_1080_60fps.mp4',
  'vang-vieng-karst-country': 'https://videos.pexels.com/video-files/13855455/13855455-hd_1920_1080_24fps.mp4',
  'vang-vieng-caves-lagoons': 'https://videos.pexels.com/video-files/13855455/13855455-hd_1280_720_24fps.mp4',
  'vang-vieng-balloon-sky': 'https://videos.pexels.com/video-files/34575193/14651189_1920_1080_25fps.mp4',
  'vientiane-riverside-capital': 'https://videos.pexels.com/video-files/31170739/13319081_1920_1080_60fps.mp4',
  'vientiane-temples-cope': 'https://videos.pexels.com/video-files/31180887/13320063_1920_1080_60fps.mp4',
  'vientiane-buddha-park': 'https://videos.pexels.com/video-files/31180887/13320062_1280_720_60fps.mp4',
  'thakhek-loop-beginnings': 'https://videos.pexels.com/video-files/33821230/14354463_1920_1080_60fps.mp4',
  'kong-lor-river-cave': 'https://videos.pexels.com/video-files/33821230/14354463_1920_1080_60fps.mp4',
  'thakhek-loop-caves-cliffs': 'https://videos.pexels.com/video-files/33821230/14354463_1920_1080_60fps.mp4',
  'savannakhet-colonial-calm': 'https://videos.pexels.com/video-files/31170739/13319081_1920_1080_60fps.mp4',
  'pakse-gateway-south': 'https://videos.pexels.com/video-files/31170739/13319081_1920_1080_60fps.mp4',
  'champasak-wat-phou': 'https://videos.pexels.com/video-files/31170740/13319105_1920_1080_60fps.mp4',
  'bolaven-coffee-plateau': 'https://videos.pexels.com/video-files/5632836/5632836-hd_1366_720_24fps.mp4',
  'bolaven-tad-lo-villages': 'https://videos.pexels.com/video-files/28232487/12335169_1920_1080_60fps.mp4',
  'si-phan-don-4000-islands': 'https://videos.pexels.com/video-files/33821230/14354463_1920_1080_60fps.mp4',
  'don-khon-falls-dolphins': 'https://videos.pexels.com/video-files/31170740/13319105_1920_1080_60fps.mp4',
  'khone-phapheng-the-great-falls': 'https://videos.pexels.com/video-files/31170745/13319065_1920_1080_60fps.mp4',
  'don-det-slow-river-day': 'https://videos.pexels.com/video-files/31170741/13319053_1920_1080_60fps.mp4',
  'return-north-luang-prabang': 'https://videos.pexels.com/video-files/33821230/14354463_1920_1080_60fps.mp4',
  'luang-prabang-last-rituals': 'https://videos.pexels.com/video-files/35219184/14920204_1920_1080_24fps.mp4',
  'pak-ou-farewell': 'https://videos.pexels.com/video-files/33821230/14354463_1920_1080_60fps.mp4',
  'ubud-rice-ritual': 'https://videos.pexels.com/video-files/33198376/14148250_1920_1080_25fps.mp4',
  'ubud-temples-volcano': 'https://videos.pexels.com/video-files/8335342/8335342-hd_1366_720_25fps.mp4',
  'uluwatu-cliffs-surf': 'https://videos.pexels.com/video-files/35357502/14980743_1920_1080_60fps.mp4',
  'sidemen-east-bali-valley': 'https://videos.pexels.com/video-files/35438598/15013978_1920_1080_30fps.mp4',
  'amed-coast-wreck': 'https://videos.pexels.com/video-files/34045341/14438310_1920_1080_30fps.mp4',
  'lempuyang-gate-of-heaven': 'https://videos.pexels.com/video-files/4836007/4836007-hd_1920_1080_30fps.mp4',
  'gili-trawangan-island-escape': 'https://videos.pexels.com/video-files/17487721/17487721-hd_1920_1080_30fps.mp4',
  'gili-air-reef-rest': 'https://videos.pexels.com/video-files/31820134/13556887_1920_1080_60fps.mp4',
  'kuta-lombok-southern-beaches': 'https://videos.pexels.com/video-files/4962823/4962823-hd_1920_1080_30fps.mp4',
  'tetebatu-sasak-highlands': 'https://videos.pexels.com/video-files/35438595/15014000_1920_1080_30fps.mp4',
  'sembalun-rinjani-foot': 'https://videos.pexels.com/video-files/32039933/13657892_1920_1080_60fps.mp4',
  'labuan-bajo-flores-gateway': 'https://videos.pexels.com/video-files/38475800/16340500_1920_1080_30fps.mp4',
  'komodo-dragons-reefs': 'https://videos.pexels.com/video-files/26772321/12004048_1920_1080_30fps.mp4',
  'komodo-padar-pink-beach': 'https://videos.pexels.com/video-files/26772324/12004059_1920_1080_30fps.mp4',
  'flores-road-to-wae-rebo': 'https://videos.pexels.com/video-files/34045341/14438310_1920_1080_30fps.mp4',
  'wae-rebo-village-above-clouds': 'https://videos.pexels.com/video-files/35438595/15014000_1920_1080_30fps.mp4',
  'kelimutu-coloured-lakes': 'https://videos.pexels.com/video-files/30700902/13136080_1920_1080_60fps.mp4',
  'kelimutu-sunrise-craters': 'https://videos.pexels.com/video-files/4927961/4927961-hd_1366_720_30fps.mp4',
  'yogyakarta-heart-of-java': 'https://videos.pexels.com/video-files/31229473/13339125_1920_1080_30fps.mp4',
  'borobudur-sunrise-temple': 'https://videos.pexels.com/video-files/18251495/18251495-hd_1920_1080_60fps.mp4',
  'prambanan-hindu-spires': 'https://videos.pexels.com/video-files/2949520/2949520-hd_1920_1080_30fps.mp4',
  'yogyakarta-batik-merapi': 'https://videos.pexels.com/video-files/30935440/13227705_1920_1080_25fps.mp4',
  'mount-bromo-sea-of-sand': 'https://videos.pexels.com/video-files/30700902/13136080_1920_1080_60fps.mp4',
  'bromo-sunrise-crater': 'https://videos.pexels.com/video-files/30700902/13136080_1920_1080_60fps.mp4',
  'ijen-blue-fire-crater': 'https://videos.pexels.com/video-files/4581058/4581058-hd_1366_720_24fps.mp4',
  'jakarta-the-capital': 'https://videos.pexels.com/video-files/19535632/19535632-hd_1920_1080_30fps.mp4',
  'jakarta-old-batavia': 'https://videos.pexels.com/video-files/35186768/14907465_1920_1080_60fps.mp4',
  'back-to-bali-canggu': 'https://videos.pexels.com/video-files/35357502/14980743_1920_1080_60fps.mp4',
  'bali-tanah-lot-temples': 'https://videos.pexels.com/video-files/35357502/14980743_1920_1080_60fps.mp4',
  'nusa-penida-farewell': 'https://videos.pexels.com/video-files/37932078/16095283_1920_1080_60fps.mp4',
  'marina-bay-gardens': 'https://videos.pexels.com/video-files/32284115/13767948_1920_1080_30fps.mp4',
  'neighbourhoods-hawkers': 'https://videos.pexels.com/video-files/33279610/14175505_1920_1080_30fps.mp4',
  'civic-district-colonial-core': 'https://videos.pexels.com/video-files/33702863/14314699_1920_1080_60fps.mp4',
  'national-gallery-river': 'https://videos.pexels.com/video-files/4502037/4502037-hd_1920_1080_24fps.mp4',
  'chinatown-deep-dive': 'https://videos.pexels.com/video-files/14371849/14371849-hd_1920_1080_25fps.mp4',
  'little-india-kampong-glam': 'https://videos.pexels.com/video-files/30739577/13149275_1920_1080_25fps.mp4',
  'gardens-by-the-bay': 'https://videos.pexels.com/video-files/20018221/20018221-hd_1920_1080_18fps.mp4',
  'botanic-gardens-orchard': 'https://videos.pexels.com/video-files/20018221/20018221-hd_1920_1080_18fps.mp4',
  'mandai-zoo-river': 'https://videos.pexels.com/video-files/33279610/14175505_1920_1080_30fps.mp4',
  'mandai-night-safari': 'https://videos.pexels.com/video-files/37689057/15979780_1920_1080_50fps.mp4',
  'jurong-science-lake': 'https://videos.pexels.com/video-files/17114554/17114554-hd_1920_1080_24fps.mp4',
  'southern-ridges-faber': 'https://videos.pexels.com/video-files/17114554/17114554-hd_1920_1080_24fps.mp4',
  'katong-peranakan-east': 'https://videos.pexels.com/video-files/33279610/14175505_1920_1080_30fps.mp4',
  'east-coast-changi': 'https://videos.pexels.com/video-files/37231708/15773139_1920_1080_60fps.mp4',
  'pulau-ubin-old-kampong': 'https://videos.pexels.com/video-files/17114554/17114554-hd_1920_1080_24fps.mp4',
  'macritchie-rainforest-walk': 'https://videos.pexels.com/video-files/17152686/17152686-hd_1920_1080_24fps.mp4',
  'bukit-timah-rail-corridor': 'https://videos.pexels.com/video-files/15502307/15502307-hd_1920_1080_30fps.mp4',
  'marina-bay-by-night': 'https://videos.pexels.com/video-files/33279610/14175505_1920_1080_30fps.mp4',
  'day-trip-bintan-island': 'https://videos.pexels.com/video-files/33279610/14175505_1920_1080_30fps.mp4',
  'day-trip-johor-legoland': 'https://videos.pexels.com/video-files/37495816/15885022_1920_1080_30fps.mp4',
  'kranji-wetlands-farms': 'https://videos.pexels.com/video-files/17152686/17152686-hd_1920_1080_24fps.mp4',
  'haw-par-villa-pasir-panjang': 'https://videos.pexels.com/video-files/31992897/13634110_1920_1080_30fps.mp4',
  'tiong-bahru-old-new': 'https://videos.pexels.com/video-files/37495816/15885022_1920_1080_30fps.mp4',
  'orchard-emerald-hill': 'https://videos.pexels.com/video-files/17114554/17114554-hd_1920_1080_24fps.mp4',
  'singapore-river-quays': 'https://videos.pexels.com/video-files/33279610/14175505_1920_1080_30fps.mp4',
  'marina-east-barrage': 'https://videos.pexels.com/video-files/35218335/14919756_1920_1080_60fps.mp4',
  'changi-jewel-chinatown-night': 'https://videos.pexels.com/video-files/38275427/16252138_1920_1080_50fps.mp4',
  'southern-islands-st-john-s': 'https://videos.pexels.com/video-files/17114554/17114554-hd_1920_1080_24fps.mp4',
  'harbourfront-mount-faber': 'https://videos.pexels.com/video-files/35061520/14852250_1920_1080_30fps.mp4',
  'sentosa-farewell': 'https://videos.pexels.com/video-files/17114554/17114554-hd_1920_1080_24fps.mp4',
  'el-nido-arrival': 'https://videos.pexels.com/video-files/33285991/14178391_1920_1080_60fps.mp4',
  'bacuit-bay-island-hopping': 'https://videos.pexels.com/video-files/34672212/14695775_1920_1080_60fps.mp4',
  'coron-wrecks-lakes': 'https://videos.pexels.com/video-files/33678848/14307375_1920_1080_60fps.mp4',
  'coron-lakes-reefs': 'https://videos.pexels.com/video-files/31709187/13510588_1920_1080_30fps.mp4',
  'puerto-princesa-underground-river': 'https://videos.pexels.com/video-files/32970330/14053148_1920_1080_60fps.mp4',
  'puerto-princesa-honda-bay': 'https://videos.pexels.com/video-files/33021657/14072185_1920_1080_60fps.mp4',
  'cebu-queen-city-of-the-south': 'https://videos.pexels.com/video-files/38506233/16352687_1920_1080_60fps.mp4',
  'kawasan-canyoneering': 'https://videos.pexels.com/video-files/32970330/14053148_1920_1080_60fps.mp4',
  'moalboal-sardine-run': 'https://videos.pexels.com/video-files/38506233/16352687_1920_1080_60fps.mp4',
  'oslob-whale-sharks-sumilon': 'https://videos.pexels.com/video-files/38506233/16352687_1920_1080_60fps.mp4',
  'bohol-chocolate-hills': 'https://videos.pexels.com/video-files/32970330/14053148_1920_1080_60fps.mp4',
  'bohol-tarsiers-panglao': 'https://videos.pexels.com/video-files/38015590/16134602_1920_1080_60fps.mp4',
  'balicasag-turtle-diving': 'https://videos.pexels.com/video-files/36379819/15428369_1920_1080_60fps.mp4',
  'siquijor-mystic-island': 'https://videos.pexels.com/video-files/33861073/14369175_1920_1080_60fps.mp4',
  'siquijor-falls-sea': 'https://videos.pexels.com/video-files/5025519/5025519-hd_1920_1080_30fps.mp4',
  'apo-island-turtle-sanctuary': 'https://videos.pexels.com/video-files/33021656/14072270_1920_1080_60fps.mp4',
  'siargao-surf-capital': 'https://videos.pexels.com/video-files/6710606/6710606-hd_1920_1080_30fps.mp4',
  'siargao-island-hopping': 'https://videos.pexels.com/video-files/6710606/6710606-hd_1280_720_60fps.mp4',
  'siargao-lagoons-rock-pools': 'https://videos.pexels.com/video-files/6710606/6710606-sd_960_540_30fps.mp4',
  'camiguin-island-born-of-fire': 'https://videos.pexels.com/video-files/38506233/16352687_1920_1080_60fps.mp4',
  'camiguin-springs-falls': 'https://videos.pexels.com/video-files/36255656/15375294_1920_1080_60fps.mp4',
  'boracay-white-beach': 'https://videos.pexels.com/video-files/36658255/15540977_1920_1080_60fps.mp4',
  'boracay-sail-hop': 'https://videos.pexels.com/video-files/4096040/4096040-hd_1920_1080_25fps.mp4',
  'manila-old-new': 'https://videos.pexels.com/video-files/33728446/14321631_1920_1080_30fps.mp4',
  'banaue-rice-terraces': 'https://videos.pexels.com/video-files/35998718/15264147_1920_1080_60fps.mp4',
  'batad-amphitheatre-terraces': 'https://videos.pexels.com/video-files/33861073/14369175_1920_1080_60fps.mp4',
  'sagada-hanging-coffins': 'https://videos.pexels.com/video-files/33861073/14369175_1920_1080_60fps.mp4',
  'vigan-spanish-colonial': 'https://videos.pexels.com/video-files/36724807/15564708_1920_1080_25fps.mp4',
  'return-to-palawan-coron': 'https://videos.pexels.com/video-files/33021656/14072270_1920_1080_60fps.mp4',
  'coron-farewell': 'https://videos.pexels.com/video-files/33678848/14307374_1280_720_60fps.mp4',
  'kuala-lumpur-city-of-towers': 'https://videos.pexels.com/video-files/15668868/15668868-hd_1920_1080_30fps.mp4',
  'kl-caves-culture': 'https://videos.pexels.com/video-files/12704623/12704623-hd_1920_1080_24fps.mp4',
  'penang-george-town': 'https://videos.pexels.com/video-files/19968466/19968466-hd_1920_1080_30fps.mp4',
  'penang-food-heritage': 'https://videos.pexels.com/video-files/19968478/19968478-hd_1920_1080_30fps.mp4',
  'langkawi-island-of-legends': 'https://videos.pexels.com/video-files/11439194/11439194-hd_1920_1080_30fps.mp4',
  'langkawi-mangroves-bays': 'https://videos.pexels.com/video-files/20237994/20237994-hd_1920_1080_24fps.mp4',
  'langkawi-island-hopping': 'https://videos.pexels.com/video-files/20236652/20236652-hd_1920_1080_24fps.mp4',
  'ipoh-caves-white-coffee': 'https://videos.pexels.com/video-files/19956584/19956584-hd_1920_1080_30fps.mp4',
  'cameron-highlands-tea-country': 'https://videos.pexels.com/video-files/35344835/14977503_1920_1080_60fps.mp4',
  'cameron-highlands-mossy-forest': 'https://videos.pexels.com/video-files/37712480/15992790_1920_1080_30fps.mp4',
  'taman-negara-ancient-rainforest': 'https://videos.pexels.com/video-files/32547819/13880548_1920_1080_30fps.mp4',
  'taman-negara-canopy-rapids': 'https://videos.pexels.com/video-files/32547819/13880547_1280_720_30fps.mp4',
  'kuala-lumpur-culture-return': 'https://videos.pexels.com/video-files/17466931/17466931-hd_1920_1080_30fps.mp4',
  'malacca-historic-port': 'https://videos.pexels.com/video-files/20575944/20575944-hd_1920_1080_30fps.mp4',
  'malacca-peranakan-heart': 'https://videos.pexels.com/video-files/20575944/20575944-hd_1280_720_30fps.mp4',
  'perhentian-island-paradise': 'https://videos.pexels.com/video-files/10490630/10490630-hd_1920_1080_30fps.mp4',
  'perhentian-turtles-reefs': 'https://videos.pexels.com/video-files/38259458/16244960_1920_1080_60fps.mp4',
  'kuala-terengganu-malay-coast': 'https://videos.pexels.com/video-files/14553547/14553547-hd_1920_1080_30fps.mp4',
  'kota-bharu-kelantan-culture': 'https://videos.pexels.com/video-files/2867870/2867870-hd_1920_1080_24fps.mp4',
  'kuching-borneo-gateway': 'https://videos.pexels.com/video-files/11499060/11499060-hd_1920_1080_30fps.mp4',
  'bako-proboscis-monkeys': 'https://videos.pexels.com/video-files/31005377/13252887_1920_1080_30fps.mp4',
  'kuching-orangutans-culture': 'https://videos.pexels.com/video-files/5736019/5736019-hd_1920_1080_24fps.mp4',
  'mulu-caves-of-giants': 'https://videos.pexels.com/video-files/15502307/15502307-hd_1920_1080_30fps.mp4',
  'mulu-clearwater-canopy': 'https://videos.pexels.com/video-files/15502308/15502308-hd_1920_1080_30fps.mp4',
  'kota-kinabalu-sabah-coast': 'https://videos.pexels.com/video-files/2867870/2867870-hd_1920_1080_24fps.mp4',
  'kinabalu-park-mountain-foot': 'https://videos.pexels.com/video-files/30567544/13090375_1920_1080_30fps.mp4',
  'semporna-diver-s-dream': 'https://videos.pexels.com/video-files/32279291/13765933_1920_1080_30fps.mp4',
  'sipadan-wall-of-life': 'https://videos.pexels.com/video-files/2257055/2257055-hd_1366_720_24fps.mp4',
  'return-to-penang': 'https://videos.pexels.com/video-files/19968466/19968466-hd_1920_1080_30fps.mp4',
  'penang-farewell': 'https://videos.pexels.com/video-files/20146765/20146765-hd_1920_1080_30fps.mp4',
}

const LANDMARK_VIDEO: Record<string, string> = {
  'tokyo': 'https://videos.pexels.com/video-files/19408337/19408337-hd_1920_1080_50fps.mp4',
  'nikko': 'https://videos.pexels.com/video-files/31233132/13340553_1920_1080_24fps.mp4',
  'kamakura-enoshima': 'https://videos.pexels.com/video-files/6891916/6891916-hd_1920_1080_30fps.mp4',
  'hakone': 'https://videos.pexels.com/video-files/10451691/10451691-hd_1920_1080_30fps.mp4',
  'kawaguchiko': 'https://videos.pexels.com/video-files/6602522/6602522-hd_1920_1080_30fps.mp4',
  'matsumoto': 'https://videos.pexels.com/video-files/15809475/15809475-hd_1920_1080_30fps.mp4',
  'kamikochi': 'https://videos.pexels.com/video-files/34338786/14547473_1920_1080_30fps.mp4',
  'takayama': 'https://videos.pexels.com/video-files/34654580/14688981_1920_1080_50fps.mp4',
  'shirakawa-go': 'https://videos.pexels.com/video-files/30379203/13019366_1920_1080_25fps.mp4',
  'kanazawa': 'https://videos.pexels.com/video-files/37593714/15932804_1920_1080_60fps.mp4',
  'tateyama-kurobe-alpine-route': 'https://videos.pexels.com/video-files/37590733/15930954_1920_1080_30fps.mp4',
  'kyoto': 'https://videos.pexels.com/video-files/38556433/16376721_1920_1080_30fps.mp4',
  'nara': 'https://videos.pexels.com/video-files/32111776/13690421_1920_1080_60fps.mp4',
  'koyasan': 'https://videos.pexels.com/video-files/37593714/15932804_1920_1080_60fps.mp4',
  'osaka': 'https://videos.pexels.com/video-files/6536428/6536428-hd_1920_1080_24fps.mp4',
  'himeji-kobe': 'https://videos.pexels.com/video-files/7418360/7418360-hd_1920_1080_30fps.mp4',
  'okayama-naoshima': 'https://videos.pexels.com/video-files/15809475/15809475-hd_1920_1080_30fps.mp4',
  'hiroshima': 'https://videos.pexels.com/video-files/11023781/11023781-hd_1920_1080_30fps.mp4',
  'miyajima': 'https://videos.pexels.com/video-files/35095532/14868063_1920_1080_25fps.mp4',
  'sapporo': 'https://videos.pexels.com/video-files/10805786/10805786-hd_1920_1080_30fps.mp4',
  'otaru-yoichi': 'https://videos.pexels.com/video-files/15809475/15809475-hd_1920_1080_30fps.mp4',
  'furano-biei': 'https://videos.pexels.com/video-files/28957677/12528020_1920_1080_60fps.mp4',
  'hanoi': 'https://videos.pexels.com/video-files/4229438/4229438-hd_1366_720_24fps.mp4',
  'ha-long-bay': 'https://videos.pexels.com/video-files/3120431/3120431-hd_1920_1080_24fps.mp4',
  'ninh-binh': 'https://videos.pexels.com/video-files/30468323/13055784_1920_1080_60fps.mp4',
  'sapa': 'https://videos.pexels.com/video-files/34202935/14496768_1920_1080_30fps.mp4',
  'hue': 'https://videos.pexels.com/video-files/19441726/19441726-hd_1920_1080_30fps.mp4',
  'da-nang': 'https://videos.pexels.com/video-files/25748308/11905537_1920_1080_24fps.mp4',
  'hoi-an': 'https://videos.pexels.com/video-files/15692758/15692758-hd_1920_1080_24fps.mp4',
  'ho-chi-minh-city': 'https://videos.pexels.com/video-files/31111825/13294162_1920_1080_30fps.mp4',
  'can-tho': 'https://videos.pexels.com/video-files/32455709/13841840_1920_1080_30fps.mp4',
  'chau-doc': 'https://videos.pexels.com/video-files/37969260/16111571_1920_1080_60fps.mp4',
  'rach-gia': 'https://videos.pexels.com/video-files/30735414/13148344_1920_1080_30fps.mp4',
  'phu-quoc': 'https://videos.pexels.com/video-files/19018185/19018185-hd_1920_1080_25fps.mp4',
  'con-dao': 'https://videos.pexels.com/video-files/19018185/19018185-hd_1920_1080_25fps.mp4',
  'mui-ne': 'https://videos.pexels.com/video-files/20075088/20075088-hd_1920_1080_60fps.mp4',
  'da-lat': 'https://videos.pexels.com/video-files/32457470/13843667_1920_1080_60fps.mp4',
  'nha-trang': 'https://videos.pexels.com/video-files/32279311/13766029_1920_1080_60fps.mp4',
  'quy-nhon': 'https://videos.pexels.com/video-files/30045570/12888433_1920_1080_30fps.mp4',
  'kon-tum': 'https://videos.pexels.com/video-files/35528891/15051652_1920_1080_30fps.mp4',
  'buon-ma-thuot': 'https://videos.pexels.com/video-files/32970816/14053485_1920_1080_30fps.mp4',
  'cat-tien': 'https://videos.pexels.com/video-files/37887206/16074742_1920_1080_25fps.mp4',
  'mekong-delta': 'https://videos.pexels.com/video-files/15773410/15773410-hd_1920_1080_30fps.mp4',
  'beijing': 'https://videos.pexels.com/video-files/33009933/14074638_1366_720_25fps.mp4',
  'xi-an': 'https://videos.pexels.com/video-files/36926089/15643075_1920_1080_25fps.mp4',
  'chengdu': 'https://videos.pexels.com/video-files/33010216/14074525_1920_1080_25fps.mp4',
  'zhangjiajie': 'https://videos.pexels.com/video-files/5996220/5996220-hd_1920_1080_30fps.mp4',
  'guilin-yangshuo': 'https://videos.pexels.com/video-files/38368356/16294098_1920_1080_60fps.mp4',
  'huangshan': 'https://videos.pexels.com/video-files/38368356/16294098_1920_1080_60fps.mp4',
  'hangzhou': 'https://videos.pexels.com/video-files/34339207/14547738_1920_1080_24fps.mp4',
  'shanghai': 'https://videos.pexels.com/video-files/32594928/13899184_1920_1080_24fps.mp4',
  'bangkok': 'https://videos.pexels.com/video-files/31151053/13311464_1920_1080_50fps.mp4',
  'chiang-mai': 'https://videos.pexels.com/video-files/35523153/15049431_1920_1080_30fps.mp4',
  'krabi': 'https://videos.pexels.com/video-files/31454282/13413376_1366_720_25fps.mp4',
  'ayutthaya': 'https://videos.pexels.com/video-files/15151692/15151692-hd_1920_1080_30fps.mp4',
  'kanchanaburi': 'https://videos.pexels.com/video-files/10866909/10866909-hd_1920_1080_24fps.mp4',
  'sukhothai': 'https://videos.pexels.com/video-files/35441673/15015641_1920_1080_30fps.mp4',
  'chiang-rai': 'https://videos.pexels.com/video-files/36249381/15373046_1920_1080_30fps.mp4',
  'pai': 'https://videos.pexels.com/video-files/35441673/15015641_1920_1080_30fps.mp4',
  'mae-hong-son': 'https://videos.pexels.com/video-files/35441673/15015641_1920_1080_30fps.mp4',
  'khao-sok': 'https://videos.pexels.com/video-files/13222535/13222535-hd_1920_1080_25fps.mp4',
  'phuket': 'https://videos.pexels.com/video-files/38369529/16294670_1920_1080_25fps.mp4',
  'phang-nga': 'https://videos.pexels.com/video-files/12762054/12762054-hd_1920_1080_25fps.mp4',
  'koh-lanta': 'https://videos.pexels.com/video-files/37046759/15694337_1920_1080_25fps.mp4',
  'koh-samui': 'https://videos.pexels.com/video-files/35175371/14902223_1920_1080_60fps.mp4',
  'ang-thong': 'https://videos.pexels.com/video-files/35591244/15082942_1920_1080_60fps.mp4',
  'koh-phangan': 'https://videos.pexels.com/video-files/7913483/7913483-hd_1920_1080_30fps.mp4',
  'koh-tao': 'https://videos.pexels.com/video-files/17251971/17251971-hd_1920_1080_30fps.mp4',
  'hua-hin': 'https://videos.pexels.com/video-files/8174247/8174247-hd_1920_1080_24fps.mp4',
  'phi-phi': 'https://videos.pexels.com/video-files/35874590/15214296_1920_1080_30fps.mp4',
  'siem-reap': 'https://videos.pexels.com/video-files/29045153/12556340_1920_1080_60fps.mp4',
  'angkor': 'https://videos.pexels.com/video-files/32926917/14033145_1920_1080_24fps.mp4',
  'beng-mealea': 'https://videos.pexels.com/video-files/15444648/15444648-hd_1920_1080_30fps.mp4',
  'koh-ker': 'https://videos.pexels.com/video-files/31505792/13431801_1920_1080_25fps.mp4',
  'phnom-kulen': 'https://videos.pexels.com/video-files/32927056/14033510_1920_1080_24fps.mp4',
  'battambang': 'https://videos.pexels.com/video-files/29073905/12565405_1920_1080_50fps.mp4',
  'kampong-chhnang': 'https://videos.pexels.com/video-files/8410174/8410174-hd_1920_1080_30fps.mp4',
  'phnom-penh': 'https://videos.pexels.com/video-files/32927008/14033476_1920_1080_24fps.mp4',
  'kampong-cham': 'https://videos.pexels.com/video-files/8410174/8410174-hd_1920_1080_30fps.mp4',
  'kratie': 'https://videos.pexels.com/video-files/29073905/12565405_1920_1080_50fps.mp4',
  'koh-trong': 'https://videos.pexels.com/video-files/8426080/8426080-hd_1920_1080_30fps.mp4',
  'mondulkiri': 'https://videos.pexels.com/video-files/29073905/12565405_1920_1080_50fps.mp4',
  'kampot': 'https://videos.pexels.com/video-files/29073905/12565405_1920_1080_50fps.mp4',
  'kep': 'https://videos.pexels.com/video-files/29073905/12565405_1920_1080_50fps.mp4',
  'koh-rong': 'https://videos.pexels.com/video-files/8426080/8426080-hd_1920_1080_30fps.mp4',
  'koh-rong-sanloem': 'https://videos.pexels.com/video-files/8426080/8426080-hd_1920_1080_30fps.mp4',
  'takeo': 'https://videos.pexels.com/video-files/29073905/12565405_1920_1080_50fps.mp4',
  'sambor-prei-kuk': 'https://videos.pexels.com/video-files/31505792/13431801_1920_1080_25fps.mp4',
  'kompong-thom': 'https://videos.pexels.com/video-files/29059935/12561400_1920_1080_25fps.mp4',
  'tonl-sap': 'https://videos.pexels.com/video-files/32927342/14033677_1920_1080_24fps.mp4',
  'luang-prabang': 'https://videos.pexels.com/video-files/28232487/12335169_1920_1080_60fps.mp4',
  'kuang-si-falls': 'https://videos.pexels.com/video-files/28633948/12436973_1920_1080_60fps.mp4',
  'nong-khiaw': 'https://videos.pexels.com/video-files/33821135/14354373_1920_1080_60fps.mp4',
  'muang-ngoi': 'https://videos.pexels.com/video-files/33821230/14354463_1920_1080_60fps.mp4',
  'phonsavan': 'https://videos.pexels.com/video-files/31170740/13319105_1920_1080_60fps.mp4',
  'vang-vieng': 'https://videos.pexels.com/video-files/13855455/13855455-hd_1920_1080_24fps.mp4',
  'vientiane': 'https://videos.pexels.com/video-files/31170739/13319081_1920_1080_60fps.mp4',
  'thakhek': 'https://videos.pexels.com/video-files/33821230/14354463_1920_1080_60fps.mp4',
  'kong-lor': 'https://videos.pexels.com/video-files/33821230/14354463_1920_1080_60fps.mp4',
  'thakhek-loop': 'https://videos.pexels.com/video-files/33821230/14354463_1920_1080_60fps.mp4',
  'savannakhet': 'https://videos.pexels.com/video-files/31170739/13319081_1920_1080_60fps.mp4',
  'pakse': 'https://videos.pexels.com/video-files/31170739/13319081_1920_1080_60fps.mp4',
  'champasak': 'https://videos.pexels.com/video-files/31170740/13319105_1920_1080_60fps.mp4',
  'bolaven': 'https://videos.pexels.com/video-files/5632836/5632836-hd_1366_720_24fps.mp4',
  'si-phan-don': 'https://videos.pexels.com/video-files/33821230/14354463_1920_1080_60fps.mp4',
  'don-khon': 'https://videos.pexels.com/video-files/31170740/13319105_1920_1080_60fps.mp4',
  'khone-phapheng': 'https://videos.pexels.com/video-files/31170745/13319065_1920_1080_60fps.mp4',
  'don-det': 'https://videos.pexels.com/video-files/31170741/13319053_1920_1080_60fps.mp4',
  'return-north': 'https://videos.pexels.com/video-files/33821230/14354463_1920_1080_60fps.mp4',
  'pak-ou-farewell': 'https://videos.pexels.com/video-files/33821230/14354463_1920_1080_60fps.mp4',
  'ubud': 'https://videos.pexels.com/video-files/33198376/14148250_1920_1080_25fps.mp4',
  'uluwatu': 'https://videos.pexels.com/video-files/35357502/14980743_1920_1080_60fps.mp4',
  'sidemen': 'https://videos.pexels.com/video-files/35438598/15013978_1920_1080_30fps.mp4',
  'amed': 'https://videos.pexels.com/video-files/34045341/14438310_1920_1080_30fps.mp4',
  'lempuyang': 'https://videos.pexels.com/video-files/4836007/4836007-hd_1920_1080_30fps.mp4',
  'gili-trawangan': 'https://videos.pexels.com/video-files/17487721/17487721-hd_1920_1080_30fps.mp4',
  'gili-air': 'https://videos.pexels.com/video-files/31820134/13556887_1920_1080_60fps.mp4',
  'kuta-lombok': 'https://videos.pexels.com/video-files/4962823/4962823-hd_1920_1080_30fps.mp4',
  'tetebatu': 'https://videos.pexels.com/video-files/35438595/15014000_1920_1080_30fps.mp4',
  'sembalun': 'https://videos.pexels.com/video-files/32039933/13657892_1920_1080_60fps.mp4',
  'labuan-bajo': 'https://videos.pexels.com/video-files/38475800/16340500_1920_1080_30fps.mp4',
  'komodo': 'https://videos.pexels.com/video-files/26772321/12004048_1920_1080_30fps.mp4',
  'flores': 'https://videos.pexels.com/video-files/34045341/14438310_1920_1080_30fps.mp4',
  'wae-rebo': 'https://videos.pexels.com/video-files/35438595/15014000_1920_1080_30fps.mp4',
  'kelimutu': 'https://videos.pexels.com/video-files/30700902/13136080_1920_1080_60fps.mp4',
  'yogyakarta': 'https://videos.pexels.com/video-files/31229473/13339125_1920_1080_30fps.mp4',
  'borobudur': 'https://videos.pexels.com/video-files/18251495/18251495-hd_1920_1080_60fps.mp4',
  'prambanan': 'https://videos.pexels.com/video-files/2949520/2949520-hd_1920_1080_30fps.mp4',
  'mount-bromo': 'https://videos.pexels.com/video-files/30700902/13136080_1920_1080_60fps.mp4',
  'bromo': 'https://videos.pexels.com/video-files/30700902/13136080_1920_1080_60fps.mp4',
  'ijen': 'https://videos.pexels.com/video-files/4581058/4581058-hd_1366_720_24fps.mp4',
  'jakarta': 'https://videos.pexels.com/video-files/19535632/19535632-hd_1920_1080_30fps.mp4',
  'back-to-bali': 'https://videos.pexels.com/video-files/35357502/14980743_1920_1080_60fps.mp4',
  'bali': 'https://videos.pexels.com/video-files/35357502/14980743_1920_1080_60fps.mp4',
  'nusa-penida': 'https://videos.pexels.com/video-files/37932078/16095283_1920_1080_60fps.mp4',
  'marina-bay-gardens': 'https://videos.pexels.com/video-files/32284115/13767948_1920_1080_30fps.mp4',
  'neighbourhoods-hawkers': 'https://videos.pexels.com/video-files/33279610/14175505_1920_1080_30fps.mp4',
  'civic-district': 'https://videos.pexels.com/video-files/33702863/14314699_1920_1080_60fps.mp4',
  'national-gallery-river': 'https://videos.pexels.com/video-files/4502037/4502037-hd_1920_1080_24fps.mp4',
  'chinatown': 'https://videos.pexels.com/video-files/14371849/14371849-hd_1920_1080_25fps.mp4',
  'little-india-kampong-glam': 'https://videos.pexels.com/video-files/30739577/13149275_1920_1080_25fps.mp4',
  'gardens-by-the-bay': 'https://videos.pexels.com/video-files/20018221/20018221-hd_1920_1080_18fps.mp4',
  'botanic-gardens-orchard': 'https://videos.pexels.com/video-files/20018221/20018221-hd_1920_1080_18fps.mp4',
  'mandai': 'https://videos.pexels.com/video-files/33279610/14175505_1920_1080_30fps.mp4',
  'jurong': 'https://videos.pexels.com/video-files/17114554/17114554-hd_1920_1080_24fps.mp4',
  'southern-ridges-faber': 'https://videos.pexels.com/video-files/17114554/17114554-hd_1920_1080_24fps.mp4',
  'katong': 'https://videos.pexels.com/video-files/33279610/14175505_1920_1080_30fps.mp4',
  'east-coast-changi': 'https://videos.pexels.com/video-files/37231708/15773139_1920_1080_60fps.mp4',
  'pulau-ubin': 'https://videos.pexels.com/video-files/17114554/17114554-hd_1920_1080_24fps.mp4',
  'macritchie': 'https://videos.pexels.com/video-files/17152686/17152686-hd_1920_1080_24fps.mp4',
  'bukit-timah-rail-corridor': 'https://videos.pexels.com/video-files/15502307/15502307-hd_1920_1080_30fps.mp4',
  'marina-bay-by-night': 'https://videos.pexels.com/video-files/33279610/14175505_1920_1080_30fps.mp4',
  'day-trip': 'https://videos.pexels.com/video-files/33279610/14175505_1920_1080_30fps.mp4',
  'kranji': 'https://videos.pexels.com/video-files/17152686/17152686-hd_1920_1080_24fps.mp4',
  'haw-par-villa-pasir-panjang': 'https://videos.pexels.com/video-files/31992897/13634110_1920_1080_30fps.mp4',
  'tiong-bahru': 'https://videos.pexels.com/video-files/37495816/15885022_1920_1080_30fps.mp4',
  'orchard-emerald-hill': 'https://videos.pexels.com/video-files/17114554/17114554-hd_1920_1080_24fps.mp4',
  'singapore-river-quays': 'https://videos.pexels.com/video-files/33279610/14175505_1920_1080_30fps.mp4',
  'marina-east-barrage': 'https://videos.pexels.com/video-files/35218335/14919756_1920_1080_60fps.mp4',
  'changi-jewel-chinatown-night': 'https://videos.pexels.com/video-files/38275427/16252138_1920_1080_50fps.mp4',
  'southern-islands': 'https://videos.pexels.com/video-files/17114554/17114554-hd_1920_1080_24fps.mp4',
  'harbourfront-mount-faber': 'https://videos.pexels.com/video-files/35061520/14852250_1920_1080_30fps.mp4',
  'sentosa-farewell': 'https://videos.pexels.com/video-files/17114554/17114554-hd_1920_1080_24fps.mp4',
  'el-nido': 'https://videos.pexels.com/video-files/33285991/14178391_1920_1080_60fps.mp4',
  'bacuit-bay': 'https://videos.pexels.com/video-files/34672212/14695775_1920_1080_60fps.mp4',
  'coron': 'https://videos.pexels.com/video-files/33678848/14307375_1920_1080_60fps.mp4',
  'puerto-princesa': 'https://videos.pexels.com/video-files/32970330/14053148_1920_1080_60fps.mp4',
  'cebu': 'https://videos.pexels.com/video-files/38506233/16352687_1920_1080_60fps.mp4',
  'kawasan': 'https://videos.pexels.com/video-files/32970330/14053148_1920_1080_60fps.mp4',
  'moalboal': 'https://videos.pexels.com/video-files/38506233/16352687_1920_1080_60fps.mp4',
  'oslob': 'https://videos.pexels.com/video-files/38506233/16352687_1920_1080_60fps.mp4',
  'bohol': 'https://videos.pexels.com/video-files/32970330/14053148_1920_1080_60fps.mp4',
  'balicasag': 'https://videos.pexels.com/video-files/36379819/15428369_1920_1080_60fps.mp4',
  'siquijor': 'https://videos.pexels.com/video-files/33861073/14369175_1920_1080_60fps.mp4',
  'apo-island': 'https://videos.pexels.com/video-files/33021656/14072270_1920_1080_60fps.mp4',
  'siargao': 'https://videos.pexels.com/video-files/6710606/6710606-hd_1920_1080_30fps.mp4',
  'camiguin': 'https://videos.pexels.com/video-files/38506233/16352687_1920_1080_60fps.mp4',
  'boracay': 'https://videos.pexels.com/video-files/36658255/15540977_1920_1080_60fps.mp4',
  'manila': 'https://videos.pexels.com/video-files/33728446/14321631_1920_1080_30fps.mp4',
  'banaue': 'https://videos.pexels.com/video-files/35998718/15264147_1920_1080_60fps.mp4',
  'batad': 'https://videos.pexels.com/video-files/33861073/14369175_1920_1080_60fps.mp4',
  'sagada': 'https://videos.pexels.com/video-files/33861073/14369175_1920_1080_60fps.mp4',
  'vigan': 'https://videos.pexels.com/video-files/36724807/15564708_1920_1080_25fps.mp4',
  'return-to-palawan': 'https://videos.pexels.com/video-files/33021656/14072270_1920_1080_60fps.mp4',
  'kuala-lumpur': 'https://videos.pexels.com/video-files/15668868/15668868-hd_1920_1080_30fps.mp4',
  'kl': 'https://videos.pexels.com/video-files/12704623/12704623-hd_1920_1080_24fps.mp4',
  'penang': 'https://videos.pexels.com/video-files/19968466/19968466-hd_1920_1080_30fps.mp4',
  'langkawi': 'https://videos.pexels.com/video-files/11439194/11439194-hd_1920_1080_30fps.mp4',
  'ipoh': 'https://videos.pexels.com/video-files/19956584/19956584-hd_1920_1080_30fps.mp4',
  'cameron-highlands': 'https://videos.pexels.com/video-files/35344835/14977503_1920_1080_60fps.mp4',
  'taman-negara': 'https://videos.pexels.com/video-files/32547819/13880548_1920_1080_30fps.mp4',
  'malacca': 'https://videos.pexels.com/video-files/20575944/20575944-hd_1920_1080_30fps.mp4',
  'perhentian': 'https://videos.pexels.com/video-files/10490630/10490630-hd_1920_1080_30fps.mp4',
  'kuala-terengganu': 'https://videos.pexels.com/video-files/14553547/14553547-hd_1920_1080_30fps.mp4',
  'kota-bharu': 'https://videos.pexels.com/video-files/2867870/2867870-hd_1920_1080_24fps.mp4',
  'kuching': 'https://videos.pexels.com/video-files/11499060/11499060-hd_1920_1080_30fps.mp4',
  'bako': 'https://videos.pexels.com/video-files/31005377/13252887_1920_1080_30fps.mp4',
  'mulu': 'https://videos.pexels.com/video-files/15502307/15502307-hd_1920_1080_30fps.mp4',
  'kota-kinabalu': 'https://videos.pexels.com/video-files/2867870/2867870-hd_1920_1080_24fps.mp4',
  'kinabalu-park': 'https://videos.pexels.com/video-files/30567544/13090375_1920_1080_30fps.mp4',
  'semporna': 'https://videos.pexels.com/video-files/32279291/13765933_1920_1080_30fps.mp4',
  'sipadan': 'https://videos.pexels.com/video-files/2257055/2257055-hd_1366_720_24fps.mp4',
  'return-to-penang': 'https://videos.pexels.com/video-files/19968466/19968466-hd_1920_1080_30fps.mp4',
}
const COUNTRY_VIDEO: Record<string, string> = {
  'japan': 'https://videos.pexels.com/video-files/37593714/15932804_1920_1080_60fps.mp4',
  'vietnam': 'https://videos.pexels.com/video-files/37969260/16111571_1920_1080_60fps.mp4',
  'china': 'https://videos.pexels.com/video-files/38368356/16294098_1920_1080_60fps.mp4',
  'thailand': 'https://videos.pexels.com/video-files/31454275/13413284_1920_1080_30fps.mp4',
}

// Full-day slug: "Tokyo — Arrival & Shinjuku" → "tokyo-arrival-shinjuku".
const daySlug = (city: string) =>
  city.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

// Landmark slug (first segment): "Ha Long Bay — Cruise" → "ha-long-bay".
const landmarkSlug = (city: string) =>
  city
    .split(/[—·,(]/)[0]
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// Prefer the day-specific clip, then the landmark clip, then a per-country
// fallback, then (in the component) the day's cover image.
const heroVideoFor = (countryId: string, city: string): string | undefined =>
  DAY_VIDEO[daySlug(city)] ?? LANDMARK_VIDEO[landmarkSlug(city)] ?? COUNTRY_VIDEO[countryId]

// ─── Country registry ───────────────────────────────────────────────────

const COUNTRIES: Country[] = [
  {
    id: 'japan',
    name: 'Japan',
    nameLocal: '日本',
    flag: '🇯🇵',
    tagline: 'Land of the Rising Sun',
    intro:
      'From the neon canyons of Tokyo to the moss gardens of Kyoto, the alpine thatch of Shirakawa-go and the floating torii of Miyajima — thirty days the length of the archipelago, where the hyper-modern and the ancient share the same street corner.',
    accent: '#c0392b',
    currencySymbol: '¥',
    currencyCode: 'JPY',
    fxPerUsd: 150,
    motto: '一期一会 — one time, one meeting',
    film: [
      img('1606918801925-e2c914c4b503'),
      img('1493976040374-85c8e12f0c0e'),
      img('1542051841857-5f90071e7989'),
      img('1528360983277-13d401cdc186'),
      img('1504109586057-7a2ae83d1338'),
      img('1756285338914-fc6e567d96bc'),
    ],
    highlights: [
      { title: 'Fushimi Inari', blurb: 'Ten thousand vermillion torii climbing a sacred mountain.', image: img('1493976040374-85c8e12f0c0e', 800, 600), alt: 'Endless red torii gates', tag: 'Icon' },
      { title: 'Mount Fuji', blurb: "Japan's sacred cone mirrored in the Five Lakes.", image: img('1606918801925-e2c914c4b503', 800, 600), alt: 'Mount Fuji over a lake', tag: 'Natural Wonder' },
      { title: 'teamLab Digital Art', blurb: 'Immersive rooms of light and water in Tokyo.', image: img('1703437874711-d6d3de1e0013', 800, 600), alt: 'Glowing digital art installation', tag: 'Modern' },
      { title: 'Shirakawa-go', blurb: 'Thatched gassho farmhouses in an alpine valley.', image: img('1756285338914-fc6e567d96bc', 800, 600), alt: 'Thatched farmhouses in a valley', tag: 'UNESCO' },
      { title: 'Miyajima Torii', blurb: 'The great gate that floats on the rising tide.', image: img('1504109586057-7a2ae83d1338', 800, 600), alt: 'Red torii gate in the sea', tag: 'Icon' },
      { title: 'Osaka Street Food', blurb: 'Takoyaki and neon along the Dotonbori canal.', image: img('1589452271712-64b8a66c7b71', 800, 600), alt: 'Glowing signs over Dotonbori', tag: 'Foodie' },
    ],
    itinerary: ITINERARY,
  },
  {
    id: 'vietnam',
    name: 'Vietnam',
    nameLocal: 'Việt Nam',
    flag: '🇻🇳',
    tagline: 'Timeless Charm, North to South',
    intro:
      'A sinuous ribbon of a country, from the karst islands of Ha Long and the rice terraces of Sapa to the lantern-lit lanes of Hoi An and the motorbike rivers of Saigon — ten days of street food, silk, and emerald water.',
    accent: '#0e7c66',
    currencySymbol: '₫',
    currencyCode: 'VND',
    fxPerUsd: 25000,
    motto: 'Ăn quả nhớ kẻ trồng cây — remember who planted the tree',
    film: [
      img('1593994602837-530142086918'),
      img('1755709986407-f72e45084ff2'),
      img('1609412058473-c199497c3c5d'),
      img('1741138327956-dfa75763b50d'),
      img('1656692197297-cb1340b4d538'),
    ],
    highlights: [
      { title: 'Ha Long Bay', blurb: 'Two thousand limestone islands rising from jade water.', image: img('1593994602837-530142086918', 800, 600), alt: 'Limestone islands in Ha Long Bay', tag: 'UNESCO' },
      { title: 'Hoi An Lanterns', blurb: 'A silk-trading port aglow with paper lanterns.', image: img('1755709986407-f72e45084ff2', 800, 600), alt: 'Lanterns over a Hoi An market', tag: 'Icon' },
      { title: 'Sapa Terraces', blurb: 'Emerald staircases farmed by hill-tribe villages.', image: img('1609412058473-c199497c3c5d', 800, 600), alt: 'Rice terraces in Sapa', tag: 'Highland' },
      { title: 'Golden Bridge', blurb: 'A walkway lifted by two giant stone hands.', image: img('1741138327956-dfa75763b50d', 800, 600), alt: 'The Golden Bridge and its stone hands', tag: 'Modern' },
      { title: 'Street Food', blurb: 'Pho, banh mi, and egg coffee on every corner.', image: img('1764745021303-c3d97bedd2c6', 800, 600), alt: 'Diners at a street cafe', tag: 'Foodie' },
      { title: 'Mekong Delta', blurb: 'Floating markets in the rice bowl of the south.', image: img('1543411789-1a67a2ac05c6', 800, 600), alt: 'A boat on a Mekong canal', tag: 'River Life' },
    ],
    itinerary: VIETNAM_ITINERARY,
  },
  {
    id: 'china',
    name: 'China',
    nameLocal: '中国',
    flag: '🇨🇳',
    tagline: 'The Middle Kingdom',
    intro:
      "Four thousand years across a continent — the Great Wall snaking over Beijing's hills, the buried army of Xi'an, the Avatar peaks of Zhangjiajie and the neon Bund of Shanghai, bound together by the world's fastest trains.",
    accent: '#9e1b1b',
    currencySymbol: 'CN¥',
    currencyCode: 'CNY',
    fxPerUsd: 7.2,
    motto: '读万卷书，行万里路 — read ten thousand books, walk ten thousand miles',
    film: [
      img('1608037521277-154cd1b89191'),
      img('1514920735211-8c697444a248'),
      img('1636964886908-7b28097bc746'),
      img('1603120527222-33f28c2ce89e'),
      img('1474181487882-5abf3f0ba6c2'),
    ],
    highlights: [
      { title: 'The Great Wall', blurb: 'Watchtowers marching over the mountains for miles.', image: img('1608037521277-154cd1b89191', 800, 600), alt: 'The Great Wall over mountains', tag: 'Wonder' },
      { title: 'Forbidden City', blurb: 'Nine thousand rooms behind vermillion walls.', image: img('1603120527222-33f28c2ce89e', 800, 600), alt: 'Rooftops of the Forbidden City', tag: 'Imperial' },
      { title: 'Terracotta Army', blurb: "An emperor's clay legion, each face unique.", image: img('1527922891260-918d42a4efc8', 800, 600), alt: 'Terracotta warriors in a pit', tag: 'UNESCO' },
      { title: 'Zhangjiajie', blurb: 'The sandstone pillars that inspired Avatar.', image: img('1514920735211-8c697444a248', 800, 600), alt: 'Sandstone pillars in mist', tag: 'Natural Wonder' },
      { title: 'Li River', blurb: 'Karst peaks and fishermen on a misty river.', image: img('1636964886908-7b28097bc746', 800, 600), alt: 'Karst peaks along the Li River', tag: 'Scenic' },
      { title: 'Giant Pandas', blurb: "Chengdu's bamboo-munching national treasures.", image: img('1625859043880-56acbcb6a6ac', 800, 600), alt: 'A giant panda in a tree', tag: 'Wildlife' },
    ],
    itinerary: CHINA_ITINERARY,
  },
  {
    id: 'thailand',
    name: 'Thailand',
    nameLocal: 'ประเทศไทย',
    flag: '🇹🇭',
    tagline: 'The Land of Smiles',
    intro:
      'From the golden temples and khlongs of Bangkok to the misty north of Chiang Mai and the turquoise Andaman islands — six days of street woks, longtail boats, and gilded spires in the only Southeast Asian land never colonised.',
    accent: '#1e6fbf',
    currencySymbol: '฿',
    currencyCode: 'THB',
    fxPerUsd: 35,
    motto: 'ไม่เป็นไร — mai pen rai, never mind, it is fine',
    film: [
      img('1510379872535-9310dc6fd6a7'),
      img('1504214208698-ea1916a2195a'),
      img('1519915247718-1703f9c6bb15'),
      img('1442548520776-20acf66617df'),
      img('1613672803979-a6edfc5a179b'),
    ],
    highlights: [
      { title: 'Wat Arun', blurb: 'The porcelain Temple of Dawn on the Chao Phraya.', image: img('1510379872535-9310dc6fd6a7', 800, 600), alt: 'Wat Arun temple', tag: 'Icon' },
      { title: 'Phi Phi Islands', blurb: 'Longtails and limestone cliffs in the Andaman.', image: img('1519915247718-1703f9c6bb15', 800, 600), alt: 'Longtail boat by cliffs', tag: 'Island' },
      { title: 'Floating Markets', blurb: 'Sampans heaped with fruit on the khlongs.', image: img('1442548520776-20acf66617df', 800, 600), alt: 'Boat on the water', tag: 'Culture' },
      { title: 'Chiang Mai Temples', blurb: 'Lanna spires and mountain monasteries.', image: img('1613672803979-a6edfc5a179b', 800, 600), alt: 'Temple in Chiang Mai', tag: 'Heritage' },
      { title: 'Andaman Beaches', blurb: 'Teal seas and powder-white sand.', image: img('1504214208698-ea1916a2195a', 800, 600), alt: 'Longtail boats on teal sea', tag: 'Beach' },
      { title: 'Street Food', blurb: 'Pad thai, som tam, and mango sticky rice.', image: img('1546228139-87f5312cac42', 800, 600), alt: 'Thai temple silhouette', tag: 'Foodie' },
    ],
    itinerary: THAILAND_ITINERARY,
  },
  {
    id: 'cambodia',
    name: 'Cambodia',
    nameLocal: 'កម្ពុជា',
    flag: '🇰🇭',
    tagline: 'Kingdom of Wonder',
    intro:
      'Four days around the greatest temple city ever built — sunrise over Angkor Wat, the serene faces of the Bayon, jungle-strangled Ta Prohm, and the stilt villages of the great Tonlé Sap lake.',
    accent: '#c0392b',
    currencySymbol: '$',
    currencyCode: 'USD',
    fxPerUsd: 1,
    motto: 'ជាតិ សាសនា ព្រះមហាក្សត្រ — Nation, Religion, King',
    film: [
      img('1504639650150-bf773680d8c3'),
      img('1602649306240-b9a8b17d12c6'),
      img('1602642977157-b7c8b8003afd'),
      img('1653959864991-c828b72c82a8'),
      img('1722052179738-659a771b5ff2'),
    ],
    highlights: [
      { title: 'Angkor Wat', blurb: 'The largest religious monument on earth at dawn.', image: img('1504639650150-bf773680d8c3', 800, 600), alt: 'Angkor Wat at sunrise', tag: 'Wonder' },
      { title: 'The Bayon', blurb: 'Two hundred giant serene stone faces.', image: img('1602649306240-b9a8b17d12c6', 800, 600), alt: 'Carved temple tower', tag: 'UNESCO' },
      { title: 'Ta Prohm', blurb: 'The temple cradled by giant jungle roots.', image: img('1602642977157-b7c8b8003afd', 800, 600), alt: 'Temple among trees', tag: 'Icon' },
      { title: 'Tonlé Sap', blurb: 'Floating villages on Southeast Asia\'s great lake.', image: img('1653959864991-c828b72c82a8', 800, 600), alt: 'Sunset over Tonlé Sap', tag: 'River Life' },
      { title: 'Banteay Srei', blurb: 'Pink sandstone carved in astonishing detail.', image: img('1722052179738-659a771b5ff2', 800, 600), alt: 'Green field near Angkor', tag: 'Heritage' },
      { title: 'Khmer Cuisine', blurb: 'Fish amok and Kampot-pepper crab.', image: img('1602649306240-b9a8b17d12c6', 800, 600), alt: 'Angkor temple detail', tag: 'Foodie' },
    ],
    itinerary: CAMBODIA_ITINERARY,
  },
  {
    id: 'laos',
    name: 'Laos',
    nameLocal: 'ລາວ',
    flag: '🇱🇦',
    tagline: 'Jewel of the Mekong',
    intro:
      'Three unhurried days in Luang Prabang, the golden UNESCO town on the Mekong bend — dawn alms-giving, the turquoise pools of Kuang Si, riverside temples, and slow boats on the great brown river.',
    accent: '#0e7c66',
    currencySymbol: '₭',
    currencyCode: 'LAK',
    fxPerUsd: 21000,
    motto: 'ບໍ່ເປັນຫຍັງ — bo pen nyang, no worries',
    film: [
      img('1628128573898-262b312f707e'),
      img('1745331568774-cc043277ac58'),
      img('1651670221939-2396cc2295c1'),
      img('1633984814807-672768a6923d'),
    ],
    highlights: [
      { title: 'Kuang Si Falls', blurb: 'Tiered turquoise pools in the jungle.', image: img('1745331568774-cc043277ac58', 800, 600), alt: 'Sunset over a Laos lake', tag: 'Natural Wonder' },
      { title: 'Alms Giving', blurb: 'A dawn line of saffron monks in Luang Prabang.', image: img('1628128573898-262b312f707e', 800, 600), alt: 'Boat on the Mekong', tag: 'Culture' },
      { title: 'The Mekong', blurb: 'Slow boats on the great brown river.', image: img('1651670221939-2396cc2295c1', 800, 600), alt: 'Boats moored on the river', tag: 'River Life' },
      { title: 'Wat Xieng Thong', blurb: 'The finest temple in all of Laos.', image: img('1633984814807-672768a6923d', 800, 600), alt: 'A boat on a Laos lake', tag: 'Heritage' },
      { title: 'Pak Ou Caves', blurb: 'River cliffs stuffed with retired Buddhas.', image: img('1628128573898-262b312f707e', 800, 600), alt: 'Mekong river scene', tag: 'UNESCO' },
      { title: 'Mount Phousi', blurb: 'Sunset over the meeting of two rivers.', image: img('1745331568774-cc043277ac58', 800, 600), alt: 'Lake and mountains at dusk', tag: 'Scenic' },
    ],
    itinerary: LAOS_ITINERARY,
  },
  {
    id: 'indonesia',
    name: 'Indonesia',
    nameLocal: 'Indonesia',
    flag: '🇮🇩',
    tagline: 'Island of the Gods',
    intro:
      'Four days across Bali — the rice terraces and temples of Ubud, a volcano sunrise, the surf cliffs of Uluwatu, and the wild coves of Nusa Penida, on one island of a nation of seventeen thousand.',
    accent: '#c0392b',
    currencySymbol: 'Rp',
    currencyCode: 'IDR',
    fxPerUsd: 16000,
    motto: 'Bhinneka Tunggal Ika — unity in diversity',
    film: [
      img('1559628233-eb1b1a45564b'),
      img('1682406187130-84561b4e0e78'),
      img('1557093793-e196ae071479'),
      img('1555400038-63f5ba517a47'),
      img('1557093793-d149a38a1be8'),
    ],
    highlights: [
      { title: 'Rice Terraces', blurb: 'The emerald subak staircases of Tegalalang.', image: img('1559628233-eb1b1a45564b', 800, 600), alt: 'Bali rice terraces', tag: 'Icon' },
      { title: 'Uluwatu Temple', blurb: 'A sea-cliff temple and the fire-lit Kecak dance.', image: img('1557093793-e196ae071479', 800, 600), alt: 'Green Bali mountain', tag: 'Heritage' },
      { title: 'Nusa Penida', blurb: 'The T-Rex cliff over a hidden white cove.', image: img('1555400038-63f5ba517a47', 800, 600), alt: 'Green field in Indonesia', tag: 'Beach' },
      { title: 'Mount Batur', blurb: 'A sunrise trek up an active volcano.', image: img('1682406187130-84561b4e0e78', 800, 600), alt: 'Lush Bali hillside', tag: 'Adventure' },
      { title: 'Ubud Culture', blurb: 'Monkey forests, temples, and Legong dance.', image: img('1557093793-d149a38a1be8', 800, 600), alt: 'Bali rice terrace', tag: 'Culture' },
      { title: 'Balinese Cuisine', blurb: 'Babi guling and sambal matah.', image: img('1559628233-eb1b1a45564b', 800, 600), alt: 'Rice terrace aerial', tag: 'Foodie' },
    ],
    itinerary: INDONESIA_ITINERARY,
  },
  {
    id: 'singapore',
    name: 'Singapore',
    nameLocal: '新加坡',
    flag: '🇸🇬',
    tagline: 'The Lion City',
    intro:
      'Three days in the gleaming city-state where four cultures meet — the Supertrees of Gardens by the Bay, Michelin-starred hawker stalls, the temples of Chinatown and Little India, and the beaches of Sentosa.',
    accent: '#c0392b',
    currencySymbol: 'S$',
    currencyCode: 'SGD',
    fxPerUsd: 1.35,
    motto: 'Majulah Singapura — onward, Singapore',
    film: [
      img('1525625293386-3f8f99389edd'),
      img('1496939376851-89342e90adcd'),
      img('1569288063643-5d29ad64df09'),
      img('1516422641841-cd9803ab02c6'),
      img('1628221680019-f28a2716e727'),
    ],
    highlights: [
      { title: 'Gardens by the Bay', blurb: 'The Supertree Grove and Cloud Forest dome.', image: img('1525625293386-3f8f99389edd', 800, 600), alt: 'Marina Bay Sands and gardens', tag: 'Icon' },
      { title: 'Marina Bay Sands', blurb: 'The ship-shaped SkyPark over the skyline.', image: img('1569288063643-5d29ad64df09', 800, 600), alt: 'Marina Bay Sands hotel', tag: 'Modern' },
      { title: 'Hawker Centres', blurb: 'Michelin chicken rice, laksa, and chilli crab.', image: img('1496939376851-89342e90adcd', 800, 600), alt: 'Singapore riverfront', tag: 'Foodie' },
      { title: 'Chinatown', blurb: 'Temples, red lanterns, and old shophouses.', image: img('1516422641841-cd9803ab02c6', 800, 600), alt: 'City building at night', tag: 'Culture' },
      { title: 'Sentosa Island', blurb: 'Beaches, cable cars, and a vast aquarium.', image: img('1628221680019-f28a2716e727', 800, 600), alt: 'Aerial city view', tag: 'Beach' },
      { title: 'Skyline by Night', blurb: 'The Spectra light show across the bay.', image: img('1525625293386-3f8f99389edd', 800, 600), alt: 'Marina Bay at dusk', tag: 'Icon' },
    ],
    itinerary: SINGAPORE_ITINERARY,
  },
  {
    id: 'philippines',
    name: 'Philippines',
    nameLocal: 'Pilipinas',
    flag: '🇵🇭',
    tagline: 'The Pearl of the Orient Sea',
    intro:
      'Four days in Palawan, the last frontier — the lagoons of El Nido, island-hopping across Bacuit Bay, the shipwrecks and hidden lakes of Coron, in an archipelago of seven thousand islands.',
    accent: '#1e6fbf',
    currencySymbol: '₱',
    currencyCode: 'PHP',
    fxPerUsd: 58,
    motto: 'Maka-Diyos, Maka-Tao, Makakalikasan — for God, people, and nature',
    film: [
      img('1697135756100-7b610c8fe92e'),
      img('1697473259118-473211915531'),
      img('1763581616094-c1b4097972d4'),
      img('1771533679967-1b6f3a10be02'),
    ],
    highlights: [
      { title: 'El Nido Lagoons', blurb: 'Jade water walled by soaring limestone.', image: img('1697135756100-7b610c8fe92e', 800, 600), alt: 'Boats in El Nido', tag: 'Icon' },
      { title: 'Bacuit Bay', blurb: 'Island-hopping by outrigger bangka.', image: img('1697473259118-473211915531', 800, 600), alt: 'Karst islands in Palawan', tag: 'Island' },
      { title: 'Coron Wrecks', blurb: 'WWII shipwrecks in clear shallow water.', image: img('1763581616094-c1b4097972d4', 800, 600), alt: 'Aerial of a lagoon', tag: 'Adventure' },
      { title: 'Kayangan Lake', blurb: '"The cleanest lake in the Philippines."', image: img('1771533679967-1b6f3a10be02', 800, 600), alt: 'Jagged green islands', tag: 'Natural Wonder' },
      { title: 'Hidden Beaches', blurb: 'Castaway coves reached only by boat.', image: img('1697135756100-7b610c8fe92e', 800, 600), alt: 'Boats on blue water', tag: 'Beach' },
      { title: 'Filipino Feasts', blurb: 'Kinilaw, sinigang, and grilled seafood.', image: img('1697473259118-473211915531', 800, 600), alt: 'Palawan islands', tag: 'Foodie' },
    ],
    itinerary: PHILIPPINES_ITINERARY,
  },
  {
    id: 'malaysia',
    name: 'Malaysia',
    nameLocal: 'Malaysia',
    flag: '🇲🇾',
    tagline: 'Truly Asia',
    intro:
      'Four days from the Twin Towers and Batu Caves of Kuala Lumpur to the heritage streets and legendary food of George Town, Penang — a Malay, Chinese, and Indian melting pot.',
    accent: '#9e1b1b',
    currencySymbol: 'RM',
    currencyCode: 'MYR',
    fxPerUsd: 4.5,
    motto: 'Bersekutu Bertambah Mutu — unity is strength',
    film: [
      img('1506320775314-84c60bff00ff'),
      img('1597148543182-830ef7bbb904'),
      img('1569878698898-3d112b16d123'),
      img('1585031039436-16a906da2f05'),
      img('1585835310560-5b850cc2b771'),
    ],
    highlights: [
      { title: 'Petronas Towers', blurb: 'The silver twin towers that define KL.', image: img('1506320775314-84c60bff00ff', 800, 600), alt: 'Petronas Twin Towers', tag: 'Icon' },
      { title: 'Batu Caves', blurb: 'A golden deity and 272 rainbow steps.', image: img('1597148543182-830ef7bbb904', 800, 600), alt: 'KL skyline at night', tag: 'Heritage' },
      { title: 'George Town', blurb: 'Street art and heritage clan jetties in Penang.', image: img('1585031039436-16a906da2f05', 800, 600), alt: 'Malaysian street scene', tag: 'UNESCO' },
      { title: 'Penang Food', blurb: 'The finest char kway teow and assam laksa.', image: img('1585835310560-5b850cc2b771', 800, 600), alt: 'City buildings by day', tag: 'Foodie' },
      { title: 'KL Skyline', blurb: 'Rooftop bars among the skyscrapers.', image: img('1569878698898-3d112b16d123', 800, 600), alt: 'Petronas towers view', tag: 'Modern' },
      { title: 'Penang Hill', blurb: 'A funicular to the cool green summit.', image: img('1506320775314-84c60bff00ff', 800, 600), alt: 'Twin towers detail', tag: 'Scenic' },
    ],
    itinerary: MALAYSIA_ITINERARY,
  },
]

// ─── Per-country metadata: timezone, specialty icons, map position ────────

interface Specialty {
  icon: string
  label: string
}

interface CountryMeta {
  tz: string
  specialties: Specialty[]
  map: { x: number; y: number }
}

const COUNTRY_META: Record<string, CountryMeta> = {
  japan: {
    tz: 'Asia/Tokyo',
    specialties: [
      { icon: '🍣', label: 'Sushi' },
      { icon: '⛩️', label: 'Torii' },
      { icon: '🗻', label: 'Mt Fuji' },
      { icon: '🌸', label: 'Sakura' },
    ],
    map: { x: 90, y: 14 },
  },
  china: {
    tz: 'Asia/Shanghai',
    specialties: [
      { icon: '🥟', label: 'Dumplings' },
      { icon: '🧱', label: 'Great Wall' },
      { icon: '🐼', label: 'Panda' },
      { icon: '🍵', label: 'Tea' },
    ],
    map: { x: 58, y: 8 },
  },
  laos: {
    tz: 'Asia/Vientiane',
    specialties: [
      { icon: '🍚', label: 'Sticky rice' },
      { icon: '💦', label: 'Kuang Si' },
      { icon: '🧡', label: 'Alms' },
      { icon: '🛶', label: 'Mekong' },
    ],
    map: { x: 47, y: 34 },
  },
  vietnam: {
    tz: 'Asia/Ho_Chi_Minh',
    specialties: [
      { icon: '🍜', label: 'Pho' },
      { icon: '🛶', label: 'Ha Long' },
      { icon: '☕', label: 'Egg coffee' },
      { icon: '🏮', label: 'Lanterns' },
    ],
    map: { x: 57, y: 44 },
  },
  thailand: {
    tz: 'Asia/Bangkok',
    specialties: [
      { icon: '🍤', label: 'Pad Thai' },
      { icon: '🛕', label: 'Wat Arun' },
      { icon: '🐘', label: 'Elephant' },
      { icon: '🏝️', label: 'Islands' },
    ],
    map: { x: 41, y: 42 },
  },
  cambodia: {
    tz: 'Asia/Phnom_Penh',
    specialties: [
      { icon: '🛕', label: 'Angkor' },
      { icon: '🐟', label: 'Fish amok' },
      { icon: '🌾', label: 'Tonlé Sap' },
      { icon: '💃', label: 'Apsara' },
    ],
    map: { x: 51, y: 53 },
  },
  philippines: {
    tz: 'Asia/Manila',
    specialties: [
      { icon: '🍲', label: 'Adobo' },
      { icon: '🏝️', label: 'El Nido' },
      { icon: '🤿', label: 'Wrecks' },
      { icon: '🥥', label: 'Coconut' },
    ],
    map: { x: 74, y: 50 },
  },
  malaysia: {
    tz: 'Asia/Kuala_Lumpur',
    specialties: [
      { icon: '🏙️', label: 'Twin Towers' },
      { icon: '🍜', label: 'Laksa' },
      { icon: '🕌', label: 'Batu Caves' },
      { icon: '🍢', label: 'Satay' },
    ],
    map: { x: 44, y: 64 },
  },
  singapore: {
    tz: 'Asia/Singapore',
    specialties: [
      { icon: '🦁', label: 'Merlion' },
      { icon: '🌳', label: 'Supertrees' },
      { icon: '🦀', label: 'Chilli crab' },
      { icon: '🍜', label: 'Laksa' },
    ],
    map: { x: 48, y: 72 },
  },
  indonesia: {
    tz: 'Asia/Makassar',
    specialties: [
      { icon: '🌾', label: 'Rice terrace' },
      { icon: '🌋', label: 'Batur' },
      { icon: '🏄', label: 'Surf' },
      { icon: '🐒', label: 'Monkey forest' },
    ],
    map: { x: 58, y: 84 },
  },
}

// ─── Flip-card stories, keyed `${countryId}:${highlight title}` ───────────

const STORIES: Record<string, string> = {
  // Japan
  'japan:Fushimi Inari': 'Each of the ten thousand gates was donated by a business praying for prosperity — read the names carved on the back as you climb.',
  'japan:Mount Fuji': 'Still an active volcano, Fuji last erupted in 1707 and has been climbed by pilgrims for over a thousand years.',
  'japan:teamLab Digital Art': 'The artworks are not fixed — they respond to your presence, so no two visitors ever see the same room twice.',
  'japan:Shirakawa-go': 'The steep thatched roofs, built without a single nail, are angled to shrug off metres of winter snow.',
  'japan:Miyajima Torii': 'At high tide the great gate seems to float; at low tide you can walk out and press a coin into its barnacled legs for luck.',
  'japan:Osaka Street Food': 'Osakans greet each other with "have you eaten well?" — the city\'s motto is kuidaore, to eat yourself to ruin.',
  // China
  'china:The Great Wall': 'Not one wall but many, built over two thousand years — end to end it would stretch more than halfway around the planet.',
  'china:Forbidden City': 'For five centuries commoners entered on pain of death; today its 9,000 rooms hold the world\'s largest collection of preserved wooden architecture.',
  'china:Terracotta Army': 'A farmer digging a well found them in 1974 — each of the 8,000 soldiers has a unique face, thought to be modelled on real men.',
  'china:Zhangjiajie': 'The 3,000 quartzite pillars so awed the makers of Avatar that they renamed one the "Hallelujah Mountain".',
  'china:Li River': 'This exact stretch of karst and river is printed on the back of the 20-yuan note — hold one up and compare.',
  'china:Giant Pandas': 'A panda spends up to 14 hours a day eating bamboo, yet its gut is that of a carnivore — evolution\'s odd compromise.',
  // Vietnam
  'vietnam:Ha Long Bay': 'Legend says a dragon sent by the gods spat out jewels that became these islands, walling the coast against invaders.',
  'vietnam:Hoi An Lanterns': 'On the full-moon night each month the town cuts its electric lights, and the old streets glow only by silk lantern.',
  'vietnam:Sapa Terraces': 'The Hmong and Dao peoples have farmed these staircases for centuries, moving water field to field by hand-cut channels.',
  'vietnam:Golden Bridge': 'The two giant hands that cradle the walkway were built to look weathered and ancient — they are barely a decade old.',
  'vietnam:Street Food': 'Hanoi\'s egg coffee was born of a 1940s milk shortage — a bartender whipped yolk and sugar into a silky cloud instead.',
  'vietnam:Mekong Delta': 'Wholesalers on the floating markets hang a sample of their wares from a tall pole so buyers can spot them across the water.',
  // Thailand
  'thailand:Wat Arun': 'Its spire is encrusted with broken Chinese porcelain — ballast from trading ships, turned into shimmering mosaic.',
  'thailand:Phi Phi Islands': 'Maya Bay was closed for years to let its reefs recover; visitors now anchor offshore to protect the returning blacktip sharks.',
  'thailand:Floating Markets': 'Before roads, the khlongs were the highways — vendors still cook full meals from charcoal stoves in their narrow boats.',
  'thailand:Chiang Mai Temples': 'Doi Suthep\'s temple marks the spot where, legend says, a white elephant carrying a relic climbed the hill, trumpeted thrice, and died.',
  'thailand:Andaman Beaches': 'The limestone karsts are ancient coral reefs, lifted from the sea floor and sculpted by rain into their dramatic overhangs.',
  'thailand:Street Food': 'Bangkok was once ranked the world\'s best street-food city — a single soup vendor here has held a Michelin star since 2018.',
  // Cambodia
  'cambodia:Angkor Wat': 'Built as a Hindu temple to Vishnu, it faces west — toward the setting sun and the realm of the dead — unlike almost every other temple here.',
  'cambodia:The Bayon': 'The 200 faces are thought to be the king himself blended with a bodhisattva — wherever you stand, one is always watching you.',
  'cambodia:Ta Prohm': 'Archaeologists deliberately left the strangler figs in place, a rare monument left to the embrace of the jungle.',
  'cambodia:Tonlé Sap': 'Each monsoon the lake\'s river reverses direction and it swells fivefold — the villages simply float up with the rising water.',
  'cambodia:Banteay Srei': 'Its carvings are so fine and deep they were long believed to be the work of women — hence its name, the Citadel of Women.',
  'cambodia:Khmer Cuisine': 'Fish amok is steamed in a banana-leaf cup until it sets like a savoury custard, perfumed with kroeung and coconut.',
  // Laos
  'laos:Kuang Si Falls': 'The water\'s dreamlike blue comes from dissolved limestone (travertine), which also builds the natural terraces pool by pool.',
  'laos:Alms Giving': 'Before dawn, hundreds of barefoot monks walk in silence to receive sticky rice — give with respect, and never stand above them.',
  'laos:The Mekong': 'The "mother of waters" runs 4,900km through six countries; the two-day slow boat to Luang Prabang is a rite of passage.',
  'laos:Wat Xieng Thong': 'Its "tree of life" mosaic and low, sweeping roofs are the masterpiece of classic Luang Prabang temple style.',
  'laos:Pak Ou Caves': 'For centuries pilgrims left unwanted Buddha statues here rather than destroy them — now over 4,000 crowd the river cliffs.',
  'laos:Mount Phousi': 'The 328 steps pass a gilded stupa and a Buddha footprint before the payoff: sunset over the meeting of the Mekong and Nam Khan.',
  // Indonesia
  'indonesia:Rice Terraces': 'The subak irrigation system, run cooperatively by farmers for over a thousand years, is a UNESCO-listed philosophy as much as a technique.',
  'indonesia:Uluwatu Temple': 'Perched on a 70m sea cliff, it is guarded by a troop of monkeys notorious for stealing sunglasses — and bartering them back for fruit.',
  'indonesia:Nusa Penida': 'The famous Kelingking cliff is said to resemble a T-Rex; the turquoise cove at its foot takes 400 steep steps to reach.',
  'indonesia:Mount Batur': 'Trekkers climb by torchlight to reach the 1,717m rim for sunrise, then breakfast on eggs cooked in the volcano\'s own steam.',
  'indonesia:Ubud Culture': 'Bali runs on a 210-day ritual calendar — on any given day, somewhere a temple is dressed in gold for an anniversary.',
  'indonesia:Balinese Cuisine': 'Babi guling, a whole spit-roast pig stuffed with turmeric and lemongrass, was once reserved for temple offerings and feasts.',
  // Singapore
  'singapore:Gardens by the Bay': 'The Supertrees are living vertical gardens that harvest solar power and rainwater — and vent heat for the cooled conservatories nearby.',
  'singapore:Marina Bay Sands': 'The rooftop infinity pool, three football fields up, sits on a deck cantilevered further than any other in the world.',
  'singapore:Hawker Centres': 'Singapore\'s hawker culture is UNESCO-listed; two stalls here were the first street food anywhere to earn a Michelin star.',
  'singapore:Chinatown': 'The Buddha Tooth Relic Temple houses what is said to be a tooth of the Buddha, in a two-ton solid-gold stupa.',
  'singapore:Sentosa Island': 'The name means "peace and tranquility" — a gentle rebrand for an island that once held a British coastal fort and a WWII prison.',
  'singapore:Skyline by Night': 'The nightly Spectra show choreographs water jets, lasers, and orchestral music across the bay — and it is entirely free.',
  // Philippines
  'philippines:El Nido Lagoons': 'The towering karst is 250-million-year-old limestone; kayaks slip into lagoons through gaps that vanish at high tide.',
  'philippines:Bacuit Bay': 'The outrigger bangka boat, with its bamboo stabilisers, is a design little changed since the first Austronesian seafarers.',
  'philippines:Coron Wrecks': 'A dozen Japanese WWII ships sunk in a 1944 air raid now lie in clear shallow water, reborn as coral gardens.',
  'philippines:Kayangan Lake': 'Often called the cleanest lake in the country, its brackish water is a startling mix of fresh spring and seeping sea.',
  'philippines:Hidden Beaches': 'Many of Palawan\'s finest coves have no road at all — the only way in is by boat, and the only footprints are the tide\'s.',
  'philippines:Filipino Feasts': 'Adobo — meat braised in vinegar, soy, and garlic — was a way to preserve food in the tropics long before refrigeration.',
  // Malaysia
  'malaysia:Petronas Towers': 'The world\'s tallest twins were built by two rival crews racing floor for floor — and joined 170m up by a double-decker skybridge.',
  'malaysia:Batu Caves': 'The 42m golden statue of Murugan guards 272 steps, repainted in rainbow colours in 2018 to the dismay and delight of purists.',
  'malaysia:George Town': 'Lithuanian artist Ernest Zacharevic\'s 2012 wall murals turned the old port into an open-air gallery almost overnight.',
  'malaysia:Penang Food': 'Penangites will happily drive an hour and queue an hour more for the "right" stall — the char kway teow rivalry is deadly serious.',
  'malaysia:KL Skyline': 'The Heli Lounge bar is a working helipad by day and a railing-free rooftop bar by night — the city at your feet, quite literally.',
  'malaysia:Penang Hill': 'The funicular, opened in 1923, climbs so steeply through the jungle that a cool colonial hill station sits at the top, 800m up.',
}

function formatMoney(amount: number, c: Country) {
  return `${c.currencySymbol}${amount.toLocaleString('en-US')}`
}

function toUsd(amount: number, c: Country) {
  return Math.round(amount / c.fxPerUsd)
}

// ─── Cinematic intro film (Ken Burns crossfade montage) ─────────────────

function Montage({ images, playing, index }: { images: string[]; playing: boolean; index: number }) {
  return (
    <>
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-in-out ${
            i === index ? `opacity-100 ${playing ? 'kenburns-active' : ''}` : 'opacity-0'
          }`}
        />
      ))}
    </>
  )
}

function IntroFilm({ country, onOpen }: { country: Country; onOpen: () => void }) {
  const t = useT()
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    setIndex(0)
  }, [country.id])

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % country.film.length)
    }, 3800)
    return () => clearInterval(id)
  }, [playing, country.film.length])

  return (
    <div className="relative mb-8 h-[440px] overflow-hidden bg-[var(--color-foreground)]">
      <Montage images={country.film} playing={playing} index={index} />

      {/* Cinematic letterbox + gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />
      <div className="absolute inset-x-0 top-0 h-10 bg-black" />
      <div className="absolute inset-x-0 bottom-0 h-10 bg-black" />

      {/* NOW PLAYING marker */}
      <div className="absolute left-5 top-14 flex items-center gap-2">
        <span className="rec-pulse inline-block h-2 w-2 rounded-full bg-[var(--color-primary)]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/80">Now Playing</span>
      </div>

      {/* Title block */}
      <div className="film-rise absolute bottom-14 left-5 right-5" key={country.id}>
        <div className="mb-2 flex items-center gap-3">
          <span className="text-2xl leading-none">{country.flag}</span>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/70">{country.nameLocal}</span>
        </div>
        <h2 className="font-display text-5xl font-600 leading-none text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-6xl">
          {country.name}
        </h2>
        <p className="mt-3 max-w-xl font-display text-lg italic text-white/85">{country.tagline}</p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <RippleButton
            onClick={onOpen}
            ariaLabel={t('watchFilm')}
            className="group flex items-center gap-2.5 rounded-full bg-white/95 px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-[var(--color-foreground)] transition-transform duration-200 hover:scale-[1.04] active:scale-95"
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--color-primary)] text-white">
              <span className="ml-0.5 text-[9px]">▶</span>
            </span>
            {t('watchFilm')}
          </RippleButton>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="rounded-full border border-white/40 px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-white/90 transition-colors hover:bg-white/10"
          >
            {playing ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>

      {/* Slide progress ticks */}
      <div className="absolute bottom-14 right-5 hidden gap-1.5 sm:flex">
        {country.film.map((src, i) => (
          <button
            key={src}
            type="button"
            aria-label={`Scene ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === index ? 'w-7 bg-white' : 'w-3 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function FilmModal({ country, onClose }: { country: Country; onClose: () => void }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % country.film.length), 3200)
    return () => clearInterval(id)
  }, [country.film.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="film-rise relative w-full max-w-4xl overflow-hidden rounded-lg bg-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video w-full overflow-hidden bg-[var(--color-foreground)]">
          <Montage images={country.film} playing index={index} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close film"
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/80"
          >
            ✕
          </button>

          <div className="absolute left-5 top-4 flex items-center gap-2">
            <span className="rec-pulse inline-block h-2 w-2 rounded-full bg-[var(--color-primary)]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/80">Featurette</span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-xl leading-none">{country.flag}</span>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/70">{country.nameLocal}</span>
            </div>
            <h3 className="font-display text-3xl font-600 text-white sm:text-4xl">{country.name}</h3>
            <p className="mt-3 max-w-2xl font-body text-sm leading-relaxed text-white/85">{country.intro}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Highlights — interactive flip cards ─────────────────────────────────

function FlipCard({ country, h }: { country: Country; h: Highlight }) {
  const t = useT()
  const lang = useContext(LangContext)
  const [flipped, setFlipped] = useState(false)
  // When the interface is in this country's language, show the localized card;
  // its blurb doubles as the (in-language) flip-side story.
  const loc = localizedCard(country.id, lang, h.title)
  const title = loc?.title ?? h.title
  const tag = loc?.tag ?? h.tag
  const blurb = loc?.blurb ?? h.blurb
  const story = loc ? loc.blurb : STORIES[`${country.id}:${h.title}`] ?? h.blurb
  // When a hand-authored localized card exists, its text is already in-language;
  // only the English fallback should go through the auto-translation layer.
  const L = (s: string) => (loc ? s : <Tx>{s}</Tx>)

  return (
    <div className="flip aspect-[4/3]">
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label={`${title} — ${t('flipBack')}`}
        className={`flip-inner block w-full text-left focus:outline-none ${flipped ? 'is-flipped' : ''}`}
        style={{ height: '100%' }}
      >
        {/* Front — image + name */}
        <span className="flip-face group block border border-[var(--color-border)] bg-[var(--color-muted)]">
          <img src={h.image} alt={h.alt} className="h-full w-full object-cover" />
          <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <span className="absolute left-2 top-2 rounded-sm bg-[var(--color-primary)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--color-primary-foreground)]">
            {L(tag)}
          </span>
          <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-white/20 text-[11px] text-white backdrop-blur-sm">
            ↻
          </span>
          <span className="absolute bottom-0 left-0 right-0 p-3">
            <span className="block font-display text-base font-600 leading-tight text-white">{L(title)}</span>
            <span className="mt-0.5 block font-body text-xs leading-snug text-white/80">{L(blurb)}</span>
          </span>
        </span>

        {/* Back — the short story */}
        <span
          className="flip-face flip-back flex flex-col justify-between border p-4"
          style={{ background: country.accent, borderColor: country.accent }}
        >
          <span>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/70">{L(tag)}</span>
            <span className="mt-1.5 block font-display text-sm font-600 leading-tight text-white">{L(title)}</span>
          </span>
          <span className="block font-body text-[13px] leading-relaxed text-white/90">{L(story)}</span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-white/60">↻ {t('flipBack')}</span>
        </span>
      </button>
    </div>
  )
}

function Highlights({ country }: { country: Country }) {
  const t = useT()
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="font-display text-2xl font-600 tracking-tight">{t('specialtiesTitle')}</h2>
        <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted-foreground)]">
          {t('tapCard')}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {country.highlights.map((h) => (
          <FlipCard key={h.title} country={country} h={h} />
        ))}
      </div>
    </section>
  )
}

// ─── Live local time for the selected country ─────────────────────────────

function LocalTime({ country }: { country: Country }) {
  const meta = COUNTRY_META[country.id]
  const tz = meta?.tz ?? 'UTC'
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const dtf = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('en-US', { timeZone: tz, ...opts }).format(now)

  const weekday = dtf({ weekday: 'long' })
  const day = dtf({ day: '2-digit' })
  const month = dtf({ month: 'long' })
  const year = dtf({ year: 'numeric' })
  const time = dtf({ hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  const offset = dtf({ timeZoneName: 'shortOffset' }).split(' ').pop()

  return (
const COUNTRY_CLIMATE: Record<string, string> = {
  vietnam: '🌤️ 26°C · Dry Season · Ideal Exploration',
  thailand: '☀️ 31°C · Sunny & Tropical · Festival Season',
  indonesia: '⛅ 28°C · Tropical Breeze · Great Beach Season',
  laos: '☀️ 25°C · Cool Mountain Breeze',
  cambodia: '🌤️ 28°C · Pleasant & Sunny',
  myanmar: '☀️ 27°C · Dry & Golden Sunshine',
  malaysia: '☀️ 29°C · Warm & Sunny',
  singapore: '🌦️ 30°C · Tropical Sun & Showers',
  philippines: '☀️ 30°C · Clear Sky & Island Seas',
  brunei: '☀️ 29°C · Tropical Sun',
  timor: '☀️ 28°C · Warm Coastal Breeze',
  japan: '☀️ 18°C · Crisp & Clear · Peak Foliage',
  china: '🌤️ 16°C · Cool & Crisp',
}

function LocalTime({ country }: { country: Country }) {
  const meta = TIMEZONES[country.id]
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const fmt = (opts: Intl.DateTimeFormatOptions) => {
    try {
      return new Intl.DateTimeFormat('en-US', { ...opts, timeZone: meta?.tz }).format(now)
    } catch {
      return ''
    }
  }

  const time = fmt({ hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  const weekday = fmt({ weekday: 'long' })
  const day = fmt({ day: 'numeric' })
  const month = fmt({ month: 'long' })
  const year = fmt({ year: 'numeric' })
  const offset = currentOffset(meta?.tz)

  return (
    <section className="mb-8 flex flex-col gap-4 border border-[var(--color-border)] bg-[var(--color-card)] p-5 sm:flex-row sm:items-center sm:justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-3xl leading-none">{country.flag}</span>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted-foreground)]">
            Local time in {country.name}
          </div>
          <div className="font-display text-lg font-600 leading-tight">
            {weekday} · {day} {month} {year}
          </div>
          <div className="font-mono text-xs font-500 text-[var(--color-primary)] mt-1">
            {COUNTRY_CLIMATE[country.id] ?? '☀️ 26°C · Pleasant Weather'}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-mono text-4xl font-500 tabular-nums leading-none text-[var(--color-primary)]">
          {time}
        </div>
        <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-[var(--color-muted-foreground)]">
          {meta?.tz.replace('Asia/', '').replace('_', ' ')} · {offset}
        </div>
      </div>
    </section>
  )
}

// ─── Water-ripple CTA button (Southeast Asian rivers) ─────────────────────

function RippleButton({
  onClick,
  className = '',
  style,
  children,
  ariaLabel,
}: {
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
  ariaLabel?: string
}) {
  const [ripples, setRipples] = useState<{ x: number; y: number; size: number; id: number }[]>([])

  const spawn = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const size = Math.max(r.width, r.height) * 2.2
    const id = Date.now() + Math.random()
    setRipples((rs) => [...rs, { x: e.clientX - r.left, y: e.clientY - r.top, size, id }])
    window.setTimeout(() => setRipples((rs) => rs.filter((p) => p.id !== id)), 900)
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={`ripple-btn ${className}`}
      style={style}
      onClick={(e) => {
        spawn(e)
        onClick?.()
      }}
    >
      {ripples.map((p) => (
        <span key={p.id} className="ripple" style={{ left: p.x, top: p.y, width: p.size, height: p.size }} />
      ))}
      {children}
    </button>
  )
}

// ─── Steam / smoke rising from hot food ────────────────────────────────────

function Steam() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="steam"
          style={{ left: `${22 + i * 19}%`, animationDelay: `${i * 1.15}s`, animationDuration: `${4 + i * 0.4}s` }}
        />
      ))}
    </div>
  )
}

// ─── The Rice Journey — a scrollytelling sequence (field → table) ──────────

interface Chapter {
  n: string
  title: string
  where: string
  img: string
  text: string
  steam?: boolean
}

const RICE_JOURNEY: Chapter[] = [
  {
    n: '01',
    title: 'Vietnam',
    where: 'Sapa terraces to the Mekong delta',
    img: img('1609412058473-c199497c3c5d'),
    text: 'In Vietnam rice is the landscape itself — from the stepped terraces of Sapa in the far north to the vast Mekong delta in the south, the country\'s "rice bowl." It fills the humble plate of cơm tấm as readily as the morning bowl of phở, and Vietnam ranks among the largest rice exporters on earth.',
  },
  {
    n: '02',
    title: 'Laos',
    where: 'The children of sticky rice',
    img: img('1711060221380-acfa2c82cc99'),
    steam: true,
    text: 'Laos eats more sticky rice per head than anywhere in the world. "Khao niaw" is steamed in a woven bamboo basket, rolled into a ball by hand, and dipped straight into the dish — so central that the Lao call themselves luk khao niaw, "the children of sticky rice."',
  },
  {
    n: '03',
    title: 'Cambodia',
    where: 'Rice & fish, the Khmer table',
    img: img('1722052179738-659a771b5ff2'),
    text: 'Rice and freshwater fish are the twin pillars of the Khmer table. The fragrant jasmine grown around Battambang has twice been judged the world\'s finest, and a meal is built around a mound of rice seasoned with a little fermented prahok.',
  },
  {
    n: '04',
    title: 'Thailand',
    where: 'Have you eaten rice yet?',
    img: img('1689039234540-d335a43ca28a'),
    text: 'Thailand gave the world hom mali jasmine rice and remains one of its top exporters. The bond runs so deep that the everyday Thai greeting, "kin khao reu yang?", literally asks "have you eaten rice yet?"',
  },
  {
    n: '05',
    title: 'Myanmar',
    where: 'The Ayeyarwady granary',
    img: img('1711060266983-92bd378c850c'),
    text: 'A Burmese day often opens with rice — even the national dish, mohinga, is a rice-noodle soup. The great paddies of the Ayeyarwady delta feed the nation, and rice is heaped beside its many rich, oily curries.',
  },
  {
    n: '06',
    title: 'Malaysia',
    where: 'Nasi lemak on banana leaf',
    img: img('1552538962-40822613a09d'),
    steam: true,
    text: 'Malaysia\'s unofficial national dish is nasi lemak — rice steamed in coconut milk and pandan, served on a banana leaf with sambal, crisp anchovies, peanuts, and egg. From dawn stalls to feasts, coconut rice is never far away.',
  },
  {
    n: '07',
    title: 'Singapore',
    where: 'The hawker-centre icon',
    img: img('1529271230144-e8c648ef570d'),
    text: 'On a small island with no farmland, Singapore made rice its icon: Hainanese chicken rice, the grains cooked in the poached bird\'s own stock, is claimed as a national dish and served at every hawker centre.',
  },
  {
    n: '08',
    title: 'Indonesia',
    where: 'The offering to Dewi Sri',
    img: img('1555400038-63f5ba517a47'),
    text: 'Across thousands of islands rice is sacred — Balinese farmers still honour Dewi Sri, the rice goddess, and mould golden tumpeng cones for celebrations. Day to day it becomes nasi goreng, the beloved fried rice of the archipelago.',
  },
  {
    n: '09',
    title: 'Philippines',
    where: 'The terraces of Banaue',
    img: img('1518509562904-e7ef99cdcc86'),
    text: 'Filipinos eat rice at every meal, reborn each morning as garlic-fried sinangag. High in the Cordilleras, the two-thousand-year-old Banaue rice terraces are carved so grandly they are called the "Eighth Wonder of the World."',
  },
  {
    n: '10',
    title: 'Brunei',
    where: 'Nasi katok, day and night',
    img: img('1709808971463-270bae12b837'),
    text: 'In tiny, oil-rich Brunei rice remains the heart of the plate — most famously nasi katok, a simple parcel of rice, fried chicken, and sambal that fuels the sultanate around the clock.',
  },
  {
    n: '11',
    title: 'East Timor',
    where: 'Rice beside the maize',
    img: img('1746438411454-a74d56175749'),
    text: 'In the region\'s youngest nation rice shares the field with maize. Lowland families grow and pound their own paddy, and a shared plate of rice remains the foundation of the Timorese table.',
  },
]

function ScrollStory({
  eyebrow,
  title,
  lead,
  chapters,
}: {
  eyebrow: string
  title: string
  lead: string
  chapters: Chapter[]
}) {
  const [active, setActive] = useState(0)

  // Pick the chapter whose centre is nearest the viewport centre. A plain
  // scroll calculation never leaves the sticky image "stuck" between chapters
  // the way a thin IntersectionObserver band can.
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-story="rice"] [data-idx]'))
    if (nodes.length === 0) return
    let raf = 0
    const update = () => {
      raf = 0
      const mid = window.innerHeight / 2
      let best = 0
      let bestDist = Infinity
      nodes.forEach((el) => {
        const r = el.getBoundingClientRect()
        const d = Math.abs(r.top + r.height / 2 - mid)
        if (d < bestDist) {
          bestDist = d
          best = Number(el.dataset.idx)
        }
      })
      setActive(best)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [chapters.length])

  const current = chapters[active]

  return (
    <section data-story="rice" className="mb-16 border-t border-[var(--color-border)] pt-12">
      <div className="mb-8">
        <div className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--color-primary)]">{eyebrow}</div>
        <h2 className="mt-2 font-carve text-4xl leading-tight sm:text-5xl">
          <span className="script-rule">{title}</span>
        </h2>
        <p className="mt-4 max-w-2xl font-thin-body text-lg leading-relaxed text-[var(--color-muted-foreground)]"><Tx>{lead}</Tx></p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Sticky visual — crossfades as you scroll the chapters */}
        <div className="sticky top-20 hidden h-[68vh] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] md:block">
          {chapters.map((c, i) => (
            <img
              key={c.img}
              src={c.img}
              alt={c.title}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
                i === active ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
          {current?.steam && <Steam />}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="journey-index text-6xl">{current?.n}</div>
            <div className="mt-1 font-carve text-2xl text-white drop-shadow">{current?.title && <Tx>{current.title}</Tx>}</div>
            <div className="font-mono text-xs uppercase tracking-widest text-white/70">{current?.where && <Tx>{current.where}</Tx>}</div>
          </div>
        </div>

        {/* Scrolling chapters */}
        <div>
          {chapters.map((c, i) => (
            <div key={c.n} data-idx={i} className="flex min-h-[62vh] flex-col justify-center py-8">
              {/* Mobile image */}
              <div className="relative mb-4 h-52 overflow-hidden rounded-lg border border-[var(--color-border)] md:hidden">
                <img src={c.img} alt={c.title} className="h-full w-full object-cover" />
                {c.steam && <Steam />}
              </div>
              <div className="flex items-baseline gap-4">
                <span className="journey-index text-5xl">{c.n}</span>
                <div>
                  <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted-foreground)]"><Tx>{c.where}</Tx></div>
                  <h3 className="font-carve text-3xl"><Tx>{c.title}</Tx></h3>
                </div>
              </div>
              <p
                className={`mt-4 max-w-md font-body text-base leading-relaxed transition-colors duration-300 ${
                  i === active ? 'text-[var(--color-foreground)]' : 'text-[var(--color-muted-foreground)]'
                }`}
              >
                <Tx>{c.text}</Tx>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Regional guide — the provinces & regions of Southeast Asia ───────────

interface Region {
  name: string
  image: string
  description: string
  specialty: string
}

/* Follows the requested { name, regions } shape, with an id + flag added so
   the selector can offer all eleven Southeast Asian nations. */
interface RegionCountry {
  id: string
  name: string
  flag: string
  regions: Region[]
}

const REGION_GUIDE: RegionCountry[] = [
  {
    id: 'vietnam', name: 'Vietnam', flag: '🇻🇳',
    regions: [
      { name: 'Hanoi', image: img('1629711627786-61c53394512f', 800, 600), description: 'The thousand-year capital, where lake-side pagodas meet the tangle of the Old Quarter\'s thirty-six trade streets.', specialty: '🏛️ Heritage — the Old Quarter & Hoan Kiem Lake' },
      { name: 'Ha Long Bay', image: img('1556383166-eded0173b7fd', 800, 600), description: 'Nearly two thousand limestone karsts rise from jade water, best seen from the deck of an overnight junk.', specialty: '🏞️ Heritage — a UNESCO seascape of karsts' },
      { name: 'Hue', image: img('1725335739643-9df3464395a2', 800, 600), description: 'The last imperial capital, its moated Citadel and royal tombs strung along the Perfume River.', specialty: '🏯 Heritage — the Nguyen dynasty Citadel' },
      { name: 'Hoi An', image: img('1725335738348-9d45f9ac5fb7', 800, 600), description: 'A perfectly preserved trading port that dims its lights each full moon and floats the river with silk lanterns.', specialty: '🏮 Festival — the monthly lantern nights' },
      { name: 'Ho Chi Minh City', image: img('1725335742692-4bf44d0f32c9', 800, 600), description: 'The roaring southern metropolis, its boulevards fuelled by pavement bánh mì carts and iced egg coffee.', specialty: '🍜 Food — bánh mì & street coffee' },
      { name: 'Sapa', image: img('1725335744133-12b438e6c3f9', 800, 600), description: 'Mist-wrapped highlands of stepped rice terraces farmed by Hmong and Dao hill communities.', specialty: '🌾 Heritage — terraced fields & hill tribes' },
      { name: 'Mekong Delta', image: img('1725335738156-9795bb914794', 800, 600), description: 'A watery lattice of rivers and orchards where trade still happens boat-to-boat at dawn.', specialty: '🛶 Food — the floating markets' },
    ],
  },
  {
    id: 'laos', name: 'Laos', flag: '🇱🇦',
    regions: [
      { name: 'Vientiane', image: img('1584493548897-41116bdb49a7', 800, 600), description: 'A sleepy riverside capital of French villas and the great gilded stupa of Pha That Luang.', specialty: '🏛️ Heritage — Pha That Luang' },
      { name: 'Luang Prabang', image: img('1733778567699-292f5e9354d6', 800, 600), description: 'A UNESCO town of glittering wats where saffron-robed monks collect alms in the blue dawn.', specialty: '🧡 Festival — the dawn alms-giving' },
      { name: 'Vang Vieng', image: img('1707817643213-35009bae9814', 800, 600), description: 'Karst peaks and blue lagoons rising over the Nam Song, laced with caves and hot-air balloons.', specialty: '🏞️ Heritage — karst lagoons' },
      { name: 'Si Phan Don', image: img('1606064195579-a48c728cec35', 800, 600), description: 'The "Four Thousand Islands," where the Mekong braids apart and rare freshwater dolphins surface.', specialty: '🐬 Heritage — Mekong river islands' },
      { name: 'Xieng Khouang', image: img('1526203042074-45587ed26c02', 800, 600), description: 'A high plateau scattered with the mysterious Iron-Age stone urns of the Plain of Jars.', specialty: '🏺 Heritage — the Plain of Jars' },
      { name: 'Bolaven Plateau', image: img('1552058184-1b8793a09435', 800, 600), description: 'Cool volcanic highlands of coffee estates and thundering multi-tier waterfalls.', specialty: '☕ Food — highland coffee & waterfalls' },
    ],
  },
  {
    id: 'cambodia', name: 'Cambodia', flag: '🇰🇭',
    regions: [
      { name: 'Siem Reap', image: img('1594903717106-6f02e8db45f3', 800, 600), description: 'Gateway to Angkor, the vast temple-city of the Khmer empire and the largest religious monument on earth.', specialty: '🛕 Heritage — Angkor Wat at sunrise' },
      { name: 'Phnom Penh', image: img('1675564813497-75cf769cb74b', 800, 600), description: 'The riverside capital of the golden Royal Palace, sobering memorials, and a fast-rising skyline.', specialty: '🏛️ Heritage — the Royal Palace' },
      { name: 'Angkor Thom', image: img('1673801014066-833635cfbab8', 800, 600), description: 'The walled last capital of Angkor, crowned by the Bayon and its 200 serenely smiling stone faces.', specialty: '😌 Heritage — the smiling faces of Bayon' },
      { name: 'Battambang', image: img('1594903717094-a83c33d2c49d', 800, 600), description: 'A mellow colonial-era town famous for its improvised bamboo railway and rural art scene.', specialty: '🎋 Heritage — the bamboo railway' },
      { name: 'Kampot', image: img('1594903717283-2b96af6d65f3', 800, 600), description: 'A riverside town beneath Bokor mountain, giving its name to the world\'s most prized pepper.', specialty: '🌶️ Food — Kampot pepper' },
      { name: 'Kep', image: img('1673801019436-001aa46fce2f', 800, 600), description: 'A faded seaside resort of crumbling villas, best known for its buzzing crab market.', specialty: '🦀 Food — the crab market' },
    ],
  },
  {
    id: 'thailand', name: 'Thailand', flag: '🇹🇭',
    regions: [
      { name: 'Bangkok', image: img('1663074958903-879f50268f6a', 800, 600), description: 'A dizzying capital of gilded temples, canal markets, and some of the best street food on the planet.', specialty: '🍜 Food — street food & the Grand Palace' },
      { name: 'Chiang Mai', image: img('1780776145695-634f694ec0b3', 800, 600), description: 'The rose of the north, ringed by mountain temples and lit each November by thousands of sky lanterns.', specialty: '🏮 Festival — Yi Peng lanterns' },
      { name: 'Ayutthaya', image: img('1671597728617-32d19c352c4d', 800, 600), description: 'The ruined former royal capital, its brick prangs and headless Buddhas set on a river island.', specialty: '🏯 Heritage — the ruined royal capital' },
      { name: 'Phuket', image: img('1593406546667-cc6e00f320d2', 800, 600), description: 'The largest island, fringed with Andaman beaches and anchored by a Sino-Portuguese old town.', specialty: '🏝️ Heritage — Andaman beaches' },
      { name: 'Krabi', image: img('1688052200242-71fb260bd5a4', 800, 600), description: 'Sheer limestone cliffs and hidden lagoons around Railay and the Phi Phi islands.', specialty: '🚤 Heritage — the limestone coast' },
      { name: 'Sukhothai', image: img('1750635410070-62b74dfb7a19', 800, 600), description: 'The first Thai kingdom, its lotus-bud stupas and walking Buddhas set in a tranquil historical park.', specialty: '🛕 Heritage — the dawn of Siam' },
    ],
  },
  {
    id: 'myanmar', name: 'Myanmar', flag: '🇲🇲',
    regions: [
      { name: 'Yangon', image: img('1571633386230-cfb41acc5a03', 800, 600), description: 'The former capital, dominated by the towering golden dome of the Shwedagon Pagoda.', specialty: '🛕 Heritage — the Shwedagon Pagoda' },
      { name: 'Bagan', image: img('1545925445-951b44952541', 800, 600), description: 'A plain scattered with over two thousand temples and stupas, unforgettable from a dawn balloon.', specialty: '🎈 Heritage — 2,000 temples at dawn' },
      { name: 'Mandalay', image: img('1670531834569-c94cd848f399', 800, 600), description: 'The last royal capital and cultural heart, ringed by former courts at Amarapura and Sagaing.', specialty: '🏛️ Heritage — the last royal capital' },
      { name: 'Inle Lake', image: img('1579992638039-abad364f5017', 800, 600), description: 'A vast highland lake of stilt villages, floating gardens, and one-legged rowing fishermen.', specialty: '🛶 Heritage — the leg-rowing fishermen' },
      { name: 'Ngapali', image: img('1630973720386-5a05903a0564', 800, 600), description: 'Quiet palm-backed beaches along the Bay of Bengal, still worked by traditional fishing fleets.', specialty: '🏖️ Heritage — Bay of Bengal beaches' },
      { name: 'Mrauk U', image: img('1719774105382-029791a150d3', 800, 600), description: 'A remote former Rakhine capital of fortress-like temples half-lost in the hills and morning mist.', specialty: '🏯 Heritage — the hidden temple city' },
    ],
  },
  {
    id: 'malaysia', name: 'Malaysia', flag: '🇲🇾',
    regions: [
      { name: 'Kuala Lumpur', image: img('1508062878650-88b52897f298', 800, 600), description: 'A fast, multicultural capital where the Petronas Towers rise above night markets and colonial cores.', specialty: '🏙️ Heritage — the Petronas Towers' },
      { name: 'Penang', image: img('1585031039436-16a906da2f05', 800, 600), description: 'The island state of George Town, a UNESCO shophouse city widely called the region\'s food capital.', specialty: '🍜 Food — George Town hawker fare' },
      { name: 'Malacca', image: img('1577931683033-1059552104e0', 800, 600), description: 'A historic strait port layered with Portuguese, Dutch, and Peranakan heritage along a painted river.', specialty: '🏛️ Heritage — the Peranakan port' },
      { name: 'Sabah', image: img('1767428254084-6e81d14766d3', 800, 600), description: 'Borneo\'s north, crowned by Mount Kinabalu and edged by the coral reefs of Sipadan.', specialty: '🏔️ Heritage — Mount Kinabalu & reefs' },
      { name: 'Sarawak', image: img('1764260664542-61117a514ba3', 800, 600), description: 'The largest state, of longhouse cultures, vast cave systems, and rainforest orangutans.', specialty: '🦧 Heritage — rainforest & orangutans' },
      { name: 'Langkawi', image: img('1586768798120-95597acaa6e3', 800, 600), description: 'A duty-free archipelago of legends, mangrove geoparks, and a rainforest cable car.', specialty: '🏝️ Heritage — the island of legends' },
    ],
  },
  {
    id: 'singapore', name: 'Singapore', flag: '🇸🇬',
    regions: [
      { name: 'Marina Bay', image: img('1569288063643-5d29ad64df09', 800, 600), description: 'The waterfront showpiece, defined by the triple towers of Marina Bay Sands and a nightly light show.', specialty: '🏙️ Heritage — the Marina Bay skyline' },
      { name: 'Gardens by the Bay', image: img('1516496636080-14fb876e029d', 800, 600), description: 'A futuristic park of towering solar Supertrees and cooled glass biomes.', specialty: '🌳 Heritage — the Supertree grove' },
      { name: 'Chinatown', image: img('1508964942454-1a56651d54ac', 800, 600), description: 'Restored shophouses, a Buddha-tooth temple, and one of the world\'s finest hawker centres.', specialty: '🍜 Food — hawker heritage' },
      { name: 'Sentosa', image: img('1496939376851-89342e90adcd', 800, 600), description: 'A resort island of beaches, theme parks, and cable cars just off the southern shore.', specialty: '🏝️ Heritage — the resort island' },
      { name: 'Botanic Gardens', image: img('1605425183435-25b7e99104a4', 800, 600), description: 'A 160-year-old tropical garden and UNESCO site, home to the National Orchid collection.', specialty: '🌺 Heritage — a UNESCO tropical garden' },
      { name: 'Kampong Glam', image: img('1546258608-68797ef96fc8', 800, 600), description: 'The Malay-Arab quarter around the golden Sultan Mosque, now lined with cafes and street art.', specialty: '🕌 Heritage — the Malay-Arab quarter' },
    ],
  },
  {
    id: 'indonesia', name: 'Indonesia', flag: '🇮🇩',
    regions: [
      { name: 'Bali', image: img('1544644181-1484b3fdfc62', 800, 600), description: 'The Island of the Gods, of lake temples and rice terraces, hushed each year for the silence of Nyepi.', specialty: '🛕 Festival — temple island & Nyepi' },
      { name: 'Yogyakarta', image: img('1620549146396-9024d914cd99', 800, 600), description: 'Java\'s cultural soul, a sultan\'s city between the colossal temples of Borobudur and Prambanan.', specialty: '🛕 Heritage — Borobudur & Prambanan' },
      { name: 'Jakarta', image: img('1524675053444-52c3ca294ad2', 800, 600), description: 'The vast, restless capital, blending Old Batavia\'s Dutch quarter with a soaring modern skyline.', specialty: '🏙️ Heritage — the sprawling capital' },
      { name: 'Lombok', image: img('1604842937136-1648761a6256', 800, 600), description: 'Bali\'s quieter neighbour, of empty surf beaches beneath the volcano of Mount Rinjani.', specialty: '🏝️ Heritage — beaches & Mount Rinjani' },
      { name: 'Komodo', image: img('1778382310884-32ad9c1c8f2a', 800, 600), description: 'A national park of pink-sand beaches and dry islands roamed by the world\'s largest lizard.', specialty: '🦎 Heritage — the Komodo dragons' },
      { name: 'Ubud', image: img('1501179691627-eeaa65ea017c', 800, 600), description: 'Bali\'s highland arts town, wrapped in emerald rice terraces and craft villages.', specialty: '🌾 Heritage — rice terraces & the arts' },
    ],
  },
  {
    id: 'philippines', name: 'Philippines', flag: '🇵🇭',
    regions: [
      { name: 'Manila', image: img('1542213448375-a03409f44bfb', 800, 600), description: 'A dense, historic capital centred on the walled Spanish core of Intramuros.', specialty: '🏛️ Heritage — Intramuros walled city' },
      { name: 'Palawan', image: img('1710104433002-cc60d88d78f4', 800, 600), description: 'A long wild island of hidden lagoons at El Nido and an underground river at Puerto Princesa.', specialty: '🛶 Heritage — the El Nido lagoons' },
      { name: 'Cebu', image: img('1462557804967-1b4876a07c17', 800, 600), description: 'The country\'s oldest city and a springboard to reefs, waterfalls, and whale-shark waters.', specialty: '🐋 Heritage — beaches & whale sharks' },
      { name: 'Bohol', image: img('1590133076213-ef3cc4b1a70b', 800, 600), description: 'Home to the geological Chocolate Hills and the saucer-eyed, palm-sized tarsier.', specialty: '🍫 Heritage — the Chocolate Hills' },
      { name: 'Boracay', image: img('1586768798120-95597acaa6e3', 800, 600), description: 'A small island world-famous for the powder-white sand of its four-kilometre White Beach.', specialty: '🏝️ Heritage — White Beach' },
      { name: 'Banaue', image: img('1782061036161-16a4b6bc0b57', 800, 600), description: 'Two-thousand-year-old rice terraces carved into the Ifugao mountains, an "eighth wonder."', specialty: '🌾 Heritage — the Ifugao rice terraces' },
    ],
  },
  {
    id: 'brunei', name: 'Brunei', flag: '🇧🇳',
    regions: [
      { name: 'Bandar Seri Begawan', image: img('1709808971463-270bae12b837', 800, 600), description: 'The compact capital, mirrored in a lagoon beneath the golden Omar Ali Saifuddien Mosque.', specialty: '🕌 Heritage — the Sultan\'s mosque' },
      { name: 'Kampong Ayer', image: img('1705583855040-3c25b4a9eab9', 800, 600), description: 'A 600-year-old "water village" of stilted homes, walkways, and mosques over the river.', specialty: '🛶 Heritage — the water village' },
      { name: 'Temburong', image: img('1758298135102-8d3617b32880', 800, 600), description: 'A pristine rainforest district reached by speedboat, capped by a national-park canopy walk.', specialty: '🌿 Heritage — the rainforest canopy' },
      { name: 'Jerudong', image: img('1777858345002-f976ea33340f', 800, 600), description: 'A lavish royal district of gardens, a grand mosque, and a once world-famous amusement park.', specialty: '🎡 Heritage — royal parkland' },
      { name: 'Tutong', image: img('1705584249247-4264b0536265', 800, 600), description: 'A rural coastal district cradling the tea-coloured, biodiverse lake of Tasek Merimbun.', specialty: '🏞️ Heritage — Tasek Merimbun lake' },
    ],
  },
  {
    id: 'timor', name: 'East Timor', flag: '🇹🇱',
    regions: [
      { name: 'Dili', image: img('1774681972371-d87f13a3996c', 800, 600), description: 'The seafront capital of the region\'s youngest nation, watched over by the towering Cristo Rei statue.', specialty: '🏛️ Heritage — the seafront capital' },
      { name: 'Atauro Island', image: img('1778382310884-32ad9c1c8f2a', 800, 600), description: 'A rugged island fringed by reefs found to hold the highest average fish diversity on earth.', specialty: '🐠 Heritage — the world\'s richest reefs' },
      { name: 'Baucau', image: img('1764260664542-61117a514ba3', 800, 600), description: 'The second city, an old Portuguese hill town of terracotta roofs above a spring-fed coast.', specialty: '🏛️ Heritage — the Portuguese old town' },
      { name: 'Maubisse', image: img('1767428254084-6e81d14766d3', 800, 600), description: 'A cool mountain town among the coffee plantations that give Timor its celebrated single-origin beans.', specialty: '☕ Food — mountain coffee country' },
      { name: 'Oecusse', image: img('1758298135102-8d3617b32880', 800, 600), description: 'A quiet coastal enclave separated from the rest of the country, the site of the first Portuguese landing.', specialty: '🌾 Heritage — the historic enclave' },
    ],
  },
  {
    id: 'japan', name: 'Japan', flag: '🇯🇵',
    regions: [
      { name: 'Tokyo', image: img('1748878665650-93b8a8908d38', 800, 600), description: 'The electric capital, where neon districts and centuries-old shrines sit within a single train ride of each other.', specialty: '🏙️ Heritage — neon city & old shrines' },
      { name: 'Kyoto', image: img('1574236170880-fbbca132d83d', 800, 600), description: 'The old imperial capital of some two thousand temples and shrines, geisha lanes, and raked stone gardens.', specialty: '⛩️ Heritage — temples & geisha districts' },
      { name: 'Mount Fuji', image: img('1599173705513-0880f530cd3d', 800, 600), description: 'The nation\'s sacred, snow-capped symbol, mirrored in the five lakes and hot-spring towns of Hakone.', specialty: '🗻 Heritage — the sacred peak & onsen' },
      { name: 'Osaka', image: img('1756211572227-0eb27735759a', 800, 600), description: 'The nation\'s boisterous kitchen, famous for takoyaki, okonomiyaki, and the neon canals of Dotonbori.', specialty: '🍢 Food — the kitchen of Japan' },
      { name: 'Nara', image: img('1574236170890-b7c8f6555734', 800, 600), description: 'The first permanent capital, where free-roaming deer bow for crackers beneath the Great Buddha of Todai-ji.', specialty: '🦌 Heritage — the deer park & Todai-ji' },
      { name: 'Hokkaido', image: img('1738878165091-86c056eb238d', 800, 600), description: 'The wild northern island of powder-snow ski fields, summer flower farms, and volcanic hot springs.', specialty: '❄️ Heritage — powder snow & hot springs' },
    ],
  },
  {
    id: 'china', name: 'China', flag: '🇨🇳',
    regions: [
      { name: 'Beijing', image: img('1603120527222-33f28c2ce89e', 800, 600), description: 'The imperial capital of the vast Forbidden City, Tiananmen Square, and the Temple of Heaven.', specialty: '🏯 Heritage — the Forbidden City' },
      { name: 'The Great Wall', image: img('1514920735211-8c697444a248', 800, 600), description: 'Thousands of kilometres of rampart snaking along the northern ridgelines, best walked at Mutianyu.', specialty: '🧱 Heritage — the Great Wall' },
      { name: 'Shanghai', image: img('1538428494232-9c0d8a3ab403', 800, 600), description: 'The dazzling financial metropolis, where the colonial Bund faces the futuristic towers of Pudong.', specialty: '🏙️ Heritage — the Bund & Pudong' },
      { name: "Xi'an", image: img('1527922891260-918d42a4efc8', 800, 600), description: 'The eastern end of the Silk Road, guarded for two millennia by the buried Terracotta Army.', specialty: '🗿 Heritage — the Terracotta Army' },
      { name: 'Guilin', image: img('1600623305065-140c9031f631', 800, 600), description: 'A dreamscape of karst peaks and the Li River, the scene painted on the back of the 20-yuan note.', specialty: '🏞️ Heritage — the Li River karsts' },
      { name: 'Chengdu', image: img('1551650045-fc958c7b0452', 800, 600), description: 'The laid-back Sichuan capital, home of fiery hotpot and the mist-wrapped giant panda reserves.', specialty: '🐼 Food — pandas & Sichuan hotpot' },
    ],
  },
]

function RegionDetail({ region, country, onClose }: { region: Region; country: RegionCountry; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="film-rise relative w-full max-w-2xl overflow-hidden rounded-lg bg-[var(--color-card)] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <img src={region.image} alt={region.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/80"
          >
            ✕
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="mb-1 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-white/75">
              <span className="text-base leading-none">{country.flag}</span>{country.name}
            </div>
            <h3 className="font-carve text-4xl text-white drop-shadow"><Tx>{region.name}</Tx></h3>
          </div>
        </div>
        <div className="p-6">
          <span className="inline-block rounded-full border border-[var(--color-border)] bg-[var(--color-muted)] px-3 py-1 font-mono text-xs tracking-wide text-[var(--color-foreground)]">
            <Tx>{region.specialty}</Tx>
          </span>
          <p className="mt-4 font-thin-body text-lg leading-relaxed text-[var(--color-foreground)]"><Tx>{region.description}</Tx></p>
        </div>
      </div>
    </div>
  )
}

function RegionExplorer({ currentCountryId }: { currentCountryId: string }) {
  const t = useT()
  const initial = Math.max(0, REGION_GUIDE.findIndex((c) => c.id === currentCountryId))
  const [ci, setCi] = useState(initial)
  const [open, setOpen] = useState<Region | null>(null)

  // Default to the country the traveler is currently in whenever it changes.
  useEffect(() => {
    const idx = REGION_GUIDE.findIndex((c) => c.id === currentCountryId)
    if (idx >= 0) {
      setCi(idx)
      setOpen(null)
    }
  }, [currentCountryId])

  const country = REGION_GUIDE[ci]

  return (
    <section className="mb-16">
      <div className="mb-6">
        <div className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--color-primary)]">{t('regionEyebrow')}</div>
        <h2 className="mt-2 font-carve text-4xl">
          <span className="script-rule">{t('regionTitle')}</span>
        </h2>
        <p className="mt-4 max-w-2xl font-thin-body text-lg leading-relaxed text-[var(--color-muted-foreground)]">
          {t('regionLead')}
        </p>
      </div>

      {/* Country selector */}
      <div role="tablist" aria-label="Southeast Asian countries" className="mb-8 flex flex-wrap gap-2">
        {REGION_GUIDE.map((c, i) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={i === ci}
            onClick={() => { setCi(i); setOpen(null) }}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-sm transition-colors ${
              i === ci
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)]'
                : 'border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-muted-foreground)] hover:border-[var(--color-primary)] hover:text-[var(--color-foreground)]'
            }`}
          >
            <span className="text-base leading-none">{c.flag}</span>
            {c.name}
          </button>
        ))}
      </div>

      {/* Region grid — re-keyed so the cards re-animate on each country */}
      <div key={country.id} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {country.regions.map((r, i) => (
          <button
            key={r.name}
            type="button"
            onClick={() => setOpen(r)}
            style={{ animationDelay: `${i * 70}ms` }}
            className="region-pop group flex flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={r.image}
                alt={r.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              <h3 className="absolute bottom-3 left-4 font-carve text-2xl text-white drop-shadow"><Tx>{r.name}</Tx></h3>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <span className="mb-2 self-start rounded-full border border-[var(--color-border)] bg-[var(--color-muted)] px-2.5 py-1 font-mono text-[11px] tracking-wide text-[var(--color-foreground)]">
                <Tx>{r.specialty}</Tx>
              </span>
              <p className="font-thin-body text-sm leading-relaxed text-[var(--color-muted-foreground)]"><Tx>{r.description}</Tx></p>
            </div>
          </button>
        ))}
      </div>

      {open && <RegionDetail region={open} country={country} onClose={() => setOpen(null)} />}
    </section>
  )
}

// ─── Regional Festival Calendar — a horizontal 12-month timeline ───────────

interface Festival {
  name: string
  country: string
  month: number // 1–12
  dateNote: string
  description: string
  image: string
  themeColor: string
}

const FESTIVALS: Festival[] = [
  { name: 'Thaipusam', country: 'Malaysia · Singapore', month: 1, dateNote: 'Full moon of Tamil Thai (Jan–Feb)', description: 'Hindu devotees carry ornate kavadi in a vast procession to Batu Caves, some pierced in acts of penance and thanksgiving.', image: img('1675556894220-2fde869f9e90'), themeColor: '#f2b705' },
  { name: 'Tết Nguyên Đán', country: 'Vietnam', month: 2, dateNote: '1st day of the lunar new year', description: 'The lunar new year turns streets red and gold with kumquat trees and peach blossom, as families reunite and settle the old year\'s debts.', image: img('1673838675026-967e5118fc09'), themeColor: '#c0392b' },
  { name: 'Chinese New Year', country: 'Singapore · Malaysia', month: 2, dateNote: 'Lunar new year (Jan–Feb)', description: 'Lion dances, reunion dinners, and lantern-lit streets fill the Chinatowns of the region for fifteen days of celebration.', image: img('1600582201908-183d607504c3'), themeColor: '#d4341f' },
  { name: 'Nyepi', country: 'Indonesia (Bali)', month: 3, dateNote: 'Balinese Saka new year (March)', description: 'After a night of monstrous ogoh-ogoh parades, the whole island falls silent for a day — no lights, no travel, even the airport closes.', image: img('1755077005329-13ce030aa794'), themeColor: '#2a2140' },
  { name: 'Songkran', country: 'Thailand', month: 4, dateNote: '13–15 April (solar)', description: 'The Thai new year became the world\'s largest water fight — a silvery, city-wide dousing to wash away the old year.', image: img('1578167635648-df79e1565908'), themeColor: '#7fc4d6' },
  { name: 'Pi Mai Lao', country: 'Laos', month: 4, dateNote: '14–16 April', description: 'Luang Prabang cleanses its Buddha images with scented water and builds sand stupas along the Mekong for the Lao new year.', image: img('1733778567699-292f5e9354d6'), themeColor: '#6fbfae' },
  { name: 'Chaul Chnam Thmey', country: 'Cambodia', month: 4, dateNote: '13–15 April', description: 'The Khmer new year fills temple courtyards with games, offerings, and playful powder-and-water blessings.', image: img('1594903717106-6f02e8db45f3'), themeColor: '#e8a13a' },
  { name: 'Thingyan', country: 'Myanmar', month: 4, dateNote: 'Mid-April (4–5 days)', description: 'Burmese new year is marked by open-air water pavilions and street-side dousing to rinse away the sins of the past year.', image: img('1571633386230-cfb41acc5a03'), themeColor: '#4bb3c4' },
  { name: 'Vesak', country: 'Across the region', month: 5, dateNote: 'Full moon of May', description: 'The holiest Buddhist day marks the Buddha\'s birth, enlightenment, and passing, with candlelit processions circling the stupas.', image: img('1633368516160-feaa83f981dd'), themeColor: '#e8c07a' },
  { name: 'Gawai Dayak', country: 'Malaysia (Sarawak)', month: 6, dateNote: '1–2 June (solar)', description: 'Borneo\'s Dayak communities celebrate the rice harvest with rice wine, longhouse feasts, and all-night dancing.', image: img('1764260664542-61117a514ba3'), themeColor: '#3fa46a' },
  { name: 'Khao Phansa', country: 'Thailand', month: 7, dateNote: 'Full moon of the 8th lunar month', description: 'The start of Buddhist Lent, when monks retreat for the rains and towns like Ubon parade giant carved beeswax candles.', image: img('1750635410070-62b74dfb7a19'), themeColor: '#d98a2b' },
  { name: 'Hungry Ghost Festival', country: 'Singapore · Malaysia', month: 8, dateNote: '7th lunar month (Aug)', description: 'The gates of the underworld open and roaming spirits are appeased with roadside offerings, incense, and open-air "getai" shows.', image: img('1780776145695-634f694ec0b3'), themeColor: '#6b3fa0' },
  { name: 'Tết Trung Thu', country: 'Vietnam', month: 9, dateNote: '15th day, 8th lunar month', description: 'The mid-autumn moon festival for children, with lion dances, star-shaped lanterns, and boxes of rich mooncakes.', image: img('1725335738348-9d45f9ac5fb7'), themeColor: '#f0a830' },
  { name: 'Pchum Ben', country: 'Cambodia', month: 9, dateNote: '15 days, ending on the new moon', description: 'Cambodians honour their ancestors across fifteen days, bringing rice offerings to the monks at pagodas before dawn.', image: img('1673801014066-833635cfbab8'), themeColor: '#9a7b4f' },
  { name: 'Thadingyut', country: 'Myanmar', month: 10, dateNote: 'Full moon of Thadingyut (Oct)', description: 'The festival of lights welcomes the Buddha\'s descent from heaven; homes, streets, and pagodas glow with candles and lanterns.', image: img('1630973720386-5a05903a0564'), themeColor: '#ffb45e' },
  { name: 'Bon Om Touk', country: 'Cambodia', month: 11, dateNote: 'Full moon of November', description: 'The water festival celebrates the reversing flow of the Tonlé Sap with three days of thunderous longboat racing at Phnom Penh.', image: img('1561862755-10ad7b1e9b0c'), themeColor: '#3d7fc0' },
  { name: 'Loy Krathong & Yi Peng', country: 'Thailand', month: 11, dateNote: 'Full moon of the 12th lunar month', description: 'Candle-and-flower floats are set adrift to carry off misfortune, while the northern sky fills with rising paper lanterns.', image: img('1510673398445-94f476ef2cbc'), themeColor: '#ffb877' },
  { name: 'Simbang Gabi', country: 'Philippines', month: 12, dateNote: '16–25 December', description: 'The country with the world\'s longest Christmas keeps nine dawn masses, its streets glowing with star-shaped "parol" lanterns.', image: img('1669991504530-f0ad847fe34c'), themeColor: '#e04b3a' },
]

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function FestivalCalendar() {
  const t = useT()
  const lang = useContext(LangContext)
  const scroller = useRef<HTMLDivElement>(null)
  const [activeMonth, setActiveMonth] = useState(4)

  const festsFor = (m: number) => FESTIVALS.filter((f) => f.month === m)

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const onScroll = () => {
      const center = el.scrollLeft + el.clientWidth / 2
      let best = 1
      let bestDist = Infinity
      el.querySelectorAll<HTMLElement>('[data-month]').forEach((c: HTMLElement) => {
        const cCenter = c.offsetLeft + c.offsetWidth / 2
        const d = Math.abs(cCenter - center)
        if (d < bestDist) {
          bestDist = d
          best = Number(c.dataset.month)
        }
      })
      setActiveMonth(best)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const goToMonth = (m: number) => {
    const el = scroller.current
    if (!el) return
    const clamped = Math.min(12, Math.max(1, m))
    const target = el.querySelector<HTMLElement>(`[data-month="${clamped}"]`)
    if (!target) return
    // Scroll the timeline container itself (never the page) so clicking the
    // arrows moves the months sideways without nudging the window up or down.
    const left = target.offsetLeft - (el.clientWidth - target.clientWidth) / 2
    el.scrollTo({ left, behavior: 'smooth' })
  }

  // The month's first festival sets the atmosphere.
  const activeFest = festsFor(activeMonth)[0]
  const theme = activeFest?.themeColor ?? '#8a7d6b'

  return (
    <section
      className="relative mb-16 overflow-hidden rounded-lg border transition-colors duration-700"
      style={{ background: theme, borderColor: theme }}
    >
      {/* Atmosphere backdrop — a representative image per month, crossfading */}
      <div className="pointer-events-none absolute inset-0">
        {MONTH_NAMES.map((_, i) => {
          const rep = festsFor(i + 1)[0]
          if (!rep) return null
          return (
            <img
              key={rep.name}
              src={rep.image}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
                activeMonth === i + 1 ? 'opacity-25' : 'opacity-0'
              }`}
            />
          )
        })}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/70 to-black/88 transition-colors duration-700" />
      </div>

      <div className="relative p-6 sm:p-8">
        {/* Heading + active-month marker */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.35em] transition-colors duration-500" style={{ color: theme }}>
              {t('festivalEyebrow')}
            </div>
            <h2 className="mt-2 font-carve text-4xl text-white sm:text-5xl">
              <span className="script-rule">{t('festivalTitle')}</span>
            </h2>
          </div>
          <div className="text-right">
            <div className="font-carve text-5xl leading-none text-white transition-all duration-500">{monthLabel(lang, activeMonth)}</div>
            <div className="mt-1 font-mono text-xs uppercase tracking-widest text-white/60">{t('travelYear')}</div>
          </div>
        </div>

        {/* Horizontal 12-month timeline with edge arrow controls */}
        <div className="relative">
          <button
            type="button"
            onClick={() => goToMonth(activeMonth - 1)}
            disabled={activeMonth <= 1}
            aria-label="Previous month"
            className="absolute left-0 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60 disabled:pointer-events-none disabled:opacity-0"
          >
            <span className="text-xl leading-none">‹</span>
          </button>
          <button
            type="button"
            onClick={() => goToMonth(activeMonth + 1)}
            disabled={activeMonth >= 12}
            aria-label="Next month"
            className="absolute right-0 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60 disabled:pointer-events-none disabled:opacity-0"
          >
            <span className="text-xl leading-none">›</span>
          </button>

          <div
            ref={scroller}
            className="hide-scrollbar relative flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-4"
          >
          {MONTH_NAMES.map((name, i) => {
            const month = i + 1
            const fests = festsFor(month)
            const isActive = activeMonth === month
            return (
              <div
                key={name}
                data-month={month}
                className="flex w-[85vw] flex-shrink-0 snap-center flex-col sm:w-[340px]"
              >
                {/* Month header on the timeline rail */}
                <div className="mb-3 flex items-center gap-3">
                  <span
                    className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full font-mono text-xs font-500 transition-colors duration-300"
                    style={{
                      background: isActive ? theme : 'rgba(255,255,255,0.12)',
                      color: isActive ? '#1a1612' : 'rgba(255,255,255,0.75)',
                    }}
                  >
                    {String(month).padStart(2, '0')}
                  </span>
                  <div className={`font-carve text-xl transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/55'}`}>
                    {monthLabel(lang, month)}
                  </div>
                  <div className="h-px flex-1 bg-white/15" />
                </div>

                {/* Festival tags for this month */}
                <div className="flex flex-col gap-3">
                  {fests.map((f) => (
                    <article
                      key={f.name}
                      className="rounded-lg border bg-white/5 p-4 backdrop-blur-sm transition-colors"
                      style={{ borderColor: f.themeColor + '66' }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: f.themeColor }} />
                        <div>
                          <h3 className="font-carve text-lg leading-tight text-white"><Tx>{f.name}</Tx></h3>
                          <div className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-white/60">{f.country}</div>
                          <div className="mt-1 font-mono text-[11px] tracking-wide" style={{ color: f.themeColor }}><Tx>{f.dateNote}</Tx></div>
                          <p className="mt-2 font-thin-body text-sm leading-relaxed text-white/80"><Tx>{f.description}</Tx></p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )
          })}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Cultural empty state — sand falling in a bamboo clock ─────────────────

function SandClock({ label = 'Charting this leg of the journey…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-16 text-center">
      <svg width="72" height="96" viewBox="0 0 72 96" className="overflow-visible" style={{ animation: 'gentle-sway 4s ease-in-out infinite' }}>
        {/* Bamboo frame */}
        <rect x="6" y="4" width="60" height="6" rx="3" fill="#8a5a2a" />
        <rect x="6" y="86" width="60" height="6" rx="3" fill="#8a5a2a" />
        <rect x="10" y="8" width="5" height="80" rx="2.5" fill="#a9762f" />
        <rect x="57" y="8" width="5" height="80" rx="2.5" fill="#a9762f" />
        {/* Glass bulbs */}
        <path d="M18 12 H54 L40 46 V50 L54 84 H18 L32 50 V46 Z" fill="rgba(255,255,255,0.08)" stroke="#c9963f" strokeWidth="1.5" />
        {/* Top sand */}
        <path d="M22 14 H50 L38 44 H34 Z" fill="#e8c07a" opacity="0.85" />
        {/* Falling grain */}
        <line className="sand-stream" x1="36" y1="46" x2="36" y2="52" stroke="#e8c07a" strokeWidth="2" strokeLinecap="round" />
        {/* Bottom pile */}
        <path d="M26 82 H46 L36 66 Z" fill="#e8c07a" style={{ animation: 'sand-pile 3s ease-out infinite alternate', transformOrigin: '36px 82px' }} />
      </svg>
      <div className="font-script text-2xl text-[var(--color-primary)]">{label}</div>
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted-foreground)]">Please wait a moment</div>
    </div>
  )
}

function BudgetBar({ country }: { country: Country }) {
  const t = useT()
  const allActivities = (country.itinerary ?? []).flatMap((d) => d.activities)
  const total = allActivities.reduce((sum, a) => sum + a.cost, 0)

  const byCategory = (Object.keys(CATEGORY_LABELS) as Activity['category'][]).map((cat) => {
    const sum = allActivities.filter((a) => a.category === cat).reduce((s, a) => s + a.cost, 0)
    return { cat, sum, pct: total > 0 ? (sum / total) * 100 : 0 }
  })

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-6 mb-8">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-display text-2xl font-600 tracking-tight">{t('budgetSummary')}</h2>
        <div className="text-right">
          <div className="font-mono text-3xl font-500 text-[var(--color-primary)]">{formatMoney(total, country)}</div>
          <div className="font-mono text-sm text-[var(--color-muted-foreground)]">≈ ${toUsd(total, country).toLocaleString('en-US')} USD</div>
        </div>
      </div>

      {/* Stacked bar with smooth segment animation */}
      <div className="h-3 flex rounded-none overflow-hidden mb-5 bg-[var(--color-muted)]">
        {byCategory.filter((b) => b.sum > 0).map(({ cat, pct }) => (
          <div
            key={cat}
            style={{ width: `${pct}%`, backgroundColor: CATEGORY_COLORS[cat] }}
            className="transition-all duration-700 ease-out h-full"
            title={`${t('cat_' + cat)}: ${Math.round(pct)}%`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {byCategory.map(({ cat, sum }) => (
          <div key={cat} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 flex-shrink-0 rounded-sm"
              style={{ backgroundColor: CATEGORY_COLORS[cat] }}
            />
            <div>
              <div className="font-body text-xs text-[var(--color-muted-foreground)]">{t('cat_' + cat)}</div>
              <div className="font-mono text-sm font-500">{formatMoney(sum, country)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DayCard({ day, country, isActive, onClick }: { day: Day; country: Country; isActive: boolean; onClick: () => void }) {
  const lang = useContext(LangContext)
  const dayTotal = day.activities.reduce((s, a) => s + a.cost, 0)

  return (
    <button
      onClick={onClick}
      className={`w-full text-left border transition-all duration-200 overflow-hidden ${
        isActive
          ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)]'
          : 'border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-primary)] hover:bg-[var(--color-muted)]'
      }`}
    >
      <div className="p-2.5 flex items-center gap-3">
        {day.coverImage && (
          <img
            src={day.coverImage}
            alt=""
            className="w-11 h-11 rounded object-cover flex-shrink-0 border border-black/10 shadow-sm"
            loading="lazy"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className={`font-mono text-[11px] mb-0.5 ${isActive ? 'opacity-70' : 'text-[var(--color-muted-foreground)]'}`}>
            {dayLabel(lang, day.day)} · {day.date}
          </div>
          <div className={`font-display text-sm font-600 leading-tight truncate ${isActive ? '' : 'text-[var(--color-foreground)]'}`}>
            <Tx>{day.city.split(' — ')[0]}</Tx>
          </div>
          <div className={`font-mono text-xs mt-0.5 ${isActive ? 'opacity-80' : 'text-[var(--color-muted-foreground)]'}`}>
            {formatMoney(dayTotal, country)}
          </div>
        </div>
      </div>
    </button>
  )
}

function ActivityRow({ activity, country, isLast }: { activity: Activity; country: Country; isLast?: boolean }) {
  const t = useT()
  const color = CATEGORY_COLORS[activity.category]
  return (
    <div className="flex">
      {/* Time column */}
      <div className="w-12 flex-shrink-0 pt-0.5">
        <span className="font-mono text-[11px] tabular-nums leading-none text-[var(--color-muted-foreground)]">
          {activity.time}
        </span>
      </div>

      {/* Timeline spine */}
      <div className="flex flex-col items-center w-5 mr-3.5 flex-shrink-0">
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-[3px]"
          style={{ backgroundColor: color, boxShadow: `0 0 0 3px ${color}28` }}
        />
        {!isLast && (
          <div className="w-px flex-1 mt-1.5 bg-[var(--color-border)]" style={{ minHeight: '1.5rem' }} />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 min-w-0 ${isLast ? 'pb-1' : 'pb-5'}`}>
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span
              className="font-mono text-[9px] px-1.5 py-[3px] rounded font-600 tracking-widest uppercase flex-shrink-0"
              style={{ backgroundColor: color + '1a', color }}
            >
              {t('cat_' + activity.category)}
            </span>
            <h3 className="font-display text-[15px] font-600 leading-tight"><Tx>{activity.title}</Tx></h3>
          </div>
          <div className="flex-shrink-0 pl-1 text-right">
            {activity.cost > 0 ? (
              <span className="font-mono text-sm font-600" style={{ color }}>
                {formatMoney(activity.cost, country)}
              </span>
            ) : (
              <span className="font-mono text-[10px] uppercase tracking-wide text-[var(--color-muted-foreground)]">
                {t('free')}
              </span>
            )}
          </div>
        </div>
        <p className="font-body text-[13px] leading-relaxed text-[var(--color-muted-foreground)]">
          <Tx>{activity.description}</Tx>
        </p>
      </div>
    </div>
  )
}

// Cinematic hero: autoplaying, looping, muted landscape video that crossfades
// (400ms) whenever the source changes, layered over the day's cover image so
// the banner is never blank while the clip buffers — and it falls back to the
// image entirely if no video exists or the clip fails to load.
function HeroMedia({ videoSrc, image, alt }: { videoSrc?: string; image: string; alt: string }) {
  const [layers, setLayers] = useState<{ id: number; src: string }[]>(
    videoSrc ? [{ id: 0, src: videoSrc }] : [],
  )
  const idRef = useRef(0)

  useEffect(() => {
    setLayers((prev) => {
      const top = prev[prev.length - 1]
      if (!videoSrc) return prev.length ? [] : prev
      if (top && top.src === videoSrc) return prev
      idRef.current += 1
      return [...prev, { id: idRef.current, src: videoSrc }]
    })
  }, [videoSrc])

  // Once the newest layer has faded in, drop the ones beneath it.
  const settle = (id: number) =>
    setLayers((prev) => (prev.length > 1 ? prev.filter((l) => l.id >= id) : prev))
  const drop = (id: number) => setLayers((prev) => prev.filter((l) => l.id !== id))

  return (
    <>
      {/* Base image — first paint + permanent fallback */}
      <img src={image} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
      {layers.map((l, i) => (
        <VideoLayer
          key={l.id}
          src={l.src}
          isTop={i === layers.length - 1}
          onShown={() => settle(l.id)}
          onError={() => drop(l.id)}
        />
      ))}
    </>
  )
}

function VideoLayer({
  src,
  isTop,
  onShown,
  onError,
}: {
  src: string
  isTop: boolean
  onShown: () => void
  onError: () => void
}) {
  const [shown, setShown] = useState(false)
  const revealedRef = useRef(false)

  // Only start the fade once the clip can actually paint AND the browser has
  // committed at least one frame at opacity:0 — otherwise the 0→1 change lands
  // in the same frame and the video snaps in instead of crossfading.
  const reveal = () => {
    if (revealedRef.current) return
    revealedRef.current = true
    requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)))
  }

  return (
    <video
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      onLoadedData={reveal}
      onCanPlay={reveal}
      onTransitionEnd={(e) => {
        if (e.propertyName === 'opacity' && shown && isTop) onShown()
      }}
      onError={onError}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[400ms] ease-out ${
        shown ? 'opacity-100' : 'opacity-0'
      }`}
    />
  )
}

function DayDetail({ day, country }: { day: Day; country: Country }) {
  const t = useT()
  const lang = useContext(LangContext)
  const [selectedCat, setSelectedCat] = useState<string>('all')
  const [search, setSearch] = useState('')

  const dayTotal = day.activities.reduce((s, a) => s + a.cost, 0)
  const hasFood = day.activities.some((a) => a.category === 'food')
  const heroVideo = heroVideoFor(country.id, day.city)

  const filteredActivities = day.activities.filter((a) => {
    const matchesCat = selectedCat === 'all' || a.category === selectedCat
    const matchesSearch = !search.trim() || 
      a.title.toLowerCase().includes(search.toLowerCase()) || 
      a.description.toLowerCase().includes(search.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div>
      {/* Hero */}
      <div className="relative h-52 overflow-hidden bg-[var(--color-muted)] mb-6">
        <HeroMedia videoSrc={heroVideo} image={day.coverImage} alt={day.coverAlt} />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {hasFood && <Steam />}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="font-mono text-xs text-white/70 mb-1">{dayLabel(lang, day.day)} · {day.date}</div>
          <h2 className="font-display text-2xl font-600 text-white leading-tight"><Tx>{day.city}</Tx></h2>
          <div className="font-mono text-xs text-white/80 mt-2">
            <span className="mr-1">→</span><Tx>{day.transport}</Tx>
          </div>
        </div>
      </div>

      {/* Activities */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] mb-4 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 border-b border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3 bg-[var(--color-muted)]/50">
          <div className="flex items-center gap-2.5">
            <span className="font-display text-base font-600">{t('schedule')}</span>
            <span
              className="font-mono text-[9px] uppercase tracking-widest px-2 py-[3px] rounded-full"
              style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-muted-foreground)' }}
            >
              {filteredActivities.length} / {day.activities.length} stops
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search stops..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-32 sm:w-44 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1 text-xs outline-none focus:border-[var(--color-primary)] font-mono text-[var(--color-foreground)]"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1 text-xs text-[var(--color-muted-foreground)]">✕</button>
              )}
            </div>
            <span className="font-mono text-sm font-600 text-[var(--color-primary)]">
              {formatMoney(dayTotal, country)} {t('today')}
            </span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="px-5 py-2 border-b border-[var(--color-border)] flex gap-2 flex-wrap items-center bg-[var(--color-muted)]/20">
          <button
            onClick={() => setSelectedCat('all')}
            className={`font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
              selectedCat === 'all'
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white font-600'
                : 'border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
            }`}
          >
            All ({day.activities.length})
          </button>
          {(Object.keys(CATEGORY_COLORS) as Activity['category'][]).map((cat) => {
            const count = day.activities.filter((a) => a.category === cat).length
            if (count === 0) return null
            const isSel = selectedCat === cat
            return (
              <button
                key={cat}
                onClick={() => setSelectedCat(isSel ? 'all' : cat)}
                className={`font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSel
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white font-600'
                    : 'border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat] }} />
                {t('cat_' + cat)} ({count})
              </button>
            )
          })}
        </div>

        {/* Timeline */}
        <div className="px-5 pt-5 pb-3">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity, i) => (
              <ActivityRow
                key={i}
                activity={activity}
                country={country}
                isLast={i === filteredActivities.length - 1}
              />
            ))
          ) : (
            <div className="py-8 text-center font-mono text-xs text-[var(--color-muted-foreground)] uppercase tracking-wider">
              No stops match your search
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CountryTabs({ countries, activeId, onSelect }: { countries: Country[]; activeId: string; onSelect: (id: string) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-0.5">
      {countries.map((c) => {
        const active = c.id === activeId
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c.id)}
            style={active ? { borderColor: c.accent, color: c.accent } : undefined}
            className={`flex flex-shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 font-display text-sm font-600 transition-colors ${
              active
                ? 'border-b-2'
                : 'border-transparent text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
            }`}
          >
            <span className="text-base leading-none">{c.flag}</span>
            {c.name}
            <span className="font-mono text-[10px] font-400 opacity-60">{(c.itinerary?.length ?? 0)}d</span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Per-country theme — full-screen backdrop, pattern & accent palette ────

interface CountryBackground {
  id: string
  name: string
  bgImage: string
  patternOverlay: string // faint SVG pattern (data-URI)
  overlayOpacity: number
  accent: string // primary theme colour
  accent2: string // secondary / gradient partner
}

// Faint characteristic motifs, tinted with each country's accent.
const svgPat = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
const patWave = (c: string) => svgPat(`<svg xmlns='http://www.w3.org/2000/svg' width='56' height='28' viewBox='0 0 56 28'><path d='M0 28 C14 4 14 4 28 28 S42 4 56 28' fill='none' stroke='${c}' stroke-width='2'/></svg>`)
const patDiamond = (c: string) => svgPat(`<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><path d='M20 2 L38 20 L20 38 L2 20 Z' fill='none' stroke='${c}' stroke-width='1.4'/><circle cx='20' cy='20' r='2' fill='${c}'/></svg>`)
const patLotus = (c: string) => svgPat(`<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><g fill='none' stroke='${c}' stroke-width='1.3'><path d='M30 12 C38 24 38 36 30 48 C22 36 22 24 30 12 Z'/><path d='M12 30 C24 22 36 22 48 30 C36 38 24 38 12 30 Z'/></g></svg>`)
const patStupa = (c: string) => svgPat(`<svg xmlns='http://www.w3.org/2000/svg' width='40' height='36' viewBox='0 0 40 36'><path d='M20 4 L34 32 L6 32 Z' fill='none' stroke='${c}' stroke-width='1.4'/></svg>`)
const patStar = (c: string) => svgPat(`<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'><g fill='none' stroke='${c}' stroke-width='1.2'><rect x='11' y='11' width='22' height='22'/><rect x='11' y='11' width='22' height='22' transform='rotate(45 22 22)'/></g></svg>`)
const patMeander = (c: string) => svgPat(`<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><path d='M4 36 V12 H28 V28 H16 V20' fill='none' stroke='${c}' stroke-width='2'/></svg>`)
const patTais = (c: string) => svgPat(`<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><g stroke='${c}' fill='none'><path d='M16 6 V26 M6 16 H26' stroke-width='1.3'/><path d='M11 11 L21 21 M21 11 L11 21' stroke-width='0.7'/></g></svg>`)

const bgUrl = (id: string) => `https://images.unsplash.com/photo-${id}?w=1920&h=1280&fit=crop&auto=format`

const COUNTRY_BACKGROUNDS: Record<string, CountryBackground> = {
  vietnam: { id: 'vietnam', name: 'Vietnam', bgImage: bgUrl('1593994602837-530142086918'), patternOverlay: patWave('#3fb0a8'), overlayOpacity: 0.1, accent: '#35507a', accent2: '#3fb0a8' },
  thailand: { id: 'thailand', name: 'Thailand', bgImage: bgUrl('1668107710159-10fbbab2a9dd'), patternOverlay: patLotus('#e5a726'), overlayOpacity: 0.11, accent: '#e0a726', accent2: '#e5622a' },
  indonesia: { id: 'indonesia', name: 'Indonesia', bgImage: bgUrl('1555400038-63f5ba517a47'), patternOverlay: patDiamond('#3a8fb5'), overlayOpacity: 0.1, accent: '#b5623a', accent2: '#3a8fb5' },
  laos: { id: 'laos', name: 'Laos', bgImage: bgUrl('1628128573898-262b312f707e'), patternOverlay: patDiamond('#c9962f'), overlayOpacity: 0.1, accent: '#c9962f', accent2: '#5a8f6b' },
  cambodia: { id: 'cambodia', name: 'Cambodia', bgImage: bgUrl('1504639650150-bf773680d8c3'), patternOverlay: patLotus('#d16a86'), overlayOpacity: 0.11, accent: '#b98a4b', accent2: '#d16a86' },
  myanmar: { id: 'myanmar', name: 'Myanmar', bgImage: bgUrl('1584897356466-858d9b6c53d1'), patternOverlay: patStupa('#e0a83a'), overlayOpacity: 0.11, accent: '#b5423a', accent2: '#e0a83a' },
  malaysia: { id: 'malaysia', name: 'Malaysia', bgImage: bgUrl('1597148543182-830ef7bbb904'), patternOverlay: patStar('#c99a2e'), overlayOpacity: 0.1, accent: '#c99a2e', accent2: '#2f8f5e' },
  singapore: { id: 'singapore', name: 'Singapore', bgImage: bgUrl('1544214036-5aaeb9e32d11'), patternOverlay: patWave('#3a7db5'), overlayOpacity: 0.1, accent: '#c0417e', accent2: '#3a7db5' },
  philippines: { id: 'philippines', name: 'Philippines', bgImage: bgUrl('1518509562904-e7ef99cdcc86'), patternOverlay: patStar('#e0a52a'), overlayOpacity: 0.1, accent: '#e0a52a', accent2: '#2f9fa6' },
  brunei: { id: 'brunei', name: 'Brunei', bgImage: bgUrl('1709808971463-270bae12b837'), patternOverlay: patStar('#c9a13a'), overlayOpacity: 0.11, accent: '#c9a13a', accent2: '#2f7d6a' },
  timor: { id: 'timor', name: 'East Timor', bgImage: bgUrl('1746438411454-a74d56175749'), patternOverlay: patTais('#c74a3a'), overlayOpacity: 0.11, accent: '#c74a3a', accent2: '#2f7db0' },
  japan: { id: 'japan', name: 'Japan', bgImage: bgUrl('1599173705513-0880f530cd3d'), patternOverlay: patDiamond('#c0392b'), overlayOpacity: 0.1, accent: '#c0392b', accent2: '#39527a' },
  china: { id: 'china', name: 'China', bgImage: bgUrl('1514920735211-8c697444a248'), patternOverlay: patMeander('#c02b2b'), overlayOpacity: 0.1, accent: '#c02b2b', accent2: '#3a9e7a' },
}

const FALLBACK_BACKGROUND = COUNTRY_BACKGROUNDS.vietnam

// Global theme context — the whole page reads the current country's palette.
const CountryThemeContext = createContext<CountryBackground>(FALLBACK_BACKGROUND)
const useCountryTheme = () => useContext(CountryThemeContext)

// Full-screen country backdrop — old image crossfades to new over 1 second,
// blurred and darkened for legibility, with a faint accent pattern on top.
// ─── Discover Vietnam — Journeys & Flavors From Every Region ─────────────────

// ─── Discover Southeast Asia — Journeys & Flavors From Every Corner ─────────

function DiscoverSoutheastAsiaSection({ onExploreDestinations }: { onExploreDestinations?: () => void }) {
  const [subscribed, setSubscribed] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
    }
  }

  const SEA_DESTINATIONS = [
    { country: 'Vietnam', flag: '🇻🇳', text: "Terraced rice fields, limestone karsts, and lantern-lit old towns. Highlights include Sapa's trekking trails, Ha Long Bay, and the imperial city of Hue." },
    { country: 'Thailand', flag: '🇹🇭', text: "Golden temples, tropical islands, and legendary street food. Explore Bangkok's markets, Chiang Mai's mountains, and the beaches of Krabi and Koh Samui." },
    { country: 'Cambodia', flag: '🇰🇭', text: "Ancient wonders and quiet river towns. Discover the temples of Angkor, the riverside charm of Phnom Penh, and the coastal calm of Kep." },
    { country: 'Laos', flag: '🇱🇦', text: "Slow travel at its finest. Wander the UNESCO streets of Luang Prabang, cruise the Mekong, and explore the karst landscapes of Vang Vieng." },
    { country: 'Myanmar', flag: '🇲🇲', text: "Golden pagodas and timeless traditions. Visit the temple plains of Bagan, the waters of Inle Lake, and the streets of Yangon." },
    { country: 'Indonesia', flag: '🇮🇩', text: "Volcanoes, rice terraces, and island life. Experience Bali's culture, Yogyakarta's temples, and the diving spots of Raja Ampat." },
    { country: 'Malaysia', flag: '🇲🇾', text: "A crossroads of cultures. Explore Kuala Lumpur's skyline, Penang's heritage streets, and the rainforests of Borneo." },
    { country: 'Philippines', flag: '🇵🇭', text: "Turquoise waters and thousands of islands. Discover Palawan's lagoons, Cebu's beaches, and the rice terraces of Banaue." },
    { country: 'Singapore', flag: '🇸🇬', text: "A gateway city of gardens and global flavors. A perfect stop for a short stay or a launch point for the region." },
    { country: 'Brunei', flag: '🇧🇳', text: "Rich heritage on the shores of Borneo. Explore the water village of Kampong Ayer and pristine rainforest reserves." },
  ]

  const SPECIALTY_PRODUCTS = [
    { country: 'Vietnam', flag: '🇻🇳', specialty: '🍵 Shan Tuyet ancient tea, 🐟 Phu Quoc fish sauce, 🥥 coconut candy', story: 'Highland ancient tea trees & artisanal wooden barrel-aged sauces.' },
    { country: 'Thailand', flag: '🇹🇭', specialty: '🌾 Thai jasmine rice, ☕ northern coffee, 🥭 dried mango', story: 'Hom Mali jasmine rice & Chiang Mai mountain arabica beans.' },
    { country: 'Cambodia', flag: '🇰🇭', specialty: '🌶️ Kampot pepper, 🌴 palm sugar, 🐟 prahok', story: 'World-famous PGI Kampot pepper & traditional palm sugar.' },
    { country: 'Laos', flag: '🇱🇦', specialty: '☕ Laotian coffee, 🌾 sticky rice, 🍵 mulberry tea', story: 'Bolaven plateau volcanic coffee & organic mulberry leaves.' },
    { country: 'Myanmar', flag: '🇲🇲', specialty: '🍃 Shan tea leaves, 🥗 tea-leaf salad mix, 🌿 thanaka', story: 'Highland pickled tea leaves & natural Thanaka bark.' },
    { country: 'Indonesia', flag: '🇮🇩', specialty: '☕ Bali coffee, 🌰 nutmeg, 🌶️ sambal pastes', story: 'Single-origin Kintamani coffee & Banda island spices.' },
    { country: 'Malaysia', flag: '🇲🇾', specialty: '🌶️ Sarawak pepper, 🌿 tongkat ali, 🌴 gula melaka', story: 'Borneo rainforest Sarawak pepper & pure coconut palm sugar.' },
    { country: 'Philippines', flag: '🇵🇭', specialty: '🍫 Cacao tablea, 🍋 calamansi products, 🥭 dried mangoes', story: 'Davao heritage cacao & sun-dried Guimaras sweet mangoes.' },
  ]

  return (
    <section className="my-12 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-10 shadow-xl overflow-hidden relative">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 rounded-full bg-[var(--color-primary)]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-96 h-96 rounded-full bg-[var(--color-accent)]/10 blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <div className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--color-primary)] mb-2">
          Grand Tour Regional Showcase
        </div>
        <h2 className="font-carve text-3xl sm:text-5xl font-600 leading-tight mb-4">
          Discover Southeast Asia — Journeys & Flavors From Every Corner
        </h2>
        <p className="font-display text-xl italic text-[var(--color-primary)] mb-4">
          "Explore Southeast Asia, One Story at a Time"
        </p>
        <p className="font-body text-base sm:text-lg text-[var(--color-muted-foreground)] leading-relaxed mb-6">
          From the temple spires of Cambodia to the rice terraces of the Philippines, from Thailand's golden coastlines to Indonesia's volcanic islands, Southeast Asia is a region of endless wonder. We bring you closer to it all: curated travel experiences paired with the authentic local specialties that define each destination.
        </p>
        <p className="font-script text-2xl text-[var(--color-foreground)] mb-6">
          *Book a journey. Taste a country. Take a piece of Southeast Asia home with you.*
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onExploreDestinations}
            className="px-6 py-3 rounded-full font-mono text-xs uppercase tracking-widest bg-[var(--color-primary)] text-white hover:opacity-90 transition-all shadow-md lift cursor-pointer"
          >
            Explore Destinations
          </button>
          <a
            href="#sea-specialties"
            className="px-6 py-3 rounded-full font-mono text-xs uppercase tracking-widest border border-[var(--color-border)] bg-[var(--color-muted)] text-[var(--color-foreground)] hover:border-[var(--color-primary)] transition-all lift cursor-pointer"
          >
            Shop Local Specialties
          </a>
        </div>
      </div>

      <hr className="border-[var(--color-border)] my-10 opacity-60" />

      {/* Why Travel With Us */}
      <div className="mb-12">
        <h3 className="font-carve text-2xl mb-6 text-center">Why Travel With Us</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/30 hover:border-[var(--color-primary)] transition-all">
            <div className="text-3xl mb-3">🌏</div>
            <h4 className="font-display text-lg font-600 mb-2">Local Expertise</h4>
            <p className="font-body text-sm text-[var(--color-muted-foreground)]">
              Routes designed by guides who grew up in the countries they showcase.
            </p>
          </div>
          <div className="p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/30 hover:border-[var(--color-primary)] transition-all">
            <div className="text-3xl mb-3">🏺</div>
            <h4 className="font-display text-lg font-600 mb-2">Authentic Specialties</h4>
            <p className="font-body text-sm text-[var(--color-muted-foreground)]">
              Sourced directly from local farmers, artisans, and family producers across the region.
            </p>
          </div>
          <div className="p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/30 hover:border-[var(--color-primary)] transition-all">
            <div className="text-3xl mb-3">🗺️</div>
            <h4 className="font-display text-lg font-600 mb-2">Flexible Itineraries</h4>
            <p className="font-body text-sm text-[var(--color-muted-foreground)]">
              From single-country escapes to multi-country adventures tailored to your speed.
            </p>
          </div>
          <div className="p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/30 hover:border-[var(--color-primary)] transition-all">
            <div className="text-3xl mb-3">🌱</div>
            <h4 className="font-display text-lg font-600 mb-2">Sustainable Tourism</h4>
            <p className="font-body text-sm text-[var(--color-muted-foreground)]">
              Partnering with local communities to protect the precious places we love.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Destinations Across Southeast Asia */}
      <div className="mb-12">
        <h3 className="font-carve text-2xl mb-6 text-center">Featured Destinations Across Southeast Asia</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SEA_DESTINATIONS.map((item) => (
            <div key={item.country} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl leading-none">{item.flag}</span>
                <h4 className="font-carve text-xl">{item.country}</h4>
              </div>
              <p className="font-body text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Taste of Southeast Asia: Specialty Products */}
      <div id="sea-specialties" className="mb-12">
        <h3 className="font-carve text-2xl mb-2 text-center">Taste of Southeast Asia: Specialty Products</h3>
        <p className="font-body text-center text-sm text-[var(--color-muted-foreground)] max-w-xl mx-auto mb-6">
          Every country has a flavor of its own. Bring it home with our curated collection of authentic Southeast Asian specialties:
        </p>

        <div className="overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm">
          <table className="w-full text-left font-mono text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--color-muted)] border-b border-[var(--color-border)]">
                <th className="p-4 font-mono text-xs uppercase tracking-wider text-[var(--color-muted-foreground)]">Country</th>
                <th className="p-4 font-mono text-xs uppercase tracking-wider text-[var(--color-muted-foreground)]">Signature Specialty</th>
                <th className="p-4 font-mono text-xs uppercase tracking-wider text-[var(--color-muted-foreground)]">Origin & Story</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] font-body">
              {SPECIALTY_PRODUCTS.map((sp) => (
                <tr key={sp.country} className="hover:bg-[var(--color-muted)]/30 transition-colors">
                  <td className="p-4 font-mono font-600 text-[var(--color-primary)] flex items-center gap-2">
                    <span>{sp.flag}</span>
                    <span>{sp.country}</span>
                  </td>
                  <td className="p-4 font-500">{sp.specialty}</td>
                  <td className="p-4 text-xs text-[var(--color-muted-foreground)]">{sp.story}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* What's New This Season */}
      <div className="mb-12 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/40 p-6 sm:p-8">
        <h3 className="font-carve text-2xl mb-4">What's New This Season</h3>
        <ul className="space-y-3 font-body text-base">
          <li className="flex items-start gap-3">
            <span className="px-2 py-0.5 rounded bg-[var(--color-primary)] text-white font-mono text-[10px] uppercase font-600">NEW</span>
            <div><strong>New Multi-Country Routes</strong> — Combine Vietnam, Laos, and Cambodia in one seamless overland itinerary.</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="px-2 py-0.5 rounded bg-[var(--color-primary)] text-white font-mono text-[10px] uppercase font-600">NEW</span>
            <div><strong>Limited-Batch Regional Boxes</strong> — Seasonal collections featuring the best specialties from across Southeast Asia, delivered monthly.</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="px-2 py-0.5 rounded bg-[var(--color-primary)] text-white font-mono text-[10px] uppercase font-600">NEW</span>
            <div><strong>Community Homestay Program</strong> — Stay with local families in villages from Northern Vietnam to Central Java.</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="px-2 py-0.5 rounded bg-[var(--color-primary)] text-white font-mono text-[10px] uppercase font-600">NEW</span>
            <div><strong>Sustainable Travel Certification</strong> — Our latest partner destinations across the region now meet updated eco-tourism standards.</div>
          </li>
        </ul>
      </div>

      {/* Join Our Community */}
      <div className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-card)] p-6 sm:p-8 text-center max-w-2xl mx-auto shadow-lg">
        <h3 className="font-carve text-2xl mb-2">Join Our Community</h3>
        <p className="font-body text-sm text-[var(--color-muted-foreground)] mb-6">
          Sign up for travel inspiration, new destination guides, and first access to limited specialty product releases from across Southeast Asia.
        </p>

        {subscribed ? (
          <div className="p-4 rounded bg-green-500/15 border border-green-500/30 text-green-700 dark:text-green-300 font-mono text-sm">
            ✓ Welcome to the community! Check your inbox for your first Southeast Asian travel guide.
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-full border border-[var(--color-border)] bg-[var(--color-muted)] px-4 py-2.5 font-mono text-sm outline-none focus:border-[var(--color-primary)] text-[var(--color-foreground)]"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full font-mono text-xs uppercase tracking-widest bg-[var(--color-primary)] text-white hover:opacity-90 transition-all shadow-md cursor-pointer"
            >
              Subscribe Now
            </button>
          </form>
        )}

        <p className="mt-6 font-script text-xl text-[var(--color-muted-foreground)]">
          *Southeast Asia is best experienced slowly — one country, one dish, one story at a time. Let us help you find yours.*
        </p>
      </div>
    </section>
  )
}

function FloatingBackToTop() {
  const theme = useCountryTheme()
  // Bump a key on every country change so the sweep/bloom animations restart.
  const [flip, setFlip] = useState(0)
  const prev = useRef(theme.id)
    if (prev.current !== theme.id) {
      prev.current = theme.id
      setFlip((n) => n + 1)
    }
  }, [theme.id])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {Object.values(COUNTRY_BACKGROUNDS).map((b) => {
        const active = b.id === theme.id
        return (
          <div
            key={b.id}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1100ms] ease-in-out ${active ? 'country-drift' : ''}`}
            style={{
              backgroundImage: `url("${b.bgImage}")`,
              opacity: active ? 1 : 0,
              filter: 'blur(3px) brightness(0.7) saturate(1.05)',
              transform: active ? undefined : 'scale(1.06)',
            }}
          />
        )
      })}
      {/* Dark wash for comfortable reading */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08080c]/60 via-[#08080c]/62 to-[#08080c]/75" />

      {/* Cinematic switch effects — restarted each time the country changes */}
      {flip > 0 && (
        <div key={flip} className="absolute inset-0">
          {/* Whole-scene brightness bloom in the new accent */}
          <div
            className="country-bloom absolute inset-0 mix-blend-screen"
            style={{ background: `radial-gradient(120% 80% at 50% 40%, ${theme.accent}55, transparent 70%)` }}
          />
          {/* Diagonal light band sweeping across */}
          <div
            className="country-sweep absolute inset-y-0 -left-1/3 w-2/3 mix-blend-screen"
            style={{
              background: `linear-gradient(105deg, transparent, ${theme.accent2}88 42%, ${theme.accent}aa 55%, transparent)`,
              filter: 'blur(6px)',
            }}
          />
        </div>
      )}
    </div>
  )
}

// ─── Time-of-day sky — the page passes through a full SE Asian day ─────────
// Morning mist → midday sun → sunset → night market, driven by scroll depth.
const SKY_STOPS = [
  { at: 0, css: 'linear-gradient(180deg, #26314f 0%, #6a6394 34%, #cf8f83 68%, #f6cf94 100%)' }, // early morning
  { at: 0.34, css: 'linear-gradient(180deg, #4a93d1 0%, #93c7ea 46%, #e2eef2 100%)' }, // midday sun
  { at: 0.68, css: 'linear-gradient(180deg, #33245f 0%, #bc457e 42%, #ef7d3a 78%, #ffc470 100%)' }, // sunset
  { at: 1, css: 'linear-gradient(180deg, #060a1c 0%, #1a1636 45%, #3d1f3a 73%, #6d3620 100%)' }, // night market
]

function TimeOfDayBackdrop({ night }: { night: boolean }) {
  const [p, setP] = useState(0)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement
        const max = doc.scrollHeight - doc.clientHeight
        setP(max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const seg = 0.34
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{ mixBlendMode: 'soft-light', opacity: 0.7 }}
      aria-hidden="true"
    >
      {SKY_STOPS.map((s, i) => {
        // In night-market mode the sky settles fully into the last (night) stop.
        const opacity = night
          ? i === SKY_STOPS.length - 1
            ? 1
            : 0
          : Math.max(0, 1 - Math.abs(p - s.at) / seg)
        return (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700 ease-out"
            style={{ background: s.css, opacity }}
          />
        )
      })}
    </div>
  )
}

// ─── Language selection — every SE Asian tongue, English by default ────────
interface Language {
  code: string
  flag: string
  label: string // English name
  native: string // endonym
}

const LANGUAGES: Language[] = [
  { code: 'en', flag: '🇬🇧', label: 'English', native: 'English' },
  { code: 'vi', flag: '🇻🇳', label: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'lo', flag: '🇱🇦', label: 'Lao', native: 'ພາສາລາວ' },
  { code: 'km', flag: '🇰🇭', label: 'Khmer', native: 'ភាសាខ្មែរ' },
  { code: 'th', flag: '🇹🇭', label: 'Thai', native: 'ภาษาไทย' },
  { code: 'my', flag: '🇲🇲', label: 'Burmese', native: 'မြန်မာဘာသာ' },
  { code: 'ms', flag: '🇲🇾', label: 'Malay', native: 'Bahasa Melayu' },
  { code: 'ms-sg', flag: '🇸🇬', label: 'Singapore', native: 'Bahasa / English' },
  { code: 'id', flag: '🇮🇩', label: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'fil', flag: '🇵🇭', label: 'Filipino', native: 'Filipino' },
  { code: 'ms-bn', flag: '🇧🇳', label: 'Brunei Malay', native: 'Bahasa Melayu' },
  { code: 'tet', flag: '🇹🇱', label: 'Tetum', native: 'Tetun' },
  { code: 'ja', flag: '🇯🇵', label: 'Japanese', native: '日本語' },
  { code: 'zh', flag: '🇨🇳', label: 'Chinese', native: '中文' },
]

// Which language belongs to each country (drives the auto-switch on arrival).
const COUNTRY_LANG: Record<string, string> = {
  vietnam: 'vi', laos: 'lo', cambodia: 'km', thailand: 'th', myanmar: 'my',
  malaysia: 'ms', singapore: 'ms-sg', indonesia: 'id', philippines: 'fil',
  brunei: 'ms-bn', timor: 'tet', japan: 'ja', china: 'zh',
}

// The Malay variants share one translation table.
const baseLang = (code: string) => (code === 'ms-sg' || code === 'ms-bn' ? 'ms' : code)

type Dict = Record<string, string>
const TRANSLATIONS: Record<string, Dict> = {
  en: { grandTour: 'The Grand Tour', appTitle: 'The Asia Grand Tour', itinerary: 'Itinerary', selectLanguage: 'Select language', riceEyebrow: 'Country by country', riceTitle: 'The Rice Journey', regionEyebrow: 'Regional Guide', regionTitle: 'Provinces & Regions', festivalEyebrow: 'Festival Calendar', festivalTitle: 'A Year of Festivals', specialtiesTitle: 'Specialty Tourism', tapCard: 'Tap a card for its story', budgetSummary: 'Budget Summary', cat_transport: 'Transport', cat_food: 'Food', cat_attraction: 'Sights', cat_accommodation: 'Stay', cat_other: 'Other', watchFilm: 'Watch the intro film', travelYear: 'Use the arrows to travel the year', flipBack: 'tap to flip back', charting: 'This leg of the journey is still being charted…', riceLead: 'Rice is the one thread tying the whole region together — yet every nation makes the grain its own.', regionLead: 'Choose a country to unfold its most representative regions — tap any card to look closer.' },
  vi: { grandTour: 'Hành Trình Lớn', appTitle: 'Đại Hành Trình Châu Á', itinerary: 'Lịch trình', selectLanguage: 'Chọn ngôn ngữ', riceEyebrow: 'Từng quốc gia', riceTitle: 'Hành Trình Hạt Gạo', regionEyebrow: 'Cẩm nang vùng miền', regionTitle: 'Tỉnh & Vùng miền', festivalEyebrow: 'Lịch lễ hội', festivalTitle: 'Một Năm Lễ Hội', specialtiesTitle: 'Du lịch đặc sản', tapCard: 'Chạm vào thẻ để xem câu chuyện', budgetSummary: 'Tổng chi phí', cat_transport: 'Di chuyển', cat_food: 'Ẩm thực', cat_attraction: 'Tham quan', cat_accommodation: 'Lưu trú', cat_other: 'Khác', watchFilm: 'Xem phim giới thiệu', travelYear: 'Dùng mũi tên để đi qua các tháng', flipBack: 'chạm để lật lại', charting: 'Chặng đường này vẫn đang được vẽ nên…', riceLead: 'Gạo là sợi chỉ nối cả vùng lại với nhau — nhưng mỗi quốc gia lại biến hạt gạo thành của riêng mình.', regionLead: 'Chọn một quốc gia để mở ra những vùng tiêu biểu nhất — chạm vào thẻ để xem gần hơn.' },
  lo: { grandTour: 'ການເດີນທາງໃຫຍ່', appTitle: 'ການເດີນທາງໃຫຍ່ແຫ່ງອາຊີ', itinerary: 'ກຳນົດການເດີນທາງ', selectLanguage: 'ເລືອກພາສາ', riceEyebrow: 'ແຕ່ລະປະເທດ', riceTitle: 'ການເດີນທາງຂອງເຂົ້າ', regionEyebrow: 'ຄູ່ມືພາກພື້ນ', regionTitle: 'ແຂວງ & ພາກພື້ນ', festivalEyebrow: 'ປະຕິທິນບຸນ', festivalTitle: 'ໜຶ່ງປີແຫ່ງບຸນ', specialtiesTitle: 'ຜະລິດຕະພັນເດັ່ນ & ມໍລະດົກ', tapCard: 'ແຕະບັດເພື່ອອ່ານເລື່ອງ', budgetSummary: 'ສະຫຼຸບງົບປະມານ' },
  km: { grandTour: 'ដំណើរដ៏អស្ចារ្យ', appTitle: 'ដំណើរកម្សាន្តអាស៊ីដ៏អស្ចារ្យ', itinerary: 'កម្មវិធីធ្វើដំណើរ', selectLanguage: 'ជ្រើសរើសភាសា', riceEyebrow: 'ប្រទេសម្តងមួយៗ', riceTitle: 'ដំណើររបស់អង្ករ', regionEyebrow: 'មគ្គុទ្ទេសក៍តំបន់', regionTitle: 'ខេត្ត និងតំបន់', festivalEyebrow: 'ប្រតិទិនពិធីបុណ្យ', festivalTitle: 'មួយឆ្នាំនៃពិធីបុណ្យ', specialtiesTitle: 'ជំនាញ & បេតិកភណ្ឌ', tapCard: 'ចុចលើកាតដើម្បីមើលរឿង', budgetSummary: 'សង្ខេបថវិកា' },
  th: { grandTour: 'แกรนด์ทัวร์', appTitle: 'แกรนด์ทัวร์แห่งเอเชีย', itinerary: 'กำหนดการเดินทาง', selectLanguage: 'เลือกภาษา', riceEyebrow: 'ทีละประเทศ', riceTitle: 'เส้นทางของข้าว', regionEyebrow: 'คู่มือภูมิภาค', regionTitle: 'จังหวัดและภูมิภาค', festivalEyebrow: 'ปฏิทินเทศกาล', festivalTitle: 'หนึ่งปีแห่งเทศกาล', specialtiesTitle: 'ของดีและมรดก', tapCard: 'แตะการ์ดเพื่ออ่านเรื่องราว', budgetSummary: 'สรุปงบประมาณ' },
  my: { grandTour: 'ခရီးကြီး', appTitle: 'အာရှ ခရီးကြီး', itinerary: 'ခရီးစဉ်', selectLanguage: 'ဘာသာစကား ရွေးပါ', riceEyebrow: 'နိုင်ငံအလိုက်', riceTitle: 'ဆန်၏ ခရီး', regionEyebrow: 'ဒេသဆိုင်ရာ လမ်းညွှန်', regionTitle: 'ပြည်နယ်နှင့် ဒေသများ', festivalEyebrow: 'ပွဲတော် ပြက္ခဒိန်', festivalTitle: 'ပွဲတော်များ၏ တစ်နှစ်တာ', specialtiesTitle: 'အထူးထွက်ကုန်နှင့် အမွေအနှစ်', tapCard: 'ဇာတ်လမ်းအတွက် ကတ်ကို တို့ပါ', budgetSummary: 'ဘတ်ဂျက် အနှစ်ချုပ်' },
  ms: { grandTour: 'Jelajah Agung', appTitle: 'Jelajah Agung Asia', itinerary: 'Itinerari', selectLanguage: 'Pilih bahasa', riceEyebrow: 'Negara demi negara', riceTitle: 'Perjalanan Beras', regionEyebrow: 'Panduan Wilayah', regionTitle: 'Wilayah & Daerah', festivalEyebrow: 'Kalendar Perayaan', festivalTitle: 'Setahun Perayaan', specialtiesTitle: 'Keistimewaan & Warisan', tapCard: 'Ketik kad untuk kisahnya', budgetSummary: 'Ringkasan Bajet' },
  id: { grandTour: 'Petualangan Agung', appTitle: 'Petualangan Agung Asia', itinerary: 'Itinerari', selectLanguage: 'Pilih bahasa', riceEyebrow: 'Negara demi negara', riceTitle: 'Perjalanan Nasi', regionEyebrow: 'Panduan Wilayah', regionTitle: 'Provinsi & Wilayah', festivalEyebrow: 'Kalender Festival', festivalTitle: 'Setahun Festival', specialtiesTitle: 'Keistimewaan & Warisan', tapCard: 'Ketuk kartu untuk ceritanya', budgetSummary: 'Ringkasan Anggaran' },
  fil: { grandTour: 'Ang Dakilang Paglalakbay', appTitle: 'Ang Dakilang Paglalakbay sa Asya', itinerary: 'Talaan ng Biyahe', selectLanguage: 'Pumili ng wika', riceEyebrow: 'Bawat bansa', riceTitle: 'Ang Paglalakbay ng Bigas', regionEyebrow: 'Gabay sa Rehiyon', regionTitle: 'Mga Lalawigan at Rehiyon', festivalEyebrow: 'Kalendaryo ng Pista', festivalTitle: 'Isang Taon ng mga Pista', specialtiesTitle: 'Espesyalidad at Pamana', tapCard: 'I-tap ang card para sa kuwento', budgetSummary: 'Buod ng Badyet' },
  tet: { grandTour: 'Viajen Boot', appTitle: 'Viajen Boot Ázia', itinerary: 'Planu Viajen', selectLanguage: 'Hili lian', riceEyebrow: 'Nasaun ba nasaun', riceTitle: 'Viajen Foos', regionEyebrow: 'Gia Rejiaun', regionTitle: 'Provínsia & Rejiaun', festivalEyebrow: 'Kalendáriu Festa', festivalTitle: 'Tinan Festa nian', specialtiesTitle: 'Espesialidade & Eransa', tapCard: 'Toka karta ba nia istória', budgetSummary: 'Rezumu Orsamentu' },
  ja: { grandTour: 'グランドツアー', appTitle: 'アジア グランドツアー', itinerary: '旅程', selectLanguage: '言語を選択', riceEyebrow: '国ごとに', riceTitle: '米の旅', regionEyebrow: '地域ガイド', regionTitle: '地方と地域', festivalEyebrow: 'お祭りカレンダー', festivalTitle: '一年のお祭り', specialtiesTitle: '専門 観光', tapCard: 'カードをタップして物語を見る', budgetSummary: '予算のまとめ' },
  zh: { grandTour: '壮游', appTitle: '亚洲壮游', itinerary: '行程', selectLanguage: '选择语言', riceEyebrow: '逐国探索', riceTitle: '稻米之旅', regionEyebrow: '地区指南', regionTitle: '省份与地区', festivalEyebrow: '节庆日历', festivalTitle: '一年的节庆', specialtiesTitle: '特产与遗产', tapCard: '点按卡片查看故事', budgetSummary: '预算摘要' },
}

// Supplementary strings (categories, buttons, captions, leads) for the
// languages whose base rows predate these keys. Consulted before the base
// table so it can also refine a few section titles.
const TRANSLATIONS_EXTRA: Record<string, Dict> = {
  lo: { specialtiesTitle: 'ທ່ອງທ່ຽວຜະລິດຕະພັນເດັ່ນ', cat_transport: 'ການເດີນທາງ', cat_food: 'ອາຫານ', cat_attraction: 'ສະຖານທີ່', cat_accommodation: 'ທີ່ພັກ', cat_other: 'ອື່ນໆ', watchFilm: 'ເບິ່ງວິດີໂອແນະນຳ', travelYear: 'ໃຊ້ລູກສอນເພື່ອທ່ອງທ່ຽວຕະຫຼອດປີ', flipBack: 'ແຕະເພື່ອປີ້ນກັບ', charting: 'ເສັ້ນທາງນີ້ຍັງກຳລັງຖືກແຕ້ມ…', riceLead: 'ເຂົ້າແມ່ນເສັ້ນດ້າຍທີ່ຮ້ອຍທົ່ວພາກພື້ນ — ແຕ່ແຕ່ລະຊາດເຮັດໃຫ້ເມັດເຂົ້າເປັນຂອງຕົນເອງ.', regionLead: 'ເລືອກປະເທດໜຶ່ງເພື່ອເປີດເຜີຍພາກພື້ນທີ່ໂດດເດັ່ນ — ແຕະບັດເພື່ອເບິ່ງໃກ້ໆ.' },
  km: { specialtiesTitle: 'ទេសចរណ៍ជំនាញ', cat_transport: 'ការធ្វើដំណើរ', cat_food: 'អាហារ', cat_attraction: 'ទីកន្លែង', cat_accommodation: 'ស្នាក់នៅ', cat_other: 'ផ្សេងៗ', watchFilm: 'មើលវីដេអូណែនាំ', travelYear: 'ប្រើព្រួញដើម្បីធ្វើដំណើរពេញមួយឆ្នាំ', flipBack: 'ចុចដើម្បីត្រឡប់', charting: 'ផ្នែកនៃដំណើរនេះកំពុងត្រូវបានគូរនៅឡើយ…', riceLead: 'អង្ករគឺជាខ្សែស្រឡាយភ្ជាប់តំបន់ទាំងមូល — ប៉ុន្តែប្រទេសនីមួយៗធ្វើឱ្យវាក្លាយជារបស់ខ្លួន។', regionLead: 'ជ្រើសរើសប្រទេសមួយដើម្បីបង្ហាញតំបន់ដ៏លេចធ្លោ — ចុចលើកាតដើម្បីមើលឱ្យច្បាស់។' },
  th: { specialtiesTitle: 'ท่องเที่ยวของดี', cat_transport: 'การเดินทาง', cat_food: 'อาหาร', cat_attraction: 'สถานที่', cat_accommodation: 'ที่พัก', cat_other: 'อื่นๆ', watchFilm: 'ดูวิดีโอแนะนำ', travelYear: 'ใช้ลูกศรเพื่อท่องไปตลอดปี', flipBack: 'แตะเพื่อพลิกกลับ', charting: 'เส้นทางช่วงนี้กำลังถูกวางแผนอยู่…', riceLead: 'ข้าวคือเส้นด้ายที่ร้อยทั้งภูมิภาคเข้าด้วยกัน — แต่ทุกชาติทำให้เมล็ดข้าวเป็นของตนเอง', regionLead: 'เลือกประเทศเพื่อเผยภูมิภาคที่โดดเด่น — แตะการ์ดเพื่อดูใกล้ขึ้น' },
  my: { specialtiesTitle: 'အထူးထွက်ကုန် ခရီးသွား', cat_transport: 'သယ်ယူပို့ဆောင်ရေး', cat_food: 'အစားအစာ', cat_attraction: 'ကြည့်ရှုစရာ', cat_accommodation: 'တည်းခို', cat_other: 'အခြား', watchFilm: 'မိတ်ဆက်ဗီဒီယို ကြည့်ရန်', travelYear: 'တစ်နှစ်လုံး လှည့်ရန် မြှားများ သုံးပါ', flipBack: 'ပြန်လှန်ရန် တို့ပါ', charting: 'ဤခရီးအပိုင်းကို ရေးဆွဲနေဆဲ…', riceLead: 'ဆန်သည် ဒေသတစ်ခုလုံးကို ချည်ဆက်ထားသော ချည်မျှင် — သို့သော် နိုင်ငံတိုင်းက ၎င်းကို မိမိပုံစံဖြင့် ဖန်တီးသည်။', regionLead: 'ကိုယ်စားပြုဒေသများ ဖော်ပြရန် နိုင်ငံတစ်ခု ရွေးပါ — အနီးကပ်ကြည့်ရန် ကတ်ကို တို့ပါ။' },
  ms: { specialtiesTitle: 'Pelancongan Istimewa', cat_transport: 'Pengangkutan', cat_food: 'Makanan', cat_attraction: 'Tarikan', cat_accommodation: 'Penginapan', cat_other: 'Lain', watchFilm: 'Tonton filem pengenalan', travelYear: 'Guna anak panah untuk jelajah setahun', flipBack: 'ketik untuk balik', charting: 'Peta perjalanan ini masih dilakar…', riceLead: 'Beras ialah benang yang menyatukan seluruh rantau — namun setiap negara menjadikannya milik sendiri.', regionLead: 'Pilih negara untuk membuka wilayah paling ikoniknya — ketik kad untuk lihat dengan lebih dekat.' },
  id: { specialtiesTitle: 'Wisata Khas', cat_transport: 'Transportasi', cat_food: 'Makanan', cat_attraction: 'Wisata', cat_accommodation: 'Menginap', cat_other: 'Lainnya', watchFilm: 'Tonton film pembuka', travelYear: 'Gunakan panah untuk menjelajah setahun', flipBack: 'ketuk untuk membalik', charting: 'Bagian perjalanan ini masih digambar…', riceLead: 'Beras adalah benang yang menyatukan seluruh kawasan — namun setiap negara menjadikannya khas miliknya.', regionLead: 'Pilih negara untuk membuka wilayah paling ikoniknya — ketuk kartu untuk melihat lebih dekat.' },
  fil: { specialtiesTitle: 'Turismong Espesyalidad', cat_transport: 'Transportasyon', cat_food: 'Pagkain', cat_attraction: 'Tanawin', cat_accommodation: 'Tuluyan', cat_other: 'Iba pa', watchFilm: 'Panoorin ang intro', travelYear: 'Gamitin ang arrow para libutin ang taon', flipBack: 'i-tap para bumalik', charting: 'Binubuo pa ang bahaging ito ng biyahe…', riceLead: 'Ang bigas ang sinulid na nagbubuklod sa buong rehiyon — ngunit ginagawa itong sarili ng bawat bansa.', regionLead: 'Pumili ng bansa para ilahad ang pinakakilalang rehiyon nito — i-tap ang card para tingnang mabuti.' },
  tet: { specialtiesTitle: 'Turizmu Espesiál', cat_transport: 'Transporte', cat_food: 'Ai-han', cat_attraction: 'Fatin', cat_accommodation: 'Hela-fatin', cat_other: 'Seluk', watchFilm: 'Haree filme introdusaun', travelYear: 'Uza flexa atu viaja tinan tomak', flipBack: 'toka atu fila fali', charting: 'Dalan ida-ne\'e sei hola planu…', riceLead: 'Foos mak liña ida ne\'ebe kesi rejiaun tomak — maibe nasaun ida-idak halo nia rasik.', regionLead: 'Hili nasaun ida atu loke nia rejiaun importante — toka karta atu haree besik.' },
  ja: { specialtiesTitle: '専門観光', cat_transport: '移動', cat_food: '食事', cat_attraction: '観光', cat_accommodation: '宿泊', cat_other: 'その他', watchFilm: '紹介映像を見る', travelYear: '矢印で一年をめぐる', flipBack: 'タップで戻す', charting: 'この旅程はまだ計画中です…', riceLead: '米は地域全体を結ぶ一本の糸 — けれど、どの国も米を独自のものにしている。', regionLead: '国を選ぶと代表的な地域が広がります — カードをタップして近くで見てみましょう。' },
  zh: { specialtiesTitle: '特色旅游', cat_transport: '交通', cat_food: '美食', cat_attraction: '景点', cat_accommodation: '住宿', cat_other: '其他', watchFilm: '观看介绍影片', travelYear: '用箭头浏览全年', flipBack: '点按翻回', charting: '这段旅程仍在规划中…', riceLead: '稻米是串联整个地区的一根线——但每个国家都让它成为自己的独特之处。', regionLead: '选择一个国家，展开它最具代表性的地区——点按任意卡片细看。' },
}

// Schedule-section chrome, per language. Kept in its own table so it can be
// added without touching the existing (non-ASCII) translation rows.
const TRANSLATIONS_SCHED: Record<string, Dict> = {
  en: { schedule: 'Schedule', today: 'today', free: 'Free' },
  vi: { schedule: 'Lịch trình', today: 'hôm nay', free: 'Miễn phí' },
  lo: { schedule: 'ຕາຕະລາງ', today: 'ມື້ນີ້', free: 'ຟຣີ' },
  km: { schedule: 'កាលវិភាគ', today: 'ថ្ងៃនេះ', free: 'ឥតគិតថ្លៃ' },
  th: { schedule: 'ตารางเวลา', today: 'วันนี้', free: 'ฟรี' },
  my: { schedule: 'အချိန်ဇယား', today: 'ဒီနေ့', free: 'အခမဲ့' },
  ms: { schedule: 'Jadual', today: 'hari ini', free: 'Percuma' },
  id: { schedule: 'Jadwal', today: 'hari ini', free: 'Gratis' },
  fil: { schedule: 'Iskedyul', today: 'ngayon', free: 'Libre' },
  tet: { schedule: 'Oráriu', today: 'ohin', free: 'Gratis' },
  ja: { schedule: 'スケジュール', today: '本日', free: '無料' },
  zh: { schedule: '行程安排', today: '今日', free: '免费' },
}

const tr = (lang: string, key: string) => {
  const b = baseLang(lang)
  return (
    TRANSLATIONS_EXTRA[b]?.[key] ??
    TRANSLATIONS_SCHED[b]?.[key] ??
    TRANSLATIONS[b]?.[key] ??
    TRANSLATIONS_SCHED.en[key] ??
    TRANSLATIONS.en[key] ??
    key
  )
}

// Localized "Day N" label — word order varies by language.
const dayLabel = (lang: string, n: number) => {
  switch (baseLang(lang)) {
    case 'vi':
      return `Ngày ${n}`
    case 'lo':
      return `ມື້ທີ ${n}`
    case 'km':
      return `ថ្ងៃទី ${n}`
    case 'th':
      return `วันที่ ${n}`
    case 'my':
      return `${n} ရက်မြောက်နေ့`
    case 'ms':
    case 'id':
      return `Hari ${n}`
    case 'fil':
      return `Araw ${n}`
    case 'tet':
      return `Loron ${n}`
    case 'ja':
      return `${n}日目`
    case 'zh':
      return `第${n}天`
    default:
      return `Day ${n}`
  }
}

// Localized month names, derived per-language via Intl (falls back to English).
const MONTH_LOCALE: Record<string, string> = { en: 'en', vi: 'vi', lo: 'lo', km: 'km', th: 'th', my: 'my', ms: 'ms', id: 'id', fil: 'fil', tet: 'pt', ja: 'ja', zh: 'zh' }
const monthLabel = (lang: string, month: number) => {
  try {
    return new Intl.DateTimeFormat(MONTH_LOCALE[baseLang(lang)] ?? 'en', { month: 'long' }).format(new Date(2021, month - 1, 1))
  } catch {
    return MONTH_NAMES[month - 1]
  }
}

// Per-country localization of the Specialty Tourism cards, keyed by country id
// then by the card's English title. Each country is translated into its own
// native language (the one the UI auto-switches to on arrival).
interface LocCard { title: string; tag: string; blurb: string }
const SPECIALTY_I18N: Record<string, Record<string, LocCard>> = {
  japan: {
    'Fushimi Inari': { title: '伏見稲荷', tag: '名所', blurb: '神聖な山を登る一万の朱色の鳥居。' },
    'Mount Fuji': { title: '富士山', tag: '自然の驚異', blurb: '五湖に映る日本の霊峰。' },
    'teamLab Digital Art': { title: 'チームラボ', tag: 'モダン', blurb: '東京の光と水の没入空間。' },
    'Shirakawa-go': { title: '白川郷', tag: '世界遺産', blurb: '山あいの合掌造りの茅葺き集落。' },
    'Miyajima Torii': { title: '宮島の鳥居', tag: '名所', blurb: '満ち潮に浮かぶ大鳥居。' },
    'Osaka Street Food': { title: '大阪の食べ歩き', tag: 'グルメ', blurb: '道頓堀のたこ焼きとネオン。' },
  },
  vietnam: {
    'Ha Long Bay': { title: 'Vịnh Hạ Long', tag: 'UNESCO', blurb: 'Hai nghìn đảo đá vôi nhô lên từ làn nước ngọc bích.' },
    'Hoi An Lanterns': { title: 'Đèn lồng Hội An', tag: 'Biểu tượng', blurb: 'Phố cảng tơ lụa rực rỡ đèn lồng giấy.' },
    'Sapa Terraces': { title: 'Ruộng bậc thang Sapa', tag: 'Vùng cao', blurb: 'Những bậc thang xanh ngọc do các bản làng canh tác.' },
    'Golden Bridge': { title: 'Cầu Vàng', tag: 'Hiện đại', blurb: 'Lối đi được nâng bởi hai bàn tay đá khổng lồ.' },
    'Street Food': { title: 'Ẩm thực đường phố', tag: 'Ẩm thực', blurb: 'Phở, bánh mì và cà phê trứng khắp các góc phố.' },
    'Mekong Delta': { title: 'Đồng bằng sông Cửu Long', tag: 'Đời sông nước', blurb: 'Chợ nổi ở vựa lúa miền Nam.' },
  },
  china: {
    'The Great Wall': { title: '长城', tag: '奇观', blurb: '绵延群山的烽火楼台。' },
    'Forbidden City': { title: '紫禁城', tag: '皇家', blurb: '朱红宫墙内的九千间殿宇。' },
    'Terracotta Army': { title: '兵马俑', tag: '世界遗产', blurb: '帝王的陶土军团，面容各异。' },
    'Zhangjiajie': { title: '张家界', tag: '自然奇观', blurb: '启发《阿凡达》的砂岩石柱。' },
    'Li River': { title: '漓江', tag: '风景', blurb: '烟雨中的喀斯特峰林与渔夫。' },
    'Giant Pandas': { title: '大熊猫', tag: '野生动物', blurb: '成都啃竹的国宝。' },
  },
  thailand: {
    'Wat Arun': { title: 'วัดอรุณ', tag: 'สัญลักษณ์', blurb: 'วัดแห่งรุ่งอรุณริมแม่น้ำเจ้าพระยา' },
    'Phi Phi Islands': { title: 'หมู่เกาะพีพี', tag: 'เกาะ', blurb: 'เรือหางยาวและหน้าผาหินปูนในทะเลอันดามัน' },
    'Floating Markets': { title: 'ตลาดน้ำ', tag: 'วัฒนธรรม', blurb: 'เรือสำปั้นเต็มไปด้วยผลไม้ในคลอง' },
    'Chiang Mai Temples': { title: 'วัดเชียงใหม่', tag: 'มรดก', blurb: 'ยอดเจดีย์ล้านนาและวัดบนภูเขา' },
    'Andaman Beaches': { title: 'หาดอันดามัน', tag: 'ชายหาด', blurb: 'ทะเลสีครามและทรายขาวละเอียด' },
    'Street Food': { title: 'อาหารริมทาง', tag: 'อาหาร', blurb: 'ผัดไทย ส้มตำ และข้าวเหนียวมะม่วง' },
  },
  cambodia: {
    'Angkor Wat': { title: 'អង្គរវត្ត', tag: 'អច្ឆរិយៈ', blurb: 'ប្រាសាទសាសនាធំបំផុតលើផែនដីនៅពេលព្រឹកព្រលឹម។' },
    'The Bayon': { title: 'ប្រាសាទបាយ័ន', tag: 'បេតិកភណ្ឌ', blurb: 'មុខថ្មដ៏ស្ងប់ស្ងាត់ពីររយ។' },
    'Ta Prohm': { title: 'តាព្រហ្ម', tag: 'និមិត្តសញ្ញា', blurb: 'ប្រាសាទដែលឫសព្រៃធំៗ ព័ទ្ធជុំវិញ។' },
    'Tonlé Sap': { title: 'បឹងទន្លេសាប', tag: 'ជីវិតទន្លេ', blurb: 'ភូមិអណ្ដែតលើបឹងធំនៃអាស៊ីអាគ្នេយ៍។' },
    'Banteay Srei': { title: 'បន្ទាយស្រី', tag: 'បេតិកភណ្ឌ', blurb: 'ថ្មភក់ពណ៌ផ្កាឈូកឆ្លាក់យ៉ាងល្អិតល្អន់។' },
    'Khmer Cuisine': { title: 'មុខម្ហូបខ្មែរ', tag: 'អាហារ', blurb: 'អាម៉ុកត្រី និងក្ដាមម្រេចកំពត។' },
  },
  laos: {
    'Kuang Si Falls': { title: 'ນ້ຳຕົກຕາດກວາງຊີ', tag: 'ມະຫັດສະຈັນທຳມະຊາດ', blurb: 'ສະນ້ຳສີຄາມເປັນຊັ້ນໃນປ່າ.' },
    'Alms Giving': { title: 'ຕັກບາດ', tag: 'ວັດທະນະທຳ', blurb: 'ແຖວພະສົງສີເຫຼືອງຍາມເຊົ້າໃນຫຼວງພະບາງ.' },
    'The Mekong': { title: 'ແມ່ນ້ຳຂອງ', tag: 'ຊີວິດແມ່ນ້ຳ', blurb: 'ເຮືອຊ້າໆເທິງແມ່ນ້ຳໃຫຍ່.' },
    'Wat Xieng Thong': { title: 'ວັດຊຽງທອງ', tag: 'ມໍລະດົກ', blurb: 'ວັດທີ່ງາມທີ່ສຸດໃນລາວ.' },
    'Pak Ou Caves': { title: 'ຖ້ຳປາກອູ', tag: 'ມໍລະດົກໂລກ', blurb: 'ໜ້າຜາແມ່ນ້ຳເຕັມໄປດ້ວຍພະພຸດທະຮູບ.' },
    'Mount Phousi': { title: 'ພູສີ', tag: 'ທິວທັດ', blurb: 'ຕາເວັນຕົກເໜືອຈຸດບັນຈົບສອງແມ່ນ້ຳ.' },
  },
  indonesia: {
    'Rice Terraces': { title: 'Terasering Sawah', tag: 'Ikon', blurb: 'Tangga sawah subak hijau zamrud di Tegalalang.' },
    'Uluwatu Temple': { title: 'Pura Uluwatu', tag: 'Warisan', blurb: 'Pura di tebing laut dan tari Kecak bercahaya api.' },
    'Nusa Penida': { title: 'Nusa Penida', tag: 'Pantai', blurb: 'Tebing T-Rex di atas teluk putih tersembunyi.' },
    'Mount Batur': { title: 'Gunung Batur', tag: 'Petualangan', blurb: 'Pendakian matahari terbit ke gunung berapi aktif.' },
    'Ubud Culture': { title: 'Budaya Ubud', tag: 'Budaya', blurb: 'Hutan monyet, pura, dan tari Legong.' },
    'Balinese Cuisine': { title: 'Masakan Bali', tag: 'Kuliner', blurb: 'Babi guling dan sambal matah.' },
  },
  singapore: {
    'Gardens by the Bay': { title: 'Gardens by the Bay', tag: 'Ikon', blurb: 'Hutan Supertree dan kubah Cloud Forest.' },
    'Marina Bay Sands': { title: 'Marina Bay Sands', tag: 'Moden', blurb: 'SkyPark berbentuk kapal di atas kaki langit.' },
    'Hawker Centres': { title: 'Pusat Penjaja', tag: 'Kuliner', blurb: 'Nasi ayam Michelin, laksa, dan ketam cili.' },
    'Chinatown': { title: 'Chinatown', tag: 'Budaya', blurb: 'Kuil, tanglung merah, dan rumah kedai lama.' },
    'Sentosa Island': { title: 'Pulau Sentosa', tag: 'Pantai', blurb: 'Pantai, kereta kabel, dan akuarium luas.' },
    'Skyline by Night': { title: 'Kaki Langit Malam', tag: 'Ikon', blurb: 'Pertunjukan cahaya Spectra menyeberangi teluk.' },
  },
  philippines: {
    'El Nido Lagoons': { title: 'Mga Lagoon ng El Nido', tag: 'Ikon', blurb: 'Tubig na hade na napapaligiran ng matatarik na apog.' },
    'Bacuit Bay': { title: 'Bacuit Bay', tag: 'Isla', blurb: 'Island-hopping sakay ng bangka.' },
    'Coron Wrecks': { title: 'Mga Barkong Lubog sa Coron', tag: 'Pakikipagsapalaran', blurb: 'Mga barkong WWII sa malinaw na mababaw na tubig.' },
    'Kayangan Lake': { title: 'Lawa ng Kayangan', tag: 'Likas na Kababalaghan', blurb: 'Ang pinakamalinis na lawa sa Pilipinas.' },
    'Hidden Beaches': { title: 'Mga Tagong Baybayin', tag: 'Baybayin', blurb: 'Mga liblib na look na marating lamang sa bangka.' },
    'Filipino Feasts': { title: 'Handaang Pilipino', tag: 'Pagkain', blurb: 'Kinilaw, sinigang, at inihaw na pagkaing-dagat.' },
  },
  malaysia: {
    'Petronas Towers': { title: 'Menara Petronas', tag: 'Ikon', blurb: 'Menara kembar perak yang menjadi lambang KL.' },
    'Batu Caves': { title: 'Batu Caves', tag: 'Warisan', blurb: 'Dewa keemasan dan 272 tangga pelangi.' },
    'George Town': { title: 'George Town', tag: 'UNESCO', blurb: 'Seni jalanan dan jeti warisan di Pulau Pinang.' },
    'Penang Food': { title: 'Makanan Pulau Pinang', tag: 'Kuliner', blurb: 'Char kway teow dan asam laksa terbaik.' },
    'KL Skyline': { title: 'Kaki Langit KL', tag: 'Moden', blurb: 'Bar bumbung di antara pencakar langit.' },
    'Penang Hill': { title: 'Bukit Bendera', tag: 'Pemandangan', blurb: 'Funikular ke puncak hijau yang nyaman.' },
  },
}

// The localized card for the current country+language, or null to use English.
const localizedCard = (countryId: string, lang: string, title: string): LocCard | null => {
  return SPECIALTY_I18N[countryId]?.[title] ?? null
}

const LangContext = createContext<string>('en')
const useT = () => {
  const lang = useContext(LangContext)
  return (key: string) => tr(lang, key)
}

function LanguageSelector({ value, onChange }: { value: string; onChange: (code: string) => void }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = LANGUAGES.find((l) => l.code === value) ?? LANGUAGES[0]

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('selectLanguage')}
        className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1.5 font-mono text-xs text-[var(--color-foreground)] transition-colors hover:border-[var(--color-primary)]"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <span className={`text-[10px] transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Languages"
          className="film-rise absolute right-0 z-50 mt-2 max-h-80 w-56 overflow-y-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-1.5 shadow-xl"
        >
          {LANGUAGES.map((l) => {
            const active = l.code === value
            return (
              <li key={l.code} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(l.code)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors ${
                    active
                      ? 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]'
                      : 'text-[var(--color-foreground)] hover:bg-[var(--color-muted)]'
                  }`}
                >
                  <span className="text-lg leading-none">{l.flag}</span>
                  <span className="flex-1">
                    <span className="block font-mono text-xs leading-tight">{l.label}</span>
                    <span className={`block text-sm leading-tight ${active ? 'opacity-90' : 'text-[var(--color-muted-foreground)]'}`}>
                      {l.native}
                    </span>
                  </span>
                  {active && <span className="text-xs">✓</span>}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState(() => (isSupported(getLocale()) ? getLocale() : 'en'))
  const [countryId, setCountryId] = useState(COUNTRIES[0].id)
  const [activeDay, setActiveDay] = useState(0)
  const [daysExpanded, setDaysExpanded] = useState(false)
  const [showFilm, setShowFilm] = useState(false)
  const [night, setNight] = useState(false)

  const country = COUNTRIES.find((c) => c.id === countryId) ?? COUNTRIES[0]
  const theme = COUNTRY_BACKGROUNDS[countryId] ?? FALLBACK_BACKGROUND
  const itinerary = country.itinerary ?? []
  const grandTotal = itinerary.flatMap((d) => d.activities).reduce((s, a) => s + a.cost, 0)

  const startExperience = () => {
    setLoading(false)
  }

  const t = (key: string) => tr(lang, key)

  // Bridge the journal's language to the centralized i18n store so the global
  // switcher, footer, and detection modal stay in lockstep with the journal.
  // Unsupported journal-only languages (ja/zh/tet) are ignored by the store.
  const changeLang = (code: string) => {
    setLang(code)
    setLocale(code)
  }
  const storeCode = useLocale().code
  useEffect(() => {
    if (isSupported(storeCode) && storeCode !== lang) setLang(storeCode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeCode])

  // Lock page scroll while the loading screen is up, so the tall page behind
  // the fixed overlay can't show a stray scrollbar or drift on its own.
  useEffect(() => {
    if (!loading) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [loading])

  const selectCountry = (id: string) => {
    if (id === countryId) return
    setCountryId(id)
    // Arriving in a country switches the interface into that country's language.
    changeLang(COUNTRY_LANG[id] ?? 'en')
    setActiveDay(0)
    setShowFilm(false)
    // Scroll the traveler up to the top of the newly-arrived country.
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 60)
  }

  return (
    <CountryThemeContext.Provider value={theme}>
    <LangContext.Provider value={lang}>
    <div
      data-theme={night ? 'night' : 'day'}
      data-country={countryId}
      className="relative min-h-screen"
      style={{ ['--color-primary' as string]: theme.accent, ['--color-accent' as string]: theme.accent2, ['--color-ring' as string]: theme.accent }}
    >
      <CountryBackdrop />
      <TimeOfDayBackdrop night={night} />

      {loading && <LoadingScreen onDone={startExperience} montage={COUNTRIES.map((c) => c.film[0])} />}
      {showFilm && <FilmModal country={country} onClose={() => setShowFilm(false)} />}

      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-card)] sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-mono text-xs text-[var(--color-muted-foreground)] tracking-widest uppercase">{t('grandTour')}</div>
              <h1 className="font-carve text-xl leading-tight">{t('appTitle')}</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden text-right sm:block">
                <div className="font-mono text-xs text-[var(--color-muted-foreground)]">{country.name}</div>
                <div className="font-mono text-sm font-500 text-[var(--color-primary)]">
                  {formatMoney(grandTotal, country)} · ≈ ${toUsd(grandTotal, country).toLocaleString('en-US')}
                </div>
              </div>
              <LanguageSelector value={lang} onChange={changeLang} />
              <button
                type="button"
                onClick={() => setNight((n) => !n)}
                aria-label={night ? 'Switch to daylight' : 'Enter the night market'}
                title={night ? 'Daylight' : 'Night market'}
                className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full border border-[var(--color-border)] text-base transition-colors hover:bg-[var(--color-muted)]"
              >
                {night ? '🏮' : '🌙'}
              </button>
            </div>
          </div>
          <CountryTabs countries={COUNTRIES} activeId={countryId} onSelect={selectCountry} />
        </div>
      </header>

      <main
        className="relative z-10 max-w-6xl mx-auto px-4 py-6 rounded-lg"
        style={{ background: 'color-mix(in srgb, var(--color-background) 82%, transparent)', backdropFilter: 'blur(2px)' }}
      >
        {/* Everything below turns like a passport page when the country changes */}
        <div key={country.id} className="passport-flip relative">
          {/* Spine shadow sweeping across the turning page */}
          <div className="passport-spine pointer-events-none absolute inset-y-0 left-0 z-20 w-24 bg-gradient-to-r from-black/40 to-transparent" />
          {/* Light catching the glossy page as it turns */}
          <div className="passport-sheen pointer-events-none absolute inset-0 z-20 w-1/3" />

          {/* Cinematic intro film */}
          <IntroFilm country={country} onOpen={() => setShowFilm(true)} />

          {/* Live local time */}
          <LocalTime country={country} />

          {/* Specialties & heritage flip cards */}
          <Highlights country={country} />

          {/* Budget bar */}
          <BudgetBar country={country} />

          {/* Day nav + detail */}
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            {/* Day selector */}
            <aside>
              <div className="font-mono text-xs text-[var(--color-muted-foreground)] tracking-widest uppercase mb-3">
                {country.name} · {t('itinerary')}
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {itinerary.slice(0, 8).map((day, i) => (
                  <DayCard
                    key={day.day}
                    day={day}
                    country={country}
                    isActive={i === activeDay}
                    onClick={() => setActiveDay(i)}
                  />
                ))}
              </div>

              {/* Days 9–30 tucked into a collapsible section */}
              {itinerary.length > 8 && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setDaysExpanded((v) => !v)}
                    aria-expanded={daysExpanded}
                    className="flex w-full items-center justify-between border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2.5 font-mono text-xs uppercase tracking-widest text-[var(--color-muted-foreground)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-foreground)]"
                  >
                    <span>Days 9–{itinerary.length}</span>
                    <span
                      className={`transition-transform duration-300 ${daysExpanded ? 'rotate-180' : 'rotate-0'}`}
                      aria-hidden="true"
                    >
                      ▾
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      daysExpanded ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                        {itinerary.slice(8).map((day, i) => (
                          <DayCard
                            key={day.day}
                            day={day}
                            country={country}
                            isActive={i + 8 === activeDay}
                            onClick={() => setActiveDay(i + 8)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </aside>

            {/* Day detail */}
            <section>
              {itinerary[activeDay] ? (
                <DayDetail day={itinerary[activeDay]} country={country} />
              ) : (
                <div className="border border-[var(--color-border)] bg-[var(--color-card)]">
                  <SandClock label={t('charting')} />
                </div>
              )}
            </section>
          </div>
        </div>

        {/* ── Discover Southeast Asia — Journeys & Flavors From Every Corner ── */}
        <ScrollReveal>
          <DiscoverSoutheastAsiaSection onExploreDestinations={() => window.scrollTo({ top: 400, behavior: 'smooth' })} />
        </ScrollReveal>

        {/* ── Regional storytelling (shared across the whole tour) ── */}
        <ScrollStory
          eyebrow={t('riceEyebrow')}
          title={t('riceTitle')}
          lead={t('riceLead')}
          chapters={RICE_JOURNEY}
        />

        <RegionExplorer currentCountryId={countryId} />

        <FestivalCalendar />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--color-border)] mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="font-mono text-xs text-[var(--color-muted-foreground)]">
            Prices in {country.currencyCode} ({country.currencySymbol}). Rate ≈ {country.currencySymbol}{country.fxPerUsd.toLocaleString('en-US')}/USD.
          </span>
          <span className="font-display text-sm italic text-[var(--color-muted-foreground)]">
            {country.motto}
          </span>
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest px-5 py-2.5 border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors duration-150 cursor-pointer"
            aria-label="Back to top"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M5 8V2M2 5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to top
          </button>
        </div>
      </footer>

      {/* Premium glassmorphism mega-footer — Information + Terms & Policies */}
      <SiteFooter />

      {/* Auto language detection & switching (first visit only) */}
      {!loading && <LanguageDetectModal onSwitch={changeLang} />}
    </div>
    </LangContext.Provider>
    </CountryThemeContext.Provider>
  )
}
