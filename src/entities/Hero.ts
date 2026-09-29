import Phaser from 'phaser';
import { HeroClass, HeroStats, EquipmentItem, PerkCard, RelicItem, SkillEvolution } from '../types/game';
import { Monster } from './Monster';
import { Minion } from './Minion';
import { AudioSystem } from '../systems/AudioSystem';
import { DamageTextManager } from '../systems/DamageTextManager';
import { ParticleSystem } from '../systems/ParticleSystem';
import { SynergyManager } from '../systems/SynergySystem';
import { ProgressionSystem } from '../systems/ProgressionSystem';
import { RelicManager } from '../systems/RelicSystem';

export class Hero extends Phaser.GameObjects.Container {
  public heroClass: HeroClass;
  public stats: HeroStats;
  public perks: PerkCard[] = [];
  public equipment: EquipmentItem[] = [];
  public relics: RelicItem[] = [];
  public evolutions: SkillEvolution[] = [];
  public minions: Minion[] = [];
  public isDead: boolean = false;

  private sprite: Phaser.GameObjects.Sprite;
  private hpBarBg: Phaser.GameObjects.Rectangle;
  private hpBarFill: Phaser.GameObjects.Rectangle;
  private shieldBar: Phaser.GameObjects.Rectangle;
  private shield: number = 0;

  private attackTimer: number = 0;
  private skillCooldown: number = 0;
  private skillMaxCooldown: number = 5.0; // default 5 seconds
  private attackCount: number = 0;
  private killCount: number = 0;
  private relicTickTimer: number = 0;
  private phoenixFeatherUsed: boolean = false;

  private audio: AudioSystem;
  private damageText: DamageTextManager;
  private particles: ParticleSystem;

  constructor(scene: Phaser.Scene, x: number, y: number, heroClass: HeroClass, initialStats: HeroStats) {
    super(scene, x, y);
    this.heroClass = heroClass;
    this.stats = { ...initialStats };
    this.audio = AudioSystem.getInstance();
    this.damageText = new DamageTextManager(scene);
    this.particles = new ParticleSystem(scene);

    // Setup class specific skill cooldown
    if (heroClass === 'knight') this.skillMaxCooldown = 4.5;
    else if (heroClass === 'mage') this.skillMaxCooldown = 5.5;
    else if (heroClass === 'rogue') this.skillMaxCooldown = 3.5;
    else if (heroClass === 'paladin') this.skillMaxCooldown = 5.0;
    else if (heroClass === 'ranger') this.skillMaxCooldown = 3.8;
    else if (heroClass === 'warlock') this.skillMaxCooldown = 4.2;

    // Sprite
    this.sprite = scene.add.sprite(0, 0, `hero_${heroClass}`);
    this.add(this.sprite);

    // HP Bar above hero
    const barWidth = 44;
    const barHeight = 5;
    const barY = -this.sprite.height / 2 - 8;

    this.hpBarBg = scene.add.rectangle(0, barY, barWidth, barHeight, 0x111111);
    this.hpBarFill = scene.add.rectangle(-barWidth / 2, barY, barWidth, barHeight, 0x22dd55);
    this.hpBarFill.setOrigin(0, 0.5);

    this.shieldBar = scene.add.rectangle(-barWidth / 2, barY - 3, 0, 3, 0x44aaff);
    this.shieldBar.setOrigin(0, 0.5);

    this.add(this.hpBarBg);
    this.add(this.hpBarFill);
    this.add(this.shieldBar);

    scene.add.existing(this);
    this.setDepth(25);
  }

  public getOptimalRange(): number {
    if (this.heroClass === 'ranger') return 220;
    if (this.heroClass === 'mage') return 160;
    if (this.heroClass === 'warlock') return 140;
    if (this.heroClass === 'rogue') return 60;
    if (this.heroClass === 'paladin') return 56;
    return 48; // knight melee
  }

  public refreshDerivedStats(): void {
    const derived = ProgressionSystem.calculateDerivedStats(
      { str: this.stats.str, vit: this.stats.vit, int: this.stats.int, agi: this.stats.agi },
      this.stats.level,
      this.equipment,
      this.perks,
      this.relics
    );

    if (derived.maxHp) {
      const hpDiff = derived.maxHp - this.stats.maxHp;
      this.stats.maxHp = derived.maxHp;
      if (hpDiff > 0) this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + hpDiff);
    }
    if (derived.atk) this.stats.atk = derived.atk;
    if (derived.def !== undefined) this.stats.def = derived.def;
    if (derived.attackSpeed) this.stats.attackSpeed = derived.attackSpeed;
    if (derived.cooldownReduction !== undefined) this.stats.cooldownReduction = derived.cooldownReduction;
    if (derived.critRate !== undefined) this.stats.critRate = derived.critRate;
    if (derived.critDmg !== undefined) this.stats.critDmg = derived.critDmg;
    if (derived.lifeSteal !== undefined) this.stats.lifeSteal = derived.lifeSteal;
    if (derived.dodgeRate !== undefined) this.stats.dodgeRate = derived.dodgeRate;
    if (derived.thorns !== undefined) this.stats.thorns = derived.thorns;
    if (derived.speed) this.stats.speed = derived.speed;
  }

  public updateHero(delta: number, monsters: Monster[], onMonsterKilled: (m: Monster) => void): void {
    if (this.isDead) return;

    const dt = delta / 1000;
    this.attackTimer += dt;
    this.skillCooldown -= dt;

    // Relic Periodic Tick (every 1 second)
    this.relicTickTimer += dt;
    if (this.relicTickTimer >= 1.0) {
      this.relicTickTimer = 0;
      this.processRelicTick(monsters, onMonsterKilled);
    }

    // Filter alive monsters
    const aliveMonsters = monsters.filter((m) => !m.isDead);
    if (aliveMonsters.length === 0) return;

    // Find closest monster
    let target: Monster | null = null;
    let minDist = 99999;
    for (const m of aliveMonsters) {
      const d = Phaser.Math.Distance.Between(this.x, this.y, m.x, m.y);
      if (d < minDist) {
        minDist = d;
        target = m;
      }
    }

    if (!target) return;

    const optimalRange = this.getOptimalRange();

    // Movement AI
    if (minDist > optimalRange) {
      const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
      this.x += Math.cos(angle) * this.stats.speed * dt;
      this.y += Math.sin(angle) * this.stats.speed * dt;
      this.sprite.flipX = target.x < this.x;
    } else if (
      (this.heroClass === 'mage' && minDist < 90) ||
      (this.heroClass === 'ranger' && minDist < 110) ||
      (this.heroClass === 'warlock' && minDist < 80)
    ) {
      // Ranged heroes kite away if monster is too close
      const angle = Phaser.Math.Angle.Between(target.x, target.y, this.x, this.y);
      this.x += Math.cos(angle) * (this.stats.speed * 0.7) * dt;
      this.y += Math.sin(angle) * (this.stats.speed * 0.7) * dt;
      this.sprite.flipX = target.x < this.x;
    }

    // Auto Skill Cast with Cooldown Reduction
    const effectiveCooldown = this.skillMaxCooldown * (1 - (this.stats.cooldownReduction || 0));
    if (this.skillCooldown <= 0 && minDist <= optimalRange + 60) {
      this.castClassSkill(aliveMonsters, target, onMonsterKilled);
      this.skillCooldown = effectiveCooldown;
    }

    // Auto Basic Attack
    const attackInterval = 1 / Math.max(0.2, this.stats.attackSpeed);
    if (this.attackTimer >= attackInterval && minDist <= optimalRange + 25) {
      this.attackTimer = 0;
      this.performBasicAttack(target, aliveMonsters, onMonsterKilled);
    }

    // Update Minions
    this.minions = this.minions.filter((min) => !min.isDead);
    for (const minion of this.minions) {
      minion.updateMinion(delta, aliveMonsters, (m, dmg) => {
        const result = m.takeDamage(dmg, false, 'phys');
        this.particles.createHitSparks(m.x, m.y);
        this.damageText.showDamage(m.x, m.y, result.finalDamage, false, 'phys');
        if (result.isDead) onMonsterKilled(m);
      });
    }

    this.updateHpBar();
  }

  private processRelicTick(monsters: Monster[], onMonsterKilled: (m: Monster) => void): void {
    // 1. Cursed Heart (-2 HP/s)
    if (RelicManager.hasRelic(this.relics, 'relic_cursed_heart')) {
      this.stats.hp = Math.max(1, this.stats.hp - 2);
      this.updateHpBar();
    }

    // 2. Sunfire Aegis (burns monsters within 130px for 30 DMG/s)
    if (RelicManager.hasRelic(this.relics, 'relic_sunfire_aegis')) {
      monsters.forEach((m) => {
        if (!m.isDead && Phaser.Math.Distance.Between(this.x, this.y, m.x, m.y) <= 130) {
          const res = m.takeDamage(30, false, 'fire');
          m.applyBurn(2.0);
          this.damageText.showDamage(m.x, m.y, res.finalDamage, false, 'fire');
          if (res.isDead) onMonsterKilled(m);
        }
      });
    }
  }

  private performBasicAttack(target: Monster, allMonsters: Monster[], onMonsterKilled: (m: Monster) => void): void {
    this.attackCount++;

    // Squash & Stretch animation
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 1.25,
      scaleY: 0.8,
      yoyo: true,
      duration: 90,
      ease: 'Back.easeOut'
    });

    const isCrit = Math.random() < this.stats.critRate;
    let baseDamage = this.stats.atk * (0.9 + Math.random() * 0.2);

    // Relic: Executioner Axe (+100% damage against low HP enemies < 30%)
    if (RelicManager.hasRelic(this.relics, 'relic_executioner_axe') && target.hp < target.maxHp * 0.3) {
      baseDamage *= 2.0;
    }

    if (isCrit) {
      baseDamage *= this.stats.critDmg;
    }

    // Visuals & Sound
    if (this.heroClass === 'knight') {
      this.audio.playSlash();
      const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
      this.particles.createSlashWave(this.x + Math.cos(angle) * 20, this.y + Math.sin(angle) * 20, angle, 40);
    } else if (this.heroClass === 'mage') {
      this.audio.playMagic();
      this.fireProjectile(target, 0x8844ff, 350);
    } else if (this.heroClass === 'rogue') {
      this.audio.playSlash();
      this.fireProjectile(target, 0x33dd66, 420);
    } else if (this.heroClass === 'paladin') {
      this.audio.playHit();
      const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
      this.particles.createSlashWave(this.x + Math.cos(angle) * 22, this.y + Math.sin(angle) * 22, angle, 45);
      this.particles.createHitSparks(target.x, target.y, 0xfde047);
    } else if (this.heroClass === 'ranger') {
      this.audio.playSlash();
      this.fireProjectile(target, 0x38bdf8, 480);
    } else if (this.heroClass === 'warlock') {
      this.audio.playMagic();
      this.fireProjectile(target, 0xa855f7, 360);
    }

    if (isCrit) {
      this.audio.playCrit();
    } else {
      this.audio.playHit();
    }

    // Apply Damage
    const dmgResult = target.takeDamage(baseDamage, isCrit, 'phys');
    this.particles.createHitSparks(target.x, target.y);
    this.particles.createBloodSplat(target.x, target.y);
    this.damageText.showDamage(target.x, target.y, dmgResult.finalDamage, isCrit, 'phys');

    // Life Steal
    let totalLifesteal = this.stats.lifeSteal;
    if (isCrit && RelicManager.hasRelic(this.relics, 'relic_vampiric_claw')) {
      totalLifesteal += 0.25;
    }
    if (totalLifesteal > 0 && dmgResult.finalDamage > 0) {
      this.heal(dmgResult.finalDamage * totalLifesteal);
    }

    // Relic: Storm Essence (35% chain lightning)
    if (RelicManager.hasRelic(this.relics, 'relic_storm_essence') && Math.random() < 0.35) {
      this.audio.playLightning();
      const nearby = allMonsters.filter((m) => !m.isDead && m !== target).slice(0, 3);
      nearby.forEach((m) => {
        this.particles.createLightningBolt(target.x, target.y, m.x, m.y);
        const res = m.takeDamage(this.stats.atk * 0.8, false, 'phys');
        this.damageText.showDamage(m.x, m.y, res.finalDamage, false, 'phys');
        if (res.isDead) onMonsterKilled(m);
      });
    }

    // Apply Elemental Synergies
    this.applySynergyEffects(target, allMonsters, onMonsterKilled);

    if (dmgResult.isDead) {
      this.onEnemyKilled(target, onMonsterKilled);
    }
  }

  private castClassSkill(monsters: Monster[], primaryTarget: Monster, onMonsterKilled: (m: Monster) => void): void {
    // Check Active Evolutions
    const hasVortex = this.evolutions.some((e) => e.effectType === 'vortex');
    const hasSingularity = this.evolutions.some((e) => e.effectType === 'singularity');
    const hasClones = this.evolutions.some((e) => e.effectType === 'clones');
    const hasLightningCyclone = this.evolutions.some((e) => e.effectType === 'lightning_cyclone');
    const hasCocytusFreeze = this.evolutions.some((e) => e.effectType === 'cocytus_freeze');
    const hasVenomStorm = this.evolutions.some((e) => e.effectType === 'venom_storm');
    const hasHolyConsecration = this.evolutions.some((e) => e.effectType === 'holy_consecration');
    const hasWrathOfHeavens = this.evolutions.some((e) => e.effectType === 'wrath_of_heavens');
    const hasBlizzardStorm = this.evolutions.some((e) => e.effectType === 'blizzard_storm');
    const hasFrostBarrage = this.evolutions.some((e) => e.effectType === 'frost_barrage');
    const hasAbyssalTorment = this.evolutions.some((e) => e.effectType === 'abyssal_torment');
    const hasSoulHarvest = this.evolutions.some((e) => e.effectType === 'soul_harvest');

    if (this.heroClass === 'knight') {
      this.audio.playSlash();
      this.scene.cameras.main.shake(140, 0.008);

      // Spin visual
      this.scene.tweens.add({
        targets: this.sprite,
        rotation: Math.PI * 2,
        duration: 250,
        onComplete: () => {
          this.sprite.rotation = 0;
        }
      });

      this.particles.createSlashWave(this.x, this.y, 0, 75);
      this.particles.createSlashWave(this.x, this.y, Math.PI, 75);

      // Vortex Evolution Suction: Pull all nearby monsters toward hero
      if (hasVortex) {
        monsters.forEach((m) => {
          if (!m.isDead && Phaser.Math.Distance.Between(this.x, this.y, m.x, m.y) <= 150) {
            this.scene.tweens.add({
              targets: m,
              x: this.x + (m.x - this.x) * 0.3,
              y: this.y + (m.y - this.y) * 0.3,
              duration: 150,
              ease: 'Quad.easeIn'
            });
          }
        });
      }

      // Lightning Cyclone: Shoot 4 lightning bolts
      if (hasLightningCyclone) {
        this.audio.playLightning();
        for (let i = 0; i < 4; i++) {
          const ang = (Math.PI * 2 * i) / 4;
          const lx = this.x + Math.cos(ang) * 90;
          const ly = this.y + Math.sin(ang) * 90;
          this.particles.createLightningBolt(this.x, this.y, lx, ly);
        }
      }

      // Damage all nearby monsters
      const hitRadius = hasVortex ? 110 : 85;
      monsters.forEach((m) => {
        const dist = Phaser.Math.Distance.Between(this.x, this.y, m.x, m.y);
        if (dist <= hitRadius) {
          const dmg = this.stats.atk * (hasVortex ? 2.2 : 1.8);
          const res = m.takeDamage(dmg, true, 'phys');
          this.particles.createHitSparks(m.x, m.y, 0xffaa00);
          this.damageText.showDamage(m.x, m.y, res.finalDamage, true, 'phys');
          if (res.isDead) onMonsterKilled(m);
        }
      });
    } else if (this.heroClass === 'mage') {
      this.audio.playExplosion();
      this.scene.cameras.main.shake(200, 0.01);

      const targetX = primaryTarget.x;
      const targetY = primaryTarget.y;

      // Singularity Evolution: pull all monsters into target point then detonate!
      if (hasSingularity) {
        monsters.forEach((m) => {
          if (!m.isDead) {
            this.scene.tweens.add({
              targets: m,
              x: targetX + (m.x - targetX) * 0.4,
              y: targetY + (m.y - targetY) * 0.4,
              duration: 200,
              ease: 'Back.easeIn'
            });
          }
        });
      }

      this.particles.createFireExplosion(targetX, targetY, hasSingularity ? 110 : 80);

      monsters.forEach((m) => {
        const dist = Phaser.Math.Distance.Between(targetX, targetY, m.x, m.y);
        if (dist <= (hasSingularity ? 120 : 80)) {
          const dmg = this.stats.atk * (hasSingularity ? 3.0 : 2.4);
          const res = m.takeDamage(dmg, true, hasCocytusFreeze ? 'frost' : 'fire');
          if (hasCocytusFreeze) {
            m.applyFreeze(2.0);
          } else {
            m.applyBurn(3.0);
          }
          this.damageText.showDamage(m.x, m.y, res.finalDamage, true, hasCocytusFreeze ? 'frost' : 'fire');
          if (res.isDead) onMonsterKilled(m);
        }
      });
    } else if (this.heroClass === 'rogue') {
      this.audio.playSlash();
      this.particles.createBloodSplat(this.x, this.y, 0x111122);

      // Teleport behind primary target
      const angle = Phaser.Math.Angle.Between(this.x, this.y, primaryTarget.x, primaryTarget.y);
      this.x = primaryTarget.x + Math.cos(angle) * 35;
      this.y = primaryTarget.y + Math.sin(angle) * 35;

      const critDmg = this.stats.atk * this.stats.critDmg * 1.6;
      const res = primaryTarget.takeDamage(critDmg, true, 'phys');
      this.damageText.showDamage(primaryTarget.x, primaryTarget.y, res.finalDamage, true, 'phys');
      this.particles.createHitSparks(primaryTarget.x, primaryTarget.y, 0x00ff88);

      if (res.isDead) onMonsterKilled(primaryTarget);

      // Clones Evolution: summon 2 temporary shadow clones!
      if (hasClones && this.minions.length < 5) {
        for (let i = 0; i < 2; i++) {
          const clone = new Minion(this.scene, this.x + (Math.random() * 40 - 20), this.y + (Math.random() * 40 - 20), this.stats.atk * 0.5);
          this.minions.push(clone);
        }
      }

      // Venom Storm: 16 daggers in 360 degrees
      const knifeCount = hasVenomStorm ? 16 : 4;
      for (let i = 0; i < knifeCount; i++) {
        const knifeAngle = angle + (i * Math.PI * 2) / knifeCount;
        const knifeX = this.x + Math.cos(knifeAngle) * 75;
        const knifeY = this.y + Math.sin(knifeAngle) * 75;
        this.particles.createHitSparks(knifeX, knifeY, 0x33ff66);
      }
    } else if (this.heroClass === 'paladin') {
      // Holy Smite: Creates holy circle damaging enemies and giving hero shield
      this.audio.playLevelUp();
      this.scene.cameras.main.shake(160, 0.009);

      // Holy Circle visual effect on ground
      const circleRadius = hasHolyConsecration ? 120 : 90;
      const holyRing = this.scene.add.circle(this.x, this.y, 16, 0xfde047, 0.4);
      holyRing.setStrokeStyle(3, 0xfef08a, 0.9);
      holyRing.setDepth(20);

      this.scene.tweens.add({
        targets: holyRing,
        radius: circleRadius,
        alpha: 0,
        duration: 450,
        ease: 'Cubic.easeOut',
        onComplete: () => holyRing.destroy()
      });

      // Upward golden ray sparkles
      const sparkCount = hasWrathOfHeavens ? 12 : 6;
      for (let i = 0; i < sparkCount; i++) {
        const ang = (Math.PI * 2 * i) / sparkCount;
        const px = this.x + Math.cos(ang) * (circleRadius * 0.6);
        const py = this.y + Math.sin(ang) * (circleRadius * 0.6);
        this.particles.createHitSparks(px, py, 0xfde047);
      }

      // Holy Shield granted to hero
      const shieldBonus = hasHolyConsecration ? 1.5 : 1.0;
      const shieldAmount = Math.round((this.stats.maxHp * 0.22 + this.stats.atk * 0.5) * shieldBonus);
      this.addShield(shieldAmount);
      this.damageText.showHeal(this.x, this.y - 20, shieldAmount);

      // Damage all enemies in holy circle
      monsters.forEach((m) => {
        const dist = Phaser.Math.Distance.Between(this.x, this.y, m.x, m.y);
        if (dist <= circleRadius) {
          const dmgMultiplier = hasWrathOfHeavens ? 3.5 : 2.3;
          const dmg = this.stats.atk * dmgMultiplier;
          const res = m.takeDamage(dmg, true, 'fire');
          this.particles.createHitSparks(m.x, m.y, 0xfde047);
          this.damageText.showDamage(m.x, m.y, res.finalDamage, true, 'fire');
          if (res.isDead) onMonsterKilled(m);
        }
      });
    } else if (this.heroClass === 'ranger') {
      // Frost Volley: Fires 5 piercing frost arrows freezing/slowing enemies
      this.audio.playSlash();
      this.scene.cameras.main.shake(120, 0.006);

      const baseAngle = Phaser.Math.Angle.Between(this.x, this.y, primaryTarget.x, primaryTarget.y);
      const arrowCount = hasFrostBarrage ? 9 : 5;
      const spreadStep = hasFrostBarrage ? 0.12 : 0.16; // radians
      const targetDistance = 270;

      for (let i = 0; i < arrowCount; i++) {
        const offset = (i - (arrowCount - 1) / 2) * spreadStep;
        const arrowAngle = baseAngle + offset;
        const destX = this.x + Math.cos(arrowAngle) * targetDistance;
        const destY = this.y + Math.sin(arrowAngle) * targetDistance;

        // Visual Frost Arrow projectile
        const arrow = this.scene.add.rectangle(this.x, this.y, 16, 3, 0x38bdf8);
        arrow.setStrokeStyle(1, 0xffffff);
        arrow.setRotation(arrowAngle);
        arrow.setDepth(32);

        this.scene.tweens.add({
          targets: arrow,
          x: destX,
          y: destY,
          duration: 260,
          ease: 'Linear',
          onComplete: () => arrow.destroy()
        });

        // Pierce check: Hit all enemies within the trajectory cone
        monsters.forEach((m) => {
          if (!m.isDead) {
            const d = Phaser.Math.Distance.Between(this.x, this.y, m.x, m.y);
            if (d <= targetDistance + 40) {
              const mAngle = Phaser.Math.Angle.Between(this.x, this.y, m.x, m.y);
              const angleDiff = Math.abs(Phaser.Math.Angle.Normalize(mAngle - arrowAngle));
              if (angleDiff < 0.16 || angleDiff > Math.PI * 2 - 0.16) {
                const dmg = this.stats.atk * 1.5;
                const res = m.takeDamage(dmg, true, 'frost');
                m.applyFreeze(hasBlizzardStorm ? 3.5 : 2.0);
                this.particles.createHitSparks(m.x, m.y, 0x38bdf8);
                this.damageText.showDamage(m.x, m.y, res.finalDamage, true, 'frost');
                if (res.isDead) onMonsterKilled(m);
              }
            }
          }
        });
      }
    } else if (this.heroClass === 'warlock') {
      // Soul Drain: Drains HP from closest 3 monsters and gains souls/shield
      this.audio.playMagic();
      this.scene.cameras.main.shake(140, 0.007);

      const targetCount = hasAbyssalTorment ? 5 : 3;
      const sortedMonsters = [...monsters]
        .filter((m) => !m.isDead && Phaser.Math.Distance.Between(this.x, this.y, m.x, m.y) <= 220)
        .sort((a, b) => Phaser.Math.Distance.Between(this.x, this.y, a.x, a.y) - Phaser.Math.Distance.Between(this.x, this.y, b.x, b.y))
        .slice(0, targetCount);

      const targetsToDrain = sortedMonsters.length > 0 ? sortedMonsters : (!primaryTarget.isDead ? [primaryTarget] : []);

      let totalDrained = 0;

      targetsToDrain.forEach((m) => {
        // Necrotic siphon lightning bolt
        this.particles.createLightningBolt(m.x, m.y, this.x, this.y);

        // Soul orb flying back to warlock
        const soulOrb = this.scene.add.circle(m.x, m.y, 5, 0xc084fc);
        soulOrb.setStrokeStyle(1, 0x22c55e);
        soulOrb.setDepth(35);
        this.scene.tweens.add({
          targets: soulOrb,
          x: this.x,
          y: this.y,
          duration: 250,
          ease: 'Quad.easeIn',
          onComplete: () => soulOrb.destroy()
        });

        const drainDmg = this.stats.atk * 1.8;
        const res = m.takeDamage(drainDmg, true, 'phys');
        this.particles.createBloodSplat(m.x, m.y, 0x581c87);
        this.damageText.showDamage(m.x, m.y, res.finalDamage, true, 'phys');
        totalDrained += res.finalDamage;

        // Soul Harvest: Summon skeleton if enemy dies
        if (res.isDead) {
          onMonsterKilled(m);
          if (hasSoulHarvest && this.minions.length < 5) {
            const minion = new Minion(this.scene, m.x, m.y, this.stats.atk * 0.4);
            this.minions.push(minion);
          }
        }
      });

      if (totalDrained > 0) {
        // Heal HP & Add Shield
        const healAmt = Math.round(totalDrained * 0.45);
        this.heal(healAmt);

        const shieldAmt = Math.round(totalDrained * 0.35 + 10);
        this.addShield(shieldAmt);

        // Gain Souls
        this.stats.souls += targetsToDrain.length;
        this.damageText.showHeal(this.x, this.y - 20, shieldAmt);
      }
    }
  }

  private fireProjectile(target: Monster, color: number, speed: number): void {
    const proj = this.scene.add.circle(this.x, this.y, 5, color);
    proj.setDepth(30);

    const dist = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);
    const duration = (dist / speed) * 1000;

    this.scene.tweens.add({
      targets: proj,
      x: target.x,
      y: target.y,
      duration: Math.max(80, duration),
      ease: 'Linear',
      onComplete: () => {
        proj.destroy();
      }
    });
  }

  private applySynergyEffects(target: Monster, monsters: Monster[], onMonsterKilled: (m: Monster) => void): void {
    const synergies = SynergyManager.getSynergyCount(this.perks, this.equipment);

    // Fire Synergy
    if (synergies.fire > 0) {
      target.applyBurn(2.5);
    }

    // Frost Synergy
    if (synergies.frost > 0 && Math.random() < 0.25) {
      target.applyFreeze(1.5);
    }

    // Lightning Synergy
    if (synergies.lightning > 0 && this.attackCount % 3 === 0) {
      this.audio.playLightning();
      const nearby = monsters.filter((m) => !m.isDead && m !== target).slice(0, 2);
      nearby.forEach((m) => {
        this.particles.createLightningBolt(target.x, target.y, m.x, m.y);
        const lightningDmg = this.stats.atk * 0.7;
        const res = m.takeDamage(lightningDmg, false, 'phys');
        this.damageText.showDamage(m.x, m.y, res.finalDamage, false, 'phys');
        if (res.isDead) onMonsterKilled(m);
      });
    }
  }

  private onEnemyKilled(target: Monster, onMonsterKilled: (m: Monster) => void): void {
    onMonsterKilled(target);
    this.killCount++;

    // Relic: Chrono Glass (freeze all monsters every 10 kills)
    if (RelicManager.hasRelic(this.relics, 'relic_chrono_glass') && this.killCount % 10 === 0) {
      this.audio.playMagic();
      this.damageText.showDodge(this.x, this.y);
    }

    // Summoner synergy
    const synergies = SynergyManager.getSynergyCount(this.perks, this.equipment);
    const maxMinions = RelicManager.hasRelic(this.relics, 'relic_kings_ossuary') ? 6 : 3;

    if (synergies.summoner > 0 && this.minions.length < maxMinions) {
      if (Math.random() < 0.35 + synergies.summoner * 0.1) {
        this.audio.playMagic();
        const minion = new Minion(this.scene, this.x + (Math.random() * 40 - 20), this.y + (Math.random() * 40 - 20), this.stats.atk * 0.35);
        this.minions.push(minion);
      }
    }
  }

  public takeDamage(rawDamage: number, attacker?: Monster): { finalDamage: number; isDead: boolean } {
    if (this.isDead) return { finalDamage: 0, isDead: true };

    // Dodge check
    if (Math.random() < this.stats.dodgeRate) {
      this.damageText.showDodge(this.x, this.y);
      return { finalDamage: 0, isDead: false };
    }

    // Defense mitigation
    const mitigation = 1 - Math.min(0.75, this.stats.def / 100);
    let finalDamage = Math.max(1, rawDamage * mitigation);

    // Shield absorption
    if (this.shield > 0) {
      if (this.shield >= finalDamage) {
        this.shield -= finalDamage;
        this.damageText.showDamage(this.x, this.y, finalDamage, false, 'frost');
        this.updateHpBar();
        return { finalDamage: 0, isDead: false };
      } else {
        finalDamage -= this.shield;
        this.shield = 0;
      }
    }

    this.stats.hp -= finalDamage;
    this.damageText.showDamage(this.x, this.y, finalDamage, false, 'phys');
    this.particles.createBloodSplat(this.x, this.y, 0xbb1122);

    // Thorns reflect (doubled if Mirror Aegis relic owned)
    if (this.stats.thorns > 0 && attacker && !attacker.isDead) {
      let thornsDmg = this.stats.thorns;
      if (RelicManager.hasRelic(this.relics, 'relic_mirror_aegis')) thornsDmg *= 2.0;
      const res = attacker.takeDamage(thornsDmg, false, 'thorns');
      this.damageText.showDamage(attacker.x, attacker.y, res.finalDamage, false, 'thorns');
    }

    // Flash white
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0.3,
      yoyo: true,
      duration: 60
    });

    if (this.stats.hp <= 0) {
      // Relic: Phoenix Feather (revive with 50% HP once per run)
      if (RelicManager.hasRelic(this.relics, 'relic_phoenix_feather') && !this.phoenixFeatherUsed) {
        this.phoenixFeatherUsed = true;
        this.stats.hp = Math.round(this.stats.maxHp * 0.5);
        this.audio.playVictory();
        this.damageText.showHeal(this.x, this.y, this.stats.hp);
        this.updateHpBar();
        return { finalDamage, isDead: false };
      }

      this.stats.hp = 0;
      this.isDead = true;
      this.die();
    }

    this.updateHpBar();
    return { finalDamage, isDead: this.isDead };
  }

  public heal(amount: number): void {
    if (this.isDead) return;
    this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + amount);
    this.damageText.showHeal(this.x, this.y, amount);

    // Relic: Alchemist Flask (grants 50 HP shield when healed)
    if (RelicManager.hasRelic(this.relics, 'relic_alchemist_flask')) {
      this.addShield(50);
    }

    this.updateHpBar();
  }

  public addShield(amount: number): void {
    this.shield = Math.min(this.stats.maxHp * 0.5, this.shield + amount);
    this.updateHpBar();
  }

  public addPerk(perk: PerkCard): void {
    this.perks.push(perk);
    this.refreshDerivedStats();
  }

  public equipItem(item: EquipmentItem): void {
    this.equipment.push(item);
    this.refreshDerivedStats();
  }

  public addRelic(relic: RelicItem): void {
    this.relics.push(relic);
    this.refreshDerivedStats();
  }

  public addEvolution(evo: SkillEvolution): void {
    this.evolutions.push(evo);
    this.refreshDerivedStats();
  }

  private updateHpBar(): void {
    const ratio = Math.max(0, this.stats.hp / this.stats.maxHp);
    const barWidth = 44;
    this.hpBarFill.width = barWidth * ratio;

    if (this.shield > 0) {
      const shieldRatio = Math.min(1, this.shield / (this.stats.maxHp * 0.5));
      this.shieldBar.width = barWidth * shieldRatio;
      this.shieldBar.setVisible(true);
    } else {
      this.shieldBar.setVisible(false);
    }
  }

  private die(): void {
    this.scene.tweens.add({
      targets: this,
      rotation: Math.PI / 2,
      alpha: 0.6,
      duration: 400,
      ease: 'Back.easeIn'
    });
  }
}
