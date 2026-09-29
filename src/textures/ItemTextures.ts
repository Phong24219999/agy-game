import Phaser from 'phaser';
import { createTextureFromCanvas } from './TextureHelper';

export function registerItemTextures(scene: Phaser.Scene): void {
  const icons: { key: string; color: string; draw: (ctx: CanvasRenderingContext2D) => void }[] = [
    {
      key: 'icon_sword',
      color: '#e53e3e',
      draw: (ctx) => {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(6, 26);
        ctx.lineTo(26, 6);
        ctx.stroke();
        ctx.fillStyle = '#ecc94b';
        ctx.fillRect(9, 21, 6, 2);
      }
    },
    {
      key: 'icon_shield',
      color: '#3182ce',
      draw: (ctx) => {
        ctx.fillStyle = '#63b3ed';
        ctx.beginPath();
        ctx.moveTo(6, 6);
        ctx.lineTo(26, 6);
        ctx.lineTo(26, 18);
        ctx.lineTo(16, 28);
        ctx.lineTo(6, 18);
        ctx.closePath();
        ctx.fill();
      }
    },
    {
      key: 'icon_fire',
      color: '#dd6b20',
      draw: (ctx) => {
        ctx.fillStyle = '#f6ad55';
        ctx.beginPath();
        ctx.arc(16, 18, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff5f5';
        ctx.beginPath();
        ctx.arc(16, 18, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    {
      key: 'icon_frost',
      color: '#319795',
      draw: (ctx) => {
        ctx.strokeStyle = '#81e6d9';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(16, 4);
        ctx.lineTo(16, 28);
        ctx.moveTo(4, 16);
        ctx.lineTo(28, 16);
        ctx.moveTo(7, 7);
        ctx.lineTo(25, 25);
        ctx.moveTo(25, 7);
        ctx.lineTo(7, 25);
        ctx.stroke();
      }
    },
    {
      key: 'icon_lightning',
      color: '#d69e2e',
      draw: (ctx) => {
        ctx.fillStyle = '#faf089';
        ctx.beginPath();
        ctx.moveTo(18, 4);
        ctx.lineTo(8, 17);
        ctx.lineTo(15, 17);
        ctx.lineTo(13, 28);
        ctx.lineTo(24, 14);
        ctx.lineTo(17, 14);
        ctx.closePath();
        ctx.fill();
      }
    },
    {
      key: 'icon_vampire',
      color: '#9b2c2c',
      draw: (ctx) => {
        ctx.fillStyle = '#feb2b2';
        ctx.beginPath();
        ctx.arc(16, 16, 8, 0, Math.PI * 2);
        ctx.fill();
        // drops
        ctx.fillStyle = '#e53e3e';
        ctx.fillRect(11, 14, 3, 7);
        ctx.fillRect(18, 14, 3, 7);
      }
    },
    {
      key: 'icon_thorns',
      color: '#276749',
      draw: (ctx) => {
        ctx.strokeStyle = '#9ae6b4';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(16, 16, 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#9ae6b4';
        ctx.fillRect(15, 2, 2, 4);
        ctx.fillRect(15, 26, 2, 4);
        ctx.fillRect(2, 15, 4, 2);
        ctx.fillRect(26, 15, 4, 2);
      }
    },
    {
      key: 'icon_summon',
      color: '#6b46c1',
      draw: (ctx) => {
        ctx.fillStyle = '#d6bcfa';
        ctx.fillRect(10, 8, 12, 10);
        ctx.fillStyle = '#1a202c';
        ctx.fillRect(12, 11, 2, 2);
        ctx.fillRect(18, 11, 2, 2);
        ctx.fillStyle = '#805ad5';
        ctx.fillRect(12, 20, 8, 4);
      }
    },
    {
      key: 'icon_crit',
      color: '#b7791f',
      draw: (ctx) => {
        ctx.fillStyle = '#f6e05e';
        ctx.beginPath();
        ctx.moveTo(16, 4);
        ctx.lineTo(20, 12);
        ctx.lineTo(28, 16);
        ctx.lineTo(20, 20);
        ctx.lineTo(16, 28);
        ctx.lineTo(12, 20);
        ctx.lineTo(4, 16);
        ctx.lineTo(12, 12);
        ctx.closePath();
        ctx.fill();
      }
    },
    {
      key: 'icon_boot',
      color: '#2b6cb0',
      draw: (ctx) => {
        ctx.fillStyle = '#63b3ed';
        ctx.fillRect(8, 8, 7, 14);
        ctx.fillRect(8, 18, 16, 6);
      }
    },
    {
      key: 'icon_gold',
      color: '#d69e2e',
      draw: (ctx) => {
        ctx.fillStyle = '#ecc94b';
        ctx.beginPath();
        ctx.arc(16, 16, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#b7791f';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('G', 16, 16);
      }
    },
    {
      key: 'icon_soul',
      color: '#805ad5',
      draw: (ctx) => {
        ctx.fillStyle = '#b794f4';
        ctx.beginPath();
        ctx.moveTo(16, 6);
        ctx.lineTo(24, 16);
        ctx.lineTo(16, 26);
        ctx.lineTo(8, 16);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(15, 14, 2, 4);
      }
    }
  ];

  icons.forEach((ic) => {
    createTextureFromCanvas(scene, ic.key, 32, 32, (ctx) => {
      // Rounded background frame
      ctx.fillStyle = '#1a1829';
      ctx.fillRect(0, 0, 32, 32);
      ctx.strokeStyle = ic.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, 30, 30);
      ic.draw(ctx);
    });
  });
}
