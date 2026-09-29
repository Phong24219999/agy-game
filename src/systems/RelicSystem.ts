import { RelicItem } from '../types/game';

export const ALL_RELICS: RelicItem[] = [
  // ==========================================
  // EXISTING RELICS (Enhanced with new icons)
  // ==========================================
  {
    id: 'relic_cursed_heart',
    name: 'Trái Tim Hắc Ám',
    rarity: 'rare',
    trigger: 'passive',
    icon: 'icon_relic_heart',
    description: '+40% Sát thương toàn phần, nhưng mất 2 Máu mỗi giây.',
    stats: { atk: 18 }
  },
  {
    id: 'relic_chrono_glass',
    name: 'Đồng Hồ Cát Cổ Đại',
    rarity: 'epic',
    trigger: 'on_kill',
    icon: 'icon_relic_chrono',
    description: 'Mỗi khi hạ 10 quái vật, đóng băng thời gian toàn bộ kẻ địch trong 3 giây.',
    specialEffect: 'time_freeze'
  },
  {
    id: 'relic_vampiric_claw',
    name: 'Móng Vuốt Ma Cà Rồng',
    rarity: 'rare',
    trigger: 'on_hit',
    icon: 'icon_vampire',
    description: 'Đòn chí mạng hồi phục 25% lượng sát thương gây ra.',
    stats: { critRate: 0.1, lifeSteal: 0.1 }
  },
  {
    id: 'relic_sunfire_aegis',
    name: 'Vòng Lửa Vĩnh Hằng',
    rarity: 'epic',
    trigger: 'time',
    icon: 'icon_relic_sunfire',
    description: 'Tỏa hào quang thiêu đốt 30 Sát thương/giây lên mọi kẻ địch xung quanh 130px.',
    stats: { maxHp: 40, hp: 40 }
  },
  {
    id: 'relic_kings_ossuary',
    name: 'Xương Khô Của Vua',
    rarity: 'epic',
    trigger: 'passive',
    icon: 'icon_relic_skull',
    description: 'Tăng giới hạn đệ xương triệu hồi từ 3 lên 6, đệ nhận thêm +50% HP.',
    stats: { def: 10 }
  },
  {
    id: 'relic_philosopher_stone',
    name: 'Hòn Đá Triết Gia',
    rarity: 'legendary',
    trigger: 'passive',
    icon: 'icon_gold_coin',
    description: 'Nhận gấp đôi (+100%) lượng Vàng rơi ra và giảm 25% giá vật phẩm trong Shop.',
    specialEffect: 'double_gold'
  },
  {
    id: 'relic_storm_essence',
    name: 'Linh Hồn Bão Tố',
    rarity: 'rare',
    trigger: 'on_hit',
    icon: 'icon_lightning',
    description: '35% cơ hội mỗi đòn đánh phóng tia sét nổ lan 3 mục tiêu lân cận.',
    stats: { attackSpeed: 0.15 }
  },
  {
    id: 'relic_mirror_aegis',
    name: 'Khiên Phản Ma',
    rarity: 'rare',
    trigger: 'on_damaged',
    icon: 'icon_shield_tower',
    description: 'Tăng gấp đôi (+100%) sát thương phản đòn gai và +15% Giáp.',
    stats: { thorns: 20, def: 15 }
  },
  {
    id: 'relic_berserker_fetish',
    name: 'Bùa Cuồng Nộ',
    rarity: 'epic',
    trigger: 'low_hp',
    icon: 'icon_sword',
    description: 'Khi máu dưới 35%, tăng 60% Sát thương và 40% Tốc độ đánh.',
    stats: { atk: 10 }
  },
  {
    id: 'relic_frost_core',
    name: 'Lõi Băng Vĩnh Cửu',
    rarity: 'rare',
    trigger: 'passive',
    icon: 'icon_frost',
    description: 'Kẻ địch trong phạm vi 120px bị làm chậm 35% tốc độ di chuyển và tốc đánh.',
    stats: { def: 10 }
  },
  {
    id: 'relic_executioner_axe',
    name: 'Rìu Đao Phủ',
    rarity: 'rare',
    trigger: 'on_hit',
    icon: 'icon_sword_iron',
    description: 'Gây thêm 100% sát thương bạo kích lên kẻ địch có dưới 30% Máu.',
    stats: { critDmg: 0.5 }
  },
  {
    id: 'relic_phoenix_feather',
    name: 'Lông Vũ Phượng Hoàng',
    rarity: 'legendary',
    trigger: 'on_damaged',
    icon: 'icon_relic_feather',
    description: 'Hồi sinh 1 lần duy nhất trong toàn bộ Run với 50% Máu tối đa khi ngã xuống.',
    specialEffect: 'revive'
  },
  {
    id: 'relic_void_pendant',
    name: 'Mặt Dây Chuyền Hư Vô',
    rarity: 'epic',
    trigger: 'passive',
    icon: 'icon_soul_gem',
    description: 'Giảm 30% thời gian hồi chiêu của tất cả kỹ năng chủ động.',
    stats: { cooldownReduction: 0.3 }
  },
  {
    id: 'relic_shadow_cloak',
    name: 'Áo Choàng Bóng Ma',
    rarity: 'rare',
    trigger: 'passive',
    icon: 'icon_cloak_ranger',
    description: 'Tăng 20% Tỉ lệ Né đòn. Sau khi né thành công, đòn đánh tiếp theo 100% bạo kích.',
    stats: { dodgeRate: 0.2 }
  },
  {
    id: 'relic_alchemist_flask',
    name: 'Bình Giả Kim Thuật',
    rarity: 'common',
    trigger: 'passive',
    icon: 'icon_potion_hp',
    description: 'Mỗi khi hồi máu, nhận thêm một lớp khiên chắn bằng 50 HP.',
    stats: { maxHp: 30, hp: 30 }
  },
  {
    id: 'relic_bounty_scroll',
    name: 'Cuộn Giấy Truy Nã',
    rarity: 'common',
    trigger: 'passive',
    icon: 'icon_scroll_lightning',
    description: 'Tiêu diệt Quái Tinh Anh và Trùm Tầng nhận thêm +50 Vàng và +15 Linh Hồn.',
    specialEffect: 'bounty_bonus'
  },

  // ==========================================
  // NEW LEGENDARY & EPIC RELICS (10 new relics)
  // ==========================================
  {
    id: 'relic_holy_grail',
    name: 'Chén Thánh Bất Tử',
    rarity: 'legendary',
    trigger: 'low_hp',
    icon: 'icon_relic_grail',
    description: 'Khi máu dưới 25%, lập tức hồi phục 100% HP và ban 3 giây bất tử (1 lần mỗi 90s).',
    stats: { maxHp: 100, hp: 100, def: 15 },
    specialEffect: 'holy_resurrection'
  },
  {
    id: 'relic_eye_of_abyss',
    name: 'Con Mắt Vực Sâu',
    rarity: 'legendary',
    trigger: 'passive',
    icon: 'icon_relic_eye',
    description: 'Thấu thị tử huyệt quái vật. Mọi đòn đánh tăng +20% Tỉ lệ bạo kích và +60% ST bạo.',
    stats: { critRate: 0.2, critDmg: 0.6, atk: 25 },
    specialEffect: 'abyss_sight'
  },
  {
    id: 'relic_quiver_endless_frost',
    name: 'Bao Tên Hàn Băng Vô Tận',
    rarity: 'epic',
    trigger: 'on_hit',
    icon: 'icon_bow_frost',
    description: 'Đòn đánh phóng mũi tên băng vĩnh cửu làm chậm 40% và giảm 25% sát thương quái.',
    stats: { atk: 18, attackSpeed: 0.25 },
    specialEffect: 'permafrost'
  },
  {
    id: 'relic_thunderstorm_core',
    name: 'Lõi Bão Lôi Cực Đại',
    rarity: 'legendary',
    trigger: 'on_hit',
    icon: 'icon_hammer_thunder',
    description: 'Mỗi đòn đánh gọi thiên lôi giáng xuống gây 80 ST sấm sét nổ lan 5 mục tiêu.',
    stats: { atk: 30, attackSpeed: 0.35, critRate: 0.15 },
    specialEffect: 'cataclysm_lightning'
  },
  {
    id: 'relic_undead_crown',
    name: 'Vương Miện Chúa Tể Vong Hồn',
    rarity: 'epic',
    trigger: 'on_kill',
    icon: 'icon_relic_skull',
    description: 'Hạ gục quái vật có 50% triệu hồi một chiến binh xương ma vương chiến đấu.',
    stats: { maxHp: 60, hp: 60, def: 10, cooldownReduction: 0.2 },
    specialEffect: 'skeleton_king'
  },
  {
    id: 'relic_titan_heart',
    name: 'Trái Tim Khổng Lồ Titan',
    rarity: 'legendary',
    trigger: 'passive',
    icon: 'icon_plate_titan',
    description: 'Tăng +250 Máu tối đa, +25% Giáp và phản 40 ST gai. Miễn nhiễm đánh văng lùi.',
    stats: { maxHp: 250, hp: 250, def: 25, thorns: 40 },
    specialEffect: 'unyielding_titan'
  },
  {
    id: 'relic_blood_chalice',
    name: 'Cốc Máu Huyết Thần',
    rarity: 'epic',
    trigger: 'on_hit',
    icon: 'icon_relic_heart',
    description: 'Hút 18% sát thương thành máu. Đòn đánh có 25% cơ hội hồi phục 20 HP trực tiếp.',
    stats: { lifeSteal: 0.18, atk: 15 },
    specialEffect: 'blood_drain'
  },
  {
    id: 'relic_chrono_sphere',
    name: 'Quả Cầu Thời Gian Cổ Đại',
    rarity: 'legendary',
    trigger: 'time',
    icon: 'icon_relic_chrono',
    description: 'Mỗi 15 giây ngưng đọng thời gian xung quanh người chơi trong 2.5 giây.',
    stats: { cooldownReduction: 0.35, speed: 30 },
    specialEffect: 'time_dilation'
  },
  {
    id: 'relic_sunfire_sigil',
    name: 'Phù Ấn Thái Dương Thần',
    rarity: 'epic',
    trigger: 'passive',
    icon: 'icon_relic_sunfire',
    description: 'Hào quang thiêu đốt dữ dội, gây 45 ST nhiệt mỗi giây lên mọi kẻ địch áp sát.',
    stats: { atk: 20, maxHp: 50, hp: 50 },
    specialEffect: 'sun_aura'
  },
  {
    id: 'relic_scythe_soulstone',
    name: 'Đá Hồn Lưỡi Hái Hư Vô',
    rarity: 'epic',
    trigger: 'on_kill',
    icon: 'icon_scythe_dark',
    description: 'Mỗi quái bị tiêu diệt tăng thêm +1 Công và +2 HP vĩnh viễn trong tầng hiện tại.',
    stats: { atk: 16, cooldownReduction: 0.15 },
    specialEffect: 'soul_reaping'
  }
];

export class RelicManager {
  public static hasRelic(relics: RelicItem[], relicId: string): boolean {
    return relics.some((r) => r.id === relicId);
  }

  public static getRelic(relics: RelicItem[], relicId: string): RelicItem | undefined {
    return relics.find((r) => r.id === relicId);
  }
}
