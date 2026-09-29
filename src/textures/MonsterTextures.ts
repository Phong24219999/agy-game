import Phaser from 'phaser';
import { createTextureFromCanvas } from './TextureHelper';

export function registerMonsterTextures(scene: Phaser.Scene): void {
  // =========================================================================
  // FLOOR 1: CATACOMBS MONSTERS & BOSS
  // =========================================================================

  // 1. Skeleton Warrior (32x40) - Upgraded 16-bit Dark Fantasy Pixel Art
  createTextureFromCanvas(scene, 'monster_skeleton', 32, 40, (ctx) => {
    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(16, 38, 12, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Skull
    ctx.fillStyle = '#1e293b'; // skull shadow outline
    ctx.fillRect(9, 3, 14, 12);
    ctx.fillStyle = '#e2e8f0'; // skull base
    ctx.fillRect(10, 4, 12, 10);
    ctx.fillStyle = '#cbd5e1'; // skull highlight
    ctx.fillRect(11, 4, 10, 4);

    // Eye sockets & glowing red pinpoints
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(11, 7, 3, 3);
    ctx.fillRect(18, 7, 3, 3);
    ctx.fillStyle = '#ef4444'; // glowing soul eyes
    ctx.fillRect(12, 8, 2, 2);
    ctx.fillRect(19, 8, 2, 2);

    // Teeth & jaw
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(12, 12, 8, 2);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(13, 12, 1, 2);
    ctx.fillRect(15, 12, 1, 2);
    ctx.fillRect(17, 12, 1, 2);
    ctx.fillRect(19, 12, 1, 2);

    // Ribcage & Spine
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(9, 15, 14, 12);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(15, 15, 2, 12); // spine
    ctx.fillStyle = '#e2e8f0';
    // ribs
    ctx.fillRect(10, 16, 12, 2);
    ctx.fillRect(11, 19, 10, 2);
    ctx.fillRect(11, 22, 10, 2);
    ctx.fillRect(12, 25, 8, 2);

    // Tattered Waistcloth
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(10, 26, 12, 4);
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(11, 29, 4, 4);
    ctx.fillRect(17, 29, 3, 3);

    // Rusted Notched Broadsword (right arm)
    ctx.fillStyle = '#78350f'; // wood handle
    ctx.fillRect(24, 25, 3, 6);
    ctx.fillStyle = '#d97706'; // brass crossguard
    ctx.fillRect(22, 23, 7, 2);
    ctx.fillStyle = '#94a3b8'; // steel blade
    ctx.fillRect(24, 6, 3, 17);
    ctx.fillStyle = '#f1f5f9'; // blade edge highlight
    ctx.fillRect(25, 7, 1, 15);
    ctx.fillStyle = '#b91c1c'; // rust / blood notch
    ctx.fillRect(24, 12, 2, 3);

    // Left Arm & Buckler
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(6, 17, 3, 8);
    ctx.fillStyle = '#475569'; // shield rim
    ctx.beginPath();
    ctx.arc(6, 24, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(6, 24, 3, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(11, 30, 3, 7);
    ctx.fillRect(18, 30, 3, 7);
    ctx.fillStyle = '#cbd5e1'; // kneecaps
    ctx.fillRect(10, 32, 4, 2);
    ctx.fillRect(18, 32, 4, 2);
  });

  // 2. Skeleton Archer (32x40) - Floor 1 Ranged Attacker
  createTextureFromCanvas(scene, 'monster_skeleton_archer', 32, 40, (ctx) => {
    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(16, 38, 12, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Archer's Tattered Leather Hood
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(9, 2, 14, 13);
    ctx.fillStyle = '#44403c';
    ctx.fillRect(10, 3, 12, 6);

    // Skull inside hood
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(11, 7, 10, 7);

    // Glowing Cyan Soul Eyes (ranger focus)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(12, 9, 3, 2);
    ctx.fillRect(17, 9, 3, 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(13, 9, 2, 2);
    ctx.fillRect(18, 9, 2, 2);

    // Ribcage & Leather Quiver Strap
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(10, 15, 12, 11);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(11, 17, 10, 2);
    ctx.fillRect(11, 21, 10, 2);
    // Quiver strap diagonal
    ctx.fillStyle = '#78350f';
    ctx.fillRect(10, 15, 3, 3);
    ctx.fillRect(13, 18, 3, 3);
    ctx.fillRect(16, 21, 3, 3);

    // Bone Bow in Left Hand
    ctx.fillStyle = '#f8fafc'; // bone bow limbs
    ctx.fillRect(4, 6, 3, 4);
    ctx.fillRect(3, 10, 2, 18);
    ctx.fillRect(4, 28, 3, 4);
    ctx.fillStyle = '#94a3b8'; // bone wrap
    ctx.fillRect(2, 18, 4, 3);
    // Bowstring
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(5, 7, 1, 24);

    // Arrow drawn
    ctx.fillStyle = '#d4d4d8';
    ctx.fillRect(4, 19, 16, 2); // arrow shaft
    ctx.fillStyle = '#38bdf8'; // glowing spectral arrowhead
    ctx.fillRect(2, 18, 3, 4);
    // White arrow fletching
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(18, 17, 3, 2);
    ctx.fillRect(18, 21, 3, 2);

    // Legs & Boots
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(11, 28, 3, 9);
    ctx.fillRect(18, 28, 3, 9);
    ctx.fillStyle = '#44403c'; // ragged leather leg wraps
    ctx.fillRect(10, 32, 4, 4);
    ctx.fillRect(17, 32, 4, 4);
  });

  // 3. Acid Slime (30x26) - Upgraded Translucent Gelatinous Monster
  createTextureFromCanvas(scene, 'monster_slime', 30, 26, (ctx) => {
    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(15, 23, 13, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Outer translucent dark jelly
    ctx.fillStyle = '#14532d';
    ctx.beginPath();
    ctx.ellipse(15, 14, 14, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Inner bright toxic body
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.ellipse(15, 13, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Top bright slime highlight
    ctx.fillStyle = '#4ade80';
    ctx.beginPath();
    ctx.ellipse(13, 9, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#bbf7d0';
    ctx.beginPath();
    ctx.ellipse(11, 8, 4, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Floating dissolved mini skull inside the slime!
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(13, 14, 5, 4);
    ctx.fillStyle = '#14532d';
    ctx.fillRect(14, 15, 1, 1);
    ctx.fillRect(16, 15, 1, 1);

    // Sinister glowing eyes
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(8, 10, 4, 4);
    ctx.fillRect(18, 10, 4, 4);
    ctx.fillStyle = '#0f172a'; // black slit pupils
    ctx.fillRect(10, 10, 1, 4);
    ctx.fillRect(19, 10, 1, 4);

    // Toxic bubble bubbles
    ctx.fillStyle = '#86efac';
    ctx.beginPath();
    ctx.arc(6, 16, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(22, 17, 2, 0, Math.PI * 2);
    ctx.fill();
  });

  // 4. Ghoul (36x36) - Floor 1 Fast Leaping Melee Attacker
  createTextureFromCanvas(scene, 'monster_ghoul', 36, 36, (ctx) => {
    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(18, 33, 14, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hunched rotting body (decaying greenish flesh)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(10, 10, 16, 14);
    ctx.fillStyle = '#3f6212'; // decaying green flesh
    ctx.fillRect(11, 11, 14, 12);
    ctx.fillStyle = '#65a30d';
    ctx.fillRect(13, 12, 10, 9);

    // Exposed rotting bloody ribcage
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(12, 16, 8, 6);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(13, 17, 6, 1);
    ctx.fillRect(13, 19, 6, 1);

    // Horrific Feral Head
    ctx.fillStyle = '#365314';
    ctx.fillRect(18, 4, 14, 11);
    ctx.fillStyle = '#4d7c0f';
    ctx.fillRect(19, 5, 12, 9);

    // Gaping bloody mouth with jagged fangs
    ctx.fillStyle = '#450a0a';
    ctx.fillRect(24, 9, 8, 6);
    ctx.fillStyle = '#f8fafc'; // sharp needle teeth
    ctx.fillRect(25, 9, 1, 2);
    ctx.fillRect(27, 9, 1, 2);
    ctx.fillRect(29, 9, 1, 2);
    ctx.fillRect(26, 13, 1, 2);
    ctx.fillRect(28, 13, 1, 2);

    // Burning rabid red eyes
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(22, 6, 3, 3);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(23, 7, 1, 1);

    // Razor-sharp elongated bloody claws (pouncing arms)
    ctx.fillStyle = '#365314';
    ctx.fillRect(6, 15, 6, 5);
    ctx.fillRect(2, 18, 6, 4);
    ctx.fillStyle = '#e2e8f0'; // sharp bone claws
    ctx.fillRect(0, 20, 4, 2);
    ctx.fillRect(0, 23, 4, 2);
    ctx.fillStyle = '#b91c1c'; // blood on claws
    ctx.fillRect(0, 20, 2, 4);

    // Hind crawling legs
    ctx.fillStyle = '#3f6212';
    ctx.fillRect(10, 24, 5, 8);
    ctx.fillRect(18, 24, 5, 8);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(9, 31, 6, 2);
    ctx.fillRect(17, 31, 6, 2);
  });

  // 5. Boss Lich - "Lich Vương Tử Linh" (72x80) - Floor 1 Boss
  createTextureFromCanvas(scene, 'monster_boss_lich', 72, 80, (ctx) => {
    // Necromantic levitation aura / shadow
    ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
    ctx.beginPath();
    ctx.ellipse(36, 75, 24, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Royal Obsidian & Dark Teal Burial Robes
    ctx.fillStyle = '#091e28';
    ctx.beginPath();
    ctx.moveTo(36, 24);
    ctx.lineTo(16, 72);
    ctx.lineTo(56, 72);
    ctx.closePath();
    ctx.fill();

    // Robe folds & Gold Filigree
    ctx.fillStyle = '#0e3a47';
    ctx.fillRect(24, 30, 24, 40);
    ctx.fillStyle = '#ca8a04'; // gold embroidery
    ctx.fillRect(34, 30, 4, 40);
    ctx.fillRect(26, 68, 20, 2);

    // Spiked Bone Pauldrons
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(16, 24, 8, 8);
    ctx.fillRect(48, 24, 8, 8);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(14, 20, 4, 6);
    ctx.fillRect(54, 20, 4, 6);

    // Skeletal Lich Crown & Skull
    ctx.fillStyle = '#e2e8f0'; // skull
    ctx.fillRect(28, 12, 16, 14);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(30, 13, 12, 5);

    // Cold Cyan Necrotic Soul Eyes
    ctx.fillStyle = '#083344';
    ctx.fillRect(30, 17, 4, 4);
    ctx.fillRect(38, 17, 4, 4);
    ctx.fillStyle = '#22d3ee';
    ctx.fillRect(31, 18, 3, 3);
    ctx.fillRect(39, 18, 3, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(32, 19, 1, 1);
    ctx.fillRect(40, 19, 1, 1);

    // Ornate Royal Bone Crown with Gem
    ctx.fillStyle = '#eab308'; // golden crown
    ctx.fillRect(27, 8, 18, 4);
    ctx.fillRect(28, 4, 3, 5);
    ctx.fillRect(34, 2, 4, 7);
    ctx.fillRect(41, 4, 3, 5);
    ctx.fillStyle = '#06b6d4'; // soul phylactery gem in crown
    ctx.fillRect(35, 6, 2, 3);

    // Central Floating Soul Core in Ribcage
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(30, 34, 12, 14);
    // Ribs over core
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(29, 35, 14, 2);
    ctx.fillRect(30, 39, 12, 2);
    ctx.fillRect(31, 43, 10, 2);
    // Pulsing soul core
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(36, 41, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#a5f3fc';
    ctx.beginPath();
    ctx.arc(36, 41, 2, 0, Math.PI * 2);
    ctx.fill();

    // Gnarled Bone Staff in Right Hand
    ctx.fillStyle = '#475569';
    ctx.fillRect(58, 12, 4, 60);
    // Horned skull staff-head
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(55, 6, 10, 9);
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(57, 9, 2, 2);
    ctx.fillRect(61, 9, 2, 2);
    // Swirling soul flames above staff
    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.arc(60, 4, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#cffafe';
    ctx.beginPath();
    ctx.arc(60, 3, 3, 0, Math.PI * 2);
    ctx.fill();

    // Outstretched Left Hand Casting Dark Magic
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(10, 34, 8, 4);
    ctx.fillStyle = '#22d3ee'; // magic flare
    ctx.beginPath();
    ctx.arc(8, 36, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // =========================================================================
  // FLOOR 2: INFERNO MONSTERS & BOSS
  // =========================================================================

  // 6. Hellhound (44x32) - Floor 2 Fast Leaping Demon Beast
  createTextureFromCanvas(scene, 'monster_hellhound', 44, 32, (ctx) => {
    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(22, 29, 18, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Muscular Charred Body
    ctx.fillStyle = '#18181b';
    ctx.fillRect(8, 10, 26, 13);
    ctx.fillStyle = '#27272a';
    ctx.fillRect(10, 11, 22, 10);

    // Glowing Lava Fissures across body
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(14, 14, 6, 2);
    ctx.fillRect(18, 16, 8, 2);
    ctx.fillRect(24, 13, 5, 2);

    // Flaming Mane running along spine
    ctx.fillStyle = '#f97316';
    ctx.fillRect(8, 6, 18, 4);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(10, 4, 14, 3);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(6, 7, 4, 3);

    // Snarling Demon Hound Head
    ctx.fillStyle = '#18181b';
    ctx.fillRect(28, 7, 14, 11);
    ctx.fillStyle = '#27272a';
    ctx.fillRect(30, 8, 11, 9);

    // Spiked Horns / Ears
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(28, 3, 3, 5);
    ctx.fillRect(33, 4, 3, 4);

    // Snout, Jaws & Flaming Fangs
    ctx.fillStyle = '#450a0a';
    ctx.fillRect(35, 12, 9, 5);
    ctx.fillStyle = '#fef08a'; // glowing fiery teeth
    ctx.fillRect(37, 12, 2, 2);
    ctx.fillRect(40, 12, 2, 2);
    ctx.fillRect(38, 15, 2, 2);

    // Glowing Molten Eyes
    ctx.fillStyle = '#facc15';
    ctx.fillRect(33, 9, 3, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(34, 9, 1, 1);

    // Spiked Collar
    ctx.fillStyle = '#52525b';
    ctx.fillRect(26, 11, 3, 8);
    ctx.fillStyle = '#e4e4e7'; // spikes
    ctx.fillRect(25, 12, 2, 2);
    ctx.fillRect(25, 16, 2, 2);

    // Strong Paws & Claws
    ctx.fillStyle = '#18181b';
    ctx.fillRect(10, 21, 5, 8); // rear leg
    ctx.fillRect(24, 21, 5, 8); // front leg
    ctx.fillStyle = '#ea580c'; // magma claws
    ctx.fillRect(9, 27, 6, 2);
    ctx.fillRect(23, 27, 6, 2);

    // Flaming Tail
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(3, 10, 5, 3);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(1, 7, 4, 4);
  });

  // 7. Fire Imp (28x32) - Upgraded Fiery Trickster
  createTextureFromCanvas(scene, 'monster_imp', 28, 32, (ctx) => {
    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(14, 30, 9, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bat Wings
    ctx.fillStyle = '#450a0a';
    ctx.beginPath();
    ctx.moveTo(14, 14);
    ctx.lineTo(2, 6);
    ctx.lineTo(4, 20);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(14, 14);
    ctx.lineTo(26, 6);
    ctx.lineTo(24, 20);
    ctx.closePath();
    ctx.fill();

    // Imp Crimson Torso
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(8, 12, 12, 13);
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(10, 13, 8, 10);

    // Horns
    ctx.fillStyle = '#18181b';
    ctx.fillRect(8, 3, 3, 6);
    ctx.fillRect(17, 3, 3, 6);
    ctx.fillStyle = '#f97316'; // glowing horn tips
    ctx.fillRect(8, 2, 2, 2);
    ctx.fillRect(18, 2, 2, 2);

    // Imp Head & Face
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(9, 7, 10, 8);

    // Glowing Sulfur Eyes
    ctx.fillStyle = '#facc15';
    ctx.fillRect(10, 9, 2, 2);
    ctx.fillRect(16, 9, 2, 2);
    ctx.fillStyle = '#450a0a'; // fanged grin
    ctx.fillRect(12, 13, 4, 1);

    // Fireball in Claw
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(22, 22, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(22, 22, 2, 0, Math.PI * 2);
    ctx.fill();

    // Barbed Devil Tail
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(5, 23, 4, 2);
    ctx.fillRect(3, 21, 2, 3);
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(2, 20, 2, 2);

    // Legs
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(9, 25, 3, 5);
    ctx.fillRect(16, 25, 3, 5);
  });

  // 8. Cultist of Flame (36x44) - Floor 2 Dark Sorcerer
  createTextureFromCanvas(scene, 'monster_cultist', 36, 44, (ctx) => {
    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(18, 41, 12, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dark Crimson Robes
    ctx.fillStyle = '#450a0a';
    ctx.fillRect(10, 16, 16, 24);
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(12, 18, 12, 22);

    // Occult Flame Symbols on Robe
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(17, 24, 2, 12);
    ctx.fillRect(15, 28, 6, 2);

    // Cowled Hood
    ctx.fillStyle = '#290606';
    ctx.fillRect(10, 6, 16, 13);
    ctx.fillStyle = '#450a0a';
    ctx.fillRect(11, 7, 14, 10);

    // Brass Horned Mask
    ctx.fillStyle = '#d97706';
    ctx.fillRect(13, 9, 10, 7);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(12, 6, 2, 4); // mask horns
    ctx.fillRect(22, 6, 2, 4);

    // Blazing Eye Slits
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(14, 11, 3, 2);
    ctx.fillRect(19, 11, 3, 2);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(15, 11, 1, 1);
    ctx.fillRect(20, 11, 1, 1);

    // Sacrificial Flame Dagger (Right Hand)
    ctx.fillStyle = '#78350f';
    ctx.fillRect(28, 23, 2, 5);
    ctx.fillStyle = '#ea580c'; // fiery blade
    ctx.fillRect(27, 13, 3, 10);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(28, 14, 1, 8);

    // Flaming Brazier (Left Hand)
    ctx.fillStyle = '#52525b';
    ctx.fillRect(4, 23, 6, 5);
    ctx.fillStyle = '#f97316'; // flames
    ctx.beginPath();
    ctx.arc(7, 20, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(7, 19, 2, 0, Math.PI * 2);
    ctx.fill();
  });

  // 9. Golem (44x50) - Upgraded Magma Runic Colossus
  createTextureFromCanvas(scene, 'monster_golem', 44, 50, (ctx) => {
    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(22, 47, 16, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Massive Stone Body
    ctx.fillStyle = '#18181b';
    ctx.fillRect(8, 12, 28, 26);
    ctx.fillStyle = '#3f3f46';
    ctx.fillRect(10, 14, 24, 22);

    // Stone Texture Bevels
    ctx.fillStyle = '#52525b';
    ctx.fillRect(11, 15, 10, 8);
    ctx.fillRect(23, 25, 10, 9);

    // Head
    ctx.fillStyle = '#18181b';
    ctx.fillRect(14, 4, 16, 10);
    ctx.fillStyle = '#3f3f46';
    ctx.fillRect(15, 5, 14, 8);

    // Glowing Magma Fissures
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(14, 18, 5, 14);
    ctx.fillRect(18, 28, 12, 3);
    ctx.fillRect(27, 18, 3, 10);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(15, 20, 2, 9);
    ctx.fillRect(20, 29, 7, 1);

    // Blazing Core Eye
    ctx.fillStyle = '#f97316';
    ctx.fillRect(17, 7, 10, 4);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(20, 8, 4, 2);

    // Huge Stone Fists
    ctx.fillStyle = '#18181b';
    ctx.fillRect(2, 18, 8, 18);
    ctx.fillRect(34, 18, 8, 18);
    ctx.fillStyle = '#3f3f46';
    ctx.fillRect(3, 19, 6, 16);
    ctx.fillRect(35, 19, 6, 16);
    // Molten Knuckle Runes
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(3, 30, 6, 2);
    ctx.fillRect(35, 30, 6, 2);

    // Legs
    ctx.fillStyle = '#27272a';
    ctx.fillRect(12, 38, 8, 10);
    ctx.fillRect(24, 38, 8, 10);
  });

  // 10. Boss Ignis - "Hỏa Ma Tống Xuất Ignis" (80x80) - Floor 2 Boss
  createTextureFromCanvas(scene, 'monster_boss_ignis', 80, 80, (ctx) => {
    // Scorched Arena Shadow / Lava Heat Distortion
    ctx.fillStyle = 'rgba(234, 88, 12, 0.25)';
    ctx.beginPath();
    ctx.ellipse(40, 75, 28, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Flaming Shoulder Mantle / Roaring Flames
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(12, 28);
    ctx.lineTo(24, 6);
    ctx.lineTo(36, 22);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(68, 28);
    ctx.lineTo(56, 6);
    ctx.lineTo(44, 22);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(16, 26);
    ctx.lineTo(24, 10);
    ctx.lineTo(32, 22);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(64, 26);
    ctx.lineTo(56, 10);
    ctx.lineTo(48, 22);
    ctx.closePath();
    ctx.fill();

    // Colossal Tectonic Obsidian Armor
    ctx.fillStyle = '#09090b';
    ctx.fillRect(18, 24, 44, 38);
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(20, 26, 40, 34);

    // Molten Heart Core (1200°C)
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(26, 32, 28, 22);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(29, 35, 22, 16);
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(40, 43, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(40, 43, 3, 0, Math.PI * 2);
    ctx.fill();

    // Obsidian Spiked Horns
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.moveTo(26, 16);
    ctx.lineTo(14, 2);
    ctx.lineTo(32, 14);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(54, 16);
    ctx.lineTo(66, 2);
    ctx.lineTo(48, 14);
    ctx.closePath();
    ctx.fill();
    // Glowing horn edges
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(15, 4, 3, 8);
    ctx.fillRect(62, 4, 3, 8);

    // Demon Helmet & Furnace Visor
    ctx.fillStyle = '#0c0a09';
    ctx.fillRect(28, 12, 24, 14);
    // Molten eye slit
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(32, 16, 16, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(38, 17, 4, 2);

    // Gigantic Magma Fists
    ctx.fillStyle = '#18181b';
    ctx.fillRect(4, 28, 14, 26);
    ctx.fillRect(62, 28, 14, 26);
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(6, 40, 10, 12);
    ctx.fillRect(64, 40, 10, 12);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(8, 44, 6, 6);
    ctx.fillRect(66, 44, 6, 6);

    // Heavy Volcanic Pillar Legs
    ctx.fillStyle = '#18181b';
    ctx.fillRect(24, 60, 14, 15);
    ctx.fillRect(42, 60, 14, 15);
    ctx.fillStyle = '#ea580c'; // magma cracks on knees
    ctx.fillRect(26, 64, 10, 3);
    ctx.fillRect(44, 64, 10, 3);
  });

  // =========================================================================
  // FLOOR 3: VOID MONSTERS & BOSS
  // =========================================================================

  // 11. Void Eye (36x36) - Floor 3 Ranged Cosmic Aberration
  createTextureFromCanvas(scene, 'monster_void_eye', 36, 36, (ctx) => {
    // Levitation shadow
    ctx.fillStyle = 'rgba(88, 28, 135, 0.3)';
    ctx.beginPath();
    ctx.ellipse(18, 33, 12, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Writhing outer tendrils
    ctx.fillStyle = '#3b0764';
    ctx.beginPath();
    ctx.arc(18, 16, 16, 0, Math.PI * 2);
    ctx.fill();

    // Fleshy cosmic eyeball base
    ctx.fillStyle = '#581c87';
    ctx.beginPath();
    ctx.arc(18, 16, 13, 0, Math.PI * 2);
    ctx.fill();

    // Dark Sclera
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(18, 16, 10, 0, Math.PI * 2);
    ctx.fill();

    // Concentric Cosmic Violet Iris
    ctx.fillStyle = '#9333ea';
    ctx.beginPath();
    ctx.arc(18, 16, 7, 0, Math.PI * 2);
    ctx.fill();

    // Radiant Cyan/Magenta Pupil
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.arc(18, 16, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(18, 16, 2, 0, Math.PI * 2);
    ctx.fill();

    // Mini orbiting eye stalk
    ctx.fillStyle = '#7e22ce';
    ctx.beginPath();
    ctx.arc(6, 8, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(6, 8, 1, 0, Math.PI * 2);
    ctx.fill();

    // Cosmic starlight glint
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(15, 13, 2, 2);
  });

  // 12. Void Stalker (36x42) - Floor 3 Shadow Predator
  createTextureFromCanvas(scene, 'monster_stalker', 36, 42, (ctx) => {
    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(18, 39, 13, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wispy Shadow Body
    ctx.fillStyle = '#090514';
    ctx.fillRect(11, 12, 14, 18);
    ctx.fillStyle = '#1e1136';
    ctx.fillRect(13, 14, 10, 14);

    // Eerie Mask Face
    ctx.fillStyle = '#090514';
    ctx.fillRect(12, 4, 12, 10);

    // 4 Diamond Glowing Crimson Eyes
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(17, 5, 2, 2); // top
    ctx.fillRect(14, 8, 2, 2); // left
    ctx.fillRect(20, 8, 2, 2); // right
    ctx.fillRect(17, 11, 2, 2); // bottom

    // Void Scythe Blades (attached to arms)
    ctx.fillStyle = '#581c87';
    ctx.fillRect(5, 14, 4, 16);
    ctx.fillRect(27, 14, 4, 16);

    // Razor-sharp curved crystal blades
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.moveTo(5, 20);
    ctx.lineTo(0, 34);
    ctx.lineTo(7, 30);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(31, 20);
    ctx.lineTo(36, 34);
    ctx.lineTo(29, 30);
    ctx.closePath();
    ctx.fill();

    // Glowing blade edges
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(0, 31, 2, 4);
    ctx.fillRect(34, 31, 2, 4);

    // Tapering Shadow Legs / Wisps
    ctx.fillStyle = '#090514';
    ctx.fillRect(13, 28, 4, 11);
    ctx.fillRect(19, 28, 4, 11);
  });

  // 13. Necromancer (36x44) - Upgraded Void/Death Warlock
  createTextureFromCanvas(scene, 'monster_necromancer', 36, 44, (ctx) => {
    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(18, 41, 13, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dark emerald robe
    ctx.fillStyle = '#052e16';
    ctx.fillRect(10, 14, 16, 26);
    ctx.fillStyle = '#14532d';
    ctx.fillRect(12, 16, 12, 24);

    // Robe occult runes
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(17, 20, 2, 18);
    ctx.fillRect(15, 24, 6, 2);

    // Skull face & Cowl
    ctx.fillStyle = '#022c22';
    ctx.fillRect(10, 5, 16, 12);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(12, 6, 12, 9);

    // Piercing soul eyes
    ctx.fillStyle = '#052e16';
    ctx.fillRect(14, 8, 3, 3);
    ctx.fillRect(19, 8, 3, 3);
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(15, 9, 2, 2);
    ctx.fillRect(20, 9, 2, 2);

    // Green soul staff
    ctx.fillStyle = '#334155';
    ctx.fillRect(28, 4, 3, 38);
    // Horned staff skull
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(26, 4, 7, 7);
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(29, 3, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#bbf7d0';
    ctx.beginPath();
    ctx.arc(29, 2, 2, 0, Math.PI * 2);
    ctx.fill();
  });

  // 14. Abyssal Tentacle (32x56) - Floor 3 Stationary Obstacle
  createTextureFromCanvas(scene, 'monster_tentacle', 32, 56, (ctx) => {
    // Void Portal Base on Ground
    ctx.fillStyle = '#3b0764';
    ctx.beginPath();
    ctx.ellipse(16, 50, 15, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#7e22ce';
    ctx.beginPath();
    ctx.ellipse(16, 50, 11, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#38bdf8'; // rift core
    ctx.beginPath();
    ctx.ellipse(16, 50, 6, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Curved Segmented Tentacle
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.moveTo(11, 50);
    ctx.quadraticCurveTo(8, 28, 14, 10);
    ctx.lineTo(19, 10);
    ctx.quadraticCurveTo(23, 28, 21, 50);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#4338ca';
    ctx.beginPath();
    ctx.moveTo(13, 48);
    ctx.quadraticCurveTo(10, 28, 15, 12);
    ctx.lineTo(18, 12);
    ctx.quadraticCurveTo(21, 28, 19, 48);
    ctx.closePath();
    ctx.fill();

    // Suction Cups along left edge
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(10, 42, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(9, 34, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(10, 26, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(12, 18, 2, 0, Math.PI * 2);
    ctx.fill();

    // Barbed Chitinous Tip
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.moveTo(13, 12);
    ctx.lineTo(16, 2);
    ctx.lineTo(20, 12);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fda4af';
    ctx.fillRect(15, 3, 2, 7);
  });

  // 15. Boss Sovereign of the Void (80x88) - Floor 3 Boss (and default 'monster_boss')
  const drawBossSovereign = (ctx: CanvasRenderingContext2D) => {
    // Dark Void Distortion Shadow
    ctx.fillStyle = 'rgba(76, 29, 149, 0.35)';
    ctx.beginPath();
    ctx.ellipse(40, 83, 30, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Massive Sprawling Void Wings with Stars
    ctx.fillStyle = '#1e1035';
    ctx.beginPath();
    ctx.moveTo(40, 35);
    ctx.lineTo(4, 10);
    ctx.lineTo(10, 60);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(40, 35);
    ctx.lineTo(76, 10);
    ctx.lineTo(70, 60);
    ctx.closePath();
    ctx.fill();

    // Inner Wing Membranes with Glowing Nebulae
    ctx.fillStyle = '#4c1d95';
    ctx.beginPath();
    ctx.moveTo(38, 36);
    ctx.lineTo(8, 16);
    ctx.lineTo(14, 52);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(42, 36);
    ctx.lineTo(72, 16);
    ctx.lineTo(66, 52);
    ctx.closePath();
    ctx.fill();

    // Stars on wings
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(16, 28, 2, 2);
    ctx.fillRect(22, 40, 1.5, 1.5);
    ctx.fillRect(62, 28, 2, 2);
    ctx.fillRect(56, 40, 1.5, 1.5);

    // Armor Body
    ctx.fillStyle = '#090514';
    ctx.fillRect(24, 26, 32, 40);
    ctx.fillStyle = '#2e1065';
    ctx.fillRect(27, 30, 26, 34);

    // Glowing Void Runes on Chestplate
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(38, 32, 4, 24);
    ctx.fillRect(32, 40, 16, 3);
    ctx.fillRect(34, 48, 12, 2);
    ctx.fillStyle = '#38bdf8'; // rune core
    ctx.beginPath();
    ctx.arc(40, 41, 3, 0, Math.PI * 2);
    ctx.fill();

    // Spiked Pauldrons
    ctx.fillStyle = '#4c1d95';
    ctx.fillRect(16, 25, 10, 11);
    ctx.fillRect(54, 25, 10, 11);
    ctx.fillStyle = '#7e22ce';
    ctx.fillRect(14, 21, 5, 8);
    ctx.fillRect(61, 21, 5, 8);

    // Horned Void Helm
    ctx.fillStyle = '#090514';
    ctx.fillRect(28, 10, 24, 18);
    // Sweeping Horns
    ctx.fillStyle = '#831843';
    ctx.beginPath();
    ctx.moveTo(28, 12);
    ctx.lineTo(16, 0);
    ctx.lineTo(32, 16);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(52, 12);
    ctx.lineTo(64, 0);
    ctx.lineTo(48, 16);
    ctx.closePath();
    ctx.fill();

    // Glowing Eyes (4 Void Eyes)
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(32, 16, 4, 3);
    ctx.fillRect(44, 16, 4, 3);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(34, 22, 3, 2);
    ctx.fillRect(43, 22, 3, 2);

    // Colossal Void Greatsword (Right Hand)
    ctx.fillStyle = '#78350f'; // grip
    ctx.fillRect(66, 38, 4, 10);
    ctx.fillStyle = '#eab308'; // guard
    ctx.fillRect(61, 35, 14, 3);
    ctx.fillStyle = '#4c1d95'; // broad blade
    ctx.fillRect(65, 2, 6, 68);
    ctx.fillStyle = '#c084fc'; // glowing edge
    ctx.fillRect(67, 4, 2, 64);
    ctx.fillStyle = '#ffffff'; // tip glint
    ctx.fillRect(66, 2, 4, 3);

    // Heavy Plated Boots & Greaves
    ctx.fillStyle = '#090514';
    ctx.fillRect(27, 66, 11, 16);
    ctx.fillRect(42, 66, 11, 16);
    ctx.fillStyle = '#4c1d95';
    ctx.fillRect(29, 68, 7, 12);
    ctx.fillRect(44, 68, 7, 12);
  };

  createTextureFromCanvas(scene, 'monster_boss_sovereign', 80, 88, drawBossSovereign);
  // Also register 'monster_boss' for backward compatibility
  createTextureFromCanvas(scene, 'monster_boss', 80, 88, drawBossSovereign);
}
