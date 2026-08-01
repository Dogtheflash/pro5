export interface DishData {
  id: string
  name: string
  nativeName: string
  image: string
  description: string
  priceUsd: number
  metrics: {
    spiciness: number // 1-5
    umami: number // 1-5
    sweetness: number // 1-5
    sourness: number // 1-5
    aroma: number // 1-5
  }
  ingredients: string[]
}

export interface SouvenirData {
  name: string
  image: string
  description: string
  priceUsd: number
}

export interface ItinerarySample {
  title: string
  days: string
  highlights: string[]
  estimatedCostUsd: number
}

export interface ChefStoryData {
  name: string
  title: string
  image: string
  bio: string
  signatureDish: string
}

export interface CountryChapter {
  id: string
  name: string
  flag: string
  capital: string
  heroImage: string
  instrument: string
  audioSampleName: string
  culturalStory: string
  dishes: DishData[]
  souvenirs: SouvenirData[]
  itineraries: ItinerarySample[]
  chef: ChefStoryData
  vocabulary: {
    word: string
    phonetic: string
    meaning: string
  }
  tourBasePriceUsd: number
}

export const ASIAN_COUNTRIES: CountryChapter[] = [
  {
    id: 'vietnam',
    name: 'Việt Nam',
    flag: '🇻🇳',
    capital: 'Hà Nội',
    heroImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&fit=crop&auto=format',
    instrument: 'Đàn Bầu & Tiêu Trúc',
    audioSampleName: 'Tiếng Sáo Trúc Hà Thành',
    culturalStory: 'Nền ẩm thực Việt Nam là sự cân bằng tuyệt hảo giữa Âm và Dương, nơi ngò rí, húng quế, sả tươi hòa quyện cùng nước mắm cốt thanh dịu từ lòng biển đảo.',
    dishes: [
      {
        id: 'vn-pho',
        name: 'Phở Bò Wagyu Cố Đô',
        nativeName: 'Phở Bò Thượng Hạng',
        image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&fit=crop&auto=format',
        description: 'Nước dùng ninh 24 giờ cùng quế chi, hoa hồi, thảo quả, dùng kèm thịt bò Wagyu A5 xắt mỏng nốt hương ngọt thanh.',
        priceUsd: 18,
        metrics: { spiciness: 1, umami: 5, sweetness: 2, sourness: 2, aroma: 5 },
        ingredients: ['Bò Wagyu A5', 'Xương Bò Ninh Cổ Truyền', 'Bánh Phở Tươi', 'Hành Lộc', 'Thảo Quả & Hồi'],
      },
      {
        id: 'vn-banh-xeo',
        name: 'Bánh Xèo Saffron Miệt Vườn',
        nativeName: 'Bánh Xèo Giòn Rụm',
        image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&fit=crop&auto=format',
        description: 'Vỏ bánh vàng đơm nghệ tươi & nước cốt dừa, cuộn tôm sú biển, thịt ba chỉ nướng lá lốt ăn kèm rau rừng.',
        priceUsd: 14,
        metrics: { spiciness: 2, umami: 4, sweetness: 3, sourness: 3, aroma: 4 },
        ingredients: ['Bột Gạo Nương', 'Tôm Sú Biển', 'Nước Cốt Dừa', 'Rau Rừng Tây Nguyên'],
      },
    ],
    souvenirs: [
      { name: 'Chè Shan Tuyết Cổ Thụ Hà Giang', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&fit=crop&auto=format', description: 'Trà búp cổ thụ trăm năm Tây Con Lĩnh ngậm sương núi.', priceUsd: 28 },
      { name: 'Nước Mắm Cốt Nốt Phú Quốc 45°', image: 'https://images.unsplash.com/photo-1543411789-1a67a2ac05c6?w=400&fit=crop&auto=format', description: 'Ủ cá cơm than 12 tháng trong thùng gỗ bời lời.', priceUsd: 32 },
    ],
    itineraries: [
      { title: 'Hành Trình Di Sản Miền Bắc', days: '4 Ngày 3 Đêm', highlights: ['Phố Cổ Hà Nội', 'Du Thuyền Hạ Long', 'Làng Gốm Bát Tràng'], estimatedCostUsd: 450 },
      { title: 'Con Đường Di Sản Xứ Huế & Hội An', days: '5 Ngày 4 Đêm', highlights: ['Đại Nội Huế', 'Thả Đèn Lồng Sông Hoài', 'Thám Hiểm Phong Nha'], estimatedCostUsd: 580 },
    ],
    chef: {
      name: 'Nghệ Nhân Bùi Thị Sương',
      title: 'Bảo Tồn Ẩm Thực Cung Đình Huế',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&fit=crop&auto=format',
      bio: 'Với hơn 35 năm nghiên cứu món ăn hoàng gia, bà đã tái hiện hàng chục công thức nước dùng & mâm tiệc triều Nguyễn.',
      signatureDish: 'Nem Rồng Phượng & Chè Hạt Sen Bọc Nhãn Lồng',
    },
    vocabulary: { word: 'Phở', phonetic: '/fəː˧˩/', meaning: 'Món quốc phục nước dùng thảo mộc huyền thoại Việt Nam' },
    tourBasePriceUsd: 480,
  },
  {
    id: 'japan',
    name: 'Nhật Bản',
    flag: '🇯🇵',
    capital: 'Tokyo',
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&fit=crop&auto=format',
    instrument: 'Đàn Koto & Trống Taiko',
    audioSampleName: 'Giai Điệu Sakura Koto',
    culturalStory: 'Ẩm thực Nhật Bản (Washoku) tôn vinh vị Umami nguyên bản của đại dương và sự biến chuyển tinh tế của bốn mùa qua triết lý Shun.',
    dishes: [
      {
        id: 'jp-kaiseki',
        name: 'Tiệc Cung Đình Kaiseki Ryori',
        nativeName: '懐石料理',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&fit=crop&auto=format',
        description: 'Bữa tiệc 9 món trình bày theo mùa với cá ngừ Otoro tươi sống, thịt bò Hida nướng đá bọt và nấm Matsutake.',
        priceUsd: 120,
        metrics: { spiciness: 1, umami: 5, sweetness: 2, sourness: 1, aroma: 4 },
        ingredients: ['Cá Ngừ Otoro', 'Thịt Bò Hida Wagyu', 'Dashi Tảo Konbu', 'Nấm Matsutake'],
      },
      {
        id: 'jp-ramen',
        name: 'Tonkotsu Ramen Hakata Thượng Hạng',
        nativeName: '博多豚骨ラーメン',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&fit=crop&auto=format',
        description: 'Nước súp tủy heo béo ngậy ninh 18 tiếng, mì tươi sợi mảnh nén giòn và thịt xá xíu Chashu cháy cạnh.',
        priceUsd: 16,
        metrics: { spiciness: 2, umami: 5, sweetness: 1, sourness: 1, aroma: 4 },
        ingredients: ['Xương Heo Hakata', 'Mì Tươi Chashu', 'Trứng Lòng Đào Nitamago', 'Dầu Tỏi Đen Mayu'],
      },
    ],
    souvenirs: [
      { name: 'Trà Matcha Cổ Thụ Uji Kyoto', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&fit=crop&auto=format', description: 'Trà xanh nghiền cối đá thủ công Kyoto.', priceUsd: 45 },
      { name: 'Bánh Mochi Hoa Anh Đào Sakura', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&fit=crop&auto=format', description: 'Gạo nếp dẻo thơm nhân đậu đỏ bọc lá anh đào muối.', priceUsd: 22 },
    ],
    itineraries: [
      { title: 'Hoa Anh Đào & Cố Đô Kyoto-Tokyo', days: '7 Ngày 6 Đêm', highlights: ['Shinkansen Siêu Tốc', 'Thưởng Trà Gion Kyoto', 'Tắm Onsen Hakone'], estimatedCostUsd: 1450 },
    ],
    chef: {
      name: 'Chef Kenjiro Murata',
      title: '3 Sao Michelin - Kyoto Washoku',
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&fit=crop&auto=format',
      bio: 'Bậc thầy giữ ngọn lửa bếp Kaiseki truyền thống hơn 40 năm tại Arashiyama.',
      signatureDish: 'Sashimi Bào Ngư Mù Tạt Tươi Shizuoka',
    },
    vocabulary: { word: 'Washoku', phonetic: '/wa.ɕo.kɯ/', meaning: 'Di sản ẩm thực truyền thống Nhật Bản UNESCO' },
    tourBasePriceUsd: 1250,
  },
  {
    id: 'thailand',
    name: 'Thái Lan',
    flag: '🇹🇭',
    capital: 'Bangkok',
    heroImage: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&fit=crop&auto=format',
    instrument: 'Đàn Ranad Ek & Khuyển Xài',
    audioSampleName: 'Điệu Múa Đền Vàng Bangkok',
    culturalStory: 'Ẩm thực Xiêm La bùng nổ 5 giác quan: Vị cay nức tỏi ớt, vị béo cốt dừa, chua thanh chanh rừng và ngát thơm riềng sả.',
    dishes: [
      {
        id: 'th-tomyum',
        name: 'Tom Yum Goong Thượng Hạng',
        nativeName: 'ต้มยำกุ้ง',
        image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=800&fit=crop&auto=format',
        description: 'Canh tôm sông Ayutthaya nấu cùng chanh kaffir, riềng non, ớt phrik khi nu và nước cốt dừa béo thơm.',
        priceUsd: 22,
        metrics: { spiciness: 5, umami: 4, sweetness: 2, sourness: 5, aroma: 5 },
        ingredients: ['Tôm Sông Ayutthaya', 'Lá Chanh Kaffir', 'Riềng Nước', 'Ớt Hiểm Thái', 'Nước Cốt Dừa'],
      },
      {
        id: 'th-padthai',
        name: 'Pad Thai Hải Sản Đêm Thipsamai',
        nativeName: 'ผัดไทยกุ้งสด',
        image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&fit=crop&auto=format',
        description: 'Hủ tiếu xào me chua ngọt với tôm hùm đất, đậu hũ chiên giòn, trứng tráng mỏng bọc ngoài rắc đậu phụng.',
        priceUsd: 16,
        metrics: { spiciness: 3, umami: 4, sweetness: 4, sourness: 3, aroma: 4 },
        ingredients: ['Bánh Phở Khô', 'Sốt Me Thái', 'Tôm Hùm Đất', 'Đậu Phụng Nướng', 'Giá Đỗ'],
      },
    ],
    souvenirs: [
      { name: 'Trà Sữa Thái Nguyên Bản ChaTraMue', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&fit=crop&auto=format', description: 'Trà đỏ sả thơm đậm đà văn hóa đường phố.', priceUsd: 15 },
      { name: 'Lụa Tơ Tằm Jim Thompson Thủ Công', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&fit=crop&auto=format', description: 'Khăn lụa dệt tay họa tiết hoàng gia Xiêm.', priceUsd: 65 },
    ],
    itineraries: [
      { title: 'Bangkok Phồn Hoa & Chiang Mai Cổ Kính', days: '5 Ngày 4 Đêm', highlights: ['Chợ Nổi Damnoen Saduak', 'Đền Vàng Wat Phra Kaew', 'Múa Lụa Đêm Chiang Mai'], estimatedCostUsd: 620 },
    ],
    chef: {
      name: 'Chef Jay Fai',
      title: 'Huyền Thoại 1 Sao Michelin Đường Phố',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&fit=crop&auto=format',
      bio: 'Người phụ nữ đeo kính bảo hộ bên chảo than đỏ lửa hơn 50 năm chảo xào trứng cua hải sản ngon nhất Bangkok.',
      signatureDish: 'Trứng Cuộn Thịt Cua Càng Khổng Lồ Khai Luang',
    },
    vocabulary: { word: 'Aroy', phonetic: '/a-ròoi/', meaning: 'Ngon tuyệt vời trong tiếng Thái' },
    tourBasePriceUsd: 590,
  },
  {
    id: 'korea',
    name: 'Hàn Quốc',
    flag: '🇰🇷',
    capital: 'Seoul',
    heroImage: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1200&fit=crop&auto=format',
    instrument: 'Đàn Gayageum & Trống Buk',
    audioSampleName: 'Khúc Nhạc Gayageum Seoul',
    culturalStory: 'Nghệ thuật lên men Kimjang độc đáo kết hợp cùng ngũ vị ngũ sắc đại diện cho âm dương ngũ hành của bán đảo Triều Tiên.',
    dishes: [
      {
        id: 'kr-samgyetang',
        name: 'Gà Tần Nhân Sâm Cung Đình',
        nativeName: '삼계탕',
        image: 'https://images.unsplash.com/photo-1547496592-146a47087347?w=800&fit=crop&auto=format',
        description: 'Gà tơ nhồi nhân sâm Geumsan 6 năm tuổi, gạo nếp, táo đỏ, hạt sen ninh trong nồi đất nóng hổi.',
        priceUsd: 24,
        metrics: { spiciness: 1, umami: 4, sweetness: 2, sourness: 1, aroma: 5 },
        ingredients: ['Gà Tơ', 'Nhân Sâm Geumsan 6 Năm', 'Táo Đỏ', 'Gạo Nếp Nương', 'Hạt Dẻ Hoàng Gia'],
      },
      {
        id: 'kr-galbi',
        name: 'Sườn Bò Nướng Sốt Nho Hanwoo',
        nativeName: '한우 갈비구이',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&fit=crop&auto=format',
        description: 'Sườn bò tươi Hanwoo ướp mật ong, nước ép lê nướng than hồng ăn kèm 12 loại banchans lên men.',
        priceUsd: 48,
        metrics: { spiciness: 2, umami: 5, sweetness: 3, sourness: 2, aroma: 4 },
        ingredients: ['Thịt Bò Hanwoo', 'Sốt Lê Mật Ong', 'Tỏi Nướng Than', 'Lá Goma Paechu'],
      },
    ],
    souvenirs: [
      { name: 'Hồng Sâm Củ Khô Geumsan Premium', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&fit=crop&auto=format', description: 'Đặc sản nhân sâm bổ dưỡng hàng đầu Hàn Quốc.', priceUsd: 88 },
      { name: 'Bộ Trang Phục Hanbok Lụa Gyeongbokgung', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&fit=crop&auto=format', description: 'Bộ trang phục truyền thống thêu chỉ kim tuyến.', priceUsd: 95 },
    ],
    itineraries: [
      { title: 'Sắc Màu Seoul & Đảo Ngọc Jeju', days: '5 Ngày 4 Đêm', highlights: ['Cung Điện Gyeongbokgung', 'Tháp N Seoul', 'Đảo Tháp Đá Jeju'], estimatedCostUsd: 890 },
    ],
    chef: {
      name: 'Chef Cho Hee-sook',
      title: 'Bậc Thầy K-Food Hansik Nữ Đầu Bếp Bán Đảo',
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&fit=crop&auto=format',
      bio: 'Người bảo tồn hàng trăm món ăn cung đình Joseon nguyên bản với thẩm mỹ hiện đại.',
      signatureDish: 'Cơm Trộn Bibimbap Ngũ Sắc Hoàng Gia Nồi Đất',
    },
    vocabulary: { word: 'Masisseoyo', phonetic: '/ma-si-ssoe-yo/', meaning: 'Ngon miệng trong tiếng Hàn' },
    tourBasePriceUsd: 850,
  },
  {
    id: 'china',
    name: 'Trung Quốc',
    flag: '🇨🇳',
    capital: 'Bắc Kinh',
    heroImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1200&fit=crop&auto=format',
    instrument: 'Đàn Tranh Guzheng & Cầm',
    audioSampleName: 'Tiếng Tranh Guzheng Tây Hồ',
    culturalStory: 'Tám đại trường phái ẩm thực Trung Hoa chứa đựng triết lý biến hóa mộc mạc từ chảo lửa Wok đến tách trà Long Tỉnh giăng sương.',
    dishes: [
      {
        id: 'cn-pekingduck',
        name: 'Vịt Quay Bắc Kinh Da Giòn Cung Đình',
        nativeName: '北京烤鸭',
        image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&fit=crop&auto=format',
        description: 'Vịt béo quay củi táo da giòn rụm màu hổ phách, cuốn bánh tráng mỏng, dưa chuột, đầu hành và sốt tương đen.',
        priceUsd: 38,
        metrics: { spiciness: 1, umami: 5, sweetness: 3, sourness: 1, aroma: 5 },
        ingredients: ['Vịt Quay Củi Táo', 'Sốt Tương Ngọt', 'Bánh Bột Mì Mỏng', 'Đầu Hành Trắng'],
      },
      {
        id: 'cn-dimsum',
        name: 'Khay Dimsum Thượng Hải 8 Vị',
        nativeName: '上海小笼包',
        image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&fit=crop&auto=format',
        description: 'Bánh bao Tiểu Long Bao nhân thịt heo & bào ngư ngập nước súp đậm đà hấp trong xửng tre thơm phức.',
        priceUsd: 20,
        metrics: { spiciness: 1, umami: 5, sweetness: 2, sourness: 2, aroma: 4 },
        ingredients: ['Thịt Heo Đen', 'Nước Súp Tủy Bào Ngư', 'Gừng Thái Sợi', 'Giấm Đen Trấn Giang'],
      },
    ],
    souvenirs: [
      { name: 'Trà Long Tỉnh Tây Hồ Hái Mùa Xuân', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&fit=crop&auto=format', description: 'Đệ nhất danh trà Trung Hoa từ búp trà Tây Hồ.', priceUsd: 55 },
      { name: 'Tranh Thêu Lụa Tô Châu Thủ Công', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&fit=crop&auto=format', description: 'Tác phẩm thêu hai mặt tinh xảo bậc nhất.', priceUsd: 110 },
    ],
    itineraries: [
      { title: 'Bắc Kinh Cố Cung & Tây Hồ Hàng Châu', days: '6 Ngày 5 Đêm', highlights: ['Vạn Lý Trường Thành', 'Tử Cấm Thành', 'Du Thuyền Tây Hồ'], estimatedCostUsd: 920 },
    ],
    chef: {
      name: 'Chef Chân Quảng Lộc',
      title: 'Bậc Thầy Đầu Bếp Quảng Đông 3 Sao Michelin',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&fit=crop&auto=format',
      bio: 'Chuyên gia xử lý hương vị Wok Hei lửa lớn với sự chính xác tuyệt đối trong ẩm thực Trung Hoa.',
      signatureDish: 'Bào Ngư Sốt Dầu Hào Hoàng Gia & Yến Sào',
    },
    vocabulary: { word: 'Wok Hei', phonetic: '/wɒk haɪ/', meaning: 'Hơi thở của chảo lửa trong ẩm thực Trung Hoa' },
    tourBasePriceUsd: 880,
  },
  {
    id: 'indonesia',
    name: 'Indonesia',
    flag: '🇮🇩',
    capital: 'Jakarta',
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&fit=crop&auto=format',
    instrument: 'Dàn Nhạc Gamelan & Cồng Đồng',
    audioSampleName: 'Nhạc Chuông Đền Bali Gamelan',
    culturalStory: 'Ẩm thực đảo quốc Vạn Đảo tỏa ngát hương gia vị đinh hương, nhục đậu khấu, nghệ sả từ các quần đảo bạt ngàn dừa xanh.',
    dishes: [
      {
        id: 'id-rendang',
        name: 'Rendang Bò Padang Truyền Thống',
        nativeName: 'Rendang Daging',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&fit=crop&auto=format',
        description: 'Bò bắp ninh chậm 6 tiếng trong cốt dừa đặc & 16 loại gia vị thảo mộc tới khi keo sệt đậm đà.',
        priceUsd: 20,
        metrics: { spiciness: 4, umami: 5, sweetness: 2, sourness: 1, aroma: 5 },
        ingredients: ['Thịt Bò Bắp', 'Nước Cốt Dừa Mới Vắt', 'Nghệ Tươi', 'Sả Củ', 'Đinh Hương'],
      },
      {
        id: 'id-nasigoreng',
        name: 'Nasi Goreng Hải Sản Bali',
        nativeName: 'Nasi Goreng Special',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&fit=crop&auto=format',
        description: 'Cơm chiên sốt kecap manis ngọt thơm với tôm nướng, xiên thịt nướng Satay, trứng ốp la & bánh phồng tôm.',
        priceUsd: 15,
        metrics: { spiciness: 3, umami: 4, sweetness: 4, sourness: 2, aroma: 4 },
        ingredients: ['Cơm Gạo Hương', 'Tương Ngọt Kecap Manis', 'Xiên Satay Gà', 'Tôm Biển'],
      },
    ],
    souvenirs: [
      { name: 'Cà Phê Luwak Nguyên Chất Sumatra', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&fit=crop&auto=format', description: 'Loại cà phê hiếm có và đậm đà nhất thế giới.', priceUsd: 60 },
      { name: 'Vải Batik Solo Họa Tiết Thủ Công', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&fit=crop&auto=format', description: 'Nghệ thuật nhuộm sáp bối truyền thống Indonesia.', priceUsd: 40 },
    ],
    itineraries: [
      { title: 'Thiên Đường Bali & Cố Đô Yogyakarta', days: '6 Ngày 5 Đêm', highlights: ['Biệt Thự Ubud', 'Đền Nước Tanah Lot', 'Kỳ Quan Borobudur'], estimatedCostUsd: 780 },
    ],
    chef: {
      name: 'Chef Wayan Kresna Yasa',
      title: 'Bậc Thầy Ẩm Thực Đảo Bali',
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&fit=crop&auto=format',
      bio: 'Người tiên phong đưa ẩm thực bumbu truyền thống của Indonesia lên bản đồ fine-dining thế giới.',
      signatureDish: 'Bebek Betutu Vịt Quay Lá Chuối Tro Nóng',
    },
    vocabulary: { word: 'Enak', phonetic: '/e-nak/', meaning: 'Ngon tuyệt hảo trong tiếng Indonesia' },
    tourBasePriceUsd: 720,
  },
]
