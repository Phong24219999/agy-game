import Phaser from 'phaser';

export class DamageTextManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public showDamage(x: number, y: number, amount: number, isCrit: boolean = false, type: 'phys' | 'fire' | 'frost' | 'thorns' = 'phys'): void {
    let color = '#ffffff';
    let size = '16px';
    let text = Math.round(amount).toString();

    if (type === 'fire') {
      color = '#ff6622';
      text = `🔥${text}`;
    } else if (type === 'frost') {
      color = '#44ddff';
      text = `❄️${text}`;
    } else if (type === 'thorns') {
      color = '#aa55ff';
      text = `🛡️${text}`;
    }

    if (isCrit) {
      color = '#ffd700';
      size = '22px';
      text = `💥 ${text}!`;
    }

    // Offset randomly slightly to prevent overlapping numbers
    const startX = x + (Math.random() * 24 - 12);
    const startY = y + (Math.random() * 12 - 6);

    const dmgText = this.scene.add.text(startX, startY, text, {
      fontFamily: 'sans-serif',
      fontSize: size,
      fontStyle: isCrit ? 'bold' : 'normal',
      color: color,
      stroke: '#000000',
      strokeThickness: isCrit ? 4 : 3
    }).setOrigin(0.5);

    dmgText.setDepth(100);

    this.scene.tweens.add({
      targets: dmgText,
      y: startY - (isCrit ? 45 : 30),
      x: startX + (Math.random() * 20 - 10),
      alpha: 0,
      scale: isCrit ? 1.3 : 1.1,
      duration: isCrit ? 900 : 700,
      ease: 'Back.easeOut',
      onComplete: () => {
        dmgText.destroy();
      }
    });
  }

  public showHeal(x: number, y: number, amount: number): void {
    const text = `+${Math.round(amount)} HP`;
    const healText = this.scene.add.text(x, y - 10, text, {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#33ff77',
      stroke: '#003311',
      strokeThickness: 3
    }).setOrigin(0.5);

    healText.setDepth(100);

    this.scene.tweens.add({
      targets: healText,
      y: y - 40,
      alpha: 0,
      duration: 800,
      ease: 'Power1',
      onComplete: () => {
        healText.destroy();
      }
    });
  }

  public showDodge(x: number, y: number): void {
    const dodgeText = this.scene.add.text(x, y - 10, 'NÉ ĐÒN!', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#55eeff',
      stroke: '#002233',
      strokeThickness: 3
    }).setOrigin(0.5);

    dodgeText.setDepth(100);

    this.scene.tweens.add({
      targets: dodgeText,
      y: y - 35,
      alpha: 0,
      duration: 700,
      ease: 'Power2',
      onComplete: () => {
        dodgeText.destroy();
      }
    });
  }
}
