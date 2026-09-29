import { RelicItem } from '../types/game';

export const ALL_RELICS: RelicItem[] = [
  {
    id: 'relic_cursed_heart',
    name: 'Trái Tim Hắc Ám',
    rarity: 'rare',
    trigger: 'passive',
    icon: 'icon_vampire',
    description: '+40% Sát thương toàn phần, nhưng mất 2 Máu mỗi giây.',
    stats: { atk: 18 }
  },
  {
    id: 'relic_chrono_glass',
    name: 'Đồng Hồ Cát Cổ Đại',
    rarity: 'epic',
    trigger: 'on_kill',
    icon: 'icon_boot',
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
    icon: 'icon_fire',
    description: 'Tỏa hào quang thiêu đốt 30 Sát thương/giây lên mọi kẻ địch xung quanh 130px.',
    stats: { maxHp: 40, hp: 40 }
  },
  {
    id: 'relic_kings_ossuary',
    name: 'Xương Khô Của Vua',
    rarity: 'epic',
    trigger: 'passive',
    icon: 'icon_summon',
    description: 'Tăng giới hạn đệ xương triệu hồi từ 3 lên 6, đệ nhận thêm +50% HP.',
    stats: { def: 10 }
  },
  {
    id: 'relic_philosopher_stone',
    name: 'Hòn Đá Triết Gia',
    rarity: 'legendary',
    trigger: 'passive',
    icon: 'icon_gold',
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
    icon: 'icon_thorns',
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
    icon: 'icon_sword',
    description: 'Gây thêm 100% sát thương bạo kích lên kẻ địch có dưới 30% Máu.',
    stats: { critDmg: 0.5 }
  },
  {
    id: 'relic_phoenix_feather',
    name: 'Lông Vũ Phượng Hoàng',
    rarity: 'legendary',
    trigger: 'on_damaged',
    icon: 'icon_fire',
    description: 'Hồi sinh 1 lần duy nhất trong toàn bộ Run với 50% Máu tối đa khi ngã xuống.',
    specialEffect: 'revive'
  },
  {
    id: 'relic_void_pendant',
    name: 'Mặt Dây Chuyền Hư Vô',
    rarity: 'epic',
    trigger: 'passive',
    icon: 'icon_soul',
    description: 'Giảm 30% thời gian hồi chiêu của tất cả kỹ năng chủ động.',
    stats: { cooldownReduction: 0.3 }
  },
  {
    id: 'relic_shadow_cloak',
    name: 'Áo Choàng Bóng Ma',
    rarity: 'rare',
    trigger: 'passive',
    icon: 'icon_boot',
    description: 'Tăng 20% Tỉ lệ Né đòn. Sau khi né thành công, đòn đánh tiếp theo 100% bạo kích.',
    stats: { dodgeRate: 0.2 }
  },
  {
    id: 'relic_alchemist_flask',
    name: 'Bình Giả Kim Thuật',
    rarity: 'common',
    trigger: 'passive',
    icon: 'icon_shield',
    description: 'Mỗi khi hồi máu, nhận thêm một lớp khiên chắn bằng 50 HP.',
    stats: { maxHp: 30, hp: 30 }
  },
  {
    id: 'relic_bounty_scroll',
    name: 'Cuộn Giấy Truy Nã',
    rarity: 'common',
    trigger: 'passive',
    icon: 'icon_crit',
    description: 'Tiêu diệt Quái Tinh Anh và Trùm Tầng nhận thêm +50 Vàng và +15 Linh Hồn.',
    specialEffect: 'bounty_bonus'
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
