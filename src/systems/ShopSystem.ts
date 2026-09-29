import { EquipmentItem, ItemRarity, SynergyType } from '../types/game';
import { SeededRNG } from './SeededRNG';

/**
 * Kho dược phẩm hồi phục xuất hiện cố định tại Ô 1 của Cửa hàng.
 * Giá cơ bản: 30 - 45 Vàng.
 */
export const POTION_CATALOG: EquipmentItem[] = [
  {
    id: 'shop_health_potion',
    name: 'Bình Dược Huyết Sắc',
    category: 'relic',
    rarity: 'common',
    description: 'Hồi phục ngay lập tức 80 HP khi mua.',
    cost: 35,
    stats: { hp: 80 }
  },
  {
    id: 'shop_potion_vitality',
    name: 'Tinh Chất Sinh Lực',
    category: 'relic',
    rarity: 'common',
    description: 'Dược dịch tinh khiết hồi phục 110 HP tức thì.',
    cost: 42,
    stats: { hp: 110 }
  },
  {
    id: 'shop_potion_rejuvenation',
    name: 'Thần Dược Phục Hồi',
    category: 'relic',
    rarity: 'common',
    description: 'Hồi phục 140 HP, ổn định sinh mệnh trước hiểm nguy.',
    cost: 45,
    stats: { hp: 140 }
  }
];

/**
 * Kho trang bị phong phú (FULL_EQUIPMENT_CATALOG) gồm ít nhất 20 vật phẩm độc đáo thuộc 4 bậc:
 * - Common (Phổ Thông): Giá 35 - 55 Vàng (Chỉ số cơ bản, +HP, +ATK, +DEF vừa phải)
 * - Rare (Quý Hiếm): Giá 95 - 145 Vàng (Có synergy Hỏa, Băng, Lôi, Hút Máu, Gai, Chiêu Hồn rõ rệt)
 * - Epic (Sử Thi): Giá 220 - 320 Vàng (Đắt đỏ, chỉ số mạnh mẽ vượt trội)
 * - Legendary (Huyền Thoại): Giá 450 - 650 Vàng (Cực phẩm xa xỉ, thay đổi lối chơi)
 */
export const FULL_EQUIPMENT_CATALOG: EquipmentItem[] = [
  // ==========================================
  // POTIONS (3 món - Giá 30 - 45 Vàng)
  // ==========================================
  ...POTION_CATALOG,

  // ==========================================
  // 1. COMMON (7 món - Giá 35 - 55 Vàng)
  // ==========================================
  {
    id: 'eq_iron_broadsword',
    name: 'Thanh Kiếm Sắt Thô',
    category: 'weapon',
    rarity: 'common',
    description: 'Thanh kiếm sắt cơ bản, gia tăng 6 Sát thương vật lý.',
    cost: 38,
    stats: { atk: 6 }
  },
  {
    id: 'eq_hunter_bow',
    name: 'Cung Tên Thợ Săn',
    category: 'weapon',
    rarity: 'common',
    description: 'Vũ khí tầm xa nhanh nhẹn, +5 Sát thương và +8% Tốc độ đánh.',
    cost: 44,
    stats: { atk: 5, attackSpeed: 0.08 }
  },
  {
    id: 'eq_leather_tunic',
    name: 'Áo Da Thuộc Dẻo Dai',
    category: 'armor',
    rarity: 'common',
    description: 'Lớp giáp da thú vừa vặn, tăng 30 Máu tối đa và 5% Giáp.',
    cost: 42,
    stats: { maxHp: 30, hp: 30, def: 5 }
  },
  {
    id: 'eq_oak_shield',
    name: 'Khiên Gỗ Sồi Cổ',
    category: 'armor',
    rarity: 'common',
    description: 'Khiên gỗ bọc đai thép, tăng 8% Giáp phòng ngự và 15 Máu.',
    cost: 36,
    stats: { def: 8, maxHp: 15, hp: 15 }
  },
  {
    id: 'eq_copper_ring',
    name: 'Nhẫn Đồng Thô Ráp',
    category: 'trinket',
    rarity: 'common',
    description: 'Nhẫn hộ thân đơn sơ, +4 Sát thương và +20 Máu tối đa.',
    cost: 40,
    stats: { atk: 4, maxHp: 20, hp: 20 }
  },
  {
    id: 'eq_traveler_boots',
    name: 'Ủng Du Mục Gió',
    category: 'armor',
    rarity: 'common',
    description: 'Đôi ủng da nhẹ, tăng 20 Tốc chạy và 6% Tỉ lệ né đòn.',
    cost: 48,
    stats: { speed: 20, dodgeRate: 0.06 }
  },
  {
    id: 'eq_lucky_charm',
    name: 'Bùa May Mắn Bạc',
    category: 'trinket',
    rarity: 'common',
    description: 'Bùa cầu may của thám hiểm giả, +7% Tỉ lệ bạo kích và +12 Tốc chạy.',
    cost: 52,
    stats: { critRate: 0.07, speed: 12 }
  },

  // ==========================================
  // 2. RARE (8 món - Giá 95 - 145 Vàng, có Synergy rõ rệt)
  // ==========================================
  {
    id: 'eq_blazing_scimitar',
    name: 'Loan Đao Liệt Hỏa',
    category: 'weapon',
    rarity: 'rare',
    synergy: 'fire',
    description: 'Lưỡi kiếm rực cháy dung nham, +13 Sát thương và +8% Chí mạng.',
    cost: 118,
    stats: { atk: 13, critRate: 0.08 }
  },
  {
    id: 'eq_glacial_shield',
    name: 'Khiên Băng Cổ Đại',
    category: 'armor',
    rarity: 'rare',
    synergy: 'frost',
    description: 'Đúc từ băng tuyết ngàn năm, +65 Máu, +14% Giáp bảo hộ.',
    cost: 125,
    stats: { maxHp: 65, hp: 65, def: 14 }
  },
  {
    id: 'eq_storm_dagger',
    name: 'Song Chủy Lôi Điện',
    category: 'weapon',
    rarity: 'rare',
    synergy: 'lightning',
    description: 'Dao găm tích điện chớp giật, +9 Sát thương và +18% Tốc đánh.',
    cost: 110,
    stats: { atk: 9, attackSpeed: 0.18 }
  },
  {
    id: 'eq_vampiric_fang',
    name: 'Nanh Huyết Ma Cà Rồng',
    category: 'weapon',
    rarity: 'rare',
    synergy: 'vampiric',
    description: 'Nanh vuốt khát máu, +11 Sát thương và +9% Hút máu khi công kích.',
    cost: 135,
    stats: { atk: 11, lifeSteal: 0.09 }
  },
  {
    id: 'eq_spiked_mail',
    name: 'Giáp Gai Cốt Xà',
    category: 'armor',
    rarity: 'rare',
    synergy: 'thorns',
    description: 'Áo giáp đính gai nhọn, +45 Máu, +10% Giáp, phản 20 Sát thương gai.',
    cost: 120,
    stats: { maxHp: 45, hp: 45, def: 10, thorns: 20 }
  },
  {
    id: 'eq_necromancer_orb',
    name: 'Ngọc Hồn Tử Linh Sư',
    category: 'trinket',
    rarity: 'rare',
    synergy: 'summoner',
    description: 'Ngọc ma thuật đen khuấy động cõi âm, +8 Công, +8% Giảm hồi chiêu, +35 Máu.',
    cost: 130,
    stats: { atk: 8, cooldownReduction: 0.08, maxHp: 35, hp: 35 }
  },
  {
    id: 'eq_thunder_ring',
    name: 'Nhẫn Bão Lôi',
    category: 'trinket',
    rarity: 'rare',
    synergy: 'lightning',
    description: 'Nhẫn mang năng lượng bão tố, +14% Tốc đánh và +8% Tỉ lệ bạo kích.',
    cost: 105,
    stats: { attackSpeed: 0.14, critRate: 0.08 }
  },
  {
    id: 'eq_blood_amulet',
    name: 'Dây Chuyền Huyết Ngọc',
    category: 'trinket',
    rarity: 'rare',
    synergy: 'vampiric',
    description: 'Dây chuyền bùa chú Huyết Tộc, +50 Máu, +7% Hút máu và +6% Giáp.',
    cost: 140,
    stats: { maxHp: 50, hp: 50, lifeSteal: 0.07, def: 6 }
  },

  // ==========================================
  // 3. EPIC (6 món - Giá 220 - 320 Vàng, Chỉ số mạnh mẽ vượt trội)
  // ==========================================
  {
    id: 'eq_inferno_blade',
    name: 'Hỏa Long Trảm Ma Đao',
    category: 'weapon',
    rarity: 'epic',
    synergy: 'fire',
    description: 'Rèn từ long cốt và magma nóng rực, +28 Công, +15% Bạo kích, +40% ST chí mạng.',
    cost: 265,
    stats: { atk: 28, critRate: 0.15, critDmg: 0.4 }
  },
  {
    id: 'eq_frost_cuirass',
    name: 'Áo Choàng Hàn Băng Đế',
    category: 'armor',
    rarity: 'epic',
    synergy: 'frost',
    description: 'Băng hàn cực độ đóng băng sát thương thù địch, +130 Máu, +22% Giáp, +8% Né đòn.',
    cost: 275,
    stats: { maxHp: 130, hp: 130, def: 22, dodgeRate: 0.08 }
  },
  {
    id: 'eq_storm_caller_pendant',
    name: 'Trái Tim Bão Tố Mjolnir',
    category: 'trinket',
    rarity: 'epic',
    synergy: 'lightning',
    description: 'Tập trung lôi đình hủy diệt, +18 Công, +30% Tốc đánh, +12% Tỉ lệ bạo kích.',
    cost: 285,
    stats: { atk: 18, attackSpeed: 0.3, critRate: 0.12 }
  },
  {
    id: 'eq_vampire_lord_cloak',
    name: 'Áo Choàng Bá Tước Huyết Tộc',
    category: 'armor',
    rarity: 'epic',
    synergy: 'vampiric',
    description: 'Áo choàng quỷ hút máu huyền bí, +95 Máu, +16% Hút máu, +14 Sát thương.',
    cost: 295,
    stats: { maxHp: 95, hp: 95, lifeSteal: 0.16, atk: 14 }
  },
  {
    id: 'eq_titan_spine',
    name: 'Cột Sống Titan Bọc Thép',
    category: 'armor',
    rarity: 'epic',
    synergy: 'thorns',
    description: 'Khung giáp gai titan khổng lồ, +140 Máu, +20% Giáp, phản đòn gai 38 ST chuẩn.',
    cost: 260,
    stats: { maxHp: 140, hp: 140, def: 20, thorns: 38 }
  },
  {
    id: 'eq_soul_reaper_staff',
    name: 'Vương Trượng Vong Linh Vương',
    category: 'weapon',
    rarity: 'epic',
    synergy: 'summoner',
    description: 'Quyền trượng của vua thây ma, +25 Công, +16% Giảm hồi chiêu, +65 Máu.',
    cost: 310,
    stats: { atk: 25, cooldownReduction: 0.16, maxHp: 65, hp: 65 }
  },

  // ==========================================
  // 4. LEGENDARY (4 món - Giá 450 - 650 Vàng, Thay đổi hoàn toàn lối chơi)
  // ==========================================
  {
    id: 'eq_ragnarok_blade',
    name: 'Tận Thế Thần Kiếm Ragnarok',
    category: 'weapon',
    rarity: 'legendary',
    synergy: 'fire',
    description: 'Thần kiếm hủy diệt tam giới, +50 Công, +22% Chí mạng, +70% ST bạo kích, +20% Tốc đánh.',
    cost: 580,
    stats: { atk: 50, critRate: 0.22, critDmg: 0.7, attackSpeed: 0.2 }
  },
  {
    id: 'eq_immortal_aegis',
    name: 'Thần Thuẫn Bất Diệt Aegis',
    category: 'armor',
    rarity: 'legendary',
    synergy: 'thorns',
    description: 'Khiên thần thoại bất hoại, +260 Máu, +32% Giáp, phản 65 ST gai, +12% Né tránh.',
    cost: 550,
    stats: { maxHp: 260, hp: 260, def: 32, thorns: 65, dodgeRate: 0.12 }
  },
  {
    id: 'eq_abyssal_crown',
    name: 'Vương Miện Chúa Tể Vực Sâu',
    category: 'trinket',
    rarity: 'legendary',
    synergy: 'summoner',
    description: 'Chúa tể bóng tối ngự trị vực thẳm, +36 Công, +180 Máu, +25% CDR, +12% Hút máu.',
    cost: 620,
    stats: { atk: 36, maxHp: 180, hp: 180, cooldownReduction: 0.25, lifeSteal: 0.12 }
  },
  {
    id: 'eq_zeus_thunder_core',
    name: 'Vô Cực Lôi Hạch Zeus',
    category: 'trinket',
    rarity: 'legendary',
    synergy: 'lightning',
    description: 'Trái tim sấm sét vô tận của Thần Zeus, +42 Công, +45% Tốc đánh, +25% Bạo kích, +30 Tốc chạy.',
    cost: 600,
    stats: { atk: 42, attackSpeed: 0.45, critRate: 0.25, speed: 30 }
  }
];

/**
 * Tỷ lệ xuất hiện ngẫu nhiên có trọng số nghiêm ngặt cho 4 ô trang bị (Ô 2 - 5):
 * - Common: 62%
 * - Rare: 28%
 * - Epic: 9% (Cực hiếm)
 * - Legendary: 1% (Siêu hiếm)
 */
export const SHOP_RARITY_WEIGHTS = {
  common: 0.62,
  rare: 0.28,
  epic: 0.09,
  legendary: 0.01
} as const;

export class ShopSystem {
  /**
   * Tính toán giá vật phẩm dựa trên tầng (floor) và bùa giảm giá (hasDiscount):
   * Công thức: Giá gốc * (1 + (floor - 1) * 0.12) * (hasDiscount ? 0.75 : 1.0)
   */
  public static calculateCost(baseCost: number, floor: number, hasDiscount: boolean = false): number {
    const floorMultiplier = 1 + Math.max(0, floor - 1) * 0.12;
    const discountMultiplier = hasDiscount ? 0.75 : 1.0;
    return Math.max(1, Math.round(baseCost * floorMultiplier * discountMultiplier));
  }

  /**
   * Tạo 5 món hàng cho kệ Shop theo đúng quy tắc:
   * - Ô 1: Dược phẩm hồi phục (Potion).
   * - Ô 2 - 5: Trang bị ngẫu nhiên có trọng số (Common 62%, Rare 28%, Epic 9%, Legendary 1%).
   * - Công thức giá: Giá gốc * (1 + (floor - 1) * 0.12) * (hasDiscount ? 0.75 : 1.0).
   * - Đảm bảo 5 món trên kệ không bao giờ trùng lặp nhau.
   */
  public static generateShopStock(
    floor: number,
    seed?: string,
    hasDiscount: boolean = false
  ): EquipmentItem[] {
    const floorNumber = Math.max(1, Math.floor(floor));
    const shopSeed = seed ? `${seed}_shop_f${floorNumber}` : undefined;
    const rng = new SeededRNG(shopSeed);

    const shelf: EquipmentItem[] = [];
    const selectedIds = new Set<string>();

    // ==========================================
    // Ô 1: BÌNH MÁU / DƯỢC PHẨM HỒI PHỤC (POTION)
    // ==========================================
    const potionIndex = rng.nextInt(0, POTION_CATALOG.length - 1);
    const basePotion = POTION_CATALOG[potionIndex] || POTION_CATALOG[0];
    const potionCost = ShopSystem.calculateCost(basePotion.cost || 35, floorNumber, hasDiscount);

    const potionItem: EquipmentItem = {
      ...basePotion,
      cost: potionCost,
      stats: { ...basePotion.stats }
    };
    shelf.push(potionItem);
    selectedIds.add(potionItem.id);

    // ==========================================
    // Ô 2 - 5: TRANG BỊ VỚI TỶ LỆ TRỌNG SỐ NGHIÊM NGẶT
    // ==========================================
    // Lọc bỏ các món potion ra khỏi pool trang bị
    const equipmentPool = FULL_EQUIPMENT_CATALOG.filter(
      (item) => !POTION_CATALOG.some((p) => p.id === item.id)
    );

    for (let slot = 2; slot <= 5; slot++) {
      const roll = rng.nextFloat();
      let targetRarity: ItemRarity = 'common';

      if (roll < SHOP_RARITY_WEIGHTS.legendary) {
        // 0% -> 1%: Legendary
        targetRarity = 'legendary';
      } else if (roll < SHOP_RARITY_WEIGHTS.legendary + SHOP_RARITY_WEIGHTS.epic) {
        // 1% -> 10%: Epic (9%)
        targetRarity = 'epic';
      } else if (roll < SHOP_RARITY_WEIGHTS.legendary + SHOP_RARITY_WEIGHTS.epic + SHOP_RARITY_WEIGHTS.rare) {
        // 10% -> 38%: Rare (28%)
        targetRarity = 'rare';
      } else {
        // 38% -> 100%: Common (62%)
        targetRarity = 'common';
      }

      // Tìm ứng viên chưa được chọn trong bậc mong muốn
      let candidates = equipmentPool.filter(
        (item) => item.rarity === targetRarity && !selectedIds.has(item.id)
      );

      // Dự phòng nếu đã hết món ở bậc đó
      if (candidates.length === 0) {
        const fallbackRarities: ItemRarity[] = ['common', 'rare', 'epic', 'legendary'];
        for (const fbRarity of fallbackRarities) {
          candidates = equipmentPool.filter(
            (item) => item.rarity === fbRarity && !selectedIds.has(item.id)
          );
          if (candidates.length > 0) break;
        }
      }

      // Dự phòng tuyệt đối nếu toàn bộ pool cạn (không trùng lặp)
      if (candidates.length === 0) {
        candidates = equipmentPool.filter((item) => !selectedIds.has(item.id));
      }

      // Nếu vẫn không còn món nào mới, lấy từ pool chung
      if (candidates.length === 0) {
        candidates = equipmentPool;
      }

      const pickedIndex = rng.nextInt(0, candidates.length - 1);
      const chosenTemplate = candidates[pickedIndex];
      const scaledCost = ShopSystem.calculateCost(chosenTemplate.cost || 50, floorNumber, hasDiscount);

      const shopEquipment: EquipmentItem = {
        ...chosenTemplate,
        cost: scaledCost,
        stats: { ...chosenTemplate.stats }
      };

      shelf.push(shopEquipment);
      selectedIds.add(chosenTemplate.id);
    }

    return shelf;
  }
}
