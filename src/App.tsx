// The Asia Grand Tour — multi-country travel journal
import { useEffect, useState } from 'react'
import LoadingScreen from './LoadingScreen'
import { startMusic, setMuted as setMusicMuted } from './ambientMusic'

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
    day: 10,
    date: 'Oct 12',
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
    day: 6, date: 'Jan 10', city: 'Phi Phi — Farewell',
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
    day: 4, date: 'Feb 5', city: 'Tonlé Sap — Floating Villages',
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
    day: 3, date: 'Feb 10', city: 'Pak Ou & Farewell',
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
    day: 4, date: 'Mar 7', city: 'Nusa Penida — Farewell',
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
    day: 3, date: 'Mar 12', city: 'Sentosa & Farewell',
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
    day: 4, date: 'Apr 9', city: 'Coron — Farewell',
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
    day: 4, date: 'Apr 15', city: 'Penang — Farewell',
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
          <button
            type="button"
            onClick={onOpen}
            className="group flex items-center gap-2.5 rounded-full bg-white/95 px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-[var(--color-foreground)] transition-transform duration-200 hover:scale-[1.04] active:scale-95"
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--color-primary)] text-white">
              <span className="ml-0.5 text-[9px]">▶</span>
            </span>
            Watch the intro film
          </button>
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
  const [flipped, setFlipped] = useState(false)
  const story = STORIES[`${country.id}:${h.title}`] ?? h.blurb

  return (
    <div className="flip aspect-[4/3]">
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label={`${h.title} — tap to flip`}
        className={`flip-inner block w-full text-left focus:outline-none ${flipped ? 'is-flipped' : ''}`}
        style={{ height: '100%' }}
      >
        {/* Front — image + name */}
        <span className="flip-face group block border border-[var(--color-border)] bg-[var(--color-muted)]">
          <img src={h.image} alt={h.alt} className="h-full w-full object-cover" />
          <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <span className="absolute left-2 top-2 rounded-sm bg-[var(--color-primary)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--color-primary-foreground)]">
            {h.tag}
          </span>
          <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-white/20 text-[11px] text-white backdrop-blur-sm">
            ↻
          </span>
          <span className="absolute bottom-0 left-0 right-0 p-3">
            <span className="block font-display text-base font-600 leading-tight text-white">{h.title}</span>
            <span className="mt-0.5 block font-body text-xs leading-snug text-white/80">{h.blurb}</span>
          </span>
        </span>

        {/* Back — the short story */}
        <span
          className="flip-face flip-back flex flex-col justify-between border p-4"
          style={{ background: country.accent, borderColor: country.accent }}
        >
          <span>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/70">{h.tag} · story</span>
            <span className="mt-1.5 block font-display text-sm font-600 leading-tight text-white">{h.title}</span>
          </span>
          <span className="block font-body text-[13px] leading-relaxed text-white/90">{story}</span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-white/60">↻ tap to flip back</span>
        </span>
      </button>
    </div>
  )
}

function Highlights({ country }: { country: Country }) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="font-display text-2xl font-600 tracking-tight">Specialties &amp; Heritage</h2>
        <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted-foreground)]">
          Tap a card for its story
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
    <section className="mb-8 flex flex-col gap-4 border border-[var(--color-border)] bg-[var(--color-card)] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="text-2xl leading-none">{country.flag}</span>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted-foreground)]">
            Local time in {country.name}
          </div>
          <div className="font-display text-lg font-600 leading-tight">
            {weekday}
          </div>
          <div className="font-body text-sm text-[var(--color-muted-foreground)]">
            {day} {month} {year}
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

// ─── Stylized Southeast Asia region map ───────────────────────────────────

function RegionMap({
  countries,
  activeId,
  onSelect,
}: {
  countries: Country[]
  activeId: string
  onSelect: (id: string) => void
}) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="font-display text-2xl font-600 tracking-tight">Choose Your Destination</h2>
        <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted-foreground)]">
          Hover to preview · click to fly
        </span>
      </div>

      <div
        className="relative w-full overflow-hidden rounded-lg border border-[var(--color-border)]"
        style={{
          aspectRatio: '16 / 9',
          background:
            'radial-gradient(120% 100% at 30% 10%, #1b3a4b 0%, #14232e 55%, #0d181f 100%)',
        }}
      >
        {/* Decorative "sea" grid + latitude lines */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'linear-gradient(#7fd7c4 1px, transparent 1px), linear-gradient(90deg, #7fd7c4 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-white/10" />

        {/* Flight paths from the active country to hovered */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          {countries.map((c) => {
            const from = COUNTRY_META[activeId]?.map
            const to = COUNTRY_META[c.id]?.map
            if (!from || !to || c.id === activeId) return null
            const dim = hovered && hovered !== c.id
            return (
              <line
                key={c.id}
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                stroke="white"
                strokeWidth={hovered === c.id ? 1.5 : 0.6}
                strokeDasharray="3 5"
                opacity={hovered === c.id ? 0.55 : dim ? 0.05 : 0.14}
              />
            )
          })}
        </svg>

        {/* Country pins */}
        {countries.map((c) => {
          const meta = COUNTRY_META[c.id]
          if (!meta) return null
          const active = c.id === activeId
          const isHover = hovered === c.id
          return (
            <div
              key={c.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${meta.map.x}%`, top: `${meta.map.y}%`, zIndex: isHover ? 30 : active ? 20 : 10 }}
              onMouseEnter={() => setHovered(c.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                aria-label={`Fly to ${c.name}`}
                className="group relative grid place-items-center focus:outline-none"
              >
                {/* Ping ring for the active country */}
                {active && (
                  <span
                    className="map-ping absolute h-6 w-6 rounded-full"
                    style={{ background: c.accent }}
                  />
                )}
                {/* Pin dot */}
                <span
                  className={`relative flex items-center gap-1 rounded-full border px-2 py-1 backdrop-blur-sm transition-all duration-200 ${
                    isHover || active ? 'scale-110' : 'scale-100'
                  }`}
                  style={{
                    background: active ? c.accent : 'rgba(255,255,255,0.1)',
                    borderColor: active ? c.accent : 'rgba(255,255,255,0.35)',
                  }}
                >
                  <span className="text-sm leading-none">{c.flag}</span>
                  <span className="font-mono text-[10px] font-500 text-white">{c.name}</span>
                </span>
              </button>

              {/* Specialty popover on hover */}
              {isHover && (
                <div className="tick-in absolute left-1/2 top-full z-40 mt-2 w-44 -translate-x-1/2 rounded-lg border border-white/15 bg-black/85 p-3 shadow-xl backdrop-blur-md">
                  <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.25em] text-white/60">
                    {c.tagline}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {meta.specialties.map((s) => (
                      <div key={s.label} className="flex items-center gap-1.5">
                        <span className="text-base leading-none">{s.icon}</span>
                        <span className="font-body text-[11px] leading-tight text-white/85">{s.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 border-t border-white/10 pt-1.5 text-center font-mono text-[9px] uppercase tracking-widest text-white/50">
                    Click to fly →
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* Corner label */}
        <div className="pointer-events-none absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
          Asia · The Grand Tour
        </div>
      </div>
    </section>
  )
}

function BudgetBar({ country }: { country: Country }) {
  const allActivities = (country.itinerary ?? []).flatMap((d) => d.activities)
  const total = allActivities.reduce((sum, a) => sum + a.cost, 0)

  const byCategory = (Object.keys(CATEGORY_LABELS) as Activity['category'][]).map((cat) => {
    const sum = allActivities.filter((a) => a.category === cat).reduce((s, a) => s + a.cost, 0)
    return { cat, sum, pct: total > 0 ? (sum / total) * 100 : 0 }
  })

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-6 mb-8">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-display text-2xl font-600 tracking-tight">Budget Summary</h2>
        <div className="text-right">
          <div className="font-mono text-3xl font-500 text-[var(--color-primary)]">{formatMoney(total, country)}</div>
          <div className="font-mono text-sm text-[var(--color-muted-foreground)]">≈ ${toUsd(total, country).toLocaleString('en-US')} USD</div>
        </div>
      </div>

      {/* Stacked bar */}
      <div className="h-3 flex rounded-none overflow-hidden mb-5">
        {byCategory.filter((b) => b.sum > 0).map(({ cat, pct }) => (
          <div
            key={cat}
            style={{ width: `${pct}%`, backgroundColor: CATEGORY_COLORS[cat] }}
            title={`${CATEGORY_LABELS[cat]}: ${Math.round(pct)}%`}
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
              <div className="font-body text-xs text-[var(--color-muted-foreground)]">{CATEGORY_LABELS[cat]}</div>
              <div className="font-mono text-sm font-500">{formatMoney(sum, country)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DayCard({ day, country, isActive, onClick }: { day: Day; country: Country; isActive: boolean; onClick: () => void }) {
  const dayTotal = day.activities.reduce((s, a) => s + a.cost, 0)

  return (
    <button
      onClick={onClick}
      className={`w-full text-left border transition-all duration-200 ${
        isActive
          ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)]'
          : 'border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-primary)] hover:bg-[var(--color-muted)]'
      }`}
    >
      <div className="p-3">
        <div className={`font-mono text-xs mb-0.5 ${isActive ? 'opacity-70' : 'text-[var(--color-muted-foreground)]'}`}>
          Day {day.day} · {day.date}
        </div>
        <div className={`font-display text-sm font-600 leading-tight ${isActive ? '' : 'text-[var(--color-foreground)]'}`}>
          {day.city.split(' — ')[0]}
        </div>
        <div className={`font-mono text-xs mt-1 ${isActive ? 'opacity-80' : 'text-[var(--color-muted-foreground)]'}`}>
          {formatMoney(dayTotal, country)}
        </div>
      </div>
    </button>
  )
}

function ActivityRow({ activity, country }: { activity: Activity; country: Country }) {
  return (
    <div className="flex gap-4 py-4 border-b border-[var(--color-border)] last:border-0 group">
      <div className="w-14 flex-shrink-0">
        <span className="font-mono text-xs text-[var(--color-muted-foreground)]">{activity.time}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <span
            className="mt-0.5 font-mono text-[10px] px-1.5 py-0.5 rounded-sm flex-shrink-0"
            style={{
              backgroundColor: CATEGORY_COLORS[activity.category] + '20',
              color: CATEGORY_COLORS[activity.category],
            }}
          >
            {CATEGORY_LABELS[activity.category].toUpperCase()}
          </span>
          <h3 className="font-display text-base font-600 leading-snug">{activity.title}</h3>
        </div>
        <p className="font-body text-sm text-[var(--color-muted-foreground)] leading-relaxed">{activity.description}</p>
      </div>
      <div className="flex-shrink-0 text-right">
        {activity.cost > 0 ? (
          <span className="font-mono text-sm font-500">{formatMoney(activity.cost, country)}</span>
        ) : (
          <span className="font-mono text-sm text-[var(--color-muted-foreground)]">Free</span>
        )}
      </div>
    </div>
  )
}

function DayDetail({ day, country }: { day: Day; country: Country }) {
  const dayTotal = day.activities.reduce((s, a) => s + a.cost, 0)

  return (
    <div>
      {/* Hero */}
      <div className="relative h-52 overflow-hidden bg-[var(--color-muted)] mb-6">
        <img
          src={day.coverImage}
          alt={day.coverAlt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="font-mono text-xs text-white/70 mb-1">Day {day.day} · {day.date}</div>
          <h2 className="font-display text-2xl font-600 text-white leading-tight">{day.city}</h2>
          <div className="font-mono text-xs text-white/80 mt-2">
            <span className="mr-1">→</span>{day.transport}
          </div>
        </div>
      </div>

      {/* Activities */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-5 mb-4">
        <div className="mb-2 pb-3 border-b border-[var(--color-border)] flex items-center justify-between">
          <span className="font-display text-base font-600">Schedule</span>
          <span className="font-mono text-sm font-500 text-[var(--color-primary)]">{formatMoney(dayTotal, country)} today</span>
        </div>
        {day.activities.map((activity, i) => (
          <ActivityRow key={i} activity={activity} country={country} />
        ))}
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

export default function App() {
  const [loading, setLoading] = useState(true)
  const [countryId, setCountryId] = useState(COUNTRIES[0].id)
  const [activeDay, setActiveDay] = useState(0)
  const [showFilm, setShowFilm] = useState(false)
  const [muted, setMuted] = useState(false)
  const [sweep, setSweep] = useState<{ id: string; x: number; y: number } | null>(null)

  const country = COUNTRIES.find((c) => c.id === countryId) ?? COUNTRIES[0]
  const itinerary = country.itinerary ?? []
  const grandTotal = itinerary.flatMap((d) => d.activities).reduce((s, a) => s + a.cost, 0)

  const startExperience = () => {
    setLoading(false)
    startMusic()
  }

  const toggleMute = () => {
    const next = !muted
    setMuted(next)
    setMusicMuted(next)
  }

  const selectCountry = (id: string) => {
    if (id === countryId) return
    const map = COUNTRY_META[id]?.map
    if (map) setSweep({ id, x: map.x, y: map.y })
    setCountryId(id)
    setActiveDay(0)
    setShowFilm(false)
    // Scroll the traveler up to the top of the newly-arrived country.
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 60)
  }

  return (
    <div
      className="min-h-screen bg-[var(--color-background)]"
      style={{ ['--color-primary' as string]: country.accent, ['--color-accent' as string]: country.accent, ['--color-ring' as string]: country.accent }}
    >
      {/* ========== BACKGROUND VIDEO & YOUTUBE LOFI ========== */}
      <video
        id="bg-video"
        className="bg-video"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.45,
        }}
      >
        <source src="./data/background/chillnight.mp4" type="video/mp4" />
      </video>

      <div
        id="bg-yt-container"
        className="bg-video"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          pointerEvents: 'none',
          overflow: 'hidden',
          opacity: 0.35,
        }}
      >
        <iframe
          id="bg-yt-player"
          src="https://www.youtube.com/embed/zvIS6EIkXx8?enablejsapi=1&autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&disablekb=1&iv_load_policy=3&fs=0"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(1.25)',
            width: '100vw',
            height: '56.25vw',
            minHeight: '100vh',
            minWidth: '177.77vh',
            pointerEvents: 'none',
          }}
        />
      </div>
      {/* ======================================================== */}

      {loading && <LoadingScreen onDone={startExperience} montage={COUNTRIES.map((c) => c.film[0])} />}
      {showFilm && <FilmModal country={country} onClose={() => setShowFilm(false)} />}

      {/* Fly-to-country sweep overlay */}
      {sweep && (
        <div className="pointer-events-none fixed inset-0 z-40" onAnimationEnd={() => setSweep(null)}>
          <div
            className="fly-sweep absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: `${sweep.x}%`,
              top: `${sweep.y}%`,
              background: `radial-gradient(circle, ${country.accent}cc 0%, transparent 70%)`,
            }}
          />
        </div>
      )}

      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-card)] sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-mono text-xs text-[var(--color-muted-foreground)] tracking-widest uppercase">The Grand Tour</div>
              <h1 className="font-display text-xl font-600 leading-tight">
                The Asia <span className="italic font-300">Grand Tour</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-mono text-xs text-[var(--color-muted-foreground)]">{country.name}</div>
                <div className="font-mono text-sm font-500 text-[var(--color-primary)]">
                  {formatMoney(grandTotal, country)} · ≈ ${toUsd(grandTotal, country).toLocaleString('en-US')}
                </div>
              </div>
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? 'Unmute music' : 'Mute music'}
                title={muted ? 'Unmute music' : 'Mute music'}
                className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full border border-[var(--color-border)] text-base transition-colors hover:bg-[var(--color-muted)]"
              >
                {muted ? '🔇' : '🎵'}
              </button>
            </div>
          </div>
          <CountryTabs countries={COUNTRIES} activeId={countryId} onSelect={selectCountry} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Stylized region map — choose a destination */}
        <RegionMap countries={COUNTRIES} activeId={countryId} onSelect={selectCountry} />

        {/* Everything below "flies in" when the country changes */}
        <div key={country.id} className="fly-in">
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
                {country.name} Itinerary
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {itinerary.map((day, i) => (
                  <DayCard
                    key={day.day}
                    day={day}
                    country={country}
                    isActive={i === activeDay}
                    onClick={() => setActiveDay(i)}
                  />
                ))}
              </div>
            </aside>

            {/* Day detail */}
            <section>
              {itinerary[activeDay] && <DayDetail day={itinerary[activeDay]} country={country} />}
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="font-mono text-xs text-[var(--color-muted-foreground)]">
            Prices in {country.currencyCode} ({country.currencySymbol}). Rate ≈ {country.currencySymbol}{country.fxPerUsd.toLocaleString('en-US')}/USD.
          </span>
          <span className="font-display text-sm italic text-[var(--color-muted-foreground)]">
            {country.motto}
          </span>
        </div>
      </footer>
    </div>
  )
}
