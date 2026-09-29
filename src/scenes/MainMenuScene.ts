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
      portrait: string;
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
        portrait: 'portrait_knight',
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
        portrait: 'portrait_mage',
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
        portrait: 'portrait_rogue',
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
      },
      {
        id: 'paladin',
        name: 'Thánh Quang Hiệp Sĩ',
        sprite: 'hero_paladin',
        portrait: 'portrait_paladin',
        title: 'Hộ Thần Khiên Thánh & Phán Quyết',
        desc: 'Chiến binh mang giáp hoàng kim bạch kim, búa thánh và khiên thái dương.',
        str: 16,
        vit: 20,
        int: 14,
        agi: 8,
        hp: 270,
        atk: 22,
        def: 22,
        speed: 105,
        skillName: 'Thánh Phạt Quang Minh',
        skillDesc: 'Tạo vòng tròn thái dương hủy diệt quái vật và nhận lá chắn thánh.'
      },
      {
        id: 'ranger',
        name: 'Thiện Xạ Băng Tuyết',
        sprite: 'hero_ranger',
        portrait: 'portrait_ranger',
        title: 'Xuyên Thấu Cực Xa & Đóng Băng',
        desc: 'Thợ săn yêu tinh với đại cung băng pha lê và áo choàng lông sói.',
        str: 11,
        vit: 12,
        int: 11,
        agi: 20,
        hp: 175,
        atk: 29,
        def: 8,
        speed: 130,
        skillName: 'Mưa Tiễn Băng Giá',
        skillDesc: 'Bắn 5 mũi tên băng xuyên thấu cực mạnh làm đông cứng kẻ thù.'
      },
      {
        id: 'warlock',
        name: 'Thuật Sĩ Hắc Ám',
        sprite: 'hero_warlock',
        portrait: 'portrait_warlock',
        title: 'Rút Hồn Đoạt Mệnh & Quỷ Giới',
        desc: 'Kẻ mang cặp sừng quỷ dữ, tà áo rách rưới và lưỡi hái xương tử thần.',
        str: 9,
        vit: 14,
        int: 20,
        agi: 11,
        hp: 195,
        atk: 31,
        def: 10,
        speed: 105,
        skillName: 'Hút Cạn Linh Hồn',
        skillDesc: 'Rút cạn HP 3 kẻ địch gần nhất, hồi máu và tích lũy linh hồn.'
      }
    ];

    const cardWidth = 286;
    const cardHeight = 186;
    const spacingX = 16;
    const startX = (width - (3 * cardWidth + 2 * spacingX)) / 2 + cardWidth / 2;
    const startY = 236;
    const rowSpacing = 194;

    classes.forEach((c, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const x = startX + col * (cardWidth + spacingX);
      const y = startY + row * rowSpacing;
      const isSelected = this.selectedClass === c.id;

      const container = this.add.container(x, y);
      const bg = this.add.rectangle(0, 0, cardWidth, cardHeight, isSelected ? 0x221a3a : 0x131021, 0.96);
      bg.setStrokeStyle(isSelected ? 2.5 : 1, isSelected ? 0xf6e05e : 0x332a48);

      // Selected accent top border
      if (isSelected) {
        const topGlow = this.add.rectangle(0, -cardHeight / 2 + 2, cardWidth - 4, 3, 0xf6e05e, 0.95);
        container.add(topGlow);
      }

      // Left column: 64x64 Portrait image at (-94, -22)
      const portrait = this.add.image(-94, -22, c.portrait);

      // Under portrait: Hero in-game sprite preview at (-94, 44)
      const spritePreview = this.add.sprite(-94, 44, c.sprite).setScale(1.1);

      // Right side content (x from -50 to 134)
      const name = this.add.text(-50, -78, c.name, {
        fontFamily: 'serif',
        fontSize: '15px',
        color: isSelected ? '#ecc94b' : '#ffffff',
        fontStyle: 'bold'
      });

      const title = this.add.text(-50, -60, c.title, {
        fontFamily: 'sans-serif',
        fontSize: '9.5px',
        color: '#60a5fa',
        fontStyle: 'italic'
      });

      const desc = this.add.text(-50, -46, c.desc, {
        fontFamily: 'sans-serif',
        fontSize: '9px',
        color: '#94a3b8',
        wordWrap: { width: 180 }
      });

      // Starting stats: STR, VIT, INT, AGI, HP, ATK, DEF
      const statsText = this.add.text(-50, -14, `STR: ${c.str} | VIT: ${c.vit} | INT: ${c.int} | AGI: ${c.agi}\n❤️ ${c.hp}    ⚔️ ${c.atk}    🛡️ ${c.def}%`, {
        fontFamily: 'monospace',
        fontSize: '9.5px',
        color: '#fef08a',
        lineSpacing: 3
      });

      // Skill Box
      const skillBg = this.add.rectangle(40, 48, 184, 44, 0x1a152e, 0.9);
      skillBg.setStrokeStyle(1, isSelected ? 0x7e22ce : 0x332a48);

      const skillTitle = this.add.text(-46, 30, `⚡ ${c.skillName}`, {
        fontFamily: 'sans-serif',
        fontSize: '10px',
        color: '#d8b4fe',
        fontStyle: 'bold'
      });

      const skillDesc = this.add.text(-46, 46, c.skillDesc, {
        fontFamily: 'sans-serif',
        fontSize: '8.5px',
        color: '#94a3b8',
        wordWrap: { width: 172 }
      });

      container.add([bg, portrait, spritePreview, name, title, desc, statsText, skillBg, skillTitle, skillDesc]);

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
    const startBtn = this.add.container(width / 2, height - 38);
    const startBg = this.add.rectangle(0, 0, 280, 44, 0x742a2a);
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
    } else if (this.selectedClass === 'rogue') {
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
    } else if (this.selectedClass === 'paladin') {
      baseStats = {
        str: 16,
        vit: 20,
        int: 14,
        agi: 8,
        hp: 270,
        maxHp: 270,
        atk: 22,
        def: 22,
        attackSpeed: 0.95,
        cooldownReduction: 0.05,
        critRate: 0.10,
        critDmg: 1.6,
        lifeSteal: 0.04,
        dodgeRate: 0.03,
        thorns: 16,
        speed: 105,
        gold: 35,
        souls: 0,
        level: 1,
        exp: 0,
        maxExp: 50,
        runSeed: this.currentSeed
      };
    } else if (this.selectedClass === 'ranger') {
      baseStats = {
        str: 11,
        vit: 12,
        int: 11,
        agi: 20,
        hp: 175,
        maxHp: 175,
        atk: 29,
        def: 8,
        attackSpeed: 1.3,
        cooldownReduction: 0.10,
        critRate: 0.20,
        critDmg: 1.8,
        lifeSteal: 0.02,
        dodgeRate: 0.15,
        thorns: 0,
        speed: 130,
        gold: 35,
        souls: 0,
        level: 1,
        exp: 0,
        maxExp: 50,
        runSeed: this.currentSeed
      };
    } else {
      // warlock
      baseStats = {
        str: 9,
        vit: 14,
        int: 20,
        agi: 11,
        hp: 195,
        maxHp: 195,
        atk: 31,
        def: 10,
        attackSpeed: 1.0,
        cooldownReduction: 0.12,
        critRate: 0.12,
        critDmg: 1.7,
        lifeSteal: 0.06,
        dodgeRate: 0.06,
        thorns: 4,
        speed: 105,
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
