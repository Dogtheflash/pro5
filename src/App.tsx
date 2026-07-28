import { useEffect, useState } from 'react'
import LoadingScreen from './LoadingScreen'

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
]

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

// ─── Highlights ─────────────────────────────────────────────────────────

function Highlights({ country }: { country: Country }) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="font-display text-2xl font-600 tracking-tight">Signature Experiences</h2>
        <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted-foreground)]">
          {country.highlights.length} must-sees
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {country.highlights.map((h) => (
          <article
            key={h.title}
            className="group relative overflow-hidden border border-[var(--color-border)] bg-[var(--color-muted)]"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={h.image}
                alt={h.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <span className="absolute left-2 top-2 rounded-sm bg-[var(--color-primary)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--color-primary-foreground)]">
                {h.tag}
              </span>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="font-display text-base font-600 leading-tight text-white">{h.title}</h3>
                <p className="mt-0.5 font-body text-xs leading-snug text-white/80">{h.blurb}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function BudgetBar({ country }: { country: Country }) {
  const allActivities = country.itinerary.flatMap((d) => d.activities)
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
            <span className="font-mono text-[10px] font-400 opacity-60">{c.itinerary.length}d</span>
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

  const country = COUNTRIES.find((c) => c.id === countryId) ?? COUNTRIES[0]
  const grandTotal = country.itinerary.flatMap((d) => d.activities).reduce((s, a) => s + a.cost, 0)
  const dateRange = `${country.itinerary[0].date} – ${country.itinerary[country.itinerary.length - 1].date}`

  const selectCountry = (id: string) => {
    setCountryId(id)
    setActiveDay(0)
    setShowFilm(false)
  }

  return (
    <div
      className="min-h-screen bg-[var(--color-background)]"
      style={{ ['--color-primary' as string]: country.accent, ['--color-accent' as string]: country.accent, ['--color-ring' as string]: country.accent }}
    >
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      {showFilm && <FilmModal country={country} onClose={() => setShowFilm(false)} />}

      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-card)] sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-mono text-xs text-[var(--color-muted-foreground)] tracking-widest uppercase">The Grand Tour</div>
              <h1 className="font-display text-xl font-600 leading-tight">
                Asia <span className="italic font-300">in Three Chapters</span>
              </h1>
            </div>
            <div className="text-right">
              <div className="font-mono text-xs text-[var(--color-muted-foreground)]">
                {country.name} · {dateRange}
              </div>
              <div className="font-mono text-sm font-500 text-[var(--color-primary)]">
                {formatMoney(grandTotal, country)} · ≈ ${toUsd(grandTotal, country).toLocaleString('en-US')}
              </div>
            </div>
          </div>
          <CountryTabs countries={COUNTRIES} activeId={countryId} onSelect={selectCountry} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Cinematic intro film */}
        <IntroFilm country={country} onOpen={() => setShowFilm(true)} />

        {/* Signature experiences */}
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
              {country.itinerary.map((day, i) => (
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
            <DayDetail day={country.itinerary[activeDay]} country={country} />
          </section>
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
