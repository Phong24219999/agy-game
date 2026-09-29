import Phaser from 'phaser';
import { Hero } from '../entities/Hero';
import { Monster } from '../entities/Monster';
import { AudioSystem } from './AudioSystem';
import { DamageTextManager } from './DamageTextManager';
import { ParticleSystem } from './ParticleSystem';

export class TacticalSystem {
  private scene: Phaser.Scene;
  private hero: Hero;
  private monsters: Monster[];
  private audio: AudioSystem;
  private damageText: DamageTextManager;
  private particles: ParticleSystem;

  // Tactical Dash Parameters
  public readonly DASH_DISTANCE: number = 130;
  public readonly DASH_COOLDOWN: number = 2.2; // seconds
  public readonly DASH_IFRAME_DURATION: number = 0.35; // seconds

  private dashCooldownTimer: number = 0;
  private isDashing: boolean = false;
  private spaceKey?: Phaser.Input.Keyboard.Key;

  // Focus Target State
  public focusTarget: Monster | null = null;

  // UI HUD Elements: Tactical Dash Button (Capsule Bar)
  private dashButtonContainer!: Phaser.GameObjects.Container;
  private dashButtonBg!: Phaser.GameObjects.Rectangle;
  private dashButtonFill!: Phaser.GameObjects.Rectangle;
  private dashButtonBorder!: Phaser.GameObjects.Rectangle;
  private dashButtonText!: Phaser.GameObjects.Text;
  private dashButtonGlow!: Phaser.GameObjects.Rectangle;

  // UI Visuals: Focus Target Reticle
  private reticleContainer!: Phaser.GameObjects.Container;
  private reticleOuter!: Phaser.GameObjects.Graphics;
  private reticleInner!: Phaser.GameObjects.Graphics;
  private reticleBadge!: Phaser.GameObjects.Text;

  // Pointer listener callback
  private pointerDownHandler: (pointer: Phaser.Input.Pointer) => void;

  constructor(scene: Phaser.Scene, hero: Hero, monsters: Monster[]) {
    this.scene = scene;
    this.hero = hero;
    this.monsters = monsters;
    this.audio = AudioSystem.getInstance();
    this.damageText = new DamageTextManager(scene);
    this.particles = new ParticleSystem(scene);

    // 1. Setup Keyboard Input (SPACE)
    if (scene.input && scene.input.keyboard) {
      this.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    // 2. Create HUD Dash Widget
    this.createDashHUD();

    // 3. Create Focus Target Reticle
    this.createFocusTargetReticle();

    // 4. Register Pointer Down Listener for Focus Target & Ground click
    this.pointerDownHandler = (pointer: Phaser.Input.Pointer) => {
      this.handlePointerDown(pointer);
    };
    scene.input.on('pointerdown', this.pointerDownHandler);
  }

  public setMonsters(monsters: Monster[]): void {
    this.monsters = monsters;
    if (this.focusTarget && (!this.monsters.includes(this.focusTarget) || this.focusTarget.isDead)) {
      this.clearFocusTarget();
    }
  }

  // =========================================================================
  // 1. TACTICAL DASH: HUD & VISUALS
  // =========================================================================
  private createDashHUD(): void {
    // Placed at bottom-center of the arena
    const x = 480;
    const y = 562;
    const barWidth = 190;
    const barHeight = 36;

    this.dashButtonContainer = this.scene.add.container(x, y);
    this.dashButtonContainer.setDepth(110);

    // Glowing outer pulse
    this.dashButtonGlow = this.scene.add.rectangle(0, 0, barWidth + 8, barHeight + 8, 0x06b6d4, 0.25);
    this.dashButtonGlow.setStrokeStyle(1.5, 0x38bdf8, 0.5);

    // Background
    this.dashButtonBg = this.scene.add.rectangle(0, 0, barWidth, barHeight, 0x090d16, 0.92);

    // Cooldown progress fill (fills from left to right)
    this.dashButtonFill = this.scene.add.rectangle(-barWidth / 2, 0, barWidth, barHeight, 0x0284c7, 0.7);
    this.dashButtonFill.setOrigin(0, 0.5);

    // Border frame
    this.dashButtonBorder = this.scene.add.rectangle(0, 0, barWidth, barHeight, 0x000000, 0);
    this.dashButtonBorder.setStrokeStyle(2, 0x38bdf8, 0.9);

    // Text Label
    this.dashButtonText = this.scene.add.text(0, 0, '💨 LƯỚT NÉ (SPACE)', {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#e0f2fe',
      stroke: '#032333',
      strokeThickness: 3
    }).setOrigin(0.5);

    this.dashButtonContainer.add([
      this.dashButtonGlow,
      this.dashButtonBg,
      this.dashButtonFill,
      this.dashButtonBorder,
      this.dashButtonText
    ]);

    // Make button interactive
    this.dashButtonBg.setInteractive({ useHandCursor: true });

    this.dashButtonBg.on('pointerover', () => {
      if (this.dashCooldownTimer <= 0) {
        this.dashButtonContainer.setScale(1.05);
        this.dashButtonGlow.setAlpha(0.5);
      }
    });

    this.dashButtonBg.on('pointerout', () => {
      this.dashButtonContainer.setScale(1.0);
      this.dashButtonGlow.setAlpha(0.25);
    });

    this.dashButtonBg.on('pointerdown', () => {
      this.performTacticalDash();
    });

    // Breathing pulse tween when ready
    this.scene.tweens.add({
      targets: this.dashButtonGlow,
      alpha: { from: 0.15, to: 0.4 },
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  // =========================================================================
  // 2. FOCUS TARGET: RETICLE
  // =========================================================================
  private createFocusTargetReticle(): void {
    this.reticleContainer = this.scene.add.container(0, 0);
    this.reticleContainer.setDepth(35);
    this.reticleContainer.setVisible(false);

    // Outer rotating reticle with corner brackets
    this.reticleOuter = this.scene.add.graphics();
    this.reticleOuter.lineStyle(2.5, 0xef4444, 1.0);

    // Draw 4 circular corner arc brackets
    const radius = 34;
    const bracketLen = Math.PI / 4.5;
    for (let i = 0; i < 4; i++) {
      const startAngle = (i * Math.PI) / 2 - bracketLen / 2;
      const endAngle = startAngle + bracketLen;
      this.reticleOuter.beginPath();
      this.reticleOuter.arc(0, 0, radius, startAngle, endAngle);
      this.reticleOuter.strokePath();
    }

    // Outer tick pointers
    for (let i = 0; i < 4; i++) {
      const ang = (i * Math.PI) / 2;
      const x1 = Math.cos(ang) * (radius + 2);
      const y1 = Math.sin(ang) * (radius + 2);
      const x2 = Math.cos(ang) * (radius + 9);
      const y2 = Math.sin(ang) * (radius + 9);
      this.reticleOuter.beginPath();
      this.reticleOuter.moveTo(x1, y1);
      this.reticleOuter.lineTo(x2, y2);
      this.reticleOuter.strokePath();
    }

    // Inner rotating dashed crosshair
    this.reticleInner = this.scene.add.graphics();
    this.reticleInner.lineStyle(1.5, 0xfca5a5, 0.85);
    this.reticleInner.strokeCircle(0, 0, 20);

    // Inner cross lines
    this.reticleInner.lineStyle(1.5, 0xff0044, 0.9);
    this.reticleInner.beginPath();
    this.reticleInner.moveTo(-8, 0);
    this.reticleInner.lineTo(8, 0);
    this.reticleInner.moveTo(0, -8);
    this.reticleInner.lineTo(0, 8);
    this.reticleInner.strokePath();

    // Floating text badge above monster
    this.reticleBadge = this.scene.add.text(0, -50, '🎯 [ƯU TIÊN TIÊU DIỆT]', {
      fontFamily: 'sans-serif',
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#fee2e2',
      stroke: '#991b1b',
      strokeThickness: 3.5
    }).setOrigin(0.5);

    this.reticleContainer.add([this.reticleOuter, this.reticleInner, this.reticleBadge]);

    // Reticle scale pulse
    this.scene.tweens.add({
      targets: this.reticleContainer,
      scaleX: { from: 0.95, to: 1.12 },
      scaleY: { from: 0.95, to: 1.12 },
      duration: 550,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Badge bobbing
    this.scene.tweens.add({
      targets: this.reticleBadge,
      y: { from: -52, to: -46 },
      duration: 450,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  // =========================================================================
  // 3. POINTER INPUT HANDLING: FOCUS TARGET CLICK & GROUND CLEAR
  // =========================================================================
  private handlePointerDown(pointer: Phaser.Input.Pointer): void {
    if (this.hero.isDead) return;

    // Check if clicked directly on the Tactical Dash button area
    const btnBounds = new Phaser.Geom.Rectangle(480 - 100, 562 - 20, 200, 40);
    if (btnBounds.contains(pointer.x, pointer.y)) {
      // Dash button handles its own click
      return;
    }

    // Check if clicked close to any alive monster
    const CLICK_TOLERANCE = 44;
    let closestMonster: Monster | null = null;
    let minClickDist = CLICK_TOLERANCE;

    for (const m of this.monsters) {
      if (m.isDead || !m.active) continue;
      const d = Phaser.Math.Distance.Between(pointer.x, pointer.y, m.x, m.y);
      if (d < minClickDist) {
        minClickDist = d;
        closestMonster = m;
      }
    }

    if (closestMonster) {
      // Pin focus target!
      this.setFocusTarget(closestMonster);
    } else {
      // Clicked on empty ground away from monsters -> Clear focus target
      // Ensure we don't accidentally clear if user just clicked right on the hero
      const distToHero = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.hero.x, this.hero.y);
      if (distToHero > 30 && this.focusTarget) {
        this.clearFocusTarget();
      }
    }
  }

  public setFocusTarget(monster: Monster): void {
    if (this.focusTarget === monster) return;

    this.focusTarget = monster;
    this.hero.focusTarget = monster;

    // Audio sound effect
    this.audio.playTargetLock();

    // Show reticle
    this.reticleContainer.setPosition(monster.x, monster.y);
    this.reticleContainer.setVisible(true);

    // Particle flash around target
    this.particles.createHitSparks(monster.x, monster.y, 0xef4444);

    // Status alert popup
    this.damageText.showStatus(
      monster.x,
      monster.y - 35,
      `🎯 ĐÃ GHIM: ${monster.monsterConfig.name.toUpperCase()}`,
      '#ef4444'
    );
  }

  public clearFocusTarget(): void {
    if (!this.focusTarget) return;

    this.focusTarget = null;
    this.hero.focusTarget = null;
    this.reticleContainer.setVisible(false);

    // Play subtle soft click
    this.audio.playClick();
  }

  // =========================================================================
  // 4. TACTICAL DASH EXECUTION
  // =========================================================================
  public performTacticalDash(): boolean {
    if (this.dashCooldownTimer > 0 || this.hero.isDead || this.isDashing) {
      return false;
    }

    this.isDashing = true;
    this.dashCooldownTimer = this.DASH_COOLDOWN;

    // Play swift dash whoosh sound
    this.audio.playDash();

    // 1. Activate Invulnerability (I-Frames: 0.35s)
    this.hero.setInvulnerable(true, this.DASH_IFRAME_DURATION);

    // 2. Determine Dash Angle
    // Prioritize mouse position if away from hero, otherwise target direction
    const pointer = this.scene.input.activePointer;
    let targetAngle: number;
    const distToPointer = Phaser.Math.Distance.Between(this.hero.x, this.hero.y, pointer.x, pointer.y);

    if (distToPointer > 20) {
      targetAngle = Phaser.Math.Angle.Between(this.hero.x, this.hero.y, pointer.x, pointer.y);
    } else if (this.focusTarget && !this.focusTarget.isDead) {
      targetAngle = Phaser.Math.Angle.Between(this.hero.x, this.hero.y, this.focusTarget.x, this.focusTarget.y);
    } else {
      // Dash in current facing direction
      targetAngle = (this.hero as unknown as { sprite: Phaser.GameObjects.Sprite }).sprite?.flipX ? Math.PI : 0;
    }

    // 3. Compute Clamped Destination inside Arena Bounds
    const targetDist = this.DASH_DISTANCE;
    const rawDestX = this.hero.x + Math.cos(targetAngle) * targetDist;
    const rawDestY = this.hero.y + Math.sin(targetAngle) * targetDist;

    const destX = Phaser.Math.Clamp(rawDestX, 65, 895);
    const destY = Phaser.Math.Clamp(rawDestY, 65, 535);

    // 4. VFX Ghost Trails (4 fading after-images)
    const textureKey = `hero_${this.hero.heroClass}`;
    for (let i = 1; i <= 4; i++) {
      this.scene.time.delayedCall(i * 32, () => {
        if (!this.hero || this.hero.isDead) return;

        const ghost = this.scene.add.sprite(this.hero.x, this.hero.y, textureKey);
        ghost.setDepth(24);
        ghost.setTint(0x22d3ee); // Cyan / Jade ngọc
        ghost.setAlpha(0.65);
        ghost.flipX = (this.hero as unknown as { sprite: Phaser.GameObjects.Sprite }).sprite?.flipX ?? false;

        this.scene.tweens.add({
          targets: ghost,
          alpha: 0,
          scale: 0.85,
          duration: 220,
          ease: 'Cubic.easeOut',
          onComplete: () => ghost.destroy()
        });
      });
    }

    // Departure and arrival spark particles
    this.particles.createHitSparks(this.hero.x, this.hero.y, 0x22d3ee);
    this.particles.createHitSparks(destX, destY, 0x67e8f9);

    // Subtle punch shake
    this.scene.cameras.main.shake(90, 0.004);

    // Floating notification
    this.damageText.showStatus(this.hero.x, this.hero.y - 22, '💨 LƯỚT NÉ (I-FRAMES)!', '#22d3ee');

    // 5. High-speed slide tween
    this.scene.tweens.add({
      targets: this.hero,
      x: destX,
      y: destY,
      duration: 170,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        this.isDashing = false;
      }
    });

    return true;
  }

  // =========================================================================
  // 5. UPDATE LOOP
  // =========================================================================
  public update(delta: number): void {
    const dt = delta / 1000;

    // 1. Check Spacebar Key Input
    if (this.spaceKey && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.performTacticalDash();
    }

    // 2. Dash Cooldown Countdown
    if (this.dashCooldownTimer > 0) {
      this.dashCooldownTimer -= dt;
      if (this.dashCooldownTimer <= 0) {
        this.dashCooldownTimer = 0;
      }
    }

    // 3. Update Dash Button HUD
    this.updateDashHUD();

    // 4. Update Focus Target Reticle
    this.updateReticle(dt);
  }

  private updateDashHUD(): void {
    const barWidth = 190;

    if (this.dashCooldownTimer <= 0) {
      // Ready State
      this.dashButtonFill.width = barWidth;
      this.dashButtonFill.setFillStyle(0x0284c7, 0.8);
      this.dashButtonBorder.setStrokeStyle(2, 0x38bdf8, 1.0);
      this.dashButtonGlow.setVisible(true);
      this.dashButtonText.setText('💨 LƯỚT NÉ (SPACE)');
      this.dashButtonText.setColor('#e0f2fe');
    } else {
      // Cooldown State
      const ratio = Math.max(0, 1 - (this.dashCooldownTimer / this.DASH_COOLDOWN));
      this.dashButtonFill.width = barWidth * ratio;
      this.dashButtonFill.setFillStyle(0x0369a1, 0.45);
      this.dashButtonBorder.setStrokeStyle(1.5, 0x475569, 0.7);
      this.dashButtonGlow.setVisible(false);
      this.dashButtonText.setText(`⏳ HỒI CHIÊU: ${this.dashCooldownTimer.toFixed(1)}s`);
      this.dashButtonText.setColor('#94a3b8');
    }
  }

  private updateReticle(dt: number): void {
    if (!this.focusTarget) {
      this.reticleContainer.setVisible(false);
      return;
    }

    // Check if pinned monster died or was removed
    if (this.focusTarget.isDead || !this.focusTarget.active) {
      this.clearFocusTarget();
      return;
    }

    // Follow monster position
    this.reticleContainer.setPosition(this.focusTarget.x, this.focusTarget.y);
    this.reticleContainer.setVisible(true);

    // Continuous rotation: outer clockwise, inner counter-clockwise
    this.reticleOuter.rotation += dt * 3.2;
    this.reticleInner.rotation -= dt * 2.2;
  }

  // =========================================================================
  // 6. DESTROY & CLEANUP
  // =========================================================================
  public destroy(): void {
    if (this.scene && this.scene.input) {
      this.scene.input.off('pointerdown', this.pointerDownHandler);
    }
    if (this.dashButtonContainer) {
      this.dashButtonContainer.destroy();
    }
    if (this.reticleContainer) {
      this.reticleContainer.destroy();
    }
  }
}
