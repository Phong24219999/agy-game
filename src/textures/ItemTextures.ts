import Phaser from 'phaser';
import { createTextureFromCanvas } from './TextureHelper';

export function registerItemTextures(scene: Phaser.Scene): void {
  const icons: { key: string; color: string; draw: (ctx: CanvasRenderingContext2D) => void }[] = [
    // ==========================================
    // 1. WEAPONS (7 detailed icons)
    // ==========================================
    {
      key: 'icon_sword_iron',
      color: '#a0aec0',
      draw: (ctx) => {
        // Blade angled from bottom-left to top-right
        // Dark edge
        ctx.fillStyle = '#4a5568';
        ctx.beginPath();
        ctx.moveTo(8, 23);
        ctx.lineTo(24, 7);
        ctx.lineTo(25, 6);
        ctx.lineTo(24, 9);
        ctx.lineTo(10, 25);
        ctx.closePath();
        ctx.fill();

        // Silver steel blade body
        ctx.fillStyle = '#cbd5e0';
        ctx.beginPath();
        ctx.moveTo(9, 22);
        ctx.lineTo(23, 8);
        ctx.lineTo(26, 5);
        ctx.lineTo(22, 9);
        ctx.lineTo(8, 23);
        ctx.closePath();
        ctx.fill();

        // Sharp highlight blade edge & tip
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(11, 20);
        ctx.lineTo(24, 7);
        ctx.lineTo(26, 5);
        ctx.lineTo(24, 6);
        ctx.closePath();
        ctx.fill();

        // Fuller / blood groove line
        ctx.strokeStyle = '#2d3748';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(12, 19);
        ctx.lineTo(20, 11);
        ctx.stroke();

        // Crossguard (Brass / Bronze)
        ctx.fillStyle = '#d69e2e';
        ctx.fillRect(7, 21, 8, 3);
        ctx.fillStyle = '#fefcbf';
        ctx.fillRect(10, 22, 2, 1);

        // Hilt grip (Brown leather)
        ctx.fillStyle = '#744210';
        ctx.fillRect(5, 24, 4, 4);

        // Pommel (Iron cap)
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(4, 27, 3, 3);
      }
    },
    {
      key: 'icon_sword_holy',
      color: '#ecc94b',
      draw: (ctx) => {
        // Holy aura glow behind blade
        ctx.fillStyle = 'rgba(254, 240, 137, 0.35)';
        ctx.beginPath();
        ctx.arc(19, 12, 11, 0, Math.PI * 2);
        ctx.fill();

        // Radiant golden blade
        ctx.fillStyle = '#f6e05e';
        ctx.beginPath();
        ctx.moveTo(9, 23);
        ctx.lineTo(24, 8);
        ctx.lineTo(27, 4);
        ctx.lineTo(23, 7);
        ctx.lineTo(8, 22);
        ctx.closePath();
        ctx.fill();

        // White-hot holy core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(11, 21);
        ctx.lineTo(25, 7);
        ctx.lineTo(27, 4);
        ctx.lineTo(24, 6);
        ctx.closePath();
        ctx.fill();

        // Winged Crossguard
        ctx.fillStyle = '#ecc94b';
        ctx.beginPath();
        ctx.moveTo(5, 19);
        ctx.lineTo(13, 21);
        ctx.lineTo(15, 27);
        ctx.lineTo(12, 25);
        ctx.lineTo(7, 25);
        ctx.closePath();
        ctx.fill();

        // Sacred sapphire jewel in guard
        ctx.fillStyle = '#63b3ed';
        ctx.fillRect(10, 21, 3, 3);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(11, 22, 1, 1);

        // Grip & Sun Pommel
        ctx.fillStyle = '#faf089';
        ctx.fillRect(5, 25, 3, 3);
        ctx.fillStyle = '#d69e2e';
        ctx.fillRect(3, 27, 3, 3);

        // Holy glint sparkles
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(26, 3, 2, 2);
        ctx.fillRect(21, 4, 1, 1);
        ctx.fillRect(28, 7, 1, 1);
      }
    },
    {
      key: 'icon_bow_frost',
      color: '#3182ce',
      draw: (ctx) => {
        // Frosty aura background
        ctx.fillStyle = 'rgba(99, 179, 237, 0.2)';
        ctx.beginPath();
        ctx.arc(16, 16, 12, 0, Math.PI * 2);
        ctx.fill();

        // Curved crystal bow limbs
        ctx.strokeStyle = '#63b3ed';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(7, 6);
        ctx.quadraticCurveTo(24, 16, 7, 26);
        ctx.stroke();

        // Glacial crystal highlight
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(8, 7);
        ctx.quadraticCurveTo(21, 16, 8, 25);
        ctx.stroke();

        // Ice crystal spikes at tips
        ctx.fillStyle = '#90cdf4';
        ctx.fillRect(5, 4, 3, 3);
        ctx.fillRect(5, 25, 3, 3);

        // Center grip
        ctx.fillStyle = '#2b6cb0';
        ctx.fillRect(16, 14, 4, 5);

        // Bowstring (Cyan glowing thread)
        ctx.strokeStyle = '#bee3f8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(7, 6);
        ctx.lineTo(7, 26);
        ctx.stroke();

        // Frost arrow nocked
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(5, 16);
        ctx.lineTo(26, 16);
        ctx.stroke();

        // Arrow head (crystal blue)
        ctx.fillStyle = '#63b3ed';
        ctx.beginPath();
        ctx.moveTo(27, 16);
        ctx.lineTo(22, 13);
        ctx.lineTo(22, 19);
        ctx.closePath();
        ctx.fill();
      }
    },
    {
      key: 'icon_staff_arcane',
      color: '#805ad5',
      draw: (ctx) => {
        // Wooden staff shaft
        ctx.strokeStyle = '#553c9a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(7, 26);
        ctx.lineTo(20, 13);
        ctx.stroke();

        ctx.strokeStyle = '#718096';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(8, 25);
        ctx.lineTo(19, 14);
        ctx.stroke();

        // Metallic prongs/claws holding the orb
        ctx.fillStyle = '#ecc94b';
        ctx.fillRect(18, 11, 4, 3);
        ctx.fillRect(16, 8, 3, 3);
        ctx.fillRect(23, 13, 3, 3);

        // Pulsating Arcane Core Orb
        ctx.fillStyle = 'rgba(183, 148, 244, 0.4)';
        ctx.beginPath();
        ctx.arc(22, 9, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#805ad5';
        ctx.beginPath();
        ctx.arc(22, 9, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#d6bcfa';
        ctx.beginPath();
        ctx.arc(21, 8, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(20, 7, 2, 2);

        // Arcane floating sparkles
        ctx.fillStyle = '#e9d8fd';
        ctx.fillRect(27, 6, 2, 2);
        ctx.fillRect(22, 2, 1, 1);
        ctx.fillRect(16, 4, 1, 1);
      }
    },
    {
      key: 'icon_daggers_poison',
      color: '#38a169',
      draw: (ctx) => {
        // Dagger 1 (Top-left to bottom-right)
        ctx.strokeStyle = '#2d3748';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(6, 6);
        ctx.lineTo(24, 24);
        ctx.stroke();

        // Dagger 2 (Top-right to bottom-left)
        ctx.beginPath();
        ctx.moveTo(24, 6);
        ctx.lineTo(6, 24);
        ctx.stroke();

        // Silver blade highlights
        ctx.strokeStyle = '#cbd5e0';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(8, 8);
        ctx.lineTo(16, 16);
        ctx.moveTo(22, 8);
        ctx.lineTo(16, 14);
        ctx.stroke();

        // Grips
        ctx.fillStyle = '#744210';
        ctx.fillRect(20, 20, 5, 5);
        ctx.fillRect(5, 20, 5, 5);

        // Dripping Venom Coating (Emerald Green)
        ctx.fillStyle = '#48bb78';
        ctx.fillRect(5, 5, 3, 3);
        ctx.fillRect(22, 5, 3, 3);
        ctx.fillStyle = '#9ae6b4';
        ctx.fillRect(6, 6, 1, 1);
        ctx.fillRect(23, 6, 1, 1);

        // Venom drops
        ctx.fillStyle = '#38a169';
        ctx.fillRect(12, 18, 2, 3);
        ctx.fillRect(17, 18, 2, 3);
      }
    },
    {
      key: 'icon_scythe_dark',
      color: '#6b46c1',
      draw: (ctx) => {
        // Staff pole
        ctx.strokeStyle = '#4a5568';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(7, 26);
        ctx.lineTo(21, 6);
        ctx.stroke();

        // Curved Soul Blade
        ctx.fillStyle = '#2d3748';
        ctx.beginPath();
        ctx.moveTo(21, 6);
        ctx.quadraticCurveTo(12, 4, 5, 12);
        ctx.lineTo(8, 13);
        ctx.quadraticCurveTo(15, 8, 22, 9);
        ctx.closePath();
        ctx.fill();

        // Glowing Necrotic Edge
        ctx.strokeStyle = '#9f7aea';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(21, 6);
        ctx.quadraticCurveTo(12, 4, 5, 12);
        ctx.stroke();

        // Soul highlight
        ctx.fillStyle = '#e9d8fd';
        ctx.fillRect(5, 11, 2, 2);

        // Socket binding ring
        ctx.fillStyle = '#ecc94b';
        ctx.fillRect(19, 7, 3, 3);
      }
    },
    {
      key: 'icon_hammer_thunder',
      color: '#d69e2e',
      draw: (ctx) => {
        // Handle
        ctx.strokeStyle = '#744210';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(8, 25);
        ctx.lineTo(19, 13);
        ctx.stroke();

        // Steel Head
        ctx.fillStyle = '#4a5568';
        ctx.beginPath();
        ctx.moveTo(14, 7);
        ctx.lineTo(24, 7);
        ctx.lineTo(26, 15);
        ctx.lineTo(16, 15);
        ctx.closePath();
        ctx.fill();

        // Face highlight
        ctx.fillStyle = '#a0aec0';
        ctx.fillRect(16, 8, 8, 5);

        // Lightning Crackles
        ctx.strokeStyle = '#faf089';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(15, 6);
        ctx.lineTo(19, 10);
        ctx.lineTo(17, 12);
        ctx.lineTo(23, 16);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(19, 10, 2, 2);
      }
    },

    // ==========================================
    // 2. ARMOR & CLOTHING (5 detailed icons)
    // ==========================================
    {
      key: 'icon_plate_titan',
      color: '#4a5568',
      draw: (ctx) => {
        // Base plate cuirass
        ctx.fillStyle = '#2d3748';
        ctx.beginPath();
        ctx.moveTo(8, 7);
        ctx.lineTo(24, 7);
        ctx.lineTo(25, 16);
        ctx.lineTo(21, 26);
        ctx.lineTo(11, 26);
        ctx.lineTo(7, 16);
        ctx.closePath();
        ctx.fill();

        // Layered steel chest plates
        ctx.fillStyle = '#718096';
        ctx.fillRect(10, 10, 12, 7);
        ctx.fillStyle = '#a0aec0';
        ctx.fillRect(11, 11, 10, 5);

        // Golden Trim & Neck Gorget
        ctx.fillStyle = '#ecc94b';
        ctx.fillRect(11, 6, 10, 3);
        ctx.fillRect(15, 9, 2, 14); // center ridge

        // Rivets
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(9, 9, 1, 1);
        ctx.fillRect(22, 9, 1, 1);
        ctx.fillRect(9, 15, 1, 1);
        ctx.fillRect(22, 15, 1, 1);
      }
    },
    {
      key: 'icon_robe_void',
      color: '#805ad5',
      draw: (ctx) => {
        // Deep purple robe body
        ctx.fillStyle = '#321f5c';
        ctx.beginPath();
        ctx.moveTo(11, 6);
        ctx.lineTo(21, 6);
        ctx.lineTo(27, 26);
        ctx.lineTo(5, 26);
        ctx.closePath();
        ctx.fill();

        // Shading folds
        ctx.fillStyle = '#553c9a';
        ctx.fillRect(12, 10, 8, 16);

        // Cosmic stars pattern on cloth
        ctx.fillStyle = '#e9d8fd';
        ctx.fillRect(14, 14, 2, 2);
        ctx.fillRect(19, 18, 1, 1);
        ctx.fillRect(9, 21, 2, 2);
        ctx.fillRect(22, 23, 1, 1);

        // Golden mantle clasp
        ctx.fillStyle = '#ecc94b';
        ctx.fillRect(14, 7, 4, 3);
        ctx.fillStyle = '#63b3ed';
        ctx.fillRect(15, 8, 2, 2);
      }
    },
    {
      key: 'icon_cloak_ranger',
      color: '#276749',
      draw: (ctx) => {
        // Hood & shoulders
        ctx.fillStyle = '#1c4532';
        ctx.beginPath();
        ctx.moveTo(12, 6);
        ctx.lineTo(20, 6);
        ctx.lineTo(26, 26);
        ctx.lineTo(6, 26);
        ctx.closePath();
        ctx.fill();

        // Inner folds
        ctx.fillStyle = '#2f855a';
        ctx.beginPath();
        ctx.moveTo(14, 8);
        ctx.lineTo(18, 8);
        ctx.lineTo(23, 24);
        ctx.lineTo(9, 24);
        ctx.closePath();
        ctx.fill();

        // Leather collar / mantle
        ctx.fillStyle = '#744210';
        ctx.fillRect(11, 8, 10, 4);

        // Silver leaf pin
        ctx.fillStyle = '#cbd5e0';
        ctx.beginPath();
        ctx.arc(16, 10, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    {
      key: 'icon_shield_tower',
      color: '#2b6cb0',
      draw: (ctx) => {
        // Outer rectangular frame with curved base
        ctx.fillStyle = '#2d3748';
        ctx.fillRect(8, 5, 16, 22);

        // Blue field
        ctx.fillStyle = '#3182ce';
        ctx.fillRect(10, 7, 12, 18);

        // Heraldic cross
        ctx.fillStyle = '#ecc94b';
        ctx.fillRect(15, 7, 2, 18);
        ctx.fillRect(10, 13, 12, 2);

        // Iron rivets around border
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(8, 5, 2, 2);
        ctx.fillRect(22, 5, 2, 2);
        ctx.fillRect(8, 25, 2, 2);
        ctx.fillRect(22, 25, 2, 2);
      }
    },
    {
      key: 'icon_shield_aegis',
      color: '#ecc94b',
      draw: (ctx) => {
        // Sunburst round shield
        ctx.fillStyle = '#d69e2e';
        ctx.beginPath();
        ctx.arc(16, 16, 11, 0, Math.PI * 2);
        ctx.fill();

        // Polished golden inner circle
        ctx.fillStyle = '#ecc94b';
        ctx.beginPath();
        ctx.arc(16, 16, 9, 0, Math.PI * 2);
        ctx.fill();

        // Concentric sun ring
        ctx.strokeStyle = '#faf089';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(16, 16, 6, 0, Math.PI * 2);
        ctx.stroke();

        // Central blood ruby
        ctx.fillStyle = '#e53e3e';
        ctx.beginPath();
        ctx.arc(16, 16, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(15, 15, 1, 1);
        ctx.fillRect(22, 8, 2, 2); // Rim sheen
      }
    },

    // ==========================================
    // 3. RELICS (7 detailed icons)
    // ==========================================
    {
      key: 'icon_relic_heart',
      color: '#9b2c2c',
      draw: (ctx) => {
        // Dark crimson heart
        ctx.fillStyle = '#742a2a';
        ctx.beginPath();
        ctx.moveTo(16, 25);
        ctx.bezierCurveTo(8, 20, 6, 10, 12, 9);
        ctx.bezierCurveTo(14, 8, 16, 11, 16, 11);
        ctx.bezierCurveTo(16, 11, 18, 8, 20, 9);
        ctx.bezierCurveTo(26, 10, 24, 20, 16, 25);
        ctx.fill();

        // Vibrant red muscle core
        ctx.fillStyle = '#e53e3e';
        ctx.beginPath();
        ctx.arc(12, 13, 3.5, 0, Math.PI * 2);
        ctx.arc(20, 13, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Dark demonic thorns wrapping
        ctx.strokeStyle = '#1a202c';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(8, 15);
        ctx.lineTo(24, 18);
        ctx.moveTo(10, 20);
        ctx.lineTo(22, 12);
        ctx.stroke();

        // Blood drops
        ctx.fillStyle = '#fc8181';
        ctx.fillRect(15, 26, 2, 3);
      }
    },
    {
      key: 'icon_relic_chrono',
      color: '#d69e2e',
      draw: (ctx) => {
        // Brass Frame
        ctx.fillStyle = '#b7791f';
        ctx.fillRect(9, 6, 14, 3); // top cap
        ctx.fillRect(9, 23, 14, 3); // bottom cap
        ctx.fillRect(9, 6, 2, 20);
        ctx.fillRect(21, 6, 2, 20);

        // Glass bulbs
        ctx.fillStyle = 'rgba(190, 227, 248, 0.4)';
        ctx.beginPath();
        ctx.moveTo(11, 9);
        ctx.lineTo(21, 9);
        ctx.lineTo(17, 16);
        ctx.lineTo(21, 23);
        ctx.lineTo(11, 23);
        ctx.lineTo(15, 16);
        ctx.closePath();
        ctx.fill();

        // Glowing blue Sands of Time
        ctx.fillStyle = '#63b3ed';
        // Bottom sand pile
        ctx.fillRect(12, 19, 8, 4);
        // Top sand funnel
        ctx.fillRect(13, 9, 6, 3);
        // Trickle line
        ctx.fillRect(15, 12, 2, 7);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(13, 10, 1, 1);
      }
    },
    {
      key: 'icon_relic_sunfire',
      color: '#dd6b20',
      draw: (ctx) => {
        // Corona rays
        ctx.fillStyle = '#dd6b20';
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4;
          const rx = 16 + Math.cos(angle) * 11;
          const ry = 16 + Math.sin(angle) * 11;
          ctx.beginPath();
          ctx.arc(rx, ry, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Living fire disc
        ctx.fillStyle = '#ed8936';
        ctx.beginPath();
        ctx.arc(16, 16, 8, 0, Math.PI * 2);
        ctx.fill();

        // Golden fiery core
        ctx.fillStyle = '#f6ad55';
        ctx.beginPath();
        ctx.arc(16, 16, 5, 0, Math.PI * 2);
        ctx.fill();

        // White-hot center
        ctx.fillStyle = '#fffaf0';
        ctx.beginPath();
        ctx.arc(16, 16, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    {
      key: 'icon_relic_eye',
      color: '#805ad5',
      draw: (ctx) => {
        // Ethereal Eye Outline
        ctx.fillStyle = '#171923';
        ctx.beginPath();
        ctx.moveTo(5, 16);
        ctx.quadraticCurveTo(16, 6, 27, 16);
        ctx.quadraticCurveTo(16, 26, 5, 16);
        ctx.closePath();
        ctx.fill();

        // Glowing Iris
        ctx.fillStyle = '#805ad5';
        ctx.beginPath();
        ctx.arc(16, 16, 6.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ecc94b';
        ctx.beginPath();
        ctx.arc(16, 16, 4, 0, Math.PI * 2);
        ctx.fill();

        // Dark slit pupil
        ctx.fillStyle = '#1a202c';
        ctx.fillRect(15, 11, 2, 10);

        // Specular gleam
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(14, 13, 2, 2);
      }
    },
    {
      key: 'icon_relic_feather',
      color: '#e53e3e',
      draw: (ctx) => {
        // Flaming Phoenix Feather
        ctx.fillStyle = '#c53030';
        ctx.beginPath();
        ctx.moveTo(7, 26);
        ctx.quadraticCurveTo(14, 18, 25, 6);
        ctx.quadraticCurveTo(24, 16, 16, 24);
        ctx.closePath();
        ctx.fill();

        // Orange middle flame
        ctx.fillStyle = '#ed8936';
        ctx.beginPath();
        ctx.moveTo(10, 24);
        ctx.quadraticCurveTo(16, 16, 25, 6);
        ctx.quadraticCurveTo(21, 14, 15, 21);
        ctx.closePath();
        ctx.fill();

        // Golden spine
        ctx.strokeStyle = '#faf089';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(6, 27);
        ctx.quadraticCurveTo(14, 18, 26, 5);
        ctx.stroke();

        // Fire sparks
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(24, 4, 2, 2);
        ctx.fillRect(19, 8, 1, 1);
        ctx.fillRect(13, 14, 1, 1);
      }
    },
    {
      key: 'icon_relic_grail',
      color: '#ecc94b',
      draw: (ctx) => {
        // Golden Chalice Body
        ctx.fillStyle = '#d69e2e';
        ctx.beginPath();
        ctx.moveTo(9, 8);
        ctx.lineTo(23, 8);
        ctx.lineTo(21, 17);
        ctx.quadraticCurveTo(16, 20, 11, 17);
        ctx.closePath();
        ctx.fill();

        // Golden stem & base
        ctx.fillRect(15, 19, 2, 5);
        ctx.fillRect(11, 24, 10, 3);

        // Divine Blood / Wine Elixir inside
        ctx.fillStyle = '#e53e3e';
        ctx.fillRect(11, 9, 10, 5);
        ctx.fillStyle = '#fc8181';
        ctx.fillRect(13, 10, 4, 2);

        // Shimmer highlights
        ctx.fillStyle = '#faf089';
        ctx.fillRect(9, 8, 2, 9);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(10, 8, 2, 2);
        ctx.fillRect(21, 8, 2, 2);
      }
    },
    {
      key: 'icon_relic_skull',
      color: '#9f7aea',
      draw: (ctx) => {
        // Bone skull shape
        ctx.fillStyle = '#cbd5e0';
        ctx.beginPath();
        ctx.arc(16, 13, 8, 0, Math.PI * 2);
        ctx.fill();

        // Jawbone
        ctx.fillRect(12, 19, 8, 5);

        // Eye sockets (abyssal violet flame)
        ctx.fillStyle = '#805ad5';
        ctx.fillRect(11, 12, 3, 4);
        ctx.fillRect(18, 12, 3, 4);

        ctx.fillStyle = '#e9d8fd';
        ctx.fillRect(12, 13, 1, 2);
        ctx.fillRect(19, 13, 1, 2);

        // Nasal cavity
        ctx.fillStyle = '#2d3748';
        ctx.fillRect(15, 17, 2, 2);

        // Teeth lines
        ctx.fillStyle = '#4a5568';
        ctx.fillRect(14, 21, 1, 3);
        ctx.fillRect(17, 21, 1, 3);
      }
    },

    // ==========================================
    // 4. CONSUMABLES & TOKENS (5 detailed icons)
    // ==========================================
    {
      key: 'icon_potion_hp',
      color: '#e53e3e',
      draw: (ctx) => {
        // Glass bottle body (spherical)
        ctx.fillStyle = '#742a2a';
        ctx.beginPath();
        ctx.arc(16, 18, 9, 0, Math.PI * 2);
        ctx.fill();

        // Liquid inside
        ctx.fillStyle = '#e53e3e';
        ctx.beginPath();
        ctx.arc(16, 19, 7.5, 0, Math.PI * 2);
        ctx.fill();

        // Neck
        ctx.fillStyle = '#4a5568';
        ctx.fillRect(14, 6, 4, 5);

        // Cork
        ctx.fillStyle = '#975a16';
        ctx.fillRect(13, 3, 6, 4);

        // Specular glass reflection
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(13, 14, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#feb2b2';
        ctx.fillRect(17, 21, 2, 2);
      }
    },
    {
      key: 'icon_potion_speed',
      color: '#319795',
      draw: (ctx) => {
        // Flask bottle
        ctx.fillStyle = '#234e52';
        ctx.beginPath();
        ctx.moveTo(13, 8);
        ctx.lineTo(19, 8);
        ctx.lineTo(24, 24);
        ctx.lineTo(8, 24);
        ctx.closePath();
        ctx.fill();

        // Teal / Emerald speedy liquid
        ctx.fillStyle = '#319795';
        ctx.beginPath();
        ctx.moveTo(14, 12);
        ctx.lineTo(18, 12);
        ctx.lineTo(22, 23);
        ctx.lineTo(10, 23);
        ctx.closePath();
        ctx.fill();

        // Cork
        ctx.fillStyle = '#975a16';
        ctx.fillRect(14, 5, 4, 4);

        // Swift lightning gleam inside
        ctx.fillStyle = '#81e6d9';
        ctx.beginPath();
        ctx.moveTo(17, 13);
        ctx.lineTo(14, 18);
        ctx.lineTo(18, 18);
        ctx.lineTo(15, 22);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(10, 16, 2, 4);
      }
    },
    {
      key: 'icon_scroll_lightning',
      color: '#d69e2e',
      draw: (ctx) => {
        // Rolled Parchment Scroll
        ctx.fillStyle = '#d69e2e';
        ctx.fillRect(8, 6, 16, 20);

        ctx.fillStyle = '#fefcbf';
        ctx.fillRect(9, 7, 14, 18);

        // Wood ends
        ctx.fillStyle = '#744210';
        ctx.fillRect(6, 6, 3, 20);
        ctx.fillRect(23, 6, 3, 20);

        // Lightning glyph
        ctx.fillStyle = '#d69e2e';
        ctx.beginPath();
        ctx.moveTo(17, 9);
        ctx.lineTo(12, 16);
        ctx.lineTo(16, 16);
        ctx.lineTo(14, 22);
        ctx.lineTo(20, 14);
        ctx.lineTo(16, 14);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(16, 14, 2, 2);
      }
    },
    {
      key: 'icon_gold_coin',
      color: '#ecc94b',
      draw: (ctx) => {
        // Stack of 2 coins below
        ctx.fillStyle = '#744210';
        ctx.beginPath();
        ctx.arc(16, 21, 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#b7791f';
        ctx.beginPath();
        ctx.arc(16, 18, 9, 0, Math.PI * 2);
        ctx.fill();

        // Main top coin
        ctx.fillStyle = '#d69e2e';
        ctx.beginPath();
        ctx.arc(16, 14, 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ecc94b';
        ctx.beginPath();
        ctx.arc(16, 14, 7.5, 0, Math.PI * 2);
        ctx.fill();

        // Embossed Star / Crown in center
        ctx.fillStyle = '#744210';
        ctx.beginPath();
        ctx.moveTo(16, 9);
        ctx.lineTo(18, 13);
        ctx.lineTo(21, 14);
        ctx.lineTo(18, 16);
        ctx.lineTo(16, 20);
        ctx.lineTo(14, 16);
        ctx.lineTo(11, 14);
        ctx.lineTo(14, 13);
        ctx.closePath();
        ctx.fill();

        // Shine sparkle
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(11, 9, 2, 2);
      }
    },
    {
      key: 'icon_soul_gem',
      color: '#805ad5',
      draw: (ctx) => {
        // Multi-faceted Gem Cut (Octagonal)
        ctx.fillStyle = '#44337a';
        ctx.beginPath();
        ctx.moveTo(11, 6);
        ctx.lineTo(21, 6);
        ctx.lineTo(27, 14);
        ctx.lineTo(16, 27);
        ctx.lineTo(5, 14);
        ctx.closePath();
        ctx.fill();

        // Highlight Facets
        ctx.fillStyle = '#805ad5';
        ctx.beginPath();
        ctx.moveTo(11, 6);
        ctx.lineTo(21, 6);
        ctx.lineTo(16, 14);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#b794f4';
        ctx.beginPath();
        ctx.moveTo(5, 14);
        ctx.lineTo(11, 6);
        ctx.lineTo(16, 14);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#9f7aea';
        ctx.beginPath();
        ctx.moveTo(16, 14);
        ctx.lineTo(27, 14);
        ctx.lineTo(16, 27);
        ctx.closePath();
        ctx.fill();

        // Glowing center core spark
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(15, 13, 2, 2);
        ctx.fillRect(12, 8, 1, 1);
      }
    },

    // ==========================================
    // 5. MAP NODE ICONS (6 detailed icons)
    // ==========================================
    {
      key: 'node_battle',
      color: '#e53e3e',
      draw: (ctx) => {
        // Crossed dual battle blades
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(7, 7);
        ctx.lineTo(25, 25);
        ctx.moveTo(25, 7);
        ctx.lineTo(7, 25);
        ctx.stroke();

        // Red crossguard
        ctx.fillStyle = '#e53e3e';
        ctx.fillRect(18, 20, 5, 2);
        ctx.fillRect(9, 20, 5, 2);

        // Center clash spark
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(15, 15, 2, 2);
      }
    },
    {
      key: 'node_elite',
      color: '#9f7aea',
      draw: (ctx) => {
        // Horned Demon Skull
        ctx.fillStyle = '#553c9a';
        ctx.beginPath();
        ctx.arc(16, 15, 8, 0, Math.PI * 2);
        ctx.fill();

        // Sweeping Horns
        ctx.strokeStyle = '#d6bcfa';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(11, 10);
        ctx.quadraticCurveTo(6, 4, 4, 7);
        ctx.moveTo(21, 10);
        ctx.quadraticCurveTo(26, 4, 28, 7);
        ctx.stroke();

        // Glowing Purple Eyes
        ctx.fillStyle = '#e9d8fd';
        ctx.fillRect(12, 14, 2, 3);
        ctx.fillRect(18, 14, 2, 3);
      }
    },
    {
      key: 'node_shop',
      color: '#48bb78',
      draw: (ctx) => {
        // Velvet coin pouch
        ctx.fillStyle = '#744210';
        ctx.beginPath();
        ctx.arc(16, 18, 8, 0, Math.PI * 2);
        ctx.fill();

        // Pouch gathered neck
        ctx.fillStyle = '#d69e2e';
        ctx.fillRect(13, 9, 6, 3);

        // Golden coins spilling out
        ctx.fillStyle = '#f6e05e';
        ctx.beginPath();
        ctx.arc(14, 9, 3, 0, Math.PI * 2);
        ctx.arc(18, 8, 3, 0, Math.PI * 2);
        ctx.fill();

        // Dollar/Currency sign
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(15, 15, 2, 6);
      }
    },
    {
      key: 'node_chest',
      color: '#f6e05e',
      draw: (ctx) => {
        // Chest box body
        ctx.fillStyle = '#744210';
        ctx.fillRect(7, 14, 18, 11);

        // Lid
        ctx.fillStyle = '#975a16';
        ctx.fillRect(6, 10, 20, 5);

        // Golden banding
        ctx.fillStyle = '#ecc94b';
        ctx.fillRect(9, 10, 3, 15);
        ctx.fillRect(20, 10, 3, 15);

        // Keyhole
        ctx.fillStyle = '#1a202c';
        ctx.fillRect(15, 16, 2, 3);

        // Golden beam bursting
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(14, 13, 4, 2);
      }
    },
    {
      key: 'node_campfire',
      color: '#ed8936',
      draw: (ctx) => {
        // Firewood logs
        ctx.strokeStyle = '#744210';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(8, 24);
        ctx.lineTo(24, 24);
        ctx.moveTo(9, 26);
        ctx.lineTo(23, 22);
        ctx.stroke();

        // Fire flames
        ctx.fillStyle = '#dd6b20';
        ctx.beginPath();
        ctx.moveTo(10, 23);
        ctx.quadraticCurveTo(8, 12, 16, 6);
        ctx.quadraticCurveTo(24, 12, 22, 23);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#f6ad55';
        ctx.beginPath();
        ctx.moveTo(12, 23);
        ctx.quadraticCurveTo(11, 15, 16, 10);
        ctx.quadraticCurveTo(21, 15, 20, 23);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fff5f5';
        ctx.beginPath();
        ctx.arc(16, 20, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    {
      key: 'node_boss',
      color: '#f56565',
      draw: (ctx) => {
        // Demon Overlord Crown
        ctx.fillStyle = '#c53030';
        ctx.beginPath();
        ctx.arc(16, 16, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ecc94b';
        ctx.beginPath();
        ctx.moveTo(8, 20);
        ctx.lineTo(10, 11);
        ctx.lineTo(13, 15);
        ctx.lineTo(16, 9);
        ctx.lineTo(19, 15);
        ctx.lineTo(22, 11);
        ctx.lineTo(24, 20);
        ctx.closePath();
        ctx.fill();

        // Ruby in crown
        ctx.fillStyle = '#e53e3e';
        ctx.fillRect(15, 16, 2, 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(16, 10, 1, 1);
      }
    },

    // ==========================================
    // 6. ENHANCED FALLBACK ICONS (12 detailed icons)
    // ==========================================
    {
      key: 'icon_sword',
      color: '#e53e3e',
      draw: (ctx) => {
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(7, 25);
        ctx.lineTo(25, 7);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(8, 24);
        ctx.lineTo(26, 6);
        ctx.stroke();

        // Guard
        ctx.fillStyle = '#ecc94b';
        ctx.fillRect(10, 20, 7, 3);
        // Pommel
        ctx.fillStyle = '#744210';
        ctx.fillRect(6, 24, 3, 3);
      }
    },
    {
      key: 'icon_shield',
      color: '#3182ce',
      draw: (ctx) => {
        ctx.fillStyle = '#2b6cb0';
        ctx.beginPath();
        ctx.moveTo(7, 6);
        ctx.lineTo(25, 6);
        ctx.lineTo(25, 17);
        ctx.lineTo(16, 27);
        ctx.lineTo(7, 17);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#63b3ed';
        ctx.beginPath();
        ctx.moveTo(9, 8);
        ctx.lineTo(23, 8);
        ctx.lineTo(23, 16);
        ctx.lineTo(16, 24);
        ctx.lineTo(9, 16);
        ctx.closePath();
        ctx.fill();

        // Emblem
        ctx.fillStyle = '#ecc94b';
        ctx.fillRect(14, 10, 4, 10);
      }
    },
    {
      key: 'icon_fire',
      color: '#dd6b20',
      draw: (ctx) => {
        ctx.fillStyle = '#c53030';
        ctx.beginPath();
        ctx.arc(16, 18, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ed8936';
        ctx.beginPath();
        ctx.moveTo(8, 22);
        ctx.quadraticCurveTo(10, 10, 16, 5);
        ctx.quadraticCurveTo(22, 10, 24, 22);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#faf089';
        ctx.beginPath();
        ctx.arc(16, 18, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(16, 18, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    {
      key: 'icon_frost',
      color: '#319795',
      draw: (ctx) => {
        ctx.strokeStyle = '#81e6d9';
        ctx.lineWidth = 2.5;
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

        ctx.fillStyle = '#e6fffa';
        ctx.beginPath();
        ctx.arc(16, 16, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    {
      key: 'icon_lightning',
      color: '#d69e2e',
      draw: (ctx) => {
        ctx.fillStyle = '#faf089';
        ctx.beginPath();
        ctx.moveTo(19, 4);
        ctx.lineTo(8, 16);
        ctx.lineTo(15, 16);
        ctx.lineTo(13, 28);
        ctx.lineTo(24, 14);
        ctx.lineTo(17, 14);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(18, 6);
        ctx.lineTo(11, 15);
        ctx.lineTo(16, 15);
        ctx.lineTo(14, 24);
        ctx.stroke();
      }
    },
    {
      key: 'icon_vampire',
      color: '#9b2c2c',
      draw: (ctx) => {
        // Bat / Fangs silhouette
        ctx.fillStyle = '#742a2a';
        ctx.beginPath();
        ctx.arc(16, 15, 8, 0, Math.PI * 2);
        ctx.fill();

        // Glowing red eyes
        ctx.fillStyle = '#fc8181';
        ctx.fillRect(13, 14, 2, 2);
        ctx.fillRect(17, 14, 2, 2);

        // Twin sharp fangs
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(13, 19, 2, 4);
        ctx.fillRect(17, 19, 2, 4);

        // Dripping blood
        ctx.fillStyle = '#e53e3e';
        ctx.fillRect(13, 23, 2, 3);
      }
    },
    {
      key: 'icon_thorns',
      color: '#276749',
      draw: (ctx) => {
        ctx.strokeStyle = '#48bb78';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(16, 16, 9, 0, Math.PI * 2);
        ctx.stroke();

        // Sharp thorns
        ctx.fillStyle = '#9ae6b4';
        ctx.fillRect(15, 3, 2, 5);
        ctx.fillRect(15, 24, 2, 5);
        ctx.fillRect(3, 15, 5, 2);
        ctx.fillRect(24, 15, 5, 2);

        // Diagonal thorns
        ctx.fillRect(7, 7, 3, 3);
        ctx.fillRect(22, 7, 3, 3);
        ctx.fillRect(7, 22, 3, 3);
        ctx.fillRect(22, 22, 3, 3);
      }
    },
    {
      key: 'icon_summon',
      color: '#6b46c1',
      draw: (ctx) => {
        // Necromancy portal ring
        ctx.strokeStyle = '#9f7aea';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(16, 16, 10, 0, Math.PI * 2);
        ctx.stroke();

        // Skull inside
        ctx.fillStyle = '#d6bcfa';
        ctx.beginPath();
        ctx.arc(16, 14, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1a202c';
        ctx.fillRect(14, 13, 2, 2);
        ctx.fillRect(17, 13, 2, 2);

        ctx.fillStyle = '#805ad5';
        ctx.fillRect(14, 20, 5, 3);
      }
    },
    {
      key: 'icon_crit',
      color: '#b7791f',
      draw: (ctx) => {
        ctx.fillStyle = '#f6e05e';
        ctx.beginPath();
        ctx.moveTo(16, 4);
        ctx.lineTo(19, 13);
        ctx.lineTo(28, 16);
        ctx.lineTo(19, 19);
        ctx.lineTo(16, 28);
        ctx.lineTo(13, 19);
        ctx.lineTo(4, 16);
        ctx.lineTo(13, 13);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(16, 16, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    {
      key: 'icon_boot',
      color: '#2b6cb0',
      draw: (ctx) => {
        // Winged boot
        ctx.fillStyle = '#3182ce';
        ctx.fillRect(9, 8, 7, 14);
        ctx.fillRect(9, 18, 15, 6);

        // Steel toe
        ctx.fillStyle = '#a0aec0';
        ctx.fillRect(20, 18, 4, 6);

        // Wings
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(9, 10);
        ctx.lineTo(4, 6);
        ctx.lineTo(4, 12);
        ctx.closePath();
        ctx.fill();
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

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(11, 10, 2, 2);
      }
    },
    {
      key: 'icon_soul',
      color: '#805ad5',
      draw: (ctx) => {
        // Ethereal soul wisp
        ctx.fillStyle = '#9f7aea';
        ctx.beginPath();
        ctx.moveTo(16, 5);
        ctx.quadraticCurveTo(24, 14, 20, 22);
        ctx.quadraticCurveTo(16, 27, 12, 22);
        ctx.quadraticCurveTo(8, 14, 16, 5);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#e9d8fd';
        ctx.beginPath();
        ctx.arc(16, 16, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(15, 14, 2, 2);
      }
    }
  ];

  icons.forEach((ic) => {
    createTextureFromCanvas(scene, ic.key, 32, 32, (ctx) => {
      // Rounded dark fantasy background frame
      ctx.fillStyle = '#141122';
      ctx.fillRect(0, 0, 32, 32);

      // Inner bevel / corner styling
      ctx.strokeStyle = ic.color;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(1, 1, 30, 30);

      // Corner accent rivets
      ctx.fillStyle = ic.color;
      ctx.fillRect(2, 2, 2, 2);
      ctx.fillRect(28, 2, 2, 2);
      ctx.fillRect(2, 28, 2, 2);
      ctx.fillRect(28, 28, 2, 2);

      // Draw specialized pixel art
      ic.draw(ctx);
    });
  });
}
