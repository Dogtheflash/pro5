import { baseOf } from './index'
import { projectId, publicAnonKey } from '../../utils/supabase/info'

// ═══ Runtime auto-translation layer ══════════════════════════════════════════
// Translates free-form English editorial content (itineraries, articles, legal
// pages, news, help) on demand. The keyed UI-chrome system handles
// menus/buttons with hand-authored quality; THIS layer handles the long tail of
// body copy.
//
// Every string is translated exactly once: results are cached both in the
// browser (localStorage) and — via our Supabase edge function — server-side in
// the KV store. The edge function calls DeepL (which blocks direct browser
// calls), so the first visitor to see a string pays for it and everyone after
// gets it from cache. Languages DeepL cannot handle (Khmer, Lao) come back as
// English rather than Vietnamese.

const ENDPOINT = `https://${projectId}.supabase.co/functions/v1/make-server-762d7aa5/translate`

type LangCache = Record<string, string>
const mem: Record<string, LangCache> = {}
const LS_PREFIX = 'atr:'

function load(base: string): LangCache {
  if (mem[base]) return mem[base]
  let obj: LangCache = {}
  try {
    const raw = localStorage.getItem(LS_PREFIX + base)
    if (raw) obj = JSON.parse(raw)
  } catch {
    /* ignore */
  }
  mem[base] = obj
  return obj
}

const saveTimers: Record<string, number> = {}
function scheduleSave(base: string) {
  window.clearTimeout(saveTimers[base])
  saveTimers[base] = window.setTimeout(() => {
    try {
      localStorage.setItem(LS_PREFIX + base, JSON.stringify(mem[base]))
    } catch {
      /* quota — keep the in-memory cache regardless */
    }
  }, 500)
}

const HAS_LETTER = /\p{L}/u
/** Worth sending to the API? Skip blanks, numbers, symbols, pure punctuation. */
export function translatable(text: string): boolean {
  return typeof text === 'string' && text.trim().length > 0 && HAS_LETTER.test(text)
}

const PRE_TRANSLATIONS: Record<string, Record<string, string>> = {
  ja: {
    'Considered journeys across Asia and beyond.': 'アジアおよびその先へ届ける、洗練された旅の記録。',
    'About Us': '会社概要・私たちについて',
    'Visa Approval Statistics': 'ビザ承認統計',
    'Travel Magazine': '旅行マガジン',
    'News': 'ニュース',
    'Sitemap': 'サイトマップ',
    'Help Center': 'ヘルプセンター',
    'Privacy Policy': 'プライバシーポリシー',
    'Terms of Service': '利用規約',
    'Personal Data Protection Policy': '個人情報保護方針',
    'Booking Terms & Conditions': '予約利用規約',
    'Flight Booking Policy': '航空券予約規約',
    'Hotel Booking Policy': 'ホテル予約規約',
    'Visa Service Terms': 'ビザサービス利用規約',
    'Payment Policy': '支払いポリシー',
    'Refund Policy': '返金ポリシー',
    'Cancellation Policy': 'キャンセルポリシー',
    'Account Security Policy': 'アカウントセキュリティポリシー',
    'Cookie Policy': 'クッキーポリシー',
    'Anti-Fraud Policy': '不正防止ポリシー',
    'Website Terms of Use': 'ウェブサイト利用規約',
    'Promotional Terms': 'プロモーション利用規約',
    'Tokyo': '東京',
    'Kyoto': '京都',
    'Mount Fuji': '富士山',
    'Osaka': '大阪',
    'Nara': '奈良',
    'Hokkaido': '北海道',
    'Hanoi': 'ハノイ',
    'Ha Long Bay': 'ハロン湾',
    'Hue': 'フエ',
    'Hoi An': 'ホイアン',
    'Ho Chi Minh City': 'ホーチミン市',
    'Sapa': 'サパ',
    'Mekong Delta': 'メコンデルタ',
    'Bangkok': 'バンコク',
    'Chiang Mai': 'チェンマイ',
    'Phuket': 'プーケット',
    'Siem Reap': 'シェムリアップ',
    'Phnom Penh': 'プノンペン',
    'Vientiane': 'ビエンチャン',
    'Luang Prabang': 'ルアンパバーン',
    'Bali': 'バリ島',
    'Jakarta': 'ジャカルタ',
    'Kuala Lumpur': 'クアラルンプール',
    'Penang': 'ペナン',
    'Singapore': 'シンガポール',
    'Manila': 'マニラ',
    'Boracay': 'ボラカイ',
    'Beijing': '北京',
    'Shanghai': '上海',
    'Heritage — neon city & old shrines': '歴史と文化 — ネオン街と古社',
    'Heritage — temples & geisha districts': '歴史と文化 — 寺院と花街',
    'Heritage — the sacred peak & onsen': '歴史と文化 — 霊峰と温泉',
    'Food — the kitchen of Japan': 'グルメ — 天下の台所',
    'Heritage — the deer park & Todai-ji': '歴史と文化 — 鹿公園と東大寺',
    'Heritage — powder snow & hot springs': '歴史と文化 — パウダースノーと温泉',
    'The electric capital, where neon districts and centuries-old shrines sit within a single train ride of each other.': 'ネオン街と歴史ある神社が電車一本で行き来できる、活気に満ちた首都。',
    'The old imperial capital of some two thousand temples and shrines, geisha lanes, and raked stone gardens.': '約2000の寺社、花街の路地、枯山水庭園が広がる日本の古都。',
    "The nation's sacred, snow-capped symbol, mirrored in the five lakes and hot-spring towns of Hakone.": '富士五湖や箱根の温泉街に美しく映える、雪をいただく日本の神聖な象徴。',
    "The nation's boisterous kitchen, famous for takoyaki, okonomiyaki, and the neon canals of Dotonbori.": 'たこ焼き、お好み焼き、道頓堀のネオン運河で有名な活気あふれる食の都。',
    'The first permanent capital, where free-roaming deer bow for crackers beneath the Great Buddha of Todai-ji.': '東大寺の大仏の下で、鹿がおせんべいを求めてお辞儀をする日本最初の都。',
    'The wild northern island of powder-snow ski fields, summer flower farms, and volcanic hot springs.': 'パウダースノーのスキー場、夏の富良野の花畑、天然温泉が広がる大自然の北の大地。',
    'Sapa terraces to the Mekong delta': 'サパの棚田からメコンデルタへ',
    'The children of sticky rice': 'もち米の子供たち',
    'Rice & fish, the Khmer table': '米と魚、クメールの食卓',
    'Have you eaten rice yet?': 'もうご飯は食べましたか？',
    'The Ayeyarwady granary': 'エーヤワディの糧食庫',
    'Nasi lemak on banana leaf': 'バナナの葉に包まれたナシレマ',
    'The hawker-centre icon': 'ホーカーセンターの象徴',
    'The offering to Dewi Sri': 'デヴィ・スリ女神への捧げもの',
    'The terraces of Banaue': 'バナウエの棚田',
    'Nasi katok, day and night': '昼も夜もナシカトック',
    'Rice beside the maize': 'トウモロコシの隣の米',
    'In Vietnam rice is the landscape itself — from the stepped terraces of Sapa in the far north to the vast Mekong delta in the south, the country\'s "rice bowl." It fills the humble plate of cơm tấm as readily as the morning bowl of phở, and Vietnam ranks among the largest rice exporters on earth.': 'ベトナムにおいて、米は風景そのものです。最北端サパの棚田から、南部にある「米の鉢」と呼ばれる広大なメコンデルタまで広がっています。朝のフォーやコムタムの皿を彩り、ベトナムは世界最大級の米輸出国のひとつです。',
    'Laos eats more sticky rice per head than anywhere in the world. "Khao niaw" is steamed in a woven bamboo basket, rolled into a ball by hand, and dipped straight into the dish — so central that the Lao call themselves luk khao niaw, "the children of sticky rice."': 'ラオスは世界で最も一人あたりのもち米消費量が多い国です。「カオ・ニャオ」は竹かごで蒸され、手で丸めて料理につけて食べられます。ラオスの人々は自らを「もち米の子（ルック・カオ・ニャオ）」と呼びます。',
    'Rice and freshwater fish are the twin pillars of the Khmer table. The fragrant jasmine grown around Battambang has twice been judged the world\'s finest, and a meal is built around a mound of rice seasoned with a little fermented prahok.': '米と淡水魚はクメールの食卓の二大柱です。バッタンバン周辺で育つ香りは世界最高峰と称され、発酵させたプラホックを添えたご飯が食卓の中心です。',
    'Thailand gave the world hom mali jasmine rice and remains one of its top exporters. The bond runs so deep that the everyday Thai greeting, "kin khao reu yang?", literally asks "have you eaten rice yet?"': 'タイはジャスミン米（ホームマリ）を世界に届け、今も世界有数の輸出量を誇ります。タイの日常の挨拶「キン・カーオ・ルー・ヤン？」は文字通り「もうご飯食べた？」という意味です。',
    'A Burmese day often opens with rice — even the national dish, mohinga, is a rice-noodle soup. The great paddies of the Ayeyarwady delta feed the nation, and rice is heaped beside its many rich, oily curries.': 'ミャンマーの一日は米で始まります。国民食のモヒンガーも米粉の麺スープです。エーヤワディデルタの広大な田園が国を支え、濃厚なカレーとともに米が盛られます。',
    'Malaysia\'s unofficial national dish is nasi lemak — rice steamed in coconut milk and pandan, served on a banana leaf with sambal, crisp anchovies, peanuts, and egg. From dawn stalls to feasts, coconut rice is never far away.': 'マレーシアの国民的料理ナシレマは、ココナッツミルクとパンダンリーフで炊いたご飯をバナナの葉にのせ、サンバルや煮干し、ピーナッツ、ゆで卵を添えた一品です。',
    'On a small island with no farmland, Singapore made rice its icon: Hainanese chicken rice, the grains cooked in the poached bird\'s own stock, is claimed as a national dish and served at every hawker centre.': '農地のない小さな島国シンガポールは、米を自らの象徴としました。鶏の出汁で炊き上げた海南チキンライスは国民食としてすべてのホーカーセンターで愛されています。',
    'Across thousands of islands rice is sacred — Balinese farmers still honour Dewi Sri, the rice goddess, and mould golden tumpeng cones for celebrations. Day to day it becomes nasi goreng, the beloved fried rice of the archipelago.': '数千の島々において米は神聖な存在です。バリの農民は稲の女神デヴィ・スリを祀り、祝い事には黄金のトゥンペンを形作ります。日常では愛されるナシゴレンとなります。',
    'Filipinos eat rice at every meal, reborn each morning as garlic-fried sinangag. High in the Cordilleras, the two-thousand-year-old Banaue rice terraces are carved so grandly they are called the "Eighth Wonder of the World."': 'フィリピン人は毎食米を食べ、朝はニンニク炒めご飯（シナガグ）として生まれ変わります。コルディリェラ山脈にある2000年の歴史を持つバナウエ棚田は「世界第8の不思議」と称されます。',
    'In tiny, oil-rich Brunei rice remains the heart of the plate — most famously nasi katok, a simple parcel of rice, fried chicken, and sambal that fuels the sultanate around the clock.': '石油で潤う小さなブルネイでも、米は食卓の中心です。特に有名なナシカトックは、ご飯、フライドチキン、サンバルを包んだシンプルで愛される一品です。',
    'In the region\'s youngest nation rice shares the field with maize. Lowland families grow and pound their own paddy, and a shared plate of rice remains the foundation of the Timorese table.': '東南アジア最も若い国では、米はトウモロコシとともに栽培されます。平野部の家族は自ら米を育て精米し、共に囲むご飯がティモール人の食卓の基礎です。',
    'Vietnam': 'ベトナム',
    'Japan': '日本',
    'Thailand': 'タイ',
    'Indonesia': 'インドネシア',
    'Malaysia': 'マレーシア',
    'Philippines': 'フィリピン',
    'Cambodia': 'カンボジア',
    'Laos': 'ラオス',
    'Myanmar': 'ミャンマー',
    'China': '中国',
    'Brunei': 'ブルネイ',
    'East Timor': '東ティモール',
  },
  vi: {
    'Considered journeys across Asia and beyond.': 'Hành trình được chọn lọc tỉ mỉ khắp Châu Á và xa hơn nữa.',
    'About Us': 'Về chúng tôi',
    'Visa Approval Statistics': 'Thống kê duyệt Visa',
    'Travel Magazine': 'Tạp chí du lịch',
    'News': 'Tin tức',
    'Sitemap': 'Sơ đồ trang web',
    'Help Center': 'Trung tâm trợ giúp',
    'Privacy Policy': 'Chính sách quyền riêng tư',
    'Terms of Service': 'Điều khoản dịch vụ',
    'Personal Data Protection Policy': 'Chính sách bảo vệ dữ liệu cá nhân',
    'Booking Terms & Conditions': 'Điều khoản đặt phòng & dịch vụ',
    'Flight Booking Policy': 'Chính sách đặt vé máy bay',
    'Hotel Booking Policy': 'Chính sách đặt khách sạn',
    'Visa Service Terms': 'Điều khoản dịch vụ Visa',
    'Payment Policy': 'Chính sách thanh toán',
    'Refund Policy': 'Chính sách hoàn tiền',
    'Cancellation Policy': 'Chính sách hủy dịch vụ',
    'Account Security Policy': 'Chính sách bảo mật tài khoản',
    'Cookie Policy': 'Chính sách Cookie',
    'Anti-Fraud Policy': 'Chính sách phòng chống gian lận',
    'Website Terms of Use': 'Điều khoản sử dụng website',
    'Promotional Terms': 'Điều khoản khuyến mãi',
    'Tokyo': 'Tokyo',
    'Kyoto': 'Kyoto',
    'Mount Fuji': 'Núi Phú Sĩ',
    'Osaka': 'Osaka',
    'Nara': 'Nara',
    'Hokkaido': 'Hokkaido',
    'Heritage — neon city & old shrines': 'Di sản — Phố đèn neon & đền cổ',
    'Heritage — temples & geisha districts': 'Di sản — Đền chùa & phố Geisha',
    'Heritage — the sacred peak & onsen': 'Di sản — Đỉnh núi linh thiêng & Onsen',
    'Food — the kitchen of Japan': 'Ẩm thực — Bếp ăn của Nhật Bản',
    'Heritage — the deer park & Todai-ji': 'Di sản — Công viên nai & Todai-ji',
    'Heritage — powder snow & hot springs': 'Di sản — Tuyết mịn & Suối nước nóng',
    'The electric capital, where neon districts and centuries-old shrines sit within a single train ride of each other.': 'Thủ đô hiện đại, nơi những khu phố đèn neon và những ngôi đền hàng thế kỷ nằm cùng trên một tuyến tàu.',
    'The old imperial capital of some two thousand temples and shrines, geisha lanes, and raked stone gardens.': 'Cố đô cổ kính với hơn hai nghìn ngôi đền, ngõ geisha và vườn đá tĩnh lặng.',
    "The nation's sacred, snow-capped symbol, mirrored in the five lakes and hot-spring towns of Hakone.": 'Biểu tượng linh thiêng phủ tuyết của đất nước, soi bóng trên năm hồ nước và thị trấn suối nước nóng Hakone.',
    "The nation's boisterous kitchen, famous for takoyaki, okonomiyaki, and the neon canals of Dotonbori.": 'Căn bếp sôi động của đất nước, nổi tiếng với bánh bạch tuộc takoyaki, okonomiyaki và kênh đào Dotonbori rực rỡ.',
    'The first permanent capital, where free-roaming deer bow for crackers beneath the Great Buddha of Todai-ji.': 'Cố đô đầu tiên, nơi những chú nai tự do cúi chào xin bánh dưới chân Đại Phật Todai-ji.',
    'The wild northern island of powder-snow ski fields, summer flower farms, and volcanic hot springs.': 'Hòn đảo phía bắc hoang sơ với những bãi trượt tuyết, cánh đồng hoa mùa hè và suối nước nóng núi lửa.',
    'Sapa terraces to the Mekong delta': 'Từ ruộng bậc thang Sapa đến đồng bằng sông Cửu Long',
    'The children of sticky rice': 'Những đứa con của xôi nếp',
    'Rice & fish, the Khmer table': 'Cơm và cá, mâm cơm Khmer',
    'Have you eaten rice yet?': 'Bạn đã ăn cơm chưa?',
    'The Ayeyarwady granary': 'Vựa lúa Ayeyarwady',
    'Nasi lemak on banana leaf': 'Nasi lemak trên lá chuối',
    'The hawker-centre icon': 'Biểu tượng trung tâm Hawker',
    'The offering to Dewi Sri': 'Lễ vật dâng nữ thần Dewi Sri',
    'The terraces of Banaue': 'Ruộng bậc thang Banaue',
    'Nasi katok, day and night': 'Nasi katok ngày và đêm',
    'Rice beside the maize': 'Hạt cơm bên cạnh hạt ngô',
    'In Vietnam rice is the landscape itself — from the stepped terraces of Sapa in the far north to the vast Mekong delta in the south, the country\'s "rice bowl." It fills the humble plate of cơm tấm as readily as the morning bowl of phở, and Vietnam ranks among the largest rice exporters on earth.': 'Ở Việt Nam, lúa gạo chính là cảnh quan — từ những thửa ruộng bậc thang Sapa ở miền Bắc đến đồng bằng sông Cửu Long bao la ở miền Nam. Gạo hiện diện trong dĩa cơm tấm bình dị cũng như bát phở buổi sáng, đưa Việt Nam trở thành một trong những quốc gia xuất khẩu gạo lớn nhất thế giới.',
    'Laos eats more sticky rice per head than anywhere in the world. "Khao niaw" is steamed in a woven bamboo basket, rolled into a ball by hand, and dipped straight into the dish — so central that the Lao call themselves luk khao niaw, "the children of sticky rice."': 'Lào là quốc gia tiêu thụ xôi nếp trên đầu người nhiều nhất thế giới. "Khao niaw" được đồ trong chõ tre, vo tròn bằng tay và chấm trực tiếp vào món ăn — gắn bó đến mức người Lào tự gọi mình là "luk khao niaw" (những đứa con của xôi nếp).',
    'Rice and freshwater fish are the twin pillars of the Khmer table. The fragrant jasmine grown around Battambang has twice been judged the world\'s finest, and a meal is built around a mound of rice seasoned with a little fermented prahok.': 'Cơm và cá nước ngọt là hai trụ cột của mâm cơm Khmer. Hạt gạo hương nhài trồng quanh Battambang từng hai lần được công nhận ngon nhất thế giới, và mỗi bữa ăn đều xoay quanh đĩa cơm dẻo ăn kèm chút mắm prahok đậm đà.',
    'Thailand gave the world hom mali jasmine rice and remains one of its top exporters. The bond runs so deep that the everyday Thai greeting, "kin khao reu yang?", literally asks "have you eaten rice yet?"': 'Thái Lan mang đến cho thế giới hạt gạo thơm Hom Mali và luôn nằm trong top xuất khẩu. Sự gắn kết sâu sắc đến mức câu chào hàng ngày "kin khao reu yang?" mang ý nghĩa "bạn đã ăn cơm chưa?"',
    'A Burmese day often opens with rice — even the national dish, mohinga, is a rice-noodle soup. The great paddies of the Ayeyarwady delta feed the nation, and rice is heaped beside its many rich, oily curries.': 'Một ngày của người Miến Điện thường bắt đầu bằng gạo — ngay cả món ăn quốc hồn quốc túy mohinga cũng là bún gạo. Những cánh đồng bao la vùng châu thổ Ayeyarwady nuôi sống đất nước và cơm luôn được xới đầy bên các món cà ri đậm đà.',
    'Malaysia\'s unofficial national dish is nasi lemak — rice steamed in coconut milk and pandan, served on a banana leaf with sambal, crisp anchovies, peanuts, and egg. From dawn stalls to feasts, coconut rice is never far away.': 'Món ăn đại diện của Malaysia là Nasi Lemak — cơm nấu nước cốt dừa và lá dứa, phục vụ trên lá chuối cùng sốt sambal, cá cơm giòn, đậu phộng và trứng.',
    'On a small island with no farmland, Singapore made rice its icon: Hainanese chicken rice, the grains cooked in the poached bird\'s own stock, is claimed as a national dish and served at every hawker centre.': 'Trên một hòn đảo nhỏ không có đất nông nghiệp, Singapore đã biến cơm thành biểu tượng: Cơm gà Hải Nam, với hạt cơm nấu từ nước dùng gà béo ngậy, được phục vụ ở mọi trung tâm hawker.',
    'Across thousands of islands rice is sacred — Balinese farmers still honour Dewi Sri, the rice goddess, and mould golden tumpeng cones for celebrations. Day to day it becomes nasi goreng, the beloved fried rice of the archipelago.': 'Khắp hàng nghìn hòn đảo, lúa gạo là thần thánh — người nông dân Bali vẫn thờ phụng nữ thần lúa Dewi Sri và đắp những tháp cơm Tumpeng vàng cho dịp lễ.',
    'Filipinos eat rice at every meal, reborn each morning as garlic-fried sinangag. High in the Cordilleras, the two-thousand-year-old Banaue rice terraces are carved so grandly they are called the "Eighth Wonder of the World."': 'Người Philippines ăn cơm trong mọi bữa ăn, mỗi sáng tái sinh thành cơm chiên tỏi sinangag. Trên dãy Cordilleras, ruộng bậc thang Banaue 2.000 năm tuổi được gọi là "Kỳ quan thứ tám của thế giới".',
    'In tiny, oil-rich Brunei rice remains the heart of the plate — most famously nasi katok, a simple parcel of rice, fried chicken, and sambal that fuels the sultanate around the clock.': 'Ở Brunei giàu có, cơm vẫn là tâm điểm của đĩa ăn — nổi tiếng nhất là Nasi Katok tiếp năng lượng cho vương quốc suốt ngày đêm.',
    'In the region\'s youngest nation rice shares the field with maize. Lowland families grow and pound their own paddy, and a shared plate of rice remains the foundation of the Timorese table.': 'Ở quốc gia trẻ nhất khu vực, lúa gạo chia sẻ đồng ruộng với ngô. Dĩa cơm chung vẫn là nền tảng mâm cơm người Timorese.',
    'Vietnam': 'Việt Nam',
    'Japan': 'Nhật Bản',
    'Thailand': 'Thái Lan',
    'Indonesia': 'Indonesia',
    'Malaysia': 'Malaysia',
    'Philippines': 'Philippines',
    'Cambodia': 'Campuchia',
    'Laos': 'Lào',
    'Myanmar': 'Myanmar',
    'China': 'Trung Quốc',
    'Brunei': 'Brunei',
    'East Timor': 'Đông Timor',
  }
}

/** Synchronous cache read — lets components paint instantly with no flash. */
export function getCached(text: string, target: string): string | undefined {
  const base = baseOf(target)
  if (base === 'en') return text
  if (PRE_TRANSLATIONS[base]?.[text]) return PRE_TRANSLATIONS[base][text]
  return load(base)[text]
}

// ── Request batching ──────────────────────────────────────────────────────────
// Components mount in bursts, so we collect every string requested within a
// short window and translate them in one batched call per language.
const BATCH_WINDOW = 60 // ms
const MAX_BATCH = 48 // DeepL accepts up to 50 texts per request

type Pending = {
  texts: string[]
  seen: Set<string>
  resolvers: Map<string, Array<(s: string) => void>>
  timer: number | null
}
const pending: Record<string, Pending> = {}

function queue(base: string, text: string): Promise<string> {
  const p =
    pending[base] ??
    (pending[base] = { texts: [], seen: new Set(), resolvers: new Map(), timer: null })

  return new Promise<string>((resolve) => {
    if (!p.seen.has(text)) {
      p.seen.add(text)
      p.texts.push(text)
    }
    const list = p.resolvers.get(text) ?? []
    list.push(resolve)
    p.resolvers.set(text, list)

    if (p.texts.length >= MAX_BATCH) {
      flush(base)
    } else if (p.timer == null) {
      p.timer = window.setTimeout(() => flush(base), BATCH_WINDOW)
    }
  })
}

async function flush(base: string) {
  const p = pending[base]
  if (!p) return
  delete pending[base]
  if (p.timer != null) window.clearTimeout(p.timer)

  const texts = p.texts
  const cache = load(base)

  const settle = (results: Record<string, string>) => {
    for (const [text, list] of p.resolvers) {
      const value = results[text] ?? text
      for (const resolve of list) resolve(value)
    }
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ q: texts, target: base }),
    })
    if (!res.ok) throw new Error('translate ' + res.status)
    const data = await res.json()
    const translations: string[] = Array.isArray(data?.translations) ? data.translations : []

    const results: Record<string, string> = {}
    texts.forEach((text, i) => {
      const value = typeof translations[i] === 'string' ? translations[i] : text
      results[text] = value
      cache[text] = value
    })
    scheduleSave(base)
    settle(results)
  } catch {
    // Never break the UI — leave English in place (and don't cache the failure).
    settle({})
  }
}

const inflight: Record<string, Promise<string>> = {}

/** Translate one string → target locale, cached. Falls back to English on any failure. */
export function translateText(text: string, target: string): Promise<string> {
  const base = baseOf(target)
  if (base === 'en' || !translatable(text)) return Promise.resolve(text)

  const cache = load(base)
  if (cache[text] != null) return Promise.resolve(cache[text])

  const key = base + ' ' + text
  if (key in inflight) return inflight[key]

  const p = queue(base, text).finally(() => {
    delete inflight[key]
  })
  inflight[key] = p
  return p
}
