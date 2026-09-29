import Phaser from 'phaser';
import { createTextureFromCanvas } from './TextureHelper';

export function registerMonsterTextures(scene: Phaser.Scene): void {
  // 1. Skeleton Warrior (32x40)
  createTextureFromCanvas(scene, 'monster_skeleton', 32, 40, (ctx) => {
    // Skull with cracked horn
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(10, 4, 12, 10);
    ctx.fillStyle = '#9b2c2c';
    ctx.fillRect(12, 7, 2, 2); // glowing red eyes
    ctx.fillRect(18, 7, 2, 2);
    // Ribcage
    ctx.fillStyle = '#cbd5e0';
    ctx.fillRect(10, 15, 12, 13);
    ctx.fillStyle = '#4a5568';
    ctx.fillRect(12, 17, 8, 2);
    ctx.fillRect(12, 21, 8, 2);
    // Rusted Sword
    ctx.fillStyle = '#9c4221';
    ctx.fillRect(24, 10, 3, 20);
    // Legs
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(11, 28, 3, 10);
    ctx.fillRect(18, 28, 3, 10);
  });

  // 2. Slime (30x26)
  createTextureFromCanvas(scene, 'monster_slime', 30, 26, (ctx) => {
    ctx.fillStyle = '#38a169';
    ctx.beginPath();
    ctx.ellipse(15, 15, 13, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#68d391';
    ctx.beginPath();
    ctx.ellipse(13, 12, 10, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Slime cute eyes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(10, 11, 3, 4);
    ctx.fillRect(18, 11, 3, 4);
    ctx.fillStyle = '#1a202c';
    ctx.fillRect(11, 12, 2, 2);
    ctx.fillRect(19, 12, 2, 2);
  });

  // 3. Void Imp (28x32)
  createTextureFromCanvas(scene, 'monster_imp', 28, 32, (ctx) => {
    // Purple demon body
    ctx.fillStyle = '#553c9a';
    ctx.fillRect(8, 10, 12, 14);

    // Horns
    ctx.fillStyle = '#9b2c2c';
    ctx.fillRect(7, 2, 3, 6);
    ctx.fillRect(18, 2, 3, 6);

    // Bat wings
    ctx.fillStyle = '#322659';
    ctx.fillRect(1, 10, 7, 10);
    ctx.fillRect(20, 10, 7, 10);

    // Yellow fiery eyes
    ctx.fillStyle = '#ecc94b';
    ctx.fillRect(10, 13, 2, 2);
    ctx.fillRect(16, 13, 2, 2);

    // Fireball in hand
    ctx.fillStyle = '#ff6600';
    ctx.beginPath();
    ctx.arc(22, 24, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // 4. Necromancer (36x44)
  createTextureFromCanvas(scene, 'monster_necromancer', 36, 44, (ctx) => {
    // Dark emerald robe
    ctx.fillStyle = '#1c4532';
    ctx.fillRect(10, 14, 16, 26);
    ctx.fillStyle = '#22543d';
    ctx.fillRect(12, 16, 12, 24);

    // Skull face
    ctx.fillStyle = '#edf2f7';
    ctx.fillRect(12, 6, 12, 10);
    ctx.fillStyle = '#000000';
    ctx.fillRect(14, 9, 2, 2);
    ctx.fillRect(20, 9, 2, 2);

    // Green soul staff
    ctx.fillStyle = '#4a5568';
    ctx.fillRect(28, 6, 3, 36);
    ctx.fillStyle = '#48bb78';
    ctx.beginPath();
    ctx.arc(29, 6, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // 5. Golem (44x50)
  createTextureFromCanvas(scene, 'monster_golem', 44, 50, (ctx) => {
    // Massive stone body
    ctx.fillStyle = '#2d3748';
    ctx.fillRect(8, 12, 28, 26);
    ctx.fillStyle = '#4a5568';
    ctx.fillRect(10, 14, 24, 22);

    // Head
    ctx.fillStyle = '#1a202c';
    ctx.fillRect(14, 4, 16, 10);
    // Glowing rune eye
    ctx.fillStyle = '#f6ad55';
    ctx.fillRect(18, 7, 8, 3);

    // Magma cracks
    ctx.fillStyle = '#dd6b20';
    ctx.fillRect(14, 20, 4, 12);
    ctx.fillRect(24, 24, 6, 4);

    // Huge Stone Fists
    ctx.fillStyle = '#2d3748';
    ctx.fillRect(2, 20, 7, 16);
    ctx.fillRect(35, 20, 7, 16);

    // Legs
    ctx.fillRect(12, 38, 8, 10);
    ctx.fillRect(24, 38, 8, 10);
  });

  // 6. Dungeon Floor Boss - "Chúa Tể Hư Vô" (64x70)
  createTextureFromCanvas(scene, 'monster_boss', 64, 70, (ctx) => {
    // Void Wings/Aura
    ctx.fillStyle = '#2d1b4e';
    ctx.beginPath();
    ctx.moveTo(32, 20);
    ctx.lineTo(4, 5);
    ctx.lineTo(8, 45);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(32, 20);
    ctx.lineTo(60, 5);
    ctx.lineTo(56, 45);
    ctx.fill();

    // Armor Body
    ctx.fillStyle = '#1a102f';
    ctx.fillRect(18, 20, 28, 34);
    ctx.fillStyle = '#44337a';
    ctx.fillRect(21, 24, 22, 28);

    // Crimson Horns
    ctx.fillStyle = '#e53e3e';
    ctx.beginPath();
    ctx.moveTo(22, 10);
    ctx.lineTo(14, 0);
    ctx.lineTo(26, 14);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(42, 10);
    ctx.lineTo(50, 0);
    ctx.lineTo(38, 14);
    ctx.fill();

    // Mask & Glowing Runes
    ctx.fillStyle = '#0f081d';
    ctx.fillRect(22, 8, 20, 14);
    ctx.fillStyle = '#9f7aea';
    ctx.fillRect(25, 12, 4, 4); // eye left
    ctx.fillRect(35, 12, 4, 4); // eye right
    ctx.fillStyle = '#e53e3e';
    ctx.fillRect(30, 16, 4, 2);

    // Void Greatsword
    ctx.fillStyle = '#805ad5';
    ctx.fillRect(50, 10, 6, 50);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(52, 14, 2, 40);

    // Spiked Pauldrons
    ctx.fillStyle = '#553c9a';
    ctx.fillRect(12, 18, 8, 8);
    ctx.fillRect(44, 18, 8, 8);
  });
}
