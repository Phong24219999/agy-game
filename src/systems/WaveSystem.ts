import Phaser from 'phaser';
import { DungeonNodeType, EliteAffix, MonsterDebuffEffect } from '../types/game';
import { Monster, MonsterConfig, MonsterType, ELITE_AFFIXES } from '../entities/Monster';
import { SeededRNG } from './SeededRNG';
import { AudioSystem } from './AudioSystem';

export interface WaveMonsterSpawn {
  type: MonsterType;
  x?: number;
  y?: number;
  isElite?: boolean;
  isBoss?: boolean;
  affixes?: EliteAffix[];
  name?: string;
  customConfig?: Partial<MonsterConfig>;
  debuffs?: MonsterDebuffEffect[];
}

export interface WaveConfig {
  waveNumber: number;
  totalWaves: number;
  title: string;
  subtitle?: string;
  isBossWave?: boolean;
  isEliteWave?: boolean;
  isWarning?: boolean;
  monsters: WaveMonsterSpawn[];
  spawnDelayMs?: number;
}

export class WaveSystem {
  private scene: Phaser.Scene;
  private waves: WaveConfig[] = [];
  private currentWaveIndex: number = -1;
  private activeMonsters: Monster[] = [];
  private isSpawningWave: boolean = false;
  private isCompleted: boolean = false;

  private onSpawnCallback: (spawn: WaveMonsterSpawn) => Monster;
  private onWaveStartCallback?: (wave: WaveConfig) => void;
  private onAllWavesClearedCallback?: () => void;

  constructor(
    scene: Phaser.Scene,
    waves: WaveConfig[],
    onSpawn: (spawn: WaveMonsterSpawn) => Monster,
    onWaveStart?: (wave: WaveConfig) => void,
    onAllWavesCleared?: () => void
  ) {
    this.scene = scene;
    this.waves = waves;
    this.onSpawnCallback = onSpawn;
    this.onWaveStartCallback = onWaveStart;
    this.onAllWavesClearedCallback = onAllWavesCleared;
  }

  // =========================================================================
  // WAVE GENERATOR
  // =========================================================================
  public static generateBattleWaves(
    floor: number,
    nodeType: DungeonNodeType,
    seed?: string
  ): WaveConfig[] {
    const rng = new SeededRNG(seed ? `${seed}-F${floor}-${nodeType}` : undefined);
    const waves: WaveConfig[] = [];

    // Coordinates pool for monsters in the right side of arena (X: 560 - 780, Y: 180 - 430)
    const getSpawnCoords = (count: number): { x: number; y: number }[] => {
      const coords: { x: number; y: number }[] = [];
      if (count === 1) {
        coords.push({ x: 680, y: 300 });
      } else if (count === 2) {
        coords.push({ x: 640, y: 220 }, { x: 640, y: 380 });
      } else if (count === 3) {
        coords.push({ x: 590, y: 220 }, { x: 730, y: 300 }, { x: 590, y: 380 });
      } else if (count === 4) {
        coords.push({ x: 580, y: 200 }, { x: 720, y: 230 }, { x: 580, y: 400 }, { x: 720, y: 370 });
      } else {
        coords.push(
          { x: 570, y: 190 },
          { x: 680, y: 220 },
          { x: 750, y: 300 },
          { x: 680, y: 380 },
          { x: 570, y: 410 }
        );
      }
      return coords;
    };

    // Helper to select random items
    const pickRandom = <T>(arr: T[]): T => arr[Math.floor(rng.nextFloat() * arr.length)];
    const pickMultiple = <T>(arr: T[], n: number): T[] => {
      const copy = [...arr].sort(() => rng.nextFloat() - 0.5);
      return copy.slice(0, n);
    };

    // -----------------------------------------------------------------------
    // 1. PHÒNG THƯỜNG (BATTLE): 2 ĐỢT
    // Wave 1: Tiền trạm / Quân tiên phong (3-4 quái)
    // Wave 2: Viện binh tinh nhuệ (3-5 quái gồm xạ thủ / quái áp sát nhanh)
    // -----------------------------------------------------------------------
    if (nodeType === 'battle') {
      let vanguardPool: MonsterType[];
      let reinforcementPool: MonsterType[];
      let fastOrRangedPool: MonsterType[];

      if (floor === 1) {
        vanguardPool = ['skeleton', 'slime'];
        reinforcementPool = ['skeleton', 'slime', 'ghoul', 'skeleton_archer'];
        fastOrRangedPool = ['skeleton_archer', 'ghoul'];
      } else if (floor === 2) {
        vanguardPool = ['cultist', 'hellhound'];
        reinforcementPool = ['cultist', 'hellhound', 'imp'];
        fastOrRangedPool = ['imp', 'hellhound'];
      } else {
        vanguardPool = ['stalker', 'tentacle'];
        reinforcementPool = ['stalker', 'tentacle', 'void_eye', 'necromancer'];
        fastOrRangedPool = ['void_eye', 'stalker'];
      }

      // Wave 1: 3-4 quái tiên phong
      const wave1Count = rng.nextFloat() < 0.5 ? 3 : 4;
      const wave1Coords = getSpawnCoords(wave1Count);
      const wave1Monsters: WaveMonsterSpawn[] = [];

      for (let i = 0; i < wave1Count; i++) {
        const mType = pickRandom(vanguardPool);
        const coord = wave1Coords[i];
        wave1Monsters.push({
          type: mType,
          x: coord.x + Math.round((rng.nextFloat() - 0.5) * 20),
          y: coord.y + Math.round((rng.nextFloat() - 0.5) * 20)
        });
      }

      waves.push({
        waveNumber: 1,
        totalWaves: 2,
        title: 'ĐỢT 1/2: TIỀN TRẠM TIÊN PHONG',
        subtitle: 'Dọn dẹp toán lính tiên phong để khai thông lộ trình!',
        isWarning: false,
        monsters: wave1Monsters,
        spawnDelayMs: 250
      });

      // Wave 2: 3-5 viện binh tinh nhuệ với hỏa lực tầm xa + quái áp sát nhanh
      const wave2Count = floor === 1 ? (rng.nextFloat() < 0.6 ? 4 : 3) : (rng.nextFloat() < 0.4 ? 4 : 5);
      const wave2Coords = getSpawnCoords(wave2Count);
      const wave2Monsters: WaveMonsterSpawn[] = [];

      for (let i = 0; i < wave2Count; i++) {
        // Đảm bảo có ít nhất 2 quái tầm xa hoặc cơ động áp sát cao
        const mType = i < 2 ? pickRandom(fastOrRangedPool) : pickRandom(reinforcementPool);
        const coord = wave2Coords[i];
        wave2Monsters.push({
          type: mType,
          x: coord.x + Math.round((rng.nextFloat() - 0.5) * 24),
          y: coord.y + Math.round((rng.nextFloat() - 0.5) * 24)
        });
      }

      waves.push({
        waveNumber: 2,
        totalWaves: 2,
        title: '⚠️ ĐỢT 2/2: VIỆN BINH XUNG PHONG! ⚠️',
        subtitle: 'Viện binh tinh nhuệ với hỏa lực xạ kích và quái cơ động tốc chiến!',
        isWarning: true,
        monsters: wave2Monsters,
        spawnDelayMs: 200
      });

      return waves;
    }

    // -----------------------------------------------------------------------
    // 2. PHÒNG TINH ANH (ELITE): 2 ĐỢT
    // Wave 1: Đội bảo vệ cảnh giác (3 quái)
    // Wave 2: Quái Tinh Anh Chỉ Huy khổng lồ với 2 Affixes nguy hiểm + 2 hộ vệ trợ chiến
    // -----------------------------------------------------------------------
    if (nodeType === 'elite') {
      let guardPool: MonsterType[];
      let elitePool: MonsterType[];
      let eliteMinionPool: MonsterType[];

      if (floor === 1) {
        guardPool = ['skeleton', 'slime', 'skeleton_archer'];
        elitePool = ['ghoul', 'skeleton_archer'];
        eliteMinionPool = ['skeleton', 'skeleton_archer'];
      } else if (floor === 2) {
        guardPool = ['cultist', 'imp', 'hellhound'];
        elitePool = ['golem', 'cultist'];
        eliteMinionPool = ['imp', 'hellhound'];
      } else {
        guardPool = ['void_eye', 'stalker', 'tentacle'];
        elitePool = ['necromancer', 'stalker'];
        eliteMinionPool = ['void_eye', 'stalker'];
      }

      // Wave 1: Đội bảo vệ cảnh giác (3 quái)
      const guardCoords = getSpawnCoords(3);
      const wave1Monsters: WaveMonsterSpawn[] = [];
      for (let i = 0; i < 3; i++) {
        const mType = pickRandom(guardPool);
        wave1Monsters.push({
          type: mType,
          x: guardCoords[i].x,
          y: guardCoords[i].y,
          name: `Vệ Binh ${i + 1}`
        });
      }

      waves.push({
        waveNumber: 1,
        totalWaves: 2,
        title: 'ĐỢT 1/2: ĐỘI BẢO VỆ CẢNH GIÁC',
        subtitle: 'Thanh trừng tuyến bảo vệ tiền tiêu trước khi Thủ Lĩnh thức tỉnh!',
        isWarning: false,
        isEliteWave: false,
        monsters: wave1Monsters,
        spawnDelayMs: 300
      });

      // Wave 2: Quái Tinh Anh Chỉ Huy Khổng Lồ với 2 Affixes + 2 Hộ Vệ
      const eliteType = pickRandom(elitePool);
      const chosenAffixes = pickMultiple(ELITE_AFFIXES, 2); // 2 Affixes nguy hiểm

      const wave2Monsters: WaveMonsterSpawn[] = [
        // 1. Chỉ huy Tinh Anh khổng lồ ở trung tâm
        {
          type: eliteType,
          x: 690,
          y: 300,
          isElite: true,
          affixes: chosenAffixes,
          name: `Thủ Lĩnh Tinh Anh`,
          customConfig: {
            floor: floor
          }
        },
        // 2. Hộ vệ cận vệ 1 (ở trên)
        {
          type: pickRandom(eliteMinionPool),
          x: 580,
          y: 210,
          name: `Hộ Vệ Tinh Nhuệ 1`
        },
        // 3. Hộ vệ cận vệ 2 (ở dưới)
        {
          type: pickRandom(eliteMinionPool),
          x: 580,
          y: 390,
          name: `Hộ Vệ Tinh Nhuệ 2`
        }
      ];

      waves.push({
        waveNumber: 2,
        totalWaves: 2,
        title: '⚠️ ĐỢT 2/2: THỦ LĨNH TINH ANH XUẤT HIỆN! ⚠️',
        subtitle: `Thủ Lĩnh Tinh Anh mang 2 Dị Biến [${chosenAffixes.map(a => a.name).join(' + ')}] cùng Hộ Vệ!`,
        isWarning: true,
        isEliteWave: true,
        monsters: wave2Monsters,
        spawnDelayMs: 250
      });

      return waves;
    }

    // -----------------------------------------------------------------------
    // 3. PHÒNG BOSS: BOSS XUẤT HIỆN NGAY TỪ ĐẦU
    // Kèm các pha triệu hồi viện binh định kỳ theo từng Phase HP (100% -> 50% -> 25%)
    // -----------------------------------------------------------------------
    if (nodeType === 'boss') {
      let bossType: MonsterType;
      let bossName: string;
      let guard1Type: MonsterType;
      let guard2Type: MonsterType;

      if (floor === 1) {
        bossType = 'boss_lich';
        bossName = 'Lich Vương Tử Linh';
        guard1Type = 'skeleton';
        guard2Type = 'skeleton_archer';
      } else if (floor === 2) {
        bossType = 'boss_ignis';
        bossName = 'Hỏa Ma Tống Xuất Ignis';
        guard1Type = 'hellhound';
        guard2Type = 'imp';
      } else {
        bossType = 'boss_sovereign';
        bossName = 'Chúa Tể Hư Vô Sovereign';
        guard1Type = 'void_eye';
        guard2Type = 'stalker';
      }

      const bossMonsters: WaveMonsterSpawn[] = [
        {
          type: bossType,
          x: 700,
          y: 300,
          isBoss: true,
          name: `${bossName} (Tầng ${floor})`,
          customConfig: {
            isBoss: true,
            floor: floor
          }
        },
        {
          type: guard1Type,
          x: 590,
          y: 220,
          name: `Cấm Vệ Quân 1`
        },
        {
          type: guard2Type,
          x: 590,
          y: 380,
          name: `Cấm Vệ Quân 2`
        }
      ];

      waves.push({
        waveNumber: 1,
        totalWaves: 1,
        title: `⚠️ QUYẾT CHIẾN: ${bossName.toUpperCase()}! ⚠️`,
        subtitle: `Tử chiến qua 3 Giai Đoạn HP (100% -> 50% -> 25%) với viện binh triệu hồi!`,
        isBossWave: true,
        isWarning: true,
        monsters: bossMonsters,
        spawnDelayMs: 300
      });

      return waves;
    }

    // Fallback for non-combat nodes if ever queried
    waves.push({
      waveNumber: 1,
      totalWaves: 1,
      title: 'ĐỢT CHIẾN ĐẤU',
      subtitle: '',
      isWarning: false,
      monsters: [
        { type: 'skeleton', x: 680, y: 300 }
      ]
    });

    return waves;
  }

  // =========================================================================
  // BANNER DISPLAY SYSTEM
  // =========================================================================
  public static showWaveBanner(
    scene: Phaser.Scene,
    title: string,
    subtitle?: string,
    isWarning: boolean = false
  ): Promise<void> {
    return new Promise((resolve) => {
      // Audio chime
      const audio = AudioSystem.getInstance();
      audio.playWaveIncoming(isWarning);

      if (isWarning) {
        scene.cameras.main.shake(140, 0.006);
      }

      const bannerContainer = scene.add.container(480, -90);
      bannerContainer.setDepth(150);

      const bannerWidth = 560;
      const bannerHeight = subtitle ? 66 : 50;

      // Dark futuristic back panel
      const bg = scene.add.rectangle(0, 0, bannerWidth, bannerHeight, 0x090d16, 0.94);
      const strokeColor = isWarning ? 0xef4444 : 0x0ea5e9;
      bg.setStrokeStyle(2.5, strokeColor, 0.95);

      // Accent top & bottom glowing lines
      const accentTop = scene.add.rectangle(0, -bannerHeight / 2 + 1, bannerWidth - 8, 2, strokeColor, 0.8);
      const accentBottom = scene.add.rectangle(0, bannerHeight / 2 - 1, bannerWidth - 8, 2, strokeColor, 0.8);

      // Warning glow corner triangles
      const leftTag = scene.add.rectangle(-bannerWidth / 2 + 6, 0, 4, bannerHeight - 10, strokeColor);
      const rightTag = scene.add.rectangle(bannerWidth / 2 - 6, 0, 4, bannerHeight - 10, strokeColor);

      // Title Text
      const titleColor = isWarning ? '#fee2e2' : '#f0fdf4';
      const titleText = scene.add.text(0, subtitle ? -10 : 0, title, {
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '20px',
        fontStyle: 'bold',
        color: titleColor,
        stroke: '#000000',
        strokeThickness: 4,
        shadow: {
          offsetX: 0,
          offsetY: 2,
          color: isWarning ? '#b91c1c' : '#0369a1',
          blur: 6,
          fill: true
        }
      }).setOrigin(0.5);

      bannerContainer.add([bg, accentTop, accentBottom, leftTag, rightTag, titleText]);

      // Subtitle Text
      if (subtitle) {
        const subColor = isWarning ? '#fca5a5' : '#7dd3fc';
        const subText = scene.add.text(0, 16, subtitle, {
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '12px',
          fontStyle: 'italic',
          color: subColor,
          stroke: '#000000',
          strokeThickness: 2
        }).setOrigin(0.5);
        bannerContainer.add(subText);
      }

      // Slide in smoothly from top to y=75
      scene.tweens.add({
        targets: bannerContainer,
        y: 75,
        duration: 380,
        ease: 'Back.easeOut',
        onComplete: () => {
          // Subtle pulse while holding
          scene.tweens.add({
            targets: bannerContainer,
            scaleX: 1.02,
            scaleY: 1.02,
            yoyo: true,
            duration: 400,
            repeat: 1
          });

          // Stay visible for 1.8s then slide out
          scene.time.delayedCall(1800, () => {
            scene.tweens.add({
              targets: bannerContainer,
              y: -100,
              alpha: 0,
              duration: 320,
              ease: 'Power2.easeIn',
              onComplete: () => {
                bannerContainer.destroy();
                resolve();
              }
            });
          });
        }
      });
    });
  }

  // =========================================================================
  // WAVE RUNTIME PROGRESSION
  // =========================================================================
  public start(): void {
    if (this.waves.length === 0) {
      if (this.onAllWavesClearedCallback) this.onAllWavesClearedCallback();
      return;
    }
    this.advanceToWave(0);
  }

  public advanceToWave(waveIndex: number): void {
    if (waveIndex >= this.waves.length) {
      this.isCompleted = true;
      if (this.onAllWavesClearedCallback) this.onAllWavesClearedCallback();
      return;
    }

    this.currentWaveIndex = waveIndex;
    const wave = this.waves[waveIndex];
    this.isSpawningWave = true;

    // 1. Show Wave Banner
    WaveSystem.showWaveBanner(this.scene, wave.title, wave.subtitle, wave.isWarning);

    if (this.onWaveStartCallback) {
      this.onWaveStartCallback(wave);
    }

    // 2. Staggered Monster Spawn
    const spawnDelay = wave.spawnDelayMs || 200;
    this.scene.time.delayedCall(450, () => {
      wave.monsters.forEach((spawnCfg, idx) => {
        this.scene.time.delayedCall(idx * spawnDelay, () => {
          const monster = this.onSpawnCallback(spawnCfg);
          this.activeMonsters.push(monster);

          // Spawn VFX portal / flash
          this.playSpawnEffect(monster.x, monster.y, !!spawnCfg.isElite || !!spawnCfg.isBoss);

          if (idx === wave.monsters.length - 1) {
            this.isSpawningWave = false;
          }
        });
      });
    });
  }

  private playSpawnEffect(x: number, y: number, isMajor: boolean): void {
    const color = isMajor ? 0xef4444 : 0x38bdf8;
    const ring = this.scene.add.circle(x, y, isMajor ? 32 : 18, color, 0.45);
    ring.setStrokeStyle(2, color, 0.9);
    ring.setDepth(15);

    this.scene.tweens.add({
      targets: ring,
      scale: 1.8,
      alpha: 0,
      duration: 350,
      ease: 'Quad.easeOut',
      onComplete: () => ring.destroy()
    });
  }

  public onMonsterKilled(monster: Monster): void {
    const idx = this.activeMonsters.indexOf(monster);
    if (idx !== -1) {
      this.activeMonsters.splice(idx, 1);
    }

    this.checkWaveProgress();
  }

  public checkWaveProgress(): void {
    if (this.isSpawningWave || this.isCompleted) return;

    const aliveMonsters = this.activeMonsters.filter((m) => !m.isDead && m.active);
    if (aliveMonsters.length === 0) {
      // Wave cleared!
      if (this.currentWaveIndex < this.waves.length - 1) {
        // Breather pause between waves
        this.isSpawningWave = true;
        this.scene.time.delayedCall(900, () => {
          this.advanceToWave(this.currentWaveIndex + 1);
        });
      } else {
        // All waves cleared!
        this.isCompleted = true;
        if (this.onAllWavesClearedCallback) {
          this.onAllWavesClearedCallback();
        }
      }
    }
  }

  public getCurrentWave(): WaveConfig | null {
    if (this.currentWaveIndex >= 0 && this.currentWaveIndex < this.waves.length) {
      return this.waves[this.currentWaveIndex];
    }
    return null;
  }

  public getCurrentWaveIndex(): number {
    return this.currentWaveIndex;
  }

  public getTotalWaves(): number {
    return this.waves.length;
  }

  public getActiveMonsters(): Monster[] {
    return this.activeMonsters.filter((m) => !m.isDead && m.active);
  }

  public isDone(): boolean {
    return this.isCompleted;
  }
}
