import Phaser from 'phaser';
import { createTextureFromCanvas } from './TextureHelper';

export function registerEnvironmentTextures(scene: Phaser.Scene): void {
  // ==========================================
  // TILES & PROPS
  // ==========================================
  // Floor Tile (32x32)
  createTextureFromCanvas(scene, 'tile_floor', 32, 32, (ctx) => {
    ctx.fillStyle = '#161424';
    ctx.fillRect(0, 0, 32, 32);
    ctx.strokeStyle = '#221e35';
    ctx.lineWidth = 1;
    ctx.strokeRect(1, 1, 30, 30);
    // Small cobblestone cracks
    ctx.fillStyle = '#1f1b30';
    ctx.fillRect(4, 4, 10, 10);
    ctx.fillRect(16, 16, 12, 12);
  });

  // Wall Tile (32x32)
  createTextureFromCanvas(scene, 'tile_wall', 32, 32, (ctx) => {
    ctx.fillStyle = '#201a30';
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillStyle = '#2c2442';
    ctx.fillRect(2, 2, 28, 13);
    ctx.fillRect(2, 17, 28, 13);
    ctx.strokeStyle = '#120f1c';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, 32, 32);
  });

  // Stone Pillar (32x48)
  createTextureFromCanvas(scene, 'tile_pillar', 32, 48, (ctx) => {
    ctx.fillStyle = '#2c253d';
    ctx.fillRect(4, 8, 24, 32);
    ctx.fillStyle = '#3c3253';
    ctx.fillRect(2, 2, 28, 8); // top capital
    ctx.fillRect(2, 38, 28, 8); // base
  });

  // Torch (16x24)
  createTextureFromCanvas(scene, 'torch_flame', 16, 24, (ctx) => {
    // Sconce
    ctx.fillStyle = '#744210';
    ctx.fillRect(6, 12, 4, 10);
    // Flame
    ctx.fillStyle = '#dd6b20';
    ctx.beginPath();
    ctx.arc(8, 8, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f6e05e';
    ctx.beginPath();
    ctx.arc(8, 7, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // Chest Closed (32x28)
  createTextureFromCanvas(scene, 'chest_closed', 32, 28, (ctx) => {
    ctx.fillStyle = '#744210';
    ctx.fillRect(3, 6, 26, 20);
    ctx.fillStyle = '#975a16';
    ctx.fillRect(5, 8, 22, 16);
    // Gold rims & lock
    ctx.fillStyle = '#d69e2e';
    ctx.fillRect(3, 6, 26, 3);
    ctx.fillRect(14, 12, 4, 6);
  });

  // Chest Open (32x28)
  createTextureFromCanvas(scene, 'chest_open', 32, 28, (ctx) => {
    ctx.fillStyle = '#52300b';
    ctx.fillRect(3, 10, 26, 16);
    ctx.fillStyle = '#ecc94b';
    // Golden treasures glowing inside
    ctx.fillRect(6, 11, 20, 6);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(10, 12, 3, 3);
    ctx.fillRect(18, 13, 2, 2);
  });

  // Altar / Forge (40x36)
  createTextureFromCanvas(scene, 'altar', 40, 36, (ctx) => {
    ctx.fillStyle = '#2b233a';
    ctx.fillRect(4, 12, 32, 22);
    ctx.fillStyle = '#3e3352';
    ctx.fillRect(2, 8, 36, 6);
    // Sacred Flame
    ctx.fillStyle = '#3182ce';
    ctx.beginPath();
    ctx.arc(20, 6, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#90cdf4';
    ctx.beginPath();
    ctx.arc(20, 5, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // ==========================================
  // BATTLE ARENA BACKGROUNDS (960x600)
  // ==========================================
  
  // Floor 1 Arena: Ancient Crypt / Catacombs (bg_catacombs)
  createTextureFromCanvas(scene, 'bg_catacombs', 960, 600, (ctx) => {
    // Deep dark stone base
    ctx.fillStyle = '#0c0a14';
    ctx.fillRect(0, 0, 960, 600);

    // Stone flagstone grid with subtle variation
    for (let y = 0; y < 600; y += 40) {
      for (let x = 0; x < 960; x += 40) {
        const hash = (x * 13 + y * 29) % 5;
        ctx.fillStyle = hash === 0 ? '#141120' : hash === 1 ? '#181427' : hash === 2 ? '#110e1b' : '#161324';
        ctx.fillRect(x + 1, y + 1, 38, 38);
        ctx.strokeStyle = '#09070f';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, 40, 40);

        // Random moss patches
        if ((x + y) % 17 === 0) {
          ctx.fillStyle = '#1c3328';
          ctx.fillRect(x + 6, y + 8, 12, 8);
        }
      }
    }

    // Ancient Arena Circle in center
    ctx.strokeStyle = '#2d2442';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(480, 320, 240, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#1e182e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(480, 320, 160, 0, Math.PI * 2);
    ctx.stroke();

    // Runic arcane inscriptions
    ctx.strokeStyle = '#443366';
    ctx.lineWidth = 1.5;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      const rx = 480 + Math.cos(a) * 200;
      const ry = 320 + Math.sin(a) * 200;
      ctx.strokeRect(rx - 8, ry - 8, 16, 16);
    }

    // Top Gothic Wall Border
    ctx.fillStyle = '#08060c';
    ctx.fillRect(0, 0, 960, 70);
    ctx.fillStyle = '#1f1930';
    ctx.fillRect(0, 68, 960, 4);

    // Wall Arch Sconces
    for (let wx = 80; wx < 960; wx += 160) {
      // Arch pillar
      ctx.fillStyle = '#28203c';
      ctx.fillRect(wx - 12, 10, 24, 60);
      // Torch glow
      const grad = ctx.createRadialGradient(wx, 30, 2, wx, 30, 40);
      grad.addColorStop(0, 'rgba(246, 173, 85, 0.45)');
      grad.addColorStop(1, 'rgba(246, 173, 85, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(wx, 30, 40, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Floor 2 Arena: Infernal Magma Cavern (bg_inferno)
  createTextureFromCanvas(scene, 'bg_inferno', 960, 600, (ctx) => {
    // Dark volcanic basalt base
    ctx.fillStyle = '#140807';
    ctx.fillRect(0, 0, 960, 600);

    // Cracked Obsidian Plates
    for (let y = 0; y < 600; y += 45) {
      for (let x = 0; x < 960; x += 45) {
        ctx.fillStyle = ((x + y) % 3 === 0) ? '#220e0d' : '#1c0b0a';
        ctx.fillRect(x + 2, y + 2, 41, 41);
        ctx.strokeStyle = '#0d0404';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, 45, 45);
      }
    }

    // Glowing Magma Cracks flowing across arena
    ctx.strokeStyle = '#c53030';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, 180);
    ctx.bezierCurveTo(300, 240, 600, 120, 960, 220);
    ctx.moveTo(120, 600);
    ctx.bezierCurveTo(400, 420, 700, 500, 960, 420);
    ctx.stroke();

    ctx.strokeStyle = '#ed8936';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 180);
    ctx.bezierCurveTo(300, 240, 600, 120, 960, 220);
    ctx.moveTo(120, 600);
    ctx.bezierCurveTo(400, 420, 700, 500, 960, 420);
    ctx.stroke();

    ctx.strokeStyle = '#fefcbf';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 180);
    ctx.bezierCurveTo(300, 240, 600, 120, 960, 220);
    ctx.moveTo(120, 600);
    ctx.bezierCurveTo(400, 420, 700, 500, 960, 420);
    ctx.stroke();

    // Central Molten Crucible Ring
    ctx.strokeStyle = '#dd6b20';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(480, 320, 220, 0, Math.PI * 2);
    ctx.stroke();

    // Ambient Infernal Glow
    const magmaGlow = ctx.createRadialGradient(480, 320, 50, 480, 320, 350);
    magmaGlow.addColorStop(0, 'rgba(237, 137, 54, 0.12)');
    magmaGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = magmaGlow;
    ctx.beginPath();
    ctx.arc(480, 320, 350, 0, Math.PI * 2);
    ctx.fill();

    // Top Volcanic Ridge
    ctx.fillStyle = '#0a0303';
    ctx.fillRect(0, 0, 960, 65);
    ctx.fillStyle = '#9b2c2c';
    ctx.fillRect(0, 63, 960, 3);
  });

  // Floor 3 Arena: Abyssal Void Rift (bg_void)
  createTextureFromCanvas(scene, 'bg_void', 960, 600, (ctx) => {
    // Deep space void black
    ctx.fillStyle = '#06030b';
    ctx.fillRect(0, 0, 960, 600);

    // Distant Stars
    ctx.fillStyle = '#d6bcfa';
    for (let i = 0; i < 70; i++) {
      const sx = (i * 97) % 960;
      const sy = (i * 73) % 600;
      const s = (i % 3 === 0) ? 2 : 1;
      ctx.fillRect(sx, sy, s, s);
    }

    // Cosmic Void Nebula Rift in background
    const voidNebula = ctx.createRadialGradient(480, 320, 40, 480, 320, 300);
    voidNebula.addColorStop(0, 'rgba(128, 90, 213, 0.28)');
    voidNebula.addColorStop(0.5, 'rgba(68, 51, 122, 0.15)');
    voidNebula.addColorStop(1, 'rgba(6, 3, 11, 0)');
    ctx.fillStyle = voidNebula;
    ctx.beginPath();
    ctx.arc(480, 320, 300, 0, Math.PI * 2);
    ctx.fill();

    // Floating Obsidian Rift Floor Tiles
    for (let y = 80; y < 580; y += 50) {
      for (let x = 60; x < 920; x += 50) {
        if ((x * 7 + y * 13) % 9 !== 0) {
          ctx.fillStyle = '#120d20';
          ctx.fillRect(x + 2, y + 2, 46, 46);
          ctx.strokeStyle = '#271a42';
          ctx.lineWidth = 1;
          ctx.strokeRect(x + 2, y + 2, 46, 46);
        }
      }
    }

    // Void Runes Circle
    ctx.strokeStyle = '#9f7aea';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(480, 320, 230, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#553c9a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(480, 320, 150, 0, Math.PI * 2);
    ctx.stroke();

    // Top Cosmic Border
    ctx.fillStyle = '#040208';
    ctx.fillRect(0, 0, 960, 65);
    ctx.fillStyle = '#6b46c1';
    ctx.fillRect(0, 63, 960, 3);
  });

  // ==========================================
  // MAP NODE ICONS (40x40)
  // ==========================================
  
  // 1. Battle Node (node_battle)
  createTextureFromCanvas(scene, 'node_battle', 40, 40, (ctx) => {
    ctx.fillStyle = '#1e1a2e';
    ctx.beginPath();
    ctx.arc(20, 20, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e53e3e';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Crossed Swords
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(10, 30);
    ctx.lineTo(30, 10);
    ctx.moveTo(30, 30);
    ctx.lineTo(10, 10);
    ctx.stroke();

    ctx.fillStyle = '#ecc94b';
    ctx.fillRect(12, 26, 4, 3);
    ctx.fillRect(24, 26, 4, 3);
  });

  // 2. Elite Node (node_elite)
  createTextureFromCanvas(scene, 'node_elite', 40, 40, (ctx) => {
    ctx.fillStyle = '#2c1218';
    ctx.beginPath();
    ctx.arc(20, 20, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f56565';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Horned Skull
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(13, 14, 14, 14); // skull face
    // Horns
    ctx.fillStyle = '#e53e3e';
    ctx.beginPath();
    ctx.moveTo(12, 14);
    ctx.lineTo(8, 7);
    ctx.lineTo(15, 12);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(28, 14);
    ctx.lineTo(32, 7);
    ctx.lineTo(25, 12);
    ctx.fill();

    // Glowing red eyes
    ctx.fillStyle = '#e53e3e';
    ctx.fillRect(15, 18, 3, 3);
    ctx.fillRect(22, 18, 3, 3);
  });

  // 3. Shop Node (node_shop)
  createTextureFromCanvas(scene, 'node_shop', 40, 40, (ctx) => {
    ctx.fillStyle = '#1c1b12';
    ctx.beginPath();
    ctx.arc(20, 20, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ecc94b';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Gold Coin & Merchant Pouch
    ctx.fillStyle = '#d69e2e';
    ctx.beginPath();
    ctx.arc(20, 20, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#744210';
    ctx.fillRect(17, 9, 6, 4); // pouch neck
    ctx.fillStyle = '#f6e05e';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', 20, 21);
  });

  // 4. Chest Node (node_chest)
  createTextureFromCanvas(scene, 'node_chest', 40, 40, (ctx) => {
    ctx.fillStyle = '#191d24';
    ctx.beginPath();
    ctx.arc(20, 20, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#4299e1';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Ornate Chest
    ctx.fillStyle = '#744210';
    ctx.fillRect(10, 14, 20, 14);
    ctx.fillStyle = '#d69e2e';
    ctx.fillRect(10, 14, 20, 3);
    ctx.fillRect(18, 18, 4, 5);
  });

  // 5. Campfire Node (node_campfire)
  createTextureFromCanvas(scene, 'node_campfire', 40, 40, (ctx) => {
    ctx.fillStyle = '#221510';
    ctx.beginPath();
    ctx.arc(20, 20, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ed8936';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Fire logs
    ctx.fillStyle = '#744210';
    ctx.fillRect(10, 26, 20, 4);
    // Roaring flame
    ctx.fillStyle = '#dd6b20';
    ctx.beginPath();
    ctx.moveTo(13, 26);
    ctx.lineTo(20, 9);
    ctx.lineTo(27, 26);
    ctx.fill();
    ctx.fillStyle = '#f6e05e';
    ctx.beginPath();
    ctx.moveTo(16, 26);
    ctx.lineTo(20, 14);
    ctx.lineTo(24, 26);
    ctx.fill();
  });

  // 6. Boss Node (node_boss)
  createTextureFromCanvas(scene, 'node_boss', 40, 40, (ctx) => {
    ctx.fillStyle = '#210d2b';
    ctx.beginPath();
    ctx.arc(20, 20, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#9f7aea';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Crown of Skulls
    ctx.fillStyle = '#d69e2e';
    ctx.beginPath();
    ctx.moveTo(9, 28);
    ctx.lineTo(9, 15);
    ctx.lineTo(14, 21);
    ctx.lineTo(20, 11);
    ctx.lineTo(26, 21);
    ctx.lineTo(31, 15);
    ctx.lineTo(31, 28);
    ctx.closePath();
    ctx.fill();

    // Ruby Gem in crown
    ctx.fillStyle = '#e53e3e';
    ctx.fillRect(18, 20, 4, 4);
  });

  // ==========================================
  // VFX PARTICLES & IMPACT TEXTURES
  // ==========================================
  
  // 1. Slash Arc (48x48)
  createTextureFromCanvas(scene, 'vfx_slash', 48, 48, (ctx) => {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(24, 24, 18, -Math.PI / 4, Math.PI / 3);
    ctx.stroke();
    ctx.strokeStyle = '#63b3ed';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // 2. Holy Smite (32x64)
  createTextureFromCanvas(scene, 'vfx_holy_smite', 32, 64, (ctx) => {
    const grad = ctx.createLinearGradient(16, 0, 16, 64);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.4, '#faf089');
    grad.addColorStop(1, 'rgba(236, 201, 75, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(8, 0, 16, 64);
  });

  // 3. Frost Nova Ring (64x64)
  createTextureFromCanvas(scene, 'vfx_frost_nova', 64, 64, (ctx) => {
    ctx.strokeStyle = '#81e6d9';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(32, 32, 26, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#e6fffa';
    // Frost ice spikes around ring
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      const ix = 32 + Math.cos(a) * 26;
      const iy = 32 + Math.sin(a) * 26;
      ctx.fillRect(ix - 2, iy - 2, 4, 4);
    }
  });

  // 4. Void Rift Vortex (64x64)
  createTextureFromCanvas(scene, 'vfx_void_rift', 64, 64, (ctx) => {
    const grad = ctx.createRadialGradient(32, 32, 4, 32, 32, 28);
    grad.addColorStop(0, '#000000');
    grad.addColorStop(0.4, '#6b46c1');
    grad.addColorStop(0.8, '#b794f4');
    grad.addColorStop(1, 'rgba(183, 148, 244, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 28, 0, Math.PI * 2);
    ctx.fill();
  });
}
