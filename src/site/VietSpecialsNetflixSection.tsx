import React, { useState, useRef, useEffect } from 'react'

export interface VietSpecialItem {
  id: string
  name: string
  province: string
  sealCode: string // e.g., 'HN', 'HL', 'SP', 'HUE', 'SG', 'PQ', 'DL', 'CT', 'BT', 'HG'
  region: 'north' | 'central' | 'south'
  category: 'cuisine' | 'handicraft' | 'heritage' | 'agriculture'
  coverImage: string
  videoUrl: string
  priceUsd: number
  unitLabel: string
  tags: string[]
  description: string
  story: string
}

export const VIET_SPECIALS: VietSpecialItem[] = [
  {
    id: 'shan-tuyet-ha-giang',
    name: 'Chè Shan Tuyết Cổ Thụ',
    province: 'Hà Giang',
    sealCode: 'HG',
    region: 'north',
    category: 'agriculture',
    coverImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&fit=crop&auto=format',
    videoUrl: 'https://videos.pexels.com/video-files/35344835/14977503_1920_1080_60fps.mp4',
    priceUsd: 28,
    unitLabel: 'Hộp 250g Trà Thượng Hạng',
    tags: ['Nông Sản', 'Trà Cổ Thụ', 'Hà Giang'],
    description: 'Búp trà cổ thụ trăm năm ngậm sương núi Tây Con Lĩnh, phủ lớp tuyết trắng tự nhiên, vị chát dịu hậu ngọt sâu.',
    story: 'Trên những dãy núi cao chót vót trên 1.500m tại Hà Giang, những cây trà Shan Tuyết cổ thụ hàng trăm năm tuổi đứng sừng sững giữa mây ngàn. Người dân tộc H’Mông, Dao phải trèo lên cây cao hái từng búp trà non ngậm sương sớm.',
  },
  {
    id: 'vinh-ha-long',
    name: 'Vịnh Hạ Long — Kỳ Quan Đá Vôi',
    province: 'Quảng Ninh',
    sealCode: 'HL',
    region: 'north',
    category: 'heritage',
    coverImage: 'https://images.unsplash.com/photo-1593994602837-530142086918?w=800&fit=crop&auto=format',
    videoUrl: 'https://videos.pexels.com/video-files/37969260/16111571_1920_1080_60fps.mp4',
    priceUsd: 140,
    unitLabel: 'Tour Du Thuyền 2 Ngày 1 Đêm',
    tags: ['Di Sản UNESCO', 'Kỳ Quan', 'Hạ Long'],
    description: 'Hàng nghìn đảo đá vôi nhô lên từ làn nước ngọc bích, hang động lung linh và làng chài nổi huyền bí.',
    story: 'Hạ Long — nơi rồng đáp xuống theo truyền thuyết dân gian. Hai nghìn hòn đảo karst sừng sững giữa vịnh biển lặng sóng tạo nên bức tranh thủy mặc thiên nhiên độc nhất vô nhị trên thế giới.',
  },
  {
    id: 'ruong-bac-thang-sapa',
    name: 'Ruộng Bậc Thang Sapa',
    province: 'Lào Cai',
    sealCode: 'SP',
    region: 'north',
    category: 'heritage',
    coverImage: 'https://images.unsplash.com/photo-1609412058473-c199497c3c5d?w=800&fit=crop&auto=format',
    videoUrl: 'https://videos.pexels.com/video-files/35998718/15264147_1920_1080_60fps.mp4',
    priceUsd: 85,
    unitLabel: 'Tour Khám Phá Bản Mông 2D1N',
    tags: ['Vùng Cao', 'Văn Hóa', 'Sapa'],
    description: 'Những nấc thang vàng óng mùa lúa chín uốn lượn qua các bản làng mây phủ của đồng bào H’Mông, Dao.',
    story: 'Bằng bàn tay lao động cần cù qua nhiều thế hệ, đồng bào các dân tộc thiểu số tại Sapa đã biến những sườn núi dốc đứng thành công trình nghệ thuật ruộng bậc thang rực rỡ kỳ vĩ.',
  },
  {
    id: 'gom-bat-trang',
    name: 'Gốm Sứ Mộc Bát Tràng',
    province: 'Hà Nội',
    sealCode: 'HN',
    region: 'north',
    category: 'handicraft',
    coverImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&fit=crop&auto=format',
    videoUrl: 'https://videos.pexels.com/video-files/19968466/19968466-hd_1920_1080_30fps.mp4',
    priceUsd: 45,
    unitLabel: 'Bộ Ấm Trà Men Hỏa Biến',
    tags: ['Thủ Công', 'Làng Nghề', 'Hà Nội'],
    description: 'Tinh hoa gốm sứ truyền thống sông Hồng với lớp men rạn và men hỏa biến tinh xảo qua lửa đỏ.',
    story: 'Làng gốm Bát Tràng nằm bên bờ sông Hồng có lịch sử hơn 700 năm. Nghệ nhân vuốt tay từng tác phẩm gốm, nung trong lò gốm truyền thống để tạo nên chất gốm ấm áp, bền bỉ cùng thời gian.',
  },
  {
    id: 'co-do-hue',
    name: 'Cố Đô Huế & Nhã Nhạc Hoàng Gia',
    province: 'Thừa Thiên Huế',
    sealCode: 'HUE',
    region: 'central',
    category: 'heritage',
    coverImage: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&fit=crop&auto=format',
    videoUrl: 'https://videos.pexels.com/video-files/38368356/16294098_1920_1080_60fps.mp4',
    priceUsd: 110,
    unitLabel: 'Tour Di Sản Hoàng Thành Huế',
    tags: ['Di Sản UNESCO', 'Hoàng Gia', 'Huế'],
    description: 'Kinh thành cổ kính bên sông Hương thơ mộng, nơi lưu giữ lăng tẩm hoàng gia và di sản ẩm thực triều Nguyễn.',
    story: 'Cố đô Huế mang vẻ đẹp thâm trầm, quý phái. Từ Đại Nội cổ kính đến tiếng chuông chùa Thiên Mụ ngân vang bên dòng sông Hương, Huế đưa du khách trở về không gian hoài cổ trầm mặc.',
  },
  {
    id: 'phong-nha-ke-bang',
    name: 'Động Phong Nha & Hang Sơn Đoòng',
    province: 'Quảng Bình',
    sealCode: 'QB',
    region: 'central',
    category: 'heritage',
    coverImage: 'https://images.unsplash.com/photo-1527922891260-918d42a4efc8?w=800&fit=crop&auto=format',
    videoUrl: 'https://videos.pexels.com/video-files/32547819/13880548_1920_1080_30fps.mp4',
    priceUsd: 195,
    unitLabel: 'Tour Phố Cổ & Hang Động 3D2N',
    tags: ['Kỳ Quan Thiên Nhiên', 'Thám Hiểm'],
    description: 'Vương quốc hang động thạch nhũ huyền ảo triệu năm, nơi sở hữu hang động tự nhiên lớn nhất hành tinh.',
    story: 'Vườn quốc gia Phong Nha - Kẻ Bàng được ví như bảo tàng địa chất khổng lồ. Những dòng sông ngầm chảy xuyên lòng núi đá vôi kiến tạo nên hàng trăm hang động kỳ vĩ.',
  },
  {
    id: 'pho-co-hoi-an',
    name: 'Phố Cổ Hội An & Đèn Lồng Silk',
    province: 'Quảng Nam',
    sealCode: 'QN',
    region: 'central',
    category: 'handicraft',
    coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&fit=crop&auto=format',
    videoUrl: 'https://videos.pexels.com/video-files/31454275/13413284_1920_1080_30fps.mp4',
    priceUsd: 35,
    unitLabel: 'Cặp Đèn Lồng Lụa Tơ Tằm',
    tags: ['Thủ Công', 'Phố Cổ', 'Hội An'],
    description: 'Thương cảng cổ rực rỡ sắc đèn lồng lụa chao nghiêng bên dòng sông Hoài thơ mộng đêm rằm.',
    story: 'Những ngôi nhà cổ mái ngói rêu phong tại Hội An lung linh trong đêm với hàng ngàn chiếc đèn lồng làm từ khung trúc và lụa tơ tằm mềm mại, mang lại cảm giác bình yên diệu kỳ.',
  },
  {
    id: 'tieu-quang-nam',
    name: 'Hạt Tiêu Đen & Mì Quảng',
    province: 'Đà Nẵng',
    sealCode: 'DN',
    region: 'central',
    category: 'cuisine',
    coverImage: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&fit=crop&auto=format',
    videoUrl: 'https://videos.pexels.com/video-files/19956584/19956584-hd_1920_1080_30fps.mp4',
    priceUsd: 18,
    unitLabel: 'Hũ Tiêu Đen & Đậu Đậm Vị 500g',
    tags: ['Ẩm Thực', 'Đặc Sản', 'Quảng Nam'],
    description: 'Đặc sản miền Trung với vị nồng cay nức mũi, đậm đà tình người dân xứ Quảng.',
    story: 'Mì Quảng và hạt tiêu đất Quảng đại diện cho sự kết hợp tinh tế giữa nguyên liệu nông sản nồng ấm và nước dùng đậm đà, ăn kèm bánh tráng nướng giòn rụm.',
  },
  {
    id: 'nuoc-mam-phu-quoc',
    name: 'Nước Mắm Cốt Nốt Phú Quốc',
    province: 'Kiên Giang',
    sealCode: 'PQ',
    region: 'south',
    category: 'cuisine',
    coverImage: 'https://images.unsplash.com/photo-1543411789-1a67a2ac05c6?w=800&fit=crop&auto=format',
    videoUrl: 'https://videos.pexels.com/video-files/33285991/14178391_1920_1080_60fps.mp4',
    priceUsd: 32,
    unitLabel: 'Cặp Chai Thủy Tinh 45 Độ Đạm',
    tags: ['Ẩm Thực', 'Đặc Sản Cốt', 'Phú Quốc'],
    description: 'Ủ từ cá cơm than tươi và muối biển trong thùng gỗ bời lời suốt 12 tháng, màu cánh gián thơm lừng.',
    story: 'Nước mắm Phú Quốc là sản phẩm đầu tiên của Việt Nam đạt chỉ dẫn địa lý được Liên minh Châu Âu (EU) bảo hộ. Cá cơm sau khi đánh bắt được muối ngay trên tàu để giữ trọn vị tươi ngọt thanh khiết.',
  },
  {
    id: 'cho-noi-cai-rang',
    name: 'Chợ Nổi Cái Răng & Trái Cây Miệt Vườn',
    province: 'Cần Thơ',
    sealCode: 'CT',
    region: 'south',
    category: 'heritage',
    coverImage: 'https://images.unsplash.com/photo-1506320775314-84c60bff00ff?w=800&fit=crop&auto=format',
    videoUrl: 'https://videos.pexels.com/video-files/34672212/14695775_1920_1080_60fps.mp4',
    priceUsd: 65,
    unitLabel: 'Tour Ghe Máy Chợ Nổi Đón Bình Minh',
    tags: ['Sông Nước', 'Miệt Vườn', 'Cần Thơ'],
    description: 'Văn hóa buôn bán sông nước độc đáo miền Tây với những cây bẹo treo lủng lẳng nông sản tươi ngon.',
    story: 'Từ tờ mờ sáng, hàng trăm chiếc ghe xuồng rộn rã trên sông Cần Thơ. Người bán treo sản phẩm lên "cây bẹo" ở đầu ghe để người mua dễ dàng nhận biết từ xa — nét sinh hoạt sông nước đậm chất Nam Bộ.',
  },
  {
    id: 'ca-phe-cau-dat',
    name: 'Cà Phê Arabica Cầu Đất',
    province: 'Lâm Đồng',
    sealCode: 'DL',
    region: 'south',
    category: 'agriculture',
    coverImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&fit=crop&auto=format',
    videoUrl: 'https://videos.pexels.com/video-files/32970330/14053148_1920_1080_60fps.mp4',
    priceUsd: 22,
    unitLabel: 'Túi Cà Phê Moka Cầu Đất 500g',
    tags: ['Nông Sản', 'Cà Phê', 'Đà Lạt'],
    description: 'Arabica nức tiếng trên độ cao 1.650m sương giăng, vị chua thanh thanh hậu ngọt đắng tao nhã.',
    story: 'Thung lũng Cầu Đất Đà Lạt có khí hậu ôn đới lý tưởng và thổ nhưỡng đất đỏ bazán. Hạt cà phê Moka Cầu Đất được thu hoạch chín mọng bằng tay và rang củi thủ công cho hương thơm thanh lịch.',
  },
  {
    id: 'keo-dua-ben-tre',
    name: 'Kẹo Dừa & Nghệ Thuật Dừa Bến Tre',
    province: 'Bến Tre',
    sealCode: 'BT',
    region: 'south',
    category: 'handicraft',
    coverImage: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&fit=crop&auto=format',
    videoUrl: 'https://videos.pexels.com/video-files/33861073/14369175_1920_1080_60fps.mp4',
    priceUsd: 15,
    unitLabel: 'Hộp Kẹo Dừa Bánh Tráng Dừa Thượng Hạng',
    tags: ['Ẩm Thực', 'Làng Nghề', 'Bến Tre'],
    description: 'Ngọt béo dừa xiêm tự nhiên quện hương lá dứa thơm lừng từ xứ sở dừa xanh bạt ngàn.',
    story: 'Kẹo dừa Bến Tre là món quà quê gắn liền với ký ức tuổi thơ. Nước cốt dừa đậm đặc sên cùng đường mạch nha trên chảo đồng tạo nên viên kẹo béo ngậy thơm ngon truyền thống.',
  },
]

function SpecialtyNetflixCard({
  item,
  onOpenDetail,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}: {
  item: VietSpecialItem
  onOpenDetail: (item: VietSpecialItem) => void
  onAddToCart?: (item: { id: string; name: string; country: string; flag: string; priceUsd: number }) => void
  onToggleWishlist?: (item: VietSpecialItem) => void
  isWishlisted?: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPlayingVideo, setIsPlayingVideo] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const handleMouseEnter = () => {
    // 0.5s hover delay timer like Netflix
    timerRef.current = setTimeout(() => {
      setIsHovered(true)
      setIsPlayingVideo(true)
    }, 500)
  }

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setIsHovered(false)
    setIsPlayingVideo(false)
  }

  useEffect(() => {
    if (isPlayingVideo && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      })
    }
  }, [isPlayingVideo])

  return (
    <div
      className="netflix-card-container relative group flex-shrink-0 w-[270px] sm:w-[310px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`netflix-card-expand relative overflow-hidden rounded-xl bg-[#1f1a14] border border-[#3a3026] text-[#f4ecdf] shadow-xl ${
          isHovered
            ? 'scale-110 -translate-y-3 z-30 shadow-[0_22px_45px_rgba(0,0,0,0.85)] border-[#c23b34]'
            : 'hover:border-[#b8ac97]/40'
        }`}
      >
        {/* Cover Image / Dynamic Video Loop */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
          <img
            src={item.coverImage}
            alt={item.name}
            className={`h-full w-full object-cover transition-opacity duration-500 ${
              isPlayingVideo ? 'opacity-0' : 'opacity-100'
            }`}
          />

          {isPlayingVideo && (
            <video
              ref={videoRef}
              src={item.videoUrl}
              muted={isMuted}
              loop
              playsInline
              preload="none"
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 opacity-100"
            />
          )}

          {/* Red Seal Stamp (Con Dấu Triện Đỏ) top-left */}
          <div className="absolute top-2.5 left-2.5 z-20">
            <span className="red-seal-stamp" title={`Tỉnh / Thành: ${item.province}`}>
              {item.sealCode}
            </span>
          </div>

          {/* Region Tag top-right */}
          <div className="absolute top-2.5 right-2.5 z-20">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-black/60 text-[#cf9c3f] border border-[#cf9c3f]/40 backdrop-blur-sm">
              {item.region === 'north' ? 'Miền Bắc' : item.region === 'central' ? 'Miền Trung' : 'Miền Nam'}
            </span>
          </div>

          {/* Sound Mute/Unmute Toggle on hover */}
          {isPlayingVideo && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsMuted(!isMuted)
              }}
              className="absolute bottom-2.5 right-2.5 z-20 h-7 w-7 rounded-full bg-black/70 text-white flex items-center justify-center text-xs backdrop-blur-md hover:bg-black/90 cursor-pointer"
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#1f1a14] via-transparent to-black/30 pointer-events-none" />
        </div>

        {/* Card Content & Action Bar */}
        <div className="p-4 space-y-2 text-left">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base font-600 leading-tight text-[#f4ecdf] line-clamp-1">
              {item.name}
            </h3>
            <span className="font-mono text-xs font-600 text-[#cf9c3f] flex-shrink-0">
              ${item.priceUsd}
            </span>
          </div>

          <p className="font-body text-xs text-[#b8ac97] line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {item.tags.map((t) => (
              <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2a231b] text-[#b8ac97] border border-[#3a3026]">
                #{t}
              </span>
            ))}
          </div>

          {/* Netflix Action Control Bar (Slides out when hovered) */}
          <div className={`pt-2 flex items-center justify-between border-t border-[#3a3026] gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 max-h-16' : 'opacity-90'
          }`}>
            <button
              onClick={() => onOpenDetail(item)}
              className="flex-1 py-1.5 rounded-md bg-[#c23b34] hover:bg-[#8a2a2a] text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>▶</span>
              <span>Khám Phá</span>
            </button>

            {onAddToCart && (
              <button
                onClick={() => onAddToCart({
                  id: item.id,
                  name: item.name,
                  country: item.province,
                  flag: '🇻🇳',
                  priceUsd: item.priceUsd,
                })}
                className="p-1.5 rounded-md border border-[#cf9c3f]/50 bg-[#cf9c3f]/10 text-[#cf9c3f] hover:bg-[#cf9c3f]/20 text-xs cursor-pointer"
                title="Đặt Mua Đặc Sản"
              >
                🛒
              </button>
            )}

            {onToggleWishlist && (
              <button
                onClick={() => onToggleWishlist(item)}
                className={`p-1.5 rounded-md border text-xs cursor-pointer transition-colors ${
                  isWishlisted
                    ? 'bg-red-500/20 border-red-500 text-red-400'
                    : 'border-[#3a3026] text-[#b8ac97] hover:text-white'
                }`}
                title={isWishlisted ? 'Đã lưu' : 'Lưu đặc sản'}
              >
                ❤️
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function VietSpecialsNetflixSection({
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
}: {
  onAddToCart?: (item: { id: string; name: string; country: string; flag: string; priceUsd: number }) => void
  onToggleWishlist?: (item: VietSpecialItem) => void
  wishlistIds?: string[]
}) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'cuisine' | 'handicraft' | 'heritage' | 'agriculture'>('all')
  const [activeModalItem, setActiveModalItem] = useState<VietSpecialItem | null>(null)

  const filteredItems = selectedCategory === 'all'
    ? VIET_SPECIALS
    : VIET_SPECIALS.filter((i) => i.category === selectedCategory)

  const northItems = filteredItems.filter((i) => i.region === 'north')
  const centralItems = filteredItems.filter((i) => i.region === 'central')
  const southItems = filteredItems.filter((i) => i.region === 'south')

  return (
    <section className="relative my-16 py-12 px-4 sm:px-8 bg-[#14110d] text-[#f4ecdf] border-y border-[#3a3026]">
      {/* Background lacquer pattern glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#2a1818_0%,transparent_70%)] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#3a3026] pb-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.35em] text-[#cf9c3f] mb-2 flex items-center gap-2">
              <span className="red-seal-stamp w-6 h-6 text-[9px]">VN</span>
              <span>Đặc Sản & Điểm Đến Du Lịch Việt</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-700 text-[#f4ecdf] leading-tight">
              Khám Phá Hương Vị <span className="text-[#c23b34]">Ba Miền</span>
            </h2>
            <p className="mt-2 max-w-2xl font-body text-sm text-[#b8ac97]">
              Trải nghiệm lướt xem nghệ thuật đặc sản làng nghề, ẩm thực di sản và cảnh quan tuyệt đẹp khắp Việt Nam với góc nhìn thước phim sống động.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'Tất Cả' },
              { id: 'cuisine', label: 'Ẩm Thực' },
              { id: 'handicraft', label: 'Thủ Công Mỹ Nghệ' },
              { id: 'heritage', label: 'Thiên Nhiên & Di Sản' },
              { id: 'agriculture', label: 'Nông Sản' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                  selectedCategory === cat.id
                    ? 'bg-[#c23b34] text-white border-[#c23b34] shadow-lg shadow-[#c23b34]/20'
                    : 'bg-[#1f1a14] text-[#b8ac97] border-[#3a3026] hover:border-[#b8ac97]/50 hover:text-[#f4ecdf]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 1: Miền Bắc (North Region) */}
        {northItems.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="red-seal-stamp">MB</span>
              <h3 className="font-display text-2xl font-600 text-[#f4ecdf]">
                Miền Bắc — Vùng Đất Di Sản & Núi Rừng
              </h3>
            </div>

            <div className="flex gap-5 overflow-x-auto pb-6 pt-2 scrollbar-thin no-scrollbar">
              {northItems.map((item) => (
                <SpecialtyNetflixCard
                  key={item.id}
                  item={item}
                  onOpenDetail={(i) => setActiveModalItem(i)}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlistIds.includes(item.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Row 2: Miền Trung (Central Region) */}
        {centralItems.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <span className="red-seal-stamp">MT</span>
              <h3 className="font-display text-2xl font-600 text-[#f4ecdf]">
                Miền Trung — Vùng Đất Cố Đô & Biển Đảo
              </h3>
            </div>

            <div className="flex gap-5 overflow-x-auto pb-6 pt-2 scrollbar-thin no-scrollbar">
              {centralItems.map((item) => (
                <SpecialtyNetflixCard
                  key={item.id}
                  item={item}
                  onOpenDetail={(i) => setActiveModalItem(i)}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlistIds.includes(item.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Row 3: Miền Nam (South Region) */}
        {southItems.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <span className="red-seal-stamp">MN</span>
              <h3 className="font-display text-2xl font-600 text-[#f4ecdf]">
                Miền Nam — Phồn Hoa Sông Nước & Miệt Vườn
              </h3>
            </div>

            <div className="flex gap-5 overflow-x-auto pb-6 pt-2 scrollbar-thin no-scrollbar">
              {southItems.map((item) => (
                <SpecialtyNetflixCard
                  key={item.id}
                  item={item}
                  onOpenDetail={(i) => setActiveModalItem(i)}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlistIds.includes(item.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Detail Modal */}
      {activeModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={() => setActiveModalItem(null)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-[#1f1a14] border border-[#c23b34]/40 shadow-2xl text-[#f4ecdf]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Video Banner */}
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              <video
                src={activeModalItem.videoUrl}
                autoPlay
                loop
                controls
                className="h-full w-full object-cover"
              />

              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 right-4 z-20 h-9 w-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black cursor-pointer"
              >
                ✕
              </button>

              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <span className="red-seal-stamp">{activeModalItem.sealCode}</span>
                <span className="font-mono text-xs px-3 py-1 rounded-full bg-[#c23b34] text-white">
                  {activeModalItem.province}
                </span>
              </div>
            </div>

            {/* Modal Body Info */}
            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-700 text-[#f4ecdf]">
                    {activeModalItem.name}
                  </h3>
                  <p className="font-mono text-xs text-[#cf9c3f] mt-1">
                    {activeModalItem.unitLabel}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-mono text-2xl font-700 text-[#cf9c3f]">
                    ${activeModalItem.priceUsd} USD
                  </span>
                </div>
              </div>

              <p className="font-body text-base leading-relaxed text-[#b8ac97]">
                {activeModalItem.story}
              </p>

              {/* Action buttons inside modal */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#3a3026]">
                <div className="flex gap-2">
                  {activeModalItem.tags.map((t) => (
                    <span key={t} className="text-xs font-mono px-3 py-1 rounded bg-[#2a231b] text-[#b8ac97]">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  {onAddToCart && (
                    <button
                      onClick={() => {
                        onAddToCart({
                          id: activeModalItem.id,
                          name: activeModalItem.name,
                          country: activeModalItem.province,
                          flag: '🇻🇳',
                          priceUsd: activeModalItem.priceUsd,
                        })
                        setActiveModalItem(null)
                      }}
                      className="px-6 py-2.5 rounded-full font-mono text-xs uppercase tracking-widest bg-[#c23b34] hover:bg-[#8a2a2a] text-white shadow-lg cursor-pointer transition-colors"
                    >
                      🛒 Đặt Mua Ngay (${activeModalItem.priceUsd})
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
