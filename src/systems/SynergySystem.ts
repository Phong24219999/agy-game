import { EquipmentItem, PerkCard, SynergyType } from '../types/game';

export const SYNERGY_INFO: Record<SynergyType, { name: string; color: string; desc: string }> = {
  fire: {
    name: 'Hỏa Ngục',
    color: '#ff5533',
    desc: 'Đòn đánh thiêu đốt kẻ địch. Kích nổ khi tiêu diệt mục tiêu.'
  },
  frost: {
    name: 'Băng Phong',
    color: '#33ccff',
    desc: 'Làm chậm tốc đánh/di chuyển của quái. Đóng băng mục tiêu.'
  },
  lightning: {
    name: 'Lôi Điện',
    color: '#ffee33',
    desc: 'Phóng tia sét giật lan giữa các mục tiêu gần kề.'
  },
  vampiric: {
    name: 'Huyết Tộc',
    color: '#dd2255',
    desc: 'Hút máu khi gây sát thương. Tăng khả năng sinh tồn cực lớn.'
  },
  thorns: {
    name: 'Gai Cốt',
    color: '#22bb77',
    desc: 'Phản sát thương cực mạnh khi nhận đòn đánh từ quái.'
  },
  summoner: {
    name: 'Chiêu Hồn',
    color: '#aa44ff',
    desc: 'Triệu hồi chiến binh xương cùng chiến đấu và chống đỡ.'
  }
};

export const ALL_PERK_CARDS: PerkCard[] = [
  // ==========================================
  // COMMON PERKS (14 thẻ - Xuất hiện chủ yếu ở phòng thường)
  // ==========================================
  {
    id: 'spiked_carapace',
    name: 'Mai Rùa Gai Nhọn',
    rarity: 'common',
    synergy: 'thorns',
    icon: 'icon_thorns',
    description: 'Phản 12 ST chuẩn lại kẻ địch mỗi khi nhận đòn đánh.',
    stats: { thorns: 12, def: 5 }
  },
  {
    id: 'berserk_rage',
    name: 'Cuồng Nộ Chiến Trận',
    rarity: 'common',
    icon: 'icon_sword',
    description: 'Tăng 6 Sát thương cơ bản và 8% Tốc độ đánh.',
    stats: { atk: 6, attackSpeed: 0.08 }
  },
  {
    id: 'titan_plate',
    name: 'Giáp Bản Titan',
    rarity: 'common',
    icon: 'icon_shield',
    description: 'Tăng 35 Máu tối đa và 6% Giảm sát thương.',
    stats: { maxHp: 35, hp: 35, def: 6 }
  },
  {
    id: 'shadow_boots',
    name: 'Giày Bóng Đêm',
    rarity: 'common',
    icon: 'icon_boot',
    description: 'Tăng 10% Tỉ lệ Né đòn và 15 Tốc độ di chuyển.',
    stats: { dodgeRate: 0.1, speed: 15 }
  },
  {
    id: 'flame_spark',
    name: 'Tàn Lửa Âm Ỉ',
    rarity: 'common',
    synergy: 'fire',
    icon: 'icon_fire',
    description: '+4 Công, đòn đánh có 20% cơ hội thiêu đốt 8 ST/giây.',
    stats: { atk: 4 }
  },
  {
    id: 'frost_touch',
    name: 'Chạm Băng Giá',
    rarity: 'common',
    synergy: 'frost',
    icon: 'icon_frost',
    description: '+4 Giáp, đòn đánh làm chậm tốc độ kẻ địch 15%.',
    stats: { def: 4 }
  },
  {
    id: 'static_touch',
    name: 'Tia Điện Tích',
    rarity: 'common',
    synergy: 'lightning',
    icon: 'icon_lightning',
    description: '+8% Tốc độ đánh, đòn đánh tích lũy tĩnh điện.',
    stats: { attackSpeed: 0.08 }
  },
  {
    id: 'blood_drop',
    name: 'Giọt Huyết Tươi',
    rarity: 'common',
    synergy: 'vampiric',
    icon: 'icon_vampire',
    description: '+5% Hút máu, tăng 15 Máu tối đa.',
    stats: { lifeSteal: 0.05, maxHp: 15, hp: 15 }
  },
  {
    id: 'bone_fragment',
    name: 'Mảnh Xương Mục',
    rarity: 'common',
    synergy: 'thorns',
    icon: 'icon_thorns',
    description: '+8 Phản đòn gai, +20 Máu tối đa.',
    stats: { thorns: 8, maxHp: 20, hp: 20 }
  },
  {
    id: 'spirit_whisper',
    name: 'Lời Thì Thầm',
    rarity: 'common',
    synergy: 'summoner',
    icon: 'icon_summon',
    description: '+3 Công, tăng 20% lượng máu của đệ xương trợ chiến.',
    stats: { atk: 3 }
  },
  {
    id: 'iron_skin',
    name: 'Da Sắt Thép',
    rarity: 'common',
    icon: 'icon_shield',
    description: '+8% Giáp giảm sát thương, +20 Máu tối đa.',
    stats: { def: 8, maxHp: 20, hp: 20 }
  },
  {
    id: 'sharp_edge',
    name: 'Mài Kiếm Bén',
    rarity: 'common',
    icon: 'icon_sword',
    description: '+6 Sát thương vật lý cơ bản cho mọi đòn đánh.',
    stats: { atk: 6 }
  },
  {
    id: 'fleet_footed',
    name: 'Khinh Công',
    rarity: 'common',
    icon: 'icon_boot',
    description: '+25 Tốc độ di chuyển và +8% Tỉ lệ né tránh đòn.',
    stats: { speed: 25, dodgeRate: 0.08 }
  },
  {
    id: 'vitality_essence',
    name: 'Tinh Hoa Sinh Lực',
    rarity: 'common',
    icon: 'icon_shield',
    description: 'Gia tăng +40 Máu tối đa vĩnh viễn trong run.',
    stats: { maxHp: 40, hp: 40 }
  },
  {
    id: 'ranger_ambush',
    name: 'Phục Kích Rừng Sâu',
    rarity: 'common',
    icon: 'icon_cloak_ranger',
    description: '+10% Tỉ lệ Bạo kích và +20 Tốc độ di chuyển.',
    stats: { critRate: 0.1, speed: 20 }
  },
  {
    id: 'glacial_shards',
    name: 'Mảnh Băng Sắc Nhọn',
    rarity: 'common',
    synergy: 'frost',
    icon: 'icon_frost',
    description: '+5 Công, +5 Giáp, đòn đánh có 30% phóng mảnh băng làm chậm kẻ địch.',
    stats: { atk: 5, def: 5 }
  },
  {
    id: 'iron_discipline',
    name: 'Kỷ Luật Thép',
    rarity: 'common',
    icon: 'icon_sword_iron',
    description: '+5 Sát thương, +25 Máu tối đa và +5% Giáp giảm sát thương.',
    stats: { atk: 5, maxHp: 25, hp: 25, def: 5 }
  },

  // ==========================================
  // RARE PERKS (9 thẻ - Tỷ lệ vừa phải, tăng ở Elite)
  // ==========================================
  {
    id: 'fire_blade',
    name: 'Lưỡi Kiếm Rực Lửa',
    rarity: 'rare',
    synergy: 'fire',
    icon: 'icon_fire',
    description: 'Đòn đánh gây thiêu đốt kẻ địch (15 ST mỗi giây).',
    stats: { atk: 7 }
  },
  {
    id: 'frost_edge',
    name: 'Lưỡi Băng Hàn Khí',
    rarity: 'rare',
    synergy: 'frost',
    icon: 'icon_frost',
    description: 'Làm chậm tốc độ của kẻ địch bị trúng đòn 30%.',
    stats: { atk: 5, def: 6 }
  },
  {
    id: 'lightning_spark',
    name: 'Tia Sét Lan Chuyền',
    rarity: 'rare',
    synergy: 'lightning',
    icon: 'icon_lightning',
    description: 'Mỗi đòn đánh thứ 3 giật sét lan sang 2 quái lân cận.',
    stats: { attackSpeed: 0.15 }
  },
  {
    id: 'vampiric_fang',
    name: 'Nanh Vuốt Ma Cà Rồng',
    rarity: 'rare',
    synergy: 'vampiric',
    icon: 'icon_vampire',
    description: 'Hút 10% lượng sát thương gây ra thành máu cho bản thân.',
    stats: { lifeSteal: 0.1, atk: 4 }
  },
  {
    id: 'raise_dead',
    name: 'Thuật Chiêu Hồn',
    rarity: 'rare',
    synergy: 'summoner',
    icon: 'icon_summon',
    description: 'Tiêu diệt quái có 30% tỉ lệ gọi 1 Đệ Xương trợ chiến.',
    stats: { atk: 4 }
  },
  {
    id: 'deadly_precision',
    name: 'Đòn Đánh Tử Huyệt',
    rarity: 'rare',
    icon: 'icon_crit',
    description: 'Tăng 12% Tỉ lệ Bạo kích và +35% Sát thương bạo kích.',
    stats: { critRate: 0.12, critDmg: 0.35 }
  },
  {
    id: 'barbed_armor',
    name: 'Giáp Gai Bộc Lộ',
    rarity: 'rare',
    synergy: 'thorns',
    icon: 'icon_thorns',
    description: 'Phản 20 ST chuẩn và tăng thêm +10 Giáp bảo vệ.',
    stats: { thorns: 20, def: 10 }
  },
  {
    id: 'swift_executioner',
    name: 'Đồ Tể Tốc Độ',
    rarity: 'rare',
    icon: 'icon_sword',
    description: '+15% Tốc độ đánh và +8% Tỉ lệ bạo kích.',
    stats: { attackSpeed: 0.15, critRate: 0.08 }
  },
  {
    id: 'honed_instincts',
    name: 'Bản Năng Sinh Tồn',
    rarity: 'rare',
    icon: 'icon_boot',
    description: '+12% Né đòn, +20 Tốc chạy và +30 Máu tối đa.',
    stats: { dodgeRate: 0.12, speed: 20, maxHp: 30, hp: 30 }
  },
  {
    id: 'frost_arrow',
    name: 'Mũi Tên Băng Giá',
    rarity: 'rare',
    synergy: 'frost',
    icon: 'icon_bow_frost',
    description: '+6 Sát thương, đòn đánh tầm xa làm chậm quái 25% và +12% Tốc đánh.',
    stats: { atk: 6, attackSpeed: 0.12 }
  },
  {
    id: 'thunder_smash',
    name: 'Kích Nổ Sấm Sét',
    rarity: 'rare',
    synergy: 'lightning',
    icon: 'icon_hammer_thunder',
    description: '+8 Sát thương, +8% Chí mạng; đòn đánh nặng giải phóng xung lôi chấn.',
    stats: { atk: 8, critRate: 0.08 }
  },
  {
    id: 'toxic_daggers',
    name: 'Đoản Đao Kịch Độc',
    rarity: 'rare',
    synergy: 'vampiric',
    icon: 'icon_daggers_poison',
    description: '+18% Tốc độ đánh và +6% Hút máu, đòn đánh tích lũy độc tố.',
    stats: { attackSpeed: 0.18, lifeSteal: 0.06 }
  },
  {
    id: 'void_weave',
    name: 'Dệt Lưới Hư Vô',
    rarity: 'rare',
    synergy: 'summoner',
    icon: 'icon_robe_void',
    description: 'Giảm 15% hồi chiêu kỹ năng, đệ xương nhận thêm 30% giáp chống đỡ.',
    stats: { def: 8, cooldownReduction: 0.15 }
  },
  {
    id: 'arcane_overload',
    name: 'Quá Tải Bí Thuật',
    rarity: 'rare',
    synergy: 'lightning',
    icon: 'icon_staff_arcane',
    description: '+9 Sát thương, -10% Hồi chiêu; mỗi đòn đánh phóng tia ma pháp giật lan.',
    stats: { atk: 9, cooldownReduction: 0.1 }
  },

  // ==========================================
  // EPIC PERKS (7 thẻ - Hiếm gặp ở phòng thường, xuất hiện ở Elite/Boss)
  // ==========================================
  {
    id: 'fire_eruption',
    name: 'Bộc Phá Hỏa Ngục',
    rarity: 'epic',
    synergy: 'fire',
    icon: 'icon_fire',
    description: 'Quái chết phát nổ gây 40 ST diện rộng ra xung quanh.',
    stats: { atk: 10 }
  },
  {
    id: 'deep_freeze',
    name: 'Băng Giá Vĩnh Cửu',
    rarity: 'epic',
    synergy: 'frost',
    icon: 'icon_frost',
    description: '20% cơ hội đóng băng quái 1.5s; gây x2 ST chí mạng lên quái đóng băng.',
    stats: { critRate: 0.12 }
  },
  {
    id: 'storm_caller',
    name: 'Bão Sấm Phẫn Nộ',
    rarity: 'epic',
    synergy: 'lightning',
    icon: 'icon_lightning',
    description: 'Đòn chí mạng giáng một cột sấm sét gây choáng diện rộng.',
    stats: { critRate: 0.1, critDmg: 0.4 }
  },
  {
    id: 'blood_surge',
    name: 'Huyết Triều Cuồng Nộ',
    rarity: 'epic',
    synergy: 'vampiric',
    icon: 'icon_vampire',
    description: 'Khi máu dưới 40%, tăng 50% Tốc đánh và 30% Hút máu.',
    stats: { maxHp: 30, hp: 30 }
  },
  {
    id: 'bone_nova',
    name: 'Vụ Nổ Gai Xương',
    rarity: 'epic',
    synergy: 'thorns',
    icon: 'icon_thorns',
    description: 'Bị đánh 5 lần sẽ phóng một vòng gai xương gây 45 ST xung quanh.',
    stats: { thorns: 25, maxHp: 40, hp: 40 }
  },
  {
    id: 'undead_army',
    name: 'Quân Đoàn Bất Tử',
    rarity: 'epic',
    synergy: 'summoner',
    icon: 'icon_summon',
    description: 'Đệ Xương nhận 100% chỉ số công của bạn và tự nổ khi chết.',
    stats: { maxHp: 25, hp: 25 }
  },
  {
    id: 'titans_wrath',
    name: 'Cơn Giận Titan',
    rarity: 'epic',
    icon: 'icon_shield',
    description: '+80 Máu tối đa, +10 Sát thương và +12 Giáp bảo vệ.',
    stats: { maxHp: 80, hp: 80, atk: 10, def: 12 }
  },
  {
    id: 'reaper_harvest',
    name: 'Gặt Hái Linh Hồn',
    rarity: 'epic',
    synergy: 'summoner',
    icon: 'icon_scythe_dark',
    description: '+12 Công, -12% Hồi chiêu; mỗi 3 quái hạ gục hồi 15 HP và gọi 1 Đệ Xương.',
    stats: { atk: 12, cooldownReduction: 0.12 }
  },
  {
    id: 'holy_radiance',
    name: 'Thánh Quang Hộ Thể',
    rarity: 'epic',
    synergy: 'fire',
    icon: 'icon_sword_holy',
    description: '+14 Công, +50 HP; hào quang lửa thánh thiêu đốt 25 ST/giây quái vật cận kề.',
    stats: { atk: 14, maxHp: 50, hp: 50 }
  },
  {
    id: 'colossus_bastion',
    name: 'Pháo Đài Khổng Lồ',
    rarity: 'epic',
    synergy: 'thorns',
    icon: 'icon_plate_titan',
    description: '+100 Máu tối đa, phản 30 ST gai chuẩn và +12% Giáp bảo vệ.',
    stats: { maxHp: 100, hp: 100, thorns: 30, def: 12 }
  },
  {
    id: 'vampiric_frenzy',
    name: 'Huyết Cuồng Nộ',
    rarity: 'epic',
    synergy: 'vampiric',
    icon: 'icon_vampire',
    description: '+25% Tốc độ đánh và +12% Hút máu, nhân đôi hiệu quả khi máu dưới 50%.',
    stats: { attackSpeed: 0.25, lifeSteal: 0.12 }
  },

  // ==========================================
  // LEGENDARY PERKS (4 thẻ - Cực phẩm tối thượng, chỉ rơi ở Boss/rương bí mật)
  // ==========================================
  {
    id: 'apocalypse_inferno',
    name: 'Hỏa Ngục Tận Thế',
    rarity: 'legendary',
    synergy: 'fire',
    icon: 'icon_fire',
    description: '+20 Công, đòn đánh thiêu đốt toàn bộ quái vật trên sàn đấu (30 ST/giây).',
    stats: { atk: 20 }
  },
  {
    id: 'cocytus_absolute_zero',
    name: 'Độ Không Tuyệt Đối',
    rarity: 'legendary',
    synergy: 'frost',
    icon: 'icon_frost',
    description: 'Mỗi 8 giây đóng băng toàn thể kẻ địch trong 2.5 giây, nhận x2.5 sát thương.',
    stats: { critRate: 0.15, critDmg: 0.5 }
  },
  {
    id: 'zeus_divine_thunder',
    name: 'Thần Lôi Diệt Thế',
    rarity: 'legendary',
    synergy: 'lightning',
    icon: 'icon_lightning',
    description: '+30% Tốc đánh, mỗi đòn đánh phóng sấm sét giật liên hoàn nổ tung 3 mục tiêu.',
    stats: { attackSpeed: 0.3, critRate: 0.15 }
  },
  {
    id: 'immortal_monarch',
    name: 'Quân Vương Bất Tử',
    rarity: 'legendary',
    synergy: 'summoner',
    icon: 'icon_summon',
    description: 'Giới hạn đệ xương tăng lên 6, đệ chia sẻ gánh chịu 40% sát thương cho bạn.',
    stats: { maxHp: 60, hp: 60, def: 15 }
  },
  {
    id: 'aegis_bulwark',
    name: 'Thần Khiên Bất Diệt',
    rarity: 'legendary',
    synergy: 'thorns',
    icon: 'icon_shield_aegis',
    description: '+150 Máu tối đa, +25% Giáp, phản 50 ST gai và tạo khiên chắn 120 HP khi nguy cấp.',
    stats: { maxHp: 150, hp: 150, def: 25, thorns: 50 }
  },
  {
    id: 'thunderstorm_wrath',
    name: 'Cơn Thịnh Nộ Của Thần Sấm',
    rarity: 'legendary',
    synergy: 'lightning',
    icon: 'icon_hammer_thunder',
    description: '+35 Công, +25% Bạo kích, mỗi đòn đánh chí mạng tạo bão sấm hủy diệt toàn sàn.',
    stats: { atk: 35, critRate: 0.25, critDmg: 0.5 }
  }
];

export const SHOP_ITEMS: EquipmentItem[] = [
  {
    id: 'shop_flame_sword',
    name: 'Đại Đao Hỏa Long',
    category: 'weapon',
    rarity: 'rare',
    synergy: 'fire',
    description: '+14 Công, đòn đánh tạo sóng lửa thiêu đốt.',
    cost: 50,
    stats: { atk: 14 }
  },
  {
    id: 'shop_glacial_shield',
    name: 'Khiên Băng Cổ Đại',
    category: 'armor',
    rarity: 'rare',
    synergy: 'frost',
    description: '+60 HP, +15% Giáp, giảm 20% tốc độ kẻ tấn công.',
    cost: 55,
    stats: { maxHp: 60, hp: 60, def: 15 }
  },
  {
    id: 'shop_thunder_ring',
    name: 'Nhẫn Bão Lôi',
    category: 'relic',
    rarity: 'epic',
    synergy: 'lightning',
    description: '+25% Tốc đánh, gọi sấm sét sau mỗi 4 đòn đánh.',
    cost: 75,
    stats: { attackSpeed: 0.25, critRate: 0.08 }
  },
  {
    id: 'shop_vampire_cloak',
    name: 'Áo Choàng Bá Tước',
    category: 'armor',
    rarity: 'epic',
    synergy: 'vampiric',
    description: '+15% Hút máu, +30 HP, biến mất 0.5s khi nguy cấp.',
    cost: 80,
    stats: { lifeSteal: 0.15, maxHp: 30, hp: 30 }
  },
  {
    id: 'shop_health_potion',
    name: 'Thần Dược Hồi Sinh',
    category: 'relic',
    rarity: 'common',
    icon: 'icon_potion_hp',
    description: 'Hồi phục ngay lập tức 80 HP.',
    cost: 30,
    stats: { hp: 80 }
  },
  {
    id: 'shop_frost_bow',
    name: 'Cung Băng Tuyết Ngàn Năm',
    category: 'weapon',
    rarity: 'rare',
    synergy: 'frost',
    icon: 'icon_bow_frost',
    description: '+12 Sát thương, +18% Tốc đánh, bắn tên băng làm chậm quái 25%.',
    cost: 60,
    stats: { atk: 12, attackSpeed: 0.18, def: 5 }
  },
  {
    id: 'shop_tempest_bow',
    name: 'Lôi Phong Thần Cung',
    category: 'weapon',
    rarity: 'epic',
    synergy: 'lightning',
    icon: 'icon_bow_frost',
    description: '+20 Sát thương, +28% Tốc đánh, +14% Bạo kích; giải phóng bão tên sấm sét.',
    cost: 86,
    stats: { atk: 20, attackSpeed: 0.28, critRate: 0.14 }
  },
  {
    id: 'shop_thunder_hammer',
    name: 'Chiến Chuỳ Lôi Đình',
    category: 'weapon',
    rarity: 'rare',
    synergy: 'lightning',
    icon: 'icon_hammer_thunder',
    description: '+18 Sát thương, +10% Bạo kích; đòn đập lan toả xung điện gây tê liệt.',
    cost: 65,
    stats: { atk: 18, critRate: 0.1, speed: -5 }
  },
  {
    id: 'shop_molten_hammer',
    name: 'Dung Nham Thần Chuỳ',
    category: 'weapon',
    rarity: 'epic',
    synergy: 'fire',
    icon: 'icon_hammer_thunder',
    description: '+30 Sát thương, +45% ST bạo kích; đòn đánh nổ tung chấn động dung nham.',
    cost: 88,
    stats: { atk: 30, critDmg: 0.45, thorns: 15 }
  },
  {
    id: 'shop_dark_scythe',
    name: 'Lưỡi Hái Hư Vô',
    category: 'weapon',
    rarity: 'epic',
    synergy: 'summoner',
    icon: 'icon_scythe_dark',
    description: '+22 Sát thương, -15% Hồi chiêu; mỗi quái chết cường hoá linh hồn Đệ Xương.',
    cost: 85,
    stats: { atk: 22, cooldownReduction: 0.15, maxHp: 40, hp: 40 }
  },
  {
    id: 'shop_blood_scythe',
    name: 'Huyết Nguyệt Liêm',
    category: 'weapon',
    rarity: 'rare',
    synergy: 'vampiric',
    icon: 'icon_scythe_dark',
    description: '+16 Sát thương, +12% Hút máu; hồi phục sinh mệnh sau mỗi nhát chém.',
    cost: 64,
    stats: { atk: 16, lifeSteal: 0.12, maxHp: 30, hp: 30 }
  },
  {
    id: 'shop_poison_daggers',
    name: 'Song Đao Độc Xà',
    category: 'weapon',
    rarity: 'rare',
    synergy: 'vampiric',
    icon: 'icon_daggers_poison',
    description: '+10 Sát thương, +22% Tốc đánh, +8% Hút máu; tẩm kịch độc rút máu quái.',
    cost: 55,
    stats: { atk: 10, attackSpeed: 0.22, lifeSteal: 0.08 }
  },
  {
    id: 'shop_arcane_staff',
    name: 'Pháp Trượng Bí Thuật',
    category: 'weapon',
    rarity: 'rare',
    synergy: 'lightning',
    icon: 'icon_staff_arcane',
    description: '+15 Sát thương, -12% Hồi chiêu, +8% Bạo kích; phóng chuỗi ma sét lan tỏa.',
    cost: 62,
    stats: { atk: 15, cooldownReduction: 0.12, critRate: 0.08 }
  },
  {
    id: 'shop_holy_sword',
    name: 'Thánh Kiếm Quang Huy',
    category: 'weapon',
    rarity: 'epic',
    synergy: 'fire',
    icon: 'icon_sword_holy',
    description: '+26 Sát thương, +15% Bạo kích, +50 HP; ánh thánh quang thiêu đốt tà linh.',
    cost: 90,
    stats: { atk: 26, critRate: 0.15, maxHp: 50, hp: 50 }
  },
  {
    id: 'shop_iron_broadsword',
    name: 'Đại Kiếm Thép Rèn',
    category: 'weapon',
    rarity: 'common',
    icon: 'icon_sword_iron',
    description: '+8 Sát thương, +4% Giáp bảo hộ; vũ khí cân bằng, uy lực đáng tin cậy.',
    cost: 35,
    stats: { atk: 8, def: 4 }
  },
  {
    id: 'shop_titan_plate',
    name: 'Đại Giáp Thần Titan',
    category: 'armor',
    rarity: 'rare',
    synergy: 'thorns',
    icon: 'icon_plate_titan',
    description: '+90 Máu tối đa, +18% Giáp; phản 16 ST gai chuẩn lên kẻ dám tấn công.',
    cost: 70,
    stats: { maxHp: 90, hp: 90, def: 18, thorns: 16 }
  },
  {
    id: 'shop_void_robe',
    name: 'Pháp Bào Hư Vô',
    category: 'armor',
    rarity: 'rare',
    synergy: 'summoner',
    icon: 'icon_robe_void',
    description: '+45 Máu, +8% Giáp, -18% Hồi chiêu; khuếch đại ma pháp bóng tối.',
    cost: 58,
    stats: { maxHp: 45, hp: 45, def: 8, cooldownReduction: 0.18 }
  },
  {
    id: 'shop_ranger_cloak',
    name: 'Áo Choàng Du Hiệp',
    category: 'armor',
    rarity: 'common',
    synergy: 'frost',
    icon: 'icon_cloak_ranger',
    description: '+22 Tốc độ di chuyển, +12% Né đòn, +6% Giáp; lướt đi thoăn thoắt.',
    cost: 45,
    stats: { speed: 22, dodgeRate: 0.12, def: 6 }
  },
  {
    id: 'shop_tower_shield',
    name: 'Trọng Thuẫn Thành Lũy',
    category: 'armor',
    rarity: 'rare',
    synergy: 'thorns',
    icon: 'icon_shield_tower',
    description: '+75 Máu, +20% Giáp, phản 22 ST gai; lá chắn vững chãi như pháo đài.',
    cost: 68,
    stats: { maxHp: 75, hp: 75, def: 20, thorns: 22 }
  },
  {
    id: 'shop_aegis_shield',
    name: 'Khiên Thần Rạng Đông',
    category: 'armor',
    rarity: 'epic',
    synergy: 'fire',
    icon: 'icon_shield_aegis',
    description: '+120 Máu, +24% Giáp, +12 Công; khiên lửa thần hộ mệnh thiêu rụi kẻ địch.',
    cost: 95,
    stats: { maxHp: 120, hp: 120, def: 24, atk: 12 }
  },
  {
    id: 'shop_speed_potion',
    name: 'Bình Dược Tật Phong',
    category: 'relic',
    rarity: 'common',
    icon: 'icon_potion_speed',
    description: '+25 Tốc độ di chuyển và +10% Tốc đánh trong toàn bộ cuộc viễn chinh.',
    cost: 40,
    stats: { speed: 25, attackSpeed: 0.1 }
  }
];

export class SynergyManager {
  public static getSynergyCount(perks: PerkCard[], items: EquipmentItem[]): Record<SynergyType, number> {
    const counts: Record<SynergyType, number> = {
      fire: 0,
      frost: 0,
      lightning: 0,
      vampiric: 0,
      thorns: 0,
      summoner: 0
    };

    for (const perk of perks) {
      if (perk.synergy) {
        counts[perk.synergy]++;
      }
    }
    for (const item of items) {
      if (item.synergy) {
        counts[item.synergy]++;
      }
    }

    return counts;
  }

  /**
   * Chọn `count` lá bài ngẫu nhiên theo tỷ lệ chuẩn Roguelite dựa vào loại phòng:
   * - Phòng thường (battle): 72% Common, 23% Rare, 5% Epic, 0% Legendary.
   * - Phòng tinh anh (elite): 35% Common, 45% Rare, 18% Epic, 2% Legendary.
   * - Phòng chúa tể (boss): 5% Common, 35% Rare, 45% Epic, 15% Legendary.
   * - Rương kho báu (chest): 60% Common, 30% Rare, 10% Epic, 0% Legendary.
   */
  public static getWeightedPerks(count: number, nodeType: string = 'battle'): PerkCard[] {
    let weights: { common: number; rare: number; epic: number; legendary: number };

    if (nodeType === 'boss') {
      weights = { common: 0.05, rare: 0.35, epic: 0.45, legendary: 0.15 };
    } else if (nodeType === 'elite') {
      weights = { common: 0.35, rare: 0.45, epic: 0.18, legendary: 0.02 };
    } else if (nodeType === 'chest') {
      weights = { common: 0.60, rare: 0.30, epic: 0.10, legendary: 0.00 };
    } else {
      // Normal battle
      weights = { common: 0.72, rare: 0.23, epic: 0.05, legendary: 0.00 };
    }

    const availablePool = [...ALL_PERK_CARDS];
    const selected: PerkCard[] = [];

    for (let i = 0; i < count; i++) {
      if (availablePool.length === 0) break;

      const roll = Math.random();
      let targetRarity: 'common' | 'rare' | 'epic' | 'legendary' = 'common';

      if (roll < weights.legendary) {
        targetRarity = 'legendary';
      } else if (roll < weights.legendary + weights.epic) {
        targetRarity = 'epic';
      } else if (roll < weights.legendary + weights.epic + weights.rare) {
        targetRarity = 'rare';
      } else {
        targetRarity = 'common';
      }

      // Filter matching target rarity
      let candidates = availablePool.filter((c) => c.rarity === targetRarity);

      // Fallback hierarchy if target bucket has no cards left in availablePool
      if (candidates.length === 0) {
        const fallbackOrder: ('legendary' | 'epic' | 'rare' | 'common')[] = ['epic', 'rare', 'common'];
        for (const fb of fallbackOrder) {
          candidates = availablePool.filter((c) => c.rarity === fb);
          if (candidates.length > 0) break;
        }
      }

      if (candidates.length === 0) {
        candidates = availablePool;
      }

      const pickIndex = Math.floor(Math.random() * candidates.length);
      const chosenCard = candidates[pickIndex];

      selected.push(chosenCard);

      // Remove chosen card so cards in the same draft are distinct
      const poolIdx = availablePool.findIndex((c) => c.id === chosenCard.id);
      if (poolIdx !== -1) {
        availablePool.splice(poolIdx, 1);
      }
    }

    return selected;
  }
}
