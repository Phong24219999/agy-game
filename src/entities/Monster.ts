import Phaser from 'phaser';
import { EliteAffix, MonsterDebuffEffect } from '../types/game';
import { AudioSystem } from '../systems/AudioSystem';

export type MonsterType =
  // Floor 1: Catacombs
  | 'skeleton'
  | 'skeleton_archer'
  | 'slime'
  | 'ghoul'
  | 'boss_lich'
  // Floor 2: Inferno
  | 'hellhound'
  | 'imp'
  | 'cultist'
  | 'golem'
  | 'boss_ignis'
  // Floor 3: Void
  | 'void_eye'
  | 'stalker'
  | 'necromancer'
  | 'tentacle'
  | 'boss_sovereign'
  // Aliases / Backward Compatibility
  | 'boss';

export interface MonsterConfig {
  type: MonsterType;
  name: string;
  maxHp: number;
  atk: number;
  def: number;
  speed: number;
  range: number;
  attackCooldown: number;
  goldValue: number;
  soulValue: number;
  isBoss?: boolean;
  floor?: number;
  affixes?: EliteAffix[];
  debuffs?: MonsterDebuffEffect[];
}

export const ELITE_AFFIXES: EliteAffix[] = [
  {
    type: 'volatile',
    name: 'Bộc Phá',
    prefix: '[Phát Nổ]',
    color: '#ff4444',
    bonusHpMultiplier: 1.25,
    bonusAtkMultiplier: 1.15,
    bonusSpeedMultiplier: 1.05,
    description: 'Nổ tung khi chết, gây sát thương diện rộng.'
  },
  {
    type: 'shielded',
    name: 'Khiên Cương Thiết',
    prefix: '[Khiên Bọc]',
    color: '#33aaff',
    bonusHpMultiplier: 1.35,
    bonusAtkMultiplier: 1.05,
    bonusSpeedMultiplier: 0.95,
    description: 'Nhận 40% máu tối đa làm lớp giáp hấp thụ sát thương.'
  },
  {
    type: 'swift',
    name: 'Cuồng Phong',
    prefix: '[Siêu Tốc]',
    color: '#34d399',
    bonusHpMultiplier: 1.1,
    bonusAtkMultiplier: 1.2,
    bonusSpeedMultiplier: 1.45,
    description: 'Tốc độ di chuyển và tấn công tăng vượt trội.'
  },
  {
    type: 'vampiric',
    name: 'Hút Máu',
    prefix: '[Hút Huyết]',
    color: '#f43f5e',
    bonusHpMultiplier: 1.2,
    bonusAtkMultiplier: 1.25,
    bonusSpeedMultiplier: 1.05,
    description: 'Hồi phục HP khi đánh trúng mục tiêu.'
  },
  {
    type: 'chilling',
    name: 'Hàn Băng',
    prefix: '[Băng Giá]',
    color: '#38bdf8',
    bonusHpMultiplier: 1.3,
    bonusAtkMultiplier: 1.15,
    bonusSpeedMultiplier: 1.0,
    description: 'Tỏa ra luồng khí lạnh làm chậm đối thủ.'
  }
];

// Centralized Monster Balance Database
// Floor 1: ATK +35-50%, HP +25-35%
// Floor 2 & 3: Significant baseline and depth scaling
export const BASE_MONSTER_STATS: Record<MonsterType, {
  name: string;
  baseHp: number;
  baseAtk: number;
  baseDef: number;
  speed: number;
  range: number;
  attackCooldown: number;
  goldValue: number;
  soulValue: number;
  isBoss?: boolean;
  defaultDebuffs?: MonsterDebuffEffect[];
}> = {
  // --- Floor 1: Catacombs ---
  skeleton: {
    name: 'Chiến Binh Xương',
    baseHp: 102, // +34%
    baseAtk: 16,  // +45%
    baseDef: 8,
    speed: 68,
    range: 40,
    attackCooldown: 1.25,
    goldValue: 8,
    soulValue: 3
  },
  skeleton_archer: {
    name: 'Xạ Thủ Xương',
    baseHp: 78,   // +34%
    baseAtk: 20,  // +43%
    baseDef: 4,
    speed: 58,
    range: 185,
    attackCooldown: 1.55,
    goldValue: 9,
    soulValue: 3,
    defaultDebuffs: [{ type: 'chilling', duration: 2.5, value: 0.25 }]
  },
  slime: {
    name: 'Quái Chất Nhầy',
    baseHp: 82,   // +32%
    baseAtk: 13,  // +44%
    baseDef: 4,
    speed: 52,
    range: 34,
    attackCooldown: 0.95,
    goldValue: 7,
    soulValue: 2,
    defaultDebuffs: [{ type: 'poisonous', duration: 3.0, value: 6 }]
  },
  ghoul: {
    name: 'Ngạ Quỷ Ăn Xác',
    baseHp: 118,  // +34%
    baseAtk: 20,  // +43%
    baseDef: 6,
    speed: 112,
    range: 44,
    attackCooldown: 0.90,
    goldValue: 10,
    soulValue: 3,
    defaultDebuffs: [{ type: 'poisonous', duration: 3.5, value: 8 }]
  },
  boss_lich: {
    name: 'Lich Vương Tử Linh',
    baseHp: 750,  // +34%
    baseAtk: 34,  // +42%
    baseDef: 14,
    speed: 52,
    range: 165,
    attackCooldown: 1.5,
    goldValue: 90,
    soulValue: 45,
    isBoss: true,
    defaultDebuffs: [{ type: 'chilling', duration: 2.5, value: 0.25 }]
  },

  // --- Floor 2: Inferno ---
  hellhound: {
    name: 'Chó Săn Địa Ngục',
    baseHp: 145,  // +51%
    baseAtk: 25,  // +56%
    baseDef: 8,
    speed: 125,
    range: 46,
    attackCooldown: 0.95,
    goldValue: 12,
    soulValue: 4,
    defaultDebuffs: [{ type: 'armor_shred', duration: 3.0, value: 0.20 }]
  },
  imp: {
    name: 'Tiểu Quỷ Hư Vô',
    baseHp: 88,   // +63%
    baseAtk: 21,  // +61%
    baseDef: 3,
    speed: 80,
    range: 140,
    attackCooldown: 1.4,
    goldValue: 10,
    soulValue: 3
  },
  cultist: {
    name: 'Cuồng Tín Hỏa Giáo',
    baseHp: 140,  // +55%
    baseAtk: 26,  // +53%
    baseDef: 8,
    speed: 70,
    range: 72,
    attackCooldown: 1.3,
    goldValue: 12,
    soulValue: 4,
    defaultDebuffs: [{ type: 'armor_shred', duration: 3.5, value: 0.25 }]
  },
  golem: {
    name: 'Golem Nham Thạch',
    baseHp: 340,  // +55%
    baseAtk: 38,  // +58%
    baseDef: 22,
    speed: 46,
    range: 50,
    attackCooldown: 1.7,
    goldValue: 22,
    soulValue: 8,
    defaultDebuffs: [{ type: 'armor_shred', duration: 4.0, value: 0.35 }]
  },
  boss_ignis: {
    name: 'Hỏa Ma Tống Xuất Ignis',
    baseHp: 1150, // +51%
    baseAtk: 45,  // +50%
    baseDef: 20,
    speed: 52,
    range: 58,
    attackCooldown: 1.45,
    goldValue: 120,
    soulValue: 55,
    isBoss: true,
    defaultDebuffs: [{ type: 'armor_shred', duration: 3.5, value: 0.30 }]
  },

  // --- Floor 3: Void ---
  void_eye: {
    name: 'Mắt Ma Hư Vô',
    baseHp: 160,  // +74%
    baseAtk: 32,  // +60%
    baseDef: 6,
    speed: 65,
    range: 185,
    attackCooldown: 1.6,
    goldValue: 14,
    soulValue: 5,
    defaultDebuffs: [{ type: 'chilling', duration: 2.5, value: 0.25 }]
  },
  stalker: {
    name: 'Kẻ Săn Mồi Bóng Đêm',
    baseHp: 195,  // +70%
    baseAtk: 38,  // +65%
    baseDef: 10,
    speed: 130,
    range: 46,
    attackCooldown: 0.85,
    goldValue: 16,
    soulValue: 6
  },
  necromancer: {
    name: 'Pháp Sư Chiêu Hồn',
    baseHp: 245,  // +63%
    baseAtk: 34,  // +70%
    baseDef: 12,
    speed: 60,
    range: 155,
    attackCooldown: 1.7,
    goldValue: 18,
    soulValue: 6,
    defaultDebuffs: [{ type: 'poisonous', duration: 4.0, value: 10 }]
  },
  tentacle: {
    name: 'Xúc Tu Vực Thẳm',
    baseHp: 410,  // +64%
    baseAtk: 44,  // +63%
    baseDef: 18,
    speed: 0,
    range: 120,
    attackCooldown: 1.35,
    goldValue: 18,
    soulValue: 6
  },
  boss_sovereign: {
    name: 'Chúa Tể Hư Vô Sovereign',
    baseHp: 1650, // +62%
    baseAtk: 58,  // +61%
    baseDef: 25,
    speed: 58,
    range: 68,
    attackCooldown: 1.35,
    goldValue: 150,
    soulValue: 70,
    isBoss: true,
    defaultDebuffs: [
      { type: 'armor_shred', duration: 4.0, value: 0.35 },
      { type: 'chilling', duration: 2.5, value: 0.25 }
    ]
  },
  boss: {
    name: 'Chúa Tể Hư Vô Sovereign',
    baseHp: 1650,
    baseAtk: 58,
    baseDef: 25,
    speed: 58,
    range: 68,
    attackCooldown: 1.35,
    goldValue: 150,
    soulValue: 70,
    isBoss: true,
    defaultDebuffs: [
      { type: 'armor_shred', duration: 4.0, value: 0.35 },
      { type: 'chilling', duration: 2.5, value: 0.25 }
    ]
  }
};

export class Monster extends Phaser.GameObjects.Container {
  public monsterConfig: MonsterConfig;
  public hp: number;
  public maxHp: number;
  public isDead: boolean = false;
  public isBoss: boolean = false;
  public affixes: EliteAffix[] = [];
  public debuffs: MonsterDebuffEffect[] = [];

  private sprite: Phaser.GameObjects.Sprite;
  private hpBarBg: Phaser.GameObjects.Rectangle;
  private hpBarFill: Phaser.GameObjects.Rectangle;
  private shieldBar?: Phaser.GameObjects.Rectangle;
  private shield: number = 0;

  private baseSpeed: number;
  private baseAttackCooldown: number;
  private attackTimer: number = 0;
  private burnDuration: number = 0;
  private burnTickTimer: number = 0;
  private freezeDuration: number = 0;

  // AI Special States
  private leapTimer: number = 0;
  private isLeaping: boolean = false;

  // Cuồng Nộ (Enrage/Berserk) System
  public isBerserk: boolean = false;
  private berserkPulseTimer: number = 0;

  // Telegraph Heavy Attack System (Golem & Elites)
  private heavyAttackCooldown: number = 6.5;
  private heavyAttackTimer: number = 2.5;
  public isExecutingHeavyAttack: boolean = false;
  private heavyAttackTelegraph?: Phaser.GameObjects.Arc;

  // Boss Multi-Phase Mechanics (100% -> 50% -> 25% HP)
  public bossPhase: number = 1;
  public isEnraged: boolean = false;
  private bossAbilityTimer: number = 0;
  private bossSummonCount: number = 0;

  public static createMonsterConfig(
    type: MonsterType,
    floor: number = 1,
    overrides?: Partial<MonsterConfig>
  ): MonsterConfig {
    const base = BASE_MONSTER_STATS[type] || BASE_MONSTER_STATS.skeleton;
    const currentFloor = Math.max(1, floor);
    const floorHpScale = currentFloor > 1 ? Math.pow(1 + 0.38 * (currentFloor - 1), 1.20) : 1;
    const floorAtkScale = currentFloor > 1 ? 1 + 0.32 * (currentFloor - 1) : 1;

    const config: MonsterConfig = {
      type,
      name: base.name,
      maxHp: Math.round(base.baseHp * floorHpScale),
      atk: Math.round(base.baseAtk * floorAtkScale),
      def: base.baseDef + Math.floor((currentFloor - 1) * 2),
      speed: base.speed,
      range: base.range,
      attackCooldown: base.attackCooldown,
      goldValue: base.goldValue + (currentFloor - 1) * 3,
      soulValue: base.soulValue + Math.floor((currentFloor - 1) * 1.5),
      isBoss: base.isBoss,
      floor: currentFloor,
      debuffs: base.defaultDebuffs ? base.defaultDebuffs.map((d) => ({ ...d })) : [],
      ...overrides
    };

    return config;
  }

  constructor(scene: Phaser.Scene, x: number, y: number, config: MonsterConfig) {
    super(scene, x, y);
    this.monsterConfig = config;
    this.isBoss = !!config.isBoss || config.type.startsWith('boss');
    this.affixes = config.affixes || [];

    // 1. Difficulty Scaling based on floor depth
    const floor = Math.max(1, config.floor || 1);
    const hpScale = Math.pow(1 + 0.38 * (floor - 1), 1.20);
    const atkScale = 1 + 0.32 * (floor - 1);

    let finalMaxHp = Math.round(config.maxHp * (config.floor && config.floor > 1 ? 1 : hpScale));
    let finalAtk = Math.round(config.atk * (config.floor && config.floor > 1 ? 1 : atkScale));
    let finalSpeed = config.speed;

    // 2. Apply Elite Affixes multipliers
    for (const affix of this.affixes) {
      finalMaxHp = Math.round(finalMaxHp * affix.bonusHpMultiplier);
      finalAtk = Math.round(finalAtk * affix.bonusAtkMultiplier);
      finalSpeed = Math.round(finalSpeed * affix.bonusSpeedMultiplier);
    }

    this.maxHp = finalMaxHp;
    this.hp = finalMaxHp;
    this.monsterConfig.atk = finalAtk;
    this.monsterConfig.speed = finalSpeed;
    this.baseSpeed = finalSpeed;
    this.baseAttackCooldown = config.attackCooldown;

    // 3. Resolve Debuffs
    const baseStats = BASE_MONSTER_STATS[config.type];
    const inheritedDebuffs = baseStats?.defaultDebuffs ? baseStats.defaultDebuffs.map((d) => ({ ...d })) : [];
    this.debuffs = config.debuffs ? [...config.debuffs] : inheritedDebuffs;

    // Affix chilling bonus debuff
    if (this.affixes.some((a) => a.type === 'chilling')) {
      if (!this.debuffs.some((d) => d.type === 'chilling')) {
        this.debuffs.push({ type: 'chilling', duration: 3.0, value: 0.30 });
      }
    }

    // 4. Resolve Texture Key
    let textureKey = `monster_${config.type}`;
    if (config.type === 'boss') {
      textureKey = scene.textures.exists('monster_boss_sovereign')
        ? 'monster_boss_sovereign'
        : 'monster_boss';
    }
    if (!scene.textures.exists(textureKey)) {
      if (scene.textures.exists('monster_skeleton')) {
        textureKey = 'monster_skeleton';
      }
    }

    this.sprite = scene.add.sprite(0, 0, textureKey);
    this.add(this.sprite);

    // 5. Elite Affix badge
    if (this.affixes.length > 0) {
      const affixNames = this.affixes.map((a) => a.prefix).join(' ');
      const badge = scene.add.text(0, -this.sprite.height / 2 - 20, affixNames, {
        fontFamily: 'sans-serif',
        fontSize: '10px',
        color: this.affixes[0].color,
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2
      }).setOrigin(0.5);
      this.add(badge);

      // Check Shielded affix
      if (this.affixes.some((a) => a.type === 'shielded')) {
        this.shield = Math.round(this.maxHp * 0.4);
      }
    }

    // 6. HP Bar
    const barWidth = this.isBoss ? 80 : 36;
    const barHeight = this.isBoss ? 6 : 4;
    const barY = -this.sprite.height / 2 - 8;

    this.hpBarBg = scene.add.rectangle(0, barY, barWidth, barHeight, 0x222222);
    this.hpBarFill = scene.add.rectangle(-barWidth / 2, barY, barWidth, barHeight, 0xee2244);
    this.hpBarFill.setOrigin(0, 0.5);

    this.add(this.hpBarBg);
    this.add(this.hpBarFill);

    // Shield Bar (always added, visible when shield > 0)
    this.shieldBar = scene.add.rectangle(-barWidth / 2, barY - 3, barWidth, 3, 0x33aaff);
    this.shieldBar.setOrigin(0, 0.5);
    this.shieldBar.setVisible(this.shield > 0);
    this.add(this.shieldBar);

    scene.add.existing(this);
    this.setDepth(20);
  }

  public updateMonster(
    time: number,
    delta: number,
    targetX: number,
    targetY: number,
    onAttack: (atk: number, debuffs?: MonsterDebuffEffect[]) => void,
    onAoEAttack?: (x: number, y: number, radius: number, dmg: number) => void,
    onSummon?: (type: MonsterType, x: number, y: number) => void
  ): void {
    if (this.isDead) return;

    const dt = delta / 1000;

    // Freeze check
    if (this.freezeDuration > 0) {
      this.freezeDuration -= dt;
      this.sprite.setTint(0x44ddff);
      return;
    }

    // Burn check
    if (this.burnDuration > 0) {
      this.burnDuration -= dt;
      this.burnTickTimer += dt;
      if (this.burnTickTimer >= 0.5) {
        this.burnTickTimer = 0;
        this.takeDamage(10, false, 'fire');
      }
      this.sprite.setTint(0xff6622);
    } else if (this.isBerserk) {
      // Red blinking visual during Berserk
      this.berserkPulseTimer += dt;
      if (Math.sin(time * 0.015) > 0) {
        this.sprite.setTint(0xff2222);
      } else {
        this.sprite.clearTint();
      }
    } else if (!this.isEnraged && this.bossPhase === 1) {
      this.sprite.clearTint();
    }

    // Dispatch specialized behaviors
    const mType = this.monsterConfig.type;
    const dist = Phaser.Math.Distance.Between(this.x, this.y, targetX, targetY);

    if (this.isBoss) {
      this.updateBossBehavior(dt, dist, targetX, targetY, onAttack, onAoEAttack, onSummon);
      return;
    }

    if (mType === 'tentacle') {
      this.updateTentacleBehavior(time, dt, dist, onAttack);
      return;
    }

    if (mType === 'skeleton_archer' || mType === 'void_eye') {
      this.updateRangedBehavior(dt, dist, targetX, targetY, onAttack);
      return;
    }

    if (mType === 'hellhound' || mType === 'ghoul') {
      this.updateFastPounceBehavior(dt, dist, targetX, targetY, onAttack);
      return;
    }

    // Default Melee Behavior with Telegraph Heavy Attack
    this.updateStandardMeleeBehavior(dt, dist, targetX, targetY, onAttack, onAoEAttack);
  }

  // =========================================================================
  // BEHAVIOR 1: RANGED ATTACKERS (skeleton_archer, void_eye)
  // =========================================================================
  private updateRangedBehavior(
    dt: number,
    dist: number,
    targetX: number,
    targetY: number,
    onAttack: (atk: number, debuffs?: MonsterDebuffEffect[]) => void
  ): void {
    this.attackTimer += dt;
    const mType = this.monsterConfig.type;
    const idealMinDist = 110;
    const maxRange = this.monsterConfig.range;

    this.sprite.flipX = targetX < this.x;

    if (dist < idealMinDist) {
      // Too close! Retreat away from the hero
      const angle = Phaser.Math.Angle.Between(targetX, targetY, this.x, this.y);
      const retreatSpeed = this.monsterConfig.speed * 0.85;
      this.x = Phaser.Math.Clamp(this.x + Math.cos(angle) * retreatSpeed * dt, 70, 890);
      this.y = Phaser.Math.Clamp(this.y + Math.sin(angle) * retreatSpeed * dt, 70, 520);
    } else if (dist > maxRange) {
      // Out of range, advance forward
      const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
      this.x += Math.cos(angle) * this.monsterConfig.speed * dt;
      this.y += Math.sin(angle) * this.monsterConfig.speed * dt;
    }

    // Shoot projectile when in range
    if (dist <= maxRange && this.attackTimer >= this.monsterConfig.attackCooldown) {
      this.attackTimer = 0;
      this.playRangedAttackAnimation();

      const projType = mType === 'void_eye' ? 'void_orb' : 'bone_arrow';
      this.fireProjectile(targetX, targetY, projType, () => {
        onAttack(this.monsterConfig.atk, this.debuffs);
        this.checkVampiricHeal();
      });
    }

    this.updateHpBar();
  }

  private fireProjectile(
    targetX: number,
    targetY: number,
    type: 'bone_arrow' | 'void_orb',
    onHit: () => void
  ): void {
    const isOrb = type === 'void_orb';
    const color = isOrb ? 0xa855f7 : 0xe2e8f0;
    const size = isOrb ? 5 : 3.5;

    const proj = this.scene.add.circle(this.x, this.y, size, color);
    proj.setDepth(30);

    if (isOrb) {
      proj.setStrokeStyle(1.5, 0x38bdf8, 0.9);
    }

    const dist = Phaser.Math.Distance.Between(this.x, this.y, targetX, targetY);
    const speed = isOrb ? 360 : 420;
    const duration = Math.max(90, (dist / speed) * 1000);

    this.scene.tweens.add({
      targets: proj,
      x: targetX,
      y: targetY,
      duration,
      ease: 'Linear',
      onComplete: () => {
        proj.destroy();
        if (!this.isDead) {
          onHit();
        }
      }
    });
  }

  // =========================================================================
  // BEHAVIOR 2: FAST LEAPING / POUNCING (hellhound, ghoul)
  // =========================================================================
  private updateFastPounceBehavior(
    dt: number,
    dist: number,
    targetX: number,
    targetY: number,
    onAttack: (atk: number, debuffs?: MonsterDebuffEffect[]) => void
  ): void {
    if (this.isLeaping) return;

    this.leapTimer += dt;
    this.attackTimer += dt;
    this.sprite.flipX = targetX < this.x;

    // Pounce Trigger: Every 3.5s when within 80-230px
    if (this.leapTimer >= 3.5 && dist >= 75 && dist <= 230) {
      this.leapTimer = 0;
      this.executePounceLeap(targetX, targetY, onAttack);
      return;
    }

    // Normal fast sprint towards hero
    if (dist > this.monsterConfig.range) {
      const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
      this.x += Math.cos(angle) * this.monsterConfig.speed * dt;
      this.y += Math.sin(angle) * this.monsterConfig.speed * dt;
    } else {
      if (this.attackTimer >= this.monsterConfig.attackCooldown) {
        this.attackTimer = 0;
        this.playAttackAnimation();
        onAttack(this.monsterConfig.atk, this.debuffs);
        this.checkVampiricHeal();
      }
    }

    this.updateHpBar();
  }

  private executePounceLeap(
    targetX: number,
    targetY: number,
    onAttack: (atk: number, debuffs?: MonsterDebuffEffect[]) => void
  ): void {
    this.isLeaping = true;

    // 1. Telegraph crouch
    this.scene.tweens.add({
      targets: this.sprite,
      scaleY: 0.65,
      scaleX: 1.35,
      duration: 160,
      yoyo: true,
      ease: 'Quad.easeInOut'
    });

    // 2. High-speed leap towards target
    this.scene.time.delayedCall(160, () => {
      if (this.isDead) {
        this.isLeaping = false;
        return;
      }

      const leapAngle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
      const leapDist = Phaser.Math.Distance.Between(this.x, this.y, targetX, targetY);
      const destX = Phaser.Math.Clamp(this.x + Math.cos(leapAngle) * (leapDist + 10), 70, 890);
      const destY = Phaser.Math.Clamp(this.y + Math.sin(leapAngle) * (leapDist + 10), 70, 520);

      // Trailing dust/flame
      if (this.monsterConfig.type === 'hellhound') {
        const flame = this.scene.add.circle(this.x, this.y, 16, 0xf97316, 0.6);
        this.scene.tweens.add({
          targets: flame,
          scale: 1.8,
          alpha: 0,
          duration: 250,
          onComplete: () => flame.destroy()
        });
      }

      this.scene.tweens.add({
        targets: this,
        x: destX,
        y: destY,
        duration: 220,
        ease: 'Quad.easeOut',
        onComplete: () => {
          this.isLeaping = false;
          if (!this.isDead) {
            this.playAttackAnimation();
            // Bonus pounce strike (+30% damage) + pass debuffs
            onAttack(Math.round(this.monsterConfig.atk * 1.3), this.debuffs);
            this.scene.cameras.main.shake(90, 0.005);
            this.checkVampiricHeal();
          }
        }
      });
    });
  }

  // =========================================================================
  // BEHAVIOR 3: STATIONARY HIGH-DAMAGE OBSTACLE (tentacle)
  // =========================================================================
  private updateTentacleBehavior(
    time: number,
    dt: number,
    dist: number,
    onAttack: (atk: number, debuffs?: MonsterDebuffEffect[]) => void
  ): void {
    // Subtle writhing animation (stays completely in place)
    this.sprite.rotation = Math.sin(time * 0.004) * 0.07;
    this.sprite.scaleY = 1 + Math.sin(time * 0.006) * 0.06;

    this.attackTimer += dt;

    if (dist <= this.monsterConfig.range) {
      if (this.attackTimer >= this.monsterConfig.attackCooldown) {
        this.attackTimer = 0;
        this.playTentacleLashAnimation(onAttack);
      }
    }

    this.updateHpBar();
  }

  private playTentacleLashAnimation(onAttack: (atk: number, debuffs?: MonsterDebuffEffect[]) => void): void {
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 1.45,
      scaleY: 0.75,
      duration: 100,
      yoyo: true,
      ease: 'Back.easeOut',
      onComplete: () => {
        if (!this.isDead) {
          // Brutal lash strike (1.35x ATK)
          onAttack(Math.round(this.monsterConfig.atk * 1.35), this.debuffs);
          this.scene.cameras.main.shake(110, 0.007);
          this.checkVampiricHeal();
        }
      }
    });
  }

  // =========================================================================
  // BEHAVIOR 4: STANDARD MELEE + TELEGRAPH HEAVY SLAM (Golem & Elites)
  // =========================================================================
  private updateStandardMeleeBehavior(
    dt: number,
    dist: number,
    targetX: number,
    targetY: number,
    onAttack: (atk: number, debuffs?: MonsterDebuffEffect[]) => void,
    onAoEAttack?: (x: number, y: number, radius: number, dmg: number) => void
  ): void {
    this.attackTimer += dt;
    this.sprite.flipX = targetX < this.x;

    // Telegraph Heavy Attack for Golem and Elites
    const isHeavyAttacker = this.monsterConfig.type === 'golem' || this.affixes.length > 0;
    if (isHeavyAttacker && !this.isExecutingHeavyAttack) {
      this.heavyAttackTimer += dt;
      if (this.heavyAttackTimer >= this.heavyAttackCooldown && dist <= 125) {
        this.heavyAttackTimer = 0;
        this.executeTelegraphHeavyAttack(targetX, targetY, onAttack, onAoEAttack);
        this.updateHpBar();
        return;
      }
    }

    // Root in place during heavy attack charging
    if (this.isExecutingHeavyAttack) {
      this.updateHpBar();
      return;
    }

    if (dist > this.monsterConfig.range) {
      const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
      this.x += Math.cos(angle) * this.monsterConfig.speed * dt;
      this.y += Math.sin(angle) * this.monsterConfig.speed * dt;
    } else {
      if (this.attackTimer >= this.monsterConfig.attackCooldown) {
        this.attackTimer = 0;
        this.playAttackAnimation();
        onAttack(this.monsterConfig.atk, this.debuffs);
        this.checkVampiricHeal();
      }
    }

    this.updateHpBar();
  }

  // Telegraph Heavy Attack (0.8s charge with glowing red circle before smashing)
  private executeTelegraphHeavyAttack(
    targetX: number,
    targetY: number,
    onAttack: (atk: number, debuffs?: MonsterDebuffEffect[]) => void,
    onAoEAttack?: (x: number, y: number, radius: number, dmg: number) => void
  ): void {
    this.isExecutingHeavyAttack = true;
    const aoeRadius = 90;
    const strikeX = targetX;
    const strikeY = targetY;

    // 1. Red warning circle on ground sạc 0.8s
    const warning = this.scene.add.circle(strikeX, strikeY, aoeRadius, 0xdc2626, 0.28);
    warning.setStrokeStyle(3, 0xff4444, 0.95);
    warning.setDepth(16);
    this.heavyAttackTelegraph = warning;

    // Pulse telegraph ring
    this.scene.tweens.add({
      targets: warning,
      alpha: 0.65,
      scale: 1.08,
      yoyo: true,
      duration: 200,
      repeat: 3 // ~800ms
    });

    // Monster charging windup (raising arms / glowing red)
    this.scene.tweens.add({
      targets: this.sprite,
      scaleY: 1.35,
      scaleX: 0.8,
      duration: 280,
      yoyo: true,
      repeat: 1,
      ease: 'Quad.easeInOut'
    });

    // Warning floating text
    const chargeText = this.scene.add.text(this.x, this.y - 32, '⚠️ ĐẬP NẶNG (0.8s)!', {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#f87171',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    chargeText.setDepth(110);
    this.scene.tweens.add({
      targets: chargeText,
      y: chargeText.y - 20,
      alpha: 0,
      duration: 800,
      onComplete: () => chargeText.destroy()
    });

    // 2. Smash down after exactly 0.8s (800ms)
    this.scene.time.delayedCall(800, () => {
      if (warning.active) {
        warning.destroy();
      }

      if (this.isDead) {
        this.isExecutingHeavyAttack = false;
        return;
      }

      // Slam impact animation
      this.scene.tweens.add({
        targets: this.sprite,
        scaleY: 0.7,
        scaleX: 1.4,
        duration: 120,
        yoyo: true,
        ease: 'Back.easeOut',
        onComplete: () => {
          this.sprite.setScale(1.0);
          this.isExecutingHeavyAttack = false;
        }
      });

      // Sound & Screen Shake
      const audio = AudioSystem.getInstance();
      audio.playHeavySlam();
      this.scene.cameras.main.shake(190, 0.015);

      // Expanding ground shockwave circle
      const shockwave = this.scene.add.circle(strikeX, strikeY, aoeRadius * 0.4, 0xef4444, 0.55);
      shockwave.setStrokeStyle(3, 0xfca5a5, 0.95);
      shockwave.setDepth(18);
      this.scene.tweens.add({
        targets: shockwave,
        scale: 2.3,
        alpha: 0,
        duration: 360,
        ease: 'Quad.easeOut',
        onComplete: () => shockwave.destroy()
      });

      // Heavy Damage + Armor Shred Debuff (-45% DEF for 4s)
      const heavyDamage = Math.round(this.monsterConfig.atk * 2.2);
      const heavyDebuffs: MonsterDebuffEffect[] = [
        { type: 'armor_shred', duration: 4.0, value: 0.45 }
      ];

      if (onAoEAttack) {
        onAoEAttack(strikeX, strikeY, aoeRadius, heavyDamage);
      }

      onAttack(heavyDamage, heavyDebuffs);
    });
  }

  // =========================================================================
  // BEHAVIOR 5: MULTI-PHASE BOSS MECHANICS (100% -> 50% -> 25% HP)
  // =========================================================================
  private updateBossBehavior(
    dt: number,
    dist: number,
    targetX: number,
    targetY: number,
    onAttack: (atk: number, debuffs?: MonsterDebuffEffect[]) => void,
    onAoEAttack?: (x: number, y: number, radius: number, dmg: number) => void,
    onSummon?: (type: MonsterType, x: number, y: number) => void
  ): void {
    const bType = this.monsterConfig.type;
    this.attackTimer += dt;
    this.bossAbilityTimer += dt;
    this.sprite.flipX = targetX < this.x;

    // Movement & Normal Attack
    const cd = this.isEnraged
      ? this.monsterConfig.attackCooldown * 0.5
      : (this.bossPhase >= 2 ? this.monsterConfig.attackCooldown * 0.75 : this.monsterConfig.attackCooldown);

    if (dist > this.monsterConfig.range) {
      const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
      this.x += Math.cos(angle) * this.monsterConfig.speed * dt;
      this.y += Math.sin(angle) * this.monsterConfig.speed * dt;
    } else {
      if (this.attackTimer >= cd) {
        this.attackTimer = 0;
        this.playAttackAnimation();
        onAttack(this.monsterConfig.atk, this.debuffs);
        this.checkVampiricHeal();
      }
    }

    // -----------------------------------------------------------------------
    // BOSS 1: BOSS LICH (Floor 1)
    // -----------------------------------------------------------------------
    if (bType === 'boss_lich') {
      // Phase 2 check (<= 50% HP)
      if (this.bossPhase === 1 && this.hp <= this.maxHp * 0.5) {
        this.bossPhase = 2;
        this.triggerBossAnnouncement('⚠️ GIAI ĐOẠN 2: LINH HỒN TRIỆU HỒI! ⚠️', '#22d3ee');
        this.monsterConfig.speed = Math.round(this.baseSpeed * 1.25);
        this.addShield(Math.round(this.maxHp * 0.25));

        // Summon 2 skeleton archers immediately on phase 2 entry
        if (onSummon) {
          onSummon('skeleton_archer', this.x - 50, this.y + 35);
          onSummon('skeleton_archer', this.x + 50, this.y - 35);
        }
      }

      // Phase 3 check (<= 25% HP) - Enraged Last Stand
      if (this.bossPhase === 2 && this.hp <= this.maxHp * 0.25) {
        this.bossPhase = 3;
        this.isEnraged = true;
        this.triggerBossAnnouncement('💀 GIAI ĐOẠN CUỐI: TỬ THI BẠO LOẠN! 💀', '#ff0055');
        this.monsterConfig.speed = Math.round(this.baseSpeed * 1.55);
        this.addShield(Math.round(this.maxHp * 0.30));

        // Summon 2 ghouls + 1 skeleton archer
        if (onSummon) {
          onSummon('ghoul', this.x - 55, this.y + 40);
          onSummon('ghoul', this.x + 55, this.y + 40);
          onSummon('skeleton_archer', this.x, this.y - 50);
        }
      }

      // Ability 1: Periodic Summons every 12s
      if (this.bossAbilityTimer >= 12 && onSummon) {
        this.bossAbilityTimer = 0;
        this.bossSummonCount++;
        const sType: MonsterType = this.bossSummonCount % 2 === 0 ? 'skeleton_archer' : 'skeleton';
        onSummon(sType, this.x + (Math.random() * 60 - 30), this.y + 35);
        this.triggerBossAnnouncement('💀 TRIỆU HỒI TỬ THI! 💀', '#94a3b8');
      }

      // Ability 2: Bone Wall Barrier (Periodic Shield Every 8.5s)
      if (this.bossAbilityTimer >= 8.5 && this.shield <= 0) {
        this.addShield(Math.round(this.maxHp * 0.22));
        this.triggerBossAnnouncement('🦴 TƯỜNG CỐT KHÍ! 🦴', '#e2e8f0');
        this.playShieldAuraEffect(0x22d3ee);
      }
    }

    // -----------------------------------------------------------------------
    // BOSS 2: BOSS IGNIS (Floor 2)
    // -----------------------------------------------------------------------
    else if (bType === 'boss_ignis') {
      // Phase 2 check (<= 50% HP)
      if (this.bossPhase === 1 && this.hp <= this.maxHp * 0.5) {
        this.bossPhase = 2;
        this.triggerBossAnnouncement('⚠️ GIAI ĐOẠN 2: DUNG NHAM PHUN TRÀO! ⚠️', '#f97316');
        this.monsterConfig.speed = Math.round(this.baseSpeed * 1.3);
        this.addShield(Math.round(this.maxHp * 0.25));

        // Summon 2 hellhounds on phase 2 entry
        if (onSummon) {
          onSummon('hellhound', this.x - 50, this.y + 35);
          onSummon('hellhound', this.x + 50, this.y - 35);
        }
      }

      // Phase 3 check (<= 25% HP) - Enraged Last Stand
      if (this.bossPhase === 2 && this.hp <= this.maxHp * 0.25) {
        this.bossPhase = 3;
        this.isEnraged = true;
        this.triggerBossAnnouncement('💀 GIAI ĐOẠN CUỐI: HỎA BẠO ĐỊA NGỤC! 💀', '#ff1100');
        this.monsterConfig.speed = Math.round(this.baseSpeed * 1.6);
        this.addShield(Math.round(this.maxHp * 0.35));

        // Summon 1 golem + 2 imps
        if (onSummon) {
          onSummon('golem', this.x, this.y + 45);
          onSummon('imp', this.x - 60, this.y - 35);
          onSummon('imp', this.x + 60, this.y - 35);
        }
      }

      // Ability 1: Molten Flame Shield (Every 10s)
      if (this.bossAbilityTimer >= 10 && this.shield <= 0) {
        this.addShield(Math.round(this.maxHp * 0.25));
        this.triggerBossAnnouncement('🔥 KHIÊN DUNG NHAM! 🔥', '#ea580c');
        this.playShieldAuraEffect(0xf97316);
      }

      // Ability 2: Magma Eruption Wave (AoE Blast every 6.5s)
      const aoeCd = this.bossPhase === 3 ? 3.8 : (this.bossPhase === 2 ? 4.8 : 6.8);
      if (this.bossAbilityTimer >= aoeCd && onAoEAttack) {
        this.bossAbilityTimer = 0;
        this.executeMagmaEruption(targetX, targetY, onAoEAttack);
      }
    }

    // -----------------------------------------------------------------------
    // BOSS 3: BOSS SOVEREIGN (Floor 3 & 'boss')
    // -----------------------------------------------------------------------
    else {
      // Phase 2 check (<= 50% HP)
      if (this.bossPhase === 1 && this.hp <= this.maxHp * 0.5) {
        this.bossPhase = 2;
        this.triggerBossAnnouncement('⚠️ GIAI ĐOẠN 2: HƯ VÔ TRỖI DẬY! ⚠️', '#c084fc');
        this.sprite.setScale(1.15);
        this.sprite.setTint(0xbb77ff);
        this.monsterConfig.speed = Math.round(this.baseSpeed * 1.35);
        this.addShield(Math.round(this.maxHp * 0.25));

        // Summon 2 void eyes
        if (onSummon) {
          onSummon('void_eye', this.x - 55, this.y + 35);
          onSummon('void_eye', this.x + 55, this.y - 35);
        }
      }

      // Phase 3 check (<= 25% HP) - Enraged Last Stand
      if (this.bossPhase === 2 && this.hp <= this.maxHp * 0.25) {
        this.bossPhase = 3;
        this.isEnraged = true;
        this.triggerBossAnnouncement('💀 GIAI ĐOẠN CUỐI: HƯ VÔ TẬN DIỆT - TỐC ĐỘ GẤP ĐÔI! 💀', '#ff0055');
        this.sprite.setTint(0xff1144);
        this.monsterConfig.speed = Math.round(this.baseSpeed * 2.0); // DOUBLE SPEED
        this.addShield(Math.round(this.maxHp * 0.40));

        // Summon 1 stalker + 1 necromancer
        if (onSummon) {
          onSummon('stalker', this.x - 50, this.y + 40);
          onSummon('necromancer', this.x + 50, this.y - 40);
        }
      }

      // Void Singularity (AoE Black Hole Blast every 6.5s)
      const singularityCd = this.bossPhase === 3 ? 3.8 : (this.bossPhase === 2 ? 4.8 : 6.8);
      if (this.bossAbilityTimer >= singularityCd && onAoEAttack) {
        this.bossAbilityTimer = 0;
        this.executeVoidSingularity(targetX, targetY, onAoEAttack);
      }
    }

    this.updateHpBar();
  }

  private executeMagmaEruption(
    targetX: number,
    targetY: number,
    onAoEAttack: (x: number, y: number, radius: number, dmg: number) => void
  ): void {
    const aoeRadius = 115;
    const aoeX = targetX;
    const aoeY = targetY;

    // Glowing Lava Warning Ring
    const warning = this.scene.add.circle(aoeX, aoeY, aoeRadius, 0xea580c, 0.28);
    warning.setStrokeStyle(2.5, 0xfacc15, 0.9);
    warning.setDepth(15);

    this.scene.tweens.add({
      targets: warning,
      alpha: 0.6,
      scale: 1.06,
      yoyo: true,
      repeat: 2,
      duration: 280,
      onComplete: () => {
        warning.destroy();
        this.scene.cameras.main.shake(220, 0.016);
        onAoEAttack(aoeX, aoeY, aoeRadius, Math.round(this.monsterConfig.atk * 1.5));
      }
    });
  }

  private executeVoidSingularity(
    targetX: number,
    targetY: number,
    onAoEAttack: (x: number, y: number, radius: number, dmg: number) => void
  ): void {
    const aoeRadius = 125;
    const aoeX = targetX;
    const aoeY = targetY;

    // Swirling Void Ring
    const warning = this.scene.add.circle(aoeX, aoeY, aoeRadius, 0x581c87, 0.32);
    warning.setStrokeStyle(2.5, 0x38bdf8, 0.95);
    warning.setDepth(15);

    this.scene.tweens.add({
      targets: warning,
      alpha: 0.7,
      scale: 0.92,
      yoyo: true,
      repeat: 2,
      duration: 300,
      onComplete: () => {
        warning.destroy();
        this.scene.cameras.main.shake(250, 0.018);
        onAoEAttack(aoeX, aoeY, aoeRadius, Math.round(this.monsterConfig.atk * 1.7));
      }
    });
  }

  private playShieldAuraEffect(color: number): void {
    const ring = this.scene.add.circle(0, 0, this.sprite.width * 0.7, color, 0.25);
    ring.setStrokeStyle(2, color, 0.8);
    this.add(ring);

    this.scene.tweens.add({
      targets: ring,
      scale: 1.25,
      alpha: 0,
      duration: 600,
      onComplete: () => ring.destroy()
    });
  }

  private triggerBossAnnouncement(textStr: string, colorHex: string): void {
    const text = this.scene.add.text(this.x, this.y - 50, textStr, {
      fontFamily: 'sans-serif',
      fontSize: '17px',
      color: colorHex,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    text.setDepth(100);

    this.scene.cameras.main.shake(220, 0.012);

    this.scene.tweens.add({
      targets: text,
      y: text.y - 35,
      alpha: 0,
      duration: 1300,
      onComplete: () => text.destroy()
    });
  }

  private checkVampiricHeal(): void {
    if (this.affixes.some((a) => a.type === 'vampiric')) {
      this.hp = Math.min(this.maxHp, this.hp + this.monsterConfig.atk * 0.4);
      this.updateHpBar();
    }
  }

  public addShield(amount: number): void {
    this.shield += amount;
    this.updateHpBar();
  }

  private playAttackAnimation(): void {
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 1.25,
      scaleY: 0.85,
      yoyo: true,
      duration: 90,
      ease: 'Back.easeOut'
    });
  }

  private playRangedAttackAnimation(): void {
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 0.85,
      scaleY: 1.2,
      yoyo: true,
      duration: 90,
      ease: 'Back.easeOut'
    });
  }

  // Cuồng Nộ (Enrage/Berserk) when dropping below 30% HP
  private triggerBerserk(): void {
    this.isBerserk = true;
    this.monsterConfig.speed = Math.round(this.baseSpeed * 1.30);
    this.monsterConfig.attackCooldown = Math.max(0.35, this.baseAttackCooldown / 1.25);

    // Floating text: 💢 CUỒNG NỘ!
    const berserkText = this.scene.add.text(this.x, this.y - 25, '💢 CUỒNG NỘ!', {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#ff2244',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    berserkText.setDepth(110);

    this.scene.tweens.add({
      targets: berserkText,
      y: berserkText.y - 30,
      alpha: 0,
      duration: 900,
      onComplete: () => berserkText.destroy()
    });

    // Flashing red tint
    this.sprite.setTint(0xff2222);
  }

  public takeDamage(
    rawDamage: number,
    isCrit: boolean = false,
    type: 'phys' | 'fire' | 'frost' | 'thorns' = 'phys'
  ): { finalDamage: number; isDead: boolean } {
    if (this.isDead) return { finalDamage: 0, isDead: true };

    const mitigation = 1 - (this.monsterConfig.def / 100);
    let finalDamage = Math.max(1, rawDamage * mitigation);

    if (this.freezeDuration > 0 && isCrit) {
      finalDamage *= 1.8;
    }

    // Shield absorption
    if (this.shield > 0) {
      if (this.shield >= finalDamage) {
        this.shield -= finalDamage;
        this.updateHpBar();
        return { finalDamage: 0, isDead: false };
      } else {
        finalDamage -= this.shield;
        this.shield = 0;
      }
    }

    this.hp -= finalDamage;

    // Cuồng Nộ (Enrage/Berserk) check: When HP falls below 30%
    if (!this.isBoss && !this.isBerserk && this.hp > 0 && this.hp <= this.maxHp * 0.30) {
      this.triggerBerserk();
    }

    // Flash white on hit
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0.4,
      yoyo: true,
      duration: 50
    });

    if (this.hp <= 0) {
      this.hp = 0;
      this.isDead = true;
      this.die();
    }

    this.updateHpBar();
    return { finalDamage, isDead: this.isDead };
  }

  public applyBurn(seconds: number): void {
    this.burnDuration = Math.max(this.burnDuration, seconds);
  }

  public applyFreeze(seconds: number): void {
    this.freezeDuration = Math.max(this.freezeDuration, seconds);
  }

  private updateHpBar(): void {
    const ratio = Math.max(0, this.hp / this.maxHp);
    const barWidth = this.isBoss ? 80 : 36;
    this.hpBarFill.width = barWidth * ratio;

    if (this.shieldBar) {
      if (this.shield > 0) {
        const shieldRatio = Math.min(1, this.shield / (this.maxHp * 0.4));
        this.shieldBar.width = barWidth * shieldRatio;
        this.shieldBar.setVisible(true);
      } else {
        this.shieldBar.setVisible(false);
      }
    }
  }

  private die(): void {
    if (this.heavyAttackTelegraph && this.heavyAttackTelegraph.active) {
      this.heavyAttackTelegraph.destroy();
    }

    this.scene.tweens.add({
      targets: this,
      scaleY: 0,
      scaleX: 1.3,
      alpha: 0,
      duration: 250,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        this.destroy();
      }
    });
  }
}
