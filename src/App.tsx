import { useState } from 'react'
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

function formatYen(amount: number) {
  return `¥${amount.toLocaleString('en-US')}`
}

function BudgetBar({ days }: { days: Day[] }) {
  const allActivities = days.flatMap((d) => d.activities)
  const total = allActivities.reduce((sum, a) => sum + a.cost, 0)

  const byCategory = (Object.keys(CATEGORY_LABELS) as Activity['category'][]).map((cat) => {
    const sum = allActivities.filter((a) => a.category === cat).reduce((s, a) => s + a.cost, 0)
    return { cat, sum, pct: total > 0 ? (sum / total) * 100 : 0 }
  })

  const usd = Math.round((total / 150) * 100) / 100

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-6 mb-8">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-display text-2xl font-600 tracking-tight">Budget Summary</h2>
        <div className="text-right">
          <div className="font-mono text-3xl font-500 text-[var(--color-primary)]">{formatYen(total)}</div>
          <div className="font-mono text-sm text-[var(--color-muted-foreground)]">≈ ${usd.toLocaleString('en-US')} USD</div>
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
              <div className="font-mono text-sm font-500">{formatYen(sum)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DayCard({ day, isActive, onClick }: { day: Day; isActive: boolean; onClick: () => void }) {
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
          {formatYen(dayTotal)}
        </div>
      </div>
    </button>
  )
}

function ActivityRow({ activity }: { activity: Activity }) {
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
          <span className="font-mono text-sm font-500">{formatYen(activity.cost)}</span>
        ) : (
          <span className="font-mono text-sm text-[var(--color-muted-foreground)]">Free</span>
        )}
      </div>
    </div>
  )
}

function DayDetail({ day }: { day: Day }) {
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
          <span className="font-mono text-sm font-500 text-[var(--color-primary)]">{formatYen(dayTotal)} today</span>
        </div>
        {day.activities.map((activity, i) => (
          <ActivityRow key={i} activity={activity} />
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [activeDay, setActiveDay] = useState(0)
  const [loading, setLoading] = useState(true)

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-card)] sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <div className="font-mono text-xs text-[var(--color-muted-foreground)] tracking-widest uppercase">Travel Journal</div>
            <h1 className="font-display text-xl font-600 leading-tight">
              Japan <span className="italic font-300">in Thirty Days</span>
            </h1>
          </div>
          <div className="text-right">
            <div className="font-mono text-xs text-[var(--color-muted-foreground)]">Aug 4 – Sep 2, 2025</div>
            <div className="font-mono text-sm font-500 text-[var(--color-primary)]">
              {formatYen(ITINERARY.flatMap((d) => d.activities).reduce((s, a) => s + a.cost, 0))} total
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Budget bar */}
        <BudgetBar days={ITINERARY} />

        {/* Day nav + detail */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Day selector */}
          <aside>
            <div className="font-mono text-xs text-[var(--color-muted-foreground)] tracking-widest uppercase mb-3">Itinerary</div>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              {ITINERARY.map((day, i) => (
                <DayCard
                  key={day.day}
                  day={day}
                  isActive={i === activeDay}
                  onClick={() => setActiveDay(i)}
                />
              ))}
            </div>
          </aside>

          {/* Day detail */}
          <section>
            <DayDetail day={ITINERARY[activeDay]} />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <span className="font-mono text-xs text-[var(--color-muted-foreground)]">
            All prices in Japanese Yen (¥). Exchange rate ≈ ¥150/USD.
          </span>
          <span className="font-display text-sm italic text-[var(--color-muted-foreground)]">
            一期一会 — one time, one meeting
          </span>
        </div>
      </footer>
    </div>
  )
}
