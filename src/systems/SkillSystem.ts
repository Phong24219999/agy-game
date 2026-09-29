import { HeroClass, SkillEvolution } from '../types/game';

export const SKILL_EVOLUTIONS: SkillEvolution[] = [
  // --- KNIGHT EVOLUTIONS ---
  {
    id: 'evo_knight_vortex',
    classId: 'knight',
    tier: 1,
    name: 'Bão Máu Cuồng Nộ',
    description: 'Lốc xoáy tạo lực hút cực mạnh kéo mọi quái vật xung quanh vào tâm kiếm và tăng gấp đôi (+100%) hiệu quả Hút Máu.',
    icon: 'icon_vampire',
    effectType: 'vortex'
  },
  {
    id: 'evo_knight_lightning',
    classId: 'knight',
    tier: 1,
    name: 'Lốc Kiếm Lôi Điện',
    description: 'Mỗi vòng xoay kiếm phóng ra 4 luồng sấm sét giật lan 4 hướng, gây choáng nhẹ 0.5s.',
    icon: 'icon_lightning',
    effectType: 'lightning_cyclone'
  },
  {
    id: 'evo_knight_avatar',
    classId: 'knight',
    tier: 2,
    name: 'Thiên Thần Huyết Chiến',
    description: 'Kỹ năng trảm phóng ra các đợt sóng kiếm năng lượng khổng lồ và tăng vĩnh viễn +50% Sát thương cơ bản.',
    icon: 'icon_sword',
    effectType: 'vortex'
  },

  // --- MAGE EVOLUTIONS ---
  {
    id: 'evo_mage_singularity',
    classId: 'mage',
    tier: 1,
    name: 'Hố Đen Tận Diệt',
    description: 'Thiên thạch biến đổi thành Hố Đen Hư Vô, hút toàn bộ quái vật trên sàn đấu về một điểm rồi phát nổ 300% Sát thương.',
    icon: 'icon_soul',
    effectType: 'singularity'
  },
  {
    id: 'evo_mage_cocytus',
    classId: 'mage',
    tier: 1,
    name: 'Thiên Thạch Băng Hàn',
    description: 'Thiên thạch đóng băng vĩnh viễn toàn bộ kẻ địch trúng đòn trong 2 giây; sát thương bạo kích lên kẻ địch đóng băng x2.5.',
    icon: 'icon_frost',
    effectType: 'cocytus_freeze'
  },
  {
    id: 'evo_mage_void_domain',
    classId: 'mage',
    tier: 2,
    name: 'Hư Vô Thần Giới',
    description: 'Tạo vùng đất hư vô thiêu đốt 80 Sát thương chuẩn mỗi giây lên tất cả kẻ thù trên bản đồ.',
    icon: 'icon_fire',
    effectType: 'singularity'
  },

  // --- ROGUE EVOLUTIONS ---
  {
    id: 'evo_rogue_clones',
    classId: 'rogue',
    tier: 1,
    name: 'Phân Thân Ảo Ảnh',
    description: 'Mỗi khi Ám sát, tạo ngay 2 Phân Thân Bóng Ma tự động tấn công và chia cắt sát thương kẻ địch trong 6 giây.',
    icon: 'icon_summon',
    effectType: 'clones'
  },
  {
    id: 'evo_rogue_venom_barrage',
    classId: 'rogue',
    tier: 1,
    name: 'Vạn Kiếm Độc Trận',
    description: 'Phóng bão 16 phi dao độc xoay tròn 360 độ, bào mòn 50% giáp của tất cả kẻ địch trúng chiêu.',
    icon: 'icon_boot',
    effectType: 'venom_storm'
  },
  {
    id: 'evo_rogue_reaper',
    classId: 'rogue',
    tier: 2,
    name: 'Tử Thần Đoạt Mệnh',
    description: 'Đòn đánh ngay lập tức KẾT LIỄU bất kỳ quái vật hoặc Tinh Anh nào có lượng máu dưới 25%.',
    icon: 'icon_crit',
    effectType: 'venom_storm'
  }
];

export class SkillManager {
  public static getAvailableEvolutions(heroClass: HeroClass, tier: 1 | 2): SkillEvolution[] {
    return SKILL_EVOLUTIONS.filter((e) => e.classId === heroClass && e.tier === tier);
  }
}
