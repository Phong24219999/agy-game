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
    description: 'Hồi phục ngay lập tức 80 HP.',
    cost: 30,
    stats: { hp: 80 }
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
