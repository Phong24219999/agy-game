export type HeroClass = 'knight' | 'mage' | 'rogue' | 'paladin' | 'ranger' | 'warlock';

export interface HeroAttributes {
  str: number; // Sức Mạnh: +2.5 ATK, +0.3 DEF
  vit: number; // Thể Lực: +12 Max HP, +0.8 DEF
  int: number; // Trí Tuệ: +2% Cooldown Reduction, +Magic Power
  agi: number; // Nhanh Nhẹn: +0.015 Attack Speed, +0.012 Dodge, +1.2 Move Speed
}

export interface HeroStats extends HeroAttributes {
  hp: number;
  maxHp: number;
  atk: number;
  def: number;             // % damage mitigation (e.g. 20 = 20% reduced)
  attackSpeed: number;     // Attacks per second (e.g. 1.2)
  cooldownReduction: number; // 0 to 0.5 (e.g. 0.2 = 20% reduced skill cooldowns)
  critRate: number;        // 0 to 1 (e.g. 0.15 = 15%)
  critDmg: number;         // Multiplier (e.g. 1.8 = 180%)
  lifeSteal: number;       // % of damage dealt converted to HP (e.g. 0.1 = 10%)
  dodgeRate: number;       // 0 to 1 chance to evade hit
  thorns: number;          // Flat or % damage reflected back to attacker
  speed: number;           // Move speed in pixels/sec
  gold: number;
  souls: number;
  level: number;
  exp: number;
  maxExp: number;
  runSeed?: string;
}

export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type ItemCategory = 'weapon' | 'armor' | 'trinket' | 'relic';
export type SynergyType = 'fire' | 'frost' | 'lightning' | 'vampiric' | 'thorns' | 'summoner';

export interface EquipmentItem {
  id: string;
  name: string;
  category: ItemCategory;
  rarity: ItemRarity;
  description: string;
  synergy?: SynergyType;
  stats: Partial<HeroStats>;
  cost?: number;
  specialEffect?: string;
  enhanceLevel?: number; // 0 = base, +1, +2, +3, +4
  icon?: string;
}

export type RelicTrigger = 'passive' | 'on_hit' | 'on_kill' | 'on_damaged' | 'low_hp' | 'time';

export interface RelicItem {
  id: string;
  name: string;
  rarity: ItemRarity;
  description: string;
  icon: string;
  trigger: RelicTrigger;
  stats?: Partial<HeroStats>;
  specialEffect?: string;
}

export interface SkillEvolution {
  id: string;
  classId: HeroClass;
  tier: 1 | 2; // Tier 1 unlocked at Lv.5, Tier 2 at Lv.10
  name: string;
  description: string;
  icon: string;
  effectType: 'vortex' | 'lightning_cyclone' | 'singularity' | 'cocytus_freeze' | 'clones' | 'venom_storm' | 'holy_consecration' | 'wrath_of_heavens' | 'blizzard_storm' | 'frost_barrage' | 'abyssal_torment' | 'soul_harvest';
}

export type EliteAffixType = 'volatile' | 'shielded' | 'swift' | 'vampiric' | 'chilling';

export interface EliteAffix {
  type: EliteAffixType;
  name: string;
  color: string;
  prefix: string;
  bonusHpMultiplier: number;
  bonusAtkMultiplier: number;
  bonusSpeedMultiplier: number;
  description: string;
}

export interface PerkCard {
  id: string;
  name: string;
  rarity: ItemRarity;
  description: string;
  synergy?: SynergyType;
  icon: string;
  stats?: Partial<HeroStats>;
  special?: string;
}

export type NodeType = 'battle' | 'elite' | 'chest' | 'shop' | 'campfire' | 'boss';
export type DungeonNodeType = NodeType;

export type MonsterDebuffType = 'poisonous' | 'armor_shred' | 'chilling';

export interface MonsterDebuffEffect {
  type: MonsterDebuffType;
  duration: number; // Duration in seconds
  value?: number; // e.g. DPS for poison, reduction ratio for armor (0.35), slow ratio (0.25)
}

export interface DungeonNode {
  id: string;
  floor: number;
  row: number;
  col: number;
  type: NodeType;
  completed: boolean;
  accessible: boolean;
  connectedTo: string[]; // IDs of reachable nodes in the next row
  title: string;
  description: string;
}

export interface MetaUpgrade {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  cost: (level: number) => number;
  statBonus: (level: number) => Partial<HeroStats>;
}

export interface GameSaveData {
  totalSouls: number;
  highestFloor: number;
  totalRuns: number;
  victories: number;
  upgrades: Record<string, number>;
}
