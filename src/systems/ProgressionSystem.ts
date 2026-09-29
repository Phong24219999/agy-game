import { EquipmentItem, HeroAttributes, HeroStats, PerkCard, RelicItem } from '../types/game';

export class ProgressionSystem {
  /**
   * Derives final combat stats from base attributes, level, equipment (with enhancement levels), perks, and relics.
   */
  public static calculateDerivedStats(
    attributes: HeroAttributes,
    level: number,
    equipment: EquipmentItem[],
    perks: PerkCard[],
    relics: RelicItem[]
  ): Partial<HeroStats> {
    // 1. Base attribute formulas
    const baseMaxHp = 100 + attributes.vit * 14 + (level - 1) * 20;
    const baseAtk = 12 + attributes.str * 2.8 + (level - 1) * 3;
    const baseDef = Math.min(75, Math.round(attributes.vit * 0.8 + attributes.str * 0.3));
    const baseAspd = 1.0 + attributes.agi * 0.018;
    const baseCdr = Math.min(0.5, attributes.int * 0.025);
    const baseDodge = Math.min(0.4, attributes.agi * 0.015);
    const baseSpeed = 100 + attributes.agi * 1.5;

    let bonusMaxHp = 0;
    let bonusAtk = 0;
    let bonusDef = 0;
    let bonusAspd = 0;
    let bonusCdr = 0;
    let bonusCritRate = 0;
    let bonusCritDmg = 0;
    let bonusLifeSteal = 0;
    let bonusDodge = 0;
    let bonusThorns = 0;
    let bonusSpeed = 0;

    // 2. Add equipment stats with enhancement level multipliers (+25% per level)
    for (const item of equipment) {
      const mult = 1 + (item.enhanceLevel || 0) * 0.25;
      if (item.stats.maxHp) bonusMaxHp += item.stats.maxHp * mult;
      if (item.stats.atk) bonusAtk += item.stats.atk * mult;
      if (item.stats.def) bonusDef += item.stats.def * mult;
      if (item.stats.attackSpeed) bonusAspd += item.stats.attackSpeed * mult;
      if (item.stats.critRate) bonusCritRate += item.stats.critRate * mult;
      if (item.stats.critDmg) bonusCritDmg += item.stats.critDmg * mult;
      if (item.stats.lifeSteal) bonusLifeSteal += item.stats.lifeSteal * mult;
      if (item.stats.dodgeRate) bonusDodge += item.stats.dodgeRate * mult;
      if (item.stats.thorns) bonusThorns += item.stats.thorns * mult;
      if (item.stats.speed) bonusSpeed += item.stats.speed * mult;
      if (item.stats.cooldownReduction) bonusCdr += item.stats.cooldownReduction;
    }

    // 3. Add perk stats
    for (const perk of perks) {
      if (perk.stats) {
        if (perk.stats.maxHp) bonusMaxHp += perk.stats.maxHp;
        if (perk.stats.atk) bonusAtk += perk.stats.atk;
        if (perk.stats.def) bonusDef += perk.stats.def;
        if (perk.stats.attackSpeed) bonusAspd += perk.stats.attackSpeed;
        if (perk.stats.critRate) bonusCritRate += perk.stats.critRate;
        if (perk.stats.critDmg) bonusCritDmg += perk.stats.critDmg;
        if (perk.stats.lifeSteal) bonusLifeSteal += perk.stats.lifeSteal;
        if (perk.stats.dodgeRate) bonusDodge += perk.stats.dodgeRate;
        if (perk.stats.thorns) bonusThorns += perk.stats.thorns;
        if (perk.stats.speed) bonusSpeed += perk.stats.speed;
        if (perk.stats.cooldownReduction) bonusCdr += perk.stats.cooldownReduction;
      }
    }

    // 4. Add relic stats
    for (const relic of relics) {
      if (relic.stats) {
        if (relic.stats.maxHp) bonusMaxHp += relic.stats.maxHp;
        if (relic.stats.atk) bonusAtk += relic.stats.atk;
        if (relic.stats.def) bonusDef += relic.stats.def;
        if (relic.stats.attackSpeed) bonusAspd += relic.stats.attackSpeed;
        if (relic.stats.critRate) bonusCritRate += relic.stats.critRate;
        if (relic.stats.critDmg) bonusCritDmg += relic.stats.critDmg;
        if (relic.stats.lifeSteal) bonusLifeSteal += relic.stats.lifeSteal;
        if (relic.stats.dodgeRate) bonusDodge += relic.stats.dodgeRate;
        if (relic.stats.thorns) bonusThorns += relic.stats.thorns;
        if (relic.stats.speed) bonusSpeed += relic.stats.speed;
        if (relic.stats.cooldownReduction) bonusCdr += relic.stats.cooldownReduction;
      }
    }

    return {
      maxHp: Math.round(baseMaxHp + bonusMaxHp),
      atk: Math.round(baseAtk + bonusAtk),
      def: Math.min(80, Math.round(baseDef + bonusDef)),
      attackSpeed: Math.max(0.4, Number((baseAspd + bonusAspd).toFixed(2))),
      cooldownReduction: Math.min(0.6, Number((baseCdr + bonusCdr).toFixed(2))),
      critRate: Math.min(0.85, Number((bonusCritRate).toFixed(2))),
      critDmg: Number((1.5 + bonusCritDmg).toFixed(2)),
      lifeSteal: Math.min(0.6, Number((bonusLifeSteal).toFixed(2))),
      dodgeRate: Math.min(0.5, Number((baseDodge + bonusDodge).toFixed(2))),
      thorns: Math.round(bonusThorns),
      speed: Math.round(baseSpeed + bonusSpeed)
    };
  }

  /**
   * Enhances equipment by +1 level (up to max +4)
   */
  public static enhanceEquipment(item: EquipmentItem): boolean {
    const current = item.enhanceLevel || 0;
    if (current >= 4) return false;

    item.enhanceLevel = current + 1;
    // Strip old (+N) suffix if exists
    item.name = item.name.replace(/\s*\(\+\d\)$/, '') + ` (+${item.enhanceLevel})`;
    return true;
  }
}
