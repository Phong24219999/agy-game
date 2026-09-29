import { GameSaveData, HeroStats, MetaUpgrade } from '../types/game';

const SAVE_KEY = 'ABYSS_DESCENT_SAVE_V1';

export const META_UPGRADES: MetaUpgrade[] = [
  {
    id: 'iron_constitution',
    name: 'Thể Chất Bất Hoại',
    description: 'Tăng lượng Máu tối đa cơ bản vĩnh viễn.',
    level: 0,
    maxLevel: 10,
    cost: (lvl) => 20 * (lvl + 1),
    statBonus: (lvl) => ({ maxHp: lvl * 20, hp: lvl * 20 })
  },
  {
    id: 'abyssal_might',
    name: 'Sức Mạnh Vực Sâu',
    description: 'Tăng Sát thương cơ bản cho tất cả lớp nhân vật.',
    level: 0,
    maxLevel: 10,
    cost: (lvl) => 25 * (lvl + 1),
    statBonus: (lvl) => ({ atk: lvl * 3 })
  },
  {
    id: 'assassin_eye',
    name: 'Mắt Ưng Chuẩn Xác',
    description: 'Tăng Tỉ lệ Bạo kích khởi đầu.',
    level: 0,
    maxLevel: 5,
    cost: (lvl) => 35 * (lvl + 1),
    statBonus: (lvl) => ({ critRate: lvl * 0.03 })
  },
  {
    id: 'blood_pact',
    name: 'Khế Ước Ma Cà Rồng',
    description: 'Tăng Tỉ lệ Hút máu cơ bản khi tấn công.',
    level: 0,
    maxLevel: 5,
    cost: (lvl) => 40 * (lvl + 1),
    statBonus: (lvl) => ({ lifeSteal: lvl * 0.02 })
  },
  {
    id: 'thorns_armor',
    name: 'Giáp Gai Cổ Xưa',
    description: 'Phản sát thương lại kẻ địch khi bị tấn công.',
    level: 0,
    maxLevel: 5,
    cost: (lvl) => 30 * (lvl + 1),
    statBonus: (lvl) => ({ thorns: lvl * 4 })
  }
];

export class SaveSystem {
  private static instance: SaveSystem;
  private data: GameSaveData;

  private constructor() {
    this.data = this.loadData();
  }

  public static getInstance(): SaveSystem {
    if (!SaveSystem.instance) {
      SaveSystem.instance = new SaveSystem();
    }
    return SaveSystem.instance;
  }

  private loadData(): GameSaveData {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // Ignore error
    }
    return {
      totalSouls: 50, // Starter bonus souls for immediate fun!
      highestFloor: 1,
      totalRuns: 0,
      victories: 0,
      upgrades: {}
    };
  }

  public save(): void {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
    } catch {
      // Ignore error
    }
  }

  public getData(): GameSaveData {
    return this.data;
  }

  public getUpgradeLevel(id: string): number {
    return this.data.upgrades[id] || 0;
  }

  public buyUpgrade(id: string): boolean {
    const upgrade = META_UPGRADES.find((u) => u.id === id);
    if (!upgrade) return false;

    const currentLevel = this.getUpgradeLevel(id);
    if (currentLevel >= upgrade.maxLevel) return false;

    const cost = upgrade.cost(currentLevel);
    if (this.data.totalSouls < cost) return false;

    this.data.totalSouls -= cost;
    this.data.upgrades[id] = currentLevel + 1;
    this.save();
    return true;
  }

  public addSouls(amount: number): void {
    this.data.totalSouls += amount;
    this.save();
  }

  public recordRun(floor: number, victory: boolean): void {
    this.data.totalRuns++;
    if (floor > this.data.highestFloor) {
      this.data.highestFloor = floor;
    }
    if (victory) {
      this.data.victories++;
    }
    this.save();
  }

  public applyMetaStats(baseStats: HeroStats): HeroStats {
    const stats: HeroStats = { ...baseStats };
    for (const upgrade of META_UPGRADES) {
      const lvl = this.getUpgradeLevel(upgrade.id);
      if (lvl > 0) {
        const bonus = upgrade.statBonus(lvl);
        if (bonus.maxHp) {
          stats.maxHp += bonus.maxHp;
          stats.hp += bonus.maxHp;
        }
        if (bonus.atk) stats.atk += bonus.atk;
        if (bonus.critRate) stats.critRate += bonus.critRate;
        if (bonus.lifeSteal) stats.lifeSteal += bonus.lifeSteal;
        if (bonus.thorns) stats.thorns += bonus.thorns;
      }
    }
    return stats;
  }
}
