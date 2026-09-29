import Phaser from 'phaser';
import { EliteAffix } from '../types/game';

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
}

export const ELITE_AFFIXES: EliteAffix[] = [
  {
    type: 'volatile',
    name: 'Bộc Phá',
    prefix: '[Phát Nổ]',
    color: '#ff4444',
    bonusHpMultiplier: 1.2,
    bonusAtkMultiplier: 1.1,
    bonusSpeedMultiplier: 1.0,
    description: 'Nổ tung khi chết, gây sát thương diện rộng.'
  },
  {
    type: 'shielded',
    name: 'Khiên Cương Thiết',
    prefix: '[Khiên Bọc]',
    color: '#33aaff',
    bonusHpMultiplier: 1.3,
    bonusAtkMultiplier: 1.0,
    bonusSpeedMultiplier: 0.9,
    description: 'Nhận 40% máu tối đa làm lớp giáp hấp thụ sát thương.'
  },
  {
    type: 'swift',
    name: 'Cuồng Phong',
    prefix: '[Siêu Tốc]',
    color: '#34d399',
    bonusHpMultiplier: 1.0,
    bonusAtkMultiplier: 1.15,
    bonusSpeedMultiplier: 1.5,
    description: 'Tốc độ di chuyển và tấn công tăng vượt trội.'
  },
  {
    type: 'vampiric',
    name: 'Hút Máu',
    prefix: '[Hút Huyết]',
    color: '#f43f5e',
    bonusHpMultiplier: 1.15,
    bonusAtkMultiplier: 1.2,
    bonusSpeedMultiplier: 1.05,
    description: 'Hồi phục HP khi đánh trúng mục tiêu.'
  },
  {
    type: 'chilling',
    name: 'Hàn Băng',
    prefix: '[Băng Giá]',
    color: '#38bdf8',
    bonusHpMultiplier: 1.25,
    bonusAtkMultiplier: 1.1,
    bonusSpeedMultiplier: 0.95,
    description: 'Tỏa ra luồng khí lạnh làm chậm đối thủ.'
  }
];

export class Monster extends Phaser.GameObjects.Container {
  public monsterConfig: MonsterConfig;
  public hp: number;
  public maxHp: number;
  public isDead: boolean = false;
  public isBoss: boolean = false;
  public affixes: EliteAffix[] = [];

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

  // Boss Multi-Phase Mechanics
  public bossPhase: number = 1;
  public isEnraged: boolean = false;
  private bossAbilityTimer: number = 0;
  private bossSummonCount: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, config: MonsterConfig) {
    super(scene, x, y);
    this.monsterConfig = config;
    this.isBoss = !!config.isBoss || config.type.startsWith('boss');
    this.affixes = config.affixes || [];

    // 1. Difficulty Scaling based on floor depth
    const floor = Math.max(1, config.floor || 1);
    const hpScale = Math.pow(1 + 0.32 * (floor - 1), 1.15);
    const atkScale = 1 + 0.22 * (floor - 1);

    let finalMaxHp = Math.round(config.maxHp * hpScale);
    let finalAtk = Math.round(config.atk * atkScale);
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

    // 3. Resolve Texture Key
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

    // 4. Elite Affix badge
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

    // 5. HP Bar
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
    onAttack: (atk: number) => void,
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

    // Default Melee Behavior
    this.updateStandardMeleeBehavior(dt, dist, targetX, targetY, onAttack);
  }

  // =========================================================================
  // BEHAVIOR 1: RANGED ATTACKERS (skeleton_archer, void_eye)
  // =========================================================================
  private updateRangedBehavior(
    dt: number,
    dist: number,
    targetX: number,
    targetY: number,
    onAttack: (atk: number) => void
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
        onAttack(this.monsterConfig.atk);
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
    onAttack: (atk: number) => void
  ): void {
    if (this.isLeaping) return;

    this.leapTimer += dt;
    this.attackTimer += dt;
    this.sprite.flipX = targetX < this.x;

    // Pounce Trigger: Every 3.5s when within 80-220px
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
        onAttack(this.monsterConfig.atk);
        this.checkVampiricHeal();
      }
    }

    this.updateHpBar();
  }

  private executePounceLeap(targetX: number, targetY: number, onAttack: (atk: number) => void): void {
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
            // Bonus pounce strike (+30% damage)
            onAttack(Math.round(this.monsterConfig.atk * 1.3));
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
    onAttack: (atk: number) => void
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

  private playTentacleLashAnimation(onAttack: (atk: number) => void): void {
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
          onAttack(Math.round(this.monsterConfig.atk * 1.35));
          this.scene.cameras.main.shake(110, 0.007);
          this.checkVampiricHeal();
        }
      }
    });
  }

  // =========================================================================
  // BEHAVIOR 4: STANDARD MELEE (skeleton, slime, imp, cultist, golem, etc.)
  // =========================================================================
  private updateStandardMeleeBehavior(
    dt: number,
    dist: number,
    targetX: number,
    targetY: number,
    onAttack: (atk: number) => void
  ): void {
    this.attackTimer += dt;
    this.sprite.flipX = targetX < this.x;

    if (dist > this.monsterConfig.range) {
      const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
      this.x += Math.cos(angle) * this.monsterConfig.speed * dt;
      this.y += Math.sin(angle) * this.monsterConfig.speed * dt;
    } else {
      if (this.attackTimer >= this.monsterConfig.attackCooldown) {
        this.attackTimer = 0;
        this.playAttackAnimation();
        onAttack(this.monsterConfig.atk);
        this.checkVampiricHeal();
      }
    }

    this.updateHpBar();
  }

  // =========================================================================
  // BEHAVIOR 5: MULTI-PHASE BOSS MECHANICS
  // =========================================================================
  private updateBossBehavior(
    dt: number,
    dist: number,
    targetX: number,
    targetY: number,
    onAttack: (atk: number) => void,
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
        onAttack(this.monsterConfig.atk);
        this.checkVampiricHeal();
      }
    }

    // -----------------------------------------------------------------------
    // BOSS 1: BOSS LICH (Floor 1)
    // -----------------------------------------------------------------------
    if (bType === 'boss_lich') {
      // Phase 2 check (< 50% HP)
      if (this.bossPhase === 1 && this.hp <= this.maxHp * 0.5) {
        this.bossPhase = 2;
        this.triggerBossAnnouncement('⚠️ LINH HỒN PHẪN NỘ! ⚠️', '#22d3ee');
        this.monsterConfig.speed = Math.round(this.baseSpeed * 1.25);
        // Summon 2 skeleton archers on phase 2 entry
        if (onSummon) {
          onSummon('skeleton_archer', this.x - 45, this.y + 30);
          onSummon('skeleton_archer', this.x + 45, this.y - 30);
        }
      }

      // Ability 1: Summons Skeletons (Initial or Periodic every 13s)
      if (this.bossAbilityTimer >= 13 && onSummon) {
        this.bossAbilityTimer = 0;
        this.bossSummonCount++;
        const sType: MonsterType = this.bossSummonCount % 2 === 0 ? 'skeleton_archer' : 'skeleton';
        onSummon(sType, this.x + (Math.random() * 60 - 30), this.y + 35);
        this.triggerBossAnnouncement('💀 TRIỆU HỒI TỬ THI! 💀', '#94a3b8');
      }

      // Ability 2: Bone Wall Barrier (Periodic Shield Every 9s)
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
      // Phase 2 check (< 50% HP)
      if (this.bossPhase === 1 && this.hp <= this.maxHp * 0.5) {
        this.bossPhase = 2;
        this.triggerBossAnnouncement('🌋 DUNG NHAM PHUN TRÀO! 🌋', '#f97316');
        this.monsterConfig.speed = Math.round(this.baseSpeed * 1.3);
      }

      // Ability 1: Molten Flame Shield (Every 10s)
      if (this.bossAbilityTimer >= 10 && this.shield <= 0) {
        this.addShield(Math.round(this.maxHp * 0.25));
        this.triggerBossAnnouncement('🔥 KHIÊN DUNG NHAM! 🔥', '#ea580c');
        this.playShieldAuraEffect(0xf97316);
      }

      // Ability 2: Magma Eruption Wave (AoE Blast every 6.5s)
      const aoeCd = this.bossPhase === 2 ? 4.8 : 6.8;
      if (this.bossAbilityTimer >= aoeCd && onAoEAttack) {
        this.bossAbilityTimer = 0;
        this.executeMagmaEruption(targetX, targetY, onAoEAttack);
      }
    }

    // -----------------------------------------------------------------------
    // BOSS 3: BOSS SOVEREIGN (Floor 3 & 'boss')
    // -----------------------------------------------------------------------
    else {
      // Phase 2: Wings Awaken (< 66% HP)
      if (this.bossPhase === 1 && this.hp <= this.maxHp * 0.66) {
        this.bossPhase = 2;
        this.triggerBossAnnouncement('✨ CÁNH HƯ VÔ THỨC TỈNH! ✨', '#c084fc');
        this.sprite.setScale(1.15);
        this.sprite.setTint(0xbb77ff);
        this.monsterConfig.speed = Math.round(this.baseSpeed * 1.35);
      }

      // Phase 3: Enrage Double Speed (< 33% HP)
      if (this.bossPhase === 2 && this.hp <= this.maxHp * 0.33) {
        this.bossPhase = 3;
        this.isEnraged = true;
        this.triggerBossAnnouncement('💀 BẠO NỘ HƯ VÔ - TỐC ĐỘ GẤP ĐÔI! 💀', '#ff0055');
        this.sprite.setTint(0xff1144);
        this.monsterConfig.speed = Math.round(this.baseSpeed * 2.0); // DOUBLE SPEED
      }

      // Void Singularity (AoE Black Hole Blast every 6.5s)
      const singularityCd = this.bossPhase === 3 ? 4.2 : 6.8;
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
