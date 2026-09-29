import Phaser from 'phaser';
import { Monster } from './Monster';

export class Minion extends Phaser.GameObjects.Container {
  public hp: number = 60;
  public maxHp: number = 60;
  public atk: number = 12;
  public isDead: boolean = false;
  private sprite: Phaser.GameObjects.Sprite;
  private attackTimer: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, atkBonus: number = 0) {
    super(scene, x, y);
    this.atk += atkBonus;

    this.sprite = scene.add.sprite(0, 0, 'minion_skeleton');
    this.add(this.sprite);

    scene.add.existing(this);
    this.setDepth(19);

    // Spawn puff animation
    this.setScale(0);
    scene.tweens.add({
      targets: this,
      scale: 1,
      duration: 200,
      ease: 'Back.easeOut'
    });
  }

  public updateMinion(delta: number, monsters: Monster[], onAttackTarget: (m: Monster, dmg: number) => void): void {
    if (this.isDead) return;

    this.attackTimer += delta / 1000;

    // Find nearest living monster
    let nearest: Monster | null = null;
    let minDist = 99999;

    for (const m of monsters) {
      if (m.isDead) continue;
      const d = Phaser.Math.Distance.Between(this.x, this.y, m.x, m.y);
      if (d < minDist) {
        minDist = d;
        nearest = m;
      }
    }

    if (!nearest) return;

    const range = 35;
    if (minDist > range) {
      const angle = Phaser.Math.Angle.Between(this.x, this.y, nearest.x, nearest.y);
      this.x += Math.cos(angle) * 90 * (delta / 1000);
      this.y += Math.sin(angle) * 90 * (delta / 1000);
      this.sprite.flipX = nearest.x < this.x;
    } else {
      if (this.attackTimer >= 1.0) {
        this.attackTimer = 0;
        this.scene.tweens.add({
          targets: this.sprite,
          scaleX: 1.2,
          yoyo: true,
          duration: 100
        });
        onAttackTarget(nearest, this.atk);
      }
    }
  }

  public takeDamage(dmg: number): void {
    if (this.isDead) return;
    this.hp -= dmg;
    if (this.hp <= 0) {
      this.isDead = true;
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        scale: 0.2,
        duration: 200,
        onComplete: () => this.destroy()
      });
    }
  }
}
