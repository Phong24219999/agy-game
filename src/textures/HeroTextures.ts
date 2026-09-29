import Phaser from 'phaser';
import { createTextureFromCanvas } from './TextureHelper';

export function registerHeroTextures(scene: Phaser.Scene): void {
  // 1. Knight (36x44)
  createTextureFromCanvas(scene, 'hero_knight', 36, 44, (ctx) => {
    // Body / Armor
    ctx.fillStyle = '#4a5568';
    ctx.fillRect(10, 16, 16, 20); // breastplate
    ctx.fillStyle = '#718096';
    ctx.fillRect(12, 18, 12, 16);

    // Red Cape
    ctx.fillStyle = '#9b2c2c';
    ctx.fillRect(6, 18, 5, 20);
    ctx.fillRect(25, 18, 5, 20);

    // Helmet & Visor
    ctx.fillStyle = '#a0aec0';
    ctx.fillRect(10, 6, 16, 12);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(12, 8, 12, 8);
    ctx.fillStyle = '#1a202c';
    ctx.fillRect(12, 11, 12, 3); // visor slit
    ctx.fillStyle = '#e53e3e';
    ctx.fillRect(15, 2, 6, 5); // red plume

    // Sword
    ctx.fillStyle = '#cbd5e0';
    ctx.fillRect(28, 6, 4, 26); // blade
    ctx.fillStyle = '#ecc94b';
    ctx.fillRect(26, 32, 8, 3); // hilt
    ctx.fillStyle = '#744210';
    ctx.fillRect(29, 35, 2, 6); // handle

    // Shield
    ctx.fillStyle = '#2b6cb0';
    ctx.fillRect(2, 20, 8, 14);
    ctx.fillStyle = '#ecc94b';
    ctx.fillRect(4, 22, 4, 10);

    // Legs / Boots
    ctx.fillStyle = '#2d3748';
    ctx.fillRect(12, 36, 5, 8);
    ctx.fillRect(19, 36, 5, 8);
  });

  // 2. Mage (36x44)
  createTextureFromCanvas(scene, 'hero_mage', 36, 44, (ctx) => {
    // Purple Robe
    ctx.fillStyle = '#44337a';
    ctx.fillRect(10, 16, 16, 24);
    ctx.fillStyle = '#6b46c1';
    ctx.fillRect(12, 18, 12, 22);

    // Hood
    ctx.fillStyle = '#553c9a';
    ctx.fillRect(10, 6, 16, 13);
    ctx.fillStyle = '#1a202c';
    ctx.fillRect(12, 10, 12, 7); // dark shadowy face
    ctx.fillStyle = '#d6bcfa';
    ctx.fillRect(14, 12, 2, 2); // glowing purple eye left
    ctx.fillRect(20, 12, 2, 2); // glowing purple eye right

    // Golden Trim
    ctx.fillStyle = '#ecc94b';
    ctx.fillRect(16, 18, 4, 22);

    // Magic Staff
    ctx.fillStyle = '#744210';
    ctx.fillRect(28, 8, 3, 34); // staff wood
    // Orb on staff
    ctx.fillStyle = '#b794f4';
    ctx.beginPath();
    ctx.arc(29, 6, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(28, 5, 2, 0, Math.PI * 2);
    ctx.fill();
  });

  // 3. Rogue (36x44)
  createTextureFromCanvas(scene, 'hero_rogue', 36, 44, (ctx) => {
    // Dark Leather Garb
    ctx.fillStyle = '#1a202c';
    ctx.fillRect(10, 16, 16, 20);
    ctx.fillStyle = '#2d3748';
    ctx.fillRect(12, 18, 12, 16);

    // Cloak Hood
    ctx.fillStyle = '#234e52';
    ctx.fillRect(10, 6, 16, 12);
    ctx.fillStyle = '#171923';
    ctx.fillRect(12, 10, 12, 7);
    ctx.fillStyle = '#48bb78';
    ctx.fillRect(14, 12, 2, 2); // green glowing eye
    ctx.fillRect(20, 12, 2, 2);

    // Dual Poison Daggers
    ctx.fillStyle = '#48bb78';
    ctx.fillRect(5, 18, 3, 14); // left poisoned dagger
    ctx.fillRect(28, 18, 3, 14); // right poisoned dagger
    ctx.fillStyle = '#cbd5e0';
    ctx.fillRect(6, 19, 1, 10);
    ctx.fillRect(29, 19, 1, 10);

    // Boots
    ctx.fillStyle = '#171923';
    ctx.fillRect(12, 36, 5, 8);
    ctx.fillRect(19, 36, 5, 8);
  });

  // 4. Skeleton Minion (24x30)
  createTextureFromCanvas(scene, 'minion_skeleton', 24, 30, (ctx) => {
    ctx.fillStyle = '#cbd5e0';
    ctx.fillRect(7, 3, 10, 9); // skull
    ctx.fillStyle = '#1a202c';
    ctx.fillRect(9, 6, 2, 2); // eye hole
    ctx.fillRect(13, 6, 2, 2);
    // Ribs
    ctx.fillStyle = '#a0aec0';
    ctx.fillRect(9, 13, 6, 9);
    ctx.fillStyle = '#cbd5e0';
    ctx.fillRect(6, 15, 12, 2);
    ctx.fillRect(7, 18, 10, 2);
    // Tiny bone sword
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(19, 12, 2, 12);
    // Legs
    ctx.fillStyle = '#a0aec0';
    ctx.fillRect(8, 22, 2, 7);
    ctx.fillRect(14, 22, 2, 7);
  });
}
