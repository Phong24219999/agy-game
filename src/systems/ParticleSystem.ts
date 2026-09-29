import Phaser from 'phaser';

export class ParticleSystem {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  // Hit sparks when weapon strikes an enemy
  public createHitSparks(x: number, y: number, color: number = 0xffe066): void {
    const sparkCount = 8;
    for (let i = 0; i < sparkCount; i++) {
      const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5);
      const speed = 60 + Math.random() * 80;
      const spark = this.scene.add.circle(x, y, 2.5, color);
      spark.setDepth(90);

      this.scene.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed,
        alpha: 0,
        scale: 0.2,
        duration: 250 + Math.random() * 150,
        ease: 'Cubic.easeOut',
        onComplete: () => spark.destroy()
      });
    }
  }

  // Blood / Dark void splat on enemy hit
  public createBloodSplat(x: number, y: number, color: number = 0x991133): void {
    const dropCount = 6;
    for (let i = 0; i < dropCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 15 + Math.random() * 25;
      const drop = this.scene.add.circle(x, y, 2, color);
      drop.setDepth(85);

      this.scene.tweens.add({
        targets: drop,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        duration: 350 + Math.random() * 200,
        onComplete: () => drop.destroy()
      });
    }
  }

  // Fire blast / explosion
  public createFireExplosion(x: number, y: number, radius: number = 60): void {
    // Expanding fiery shockwave
    const ring = this.scene.add.circle(x, y, 10, 0xff5500, 0.7);
    ring.setStrokeStyle(3, 0xffcc00);
    ring.setDepth(90);

    this.scene.tweens.add({
      targets: ring,
      radius: radius,
      alpha: 0,
      duration: 350,
      ease: 'Quad.easeOut',
      onComplete: () => ring.destroy()
    });

    // Embers
    for (let i = 0; i < 16; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * radius;
      const ember = this.scene.add.circle(x, y, 3, Math.random() > 0.5 ? 0xff4400 : 0xffbb00);
      ember.setDepth(91);

      this.scene.tweens.add({
        targets: ember,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        scale: 0.1,
        duration: 400 + Math.random() * 200,
        onComplete: () => ember.destroy()
      });
    }
  }

  // Lightning bolt visual linking two points
  public createLightningBolt(x1: number, y1: number, x2: number, y2: number): void {
    const graphics = this.scene.add.graphics();
    graphics.setDepth(95);

    const segments = 5;
    const points: Phaser.Math.Vector2[] = [new Phaser.Math.Vector2(x1, y1)];

    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      const px = Phaser.Math.Linear(x1, x2, t) + (Math.random() * 20 - 10);
      const py = Phaser.Math.Linear(y1, y2, t) + (Math.random() * 20 - 10);
      points.push(new Phaser.Math.Vector2(px, py));
    }
    points.push(new Phaser.Math.Vector2(x2, y2));

    // Outer glow
    graphics.lineStyle(4, 0x66ccff, 0.6);
    graphics.beginPath();
    graphics.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      graphics.lineTo(points[i].x, points[i].y);
    }
    graphics.strokePath();

    // Core white beam
    graphics.lineStyle(2, 0xffffff, 1);
    graphics.beginPath();
    graphics.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      graphics.lineTo(points[i].x, points[i].y);
    }
    graphics.strokePath();

    this.scene.tweens.add({
      targets: graphics,
      alpha: 0,
      duration: 180,
      onComplete: () => graphics.destroy()
    });
  }

  // Melee slash wave
  public createSlashWave(x: number, y: number, angleRad: number, radius: number = 40): void {
    const slash = this.scene.add.arc(x, y, radius, Phaser.Math.RadToDeg(angleRad) - 45, Phaser.Math.RadToDeg(angleRad) + 45, false);
    slash.setStrokeStyle(3, 0xffffff, 0.9);
    slash.setDepth(92);

    this.scene.tweens.add({
      targets: slash,
      scale: 1.4,
      alpha: 0,
      duration: 180,
      ease: 'Quad.easeOut',
      onComplete: () => slash.destroy()
    });
  }
}
