import Phaser from 'phaser';
import { EliteAffix } from '../types/game';

export type MonsterType = 'skeleton' | 'slime' | 'imp' | 'necromancer' | 'golem' | 'boss';

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

  private attackTimer: number = 0;
  private burnDuration: number = 0;
  private burnTickTimer: number = 0;
  private freezeDuration: number = 0;

  // Boss mechanics
  public isEnraged: boolean = false;
  private bossTelegraphTimer: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, config: MonsterConfig) {
    super(scene, x, y);
    this.monsterConfig = config;
    this.isBoss = !!config.isBoss;
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

    // 3. Sprite
    const textureKey = `monster_${config.type}`;
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

    if (this.shield > 0) {
      this.shieldBar = scene.add.rectangle(-barWidth / 2, barY - 3, barWidth, 3, 0x33aaff);
      this.shieldBar.setOrigin(0, 0.5);
      this.add(this.shieldBar);
    }

    scene.add.existing(this);
    this.setDepth(20);
  }

  public updateMonster(
    time: number,
    delta: number,
    targetX: number,
    targetY: number,
    onAttack: (atk: number) => void,
    onAoEAttack?: (x: number, y: number, radius: number, dmg: number) => void
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
    } else if (!this.isEnraged) {
      this.sprite.clearTint();
    }

    // Boss Enrage Phase Check (< 50% HP)
    if (this.isBoss && !this.isEnraged && this.hp <= this.maxHp * 0.5) {
      this.triggerBossEnrage();
    }

    // Boss Telegraph Area Attack
    if (this.isBoss && this.isEnraged) {
      this.bossTelegraphTimer += dt;
      if (this.bossTelegraphTimer >= 5.5 && onAoEAttack) {
        this.bossTelegraphTimer = 0;
        this.executeBossTelegraphAttack(targetX, targetY, onAoEAttack);
      }
    }

    this.attackTimer += dt;

    const dist = Phaser.Math.Distance.Between(this.x, this.y, targetX, targetY);
    let speed = this.monsterConfig.speed;
    if (this.isEnraged) speed *= 1.3;

    if (dist > this.monsterConfig.range) {
      // Move towards target
      const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
      this.x += Math.cos(angle) * speed * dt;
      this.y += Math.sin(angle) * speed * dt;
      this.sprite.flipX = targetX < this.x;
    } else {
      // Attack
      const cd = this.isEnraged ? this.monsterConfig.attackCooldown * 0.65 : this.monsterConfig.attackCooldown;
      if (this.attackTimer >= cd) {
        this.attackTimer = 0;
        this.playAttackAnimation();
        onAttack(this.monsterConfig.atk);

        // Vampiric affix: heals when attacking
        if (this.affixes.some((a) => a.type === 'vampiric')) {
          this.hp = Math.min(this.maxHp, this.hp + this.monsterConfig.atk * 0.4);
          this.updateHpBar();
        }
      }
    }

    this.updateHpBar();
  }

  private triggerBossEnrage(): void {
    this.isEnraged = true;
    this.sprite.setTint(0xff1122);

    // Floating text
    const text = this.scene.add.text(this.x, this.y - 45, '⚠️ HÓA CUỒNG! ⚠️', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      color: '#ff2222',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    text.setDepth(100);

    this.scene.cameras.main.shake(250, 0.012);

    this.scene.tweens.add({
      targets: text,
      y: text.y - 30,
      alpha: 0,
      duration: 1200,
      onComplete: () => text.destroy()
    });
  }

  private executeBossTelegraphAttack(targetX: number, targetY: number, onAoEAttack: (x: number, y: number, radius: number, dmg: number) => void): void {
    const aoeRadius = 110;
    const aoeX = targetX;
    const aoeY = targetY;

    // 1. Red Telegraph Zone warning
    const warningCircle = this.scene.add.circle(aoeX, aoeY, aoeRadius, 0xff0000, 0.25);
    warningCircle.setStrokeStyle(2, 0xff2222, 0.8);
    warningCircle.setDepth(15);

    this.scene.tweens.add({
      targets: warningCircle,
      alpha: 0.5,
      scale: 1.05,
      yoyo: true,
      repeat: 2,
      duration: 350,
      onComplete: () => {
        warningCircle.destroy();
        // 2. Blast impact!
        this.scene.cameras.main.shake(200, 0.015);
        onAoEAttack(aoeX, aoeY, aoeRadius, this.monsterConfig.atk * 1.5);
      }
    });
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

  public takeDamage(rawDamage: number, isCrit: boolean = false, type: 'phys' | 'fire' | 'frost' | 'thorns' = 'phys'): { finalDamage: number; isDead: boolean } {
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
        this.shieldBar.width = barWidth * (this.shield / (this.maxHp * 0.4));
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
