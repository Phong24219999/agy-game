import Phaser from 'phaser';
import { Hero } from '../entities/Hero';
import { DungeonNode, EquipmentItem, HeroStats } from '../types/game';
import { AudioSystem } from '../systems/AudioSystem';
import { SYNERGY_INFO } from '../systems/SynergySystem';
import { ShopSystem } from '../systems/ShopSystem';
import { RelicManager } from '../systems/RelicSystem';
import { completeDungeonNode } from './MapScene';

export interface ShopSceneData {
  hero: Hero;
  node: DungeonNode;
  dungeonNodes: DungeonNode[];
  floor: number;
  seed?: string;
}

interface ShopItemState {
  item: EquipmentItem;
  purchased: boolean;
  container: Phaser.GameObjects.Container;
  cardBg: Phaser.GameObjects.Rectangle;
  buyButton: Phaser.GameObjects.Rectangle;
  buyText: Phaser.GameObjects.Text;
  auraGraphic?: Phaser.GameObjects.Rectangle;
  auraTween?: Phaser.Tweens.Tween;
}

export class ShopScene extends Phaser.Scene {
  private hero!: Hero;
  private node!: DungeonNode;
  private dungeonNodes: DungeonNode[] = [];
  private floor: number = 1;
  private seed: string = 'VOID-7842';

  private shopItems: ShopItemState[] = [];
  private rerollCost: number = 20;
  private rerollCount: number = 0;

  private rerollButton!: Phaser.GameObjects.Rectangle;
  private rerollButtonText!: Phaser.GameObjects.Text;
  private rerollSubText!: Phaser.GameObjects.Text;

  private hudGoldText!: Phaser.GameObjects.Text;
  private hudHpText!: Phaser.GameObjects.Text;
  private hudHpFill!: Phaser.GameObjects.Rectangle;
  private hudAtkText!: Phaser.GameObjects.Text;
  private hudDefText!: Phaser.GameObjects.Text;

  private merchantDialogueText!: Phaser.GameObjects.Text;

  constructor() {
    super('ShopScene');
  }

  init(data: ShopSceneData): void {
    this.node = data?.node;
    this.dungeonNodes = data?.dungeonNodes || [];
    this.floor = data?.floor || 1;
    this.seed = data?.seed || 'VOID-7842';
    this.rerollCost = 20;
    this.rerollCount = 0;

    if (data?.hero) {
      this.hero = data.hero;
    } else {
      const fallbackStats: HeroStats = {
        hp: 120,
        maxHp: 120,
        atk: 22,
        def: 15,
        attackSpeed: 1.1,
        critRate: 0.12,
        critDmg: 1.5,
        lifeSteal: 0,
        dodgeRate: 0.05,
        thorns: 0,
        speed: 130,
        gold: 150,
        souls: 0,
        level: 1,
        exp: 0,
        maxExp: 100,
        str: 10,
        vit: 10,
        int: 10,
        agi: 10,
        cooldownReduction: 0
      };
      this.hero = new Hero(this, -200, -200, 'knight', fallbackStats);
    }
  }

  create(): void {
    this.shopItems = [];

    // 1. Ambient Background
    this.createBackground();

    // 2. Merchant Header & Lore
    this.createMerchantHeader();

    // 3. Top HUD: Hero Stats & Gold
    this.createHeroHUD();

    // 4. Shop Items Shelf (5 dynamic items from ShopSystem)
    this.createShopShelf(false);

    // 5. Action Buttons (Reroll + Leave)
    this.createBottomButtons();

    // 6. Update Real-Time Buttons (Gold check)
    this.updateButtonStates();

    // Transition in
    this.cameras.main.fadeIn(300, 10, 8, 18);
  }

  private createBackground(): void {
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x130e24, 0x130e24, 0x080612, 0x080612, 1);
    bg.fillRect(0, 0, 960, 600);

    // Decorative wall shelf / gothic wooden counter
    const counter = this.add.graphics();
    counter.fillStyle(0x1a152e, 0.7);
    counter.fillRect(0, 130, 960, 360);
    counter.lineStyle(1.5, 0x3d2c5a, 0.8);
    counter.lineBetween(0, 130, 960, 130);
    counter.lineBetween(0, 490, 960, 490);

    // Flanking Torches
    if (this.textures.exists('torch_flame')) {
      const leftTorch = this.add.sprite(35, 100, 'torch_flame').setScale(1.6);
      const rightTorch = this.add.sprite(925, 100, 'torch_flame').setScale(1.6);
      this.tweens.add({
        targets: [leftTorch, rightTorch],
        alpha: { from: 0.8, to: 1 },
        scaleX: { from: 1.5, to: 1.7 },
        duration: 200,
        yoyo: true,
        repeat: -1
      });
    }
  }

  private createMerchantHeader(): void {
    // Merchant Silhouette / Hooded Mage
    if (this.textures.exists('monster_necromancer')) {
      const merchantSprite = this.add.sprite(480, 50, 'monster_necromancer').setScale(1.2);
      merchantSprite.setTint(0x9f7aea);
      this.tweens.add({
        targets: merchantSprite,
        y: 54,
        duration: 1800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    // Title
    const title = this.add.text(480, 82, 'THƯƠNG NHÂN HƯ VÔ', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '22px',
      color: '#d6bcfa',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);
    title.setShadow(0, 2, '#44337a', 6);

    // Merchant Dialogue Box
    this.merchantDialogueText = this.add.text(
      480,
      107,
      '"Chào kẻ lữ hành... Hãy đổi vàng của ngươi lấy sự sống sót nơi vực sâu tăm tối."',
      {
        fontFamily: 'sans-serif',
        fontSize: '12px',
        color: '#a0aec0',
        fontStyle: 'italic'
      }
    ).setOrigin(0.5, 0.5);

    // Check discount relic
    const hasDiscount = RelicManager.hasRelic(this.hero.relics, 'relic_philosopher_stone');
    if (hasDiscount) {
      const discountTag = this.add.text(480, 126, '★ HÒN ĐÁ TRIẾT GIA: GIẢM GIÁ 25% TOÀN BỘ CỬA HÀNG ★', {
        fontFamily: 'sans-serif',
        fontSize: '10.5px',
        color: '#ecc94b',
        fontStyle: 'bold'
      }).setOrigin(0.5, 0.5);

      this.tweens.add({
        targets: discountTag,
        alpha: { from: 0.6, to: 1 },
        yoyo: true,
        duration: 900,
        repeat: -1
      });
    }
  }

  private createHeroHUD(): void {
    const hudBg = this.add.graphics();
    hudBg.fillStyle(0x0e0b17, 0.9);
    hudBg.fillRoundedRect(20, 15, 340, 58, 6);
    hudBg.lineStyle(1.5, 0x4a3660, 1);
    hudBg.strokeRoundedRect(20, 15, 340, 58, 6);

    // Hero Avatar
    if (this.textures.exists(`hero_${this.hero.heroClass}`)) {
      this.add.sprite(48, 44, `hero_${this.hero.heroClass}`).setScale(0.9);
    }

    // Class Name & Stats
    const classNameMap: Record<string, string> = { knight: 'Hiệp Sĩ', mage: 'Pháp Sư', rogue: 'Sát Thủ' };
    this.add.text(78, 22, `${classNameMap[this.hero.heroClass] || 'Anh Hùng'}`, {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#ecc94b',
      fontStyle: 'bold'
    });

    this.hudAtkText = this.add.text(145, 22, `🗡️ ${Math.round(this.hero.stats.atk)} ATK`, {
      fontFamily: 'sans-serif',
      fontSize: '11px',
      color: '#e2e8f0'
    });

    this.hudDefText = this.add.text(220, 22, `🛡️ ${Math.round(this.hero.stats.def)}% DEF`, {
      fontFamily: 'sans-serif',
      fontSize: '11px',
      color: '#e2e8f0'
    });

    // Health Bar
    const hpW = 120;
    const hpH = 10;
    this.add.rectangle(78, 44, hpW, hpH, 0x22172b).setOrigin(0, 0);
    const ratio = Math.max(0, Math.min(1, this.hero.stats.hp / this.hero.stats.maxHp));
    this.hudHpFill = this.add.rectangle(78, 44, hpW * ratio, hpH, 0xe53e3e).setOrigin(0, 0);
    this.hudHpText = this.add.text(78 + hpW / 2, 49, `${Math.round(this.hero.stats.hp)}/${this.hero.stats.maxHp}`, {
      fontFamily: 'sans-serif',
      fontSize: '9px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);

    // Gold Display (Top Right)
    const goldBg = this.add.graphics();
    goldBg.fillStyle(0x0e0b17, 0.9);
    goldBg.fillRoundedRect(760, 15, 180, 58, 6);
    goldBg.lineStyle(1.5, 0xd69e2e, 1);
    goldBg.strokeRoundedRect(760, 15, 180, 58, 6);

    if (this.textures.exists('icon_gold')) {
      this.add.sprite(790, 44, 'icon_gold').setScale(1.0);
    }
    this.add.text(820, 24, 'TÚI VÀNG', {
      fontFamily: 'sans-serif',
      fontSize: '10px',
      color: '#a0aec0'
    });
    this.hudGoldText = this.add.text(820, 38, `${this.hero.stats.gold}`, {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      color: '#f6e05e',
      fontStyle: 'bold'
    });
  }

  private createShopShelf(animate: boolean = false): void {
    // Clear old items
    this.clearShopShelf();

    // Generate 5 dynamic items from ShopSystem
    const hasDiscount = RelicManager.hasRelic(this.hero.relics, 'relic_philosopher_stone');
    const currentSeed = this.rerollCount === 0 ? this.seed : `${this.seed}_reroll_${this.rerollCount}`;
    const itemsToSell: EquipmentItem[] = ShopSystem.generateShopStock(this.floor, currentSeed, hasDiscount);

    const cardW = 166;
    const cardH = 320;
    const startX = 97;
    const spacing = 183;
    const cardY = 302;

    itemsToSell.forEach((item, index) => {
      const x = startX + index * spacing;
      this.createItemCard(item, x, cardY, cardW, cardH, index, animate);
    });
  }

  private clearShopShelf(): void {
    for (const state of this.shopItems) {
      if (state.auraTween) {
        state.auraTween.stop();
      }
      state.container.destroy();
    }
    this.shopItems = [];
  }

  private createItemCard(
    item: EquipmentItem,
    x: number,
    y: number,
    cardW: number,
    cardH: number,
    index: number,
    animate: boolean
  ): void {
    const cardContainer = this.add.container(x, y);

    const rarityConfig = this.getRarityConfig(item.rarity);

    // Glowing Aura effect for Rare, Epic, and Legendary
    let auraGraphic: Phaser.GameObjects.Rectangle | undefined;
    let auraTween: Phaser.Tweens.Tween | undefined;

    if (item.rarity === 'rare') {
      // Rare: Viền lam #3182ce với nhấp nháy hào quang nhẹ
      auraGraphic = this.add.rectangle(0, 0, cardW + 6, cardH + 6, 0x3182ce, 0.18);
      auraGraphic.setStrokeStyle(2, 0x63b3ed, 0.7);
      cardContainer.add(auraGraphic);

      auraTween = this.tweens.add({
        targets: auraGraphic,
        alpha: { from: 0.15, to: 0.5 },
        scaleX: { from: 1.0, to: 1.02 },
        scaleY: { from: 1.0, to: 1.015 },
        duration: 1300,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    } else if (item.rarity === 'epic') {
      // Epic: Viền tím hoàng gia #805ad5 với hào quang rực rỡ
      auraGraphic = this.add.rectangle(0, 0, cardW + 8, cardH + 8, 0x805ad5, 0.25);
      auraGraphic.setStrokeStyle(2.5, 0xb794f4, 0.85);
      cardContainer.add(auraGraphic);

      auraTween = this.tweens.add({
        targets: auraGraphic,
        alpha: { from: 0.22, to: 0.7 },
        scaleX: { from: 1.0, to: 1.03 },
        scaleY: { from: 1.0, to: 1.02 },
        duration: 1100,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    } else if (item.rarity === 'legendary') {
      // Legendary: Viền vàng kim #ecc94b rực rỡ chói lòa
      auraGraphic = this.add.rectangle(0, 0, cardW + 12, cardH + 12, 0xecc94b, 0.38);
      auraGraphic.setStrokeStyle(3, 0xfff08a, 0.95);
      cardContainer.add(auraGraphic);

      auraTween = this.tweens.add({
        targets: auraGraphic,
        alpha: { from: 0.35, to: 0.9 },
        scaleX: { from: 1.0, to: 1.04 },
        scaleY: { from: 1.0, to: 1.03 },
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    // 1. Card Background
    const cardBg = this.add.rectangle(0, 0, cardW, cardH, 0x171228, 0.96);
    cardBg.setStrokeStyle(2.5, rarityConfig.colorNum);
    cardContainer.add(cardBg);

    // 2. Top Header Accent
    const headerAccent = this.add.rectangle(0, -cardH / 2 + 13, cardW - 4, 24, rarityConfig.colorNum, 0.25);
    cardContainer.add(headerAccent);

    // Rarity Badge text
    const categoryName =
      item.id.includes('potion')
        ? 'DƯỢC PHẨM'
        : item.category === 'weapon'
        ? 'VŨ KHÍ'
        : item.category === 'armor'
        ? 'ÁO GIÁP'
        : 'TRANG SỨC';
    const rarityLabel = this.add.text(0, -cardH / 2 + 13, `${rarityConfig.name} • ${categoryName}`, {
      fontFamily: 'sans-serif',
      fontSize: '10px',
      color: rarityConfig.colorHex,
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);
    cardContainer.add(rarityLabel);

    // 3. Item Icon Box
    const iconBox = this.add.rectangle(0, -cardH / 2 + 56, 46, 46, 0x221a36);
    iconBox.setStrokeStyle(1.5, rarityConfig.colorNum);
    cardContainer.add(iconBox);

    const iconKey = this.getItemIconKey(item);
    if (this.textures.exists(iconKey)) {
      const spr = this.add.sprite(0, -cardH / 2 + 56, iconKey);
      spr.setScale(1.15);
      cardContainer.add(spr);
    }

    // 4. Item Name
    const nameText = this.add.text(0, -cardH / 2 + 96, item.name, {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '12px',
      color: '#ffffff',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: cardW - 14 }
    }).setOrigin(0.5, 0.5);
    cardContainer.add(nameText);

    // 5. Synergy Tag (if present)
    let synergyOffset = 0;
    if (item.synergy) {
      synergyOffset = 18;
      const synInfo = SYNERGY_INFO[item.synergy];
      const synBadge = this.add.text(0, -cardH / 2 + 118, `[Hệ ${synInfo?.name || item.synergy}]`, {
        fontFamily: 'sans-serif',
        fontSize: '10px',
        color: synInfo?.color || '#ecc94b',
        fontStyle: 'bold'
      }).setOrigin(0.5, 0.5);
      cardContainer.add(synBadge);
    }

    // 6. Stats Bonus
    const statsDesc = this.formatStatsBonus(item.stats);
    if (statsDesc) {
      const statsText = this.add.text(0, -cardH / 2 + 120 + synergyOffset, statsDesc, {
        fontFamily: 'sans-serif',
        fontSize: '10px',
        color: '#68d391',
        fontStyle: 'bold',
        align: 'center',
        wordWrap: { width: cardW - 16 }
      }).setOrigin(0.5, 0.5);
      cardContainer.add(statsText);
    }

    // 7. Item Description
    const descText = this.add.text(0, -cardH / 2 + 168 + (synergyOffset ? 10 : 0), item.description, {
      fontFamily: 'sans-serif',
      fontSize: '9.5px',
      color: '#cbd5e0',
      wordWrap: { width: cardW - 16 },
      align: 'center',
      lineSpacing: 2
    }).setOrigin(0.5, 0.5);
    cardContainer.add(descText);

    // 8. Cost Display
    const cost = item.cost || 50;
    const costText = this.add.text(0, cardH / 2 - 54, `🪙 ${cost} Vàng`, {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#f6e05e',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);
    cardContainer.add(costText);

    // 9. Buy Button
    const btnW = cardW - 24;
    const btnH = 32;
    const buyButton = this.add.rectangle(0, cardH / 2 - 24, btnW, btnH, 0x276749);
    buyButton.setStrokeStyle(1.5, 0x48bb78);
    buyButton.setInteractive({ useHandCursor: true });
    cardContainer.add(buyButton);

    const buyText = this.add.text(0, cardH / 2 - 24, 'MUA NGAY', {
      fontFamily: 'sans-serif',
      fontSize: '11px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);
    cardContainer.add(buyText);

    const itemState: ShopItemState = {
      item,
      purchased: false,
      container: cardContainer,
      cardBg,
      buyButton,
      buyText,
      auraGraphic,
      auraTween
    };
    this.shopItems.push(itemState);

    // Button interactions
    buyButton.on('pointerover', () => {
      if (!itemState.purchased && this.hero.stats.gold >= (item.cost || 50)) {
        buyButton.setFillStyle(0x2f855a);
        cardContainer.setScale(1.03);
      }
    });

    buyButton.on('pointerout', () => {
      if (!itemState.purchased && this.hero.stats.gold >= (item.cost || 50)) {
        buyButton.setFillStyle(0x276749);
        cardContainer.setScale(1.0);
      }
    });

    buyButton.on('pointerdown', () => {
      this.handleBuyItem(itemState);
    });

    // Animation on entrance (cascade fade & slide in)
    if (animate) {
      cardContainer.setAlpha(0);
      cardContainer.y = y - 25;
      this.tweens.add({
        targets: cardContainer,
        alpha: 1,
        y: y,
        duration: 250,
        delay: index * 60,
        ease: 'Cubic.easeOut'
      });
    }
  }

  private handleBuyItem(state: ShopItemState): void {
    if (state.purchased) return;

    const cost = state.item.cost || 50;
    if (this.hero.stats.gold < cost) {
      // Cannot buy - lack of gold
      AudioSystem.getInstance().playHit();

      // Card shake
      this.tweens.add({
        targets: state.container,
        x: '+=6',
        yoyo: true,
        repeat: 3,
        duration: 45
      });

      this.showToast('Không đủ vàng!', '#e53e3e');
      this.merchantDialogueText.setText('"Hừm... Vàng của ngươi chưa đủ để chạm vào bảo vật này."');
      return;
    }

    // Purchase successful!
    this.hero.stats.gold -= cost;
    state.purchased = true;

    // Apply item: potion heal or equip
    const isPotion = state.item.id.includes('potion') || (state.item.stats.hp && !state.item.stats.maxHp);
    if (isPotion) {
      const healAmount = state.item.stats.hp || 80;
      this.hero.heal(healAmount);
      this.showToast(`Đã dùng ${state.item.name}: +${healAmount} HP!`, '#48bb78');
    } else {
      this.hero.equipItem(state.item);
      this.showToast(`Đã sở hữu: ${state.item.name}!`, '#48bb78');
    }

    // Audio: playCoin()
    AudioSystem.getInstance().playCoin();

    // Particle tia sáng effect
    this.createPurchaseLightBurst(state.container.x, state.container.y, this.getRarityConfig(state.item.rarity).colorNum);

    // Stop aura tween if any and fade aura
    if (state.auraTween) {
      state.auraTween.stop();
    }
    if (state.auraGraphic) {
      state.auraGraphic.setAlpha(0.1);
    }

    // Visual feedback on card
    state.cardBg.setStrokeStyle(1.5, 0x4a5568);
    state.buyButton.setFillStyle(0x2d3748);
    state.buyButton.setStrokeStyle(1, 0x4a5568);
    state.buyButton.disableInteractive();
    state.buyText.setText('ĐÃ MUA ✓');
    state.buyText.setColor('#a0aec0');
    state.container.setAlpha(0.65);

    // Update HUD and real-time button states for all items
    this.updateHUD();
    this.updateButtonStates();

    // Merchant flavor dialogue
    const dialogues = [
      '"Một món hời cho cả hai ta..."',
      '"Món đồ đó đã phong ấn linh hồn của một dũng sĩ cổ đại..."',
      '"Hãy sử dụng nó cẩn trọng trước quái vật đáy vực."',
      '"Thanh kiếm sắc bén chỉ trung thành với kẻ mạnh mẽ."',
      '"Sức mạnh mới sẽ dẫn đường cho ngươi trong cõi tối tăm."'
    ];
    this.merchantDialogueText.setText(Phaser.Math.RND.pick(dialogues));
  }

  private updateButtonStates(): void {
    const currentGold = this.hero.stats.gold;

    // 1. Update each shop item buy button
    for (const state of this.shopItems) {
      if (state.purchased) {
        state.buyButton.setFillStyle(0x2d3748);
        state.buyButton.setStrokeStyle(1, 0x4a5568);
        state.buyText.setText('ĐÃ MUA ✓');
        state.buyText.setColor('#a0aec0');
        state.buyButton.disableInteractive();
        state.container.setAlpha(0.65);
      } else {
        const cost = state.item.cost || 50;
        if (currentGold < cost) {
          // Thiếu vàng: màu xám/đỏ nhạt, text "Thiếu Vàng", không cho click mua
          state.buyButton.setFillStyle(0x3a2727);
          state.buyButton.setStrokeStyle(1.5, 0x6e3c3c);
          state.buyText.setText('Thiếu Vàng');
          state.buyText.setColor('#fc8181');
          state.buyButton.disableInteractive();
          state.container.setScale(1.0);
        } else {
          // Đủ vàng: màu xanh lá rực rỡ, sẵn sàng mua
          state.buyButton.setFillStyle(0x276749);
          state.buyButton.setStrokeStyle(1.5, 0x48bb78);
          state.buyText.setText('MUA NGAY');
          state.buyText.setColor('#ffffff');
          state.buyButton.setInteractive({ useHandCursor: true });
        }
      }
    }

    // 2. Update Reroll button
    if (this.rerollButton && this.rerollButtonText) {
      if (currentGold < this.rerollCost) {
        // Thiếu vàng reroll
        this.rerollButton.setFillStyle(0x2d2b38);
        this.rerollButton.setStrokeStyle(1.5, 0x4a455a);
        this.rerollButtonText.setText(`🎲 ĐỔI HÀNG (${this.rerollCost} Vàng)`);
        this.rerollButtonText.setColor('#718096');
        this.rerollButton.disableInteractive();
      } else {
        // Đủ vàng reroll
        this.rerollButton.setFillStyle(0x553c9a);
        this.rerollButton.setStrokeStyle(2, 0x9f7aea);
        this.rerollButtonText.setText(`🎲 ĐỔI HÀNG (${this.rerollCost} Vàng)`);
        this.rerollButtonText.setColor('#fefcbf');
        this.rerollButton.setInteractive({ useHandCursor: true });
      }
    }
  }

  private handleReroll(): void {
    if (this.hero.stats.gold < this.rerollCost) {
      AudioSystem.getInstance().playHit();
      this.showToast('Không đủ vàng để đổi hàng!', '#e53e3e');
      return;
    }

    const costPaid = this.rerollCost;
    this.hero.stats.gold -= costPaid;
    this.rerollCount++;
    this.rerollCost += 10;

    AudioSystem.getInstance().playCoin();
    this.showToast(`Đã làm mới kệ hàng (-${costPaid} Vàng)!`, '#d6bcfa');

    // Reroll button bounce animation
    this.tweens.add({
      targets: [this.rerollButton, this.rerollButtonText, this.rerollSubText],
      scale: 1.08,
      yoyo: true,
      duration: 120
    });

    const rerollQuotes = [
      '"Đổi vận may sao? Hãy xem những món đồ mới này..."',
      '"Hàng mới vừa cập bến từ bóng tối hư không..."',
      '"Có thể lần này định mệnh sẽ mỉm cười với ngươi."',
      '"Kho tàng vô tận, miễn là ngươi còn đủ vàng!"'
    ];
    this.merchantDialogueText.setText(Phaser.Math.RND.pick(rerollQuotes));

    // Update HUD
    this.updateHUD();

    // Re-create the shelf with entrance animation
    this.createShopShelf(true);

    if (this.rerollSubText) {
      this.rerollSubText.setText(`Lần tiếp theo: ${this.rerollCost} Vàng`);
    }

    // Refresh buttons state
    this.updateButtonStates();
  }

  private createPurchaseLightBurst(x: number, y: number, colorNum: number): void {
    // 1. Expanding shockwave ring
    const ring = this.add.circle(x, y, 15, colorNum, 0.8);
    ring.setStrokeStyle(3, 0xffffff, 1);
    ring.setDepth(100);
    this.tweens.add({
      targets: ring,
      scale: 4.5,
      alpha: 0,
      duration: 480,
      ease: 'Quad.easeOut',
      onComplete: () => ring.destroy()
    });

    // 2. Radial Light Beams / Rays
    const rayCount = 12;
    for (let i = 0; i < rayCount; i++) {
      const angle = (Math.PI * 2 * i) / rayCount + (Math.random() - 0.5) * 0.2;
      const length = 50 + Math.random() * 60;
      const ray = this.add.line(
        x,
        y,
        0,
        0,
        Math.cos(angle) * length,
        Math.sin(angle) * length,
        0xffffff
      );
      ray.setLineWidth(2.5, 0.5);
      ray.setDepth(101);

      this.tweens.add({
        targets: ray,
        alpha: 0,
        scaleX: 1.4,
        scaleY: 1.4,
        duration: 380 + Math.random() * 150,
        ease: 'Cubic.easeOut',
        onComplete: () => ray.destroy()
      });
    }

    // 3. Floating sparkling particles (Tia sáng / Đốm sao)
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 30 + Math.random() * 90;
      const sparkColor = Math.random() > 0.4 ? colorNum : 0xffffff;
      const spark = this.add.circle(x, y, 2.5 + Math.random() * 2, sparkColor, 1);
      spark.setDepth(102);

      this.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist - 25,
        alpha: 0,
        scale: 0.2,
        duration: 450 + Math.random() * 250,
        ease: 'Cubic.easeOut',
        onComplete: () => spark.destroy()
      });
    }

    // 4. Center flash starburst
    const flash = this.add.rectangle(x, y, 50, 50, 0xffffff, 0.9);
    flash.setRotation(Math.PI / 4);
    flash.setDepth(103);
    this.tweens.add({
      targets: flash,
      scale: 2.2,
      alpha: 0,
      duration: 280,
      ease: 'Quad.easeOut',
      onComplete: () => flash.destroy()
    });
  }

  private updateHUD(): void {
    if (this.hudGoldText) {
      this.hudGoldText.setText(`${this.hero.stats.gold}`);
    }
    if (this.hudHpText && this.hudHpFill) {
      const ratio = Math.max(0, Math.min(1, this.hero.stats.hp / this.hero.stats.maxHp));
      this.hudHpFill.width = 120 * ratio;
      this.hudHpText.setText(`${Math.round(this.hero.stats.hp)}/${this.hero.stats.maxHp}`);
    }
    if (this.hudAtkText) {
      this.hudAtkText.setText(`🗡️ ${Math.round(this.hero.stats.atk)} ATK`);
    }
    if (this.hudDefText) {
      this.hudDefText.setText(`🛡️ ${Math.round(this.hero.stats.def)}% DEF`);
    }
  }

  private showToast(message: string, color: string): void {
    const toast = this.add.text(480, 480, message, {
      fontFamily: 'sans-serif',
      fontSize: '15px',
      color,
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);
    toast.setShadow(0, 2, '#000000', 4);
    toast.setDepth(120);

    this.tweens.add({
      targets: toast,
      y: 450,
      alpha: { from: 1, to: 0 },
      duration: 1200,
      onComplete: () => {
        toast.destroy();
      }
    });
  }

  private createBottomButtons(): void {
    // 1. Reroll Button (Left of center)
    const rerollW = 250;
    const rerollH = 46;
    const rerollX = 330;
    const rerollY = 548;

    this.rerollButton = this.add.rectangle(rerollX, rerollY - 4, rerollW, rerollH, 0x553c9a);
    this.rerollButton.setStrokeStyle(2, 0x9f7aea);
    this.rerollButton.setInteractive({ useHandCursor: true });

    this.rerollButtonText = this.add.text(rerollX, rerollY - 10, `🎲 ĐỔI HÀNG (${this.rerollCost} Vàng)`, {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '13px',
      color: '#fefcbf',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);

    this.rerollSubText = this.add.text(rerollX, rerollY + 8, `Lần tiếp theo: +10 Vàng`, {
      fontFamily: 'sans-serif',
      fontSize: '10px',
      color: '#d6bcfa'
    }).setOrigin(0.5, 0.5);

    this.rerollButton.on('pointerover', () => {
      if (this.hero.stats.gold >= this.rerollCost) {
        this.rerollButton.setFillStyle(0x6b46c1);
        this.rerollButton.setScale(1.03);
        this.rerollButtonText.setScale(1.03);
        this.rerollSubText.setScale(1.03);
      }
    });

    this.rerollButton.on('pointerout', () => {
      if (this.hero.stats.gold >= this.rerollCost) {
        this.rerollButton.setFillStyle(0x553c9a);
        this.rerollButton.setScale(1.0);
        this.rerollButtonText.setScale(1.0);
        this.rerollSubText.setScale(1.0);
      }
    });

    this.rerollButton.on('pointerdown', () => {
      this.handleReroll();
    });

    // 2. Leave Button (Right of center)
    const leaveW = 280;
    const leaveH = 46;
    const leaveX = 630;
    const leaveY = 548;

    const leaveBg = this.add.rectangle(leaveX, leaveY - 4, leaveW, leaveH, 0x312e81);
    leaveBg.setStrokeStyle(2, 0x818cf8);
    leaveBg.setInteractive({ useHandCursor: true });

    const leaveText = this.add.text(leaveX, leaveY - 4, 'TIẾP TỤC CUỘC HÀNH TRÌNH ➔', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '13px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);

    leaveBg.on('pointerover', () => {
      leaveBg.setFillStyle(0x3730a3);
      leaveBg.setScale(1.03);
      leaveText.setScale(1.03);
    });

    leaveBg.on('pointerout', () => {
      leaveBg.setFillStyle(0x312e81);
      leaveBg.setScale(1.0);
      leaveText.setScale(1.0);
    });

    leaveBg.on('pointerdown', () => {
      AudioSystem.getInstance().playClick();

      // Mark shop node as completed and unlock connected nodes
      if (this.node) {
        completeDungeonNode(this.node, this.dungeonNodes);
      }

      this.cameras.main.fadeOut(250, 0, 0, 0);
      this.time.delayedCall(250, () => {
        this.scene.start('MapScene', {
          hero: this.hero,
          dungeonNodes: this.dungeonNodes,
          floor: this.floor,
          seed: this.seed
        });
      });
    });
  }

  private getItemIconKey(item: EquipmentItem): string {
    if (item.icon && this.textures.exists(item.icon)) return item.icon;
    const id = item.id.toLowerCase();
    if (id.includes('potion_hp') || id.includes('health_potion') || id.includes('vitality') || id.includes('rejuvenation')) return 'icon_potion_hp';
    if (id.includes('potion_speed') || id.includes('speed_potion')) return 'icon_potion_speed';
    if (id.includes('bow')) return 'icon_bow_frost';
    if (id.includes('hammer')) return 'icon_hammer_thunder';
    if (id.includes('scythe')) return 'icon_scythe_dark';
    if (id.includes('dagger')) return 'icon_daggers_poison';
    if (id.includes('staff') || id.includes('orb')) return 'icon_staff_arcane';
    if (id.includes('holy_sword') || id.includes('ragnarok')) return 'icon_sword_holy';
    if (id.includes('iron') || id.includes('broadsword') || id.includes('scimitar')) return 'icon_sword_iron';
    if (id.includes('titan') || id.includes('plate') || id.includes('cuirass')) return 'icon_plate_titan';
    if (id.includes('robe')) return 'icon_robe_void';
    if (id.includes('cloak') || id.includes('tunic')) return 'icon_cloak_ranger';
    if (id.includes('aegis')) return 'icon_shield_aegis';
    if (id.includes('tower_shield') || id.includes('oak_shield') || id.includes('spiked_mail')) return 'icon_shield_tower';
    if (id.includes('scroll')) return 'icon_scroll_lightning';
    if (id.includes('gold') || id.includes('coin')) return 'icon_gold_coin';
    if (id.includes('gem') || id.includes('ring') || id.includes('amulet') || id.includes('charm') || id.includes('pendant')) return 'icon_soul_gem';

    if (item.synergy === 'fire') return 'icon_fire';
    if (item.synergy === 'frost') return 'icon_frost';
    if (item.synergy === 'lightning') return 'icon_lightning';
    if (item.synergy === 'vampiric') return 'icon_vampire';
    if (item.synergy === 'thorns') return 'icon_thorns';
    if (item.synergy === 'summoner') return 'icon_summon';
    if (item.category === 'weapon') return 'icon_sword_iron';
    if (item.category === 'armor') return 'icon_shield_tower';
    if (item.stats?.critRate || item.stats?.critDmg) return 'icon_crit';
    if (item.stats?.speed) return 'icon_boot';
    return 'icon_sword_iron';
  }

  private getRarityConfig(rarity: string): { name: string; colorNum: number; colorHex: string } {
    switch (rarity) {
      case 'common':
        return { name: 'Thường', colorNum: 0xa0aec0, colorHex: '#a0aec0' };
      case 'rare':
        return { name: 'Hiếm', colorNum: 0x3182ce, colorHex: '#3182ce' };
      case 'epic':
        return { name: 'Sử Thi', colorNum: 0x805ad5, colorHex: '#805ad5' };
      case 'legendary':
        return { name: 'Huyền Thoại', colorNum: 0xecc94b, colorHex: '#ecc94b' };
      default:
        return { name: 'Thường', colorNum: 0xa0aec0, colorHex: '#a0aec0' };
    }
  }

  private formatStatsBonus(stats?: Partial<HeroStats>): string {
    if (!stats) return '';
    const parts: string[] = [];
    if (stats.atk) parts.push(`+${stats.atk} ATK`);
    if (stats.maxHp) parts.push(`+${stats.maxHp} HP`);
    if (stats.hp && !stats.maxHp) parts.push(`Hồi ${stats.hp} HP`);
    if (stats.def) parts.push(`+${stats.def}% Giáp`);
    if (stats.attackSpeed) parts.push(`+${Math.round(stats.attackSpeed * 100)}% Tốc Đánh`);
    if (stats.critRate) parts.push(`+${Math.round(stats.critRate * 100)}% Bạo Kích`);
    if (stats.critDmg) parts.push(`+${Math.round(stats.critDmg * 100)}% ST Bạo`);
    if (stats.lifeSteal) parts.push(`+${Math.round(stats.lifeSteal * 100)}% Hút Máu`);
    if (stats.dodgeRate) parts.push(`+${Math.round(stats.dodgeRate * 100)}% Né`);
    if (stats.thorns) parts.push(`Phản ${stats.thorns} Gai`);
    if (stats.speed) parts.push(`+${stats.speed} Tốc`);
    if (stats.cooldownReduction) parts.push(`-${Math.round(stats.cooldownReduction * 100)}% Hồi Chiêu`);
    return parts.join(' | ');
  }
}
