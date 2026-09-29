import Phaser from 'phaser';
import { Hero } from '../entities/Hero';
import { DungeonNode, NodeType, PerkCard, EquipmentItem, HeroStats } from '../types/game';
import { DungeonGenerator } from '../systems/DungeonGenerator';
import { AudioSystem } from '../systems/AudioSystem';
import { ALL_PERK_CARDS, SHOP_ITEMS, SynergyManager } from '../systems/SynergySystem';

export interface MapSceneData {
  hero: Hero;
  floor?: number;
  dungeonNodes?: DungeonNode[];
  seed?: string;
}

/**
 * Shared helper to mark a dungeon node as completed and unlock subsequent nodes in the branch
 */
export function completeDungeonNode(node: DungeonNode, dungeonNodes: DungeonNode[]): void {
  node.completed = true;
  node.accessible = false;

  // Lock all other nodes in the same row (the player committed to this path)
  dungeonNodes
    .filter((n) => n.row === node.row && n.id !== node.id)
    .forEach((n) => {
      n.accessible = false;
    });

  // Unlock connected nodes in the next column/row
  node.connectedTo.forEach((targetId) => {
    const nextNode = dungeonNodes.find((n) => n.id === targetId);
    if (nextNode && !nextNode.completed) {
      nextNode.accessible = true;
    }
  });
}

export class MapScene extends Phaser.Scene {
  private hero!: Hero;
  private floor: number = 1;
  private seed: string = 'VOID-7842';
  private dungeonNodes: DungeonNode[] = [];

  private linesGraphics!: Phaser.GameObjects.Graphics;
  private nodesContainer!: Phaser.GameObjects.Container;
  private tooltipContainer!: Phaser.GameObjects.Container;
  private tooltipBg!: Phaser.GameObjects.Rectangle;
  private tooltipTitle!: Phaser.GameObjects.Text;
  private tooltipDesc!: Phaser.GameObjects.Text;

  // Top HUD elements
  private hudHpText!: Phaser.GameObjects.Text;
  private hudHpFill!: Phaser.GameObjects.Rectangle;
  private hudGoldText!: Phaser.GameObjects.Text;
  private hudSoulsText!: Phaser.GameObjects.Text;

  private nodePositions: Map<string, { x: number; y: number }> = new Map();
  private chestModalContainer: Phaser.GameObjects.Container | null = null;

  constructor() {
    super('MapScene');
  }

  init(data: MapSceneData): void {
    this.floor = data?.floor ?? 1;
    this.seed = data?.seed || data?.hero?.stats?.runSeed || 'VOID-7842';

    if (data?.hero) {
      this.hero = data.hero;
      if (!this.hero.stats.runSeed) this.hero.stats.runSeed = this.seed;
    } else {
      // Fallback safe hero if tested in isolation
      const fallbackStats: HeroStats = {
        str: 15,
        vit: 15,
        int: 10,
        agi: 10,
        hp: 120,
        maxHp: 120,
        atk: 22,
        def: 15,
        attackSpeed: 1.1,
        cooldownReduction: 0,
        critRate: 0.12,
        critDmg: 1.5,
        lifeSteal: 0,
        dodgeRate: 0.05,
        thorns: 0,
        speed: 130,
        gold: 50,
        souls: 0,
        level: 1,
        exp: 0,
        maxExp: 100,
        runSeed: this.seed
      };
      this.hero = new Hero(this, -200, -200, 'knight', fallbackStats);
    }

    if (data?.dungeonNodes && data.dungeonNodes.length > 0) {
      this.dungeonNodes = data.dungeonNodes;
    } else {
      const generated = DungeonGenerator.generateFloor(this.floor, this.seed);
      this.dungeonNodes = generated.nodes;
    }
  }

  create(): void {
    // 1. Dark Fantasy Ambient Background
    this.createBackground();

    // 2. Connecting Lines Layer (below nodes)
    this.linesGraphics = this.add.graphics();

    // 3. Container for all Node GameObjects
    this.nodesContainer = this.add.container(0, 0);

    // 4. Calculate coordinates and render Map
    this.computeNodePositions();
    this.drawConnections();
    this.renderNodes();

    // 5. Header & Top HUD
    this.createTopHUD();

    // 6. Bottom Legend
    this.createLegend();

    // 7. Tooltip System (top-most layer)
    this.createTooltip();

    // Fade-in effect
    this.cameras.main.fadeIn(300, 10, 8, 18);
  }

  private createBackground(): void {
    // Deep vignette background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0e0b16, 0x0e0b16, 0x050409, 0x050409, 1);
    bg.fillRect(0, 0, 960, 600);

    // Subtle runic grid / pattern
    const grid = this.add.graphics();
    grid.lineStyle(1, 0x221a36, 0.25);
    for (let x = 0; x < 960; x += 40) {
      grid.lineBetween(x, 0, x, 600);
    }
    for (let y = 0; y < 600; y += 40) {
      grid.lineBetween(0, y, 960, y);
    }

    // Floating void embers
    for (let i = 0; i < 20; i++) {
      const ember = this.add.circle(
        Phaser.Math.Between(20, 940),
        Phaser.Math.Between(80, 560),
        Phaser.Math.Between(1, 2.5),
        0x9f7aea,
        0.35
      );
      this.tweens.add({
        targets: ember,
        y: ember.y - Phaser.Math.Between(40, 90),
        alpha: { from: 0.4, to: 0 },
        duration: Phaser.Math.Between(2500, 4500),
        repeat: -1,
        delay: Phaser.Math.Between(0, 3000)
      });
    }
  }

  private createTopHUD(): void {
    const hudBar = this.add.graphics();
    hudBar.fillStyle(0x130f24, 0.92);
    hudBar.fillRect(0, 0, 960, 68);
    hudBar.lineStyle(2, 0x3d2b56, 1);
    hudBar.lineBetween(0, 68, 960, 68);

    // Title
    const titleText = this.add.text(480, 20, `HẦM NGỤC HƯ VÔ - TẦNG ${this.floor}`, {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '20px',
      color: '#f6e05e',
      fontStyle: 'bold'
    });
    titleText.setOrigin(0.5, 0.5);
    titleText.setShadow(0, 2, '#000000', 4);

    const subTitle = this.add.text(480, 45, 'Chọn bước đi tiếp theo để tiến sâu vào cõi vĩnh hằng', {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#a0aec0'
    });
    subTitle.setOrigin(0.5, 0.5);

    // Left Side: Hero Info
    const heroClassMap: Record<string, string> = {
      knight: 'HIỆP SĨ',
      mage: 'PHÁP SƯ',
      rogue: 'SÁT THỦ',
      paladin: 'THÁNH KỴ SĨ',
      ranger: 'XẠ THỦ',
      warlock: 'THUẬT SĨ'
    };
    const className = heroClassMap[this.hero.heroClass] || 'ANH HÙNG';

    // Hero Avatar icon
    const avatarBg = this.add.rectangle(40, 34, 42, 42, 0x1f1636);
    avatarBg.setStrokeStyle(1.5, 0xd69e2e);
    if (this.textures.exists(`hero_${this.hero.heroClass}`)) {
      const avatar = this.add.sprite(40, 34, `hero_${this.hero.heroClass}`);
      avatar.setScale(0.85);
    }

    const classLabel = this.add.text(70, 16, className, {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#ecc94b',
      fontStyle: 'bold'
    });

    // Health Bar
    const hpBarWidth = 120;
    const hpBarHeight = 12;
    const hpBarX = 70;
    const hpBarY = 38;

    this.add.rectangle(hpBarX, hpBarY, hpBarWidth, hpBarHeight, 0x22172b).setOrigin(0, 0);
    const hpRatio = Math.max(0, Math.min(1, this.hero.stats.hp / this.hero.stats.maxHp));
    this.hudHpFill = this.add.rectangle(hpBarX, hpBarY, hpBarWidth * hpRatio, hpBarHeight, 0xe53e3e).setOrigin(0, 0);
    this.add.rectangle(hpBarX, hpBarY, hpBarWidth, hpBarHeight).setStrokeStyle(1, 0x4a3660).setOrigin(0, 0);

    this.hudHpText = this.add.text(hpBarX + hpBarWidth / 2, hpBarY + hpBarHeight / 2, `${Math.round(this.hero.stats.hp)}/${this.hero.stats.maxHp}`, {
      fontFamily: 'sans-serif',
      fontSize: '10px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);

    // Right Side: Gold and Souls
    // Gold
    const goldX = 750;
    if (this.textures.exists('icon_gold')) {
      const goldIcon = this.add.sprite(goldX, 34, 'icon_gold').setScale(0.75);
    }
    this.hudGoldText = this.add.text(goldX + 18, 26, `${this.hero.stats.gold} Vàng`, {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#ecc94b',
      fontStyle: 'bold'
    });

    // Souls
    const soulsX = 860;
    if (this.textures.exists('icon_soul')) {
      const soulsIcon = this.add.sprite(soulsX, 34, 'icon_soul').setScale(0.75);
    }
    this.hudSoulsText = this.add.text(soulsX + 18, 26, `${this.hero.stats.souls || 0}`, {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#d6bcfa',
      fontStyle: 'bold'
    });
  }

  private createLegend(): void {
    const legendY = 572;
    const legendBg = this.add.graphics();
    legendBg.fillStyle(0x0e0b16, 0.85);
    legendBg.fillRect(0, 550, 960, 50);
    legendBg.lineStyle(1, 0x241b38, 1);
    legendBg.lineBetween(0, 550, 960, 550);

    const items = [
      { icon: '⚔️', label: 'Quái thường' },
      { icon: '💀', label: 'Tinh Anh' },
      { icon: '🎁', label: 'Rương báu' },
      { icon: '💰', label: 'Cửa hàng' },
      { icon: '🔥', label: 'Lò rèn / Trại' },
      { icon: '👑', label: 'Chúa Tể Hư Vô' }
    ];

    const startX = 140;
    const spacing = 120;
    items.forEach((item, idx) => {
      const x = startX + idx * spacing;
      this.add.text(x, legendY, `${item.icon} ${item.label}`, {
        fontFamily: 'sans-serif',
        fontSize: '11px',
        color: '#a0aec0'
      }).setOrigin(0.5, 0.5);
    });
  }

  private computeNodePositions(): void {
    this.nodePositions.clear();
    const rows = 6;
    const startX = 110;
    const endX = 850;
    const xStep = (endX - startX) / (rows - 1); // ~148px per row step

    for (let r = 0; r < rows; r++) {
      const nodesInRow = this.dungeonNodes.filter((n) => n.row === r);
      nodesInRow.sort((a, b) => a.col - b.col);
      const count = nodesInRow.length;
      const x = startX + r * xStep;

      nodesInRow.forEach((node, colIndex) => {
        let y = 320;
        if (count === 1) {
          y = 320;
        } else if (count === 2) {
          y = 320 + (colIndex === 0 ? -75 : 75);
        } else if (count === 3) {
          y = 320 + (colIndex - 1) * 115;
        }
        this.nodePositions.set(node.id, { x, y });
      });
    }
  }

  private drawConnections(): void {
    this.linesGraphics.clear();

    this.dungeonNodes.forEach((node) => {
      const fromPos = this.nodePositions.get(node.id);
      if (!fromPos) return;

      node.connectedTo.forEach((targetId) => {
        const targetNode = this.dungeonNodes.find((n) => n.id === targetId);
        const toPos = this.nodePositions.get(targetId);
        if (!targetNode || !toPos) return;

        // Path is active if origin was completed and target is accessible or completed
        const isActivePath = (node.completed && targetNode.accessible) || (node.completed && targetNode.completed);

        if (isActivePath) {
          // Glowing active path
          this.linesGraphics.lineStyle(4, 0xf6e05e, 0.85);
          this.drawCurvedLine(fromPos.x, fromPos.y, toPos.x, toPos.y);

          this.linesGraphics.lineStyle(2, 0xffffff, 0.95);
          this.drawCurvedLine(fromPos.x, fromPos.y, toPos.x, toPos.y);
        } else {
          // Inactive / locked path
          this.linesGraphics.lineStyle(2, 0x362c4a, 0.45);
          this.drawCurvedLine(fromPos.x, fromPos.y, toPos.x, toPos.y);
        }
      });
    });
  }

  private drawCurvedLine(x1: number, y1: number, x2: number, y2: number): void {
    const midX = (x1 + x2) / 2;
    const curve = new Phaser.Curves.CubicBezier(
      new Phaser.Math.Vector2(x1, y1),
      new Phaser.Math.Vector2(midX, y1),
      new Phaser.Math.Vector2(midX, y2),
      new Phaser.Math.Vector2(x2, y2)
    );
    curve.draw(this.linesGraphics, 24);
  }

  private renderNodes(): void {
    this.nodesContainer.removeAll(true);

    this.dungeonNodes.forEach((node) => {
      const pos = this.nodePositions.get(node.id);
      if (!pos) return;

      const nodeContainer = this.add.container(pos.x, pos.y);
      this.nodesContainer.add(nodeContainer);

      const isBoss = node.type === 'boss';
      const baseRadius = isBoss ? 32 : 24;

      const typeVisual = this.getNodeVisualConfig(node.type);

      // 1. Status effects & background ring
      if (node.accessible && !node.completed) {
        // Glowing animated aura
        const aura = this.add.circle(0, 0, baseRadius + 7, typeVisual.borderColor, 0.3);
        nodeContainer.add(aura);

        this.tweens.add({
          targets: aura,
          scale: 1.3,
          alpha: { from: 0.45, to: 0.05 },
          duration: 1100,
          repeat: -1,
          yoyo: true
        });

        // Breathing pulse for the active node
        this.tweens.add({
          targets: nodeContainer,
          scale: 1.06,
          duration: 900,
          repeat: -1,
          yoyo: true,
          ease: 'Sine.easeInOut'
        });
      }

      // 2. Base Circle
      const baseBgColor = node.completed ? 0x181524 : node.accessible ? 0x1f1936 : 0x120f1e;
      const circle = this.add.circle(0, 0, baseRadius, baseBgColor);
      nodeContainer.add(circle);

      // 3. Border Stroke
      const strokeColor = node.completed
        ? 0x4a5568
        : node.accessible
        ? typeVisual.borderColor
        : 0x2d2542;
      const strokeWidth = isBoss ? 4 : 2.5;
      const stroke = this.add.circle(0, 0, baseRadius);
      stroke.setStrokeStyle(strokeWidth, strokeColor, node.accessible || node.completed ? 1 : 0.6);
      nodeContainer.add(stroke);

      // 4. Node Icon / Symbol
      if (this.textures.exists(`node_${node.type}`)) {
        const nodeSprite = this.add.sprite(0, 0, `node_${node.type}`);
        nodeSprite.setScale(isBoss ? 1.35 : 0.95);
        if (node.completed) nodeSprite.setAlpha(0.45);
        nodeContainer.add(nodeSprite);
      } else {
        const iconText = this.add.text(0, -1, typeVisual.icon, {
          fontSize: isBoss ? '24px' : '17px',
          align: 'center'
        }).setOrigin(0.5, 0.5);
        if (node.completed) iconText.setAlpha(0.4);
        nodeContainer.add(iconText);
      }

      // 5. Completion Overlay
      if (node.completed) {
        circle.setAlpha(0.6);
        const tick = this.add.text(baseRadius - 6, baseRadius - 8, '✓', {
          fontSize: '14px',
          color: '#48bb78',
          fontStyle: 'bold'
        }).setOrigin(0.5, 0.5);
        nodeContainer.add(tick);
      }

      // 6. Locked Node dimming
      if (!node.accessible && !node.completed) {
        nodeContainer.setAlpha(0.45);
      }

      // 7. Interactivity
      if (node.accessible && !node.completed) {
        circle.setInteractive({ useHandCursor: true });

        circle.on('pointerover', () => {
          this.tweens.add({
            targets: nodeContainer,
            scale: 1.18,
            duration: 120,
            ease: 'Back.easeOut'
          });
          this.showTooltip(node, pos.x, pos.y - baseRadius - 15);
        });

        circle.on('pointerout', () => {
          this.tweens.add({
            targets: nodeContainer,
            scale: 1.0,
            duration: 120,
            ease: 'Sine.easeOut'
          });
          this.hideTooltip();
        });

        circle.on('pointerdown', () => {
          this.handleNodeClick(node);
        });
      }
    });
  }

  private getNodeVisualConfig(type: NodeType): { icon: string; borderColor: number; colorHex: string } {
    switch (type) {
      case 'battle':
        return { icon: '⚔️', borderColor: 0xe53e3e, colorHex: '#e53e3e' };
      case 'elite':
        return { icon: '💀', borderColor: 0x9f7aea, colorHex: '#9f7aea' };
      case 'chest':
        return { icon: '🎁', borderColor: 0xf6e05e, colorHex: '#f6e05e' };
      case 'shop':
        return { icon: '💰', borderColor: 0x48bb78, colorHex: '#48bb78' };
      case 'campfire':
        return { icon: '🔥', borderColor: 0xed8936, colorHex: '#ed8936' };
      case 'boss':
        return { icon: '👑', borderColor: 0xf56565, colorHex: '#f56565' };
    }
  }

  private handleNodeClick(node: DungeonNode): void {
    AudioSystem.getInstance().playClick();
    this.hideTooltip();

    switch (node.type) {
      case 'battle':
      case 'elite':
      case 'boss':
        this.cameras.main.fadeOut(250, 0, 0, 0);
        this.time.delayedCall(250, () => {
          this.scene.start('BattleScene', {
            hero: this.hero,
            node,
            dungeonNodes: this.dungeonNodes,
            floor: this.floor,
            seed: this.seed
          });
        });
        break;

      case 'shop':
        this.cameras.main.fadeOut(250, 0, 0, 0);
        this.time.delayedCall(250, () => {
          this.scene.start('ShopScene', {
            hero: this.hero,
            node,
            dungeonNodes: this.dungeonNodes,
            floor: this.floor,
            seed: this.seed
          });
        });
        break;

      case 'campfire':
        this.cameras.main.fadeOut(250, 0, 0, 0);
        this.time.delayedCall(250, () => {
          this.scene.start('CampfireScene', {
            hero: this.hero,
            node,
            dungeonNodes: this.dungeonNodes,
            floor: this.floor,
            seed: this.seed
          });
        });
        break;

      case 'chest':
        this.openChestDirectly(node);
        break;
    }
  }

  private openChestDirectly(node: DungeonNode): void {
    // Random Rewards
    const goldFound = Phaser.Math.Between(35, 70);
    this.hero.stats.gold += goldFound;

    // Pick 1 random perk or item
    const isPerkReward = Math.random() < 0.6;
    let rewardPerk: PerkCard | null = null;
    let rewardItem: EquipmentItem | null = null;

    if (isPerkReward && ALL_PERK_CARDS.length > 0) {
      const perks = SynergyManager.getWeightedPerks(1, 'chest');
      rewardPerk = perks[0] || ALL_PERK_CARDS[0];
      this.hero.addPerk(rewardPerk);
    } else {
      const nonPotionItems = SHOP_ITEMS.filter((i) => i.id !== 'shop_health_potion');
      const idx = Phaser.Math.Between(0, nonPotionItems.length - 1);
      rewardItem = nonPotionItems[idx];
      this.hero.equipItem(rewardItem);
    }

    AudioSystem.getInstance().playLevelUp();
    AudioSystem.getInstance().playCoin();

    // Mark completed and unlock
    completeDungeonNode(node, this.dungeonNodes);
    this.updateHUDValues();

    // Modal popup
    this.showChestRewardModal(node, goldFound, rewardPerk, rewardItem);
  }

  private showChestRewardModal(
    node: DungeonNode,
    goldFound: number,
    perk: PerkCard | null,
    item: EquipmentItem | null
  ): void {
    if (this.chestModalContainer) {
      this.chestModalContainer.destroy();
    }

    this.chestModalContainer = this.add.container(480, 300);
    this.chestModalContainer.setDepth(100);

    // Dim Background Blocker
    const blocker = this.add.rectangle(0, 0, 960, 600, 0x000000, 0.75);
    blocker.setInteractive(); // Blocks clicks behind
    this.chestModalContainer.add(blocker);

    // Dialog Box
    const boxW = 420;
    const boxH = 310;
    const dialogBg = this.add.rectangle(0, 0, boxW, boxH, 0x161326);
    dialogBg.setStrokeStyle(2.5, 0xd69e2e);
    this.chestModalContainer.add(dialogBg);

    // Chest Sprite
    if (this.textures.exists('chest_open')) {
      const chest = this.add.sprite(0, -95, 'chest_open').setScale(2.2);
      this.chestModalContainer.add(chest);
    }

    // Title
    const title = this.add.text(0, -45, 'MỞ RƯƠNG KHO BÁU CỔ!', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '20px',
      color: '#f6e05e',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);
    this.chestModalContainer.add(title);

    // Gold reward display
    const goldText = this.add.text(0, -10, `+${goldFound} Vàng Hoàng Kim`, {
      fontFamily: 'sans-serif',
      fontSize: '15px',
      color: '#ecc94b',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);
    this.chestModalContainer.add(goldText);

    // Relic / Perk reward display
    let rewardName = '';
    let rewardDesc = '';
    let rewardColor = '#9f7aea';

    if (perk) {
      rewardName = `[Ấn Chú] ${perk.name}`;
      rewardDesc = perk.description;
      rewardColor = '#68d391';
    } else if (item) {
      rewardName = `[Cổ Vật] ${item.name}`;
      rewardDesc = item.description;
      rewardColor = '#63b3ed';
    }

    const rewardNameText = this.add.text(0, 30, rewardName, {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      color: rewardColor,
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);
    this.chestModalContainer.add(rewardNameText);

    const rewardDescText = this.add.text(0, 60, rewardDesc, {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#cbd5e0',
      wordWrap: { width: 360 },
      align: 'center'
    }).setOrigin(0.5, 0.5);
    this.chestModalContainer.add(rewardDescText);

    // Claim Button
    const btnW = 180;
    const btnH = 42;
    const btnBg = this.add.rectangle(0, 115, btnW, btnH, 0x2f855a);
    btnBg.setStrokeStyle(1.5, 0x68d391);
    btnBg.setInteractive({ useHandCursor: true });
    this.chestModalContainer.add(btnBg);

    const btnText = this.add.text(0, 115, 'NHẬN THƯỞNG', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);
    this.chestModalContainer.add(btnText);

    btnBg.on('pointerover', () => {
      btnBg.setFillStyle(0x38a169);
    });
    btnBg.on('pointerout', () => {
      btnBg.setFillStyle(0x2f855a);
    });
    btnBg.on('pointerdown', () => {
      AudioSystem.getInstance().playClick();
      if (this.chestModalContainer) {
        this.chestModalContainer.destroy();
        this.chestModalContainer = null;
      }
      // Re-draw map connections & node states
      this.drawConnections();
      this.renderNodes();
    });

    // Enter pop animation
    this.chestModalContainer.setScale(0.7);
    this.tweens.add({
      targets: this.chestModalContainer,
      scale: 1.0,
      duration: 200,
      ease: 'Back.easeOut'
    });
  }

  private updateHUDValues(): void {
    if (this.hudHpText && this.hudHpFill) {
      const ratio = Math.max(0, Math.min(1, this.hero.stats.hp / this.hero.stats.maxHp));
      this.hudHpFill.width = 120 * ratio;
      this.hudHpText.setText(`${Math.round(this.hero.stats.hp)}/${this.hero.stats.maxHp}`);
    }
    if (this.hudGoldText) {
      this.hudGoldText.setText(`${this.hero.stats.gold} Vàng`);
    }
    if (this.hudSoulsText) {
      this.hudSoulsText.setText(`${this.hero.stats.souls || 0}`);
    }
  }

  private createTooltip(): void {
    this.tooltipContainer = this.add.container(0, 0);
    this.tooltipContainer.setDepth(90);
    this.tooltipContainer.setVisible(false);

    this.tooltipBg = this.add.rectangle(0, 0, 240, 75, 0x141022, 0.95);
    this.tooltipBg.setStrokeStyle(1.5, 0x6b46c1);
    this.tooltipContainer.add(this.tooltipBg);

    this.tooltipTitle = this.add.text(0, -22, '', {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#f6e05e',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);
    this.tooltipContainer.add(this.tooltipTitle);

    this.tooltipDesc = this.add.text(0, 8, '', {
      fontFamily: 'sans-serif',
      fontSize: '11px',
      color: '#e2e8f0',
      wordWrap: { width: 220 },
      align: 'center'
    }).setOrigin(0.5, 0.5);
    this.tooltipContainer.add(this.tooltipDesc);
  }

  private showTooltip(node: DungeonNode, x: number, y: number): void {
    this.tooltipTitle.setText(node.title);
    this.tooltipDesc.setText(node.description);

    const visual = this.getNodeVisualConfig(node.type);
    this.tooltipTitle.setColor(visual.colorHex);
    this.tooltipBg.setStrokeStyle(1.5, visual.borderColor);

    // Keep tooltip within screen bounds
    const clampedX = Phaser.Math.Clamp(x, 130, 830);
    const clampedY = Phaser.Math.Clamp(y, 110, 520);
    this.tooltipContainer.setPosition(clampedX, clampedY);
    this.tooltipContainer.setVisible(true);
  }

  private hideTooltip(): void {
    if (this.tooltipContainer) {
      this.tooltipContainer.setVisible(false);
    }
  }
}
