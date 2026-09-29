import Phaser from 'phaser';
import { Hero } from '../entities/Hero';
import { Monster, MonsterConfig, MonsterType, ELITE_AFFIXES } from '../entities/Monster';
import { AudioSystem } from '../systems/AudioSystem';
import { DamageTextManager } from '../systems/DamageTextManager';
import { ParticleSystem } from '../systems/ParticleSystem';
import { SynergyManager, SYNERGY_INFO } from '../systems/SynergySystem';
import { SaveSystem } from '../systems/SaveSystem';
import {
  HeroClass,
  HeroStats,
  DungeonNode,
  PerkCard,
  EquipmentItem,
  SynergyType,
  RelicItem,
  SkillEvolution,
  EliteAffix
} from '../types/game';

export interface BattleSceneInitData {
  hero?: Hero | {
    heroClass: HeroClass;
    stats: HeroStats;
    perks?: PerkCard[];
    equipment?: EquipmentItem[];
    relics?: RelicItem[];
    evolutions?: SkillEvolution[];
  };
  node?: DungeonNode;
  dungeonNodes?: DungeonNode[];
  floor?: number;
  seed?: string;
}

interface SpeedButtonUI {
  container: Phaser.GameObjects.Container;
  bg: Phaser.GameObjects.Rectangle;
  text: Phaser.GameObjects.Text;
  speed: number;
}

export class BattleScene extends Phaser.Scene {
  // Input Data
  private rawHeroData?: BattleSceneInitData['hero'];
  private hero!: Hero;
  private node!: DungeonNode;
  private dungeonNodes: DungeonNode[] = [];
  private floor: number = 1;
  private seed: string = 'VOID-7842';

  // Monsters
  private monsters: Monster[] = [];
  private bossMonster: Monster | null = null;
  private processedKills: Set<Monster> = new Set();

  // Systems
  private audio!: AudioSystem;
  private damageText!: DamageTextManager;
  private particles!: ParticleSystem;

  // Combat State & Speed Controls
  public gameSpeed: number = 1;
  private combatState: 'starting' | 'active' | 'victory' | 'defeat' = 'starting';
  private totalGoldEarned: number = 0;
  private totalSoulsEarned: number = 0;
  private totalExpEarned: number = 0;
  private initialLevel: number = 1;

  // HUD: Hero Info (Top-Left)
  private heroHudContainer!: Phaser.GameObjects.Container;
  private heroClassText!: Phaser.GameObjects.Text;
  private heroHpFill!: Phaser.GameObjects.Rectangle;
  private heroHpText!: Phaser.GameObjects.Text;
  private heroExpFill!: Phaser.GameObjects.Rectangle;
  private heroExpText!: Phaser.GameObjects.Text;
  private goldText!: Phaser.GameObjects.Text;
  private soulsText!: Phaser.GameObjects.Text;

  // HUD: Speed Buttons (Top-Right)
  private speedButtons: SpeedButtonUI[] = [];

  // HUD: Boss Bar (Top-Center)
  private bossBarContainer: Phaser.GameObjects.Container | null = null;
  private bossHpFill: Phaser.GameObjects.Rectangle | null = null;
  private bossHpText: Phaser.GameObjects.Text | null = null;

  // HUD: Active Synergies (Top-Center)
  private synergyContainer!: Phaser.GameObjects.Container;

  // HUD: Relic Bar
  private relicContainer!: Phaser.GameObjects.Container;

  constructor() {
    super('BattleScene');
  }

  public init(data?: BattleSceneInitData): void {
    // Reset runtime properties
    this.monsters = [];
    this.bossMonster = null;
    this.processedKills.clear();
    this.gameSpeed = 1;
    this.combatState = 'starting';
    this.totalGoldEarned = 0;
    this.totalSoulsEarned = 0;
    this.totalExpEarned = 0;
    this.speedButtons = [];
    this.bossBarContainer = null;
    this.bossHpFill = null;
    this.bossHpText = null;

    // Cache input data with dependable fallbacks
    this.rawHeroData = data?.hero;
    this.dungeonNodes = data?.dungeonNodes || [];
    this.floor = data?.floor || data?.node?.floor || 1;
    this.seed = data?.seed || 'VOID-7842';

    if (data?.node) {
      this.node = data.node;
    } else {
      // Default fallback node if launched directly
      this.node = {
        id: 'f1_r0_c0',
        floor: this.floor,
        row: 0,
        col: 0,
        type: 'battle',
        completed: false,
        accessible: true,
        connectedTo: [],
        title: 'Ải Quái Vật',
        description: 'Chiến đấu dọn dẹp bầy quái, nhận Vàng & Điểm Kinh Nghiệm.'
      };
    }
  }

  public create(): void {
    // 1. Systems setup
    this.audio = AudioSystem.getInstance();
    this.damageText = new DamageTextManager(this);
    this.particles = new ParticleSystem(this);

    // 2. Arena setup (Canvas 960x600)
    this.createArenaEnvironment();

    // 3. Hero creation / spawning
    this.spawnHero();

    // 4. Monsters spawning
    this.spawnMonsters();

    // 5. Build HUD & UI Controls
    this.createHeroHUD();
    this.createSpeedControls();
    this.createSynergyHUD();
    this.createRelicBar();
    if (this.bossMonster) {
      this.createBossHUD();
    }

    // 6. Camera Fade-in and combat commencement
    this.cameras.main.fadeIn(400, 0, 0, 0);
    this.time.delayedCall(450, () => {
      this.combatState = 'active';
    });
  }

  // =========================================================================
  // 1. ARENA & ENVIRONMENT
  // =========================================================================
  private createArenaEnvironment(): void {
    const width = 960;
    const height = 600;

    // Sàn đấu theo Tầng (Floor 1: Catacombs, Floor 2: Inferno, Floor 3+: Void)
    const bgKey = this.floor === 1 ? 'bg_catacombs' : this.floor === 2 ? 'bg_inferno' : 'bg_void';
    if (this.textures.exists(bgKey)) {
      const bgImg = this.add.image(width / 2, height / 2, bgKey);
      bgImg.setDepth(0);
    } else {
      const floorTile = this.add.tileSprite(width / 2, height / 2, width, height, 'tile_floor');
      floorTile.setDepth(0);
    }

    // Viền tường (tile_wall: 32x32)
    // Tường trên & dưới
    const topWall = this.add.tileSprite(width / 2, 16, width, 32, 'tile_wall');
    topWall.setDepth(2);
    const bottomWall = this.add.tileSprite(width / 2, height - 16, width, 32, 'tile_wall');
    bottomWall.setDepth(2);

    // Tường trái & phải
    const leftWall = this.add.tileSprite(16, height / 2, 32, height, 'tile_wall');
    leftWall.setDepth(2);
    const rightWall = this.add.tileSprite(width - 16, height / 2, 32, height, 'tile_wall');
    rightWall.setDepth(2);

    // Dark fantasy ambient vignette overlay
    const ambientGraphics = this.add.graphics();
    ambientGraphics.fillStyle(0x0a0814, 0.28);
    ambientGraphics.fillRect(0, 0, width, height);
    ambientGraphics.setDepth(1);

    // Trụ đá trang trí ở các góc chiến trường
    const pillarPositions = [
      { x: 120, y: 55 },
      { x: 840, y: 55 },
      { x: 120, y: 545 },
      { x: 840, y: 545 }
    ];
    for (const pos of pillarPositions) {
      const pillar = this.add.sprite(pos.x, pos.y, 'tile_pillar');
      pillar.setDepth(3);
    }

    // Đuốc bập bùng (torch_flame) ở 4 góc và 2 bên tường
    const torchPositions = [
      { x: 60, y: 56 },   // Góc trên trái
      { x: 900, y: 56 },  // Góc trên phải
      { x: 60, y: 544 },  // Góc dưới trái
      { x: 900, y: 544 }, // Góc dưới phải
      { x: 26, y: 300 },  // Bên tường trái
      { x: 934, y: 300 }, // Bên tường phải
      { x: 480, y: 36 }   // Giữa tường trên
    ];

    for (const pos of torchPositions) {
      // Ánh sáng vàng cam hắt ra từ đuốc
      const lightGlow = this.add.circle(pos.x, pos.y, 32, 0xff7700, 0.16);
      lightGlow.setBlendMode(Phaser.BlendModes.ADD);
      lightGlow.setDepth(3);

      const torch = this.add.sprite(pos.x, pos.y, 'torch_flame');
      torch.setDepth(4);

      // Tween ngọn lửa bập bùng
      this.tweens.add({
        targets: torch,
        alpha: { from: 0.72, to: 1.0 },
        scaleX: { from: 0.9, to: 1.15 },
        scaleY: { from: 0.9, to: 1.25 },
        duration: 120 + Math.random() * 90,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      // Tween quầng sáng
      this.tweens.add({
        targets: lightGlow,
        alpha: { from: 0.1, to: 0.22 },
        scale: { from: 0.85, to: 1.2 },
        duration: 160 + Math.random() * 80,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  // =========================================================================
  // 2. SPAWN HERO & MONSTERS
  // =========================================================================
  private spawnHero(): void {
    let heroClass: HeroClass = 'knight';
    let baseStats: HeroStats = {
      hp: 220,
      maxHp: 220,
      atk: 20,
      def: 15,
      attackSpeed: 1.2,
      critRate: 0.15,
      critDmg: 1.8,
      lifeSteal: 0.05,
      dodgeRate: 0.08,
      thorns: 0,
      speed: 130,
      gold: 0,
      souls: 0,
      level: 1,
      exp: 0,
      maxExp: 60,
      str: 10,
      vit: 10,
      int: 10,
      agi: 10,
      cooldownReduction: 0
    };

    let perks: PerkCard[] = [];
    let equipment: EquipmentItem[] = [];
    let relics: RelicItem[] = [];
    let evolutions: SkillEvolution[] = [];

    if (this.rawHeroData) {
      if (this.rawHeroData instanceof Hero) {
        heroClass = this.rawHeroData.heroClass;
        baseStats = { ...this.rawHeroData.stats };
        perks = [...this.rawHeroData.perks];
        equipment = [...this.rawHeroData.equipment];
        relics = [...this.rawHeroData.relics];
        evolutions = [...this.rawHeroData.evolutions];
      } else {
        if (this.rawHeroData.heroClass) heroClass = this.rawHeroData.heroClass;
        if (this.rawHeroData.stats) baseStats = { ...this.rawHeroData.stats };
        if (this.rawHeroData.perks) perks = [...this.rawHeroData.perks];
        if (this.rawHeroData.equipment) equipment = [...this.rawHeroData.equipment];
        if (this.rawHeroData.relics) relics = [...this.rawHeroData.relics];
        if (this.rawHeroData.evolutions) evolutions = [...this.rawHeroData.evolutions];
      }
    } else {
      // Áp dụng nâng cấp meta nếu khởi tạo mới
      baseStats = SaveSystem.getInstance().applyMetaStats(baseStats);
    }

    // Đặt Hero ở bên trái đấu trường (x: 200, y: 300)
    this.hero = new Hero(this, 200, 300, heroClass, baseStats);
    this.hero.perks = perks;
    this.hero.equipment = equipment;
    this.hero.relics = relics;
    this.hero.evolutions = evolutions;
    this.hero.refreshDerivedStats();
    this.hero.setDepth(25);
    this.initialLevel = this.hero.stats.level;
  }

  private spawnMonsters(): void {
    const floor = this.floor || this.node?.floor || 1;
    const statScale = 1 + (floor - 1) * 0.18;
    const nodeType = this.node?.type || 'battle';

    if (nodeType === 'boss') {
      // 1 Floor Boss monster_boss + 2 Quái xương hộ vệ
      const bossConfig: MonsterConfig = {
        type: 'boss',
        name: `Chúa Tể Hư Vô (Tầng ${floor})`,
        maxHp: Math.round(550 * (1 + (floor - 1) * 0.35)),
        atk: Math.round(28 * (1 + (floor - 1) * 0.25)),
        def: 15,
        speed: 52,
        range: 55,
        attackCooldown: 1.5,
        goldValue: 70 + floor * 15,
        soulValue: 35 + floor * 10,
        isBoss: true,
        floor: floor
      };

      const boss = new Monster(this, 700, 300, bossConfig);
      this.monsters.push(boss);
      this.bossMonster = boss;

      // 2 Quái xương hộ vệ (x: 600, y: 220 & 380)
      const guardConfig1 = this.createRegularMonsterConfig('skeleton', floor, statScale);
      guardConfig1.name = 'Hộ Vệ Hư Vô';
      const guardConfig2 = { ...guardConfig1 };

      const guard1 = new Monster(this, 600, 220, guardConfig1);
      const guard2 = new Monster(this, 600, 380, guardConfig2);
      this.monsters.push(guard1, guard2);

    } else if (nodeType === 'elite') {
      // 1 Tinh anh (golem hoặc necromancer với HP x1.8, ATK x1.4) + 2 quái thường trợ chiến
      const isGolem = Math.random() < 0.5;
      const eliteType: MonsterType = isGolem ? 'golem' : 'necromancer';

      const baseHp = isGolem ? 210 : 160;
      const baseAtk = isGolem ? 23 : 18;

      // Select 1-2 Elite Affixes
      const shuffledAffixes = [...ELITE_AFFIXES].sort(() => Math.random() - 0.5);
      const chosenAffixes = shuffledAffixes.slice(0, Math.random() < 0.4 ? 2 : 1);

      const eliteConfig: MonsterConfig = {
        type: eliteType,
        name: isGolem ? 'Golem Cổ Đại' : 'Pháp Sư Chiêu Hồn',
        maxHp: Math.round(baseHp * statScale * 1.8),
        atk: Math.round(baseAtk * statScale * 1.4),
        def: isGolem ? 18 : 10,
        speed: isGolem ? 45 : 55,
        range: isGolem ? 45 : 140,
        attackCooldown: isGolem ? 1.8 : 2.0,
        goldValue: 35 + floor * 6,
        soulValue: 16 + floor * 3,
        floor: floor,
        affixes: chosenAffixes
      };

      const elite = new Monster(this, 680, 300, eliteConfig);
      this.monsters.push(elite);

      // 2 quái thường trợ chiến
      const minionTypes: MonsterType[] = ['skeleton', 'imp', 'slime'];
      for (let i = 0; i < 2; i++) {
        const mType = minionTypes[Math.floor(Math.random() * minionTypes.length)];
        const mConfig = this.createRegularMonsterConfig(mType, floor, statScale);
        const yPos = i === 0 ? 210 : 390;
        const xPos = 580 + (Math.random() * 30 - 15);
        const minion = new Monster(this, xPos, yPos, mConfig);
        this.monsters.push(minion);
      }

    } else {
      // Phòng thường: Spawn 3 - 5 quái vật thường (skeleton, slime, imp)
      const count = Math.min(5, 3 + Math.floor((floor - 1) / 2));
      const pool: MonsterType[] = ['skeleton', 'slime', 'imp'];

      const spawnCoords: { x: number; y: number }[] = [];
      if (count === 3) {
        spawnCoords.push({ x: 590, y: 230 }, { x: 730, y: 300 }, { x: 600, y: 370 });
      } else if (count === 4) {
        spawnCoords.push({ x: 580, y: 210 }, { x: 720, y: 230 }, { x: 590, y: 380 }, { x: 740, y: 370 });
      } else {
        spawnCoords.push(
          { x: 570, y: 190 },
          { x: 680, y: 230 },
          { x: 760, y: 300 },
          { x: 680, y: 370 },
          { x: 570, y: 410 }
        );
      }

      for (let i = 0; i < count; i++) {
        const mType = pool[i % pool.length];
        const mConfig = this.createRegularMonsterConfig(mType, floor, statScale);
        const coord = spawnCoords[i] || { x: 600 + i * 35, y: 200 + i * 45 };
        const jitterX = Math.random() * 20 - 10;
        const jitterY = Math.random() * 20 - 10;

        const monster = new Monster(this, coord.x + jitterX, coord.y + jitterY, mConfig);
        this.monsters.push(monster);
      }
    }
  }

  private createRegularMonsterConfig(type: MonsterType, floor: number, statScale: number): MonsterConfig {
    switch (type) {
      case 'slime':
        return {
          type: 'slime',
          name: 'Quái Chất Nhầy',
          maxHp: Math.round(62 * statScale),
          atk: Math.round(9 * statScale),
          def: 3,
          speed: 50,
          range: 32,
          attackCooldown: 1.0,
          goldValue: 6 + floor * 2,
          soulValue: 2,
          floor: floor
        };
      case 'imp':
        return {
          type: 'imp',
          name: 'Tiểu Quỷ Hư Vô',
          maxHp: Math.round(52 * statScale),
          atk: Math.round(13 * statScale),
          def: 0,
          speed: 75,
          range: 130,
          attackCooldown: 1.6,
          goldValue: 9 + floor * 2,
          soulValue: 3 + Math.floor(floor / 2),
          floor: floor
        };
      case 'skeleton':
      default:
        return {
          type: 'skeleton',
          name: 'Chiến Binh Xương',
          maxHp: Math.round(76 * statScale),
          atk: Math.round(11 * statScale),
          def: 6,
          speed: 65,
          range: 38,
          attackCooldown: 1.3,
          goldValue: 7 + floor * 2,
          soulValue: 2 + Math.floor(floor / 2),
          floor: floor
        };
    }
  }

  // =========================================================================
  // 3. UI HUD & CONTROLS
  // =========================================================================
  private createHeroHUD(): void {
    this.heroHudContainer = this.add.container(20, 16);
    this.heroHudContainer.setDepth(100);

    const classNames: Record<HeroClass, string> = {
      knight: 'Huyết Hiệp Sĩ',
      mage: 'Phù Thủy Hư Vô',
      rogue: 'Sát Thủ Bóng Đêm'
    };

    // Hero Class & Level Text
    const classNameStr = classNames[this.hero.heroClass] || 'Chiến Binh';
    this.heroClassText = this.add.text(0, 0, `${classNameStr} - Lv.${this.hero.stats.level}`, {
      fontFamily: 'sans-serif',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#e2e8f0',
      stroke: '#000000',
      strokeThickness: 3
    });
    this.heroHudContainer.add(this.heroClassText);

    // HP Bar Frame & Fill
    const barWidth = 170;
    const hpY = 24;
    const hpBarBg = this.add.rectangle(0, hpY, barWidth, 13, 0x161220);
    hpBarBg.setOrigin(0, 0.5);
    hpBarBg.setStrokeStyle(1.5, 0x3d3356);

    this.heroHpFill = this.add.rectangle(0, hpY, barWidth, 13, 0x22c55e);
    this.heroHpFill.setOrigin(0, 0.5);

    this.heroHpText = this.add.text(barWidth / 2, hpY, `${Math.ceil(this.hero.stats.hp)} / ${this.hero.stats.maxHp} HP`, {
      fontFamily: 'sans-serif',
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2.5
    }).setOrigin(0.5);

    this.heroHudContainer.add([hpBarBg, this.heroHpFill, this.heroHpText]);

    // EXP Bar Frame & Fill
    const expY = 41;
    const expBarBg = this.add.rectangle(0, expY, barWidth, 8, 0x0f172a);
    expBarBg.setOrigin(0, 0.5);
    expBarBg.setStrokeStyle(1, 0x1e293b);

    this.heroExpFill = this.add.rectangle(0, expY, 0, 8, 0x3b82f6);
    this.heroExpFill.setOrigin(0, 0.5);

    this.heroExpText = this.add.text(barWidth / 2, expY, `EXP: ${this.hero.stats.exp} / ${this.hero.stats.maxExp}`, {
      fontFamily: 'sans-serif',
      fontSize: '8px',
      fontStyle: 'bold',
      color: '#93c5fd',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    this.heroHudContainer.add([expBarBg, this.heroExpFill, this.heroExpText]);

    // Currency Row: Gold & Souls
    const currY = 56;
    const goldIcon = this.add.sprite(8, currY + 6, 'icon_gold');
    goldIcon.setScale(0.55);

    this.goldText = this.add.text(22, currY, `${this.hero.stats.gold}`, {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#ecc94b',
      stroke: '#000000',
      strokeThickness: 2.5
    });

    const soulIcon = this.add.sprite(90, currY + 6, 'icon_soul');
    soulIcon.setScale(0.55);

    this.soulsText = this.add.text(104, currY, `${this.hero.stats.souls}`, {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#c084fc',
      stroke: '#000000',
      strokeThickness: 2.5
    });

    this.heroHudContainer.add([goldIcon, this.goldText, soulIcon, this.soulsText]);
  }

  private createSpeedControls(): void {
    const speeds = [1, 2, 3];
    const btnWidth = 44;
    const btnHeight = 26;
    const startX = 810;
    const y = 28;

    speeds.forEach((speed, idx) => {
      const x = startX + idx * (btnWidth + 8);
      const container = this.add.container(x, y);
      container.setDepth(100);

      const isActive = this.gameSpeed === speed;
      const bg = this.add.rectangle(0, 0, btnWidth, btnHeight, isActive ? 0x2d2448 : 0x161424);
      bg.setStrokeStyle(isActive ? 2 : 1, isActive ? 0xf6e05e : 0x475569);

      const text = this.add.text(0, 0, `${speed}x`, {
        fontFamily: 'sans-serif',
        fontSize: '12px',
        fontStyle: 'bold',
        color: isActive ? '#ffd700' : '#94a3b8'
      }).setOrigin(0.5);

      bg.setInteractive({ useHandCursor: true });

      bg.on('pointerover', () => {
        if (this.gameSpeed !== speed) {
          bg.setFillStyle(0x221d38);
        }
      });

      bg.on('pointerout', () => {
        if (this.gameSpeed !== speed) {
          bg.setFillStyle(0x161424);
        }
      });

      bg.on('pointerdown', () => {
        this.setGameSpeed(speed);
      });

      container.add([bg, text]);
      this.speedButtons.push({ container, bg, text, speed });
    });

    // Hiển thị Seed định danh màn chơi
    this.add.text(860, 56, `🎲 SEED: ${this.seed}`, {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#94a3b8',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(100);
  }

  private createRelicBar(): void {
    this.relicContainer = this.add.container(20, 84);
    this.relicContainer.setDepth(100);
    this.updateRelicBar();
  }

  private updateRelicBar(): void {
    this.relicContainer.removeAll(true);
    if (!this.hero.relics || this.hero.relics.length === 0) return;

    const label = this.add.text(0, 0, 'CỔ VẬT:', {
      fontFamily: 'sans-serif',
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#cbd5e1',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0, 0.5);
    this.relicContainer.add(label);

    const startX = 54;
    const spacing = 22;
    this.hero.relics.slice(0, 8).forEach((relic, idx) => {
      const icon = this.add.sprite(startX + idx * spacing, 0, relic.icon || 'icon_fire');
      icon.setScale(0.55);
      this.relicContainer.add(icon);
    });
  }

  private setGameSpeed(speed: number): void {
    this.gameSpeed = speed;
    this.audio.playClick();

    for (const btn of this.speedButtons) {
      const active = btn.speed === speed;
      btn.bg.setFillStyle(active ? 0x2d2448 : 0x161424);
      btn.bg.setStrokeStyle(active ? 2 : 1, active ? 0xf6e05e : 0x475569);
      btn.text.setColor(active ? '#ffd700' : '#94a3b8');
      btn.text.setFontSize(active ? '13px' : '12px');
    }
  }

  private createBossHUD(): void {
    if (!this.bossMonster) return;

    this.bossBarContainer = this.add.container(480, 24);
    this.bossBarContainer.setDepth(100);

    const floor = this.floor || this.node?.floor || 1;
    const titleText = this.add.text(0, 0, `👑 CHÚA TỂ HƯ VÔ - TẦNG ${floor} 👑`, {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#f87171',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    const barWidth = 420;
    const barHeight = 14;
    const barY = 17;

    const bgBar = this.add.rectangle(0, barY, barWidth, barHeight, 0x110d18);
    bgBar.setStrokeStyle(1.5, 0x9f7aea);

    this.bossHpFill = this.add.rectangle(-barWidth / 2, barY, barWidth, barHeight, 0xd92652);
    this.bossHpFill.setOrigin(0, 0.5);

    this.bossHpText = this.add.text(0, barY, `${this.bossMonster.hp} / ${this.bossMonster.maxHp}`, {
      fontFamily: 'sans-serif',
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2.5
    }).setOrigin(0.5);

    this.bossBarContainer.add([titleText, bgBar, this.bossHpFill, this.bossHpText]);
  }

  private createSynergyHUD(): void {
    const y = this.bossMonster ? 58 : 28;
    this.synergyContainer = this.add.container(480, y);
    this.synergyContainer.setDepth(99);

    this.updateSynergyDisplay();
  }

  private updateSynergyDisplay(): void {
    this.synergyContainer.removeAll(true);

    const synergies = SynergyManager.getSynergyCount(this.hero.perks, this.hero.equipment);
    const active = (Object.keys(synergies) as SynergyType[]).filter((k) => synergies[k] > 0);

    if (active.length === 0) return;

    const iconSpacing = 50;
    const totalWidth = active.length * iconSpacing;
    const startX = -totalWidth / 2 + iconSpacing / 2;

    const synergyIconMap: Record<SynergyType, string> = {
      fire: 'icon_fire',
      frost: 'icon_frost',
      lightning: 'icon_lightning',
      vampiric: 'icon_vampire',
      thorns: 'icon_thorns',
      summoner: 'icon_summon'
    };

    active.forEach((syn, index) => {
      const x = startX + index * iconSpacing;
      const iconKey = synergyIconMap[syn];

      const iconSprite = this.add.sprite(x - 8, 0, iconKey);
      iconSprite.setScale(0.65);

      const count = synergies[syn];
      const countText = this.add.text(x + 10, 0, `x${count}`, {
        fontFamily: 'sans-serif',
        fontSize: '11px',
        fontStyle: 'bold',
        color: SYNERGY_INFO[syn]?.color || '#ffffff',
        stroke: '#000000',
        strokeThickness: 2.5
      }).setOrigin(0, 0.5);

      this.synergyContainer.add([iconSprite, countText]);
    });
  }

  // =========================================================================
  // 4. MAIN COMBAT LOOP (UPDATE)
  // =========================================================================
  public update(time: number, delta: number): void {
    if (this.combatState !== 'active') return;

    // Tùy chỉnh tốc độ trận đánh
    const effectiveDelta = delta * this.gameSpeed;

    // Cập nhật Hero AI & Action
    this.hero.updateHero(effectiveDelta, this.monsters, (killedMonster) => {
      this.handleMonsterKilled(killedMonster);
    });

    // Cập nhật từng Quái vật
    for (const monster of this.monsters) {
      if (!monster.isDead) {
        monster.updateMonster(time, effectiveDelta, this.hero.x, this.hero.y, (atk) => {
          if (this.hero.isDead) return;
          const result = this.hero.takeDamage(atk, monster);
          this.audio.playHit();
          this.cameras.main.shake(70, 0.0035 * this.gameSpeed);

          if (result.isDead) {
            this.handleHeroDefeat();
          }
        }, (aoeX, aoeY, radius, dmg) => {
          // Boss AoE telegraph hit
          if (this.hero.isDead) return;
          this.particles.createFireExplosion(aoeX, aoeY, radius);
          const dist = Phaser.Math.Distance.Between(aoeX, aoeY, this.hero.x, this.hero.y);
          if (dist <= radius) {
            const result = this.hero.takeDamage(dmg, monster);
            this.audio.playHit();
            this.cameras.main.shake(160, 0.015 * this.gameSpeed);
            if (result.isDead) {
              this.handleHeroDefeat();
            }
          }
        });
      } else {
        // Nếu quái chết bởi hiệu ứng độc/lửa/thorns
        this.handleMonsterKilled(monster);
      }
    }

    // Kiểm tra Hero còn sống
    if (this.hero.isDead || this.hero.stats.hp <= 0) {
      this.handleHeroDefeat();
      return;
    }

    // Kiểm tra tất cả quái vật đã bị tiêu diệt
    const aliveMonsters = this.monsters.filter((m) => !m.isDead && m.active);
    if (aliveMonsters.length === 0 && this.combatState === 'active') {
      this.handleVictory();
      return;
    }

    // Làm mới UI HUD mỗi khung hình
    this.updateHUD();
  }

  private updateHUD(): void {
    // 1. Hero HP
    const hpRatio = Math.max(0, this.hero.stats.hp / this.hero.stats.maxHp);
    const barWidth = 170;
    this.heroHpFill.width = barWidth * hpRatio;
    this.heroHpText.setText(`${Math.ceil(this.hero.stats.hp)} / ${this.hero.stats.maxHp} HP`);

    // Đổi màu thanh máu khi máu yếu (< 25%)
    if (hpRatio < 0.25) {
      this.heroHpFill.setFillStyle(0xef4444);
    } else {
      this.heroHpFill.setFillStyle(0x22c55e);
    }

    // 2. Hero EXP
    const expRatio = Math.min(1, Math.max(0, this.hero.stats.exp / this.hero.stats.maxExp));
    this.heroExpFill.width = barWidth * expRatio;
    this.heroExpText.setText(`EXP: ${this.hero.stats.exp} / ${this.hero.stats.maxExp}`);

    // 3. Hero Class Text (Level có thể tăng trong trận)
    const classNames: Record<HeroClass, string> = {
      knight: 'Huyết Hiệp Sĩ',
      mage: 'Phù Thủy Hư Vô',
      rogue: 'Sát Thủ Bóng Đêm'
    };
    this.heroClassText.setText(`${classNames[this.hero.heroClass]} - Lv.${this.hero.stats.level}`);

    // 4. Gold & Souls
    this.goldText.setText(`${this.hero.stats.gold}`);
    this.soulsText.setText(`${this.hero.stats.souls}`);

    // 5. Boss Bar
    if (this.bossMonster && this.bossHpFill && this.bossHpText) {
      if (this.bossMonster.isDead) {
        this.bossHpFill.width = 0;
        this.bossHpText.setText('ĐÃ TIÊU DIỆT');
      } else {
        const bossRatio = Math.max(0, this.bossMonster.hp / this.bossMonster.maxHp);
        this.bossHpFill.width = 420 * bossRatio;
        this.bossHpText.setText(`${Math.ceil(this.bossMonster.hp)} / ${this.bossMonster.maxHp}`);
      }
    }
  }

  // =========================================================================
  // 5. PHẦN THƯỞNG KHI QUÁI CHẾT & THĂNG CẤP
  // =========================================================================
  private handleMonsterKilled(m: Monster): void {
    if (this.processedKills.has(m)) return;
    this.processedKills.add(m);

    // Volatile affix death explosion: deals 45 damage in 90px radius
    if (m.affixes && m.affixes.some((a) => a.type === 'volatile')) {
      this.particles.createFireExplosion(m.x, m.y, 90);
      this.cameras.main.shake(150, 0.012 * this.gameSpeed);
      this.audio.playHit();

      const boomText = this.add.text(m.x, m.y - 25, '💥 BỘC PHÁ! 💥', {
        fontFamily: 'sans-serif',
        fontSize: '13px',
        fontStyle: 'bold',
        color: '#ff4444',
        stroke: '#000000',
        strokeThickness: 3
      }).setOrigin(0.5).setDepth(110);

      this.tweens.add({
        targets: boomText,
        y: m.y - 50,
        alpha: 0,
        duration: 800,
        onComplete: () => boomText.destroy()
      });

      const distToHero = Phaser.Math.Distance.Between(m.x, m.y, this.hero.x, this.hero.y);
      if (distToHero <= 90 && !this.hero.isDead) {
        const res = this.hero.takeDamage(45, m);
        if (res.isDead) {
          this.handleHeroDefeat();
          return;
        }
      }
    }

    const gold = m.monsterConfig.goldValue;
    const souls = m.monsterConfig.soulValue;
    const exp = m.isBoss ? 130 : (m.monsterConfig.type === 'golem' || m.monsterConfig.type === 'necromancer' ? 50 : 20);

    // Cộng thưởng cho hero
    this.hero.stats.gold += gold;
    this.hero.stats.souls += souls;
    this.hero.stats.exp += exp;

    this.totalGoldEarned += gold;
    this.totalSoulsEarned += souls;
    this.totalExpEarned += exp;

    // Âm thanh nhặt vàng
    this.audio.playCoin();

    // Hiệu ứng chữ nổi phần thưởng
    this.showRewardPopup(m.x, m.y - 15, gold, souls, exp);

    // Kiểm tra thăng cấp
    while (this.hero.stats.exp >= this.hero.stats.maxExp) {
      this.hero.stats.exp -= this.hero.stats.maxExp;
      this.hero.stats.level++;
      this.hero.stats.maxExp = Math.round(this.hero.stats.maxExp * 1.5);

      // Thưởng chỉ số khi lên cấp
      this.hero.stats.maxHp += 16;
      this.hero.stats.hp = Math.min(this.hero.stats.maxHp, this.hero.stats.hp + 16);
      this.hero.stats.atk += 3;
      this.hero.stats.def = Math.min(60, this.hero.stats.def + 1);

      this.audio.playLevelUp();
      this.showLevelUpNotification(this.hero.stats.level);
    }
  }

  private showRewardPopup(x: number, y: number, gold: number, souls: number, exp: number): void {
    const textStr = `+${gold}G  +${exp}XP`;
    const popup = this.add.text(x, y, textStr, {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#f6e05e',
      stroke: '#000000',
      strokeThickness: 2.5
    }).setOrigin(0.5);
    popup.setDepth(110);

    this.tweens.add({
      targets: popup,
      y: y - 28,
      alpha: 0,
      duration: 800,
      ease: 'Quad.easeOut',
      onComplete: () => popup.destroy()
    });
  }

  private showLevelUpNotification(newLevel: number): void {
    const notifyText = this.add.text(this.hero.x, this.hero.y - 45, `⭐ LÊN CẤP! Lv.${newLevel} ⭐`, {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#38ef7d',
      stroke: '#002211',
      strokeThickness: 3.5
    }).setOrigin(0.5);
    notifyText.setDepth(120);

    this.particles.createHitSparks(this.hero.x, this.hero.y - 20, 0x38ef7d);

    this.tweens.add({
      targets: notifyText,
      y: this.hero.y - 75,
      scale: 1.25,
      alpha: 0,
      duration: 1200,
      ease: 'Back.easeOut',
      onComplete: () => notifyText.destroy()
    });
  }

  // =========================================================================
  // 6. KẾT THÚC TRẬN ĐÁNH (VICTORY & DEFEAT)
  // =========================================================================
  private handleVictory(): void {
    if (this.combatState !== 'active') return;
    this.combatState = 'victory';

    // Âm thanh chiến thắng
    this.audio.playVictory();

    // Cập nhật trạng thái Node trong bản đồ hầm ngục
    if (this.node) {
      this.node.completed = true;
      if (this.dungeonNodes.length > 0) {
        for (const nextId of this.node.connectedTo) {
          const nextNode = this.dungeonNodes.find((n) => n.id === nextId);
          if (nextNode) {
            nextNode.accessible = true;
          }
        }
      }
    }

    // Lưu linh hồn vào kho vĩnh viễn (SaveSystem)
    if (this.totalSoulsEarned > 0) {
      SaveSystem.getInstance().addSouls(this.totalSoulsEarned);
    }

    // Nếu vừa đánh bại Boss của tầng, ghi nhận chiến thắng
    if (this.node.type === 'boss') {
      SaveSystem.getInstance().recordRun(this.node.floor, true);
    }

    // Pháo hoa / tia lửa tán dương quanh Hero
    for (let i = 0; i < 4; i++) {
      this.time.delayedCall(i * 180, () => {
        this.particles.createHitSparks(
          this.hero.x + (Math.random() * 50 - 25),
          this.hero.y + (Math.random() * 50 - 25),
          0xffd700
        );
      });
    }

    // Hiển thị Banner CHIẾN THẮNG
    this.showVictoryModal();

    // Tự động chuyển cảnh sau 1.2 giây
    this.time.delayedCall(1200, () => {
      this.transitionToRewardScene();
    });
  }

  private showVictoryModal(): void {
    const modalContainer = this.add.container(480, 300);
    modalContainer.setDepth(200);

    // Khung viền kính mờ
    const bg = this.add.rectangle(0, 0, 420, 220, 0x0c0a18, 0.9);
    bg.setStrokeStyle(2.5, 0xf6e05e);

    // Tiêu đề
    const title = this.add.text(0, -68, '⚔️ CHIẾN THẮNG! ⚔️', {
      fontFamily: 'sans-serif',
      fontSize: '26px',
      fontStyle: 'bold',
      color: '#ffd700',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    const sub = this.add.text(0, -36, `Đã chinh phục thành công ${this.node.title}`, {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#cbd5e1'
    }).setOrigin(0.5);

    // Danh sách phần thưởng
    const rewardBox = this.add.container(0, 10);
    const r1 = this.add.text(-120, -10, `🪙 Vàng: +${this.totalGoldEarned}`, {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#ecc94b'
    });
    const r2 = this.add.text(20, -10, `🔮 Linh Hồn: +${this.totalSoulsEarned}`, {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#c084fc'
    });
    const r3 = this.add.text(-120, 16, `⚡ Kinh Nghiệm: +${this.totalExpEarned}`, {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#60a5fa'
    });

    const levelDiff = this.hero.stats.level - this.initialLevel;
    const r4 = this.add.text(20, 16, levelDiff > 0 ? `⭐ Lên ${levelDiff} Cấp!` : `⭐ Cấp: Lv.${this.hero.stats.level}`, {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#34d399'
    });

    rewardBox.add([r1, r2, r3, r4]);

    // Gợi ý chuyển tiếp
    const tip = this.add.text(0, 75, 'Đang chuẩn bị nhận thưởng...', {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      fontStyle: 'italic',
      color: '#94a3b8'
    }).setOrigin(0.5);

    modalContainer.add([bg, title, sub, rewardBox, tip]);

    // Animation nảy nhẹ
    modalContainer.setScale(0.8);
    modalContainer.setAlpha(0);
    this.tweens.add({
      targets: modalContainer,
      scale: 1,
      alpha: 1,
      duration: 250,
      ease: 'Back.easeOut'
    });
  }

  private transitionToRewardScene(): void {
    this.cameras.main.fade(350, 0, 0, 0);
    this.time.delayedCall(350, () => {
      this.scene.start('RewardScene', {
        hero: this.hero,
        node: this.node,
        dungeonNodes: this.dungeonNodes,
        floor: this.floor,
        seed: this.seed,
        rewards: {
          gold: this.totalGoldEarned,
          souls: this.totalSoulsEarned,
          exp: this.totalExpEarned
        }
      });
    });
  }

  private handleHeroDefeat(): void {
    if (this.combatState === 'defeat') return;
    this.combatState = 'defeat';

    // Âm thanh thất bại
    this.audio.playDefeat();

    // Rung camera
    this.cameras.main.shake(550, 0.018);

    // Ghi nhận run thất bại
    SaveSystem.getInstance().recordRun(this.floor, false);

    // Hiển thị Banner THẤT BẠI
    this.showDefeatModal();

    // Sau 1.5 giây, chuyển sang GameOverScene
    this.time.delayedCall(1500, () => {
      this.cameras.main.fade(450, 15, 0, 0);
      this.time.delayedCall(450, () => {
        this.scene.start('GameOverScene', {
          floor: this.floor,
          hero: this.hero,
          node: this.node,
          soulsCollected: this.totalSoulsEarned
        });
      });
    });
  }

  private showDefeatModal(): void {
    const modalContainer = this.add.container(480, 300);
    modalContainer.setDepth(200);

    const bg = this.add.rectangle(0, 0, 420, 180, 0x18080c, 0.92);
    bg.setStrokeStyle(2, 0xd92652);

    const title = this.add.text(0, -45, '💀 BẠN ĐÃ HY SINH... 💀', {
      fontFamily: 'sans-serif',
      fontSize: '25px',
      fontStyle: 'bold',
      color: '#ef4444',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    const sub = this.add.text(0, -8, 'Bóng tối vực sâu đã nuốt chửng linh hồn dũng giả.', {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#cbd5e1'
    }).setOrigin(0.5);

    const soulsInfo = this.add.text(0, 24, `Linh Hồn thu thập được: +${this.totalSoulsEarned}`, {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#c084fc'
    }).setOrigin(0.5);

    const tip = this.add.text(0, 58, 'Đang quay về đền thờ linh hồn...', {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      fontStyle: 'italic',
      color: '#94a3b8'
    }).setOrigin(0.5);

    modalContainer.add([bg, title, sub, soulsInfo, tip]);

    modalContainer.setAlpha(0);
    this.tweens.add({
      targets: modalContainer,
      alpha: 1,
      duration: 300
    });
  }
}
