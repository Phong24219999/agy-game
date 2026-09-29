import Phaser from 'phaser';
import { Hero } from '../entities/Hero';
import { DungeonNode, PerkCard, SkillEvolution, HeroStats } from '../types/game';
import { ALL_PERK_CARDS, SYNERGY_INFO, SynergyManager } from '../systems/SynergySystem';
import { SkillManager } from '../systems/SkillSystem';
import { ALL_RELICS } from '../systems/RelicSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { completeDungeonNode } from './MapScene';

export interface RewardSceneData {
  hero: Hero;
  node: DungeonNode;
  dungeonNodes: DungeonNode[];
  floor?: number;
  seed?: string;
  levelUps?: number;
  rewards?: {
    gold: number;
    souls: number;
    exp: number;
  };
}

export class RewardScene extends Phaser.Scene {
  private hero!: Hero;
  private node!: DungeonNode;
  private dungeonNodes!: DungeonNode[];
  private floor: number = 1;
  private seed: string = 'VOID-7842';
  private levelUps: number = 1;
  private audio!: AudioSystem;
  private cardsContainer!: Phaser.GameObjects.Container;
  private currentCards: PerkCard[] = [];
  private rerollCost: number = 15;
  private rerollText!: Phaser.GameObjects.Text;

  private isEvolutionDraft: boolean = false;

  constructor() {
    super('RewardScene');
  }

  init(data: RewardSceneData): void {
    this.hero = data.hero;
    this.node = data.node;
    this.dungeonNodes = data.dungeonNodes;
    this.floor = data.floor || this.node?.floor || 1;
    this.seed = data.seed || 'VOID-7842';
    this.levelUps = data.levelUps || 1;
    this.audio = AudioSystem.getInstance();
  }

  create(): void {
    const { width, height } = this.scale;

    // Dark semi-transparent background
    this.add.rectangle(0, 0, width, height, 0x090714, 0.94).setOrigin(0, 0);

    // Decorative dust
    this.time.addEvent({
      delay: 200,
      loop: true,
      callback: () => {
        const dust = this.add.circle(
          Math.random() * width,
          Math.random() * height,
          Math.random() * 2 + 1,
          0x9f7aea,
          0.4
        );
        this.tweens.add({
          targets: dust,
          y: dust.y - 40,
          alpha: 0,
          duration: 1500,
          onComplete: () => dust.destroy()
        });
      }
    });

    // Cards Container
    this.cardsContainer = this.add.container(0, 0);

    // Check if eligible for Skill Evolution
    this.checkAndGenerateDraft();
  }

  private checkAndGenerateDraft(): void {
    const { width } = this.scale;

    // Check Skill Evolution condition:
    // Level 5 with 0 evolutions -> Tier 1 Evolution
    // Level 10 with 1 evolution -> Tier 2 Evolution
    if (this.hero.stats.level >= 5 && this.hero.evolutions.length === 0) {
      this.isEvolutionDraft = true;
      this.renderHeader('⚡ TIẾN HÓA KỸ NĂNG (BẬC 1) ⚡', 'Anh hùng đã đạt Cấp 5! Hãy chọn một nhánh tiến hóa kỹ năng đột phá:');
      this.generateEvolutionDraft(1);
    } else if (this.hero.stats.level >= 10 && this.hero.evolutions.length === 1) {
      this.isEvolutionDraft = true;
      this.renderHeader('👑 TIẾN HÓA KỸ NĂNG TỐI THƯỢNG (BẬC 2) 👑', 'Anh hùng đã đạt Cấp 10! Thức tỉnh sức mạnh thần thoại:');
      this.generateEvolutionDraft(2);
    } else {
      this.isEvolutionDraft = false;
      const sub = this.levelUps > 1
        ? `THĂNG CẤP! Bạn còn ${this.levelUps} lần chọn phước lành!`
        : 'Chiến thắng vang dội! Chọn 1 phước lành ma thuật để gia tăng sức mạnh:';
      this.renderHeader('✨ PHƯỚC LÀNH VỰC SÂU ✨', sub);
      this.generateCardDraft();
      this.createBottomButtons();
    }
  }

  private renderHeader(title: string, sub: string): void {
    const { width } = this.scale;

    this.add.text(width / 2, 45, title, {
      fontFamily: 'serif',
      fontSize: '26px',
      color: '#ecc94b',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, 80, sub, {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#cbd5e0'
    }).setOrigin(0.5);

    this.add.text(width / 2, 105, `Vàng Hiện Có: ${this.hero.stats.gold} G`, {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#f6ad55',
      fontStyle: 'bold'
    }).setOrigin(0.5);
  }

  private generateEvolutionDraft(tier: 1 | 2): void {
    this.cardsContainer.removeAll(true);
    const evolutions = SkillManager.getAvailableEvolutions(this.hero.heroClass, tier);

    const { width, height } = this.scale;
    const cardWidth = 280;
    const cardHeight = 340;
    const spacing = 50;
    const startX = width / 2 - ((cardWidth * evolutions.length + spacing * (evolutions.length - 1)) / 2);

    evolutions.forEach((evo, idx) => {
      const cardX = startX + idx * (cardWidth + spacing) + cardWidth / 2;
      const cardY = height / 2 + 15;
      this.createEvolutionCard(cardX, cardY, cardWidth, cardHeight, evo);
    });
  }

  private createEvolutionCard(x: number, y: number, w: number, h: number, evo: SkillEvolution): void {
    const container = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, w, h, 0x16122a, 0.98);
    bg.setStrokeStyle(3, 0xf6e05e);

    // Tag
    const tag = this.add.text(0, -h / 2 + 25, `TIẾN HÓA BẬC ${evo.tier}`, {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#f6e05e',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Icon
    let iconSprite: Phaser.GameObjects.Sprite | Phaser.GameObjects.Arc;
    if (this.textures.exists(evo.icon)) {
      iconSprite = this.add.sprite(0, -h / 2 + 75, evo.icon).setScale(1.6);
    } else {
      iconSprite = this.add.circle(0, -h / 2 + 75, 26, 0xf6e05e, 0.4);
    }

    // Name
    const nameText = this.add.text(0, -h / 2 + 130, evo.name, {
      fontFamily: 'serif',
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Description
    const descText = this.add.text(0, 30, evo.description, {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#e2e8f0',
      align: 'center',
      wordWrap: { width: w - 36 },
      lineSpacing: 4
    }).setOrigin(0.5);

    // Select Button
    const btn = this.add.rectangle(0, h / 2 - 40, 160, 36, 0x744210);
    btn.setStrokeStyle(2, 0xf6e05e);

    const btnText = this.add.text(0, h / 2 - 40, 'THỨC TỈNH CHIÊU', {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    container.add([bg, tag, iconSprite, nameText, descText, btn, btnText]);

    bg.setInteractive({ useHandCursor: true });
    btn.setInteractive({ useHandCursor: true });

    const onHover = () => {
      container.setScale(1.05);
      bg.setStrokeStyle(4, 0xffffff);
      btn.setFillStyle(0x975a16);
    };
    const onOut = () => {
      container.setScale(1.0);
      bg.setStrokeStyle(3, 0xf6e05e);
      btn.setFillStyle(0x744210);
    };

    bg.on('pointerover', onHover);
    bg.on('pointerout', onOut);
    btn.on('pointerover', onHover);
    btn.on('pointerout', onOut);

    const onSelect = () => {
      this.audio.playVictory();
      this.cameras.main.shake(180, 0.01);
      this.hero.addEvolution(evo);

      // Continue to perk draft if levelUps > 0
      this.isEvolutionDraft = false;
      if (this.levelUps > 0) {
        this.generateCardDraft();
        this.createBottomButtons();
      } else {
        this.finishRewards();
      }
    };

    bg.on('pointerdown', onSelect);
    btn.on('pointerdown', onSelect);

    this.cardsContainer.add(container);
  }

  private getRandomCards(count: number): PerkCard[] {
    const nodeType = this.node?.type || 'battle';
    return SynergyManager.getWeightedPerks(count, nodeType);
  }

  private generateCardDraft(): void {
    this.cardsContainer.removeAll(true);
    this.currentCards = this.getRandomCards(3);

    const { width, height } = this.scale;
    const cardWidth = 230;
    const cardHeight = 320;
    const spacing = 40;
    const startX = width / 2 - (cardWidth * 1.5 + spacing);

    this.currentCards.forEach((card, index) => {
      const cardX = startX + index * (cardWidth + spacing) + cardWidth / 2;
      const cardY = height / 2 + 10;
      this.createCard(cardX, cardY, cardWidth, cardHeight, card);
    });
  }

  private createCard(x: number, y: number, w: number, h: number, card: PerkCard): void {
    const container = this.add.container(x, y);

    let borderColor = 0xa0aec0;
    let titleColor = '#a0aec0';
    let rarityText = 'PHỔ THÔNG';

    if (card.rarity === 'rare') {
      borderColor = 0x3182ce;
      titleColor = '#3182ce';
      rarityText = 'QUÝ HIẾM';
    } else if (card.rarity === 'epic') {
      borderColor = 0x805ad5;
      titleColor = '#805ad5';
      rarityText = 'SỬ THI';
    } else if (card.rarity === 'legendary') {
      borderColor = 0xecc94b;
      titleColor = '#ecc94b';
      rarityText = 'HUYỀN THOẠI';
    }

    // Glowing Aura Outline for Rare, Epic, and Legendary cards
    let auraGraphic: Phaser.GameObjects.Rectangle | undefined;
    if (card.rarity === 'rare') {
      auraGraphic = this.add.rectangle(0, 0, w + 6, h + 6, 0x3182ce, 0.16);
      auraGraphic.setStrokeStyle(2, 0x63b3ed, 0.65);
      container.add(auraGraphic);
      this.tweens.add({
        targets: auraGraphic,
        alpha: { from: 0.15, to: 0.45 },
        scaleX: { from: 1.0, to: 1.02 },
        scaleY: { from: 1.0, to: 1.015 },
        duration: 1200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    } else if (card.rarity === 'epic') {
      auraGraphic = this.add.rectangle(0, 0, w + 8, h + 8, 0x805ad5, 0.22);
      auraGraphic.setStrokeStyle(2.5, 0xb794f4, 0.8);
      container.add(auraGraphic);
      this.tweens.add({
        targets: auraGraphic,
        alpha: { from: 0.2, to: 0.65 },
        scaleX: { from: 1.0, to: 1.03 },
        scaleY: { from: 1.0, to: 1.02 },
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    } else if (card.rarity === 'legendary') {
      auraGraphic = this.add.rectangle(0, 0, w + 12, h + 12, 0xecc94b, 0.32);
      auraGraphic.setStrokeStyle(3, 0xfff08a, 0.95);
      container.add(auraGraphic);
      this.tweens.add({
        targets: auraGraphic,
        alpha: { from: 0.3, to: 0.85 },
        scaleX: { from: 1.0, to: 1.04 },
        scaleY: { from: 1.0, to: 1.03 },
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    const bg = this.add.rectangle(0, 0, w, h, 0x141226, 0.96);
    bg.setStrokeStyle(2.5, borderColor);

    const rarityLabel = this.add.text(0, -h / 2 + 18, rarityText, {
      fontFamily: 'sans-serif',
      fontSize: '11px',
      color: titleColor,
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Icon box with border
    const iconBox = this.add.rectangle(0, -h / 2 + 60, 44, 44, 0x1f1734);
    iconBox.setStrokeStyle(1.5, borderColor);

    let iconSprite: Phaser.GameObjects.Sprite | Phaser.GameObjects.Arc;
    if (this.textures.exists(card.icon)) {
      iconSprite = this.add.sprite(0, -h / 2 + 60, card.icon).setScale(1.25);
    } else {
      iconSprite = this.add.circle(0, -h / 2 + 60, 18, borderColor, 0.4);
    }

    const nameText = this.add.text(0, -h / 2 + 104, card.name, {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#ffffff',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: w - 24 }
    }).setOrigin(0.5);

    container.add([bg, rarityLabel, iconBox, iconSprite, nameText]);

    let currentY = -h / 2 + 130;

    if (card.synergy && SYNERGY_INFO[card.synergy]) {
      const syn = SYNERGY_INFO[card.synergy];
      const badge = this.add.container(0, currentY);
      const badgeBg = this.add.rectangle(0, 0, 120, 20, Phaser.Display.Color.HexStringToColor(syn.color).color, 0.25);
      badgeBg.setStrokeStyle(1, Phaser.Display.Color.HexStringToColor(syn.color).color);
      const badgeText = this.add.text(0, 0, `[ ${syn.name.toUpperCase()} ]`, {
        fontFamily: 'sans-serif',
        fontSize: '10px',
        color: syn.color,
        fontStyle: 'bold'
      }).setOrigin(0.5);
      badge.add([badgeBg, badgeText]);
      container.add(badge);
      currentY += 24;
    }

    // Clear stats display
    const statsSummary = this.formatPerkStats(card.stats);
    if (statsSummary) {
      const statsBadgeBg = this.add.rectangle(0, currentY, w - 28, 20, 0x18241e, 0.9);
      statsBadgeBg.setStrokeStyle(1, 0x38a169);
      const statsText = this.add.text(0, currentY, statsSummary, {
        fontFamily: 'sans-serif',
        fontSize: '9.5px',
        color: '#68d391',
        fontStyle: 'bold',
        align: 'center'
      }).setOrigin(0.5);
      container.add([statsBadgeBg, statsText]);
      currentY += 26;
    }

    const descText = this.add.text(0, currentY + 20, card.description, {
      fontFamily: 'sans-serif',
      fontSize: '11px',
      color: '#cbd5e0',
      align: 'center',
      wordWrap: { width: w - 28 },
      lineSpacing: 3
    }).setOrigin(0.5);

    const btn = this.add.rectangle(0, h / 2 - 30, 140, 32, 0x2b2346);
    btn.setStrokeStyle(1.5, borderColor);
    const btnText = this.add.text(0, h / 2 - 30, 'CHỌN', {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    container.add([descText, btn, btnText]);

    bg.setInteractive({ useHandCursor: true });
    btn.setInteractive({ useHandCursor: true });

    const onHover = () => {
      container.setScale(1.04);
      bg.setStrokeStyle(3, 0xffffff);
      btn.setFillStyle(0x44337a);
    };
    const onOut = () => {
      container.setScale(1.0);
      bg.setStrokeStyle(2.5, borderColor);
      btn.setFillStyle(0x2b2346);
    };

    bg.on('pointerover', onHover);
    bg.on('pointerout', onOut);
    btn.on('pointerover', onHover);
    btn.on('pointerout', onOut);

    const onSelect = () => {
      this.selectCard(card);
    };

    bg.on('pointerdown', onSelect);
    btn.on('pointerdown', onSelect);

    this.cardsContainer.add(container);
  }

  private formatPerkStats(stats?: Partial<HeroStats>): string {
    if (!stats) return '';
    const parts: string[] = [];
    if (stats.atk) parts.push(`+${stats.atk} ATK`);
    if (stats.maxHp) parts.push(`+${stats.maxHp} HP`);
    if (stats.def) parts.push(`+${stats.def}% DEF`);
    if (stats.attackSpeed) parts.push(`+${Math.round(stats.attackSpeed * 100)}% Tốc Đánh`);
    if (stats.critRate) parts.push(`+${Math.round(stats.critRate * 100)}% Bạo`);
    if (stats.critDmg) parts.push(`+${Math.round(stats.critDmg * 100)}% ST Bạo`);
    if (stats.lifeSteal) parts.push(`+${Math.round(stats.lifeSteal * 100)}% Hút Máu`);
    if (stats.dodgeRate) parts.push(`+${Math.round(stats.dodgeRate * 100)}% Né`);
    if (stats.thorns) parts.push(`Phản ${stats.thorns} Gai`);
    if (stats.speed) parts.push(`+${stats.speed} Tốc`);
    if (stats.cooldownReduction) parts.push(`-${Math.round(stats.cooldownReduction * 100)}% CDR`);
    return parts.join(' | ');
  }

  private selectCard(card: PerkCard): void {
    this.audio.playLevelUp();
    this.hero.addPerk(card);

    if (this.levelUps > 1) {
      this.levelUps--;
      this.checkAndGenerateDraft();
    } else {
      this.finishRewards();
    }
  }

  private createBottomButtons(): void {
    const { width, height } = this.scale;
    const btnY = height - 45;

    // Reroll Button
    const rerollBtn = this.add.container(width / 2 - 120, btnY);
    const rerollBg = this.add.rectangle(0, 0, 180, 36, 0x1f1930);
    rerollBg.setStrokeStyle(1, 0x805ad5);

    this.rerollText = this.add.text(0, 0, `🔄 Đổi Bài (${this.rerollCost} G)`, {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#d6bcfa',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    rerollBtn.add([rerollBg, this.rerollText]);
    rerollBg.setInteractive({ useHandCursor: true });

    rerollBg.on('pointerover', () => rerollBg.setFillStyle(0x2d2448));
    rerollBg.on('pointerout', () => rerollBg.setFillStyle(0x1f1930));

    rerollBg.on('pointerdown', () => {
      if (this.hero.stats.gold >= this.rerollCost) {
        this.hero.stats.gold -= this.rerollCost;
        this.audio.playCoin();
        this.generateCardDraft();
      } else {
        this.audio.playHit();
      }
    });

    // Skip Button (+20 Gold)
    const skipBtn = this.add.container(width / 2 + 120, btnY);
    const skipBg = this.add.rectangle(0, 0, 180, 36, 0x1f1930);
    skipBg.setStrokeStyle(1, 0x4a5568);

    const skipText = this.add.text(0, 0, '⏩ Bỏ Qua (+20 G)', {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#cbd5e0',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    skipBtn.add([skipBg, skipText]);
    skipBg.setInteractive({ useHandCursor: true });

    skipBg.on('pointerover', () => skipBg.setFillStyle(0x2d2448));
    skipBg.on('pointerout', () => skipBg.setFillStyle(0x1f1930));

    skipBg.on('pointerdown', () => {
      this.hero.stats.gold += 20;
      this.audio.playCoin();
      if (this.levelUps > 1) {
        this.levelUps--;
        this.checkAndGenerateDraft();
      } else {
        this.finishRewards();
      }
    });
  }

  private finishRewards(): void {
    if (this.node && this.node.type === 'boss') {
      this.showBossFloorClearModal();
      return;
    }

    if (this.node && this.dungeonNodes) {
      completeDungeonNode(this.node, this.dungeonNodes);
    }

    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.time.delayedCall(300, () => {
      this.scene.start('MapScene', {
        hero: this.hero,
        dungeonNodes: this.dungeonNodes,
        floor: this.floor,
        seed: this.seed
      });
    });
  }

  private showBossFloorClearModal(): void {
    const { width, height } = this.scale;
    const modal = this.add.container(width / 2, height / 2);
    modal.setDepth(200);

    const bg = this.add.rectangle(0, 0, 500, 260, 0x0c0a1a, 0.96);
    bg.setStrokeStyle(2.5, 0xf6e05e);

    const title = this.add.text(0, -85, `👑 CHIẾN THẮNG TẦNG ${this.floor}! 👑`, {
      fontFamily: 'serif',
      fontSize: '24px',
      color: '#ffd700',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    const nextFloor = this.floor + 1;
    const sub = this.add.text(0, -45, `Bạn đã tiêu diệt Chúa Tể Tầng ${this.floor}!\nCánh cổng tiến vào Tầng ${nextFloor} đã mở ra. Bạn muốn tiếp tục hành trình?`, {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#cbd5e1',
      align: 'center'
    }).setOrigin(0.5);

    const info = this.add.text(0, 0, `Hero: Lv.${this.hero.stats.level}  |  HP: ${Math.round(this.hero.stats.hp)}/${this.hero.stats.maxHp}  |  Vàng: ${this.hero.stats.gold}  |  Linh Hồn: ${this.hero.stats.souls}`, {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#60a5fa',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Option 1: Continue to next floor
    const btnNext = this.add.container(-120, 65);
    const bgNext = this.add.rectangle(0, 0, 210, 56, 0x1b4332);
    bgNext.setStrokeStyle(2, 0x40916c);
    const textNext1 = this.add.text(0, -9, `🔻 XUỐNG TẦNG ${nextFloor}`, {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#74c69d',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    const textNext2 = this.add.text(0, 11, 'Hồi 35% HP & Thử thách mới', {
      fontFamily: 'sans-serif',
      fontSize: '10px',
      color: '#b7e4c7'
    }).setOrigin(0.5);
    btnNext.add([bgNext, textNext1, textNext2]);

    bgNext.setInteractive({ useHandCursor: true });
    bgNext.on('pointerover', () => bgNext.setFillStyle(0x2d6a4f));
    bgNext.on('pointerout', () => bgNext.setFillStyle(0x1b4332));
    bgNext.on('pointerdown', () => {
      this.audio.playVictory();
      this.hero.heal(Math.round(this.hero.stats.maxHp * 0.35));
      this.cameras.main.fadeOut(350, 0, 0, 0);
      this.time.delayedCall(350, () => {
        this.scene.start('MapScene', {
          hero: this.hero,
          dungeonNodes: [],
          floor: nextFloor,
          seed: this.seed
        });
      });
    });

    // Option 2: Harvest & Return
    const btnRet = this.add.container(120, 65);
    const bgRet = this.add.rectangle(0, 0, 210, 56, 0x3c096c);
    bgRet.setStrokeStyle(2, 0x7b2cbf);
    const textRet1 = this.add.text(0, -9, '🏛️ RÚT LUI AN TOÀN', {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#e0aaff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    const textRet2 = this.add.text(0, 11, 'Về Điện Thờ nâng cấp Meta', {
      fontFamily: 'sans-serif',
      fontSize: '10px',
      color: '#c77dff'
    }).setOrigin(0.5);
    btnRet.add([bgRet, textRet1, textRet2]);

    bgRet.setInteractive({ useHandCursor: true });
    bgRet.on('pointerover', () => bgRet.setFillStyle(0x5a189a));
    bgRet.on('pointerout', () => bgRet.setFillStyle(0x3c096c));
    bgRet.on('pointerdown', () => {
      this.audio.playClick();
      this.cameras.main.fadeOut(350, 0, 0, 0);
      this.time.delayedCall(350, () => {
        this.scene.start('GameOverScene', {
          hero: this.hero,
          floor: this.floor,
          victory: true,
          seed: this.seed
        });
      });
    });

    modal.add([bg, title, sub, info, btnNext, btnRet]);

    modal.setScale(0.85);
    modal.setAlpha(0);
    this.tweens.add({
      targets: modal,
      scale: 1,
      alpha: 1,
      duration: 280,
      ease: 'Back.easeOut'
    });
  }
}
