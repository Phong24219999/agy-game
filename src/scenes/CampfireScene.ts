import Phaser from 'phaser';
import { Hero } from '../entities/Hero';
import { DungeonNode } from '../types/game';
import { AudioSystem } from '../systems/AudioSystem';
import { ProgressionSystem } from '../systems/ProgressionSystem';
import { completeDungeonNode } from './MapScene';

export interface CampfireSceneData {
  hero: Hero;
  node: DungeonNode;
  dungeonNodes: DungeonNode[];
  floor: number;
  seed?: string;
}

export class CampfireScene extends Phaser.Scene {
  private hero!: Hero;
  private node!: DungeonNode;
  private dungeonNodes!: DungeonNode[];
  private floor!: number;
  private seed: string = 'VOID-7842';
  private audio!: AudioSystem;
  private chosen: boolean = false;

  constructor() {
    super('CampfireScene');
  }

  init(data: CampfireSceneData): void {
    this.hero = data.hero;
    this.node = data.node;
    this.dungeonNodes = data.dungeonNodes;
    this.floor = data.floor || 1;
    this.seed = data.seed || 'VOID-7842';
    this.audio = AudioSystem.getInstance();
    this.chosen = false;
  }

  create(): void {
    const { width, height } = this.scale;

    // Dark moody background
    this.add.rectangle(0, 0, width, height, 0x090710).setOrigin(0, 0);

    // Decorative wall borders
    for (let x = 0; x < width; x += 32) {
      this.add.image(x + 16, 16, 'tile_wall');
      this.add.image(x + 16, height - 16, 'tile_wall');
    }

    // Altar with blue mystic flame in center
    const altar = this.add.image(width / 2, height / 2 - 50, 'altar').setScale(2.5);

    // Flickering aura
    const glow = this.add.circle(width / 2, height / 2 - 70, 60, 0x3182ce, 0.25);
    this.tweens.add({
      targets: glow,
      scale: 1.3,
      alpha: 0.12,
      yoyo: true,
      repeat: -1,
      duration: 1000,
      ease: 'Sine.easeInOut'
    });

    // Floating embers
    this.time.addEvent({
      delay: 150,
      loop: true,
      callback: () => {
        const ember = this.add.circle(
          width / 2 + (Math.random() * 80 - 40),
          height / 2 - 50,
          Math.random() * 3 + 1,
          0x90cdf4,
          0.8
        );
        this.tweens.add({
          targets: ember,
          y: ember.y - 90 - Math.random() * 40,
          x: ember.x + (Math.random() * 40 - 20),
          alpha: 0,
          scale: 0.2,
          duration: 1200 + Math.random() * 600,
          onComplete: () => ember.destroy()
        });
      }
    });

    // Header Title
    this.add.text(width / 2, 40, 'LÒ RÈN CỔ & LỬA TRẠI', {
      fontFamily: 'serif',
      fontSize: '28px',
      color: '#ecc94b',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, 75, 'Ngọn lửa ma thuật soi sáng tâm hồn. Hãy chọn một ân huệ:', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#a0aec0'
    }).setOrigin(0.5);

    // Hero current status
    this.add.text(width / 2, 105, `HP Hiện Tại: ${Math.round(this.hero.stats.hp)} / ${this.hero.stats.maxHp}   |   Sát Thương: ${Math.round(this.hero.stats.atk)}`, {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#63b3ed',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Option 1: Rest (Heal 40% HP)
    const healAmount = Math.round(this.hero.stats.maxHp * 0.4);
    this.createOptionCard(
      width / 2 - 160,
      height / 2 + 130,
      '❤️ NGHỈ NGƠI',
      `Hồi phục ngay +${healAmount} Máu (40% HP tối đa).\nGiúp bạn chuẩn bị vững vàng cho các trận chiến hiểm nguy sắp tới.`,
      0x2f855a,
      0x48bb78,
      () => {
        this.hero.heal(healAmount);
        this.onChoiceSelected(`Đã nghỉ ngơi! Hồi phục +${healAmount} HP.`);
      }
    );

    // Option 2: Forge (Boost equipment or stats)
    const hasEquipment = this.hero.equipment && this.hero.equipment.length > 0;
    const forgeDesc = hasEquipment
      ? 'Cường hóa 1 trang bị ngẫu nhiên lên +1 cấp (+25% chỉ số trang bị tại đe thiêng).'
      : 'Cường hóa sức mạnh cơ bản:\n+8 Sát Thương & +30 Máu Tối Đa vĩnh viễn trong run.';

    this.createOptionCard(
      width / 2 + 160,
      height / 2 + 130,
      '⚔️ RÈN VŨ KHÍ',
      forgeDesc,
      0x744210,
      0xd69e2e,
      () => {
        let msg = 'Đã rèn vũ khí! +8 Sát Thương và +30 Máu tối đa.';
        if (hasEquipment) {
          const enhanceable = this.hero.equipment.filter((item) => (item.enhanceLevel || 0) < 4);
          const target = enhanceable.length > 0 ? enhanceable[0] : this.hero.equipment[0];
          if (ProgressionSystem.enhanceEquipment(target)) {
            this.hero.refreshDerivedStats();
            msg = `Đã cường hóa thành công: ${target.name}!`;
          } else {
            this.hero.stats.atk += 8;
            this.hero.stats.maxHp += 30;
            this.hero.stats.hp += 30;
            this.hero.refreshDerivedStats();
          }
        } else {
          this.hero.stats.atk += 8;
          this.hero.stats.maxHp += 30;
          this.hero.stats.hp += 30;
          this.hero.refreshDerivedStats();
        }
        this.onChoiceSelected(msg);
      }
    );
  }

  private createOptionCard(
    x: number,
    y: number,
    title: string,
    desc: string,
    bgColor: number,
    borderColor: number,
    onSelect: () => void
  ): void {
    const card = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 260, 160, 0x161426, 0.95);
    bg.setStrokeStyle(2, borderColor);

    const titleText = this.add.text(0, -50, title, {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const descText = this.add.text(0, -10, desc, {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#cbd5e0',
      align: 'center',
      wordWrap: { width: 230 }
    }).setOrigin(0.5);

    const btn = this.add.rectangle(0, 50, 140, 34, bgColor);
    btn.setStrokeStyle(1, 0xffffff);

    const btnText = this.add.text(0, 50, 'CHỌN', {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    card.add([bg, titleText, descText, btn, btnText]);

    bg.setInteractive({ useHandCursor: true });
    btn.setInteractive({ useHandCursor: true });

    const onHover = () => {
      if (this.chosen) return;
      card.setScale(1.04);
      bg.setStrokeStyle(3, 0xffffff);
    };
    const onOut = () => {
      if (this.chosen) return;
      card.setScale(1.0);
      bg.setStrokeStyle(2, borderColor);
    };

    bg.on('pointerover', onHover);
    bg.on('pointerout', onOut);
    btn.on('pointerover', onHover);
    btn.on('pointerout', onOut);

    const onClick = () => {
      if (this.chosen) return;
      this.chosen = true;
      this.audio.playLevelUp();
      onSelect();
    };

    bg.on('pointerdown', onClick);
    btn.on('pointerdown', onClick);
  }

  private onChoiceSelected(message: string): void {
    const { width, height } = this.scale;

    // Toast notification
    const banner = this.add.container(width / 2, height - 60);
    const bg = this.add.rectangle(0, 0, 480, 50, 0x1a202c, 0.95);
    bg.setStrokeStyle(2, 0x48bb78);

    const text = this.add.text(0, 0, `${message} Đang trở lại bản đồ...`, {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#ecc94b',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    banner.add([bg, text]);

    // Mark current node completed and unlock next branch
    completeDungeonNode(this.node, this.dungeonNodes);

    this.time.delayedCall(1500, () => {
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.time.delayedCall(300, () => {
        this.scene.start('MapScene', {
          hero: this.hero,
          dungeonNodes: this.dungeonNodes,
          floor: this.floor,
          seed: this.seed
        });
      });
    });
  }
}
