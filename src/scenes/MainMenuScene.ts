import Phaser from 'phaser';
import { Hero } from '../entities/Hero';
import { HeroClass, HeroStats } from '../types/game';
import { AudioSystem } from '../systems/AudioSystem';
import { SaveSystem, META_UPGRADES } from '../systems/SaveSystem';
import { SeededRNG } from '../systems/SeededRNG';

export class MainMenuScene extends Phaser.Scene {
  private audio!: AudioSystem;
  private saveSystem!: SaveSystem;
  private currentTab: 'heroes' | 'sanctuary' = 'heroes';

  private selectedClass: HeroClass = 'knight';
  private currentSeed: string = SeededRNG.generateRandomSeedString();
  private seedText!: Phaser.GameObjects.Text;

  private heroCards: { container: Phaser.GameObjects.Container; bg: Phaser.GameObjects.Rectangle; heroClass: HeroClass }[] = [];

  private tabContentContainer!: Phaser.GameObjects.Container;
  private tabBtnHeroesBg!: Phaser.GameObjects.Rectangle;
  private tabBtnSanctuaryBg!: Phaser.GameObjects.Rectangle;
  private tabBtnHeroesText!: Phaser.GameObjects.Text;
  private tabBtnSanctuaryText!: Phaser.GameObjects.Text;

  private topSoulsText!: Phaser.GameObjects.Text;

  constructor() {
    super('MainMenuScene');
  }

  create(): void {
    this.audio = AudioSystem.getInstance();
    this.saveSystem = SaveSystem.getInstance();

    const { width, height } = this.scale;

    // Dark moody background
    this.add.rectangle(0, 0, width, height, 0x090712).setOrigin(0, 0);

    // Decorative wall borders
    for (let x = 0; x < width; x += 32) {
      this.add.image(x + 16, 16, 'tile_wall');
      this.add.image(x + 16, height - 16, 'tile_wall');
    }

    // Top Left: Seed Control Box
    const seedBox = this.add.container(140, 48);
    const seedBg = this.add.rectangle(0, 0, 220, 36, 0x161326, 0.9);
    seedBg.setStrokeStyle(1, 0x4a5568);

    this.seedText = this.add.text(-90, -8, `🎲 SEED: ${this.currentSeed}`, {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#ecc94b',
      fontStyle: 'bold'
    });

    const rerollSeedBtn = this.add.text(70, -8, '🔄 Đổi', {
      fontFamily: 'sans-serif',
      fontSize: '11px',
      color: '#63b3ed',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0);
    rerollSeedBtn.setInteractive({ useHandCursor: true });
    rerollSeedBtn.on('pointerdown', () => {
      this.currentSeed = SeededRNG.generateRandomSeedString();
      this.seedText.setText(`🎲 SEED: ${this.currentSeed}`);
      this.audio.playClick();
    });

    seedBox.add([seedBg, this.seedText, rerollSeedBtn]);

    // Title text
    this.add.text(width / 2, 45, 'ABYSS DESCENT', {
      fontFamily: 'serif',
      fontSize: '32px',
      color: '#ecc94b',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, 78, 'HẦM NGỤC HƯ VÔ - AUTO-BATTLER ROGUELITE', {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#a0aec0',
      letterSpacing: 2
    }).setOrigin(0.5);

    // Top Right Resource Bar
    const resBox = this.add.container(width - 150, 48);
    const resBg = this.add.rectangle(0, 0, 190, 36, 0x161326, 0.9);
    resBg.setStrokeStyle(1, 0x805ad5);

    if (this.textures.exists('icon_soul')) {
      this.add.sprite(width - 225, 48, 'icon_soul').setScale(0.85);
    }

    this.topSoulsText = this.add.text(width - 200, 40, `${this.saveSystem.getData().totalSouls} Linh Hồn`, {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#d6bcfa',
      fontStyle: 'bold'
    });

    // Navigation Tabs
    const tabY = 115;
    const tabW = 200;
    const tabH = 34;

    // Tab 1: Hero Select
    this.tabBtnHeroesBg = this.add.rectangle(width / 2 - 110, tabY, tabW, tabH, 0x2b2346);
    this.tabBtnHeroesBg.setStrokeStyle(2, 0xd69e2e);
    this.tabBtnHeroesText = this.add.text(width / 2 - 110, tabY, '⚔️ CHỌN ANH HÙNG', {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Tab 2: Sanctuary
    this.tabBtnSanctuaryBg = this.add.rectangle(width / 2 + 110, tabY, tabW, tabH, 0x161426);
    this.tabBtnSanctuaryBg.setStrokeStyle(1, 0x4a5568);
    this.tabBtnSanctuaryText = this.add.text(width / 2 + 110, tabY, '🏛️ ĐIỆN THỜ VĨNH VIỄN', {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#a0aec0',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.tabBtnHeroesBg.setInteractive({ useHandCursor: true });
    this.tabBtnSanctuaryBg.setInteractive({ useHandCursor: true });

    this.tabBtnHeroesBg.on('pointerdown', () => this.switchTab('heroes'));
    this.tabBtnSanctuaryBg.on('pointerdown', () => this.switchTab('sanctuary'));

    // Dynamic Tab Content Container
    this.tabContentContainer = this.add.container(0, 0);

    // Render Initial Tab
    this.renderCurrentTab();
  }

  private switchTab(tab: 'heroes' | 'sanctuary'): void {
    if (this.currentTab === tab) return;
    this.audio.playClick();
    this.currentTab = tab;

    if (tab === 'heroes') {
      this.tabBtnHeroesBg.setFillStyle(0x2b2346);
      this.tabBtnHeroesBg.setStrokeStyle(2, 0xd69e2e);
      this.tabBtnHeroesText.setColor('#ffffff');

      this.tabBtnSanctuaryBg.setFillStyle(0x161426);
      this.tabBtnSanctuaryBg.setStrokeStyle(1, 0x4a5568);
      this.tabBtnSanctuaryText.setColor('#a0aec0');
    } else {
      this.tabBtnSanctuaryBg.setFillStyle(0x2b2346);
      this.tabBtnSanctuaryBg.setStrokeStyle(2, 0xd69e2e);
      this.tabBtnSanctuaryText.setColor('#ffffff');

      this.tabBtnHeroesBg.setFillStyle(0x161426);
      this.tabBtnHeroesBg.setStrokeStyle(1, 0x4a5568);
      this.tabBtnHeroesText.setColor('#a0aec0');
    }

    this.renderCurrentTab();
  }

  private renderCurrentTab(): void {
    this.tabContentContainer.removeAll(true);
    if (this.currentTab === 'heroes') {
      this.renderHeroesTab();
    } else {
      this.renderSanctuaryTab();
    }
  }

  private renderHeroesTab(): void {
    const { width, height } = this.scale;
    this.heroCards = [];

    const classes: {
      id: HeroClass;
      name: string;
      sprite: string;
      title: string;
      desc: string;
      str: number;
      vit: number;
      int: number;
      agi: number;
      hp: number;
      atk: number;
      def: number;
      speed: number;
      skillName: string;
      skillDesc: string;
    }[] = [
      {
        id: 'knight',
        name: 'Huyết Hiệp Sĩ',
        sprite: 'hero_knight',
        title: 'Cận Chiến Bất Hoại & Lifesteal',
        desc: 'Chiến binh mang giáp sắt dày và thanh đại kiếm khát máu.',
        str: 18,
        vit: 18,
        int: 8,
        agi: 10,
        hp: 250,
        atk: 24,
        def: 18,
        speed: 110,
        skillName: 'Lốc Kiếm Xoáy',
        skillDesc: 'Xoay kiếm 360 độ chém tất cả quái xung quanh và hồi phục máu.'
      },
      {
        id: 'mage',
        name: 'Hư Vô Pháp Sư',
        sprite: 'hero_mage',
        title: 'Phép Thuật AOE & Khống Chế',
        desc: 'Pháp sư triệu gọi năng lượng hư không, giữ cự ly bắn phá cực mạnh.',
        str: 8,
        vit: 10,
        int: 22,
        agi: 12,
        hp: 160,
        atk: 34,
        def: 6,
        speed: 100,
        skillName: 'Thiên Thạch Hư Vô',
        skillDesc: 'Gọi thiên thạch hủy diệt gây sát thương diện rộng và thiêu đốt.'
      },
      {
        id: 'rogue',
        name: 'Bóng Ma Đạo Tặc',
        sprite: 'hero_rogue',
        title: 'Chí Mạng & Tốc Đánh Điên Cuồng',
        desc: 'Sát thủ thoắt ẩn thoắt hiện với cặp song đao tẩm độc.',
        str: 12,
        vit: 12,
        int: 10,
        agi: 22,
        hp: 180,
        atk: 28,
        def: 9,
        speed: 135,
        skillName: 'Ám Sát & Phi Dao',
        skillDesc: 'Lướt ra sau lưng bạo kích mục tiêu và xả quạt dao độc.'
      }
    ];

    const cardWidth = 260;
    const cardHeight = 330;
    const spacing = 30;
    const startX = width / 2 - (cardWidth * 1.5 + spacing);
    const cardY = 320;

    classes.forEach((c, idx) => {
      const x = startX + idx * (cardWidth + spacing) + cardWidth / 2;
      const isSelected = this.selectedClass === c.id;

      const container = this.add.container(x, cardY);
      const bg = this.add.rectangle(0, 0, cardWidth, cardHeight, 0x151224, 0.95);
      bg.setStrokeStyle(isSelected ? 3 : 1, isSelected ? 0xf6e05e : 0x3d3556);

      // Hero Sprite Preview
      const sprite = this.add.sprite(0, -95, c.sprite).setScale(2.2);

      // Name & Title
      const name = this.add.text(0, -35, c.name, {
        fontFamily: 'serif',
        fontSize: '18px',
        color: isSelected ? '#ecc94b' : '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      const title = this.add.text(0, -15, c.title, {
        fontFamily: 'sans-serif',
        fontSize: '10px',
        color: '#63b3ed',
        fontStyle: 'italic'
      }).setOrigin(0.5);

      // Attributes & Stats
      const statsText = this.add.text(0, 30, `STR: ${c.str} | VIT: ${c.vit} | INT: ${c.int} | AGI: ${c.agi}\n❤️ Máu: ${c.hp}    ⚔️ Công: ${c.atk}    🛡️ Giáp: ${c.def}%`, {
        fontFamily: 'sans-serif',
        fontSize: '11px',
        color: '#cbd5e0',
        align: 'center',
        lineSpacing: 5
      }).setOrigin(0.5);

      // Skill Box
      const skillBg = this.add.rectangle(0, 100, cardWidth - 24, 60, 0x1e1933, 0.9);
      skillBg.setStrokeStyle(1, 0x44337a);

      const skillTitle = this.add.text(0, 80, `⚡ ${c.skillName}`, {
        fontFamily: 'sans-serif',
        fontSize: '12px',
        color: '#d6bcfa',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      const skillDesc = this.add.text(0, 105, c.skillDesc, {
        fontFamily: 'sans-serif',
        fontSize: '10px',
        color: '#a0aec0',
        align: 'center',
        wordWrap: { width: cardWidth - 36 }
      }).setOrigin(0.5);

      container.add([bg, sprite, name, title, statsText, skillBg, skillTitle, skillDesc]);

      bg.setInteractive({ useHandCursor: true });
      bg.on('pointerdown', () => {
        this.selectedClass = c.id;
        this.audio.playClick();
        this.renderHeroesTab();
      });

      this.heroCards.push({ container, bg, heroClass: c.id });
      this.tabContentContainer.add(container);
    });

    // Start Game Button
    const startBtn = this.add.container(width / 2, height - 55);
    const startBg = this.add.rectangle(0, 0, 280, 48, 0x742a2a);
    startBg.setStrokeStyle(2, 0xe53e3e);

    const startText = this.add.text(0, 0, '⚔️ BẮT ĐẦU CHINH PHỤC', {
      fontFamily: 'sans-serif',
      fontSize: '15px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    startBtn.add([startBg, startText]);
    startBg.setInteractive({ useHandCursor: true });

    startBg.on('pointerover', () => {
      startBg.setFillStyle(0x9b2c2c);
      startBtn.setScale(1.03);
    });
    startBg.on('pointerout', () => {
      startBg.setFillStyle(0x742a2a);
      startBtn.setScale(1.0);
    });

    startBg.on('pointerdown', () => {
      this.startNewRun();
    });

    this.tabContentContainer.add(startBtn);
  }

  private startNewRun(): void {
    this.audio.playLevelUp();

    let baseStats: HeroStats;
    if (this.selectedClass === 'knight') {
      baseStats = {
        str: 18,
        vit: 18,
        int: 8,
        agi: 10,
        hp: 250,
        maxHp: 250,
        atk: 24,
        def: 18,
        attackSpeed: 1.0,
        cooldownReduction: 0.05,
        critRate: 0.1,
        critDmg: 1.6,
        lifeSteal: 0.08,
        dodgeRate: 0.05,
        thorns: 8,
        speed: 110,
        gold: 35,
        souls: 0,
        level: 1,
        exp: 0,
        maxExp: 50,
        runSeed: this.currentSeed
      };
    } else if (this.selectedClass === 'mage') {
      baseStats = {
        str: 8,
        vit: 10,
        int: 22,
        agi: 12,
        hp: 160,
        maxHp: 160,
        atk: 34,
        def: 6,
        attackSpeed: 0.9,
        cooldownReduction: 0.15,
        critRate: 0.15,
        critDmg: 1.8,
        lifeSteal: 0.0,
        dodgeRate: 0.08,
        thorns: 0,
        speed: 100,
        gold: 35,
        souls: 0,
        level: 1,
        exp: 0,
        maxExp: 50,
        runSeed: this.currentSeed
      };
    } else {
      // rogue
      baseStats = {
        str: 12,
        vit: 12,
        int: 10,
        agi: 22,
        hp: 180,
        maxHp: 180,
        atk: 28,
        def: 9,
        attackSpeed: 1.5,
        cooldownReduction: 0.08,
        critRate: 0.25,
        critDmg: 2.0,
        lifeSteal: 0.04,
        dodgeRate: 0.18,
        thorns: 0,
        speed: 135,
        gold: 35,
        souls: 0,
        level: 1,
        exp: 0,
        maxExp: 50,
        runSeed: this.currentSeed
      };
    }

    // Apply Meta Upgrades
    const finalStats = this.saveSystem.applyMetaStats(baseStats);

    // Create Hero instance
    const hero = new Hero(this, 200, 300, this.selectedClass, finalStats);

    this.cameras.main.fadeOut(350, 0, 0, 0);
    this.time.delayedCall(350, () => {
      this.scene.start('MapScene', {
        hero,
        floor: 1,
        seed: this.currentSeed
      });
    });
  }

  private renderSanctuaryTab(): void {
    const { width } = this.scale;

    this.add.text(width / 2, 160, 'Sử dụng Linh Hồn (Soul Shards) để ban phước sức mạnh vĩnh viễn cho mọi lần run:', {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#cbd5e0'
    }).setOrigin(0.5);

    const startY = 195;
    const itemHeight = 65;

    META_UPGRADES.forEach((upgrade, idx) => {
      const y = startY + idx * itemHeight;
      const currentLevel = this.saveSystem.getUpgradeLevel(upgrade.id);
      const isMax = currentLevel >= upgrade.maxLevel;
      const cost = isMax ? 0 : upgrade.cost(currentLevel);

      const row = this.add.container(width / 2, y);
      const bg = this.add.rectangle(0, 0, 720, 56, 0x161328, 0.9);
      bg.setStrokeStyle(1, 0x3d3556);

      const name = this.add.text(-330, -14, `${upgrade.name} (Lv. ${currentLevel}/${upgrade.maxLevel})`, {
        fontFamily: 'sans-serif',
        fontSize: '15px',
        color: '#ecc94b',
        fontStyle: 'bold'
      });

      const desc = this.add.text(-330, 8, upgrade.description, {
        fontFamily: 'sans-serif',
        fontSize: '11px',
        color: '#a0aec0'
      });

      const btnBg = this.add.rectangle(260, 0, 140, 36, isMax ? 0x2d3748 : 0x553c9a);
      btnBg.setStrokeStyle(1, isMax ? 0x4a5568 : 0xb794f4);

      const btnText = this.add.text(260, 0, isMax ? 'TỐI ĐA' : `🔮 ${cost} Shards`, {
        fontFamily: 'sans-serif',
        fontSize: '12px',
        color: isMax ? '#a0aec0' : '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      row.add([bg, name, desc, btnBg, btnText]);

      if (!isMax) {
        btnBg.setInteractive({ useHandCursor: true });
        btnBg.on('pointerover', () => btnBg.setFillStyle(0x6b46c1));
        btnBg.on('pointerout', () => btnBg.setFillStyle(0x553c9a));
        btnBg.on('pointerdown', () => {
          if (this.saveSystem.buyUpgrade(upgrade.id)) {
            this.audio.playCoin();
            this.topSoulsText.setText(`${this.saveSystem.getData().totalSouls} Linh Hồn`);
            this.renderSanctuaryTab();
          } else {
            this.audio.playHit();
          }
        });
      }

      this.tabContentContainer.add(row);
    });
  }
}
