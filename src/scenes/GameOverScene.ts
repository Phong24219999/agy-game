import Phaser from 'phaser';
import { Hero } from '../entities/Hero';
import { DungeonNode } from '../types/game';
import { AudioSystem } from '../systems/AudioSystem';
import { SaveSystem } from '../systems/SaveSystem';

export interface GameOverSceneData {
  hero: Hero;
  floor?: number;
  node?: DungeonNode;
  soulsCollected?: number;
  victory?: boolean;
  seed?: string;
}

export class GameOverScene extends Phaser.Scene {
  private hero!: Hero;
  private floor: number = 1;
  private seed: string = 'VOID-7842';
  private soulsCollected: number = 0;
  private isVictory: boolean = false;
  private audio!: AudioSystem;

  constructor() {
    super('GameOverScene');
  }

  init(data: GameOverSceneData): void {
    this.hero = data.hero;
    this.floor = data.floor || 1;
    this.seed = data.seed || 'VOID-7842';
    this.soulsCollected = data.soulsCollected || 0;
    this.isVictory = !!data.victory;
    this.audio = AudioSystem.getInstance();

    // Bonus souls based on floor reached
    const bonusSouls = this.floor * 15 + (this.isVictory ? 100 : 0);
    const totalAwarded = this.soulsCollected + bonusSouls;

    // Save progression
    SaveSystem.getInstance().addSouls(totalAwarded);
    SaveSystem.getInstance().recordRun(this.floor, this.isVictory);
  }

  create(): void {
    const { width, height } = this.scale;

    // Dark moody background
    this.add.rectangle(0, 0, width, height, this.isVictory ? 0x0a101f : 0x140508).setOrigin(0, 0);

    // Decorative particles
    this.time.addEvent({
      delay: 200,
      loop: true,
      callback: () => {
        const p = this.add.circle(
          Math.random() * width,
          height + 10,
          Math.random() * 3 + 1,
          this.isVictory ? 0x63b3ed : 0x9b2c2c,
          0.6
        );
        this.tweens.add({
          targets: p,
          y: -10,
          x: p.x + (Math.random() * 60 - 30),
          alpha: 0,
          duration: 3000 + Math.random() * 2000,
          onComplete: () => p.destroy()
        });
      }
    });

    // Title Banner
    const titleColor = this.isVictory ? '#f6e05e' : '#e53e3e';
    const titleText = this.isVictory ? '👑 CHINH PHỤC HẦM NGỤC THÀNH CÔNG!' : '💀 LINH HỒN ĐÃ BỊ NUỐT CHỬNG...';

    this.add.text(width / 2, 70, titleText, {
      fontFamily: 'serif',
      fontSize: '28px',
      color: titleColor,
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const subText = this.isVictory
      ? 'Bạn đã đánh bại Chúa Tể Hư Vô và thanh tẩy hầm ngục tăm tối!'
      : 'Thể xác ngã xuống, nhưng tàn tích linh hồn sẽ trở về Điện Thờ để hồi sinh mạnh mẽ hơn.';

    this.add.text(width / 2, 110, subText, {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#a0aec0'
    }).setOrigin(0.5);

    // Statistics Box
    const box = this.add.container(width / 2, 270);
    const boxBg = this.add.rectangle(0, 0, 460, 240, 0x131220, 0.95);
    boxBg.setStrokeStyle(2, this.isVictory ? 0xd69e2e : 0x742a2a);

    const className = this.hero.heroClass === 'knight'
      ? 'Huyết Hiệp Sĩ'
      : this.hero.heroClass === 'mage'
      ? 'Hư Vô Pháp Sư'
      : 'Bóng Ma Đạo Tặc';

    const bonusSouls = this.floor * 15 + (this.isVictory ? 100 : 0);
    const totalSoulsAwarded = this.soulsCollected + bonusSouls;

    const stats = [
      `Lớp Nhân Vật: ${className}`,
      `Cấp Độ Đạt Được: Cấp ${this.hero.stats.level}`,
      `Tầng Hầm Ngục: Tầng ${this.floor}`,
      `Vàng Thu Được Trong Run: ${this.hero.stats.gold} G`,
      `Số Phước Lành Tích Lũy: ${this.hero.perks.length} Thẻ`,
      `Trang Bị Thu Thập: ${this.hero.equipment.length} Món`,
      `🔮 Linh Hồn Thu Hoạch: +${totalSoulsAwarded} Shards (Đã lưu vĩnh viễn)`
    ];

    stats.forEach((st, idx) => {
      const text = this.add.text(-190, -90 + idx * 26, st, {
        fontFamily: 'sans-serif',
        fontSize: '13px',
        color: idx === stats.length - 1 ? '#b794f4' : '#e2e8f0',
        fontStyle: idx === stats.length - 1 ? 'bold' : 'normal'
      });
      box.add(text);
    });

    box.add(boxBg);
    box.sendToBack(boxBg);

    if (this.isVictory) {
      // 2 Buttons: Tiếp Tục Xuống Tầng Sâu Hơn HOẶC Rút Lui Về Điện Thờ
      const nextFloor = this.floor + 1;

      // Button 1: Tiếp Tục Tầng N + 1
      const nextBtnContainer = this.add.container(width / 2 - 140, 450);
      const nextBtnBg = this.add.rectangle(0, 0, 240, 48, 0x1b4332);
      nextBtnBg.setStrokeStyle(2, 0x40916c);

      const nextBtnText = this.add.text(0, 0, `🔻 XUỐNG TẦNG ${nextFloor}`, {
        fontFamily: 'sans-serif',
        fontSize: '13px',
        color: '#74c69d',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      nextBtnContainer.add([nextBtnBg, nextBtnText]);
      nextBtnBg.setInteractive({ useHandCursor: true });
      nextBtnBg.on('pointerover', () => {
        nextBtnBg.setFillStyle(0x2d6a4f);
        nextBtnContainer.setScale(1.04);
      });
      nextBtnBg.on('pointerout', () => {
        nextBtnBg.setFillStyle(0x1b4332);
        nextBtnContainer.setScale(1.0);
      });
      nextBtnBg.on('pointerdown', () => {
        this.audio.playClick();
        // Hồi 35% HP khi tiến vào tầng mới
        this.hero.heal(Math.round(this.hero.stats.maxHp * 0.35));
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.time.delayedCall(300, () => {
          this.scene.start('MapScene', {
            hero: this.hero,
            dungeonNodes: [],
            floor: nextFloor,
            seed: this.seed
          });
        });
      });

      // Button 2: Rút lui về Điện Thờ
      const returnBtnContainer = this.add.container(width / 2 + 140, 450);
      const returnBtnBg = this.add.rectangle(0, 0, 240, 48, 0x3c096c);
      returnBtnBg.setStrokeStyle(2, 0x9d4edd);

      const returnBtnText = this.add.text(0, 0, '🏛️ TRỞ VỀ ĐIỆN THỜ', {
        fontFamily: 'sans-serif',
        fontSize: '13px',
        color: '#e0aaff',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      returnBtnContainer.add([returnBtnBg, returnBtnText]);
      returnBtnBg.setInteractive({ useHandCursor: true });
      returnBtnBg.on('pointerover', () => {
        returnBtnBg.setFillStyle(0x5a189a);
        returnBtnContainer.setScale(1.04);
      });
      returnBtnBg.on('pointerout', () => {
        returnBtnBg.setFillStyle(0x3c096c);
        returnBtnContainer.setScale(1.0);
      });
      returnBtnBg.on('pointerdown', () => {
        this.audio.playClick();
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.time.delayedCall(300, () => {
          this.scene.start('MainMenuScene');
        });
      });
    } else {
      // Defeat: Chỉ có nút trở về Điện Thờ để nâng cấp
      const btnContainer = this.add.container(width / 2, 450);
      const btnBg = this.add.rectangle(0, 0, 260, 48, 0x553c9a);
      btnBg.setStrokeStyle(2, 0xd6bcfa);

      const btnText = this.add.text(0, 0, '🏛️ TRỞ VỀ ĐIỆN THỜ (SANCTUARY)', {
        fontFamily: 'sans-serif',
        fontSize: '13px',
        color: '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      btnContainer.add([btnBg, btnText]);

      btnBg.setInteractive({ useHandCursor: true });
      btnBg.on('pointerover', () => {
        btnBg.setFillStyle(0x6b46c1);
        btnContainer.setScale(1.04);
      });
      btnBg.on('pointerout', () => {
        btnBg.setFillStyle(0x553c9a);
        btnContainer.setScale(1.0);
      });

      btnBg.on('pointerdown', () => {
        this.audio.playClick();
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.time.delayedCall(300, () => {
          this.scene.start('MainMenuScene');
        });
      });
    }
  }
}
