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
  },

  // --- PALADIN EVOLUTIONS ---
  {
    id: 'evo_paladin_consecration',
    classId: 'paladin',
    tier: 1,
    name: 'Thánh Địa Phán Quyết',
    description: 'Vòng sáng thánh quang lưu lại 4 giây, liên tục thiêu đốt quái vật và hồi phục lượng lớn lá chắn.',
    icon: 'icon_armor',
    effectType: 'holy_consecration'
  },
  {
    id: 'evo_paladin_wrath',
    classId: 'paladin',
    tier: 1,
    name: 'Cuồng Nộ Thánh Thần',
    description: 'Kêu gọi cột lửa thái dương giáng thế, tăng 150% sát thương trừng phạt và đánh lui quái vật.',
    icon: 'icon_sword',
    effectType: 'wrath_of_heavens'
  },
  {
    id: 'evo_paladin_bastion',
    classId: 'paladin',
    tier: 2,
    name: 'Pháo Đài Bất Hoại',
    description: 'Tăng vĩnh viễn +50% giá trị lá chắn, và phản lại 100% sát thương nhận vào về kẻ tấn công.',
    icon: 'icon_thorns',
    effectType: 'holy_consecration'
  },

  // --- RANGER EVOLUTIONS ---
  {
    id: 'evo_ranger_blizzard',
    classId: 'ranger',
    tier: 1,
    name: 'Bão Tuyết Cực Hàn',
    description: 'Mưa tiễn băng đóng băng kẻ địch thêm 2 giây và làm phát nổ mảnh băng khi kẻ địch tử trận.',
    icon: 'icon_frost',
    effectType: 'blizzard_storm'
  },
  {
    id: 'evo_ranger_pierce',
    classId: 'ranger',
    tier: 1,
    name: 'Vạn Tiễn Xuyên Mây',
    description: 'Bắn ra 9 mũi tên băng xuyên thấu vô tận với tốc độ cực hạn, xé toạc phòng thủ kẻ thù.',
    icon: 'icon_boot',
    effectType: 'frost_barrage'
  },
  {
    id: 'evo_ranger_huntress',
    classId: 'ranger',
    tier: 2,
    name: 'Thần Tiễn Hoang Dã',
    description: 'Mỗi đòn đánh thường bắn kèm thêm 2 mũi tên băng tầm nhiệt tự động tìm mục tiêu.',
    icon: 'icon_crit',
    effectType: 'frost_barrage'
  },

  // --- WARLOCK EVOLUTIONS ---
  {
    id: 'evo_warlock_abyssal_pact',
    classId: 'warlock',
    tier: 1,
    name: 'Giao Kèo Hư Vô',
    description: 'Hút hồn hút cùng lúc 5 mục tiêu và đánh cắp 20% sát thương công kích của chúng trong 5 giây.',
    icon: 'icon_vampire',
    effectType: 'abyssal_torment'
  },
  {
    id: 'evo_warlock_soul_harvest',
    classId: 'warlock',
    tier: 1,
    name: 'Thu Hoạch Linh Hồn',
    description: 'Quái vật bị rút cạn hồn phát nổ gây sát thương diện rộng và hồi sinh thành đệ tử bóng tối.',
    icon: 'icon_soul',
    effectType: 'soul_harvest'
  },
  {
    id: 'evo_warlock_apocalypse',
    classId: 'warlock',
    tier: 2,
    name: 'Đại Họa Hắc Ám',
    description: 'Rút hồn vĩnh viễn tăng gấp đôi lượng máu hút và triệu hồi bóng ma bóng tối tàn phá kẻ địch.',
    icon: 'icon_summon',
    effectType: 'soul_harvest'
  }
];

export class SkillManager {
  public static getAvailableEvolutions(heroClass: HeroClass, tier: 1 | 2): SkillEvolution[] {
    return SKILL_EVOLUTIONS.filter((e) => e.classId === heroClass && e.tier === tier);
  }
}
