import { useSyncExternalStore } from 'react'

// ═══ Centralized i18n — Southeast Asia only ══════════════════════════════════
// A module-level store (not React context) so EVERY surface — the main app,
// hash-routed sub-pages, the footer, modals, and toasts — reads one source of
// truth and re-renders together the instant the language changes, with no page
// reload. The choice is persisted to localStorage and restored on every visit.

export interface Locale {
  code: string
  flag: string
  label: string // English name
  native: string // endonym
  intl: string // BCP-47 tag for Intl date/number formatting
  currency: { code: string; symbol: string }
}

// The only languages that may appear in the selector.
export const LOCALES: Locale[] = [
  { code: 'vi', flag: '🇻🇳', label: 'Vietnamese', native: 'Tiếng Việt', intl: 'vi-VN', currency: { code: 'VND', symbol: '₫' } },
  { code: 'ja', flag: '🇯🇵', label: 'Japanese', native: '日本語', intl: 'ja-JP', currency: { code: 'JPY', symbol: '¥' } },
  { code: 'en', flag: '🇬🇧', label: 'English', native: 'English', intl: 'en-US', currency: { code: 'USD', symbol: '$' } },
  { code: 'th', flag: '🇹🇭', label: 'Thai', native: 'ไทย', intl: 'th-TH', currency: { code: 'THB', symbol: '฿' } },
  { code: 'id', flag: '🇮🇩', label: 'Indonesian', native: 'Bahasa Indonesia', intl: 'id-ID', currency: { code: 'IDR', symbol: 'Rp' } },
  { code: 'ms', flag: '🇲🇾', label: 'Malay', native: 'Bahasa Melayu', intl: 'ms-MY', currency: { code: 'MYR', symbol: 'RM' } },
  { code: 'fil', flag: '🇵🇭', label: 'Filipino', native: 'Filipino', intl: 'fil-PH', currency: { code: 'PHP', symbol: '₱' } },
  { code: 'zh', flag: '🇨🇳', label: 'Chinese', native: '中文', intl: 'zh-CN', currency: { code: 'CNY', symbol: '¥' } },
  { code: 'ko', flag: '🇰🇷', label: 'Korean', native: '한국어', intl: 'ko-KR', currency: { code: 'KRW', symbol: '₩' } },
  { code: 'en-SG', flag: '🇸🇬', label: 'English (Singapore)', native: 'English', intl: 'en-SG', currency: { code: 'SGD', symbol: 'S$' } },
  { code: 'ms-BN', flag: '🇧🇳', label: 'Malay (Brunei)', native: 'Bahasa Melayu', intl: 'ms-BN', currency: { code: 'BND', symbol: 'B$' } },
  { code: 'km', flag: '🇰🇭', label: 'Khmer', native: 'ភាសាខ្មែរ', intl: 'km-KH', currency: { code: 'KHR', symbol: '៛' } },
  { code: 'lo', flag: '🇱🇦', label: 'Lao', native: 'ພາສາລາວ', intl: 'lo-LA', currency: { code: 'LAK', symbol: '₭' } },
  { code: 'my', flag: '🇲🇲', label: 'Burmese', native: 'မြန်မာ', intl: 'my-MM', currency: { code: 'MMK', symbol: 'K' } },
]

export const DEFAULT_LOCALE = 'en'
const STORAGE_KEY = 'siteLang'

// Variants share a translation table with their base language.
export function baseOf(code: string): string {
  if (code === 'en-SG') return 'en'
  if (code === 'ms-BN') return 'ms'
  return code
}

export function getLocaleMeta(code: string): Locale {
  return LOCALES.find((l) => l.code === code) ?? LOCALES[0]
}

export function isSupported(code: string): boolean {
  return LOCALES.some((l) => l.code === code)
}

/** Map a raw browser locale (e.g. "vi-VN", "tl") to a supported code, or null. */
export function detectBrowserLocale(): string | null {
  const raw = (navigator.language || (navigator.languages && navigator.languages[0]) || '').toLowerCase()
  if (!raw) return null
  const lang = raw.split('-')[0]
  const region = raw.split('-')[1]
  if (lang === 'en' && region === 'sg') return 'en-SG'
  if (lang === 'ms' && region === 'bn') return 'ms-BN'
  if (lang === 'tl') return 'fil' // Tagalog reports as tl
  const match = LOCALES.find((l) => baseOf(l.code) === lang)
  return match ? match.code : null
}

// ── Module store ─────────────────────────────────────────────────────────────
function readInitial(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && isSupported(saved)) return saved
  } catch {
    /* ignore */
  }
  // We do NOT auto-apply the browser language; English stays the default and
  // the detection modal handles the one-time recommendation.
  return DEFAULT_LOCALE
}

let current = readInitial()
const listeners = new Set<() => void>()

export function getLocale(): string {
  return current
}

export function setLocale(code: string) {
  if (!isSupported(code) || code === current) return
  current = code
  try {
    localStorage.setItem(STORAGE_KEY, code)
  } catch {
    /* ignore */
  }
  document.documentElement.lang = baseOf(code)
  listeners.forEach((fn) => fn())
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

/** Reactive current locale code. */
export function useLocale() {
  const code = useSyncExternalStore(subscribe, getLocale, () => DEFAULT_LOCALE)
  return { code, meta: getLocaleMeta(code), setLocale, locales: LOCALES }
}

// ── Messages ─────────────────────────────────────────────────────────────────
// Shared UI-chrome strings, keyed and translated for the 8 distinct SEA base
// languages. Variants (en-SG, ms-BN) inherit from their base. Missing keys fall
// back to English, then to the key itself — so nothing ever renders blank.
type Dict = Record<string, string>

const MESSAGES: Record<string, Dict> = {
  en: {
    information: 'Information', termsPolicies: 'Terms & Policies', showAllPolicies: 'Show all {n} policies',
    newsletter: 'Travel dispatches, monthly', join: 'Join', allRights: '© {year} {name}. All rights reserved.',
    privacy: 'Privacy', cookies: 'Cookies', terms: 'Terms', accessibility: 'Accessibility',
    darkMode: 'Dark mode', lightMode: 'Light mode', backToJournal: 'Back to the journal',
    back: 'Back', print: 'Print this page', share: 'Share this page', home: 'Home',
    onThisPage: 'On this page', relatedArticles: 'Related Articles', faqTitle: 'Frequently Asked Questions',
    search: 'Search', minRead: '{n} min read', lastUpdated: 'Last updated', version: 'Version',
    langRecommend: 'Language recommendation', chooseLanguage: 'Choose your preferred language',
    switchTo: 'Switch to {lang}', stayIn: 'Stay in {lang}', dontShowAgain: 'Don’t show this again',
    close: 'Close', switching: 'Switching…', current: 'Current', suggested: 'Suggested',
    browserNote: 'We noticed your browser language is set to {locale}. For the most accurate experience, would you like to switch to {lang}?',
    langChanged: 'Language changed successfully', sendMessage: 'Send message',
  },
  vi: {
    information: 'Thông tin', termsPolicies: 'Điều khoản & Chính sách', showAllPolicies: 'Xem tất cả {n} chính sách',
    newsletter: 'Bản tin du lịch hàng tháng', join: 'Đăng ký', allRights: '© {year} {name}. Bảo lưu mọi quyền.',
    privacy: 'Quyền riêng tư', cookies: 'Cookie', terms: 'Điều khoản', accessibility: 'Trợ năng',
    darkMode: 'Chế độ tối', lightMode: 'Chế độ sáng', backToJournal: 'Quay lại nhật ký',
    back: 'Quay lại', print: 'In trang này', share: 'Chia sẻ trang này', home: 'Trang chủ',
    onThisPage: 'Trong trang này', relatedArticles: 'Bài viết liên quan', faqTitle: 'Câu hỏi thường gặp',
    search: 'Tìm kiếm', minRead: 'Đọc {n} phút', lastUpdated: 'Cập nhật', version: 'Phiên bản',
    langRecommend: 'Gợi ý ngôn ngữ', chooseLanguage: 'Chọn ngôn ngữ bạn muốn',
    switchTo: 'Chuyển sang {lang}', stayIn: 'Giữ {lang}', dontShowAgain: 'Không hiển thị lại',
    close: 'Đóng', switching: 'Đang chuyển…', current: 'Hiện tại', suggested: 'Đề xuất',
    browserNote: 'Chúng tôi nhận thấy ngôn ngữ trình duyệt của bạn là {locale}. Để có trải nghiệm chính xác nhất, bạn có muốn chuyển sang {lang} không?',
    langChanged: 'Đã đổi ngôn ngữ thành công', sendMessage: 'Gửi tin nhắn',
  },
  th: {
    information: 'ข้อมูล', termsPolicies: 'ข้อกำหนดและนโยบาย', showAllPolicies: 'ดูนโยบายทั้งหมด {n} รายการ',
    newsletter: 'จดหมายข่าวการเดินทางรายเดือน', join: 'สมัคร', allRights: '© {year} {name} สงวนลิขสิทธิ์',
    privacy: 'ความเป็นส่วนตัว', cookies: 'คุกกี้', terms: 'ข้อกำหนด', accessibility: 'การเข้าถึง',
    darkMode: 'โหมดมืด', lightMode: 'โหมดสว่าง', backToJournal: 'กลับไปที่บันทึก',
    back: 'กลับ', print: 'พิมพ์หน้านี้', share: 'แชร์หน้านี้', home: 'หน้าแรก',
    onThisPage: 'ในหน้านี้', relatedArticles: 'บทความที่เกี่ยวข้อง', faqTitle: 'คำถามที่พบบ่อย',
    search: 'ค้นหา', minRead: 'อ่าน {n} นาที', lastUpdated: 'อัปเดตล่าสุด', version: 'เวอร์ชัน',
    langRecommend: 'คำแนะนำภาษา', chooseLanguage: 'เลือกภาษาที่คุณต้องการ',
    switchTo: 'เปลี่ยนเป็น {lang}', stayIn: 'ใช้ {lang} ต่อไป', dontShowAgain: 'ไม่ต้องแสดงอีก',
    close: 'ปิด', switching: 'กำลังเปลี่ยน…', current: 'ปัจจุบัน', suggested: 'แนะนำ',
    browserNote: 'เราสังเกตว่าภาษาเบราว์เซอร์ของคุณคือ {locale} เพื่อประสบการณ์ที่แม่นยำที่สุด คุณต้องการเปลี่ยนเป็น {lang} หรือไม่?',
    langChanged: 'เปลี่ยนภาษาเรียบร้อยแล้ว', sendMessage: 'ส่งข้อความ',
  },
  id: {
    information: 'Informasi', termsPolicies: 'Ketentuan & Kebijakan', showAllPolicies: 'Tampilkan semua {n} kebijakan',
    newsletter: 'Kabar perjalanan, tiap bulan', join: 'Gabung', allRights: '© {year} {name}. Semua hak dilindungi.',
    privacy: 'Privasi', cookies: 'Cookie', terms: 'Ketentuan', accessibility: 'Aksesibilitas',
    darkMode: 'Mode gelap', lightMode: 'Mode terang', backToJournal: 'Kembali ke jurnal',
    back: 'Kembali', print: 'Cetak halaman ini', share: 'Bagikan halaman ini', home: 'Beranda',
    onThisPage: 'Di halaman ini', relatedArticles: 'Artikel Terkait', faqTitle: 'Pertanyaan Umum',
    search: 'Cari', minRead: 'Baca {n} menit', lastUpdated: 'Diperbarui', version: 'Versi',
    langRecommend: 'Rekomendasi bahasa', chooseLanguage: 'Pilih bahasa yang Anda inginkan',
    switchTo: 'Beralih ke {lang}', stayIn: 'Tetap {lang}', dontShowAgain: 'Jangan tampilkan lagi',
    close: 'Tutup', switching: 'Mengganti…', current: 'Saat ini', suggested: 'Disarankan',
    browserNote: 'Kami melihat bahasa peramban Anda adalah {locale}. Untuk pengalaman terbaik, apakah Anda ingin beralih ke {lang}?',
    langChanged: 'Bahasa berhasil diganti', sendMessage: 'Kirim pesan',
  },
  ms: {
    information: 'Maklumat', termsPolicies: 'Terma & Dasar', showAllPolicies: 'Tunjuk semua {n} dasar',
    newsletter: 'Berita pengembaraan, bulanan', join: 'Sertai', allRights: '© {year} {name}. Hak cipta terpelihara.',
    privacy: 'Privasi', cookies: 'Kuki', terms: 'Terma', accessibility: 'Kebolehcapaian',
    darkMode: 'Mod gelap', lightMode: 'Mod cerah', backToJournal: 'Kembali ke jurnal',
    back: 'Kembali', print: 'Cetak halaman ini', share: 'Kongsi halaman ini', home: 'Laman utama',
    onThisPage: 'Di halaman ini', relatedArticles: 'Artikel Berkaitan', faqTitle: 'Soalan Lazim',
    search: 'Cari', minRead: 'Baca {n} minit', lastUpdated: 'Dikemas kini', version: 'Versi',
    langRecommend: 'Cadangan bahasa', chooseLanguage: 'Pilih bahasa pilihan anda',
    switchTo: 'Tukar ke {lang}', stayIn: 'Kekal {lang}', dontShowAgain: 'Jangan tunjuk lagi',
    close: 'Tutup', switching: 'Menukar…', current: 'Semasa', suggested: 'Dicadangkan',
    browserNote: 'Kami perasan bahasa pelayar anda ialah {locale}. Untuk pengalaman terbaik, adakah anda mahu bertukar ke {lang}?',
    langChanged: 'Bahasa berjaya ditukar', sendMessage: 'Hantar mesej',
  },
  fil: {
    information: 'Impormasyon', termsPolicies: 'Mga Tuntunin at Patakaran', showAllPolicies: 'Ipakita lahat ng {n} patakaran',
    newsletter: 'Buwanang balita sa paglalakbay', join: 'Sumali', allRights: '© {year} {name}. Nakalaan ang lahat ng karapatan.',
    privacy: 'Privacy', cookies: 'Cookies', terms: 'Tuntunin', accessibility: 'Accessibility',
    darkMode: 'Madilim na mode', lightMode: 'Maliwanag na mode', backToJournal: 'Bumalik sa journal',
    back: 'Bumalik', print: 'I-print ang pahinang ito', share: 'Ibahagi ang pahinang ito', home: 'Home',
    onThisPage: 'Sa pahinang ito', relatedArticles: 'Kaugnay na mga Artikulo', faqTitle: 'Mga Madalas Itanong',
    search: 'Maghanap', minRead: '{n} min basahin', lastUpdated: 'Huling na-update', version: 'Bersyon',
    langRecommend: 'Rekomendasyon ng wika', chooseLanguage: 'Piliin ang gusto mong wika',
    switchTo: 'Lumipat sa {lang}', stayIn: 'Manatili sa {lang}', dontShowAgain: 'Huwag nang ipakita ulit',
    close: 'Isara', switching: 'Naglilipat…', current: 'Kasalukuyan', suggested: 'Iminumungkahi',
    browserNote: 'Napansin naming nakatakda sa {locale} ang wika ng iyong browser. Para sa pinakatumpak na karanasan, gusto mo bang lumipat sa {lang}?',
    langChanged: 'Matagumpay na napalitan ang wika', sendMessage: 'Magpadala ng mensahe',
  },
  km: {
    information: 'ព័ត៌មាន', termsPolicies: 'លក្ខខណ្ឌ និងគោលការណ៍', showAllPolicies: 'បង្ហាញគោលការណ៍ទាំង {n}',
    newsletter: 'ព័ត៌មានទេសចរណ៍ប្រចាំខែ', join: 'ចូលរួម', allRights: '© {year} {name}. រក្សាសិទ្ធិគ្រប់យ៉ាង។',
    privacy: 'ឯកជនភាព', cookies: 'ខូគី', terms: 'លក្ខខណ្ឌ', accessibility: 'ភាពងាយស្រួល',
    darkMode: 'ម៉ូដងងឹត', lightMode: 'ម៉ូដភ្លឺ', backToJournal: 'ត្រឡប់ទៅកំណត់ហេតុ',
    back: 'ត្រឡប់', print: 'បោះពុម្ពទំព័រនេះ', share: 'ចែករំលែកទំព័រនេះ', home: 'ទំព័រដើម',
    onThisPage: 'ក្នុងទំព័រនេះ', relatedArticles: 'អត្ថបទពាក់ព័ន្ធ', faqTitle: 'សំណួរញឹកញាប់',
    search: 'ស្វែងរក', minRead: 'អាន {n} នាទី', lastUpdated: 'ធ្វើបច្ចុប្បន្នភាព', version: 'កំណែ',
    langRecommend: 'ការណែនាំភាសា', chooseLanguage: 'ជ្រើសរើសភាសាដែលអ្នកចង់បាន',
    switchTo: 'ប្ដូរទៅ {lang}', stayIn: 'នៅ {lang}', dontShowAgain: 'កុំបង្ហាញម្ដងទៀត',
    close: 'បិទ', switching: 'កំពុងប្ដូរ…', current: 'បច្ចុប្បន្ន', suggested: 'បានណែនាំ',
    browserNote: 'យើងកត់សម្គាល់ថាភាសាកម្មវិធីរុករករបស់អ្នកគឺ {locale}។ សម្រាប់បទពិសោធន៍ល្អបំផុត តើអ្នកចង់ប្ដូរទៅ {lang} ទេ?',
    langChanged: 'បានប្ដូរភាសាដោយជោគជ័យ', sendMessage: 'ផ្ញើសារ',
  },
  lo: {
    information: 'ຂໍ້ມູນ', termsPolicies: 'ຂໍ້ກຳນົດ & ນະໂຍບາຍ', showAllPolicies: 'ສະແດງນະໂຍບາຍທັງໝົດ {n}',
    newsletter: 'ຂ່າວການເດີນທາງ ປະຈຳເດືອນ', join: 'ເຂົ້າຮ່ວມ', allRights: '© {year} {name}. ສະຫງວນລິຂະສິດ.',
    privacy: 'ຄວາມເປັນສ່ວນຕົວ', cookies: 'ຄຸກກີ້', terms: 'ຂໍ້ກຳນົດ', accessibility: 'ການເຂົ້າເຖິງ',
    darkMode: 'ໂໝດມືດ', lightMode: 'ໂໝດແຈ້ງ', backToJournal: 'ກັບໄປທີ່ບັນທຶກ',
    back: 'ກັບຄືນ', print: 'ພິມໜ້ານີ້', share: 'ແບ່ງປັນໜ້ານີ້', home: 'ໜ້າຫຼັກ',
    onThisPage: 'ໃນໜ້ານີ້', relatedArticles: 'ບົດຄວາມທີ່ກ່ຽວຂ້ອງ', faqTitle: 'ຄຳຖາມທີ່ພົບເລື້ອຍ',
    search: 'ຄົ້ນຫາ', minRead: 'ອ່ານ {n} ນາທີ', lastUpdated: 'ອັບເດດຫຼ້າສຸດ', version: 'ເວີຊັນ',
    langRecommend: 'ຄຳແນະນຳພາສາ', chooseLanguage: 'ເລືອກພາສາທີ່ທ່ານຕ້ອງການ',
    switchTo: 'ປ່ຽນເປັນ {lang}', stayIn: 'ໃຊ້ {lang} ຕໍ່', dontShowAgain: 'ບໍ່ຕ້ອງສະແດງອີກ',
    close: 'ປິດ', switching: 'ກຳລັງປ່ຽນ…', current: 'ປັດຈຸບັນ', suggested: 'ແນະນຳ',
    browserNote: 'ພວກເຮົາສັງເກດວ່າພາສາຂອງໂປຣແກຣມທ່ອງເວັບຂອງທ່ານແມ່ນ {locale}. ເພື່ອປະສົບການທີ່ດີທີ່ສຸດ ທ່ານຕ້ອງການປ່ຽນເປັນ {lang} ບໍ?',
    langChanged: 'ປ່ຽນພາສາສຳເລັດແລ້ວ', sendMessage: 'ສົ່ງຂໍ້ຄວາມ',
  },
  my: {
    information: 'အချက်အလက်', termsPolicies: 'စည်းကမ်းများနှင့် မူဝါဒများ', showAllPolicies: 'မူဝါဒ {n} ခုလုံး ပြပါ',
    newsletter: 'လစဉ် ခရီးသွား သတင်းများ', join: 'ပါဝင်ရန်', allRights: '© {year} {name}။ မူပိုင်ခွင့်များ လက်ဝယ်ရှိသည်။',
    privacy: 'ကိုယ်ရေးလုံခြုံမှု', cookies: 'ကွတ်ကီး', terms: 'စည်းကမ်း', accessibility: 'အသုံးပြုနိုင်မှု',
    darkMode: 'အမှောင် မုဒ်', lightMode: 'အလင်း မုဒ်', backToJournal: 'ဂျာနယ်သို့ ပြန်သွားရန်',
    back: 'နောက်သို့', print: 'ဤစာမျက်နှာကို ပုံနှိပ်ရန်', share: 'ဤစာမျက်နှာကို မျှဝေရန်', home: 'ပင်မ',
    onThisPage: 'ဤစာမျက်နှာတွင်', relatedArticles: 'ဆက်စပ် ဆောင်းပါးများ', faqTitle: 'မေးလေ့ရှိသော မေးခွန်းများ',
    search: 'ရှာဖွေရန်', minRead: '{n} မိနစ် ဖတ်ရန်', lastUpdated: 'နောက်ဆုံး မွမ်းမံ', version: 'ဗားရှင်း',
    langRecommend: 'ဘာသာစကား အကြံပြုချက်', chooseLanguage: 'သင်နှစ်သက်ရာ ဘာသာစကားကို ရွေးပါ',
    switchTo: '{lang} သို့ ပြောင်းရန်', stayIn: '{lang} ဖြင့် ဆက်သုံးရန်', dontShowAgain: 'ထပ်မပြပါနှင့်',
    close: 'ပိတ်ရန်', switching: 'ပြောင်းနေသည်…', current: 'လက်ရှိ', suggested: 'အကြံပြု',
    browserNote: 'သင့်ဘရောက်ဇာ ဘာသာစကားမှာ {locale} ဖြစ်နေသည်ကို တွေ့ရသည်။ အကောင်းဆုံး အတွေ့အကြုံအတွက် {lang} သို့ ပြောင်းလိုပါသလား?',
    langChanged: 'ဘာသာစကား ပြောင်းပြီးပါပြီ', sendMessage: 'မက်ဆေ့ချ် ပို့ရန်',
  },
}

function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str
  return str.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`))
}

/** Translate a key for a given locale, with base→en→key fallback. */
export function translate(code: string, key: string, vars?: Record<string, string | number>): string {
  const b = baseOf(code)
  const raw = MESSAGES[b]?.[key] ?? MESSAGES.en[key] ?? key
  return interpolate(raw, vars)
}

/** Reactive translator bound to the current locale. */
export function useT() {
  const { code } = useLocale()
  return (key: string, vars?: Record<string, string | number>) => translate(code, key, vars)
}

// ── Date & currency localization ─────────────────────────────────────────────
export function formatDate(date: Date | string | number, code = getLocale()): string {
  const d = date instanceof Date ? date : new Date(date)
  try {
    return new Intl.DateTimeFormat(getLocaleMeta(code).intl, { year: 'numeric', month: 'long', day: 'numeric' }).format(d)
  } catch {
    return String(date)
  }
}

export function formatCurrency(amount: number, code = getLocale(), currencyCode?: string): string {
  const meta = getLocaleMeta(code)
  const cur = currencyCode ?? meta.currency.code
  try {
    return new Intl.NumberFormat(meta.intl, { style: 'currency', currency: cur, maximumFractionDigits: cur === 'VND' || cur === 'IDR' || cur === 'LAK' || cur === 'KHR' || cur === 'MMK' ? 0 : 2 }).format(amount)
  } catch {
    return `${meta.currency.symbol}${amount.toLocaleString()}`
  }
}

/** Reactive date/currency formatters bound to the current locale. */
export function useFormat() {
  const { code } = useLocale()
  return {
    date: (d: Date | string | number) => formatDate(d, code),
    currency: (n: number, currencyCode?: string) => formatCurrency(n, code, currencyCode),
  }
}
