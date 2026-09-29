import Phaser from 'phaser';
import { createTextureFromCanvas } from './TextureHelper';

export function registerHeroTextures(scene: Phaser.Scene): void {
  // =========================================================================
  // 1. HERO IN-GAME SPRITES (16/32-Bit Dark Fantasy Retro Pixel Art)
  // =========================================================================

  // --- 1.1 Knight (36x44): Blood Knight with Heavy Steel Armor, Crimson Cape & Runed Greatsword ---
  createTextureFromCanvas(scene, 'hero_knight', 36, 44, (ctx) => {
    // Shadow under feet
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(18, 41, 14, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Billowing Crimson Cape (Left & Right background layers)
    ctx.fillStyle = '#4c0519'; // deep shadow
    ctx.fillRect(5, 17, 6, 21);
    ctx.fillRect(25, 17, 6, 21);
    ctx.fillStyle = '#9f1239'; // mid crimson
    ctx.fillRect(6, 18, 4, 19);
    ctx.fillRect(26, 18, 4, 19);
    ctx.fillStyle = '#e11d48'; // cape highlight / fold
    ctx.fillRect(7, 19, 2, 17);
    ctx.fillRect(27, 19, 2, 17);
    // Tattered cape edges
    ctx.fillStyle = '#4c0519';
    ctx.fillRect(5, 38, 2, 3);
    ctx.fillRect(9, 37, 2, 2);
    ctx.fillRect(25, 38, 2, 3);
    ctx.fillRect(29, 37, 2, 2);

    // Sabatons / Greaves
    ctx.fillStyle = '#0f172a'; // boot outline
    ctx.fillRect(11, 35, 6, 8);
    ctx.fillRect(19, 35, 6, 8);
    ctx.fillStyle = '#334155'; // plate steel
    ctx.fillRect(12, 36, 4, 6);
    ctx.fillRect(20, 36, 4, 6);
    ctx.fillStyle = '#94a3b8'; // steel highlight
    ctx.fillRect(12, 36, 1, 4);
    ctx.fillRect(20, 36, 1, 4);
    ctx.fillStyle = '#d97706'; // gold knee studs
    ctx.fillRect(13, 33, 2, 2);
    ctx.fillRect(21, 33, 2, 2);

    // Cuirass / Breastplate
    ctx.fillStyle = '#0f172a'; // outline
    ctx.fillRect(9, 15, 18, 19);
    ctx.fillStyle = '#1e293b'; // dark plate base
    ctx.fillRect(10, 16, 16, 17);
    ctx.fillStyle = '#475569'; // steel midtone
    ctx.fillRect(12, 17, 12, 14);
    ctx.fillStyle = '#94a3b8'; // plate chest ridge highlight
    ctx.fillRect(17, 17, 2, 12);
    ctx.fillStyle = '#cbd5e1'; // specular sheen
    ctx.fillRect(13, 18, 2, 4);

    // Gold filigree trim & Belt
    ctx.fillStyle = '#b45309'; // gold shadow
    ctx.fillRect(10, 15, 16, 2);
    ctx.fillRect(11, 30, 14, 3); // belt
    ctx.fillStyle = '#f59e0b'; // bright gold
    ctx.fillRect(11, 15, 14, 1);
    ctx.fillStyle = '#fde68a'; // gold buckle
    ctx.fillRect(16, 30, 4, 3);

    // Spiked Pauldrons (Shoulders)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(7, 14, 5, 5);
    ctx.fillRect(24, 14, 5, 5);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(8, 15, 3, 3);
    ctx.fillRect(25, 15, 3, 3);
    ctx.fillStyle = '#f59e0b'; // pauldron gold spike
    ctx.fillRect(8, 13, 2, 2);
    ctx.fillRect(26, 13, 2, 2);

    // Crusader Great Helm
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(10, 5, 16, 11);
    ctx.fillStyle = '#334155';
    ctx.fillRect(11, 6, 14, 9);
    ctx.fillStyle = '#94a3b8'; // helm brow highlight
    ctx.fillRect(12, 6, 12, 2);
    // Gold cross on forehead
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(17, 6, 2, 4);
    ctx.fillRect(15, 7, 6, 2);
    // Visor slit
    ctx.fillStyle = '#020617';
    ctx.fillRect(11, 10, 14, 3);
    // Crimson eye glint
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(14, 11, 2, 1);
    ctx.fillRect(20, 11, 2, 1);
    ctx.fillStyle = '#fca5a5';
    ctx.fillRect(15, 11, 1, 1);
    ctx.fillRect(21, 11, 1, 1);

    // Red Feathery Plume on helmet
    ctx.fillStyle = '#881337';
    ctx.fillRect(16, 1, 5, 5);
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(17, 2, 4, 3);
    ctx.fillStyle = '#fda4af';
    ctx.fillRect(18, 2, 2, 2);

    // Left Arm Kite Shield (Blood heraldry crest)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(1, 18, 9, 16);
    ctx.fillStyle = '#1e3a8a'; // royal navy blue
    ctx.fillRect(2, 19, 7, 14);
    ctx.fillStyle = '#991b1b'; // crimson lower quadrant
    ctx.fillRect(2, 26, 7, 6);
    ctx.fillStyle = '#f59e0b'; // golden heraldic cross/lion
    ctx.fillRect(5, 21, 2, 10);
    ctx.fillRect(3, 24, 5, 2);
    ctx.fillStyle = '#fde68a'; // shield edge highlight
    ctx.fillRect(2, 19, 1, 13);

    // Right Arm Heavy Runed Greatsword
    // Blade
    ctx.fillStyle = '#0f172a'; // blade outline
    ctx.fillRect(28, 4, 5, 28);
    ctx.fillStyle = '#64748b'; // blade body
    ctx.fillRect(29, 5, 3, 26);
    ctx.fillStyle = '#f8fafc'; // gleaming edge
    ctx.fillRect(30, 5, 1, 25);
    // Crimson runic channel down fuller
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(29, 9, 1, 14);
    // Gold Crossguard & Pommel
    ctx.fillStyle = '#b45309';
    ctx.fillRect(26, 31, 9, 3);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(27, 31, 7, 2);
    ctx.fillStyle = '#451a03'; // leather handle grip
    ctx.fillRect(29, 34, 3, 5);
    ctx.fillStyle = '#facc15'; // golden pommel
    ctx.fillRect(29, 39, 3, 2);
    ctx.fillStyle = '#dc2626'; // ruby in pommel
    ctx.fillRect(30, 39, 1, 1);
  });

  // --- 1.2 Mage (36x44): Abyssal Void Archmage with Velvet Robes, Cowl & Arcane Staff ---
  createTextureFromCanvas(scene, 'hero_mage', 36, 44, (ctx) => {
    // Shadow under feet
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(18, 41, 14, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Layered Abyssal Indigo/Violet Velvet Robes
    ctx.fillStyle = '#170529'; // dark shadow outline
    ctx.fillRect(9, 15, 18, 26);
    ctx.fillStyle = '#2e1065'; // deep velvet
    ctx.fillRect(10, 16, 16, 24);
    ctx.fillStyle = '#581c87'; // midtone purple
    ctx.fillRect(12, 17, 12, 22);
    ctx.fillStyle = '#7e22ce'; // highlight fold
    ctx.fillRect(13, 20, 3, 18);
    ctx.fillRect(20, 20, 3, 18);

    // Gold mystic hem & embroidered runes
    ctx.fillStyle = '#b45309';
    ctx.fillRect(9, 38, 18, 3);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(10, 39, 16, 1);
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(12, 38, 2, 2);
    ctx.fillRect(16, 38, 2, 2);
    ctx.fillRect(20, 38, 2, 2);

    // Waist sash & Occult Talisman
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(11, 25, 14, 3);
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(12, 26, 12, 1);
    ctx.fillStyle = '#f472b6'; // glowing soul gem at belt
    ctx.fillRect(17, 25, 2, 3);

    // Deep Wizard Cowl Hood
    ctx.fillStyle = '#170529';
    ctx.fillRect(9, 4, 18, 13);
    ctx.fillStyle = '#3b0764';
    ctx.fillRect(10, 5, 16, 11);
    ctx.fillStyle = '#6b21a8'; // cowl brow highlight
    ctx.fillRect(11, 5, 14, 2);

    // Gold embroidery around hood edge
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(10, 6, 1, 9);
    ctx.fillRect(25, 6, 1, 9);

    // Pitch-black shadow face void
    ctx.fillStyle = '#030008';
    ctx.fillRect(11, 8, 14, 7);

    // Glowing mystical amethyst eyes
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(13, 10, 3, 2);
    ctx.fillRect(20, 10, 3, 2);
    ctx.fillStyle = '#ffffff'; // intense core pupil
    ctx.fillRect(14, 10, 1, 1);
    ctx.fillRect(21, 10, 1, 1);

    // Faint arcane forehead glyph
    ctx.fillStyle = '#e879f9';
    ctx.fillRect(17, 7, 2, 2);

    // Left hand casting magic aura
    ctx.fillStyle = '#581c87'; // sleeve
    ctx.fillRect(6, 20, 5, 6);
    ctx.fillStyle = '#fed7aa'; // pale hand
    ctx.fillRect(7, 25, 3, 2);
    // Floating magical sparks above palm
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(6, 23, 2, 2);
    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(8, 22, 1, 1);

    // Right hand: Elderwood Staff of the Void
    ctx.fillStyle = '#451a03'; // staff wood
    ctx.fillRect(28, 7, 3, 34);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(29, 8, 1, 32);
    // Gold claws holding orb
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(27, 8, 5, 2);
    ctx.fillRect(26, 6, 2, 3);
    ctx.fillRect(31, 6, 2, 3);

    // Floating Arcane Celestial Orb
    ctx.fillStyle = '#581c87'; // outer glow
    ctx.beginPath();
    ctx.arc(29, 4, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#a855f7'; // mid purple
    ctx.beginPath();
    ctx.arc(29, 4, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#67e8f9'; // cyan cosmic ring
    ctx.beginPath();
    ctx.arc(29, 4, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff'; // intense center
    ctx.fillRect(28, 3, 2, 2);
  });

  // --- 1.3 Rogue (36x44): Shadow Assassin with Stealth Cowl & Dual Toxic Kris Daggers ---
  createTextureFromCanvas(scene, 'hero_rogue', 36, 44, (ctx) => {
    // Shadow under feet
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(18, 41, 13, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Agile Padded Boots
    ctx.fillStyle = '#020617';
    ctx.fillRect(11, 35, 6, 8);
    ctx.fillRect(19, 35, 6, 8);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(12, 36, 4, 6);
    ctx.fillRect(20, 36, 4, 6);
    ctx.fillStyle = '#475569'; // strap buckles
    ctx.fillRect(12, 37, 4, 1);
    ctx.fillRect(20, 37, 4, 1);

    // Stealth Leather Brigandine
    ctx.fillStyle = '#020617'; // outline
    ctx.fillRect(9, 15, 18, 19);
    ctx.fillStyle = '#0f172a'; // dark midnight leather
    ctx.fillRect(10, 16, 16, 17);
    ctx.fillStyle = '#1e293b'; // leather midtone
    ctx.fillRect(11, 17, 14, 14);

    // Diagonal Bandolier with silver throwing knives
    ctx.fillStyle = '#334155';
    ctx.fillRect(10, 17, 4, 14);
    ctx.fillStyle = '#94a3b8'; // throwing dagger hilts
    ctx.fillRect(11, 18, 2, 2);
    ctx.fillRect(12, 22, 2, 2);
    ctx.fillRect(13, 26, 2, 2);
    ctx.fillStyle = '#059669'; // poison vials at hip
    ctx.fillRect(22, 28, 2, 3);
    ctx.fillRect(24, 28, 2, 3);

    // Cloak Tail Fluttering
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(7, 24, 4, 15);
    ctx.fillStyle = '#134e4a'; // subtle deep teal trim
    ctx.fillRect(7, 36, 3, 4);

    // Shadow Cowl & Assassin Face Wrap
    ctx.fillStyle = '#042f2e'; // deep emerald-teal shadow
    ctx.fillRect(10, 5, 16, 11);
    ctx.fillStyle = '#0f766e'; // cowl midtone
    ctx.fillRect(11, 6, 14, 9);
    ctx.fillStyle = '#14b8a6'; // cowl brow edge
    ctx.fillRect(12, 6, 12, 2);

    // Assassin Lower Face Mask
    ctx.fillStyle = '#020617';
    ctx.fillRect(11, 12, 14, 4);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(12, 13, 12, 2);

    // Piercing Toxic Emerald Glowing Eyes
    ctx.fillStyle = '#059669';
    ctx.fillRect(13, 9, 3, 2);
    ctx.fillRect(20, 9, 3, 2);
    ctx.fillStyle = '#34d399'; // bright green glow
    ctx.fillRect(14, 9, 2, 1);
    ctx.fillRect(21, 9, 2, 1);
    ctx.fillStyle = '#ecfdf5'; // white gleam
    ctx.fillRect(15, 9, 1, 1);
    ctx.fillRect(22, 9, 1, 1);

    // Left Toxic Kris Dagger (Reverse grip)
    ctx.fillStyle = '#020617';
    ctx.fillRect(3, 16, 5, 17);
    ctx.fillStyle = '#475569'; // steel core
    ctx.fillRect(4, 17, 3, 14);
    ctx.fillStyle = '#10b981'; // venom coated edge
    ctx.fillRect(3, 19, 1, 11);
    ctx.fillStyle = '#6ee7b7'; // venom glint
    ctx.fillRect(4, 21, 1, 6);
    ctx.fillStyle = '#10b981'; // dripping drop
    ctx.fillRect(4, 32, 2, 2);
    // Dagger hilt
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(3, 15, 6, 2);

    // Right Toxic Kris Dagger (Forward strike grip)
    ctx.fillStyle = '#020617';
    ctx.fillRect(28, 16, 5, 17);
    ctx.fillStyle = '#475569';
    ctx.fillRect(29, 17, 3, 14);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(32, 19, 1, 11);
    ctx.fillStyle = '#6ee7b7';
    ctx.fillRect(30, 20, 1, 6);
    ctx.fillStyle = '#10b981'; // dripping drop
    ctx.fillRect(30, 32, 2, 2);
    // Dagger hilt
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(27, 15, 6, 2);
  });

  // --- 1.4 Paladin (40x46): Golden White Plate Armor, Warhammer, Radiant Shield, Sun Emblem, Azure Cape ---
  createTextureFromCanvas(scene, 'hero_paladin', 40, 46, (ctx) => {
    // Shadow under feet
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(20, 43, 16, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Flowing Azure Cape (Draped behind shoulders and billowing on sides)
    ctx.fillStyle = '#172554'; // deep royal blue shadow
    ctx.fillRect(5, 18, 6, 23);
    ctx.fillRect(29, 18, 6, 23);
    ctx.fillStyle = '#1d4ed8'; // royal blue
    ctx.fillRect(6, 19, 4, 21);
    ctx.fillRect(30, 19, 4, 21);
    ctx.fillStyle = '#60a5fa'; // bright azure sheen
    ctx.fillRect(7, 20, 2, 19);
    ctx.fillRect(31, 20, 2, 19);
    // Gold trim on cape bottom
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(5, 39, 6, 2);
    ctx.fillRect(29, 39, 6, 2);

    // Sabatons & Greaves (Gleaming white plate with gold borders)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(12, 36, 7, 9);
    ctx.fillRect(21, 36, 7, 9);
    ctx.fillStyle = '#e2e8f0'; // white enamel plate
    ctx.fillRect(13, 37, 5, 7);
    ctx.fillRect(22, 37, 5, 7);
    ctx.fillStyle = '#f8fafc'; // gleaming highlight
    ctx.fillRect(14, 37, 2, 5);
    ctx.fillRect(23, 37, 2, 5);
    ctx.fillStyle = '#f59e0b'; // golden knee poleyns
    ctx.fillRect(13, 34, 4, 3);
    ctx.fillRect(23, 34, 4, 3);

    // Cuirass: White Enamel Breastplate with Holy Sun Emblem
    ctx.fillStyle = '#0f172a'; // outline
    ctx.fillRect(10, 16, 20, 19);
    ctx.fillStyle = '#94a3b8'; // plate shadow
    ctx.fillRect(11, 17, 18, 17);
    ctx.fillStyle = '#f1f5f9'; // pure white plate
    ctx.fillRect(12, 17, 16, 15);
    ctx.fillStyle = '#ffffff'; // specular gleam
    ctx.fillRect(13, 18, 4, 6);

    // Ornate Gold Filigree & Belt
    ctx.fillStyle = '#b45309';
    ctx.fillRect(11, 16, 18, 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(12, 16, 16, 1);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(12, 31, 16, 3); // gold belt
    ctx.fillStyle = '#fde68a'; // holy sun buckle
    ctx.fillRect(18, 30, 4, 4);

    // Holy Sun Emblem on Chest
    ctx.fillStyle = '#f59e0b'; // sun core
    ctx.beginPath();
    ctx.arc(20, 24, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fde047'; // sun rays
    ctx.fillRect(19, 19, 2, 2);
    ctx.fillRect(19, 27, 2, 2);
    ctx.fillRect(15, 23, 2, 2);
    ctx.fillRect(23, 23, 2, 2);

    // Winged Golden Pauldrons (Shoulders)
    ctx.fillStyle = '#b45309';
    ctx.fillRect(7, 14, 6, 6);
    ctx.fillRect(27, 14, 6, 6);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(8, 14, 5, 5);
    ctx.fillRect(27, 14, 5, 5);
    ctx.fillStyle = '#fef08a'; // gold wing edge
    ctx.fillRect(7, 13, 3, 2);
    ctx.fillRect(30, 13, 3, 2);

    // Golden Winged Crusader Helmet
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(12, 5, 16, 11);
    ctx.fillStyle = '#f8fafc'; // white plate helmet
    ctx.fillRect(13, 6, 14, 9);
    ctx.fillStyle = '#f59e0b'; // gold crown & visor brow
    ctx.fillRect(13, 5, 14, 2);
    ctx.fillRect(19, 3, 2, 3); // crest point
    // Golden wings on side of helmet
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(10, 5, 3, 4);
    ctx.fillRect(27, 5, 3, 4);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(9, 4, 2, 3);
    ctx.fillRect(29, 4, 2, 3);
    // T-Visor slit
    ctx.fillStyle = '#020617';
    ctx.fillRect(13, 10, 14, 3);
    ctx.fillRect(19, 10, 2, 5);
    // Glowing divine celestial eyes
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(15, 11, 2, 1);
    ctx.fillRect(23, 11, 2, 1);
    ctx.fillStyle = '#fef08a'; // inner holy flare
    ctx.fillRect(16, 11, 1, 1);
    ctx.fillRect(24, 11, 1, 1);

    // Radiant Tower Shield (Left hand, x=1-10, y=18-38)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(1, 18, 10, 19);
    ctx.fillStyle = '#f8fafc'; // pure white field
    ctx.fillRect(2, 19, 8, 17);
    ctx.fillStyle = '#b45309'; // heavy gold border
    ctx.fillRect(2, 19, 8, 2);
    ctx.fillRect(2, 34, 8, 2);
    ctx.fillRect(2, 19, 2, 17);
    ctx.fillRect(8, 19, 2, 17);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(3, 20, 6, 1);
    // Radiant Sunburst Boss
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(6, 27, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.fillRect(5, 23, 2, 2);
    ctx.fillRect(5, 29, 2, 2);
    ctx.fillRect(2, 26, 2, 2);
    ctx.fillRect(8, 26, 2, 2);

    // Glowing Holy Warhammer (Right hand, x=30-39, y=6-41)
    // Dark steel & gold wrapped haft
    ctx.fillStyle = '#451a03';
    ctx.fillRect(33, 12, 3, 26);
    ctx.fillStyle = '#f59e0b'; // gold grip bands
    ctx.fillRect(33, 18, 3, 1);
    ctx.fillRect(33, 24, 3, 1);
    ctx.fillRect(33, 30, 3, 1);
    ctx.fillStyle = '#fde047'; // gold pommel
    ctx.fillRect(33, 38, 3, 3);
    // Warhammer Head (Massive double-faced golden maul with holy rune)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(29, 6, 10, 8);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(30, 7, 8, 6);
    ctx.fillStyle = '#facc15'; // gold plate face
    ctx.fillRect(31, 8, 6, 4);
    ctx.fillStyle = '#fef08a'; // divine glowing rune
    ctx.fillRect(33, 9, 2, 2);
    // Hammer top spike
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(33, 4, 3, 3);
    ctx.fillRect(34, 3, 1, 2);
    // Holy radiant sparks around warhammer
    ctx.fillStyle = '#fde047';
    ctx.fillRect(28, 5, 1, 1);
    ctx.fillRect(39, 7, 1, 1);
    ctx.fillRect(30, 14, 1, 1);
  });

  // --- 1.5 Ranger (36x44): Elven Emerald Tunic, Wolf Fur, Ice-Crystal Bow, Quiver & Agile Boots ---
  createTextureFromCanvas(scene, 'hero_ranger', 36, 44, (ctx) => {
    // Shadow under feet
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(18, 41, 13, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Agile Leather Tracking Boots (Stitched soft calf-leather)
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(11, 35, 6, 8);
    ctx.fillRect(19, 35, 6, 8);
    ctx.fillStyle = '#451a03'; // deep leather brown
    ctx.fillRect(12, 36, 4, 6);
    ctx.fillRect(20, 36, 4, 6);
    ctx.fillStyle = '#78350f'; // cross lacing
    ctx.fillRect(12, 38, 4, 1);
    ctx.fillRect(20, 38, 4, 1);

    // Quiver with Glowing Frost Arrows (Worn over left shoulder)
    ctx.fillStyle = '#451a03'; // leather quiver body
    ctx.fillRect(5, 12, 5, 16);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(6, 13, 3, 14);
    // Arrow fletchings & Glowing cyan arrow tips
    ctx.fillStyle = '#38bdf8'; // glowing ice tips
    ctx.fillRect(5, 7, 2, 4);
    ctx.fillRect(8, 6, 2, 5);
    ctx.fillStyle = '#ffffff'; // frosted fletchings
    ctx.fillRect(5, 10, 2, 2);
    ctx.fillRect(8, 9, 2, 2);

    // Elven Emerald Hunter Tunic
    ctx.fillStyle = '#022c22'; // deep shadow outline
    ctx.fillRect(9, 15, 18, 19);
    ctx.fillStyle = '#065f46'; // rich forest green
    ctx.fillRect(10, 16, 16, 17);
    ctx.fillStyle = '#059669'; // tunic midtone
    ctx.fillRect(12, 17, 12, 15);
    ctx.fillStyle = '#10b981'; // highlight weave
    ctx.fillRect(13, 18, 2, 13);
    ctx.fillRect(21, 18, 2, 13);

    // Cinch Belt & Hunting Pouches
    ctx.fillStyle = '#451a03';
    ctx.fillRect(11, 29, 14, 3);
    ctx.fillStyle = '#ca8a04'; // bronze buckle
    ctx.fillRect(17, 29, 2, 3);

    // Wolf / Fox Fur Mantle across shoulders
    ctx.fillStyle = '#78350f'; // fur shadow
    ctx.fillRect(8, 14, 20, 6);
    ctx.fillStyle = '#b45309'; // warm fur midtone
    ctx.fillRect(9, 14, 18, 4);
    ctx.fillStyle = '#fde68a'; // pale fur fringe
    ctx.fillRect(8, 18, 2, 2);
    ctx.fillRect(12, 19, 2, 2);
    ctx.fillRect(16, 19, 2, 2);
    ctx.fillRect(22, 18, 2, 2);
    ctx.fillRect(26, 18, 2, 2);

    // Cowl Hood & Pointed Elven Ears
    ctx.fillStyle = '#022c22';
    ctx.fillRect(10, 5, 16, 11);
    ctx.fillStyle = '#047857';
    ctx.fillRect(11, 6, 14, 9);
    ctx.fillStyle = '#10b981'; // cowl rim highlight
    ctx.fillRect(12, 6, 12, 2);
    // Pointed Elven Ear peeking out
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(8, 10, 3, 2);
    ctx.fillRect(7, 9, 2, 2);

    // Face in cowl shadow
    ctx.fillStyle = '#022c22';
    ctx.fillRect(11, 8, 14, 6);
    ctx.fillStyle = '#fed7aa'; // pale face
    ctx.fillRect(12, 9, 12, 4);

    // Sharp Hawk-like Frost Cyan Eyes
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(13, 10, 3, 2);
    ctx.fillRect(20, 10, 3, 2);
    ctx.fillStyle = '#7dd3fc'; // ice glow
    ctx.fillRect(14, 10, 2, 1);
    ctx.fillRect(21, 10, 2, 1);
    ctx.fillStyle = '#ffffff'; // sharp pupil gleam
    ctx.fillRect(15, 10, 1, 1);
    ctx.fillRect(22, 10, 1, 1);

    // Red hawk feather pinned to cowl
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(23, 3, 3, 5);
    ctx.fillStyle = '#f87171';
    ctx.fillRect(24, 4, 1, 3);

    // Large Recurve Ice-Crystal Bow (Right hand / forward, x=24-34, y=4-40)
    // Taut glowing silver bowstring
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(26, 6, 1, 32);

    // Glacial Ice Bow Riser & Limbs
    ctx.fillStyle = '#0369a1'; // deep glacier shadow
    ctx.fillRect(27, 4, 4, 4);
    ctx.fillRect(29, 8, 3, 6);
    ctx.fillRect(30, 14, 3, 16); // grip
    ctx.fillRect(29, 30, 3, 6);
    ctx.fillRect(27, 36, 4, 4);

    ctx.fillStyle = '#38bdf8'; // vibrant crystal ice
    ctx.fillRect(28, 5, 3, 3);
    ctx.fillRect(30, 9, 2, 5);
    ctx.fillRect(31, 15, 2, 14);
    ctx.fillRect(30, 30, 2, 5);
    ctx.fillRect(28, 36, 3, 3);

    ctx.fillStyle = '#ffffff'; // frosted rime highlight
    ctx.fillRect(29, 5, 1, 2);
    ctx.fillRect(31, 18, 1, 8);
    ctx.fillRect(29, 37, 1, 2);

    // Frost mist particles hovering near bow
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(34, 8, 1, 1);
    ctx.fillRect(33, 22, 1, 1);
    ctx.fillRect(34, 34, 1, 1);
  });

  // --- 1.6 Warlock (38x44): Tattered Abyssal Robes, Skull Buckle, Demonic Horns, Bone Scythe, Skull Orb ---
  createTextureFromCanvas(scene, 'hero_warlock', 38, 44, (ctx) => {
    // Shadow under feet
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(19, 41, 14, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tattered Abyssal Violet & Charcoal Robes
    ctx.fillStyle = '#10061f'; // dark shadow outline
    ctx.fillRect(10, 16, 18, 25);
    ctx.fillStyle = '#2e1065'; // deep abyssal violet
    ctx.fillRect(11, 17, 16, 23);
    ctx.fillStyle = '#581c87'; // midtone violet
    ctx.fillRect(13, 18, 12, 21);
    ctx.fillStyle = '#7e22ce'; // robe fold highlight
    ctx.fillRect(14, 20, 3, 17);
    ctx.fillRect(21, 20, 3, 17);

    // Ragged, tattered hem shredding into dark mist
    ctx.fillStyle = '#10061f';
    ctx.fillRect(11, 39, 2, 4);
    ctx.fillRect(14, 40, 3, 3);
    ctx.fillRect(19, 39, 2, 4);
    ctx.fillRect(23, 40, 3, 3);
    ctx.fillStyle = '#9333ea'; // necrotic embers at hem
    ctx.fillRect(13, 42, 1, 1);
    ctx.fillRect(21, 42, 1, 1);

    // Occult Chains across torso
    ctx.fillStyle = '#475569';
    ctx.fillRect(12, 19, 2, 2);
    ctx.fillRect(15, 22, 2, 2);
    ctx.fillRect(18, 25, 2, 2);
    ctx.fillRect(21, 22, 2, 2);
    ctx.fillRect(24, 19, 2, 2);

    // Bleached Bone Skull Belt Buckle at waist
    ctx.fillStyle = '#020617';
    ctx.fillRect(12, 27, 14, 3); // dark belt
    ctx.fillStyle = '#f1f5f9'; // miniature bone skull
    ctx.fillRect(17, 26, 5, 5);
    ctx.fillStyle = '#0f172a'; // skull eye holes & mouth
    ctx.fillRect(18, 27, 1, 1);
    ctx.fillRect(20, 27, 1, 1);
    ctx.fillRect(19, 29, 1, 1);

    // Cowl & Sinister Demonic Curled Horns
    ctx.fillStyle = '#10061f';
    ctx.fillRect(11, 6, 16, 11);
    ctx.fillStyle = '#3b0764';
    ctx.fillRect(12, 7, 14, 9);
    ctx.fillStyle = '#6b21a8'; // cowl brow
    ctx.fillRect(13, 7, 12, 2);

    // Curled Demonic Horns (Sprouting from temples, curling up and back)
    // Left Horn
    ctx.fillStyle = '#1c1917'; // horn base
    ctx.fillRect(8, 6, 4, 3);
    ctx.fillRect(6, 4, 3, 4);
    ctx.fillRect(5, 1, 3, 4);
    ctx.fillStyle = '#44403c'; // horn ridge
    ctx.fillRect(7, 3, 2, 3);
    ctx.fillStyle = '#a8a29e'; // ivory tip
    ctx.fillRect(6, 1, 2, 2);

    // Right Horn
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(26, 6, 4, 3);
    ctx.fillRect(29, 4, 3, 4);
    ctx.fillRect(30, 1, 3, 4);
    ctx.fillStyle = '#44403c';
    ctx.fillRect(29, 3, 2, 3);
    ctx.fillStyle = '#a8a29e';
    ctx.fillRect(30, 1, 2, 2);

    // Deep void shadowed face
    ctx.fillStyle = '#030008';
    ctx.fillRect(12, 9, 14, 7);

    // Eerie Hellfire / Fel Purple Glowing Eyes
    ctx.fillStyle = '#7e22ce';
    ctx.fillRect(14, 11, 3, 2);
    ctx.fillRect(21, 11, 3, 2);
    ctx.fillStyle = '#c084fc'; // bright magenta-violet
    ctx.fillRect(15, 11, 2, 1);
    ctx.fillRect(22, 11, 2, 1);
    ctx.fillStyle = '#ffffff'; // white burning pupil
    ctx.fillRect(16, 11, 1, 1);
    ctx.fillRect(23, 11, 1, 1);

    // Menacing Bone Scythe (Left hand, x=1-11, y=3-42)
    // Vertebrae spine shaft
    ctx.fillStyle = '#334155';
    ctx.fillRect(6, 9, 3, 33);
    ctx.fillStyle = '#94a3b8'; // bone vertebrae segments
    ctx.fillRect(6, 12, 3, 2);
    ctx.fillRect(6, 18, 3, 2);
    ctx.fillRect(6, 24, 3, 2);
    ctx.fillRect(6, 30, 3, 2);
    ctx.fillRect(6, 36, 3, 2);
    // Bleached Dragon Bone Scythe Curved Blade
    ctx.fillStyle = '#020617';
    ctx.fillRect(1, 3, 9, 9);
    ctx.fillStyle = '#f8fafc'; // bone blade
    ctx.fillRect(2, 4, 7, 7);
    ctx.fillStyle = '#9333ea'; // glowing necrotic blade edge
    ctx.fillRect(1, 4, 2, 6);
    ctx.fillRect(3, 3, 6, 2);
    ctx.fillStyle = '#c084fc'; // razor sheen
    ctx.fillRect(2, 5, 1, 4);

    // Floating Corrupted Skull Orb (Hovering on right side, x=27-37, y=14-26)
    // Spectral fel flame aura
    ctx.fillStyle = '#581c87';
    ctx.beginPath();
    ctx.arc(32, 20, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(32, 20, 3.5, 0, Math.PI * 2);
    ctx.fill();
    // Floating tiny skull
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(30, 18, 4, 4);
    // Green demonic eye sockets
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(31, 19, 1, 1);
    ctx.fillRect(33, 19, 1, 1);
    // Wafting necrotic particles
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(32, 15, 1, 1);
    ctx.fillRect(34, 16, 1, 1);
  });

  // --- 1.7 Skeleton Minion (24x30) ---
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

  // =========================================================================
  // 2. DETAILED 64x64 CHARACTER PORTRAITS WITH ORNAMENTAL FRAMES
  // =========================================================================

  // Helper to draw the ornamental frame for 64x64 portraits
  const drawOrnamentalFrame = (
    ctx: CanvasRenderingContext2D,
    frameMetal: string,
    frameHighlight: string,
    cornerGem: string,
    bgGradTop: string,
    bgGradBottom: string
  ) => {
    // Outer border (64x64)
    ctx.fillStyle = '#090712';
    ctx.fillRect(0, 0, 64, 64);

    // Beveled ornamental frame
    ctx.fillStyle = frameMetal;
    ctx.fillRect(1, 1, 62, 62);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(3, 3, 58, 58);

    // Background gradient inside portrait
    const grad = ctx.createLinearGradient(0, 4, 0, 60);
    grad.addColorStop(0, bgGradTop);
    grad.addColorStop(1, bgGradBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(4, 4, 56, 56);

    // Inner gold bevel rim
    ctx.fillStyle = frameHighlight;
    ctx.fillRect(3, 3, 58, 1);
    ctx.fillRect(3, 3, 1, 58);
    ctx.fillStyle = '#090712';
    ctx.fillRect(4, 60, 57, 1);
    ctx.fillRect(60, 4, 1, 57);

    // 4 Ornamental Corner Rivets/Gems
    const corners = [
      [2, 2],
      [59, 2],
      [2, 59],
      [59, 59]
    ];
    corners.forEach(([cx, cy]) => {
      ctx.fillStyle = '#d97706';
      ctx.fillRect(cx - 1, cy - 1, 5, 5);
      ctx.fillStyle = cornerGem;
      ctx.fillRect(cx, cy, 3, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cx, cy, 1, 1);
    });
  };

  // --- 2.1 Portrait: Knight (64x64) - Crusader Helm, Glowing Red Eyes, Plume, Spiked Gorget ---
  createTextureFromCanvas(scene, 'portrait_knight', 64, 64, (ctx) => {
    drawOrnamentalFrame(ctx, '#451a03', '#d97706', '#dc2626', '#3b0d14', '#120508');

    // Crimson Cloak Mantle around shoulders
    ctx.fillStyle = '#4c0519';
    ctx.fillRect(10, 46, 44, 15);
    ctx.fillStyle = '#9f1239';
    ctx.fillRect(12, 48, 40, 13);
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(14, 50, 4, 11);
    ctx.fillRect(46, 50, 4, 11);

    // Spiked Steel Gorget & Pauldrons
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(16, 42, 32, 10);
    ctx.fillStyle = '#334155';
    ctx.fillRect(17, 43, 30, 8);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(20, 44, 24, 2);
    // Gold Gorget trim
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(26, 46, 12, 2);

    // Crusader Great Helm (Bust close-up)
    ctx.fillStyle = '#0f172a'; // outline
    ctx.fillRect(18, 16, 28, 28);
    ctx.fillStyle = '#334155'; // plate steel
    ctx.fillRect(19, 17, 26, 26);
    ctx.fillStyle = '#64748b'; // mid plate
    ctx.fillRect(21, 18, 22, 24);
    ctx.fillStyle = '#cbd5e1'; // specular highlight on curved forehead
    ctx.fillRect(23, 18, 18, 4);

    // Golden Cross Motif on forehead
    ctx.fillStyle = '#b45309';
    ctx.fillRect(30, 18, 4, 10);
    ctx.fillRect(26, 21, 12, 4);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(31, 19, 2, 8);
    ctx.fillRect(27, 22, 10, 2);

    // Visor Slit
    ctx.fillStyle = '#020617';
    ctx.fillRect(20, 28, 24, 6);
    // Breathing holes on visor cheeks
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(23, 36, 2, 2);
    ctx.fillRect(27, 36, 2, 2);
    ctx.fillRect(35, 36, 2, 2);
    ctx.fillRect(39, 36, 2, 2);

    // Intense Glowing Crimson Eyes
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(24, 30, 5, 2);
    ctx.fillRect(35, 30, 5, 2);
    ctx.fillStyle = '#f87171';
    ctx.fillRect(25, 30, 3, 2);
    ctx.fillRect(36, 30, 3, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(26, 30, 1, 1);
    ctx.fillRect(37, 30, 1, 1);

    // Majestic Red Plume atop Helmet
    ctx.fillStyle = '#881337';
    ctx.fillRect(28, 6, 8, 11);
    ctx.fillRect(34, 8, 8, 8);
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(29, 7, 6, 9);
    ctx.fillRect(35, 9, 6, 6);
    ctx.fillStyle = '#fda4af';
    ctx.fillRect(30, 7, 3, 4);
  });

  // --- 2.2 Portrait: Mage (64x64) - Deep Velvet Cowl, Glowing Amethyst Eyes, Forehead Glyph ---
  createTextureFromCanvas(scene, 'portrait_mage', 64, 64, (ctx) => {
    drawOrnamentalFrame(ctx, '#3b0764', '#a855f7', '#c084fc', '#2e1065', '#090314');

    // Deep Velvet Robe Shoulder Drape
    ctx.fillStyle = '#170529';
    ctx.fillRect(10, 48, 44, 13);
    ctx.fillStyle = '#3b0764';
    ctx.fillRect(12, 49, 40, 11);
    ctx.fillStyle = '#7e22ce';
    ctx.fillRect(14, 51, 6, 9);
    ctx.fillRect(44, 51, 6, 9);
    // Gold embroidery collar
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(22, 50, 20, 2);
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(31, 52, 2, 4);

    // Wizard Cowl Hood
    ctx.fillStyle = '#170529'; // cowl shadow
    ctx.fillRect(16, 12, 32, 36);
    ctx.fillStyle = '#2e1065';
    ctx.fillRect(18, 14, 28, 33);
    ctx.fillStyle = '#581c87';
    ctx.fillRect(20, 15, 24, 8);
    ctx.fillStyle = '#a855f7'; // top cowl highlight
    ctx.fillRect(22, 15, 20, 2);

    // Gold Runic Trim along Cowl Rim
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(18, 15, 2, 28);
    ctx.fillRect(44, 15, 2, 28);
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(18, 22, 2, 3);
    ctx.fillRect(18, 30, 2, 3);
    ctx.fillRect(44, 22, 2, 3);
    ctx.fillRect(44, 30, 2, 3);

    // Deep Void Pitch-Black Shadow beneath Hood
    ctx.fillStyle = '#030008';
    ctx.fillRect(20, 20, 24, 26);

    // Glowing Arcane Forehead Rune
    ctx.fillStyle = '#7e22ce';
    ctx.fillRect(30, 22, 4, 4);
    ctx.fillStyle = '#e879f9';
    ctx.fillRect(31, 23, 2, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(31, 23, 1, 1);

    // Twin Burning Mystic Amethyst Eyes
    ctx.fillStyle = '#9333ea';
    ctx.fillRect(22, 29, 6, 4);
    ctx.fillRect(36, 29, 6, 4);
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(23, 30, 4, 2);
    ctx.fillRect(37, 30, 4, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(24, 30, 2, 2);
    ctx.fillRect(38, 30, 2, 2);

    // Ambient floating arcane motes
    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(12, 24, 2, 2);
    ctx.fillRect(50, 22, 2, 2);
    ctx.fillRect(48, 42, 1, 1);
  });

  // --- 2.3 Portrait: Rogue (64x64) - Midnight Assassin Cowl, Stealth Mask, Toxic Green Eyes ---
  createTextureFromCanvas(scene, 'portrait_rogue', 64, 64, (ctx) => {
    drawOrnamentalFrame(ctx, '#042f2e', '#14b8a6', '#10b981', '#0f2924', '#061310');

    // Midnight Leather Shoulder Mantle & Straps
    ctx.fillStyle = '#020617';
    ctx.fillRect(10, 48, 44, 13);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(12, 49, 40, 11);
    ctx.fillStyle = '#334155'; // leather highlight
    ctx.fillRect(14, 51, 6, 9);
    ctx.fillRect(44, 51, 6, 9);
    // Silver Buckle & Throwing Knife Hilt
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(20, 50, 4, 4);
    ctx.fillRect(40, 48, 3, 7);

    // Assassin Shadow Cowl
    ctx.fillStyle = '#042f2e';
    ctx.fillRect(17, 13, 30, 35);
    ctx.fillStyle = '#0f766e';
    ctx.fillRect(19, 15, 26, 31);
    ctx.fillStyle = '#14b8a6'; // cowl highlight
    ctx.fillRect(21, 15, 22, 3);

    // Dark Ninja/Assassin Half-Face Mask
    ctx.fillStyle = '#020617';
    ctx.fillRect(20, 31, 24, 14);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(22, 33, 20, 10);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(24, 35, 16, 2);

    // Deep Face Shadow across upper half
    ctx.fillStyle = '#061a16';
    ctx.fillRect(20, 22, 24, 10);
    ctx.fillStyle = '#fed7aa'; // bridge of nose & brow
    ctx.fillRect(28, 25, 8, 4);

    // Piercing Toxic Emerald Glowing Eyes
    ctx.fillStyle = '#047857';
    ctx.fillRect(22, 26, 6, 3);
    ctx.fillRect(36, 26, 6, 3);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(23, 27, 4, 2);
    ctx.fillRect(37, 27, 4, 2);
    ctx.fillStyle = '#ecfdf5';
    ctx.fillRect(24, 27, 2, 1);
    ctx.fillRect(38, 27, 2, 1);

    // Subtle venom eye trails wafting into shadows
    ctx.fillStyle = '#34d399';
    ctx.fillRect(20, 26, 2, 1);
    ctx.fillRect(42, 26, 2, 1);
  });

  // --- 2.4 Portrait: Paladin (64x64) - Winged Gold Helm, Radiant Eyes, Sunburst Gorget ---
  createTextureFromCanvas(scene, 'portrait_paladin', 64, 64, (ctx) => {
    drawOrnamentalFrame(ctx, '#78350f', '#facc15', '#38bdf8', '#1e3a5f', '#091528');

    // Royal Azure Cape Draped over shoulders
    ctx.fillStyle = '#172554';
    ctx.fillRect(10, 48, 44, 13);
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(12, 49, 40, 11);
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(14, 51, 6, 9);
    ctx.fillRect(44, 51, 6, 9);

    // White Enamel & Gold Gorget with Holy Sun Emblem
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(16, 42, 32, 11);
    ctx.fillStyle = '#f8fafc'; // white enamel plate
    ctx.fillRect(18, 43, 28, 9);
    ctx.fillStyle = '#b45309'; // gold rim
    ctx.fillRect(18, 43, 28, 2);
    // Embossed Holy Sun on Gorget
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(32, 48, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(31, 47, 2, 2);

    // Golden Winged Paladin Helmet
    ctx.fillStyle = '#0f172a'; // outline
    ctx.fillRect(18, 15, 28, 29);
    ctx.fillStyle = '#f8fafc'; // pure white metal
    ctx.fillRect(19, 16, 26, 27);
    ctx.fillStyle = '#ffffff'; // gleaming light
    ctx.fillRect(21, 17, 22, 6);

    // Gold Crown & Filigree across helmet
    ctx.fillStyle = '#b45309';
    ctx.fillRect(19, 15, 26, 3);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(20, 16, 24, 2);
    ctx.fillRect(31, 13, 2, 4); // crown spire

    // Majestic Golden Wings on temples
    // Left Wing
    ctx.fillStyle = '#d97706';
    ctx.fillRect(11, 12, 7, 10);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(12, 13, 6, 8);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(11, 11, 4, 4);
    // Right Wing
    ctx.fillStyle = '#d97706';
    ctx.fillRect(46, 12, 7, 10);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(46, 13, 6, 8);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(49, 11, 4, 4);

    // T-Visor Slit
    ctx.fillStyle = '#020617';
    ctx.fillRect(20, 27, 24, 5);
    ctx.fillRect(30, 27, 4, 11);

    // Radiant Divine Glowing Celestial Eyes
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(22, 28, 6, 3);
    ctx.fillRect(36, 28, 6, 3);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(23, 29, 4, 2);
    ctx.fillRect(37, 29, 4, 2);
    ctx.fillStyle = '#fef08a'; // holy golden sparkle
    ctx.fillRect(24, 29, 2, 1);
    ctx.fillRect(38, 29, 2, 1);

    // Holy halo light rays behind head
    ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
    ctx.fillRect(14, 8, 36, 2);
    ctx.fillRect(22, 6, 20, 2);
  });

  // --- 2.5 Portrait: Ranger (64x64) - Elven Fur Mantle, Pointed Ear, Frost Hawk Eyes ---
  createTextureFromCanvas(scene, 'portrait_ranger', 64, 64, (ctx) => {
    drawOrnamentalFrame(ctx, '#14532d', '#22c55e', '#38bdf8', '#062d22', '#021510');

    // Wolf / Fox Fur Mantle around collar
    ctx.fillStyle = '#451a03';
    ctx.fillRect(10, 48, 44, 13);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(12, 49, 40, 11);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(14, 50, 6, 9);
    ctx.fillRect(44, 50, 6, 9);
    ctx.fillStyle = '#fde68a'; // fur tufts
    ctx.fillRect(22, 51, 4, 3);
    ctx.fillRect(38, 51, 4, 3);

    // Emerald Elven Hood
    ctx.fillStyle = '#022c22';
    ctx.fillRect(17, 13, 30, 36);
    ctx.fillStyle = '#065f46';
    ctx.fillRect(19, 15, 26, 32);
    ctx.fillStyle = '#10b981'; // hood highlight
    ctx.fillRect(21, 15, 22, 3);

    // Pointed Elven Ears
    ctx.fillStyle = '#ea580c'; // ear shadow
    ctx.fillRect(13, 26, 6, 6);
    ctx.fillRect(11, 23, 4, 4);
    ctx.fillStyle = '#fed7aa'; // ear skin
    ctx.fillRect(14, 27, 4, 4);
    ctx.fillRect(12, 24, 3, 3);

    // Elven Face (Noble, focused ranger expression)
    ctx.fillStyle = '#022c22'; // shadow brow
    ctx.fillRect(20, 20, 24, 7);
    ctx.fillStyle = '#fed7aa'; // skin tone
    ctx.fillRect(21, 25, 22, 17);
    ctx.fillStyle = '#fdba74'; // cheekbone shading
    ctx.fillRect(21, 34, 4, 6);
    ctx.fillRect(39, 34, 4, 6);
    // Mouth & nose line
    ctx.fillStyle = '#c2410c';
    ctx.fillRect(31, 33, 2, 4);
    ctx.fillRect(29, 39, 6, 1);

    // Piercing Frost Cyan Hawk Eyes
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(23, 27, 6, 3);
    ctx.fillRect(35, 27, 6, 3);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(24, 28, 4, 2);
    ctx.fillRect(36, 28, 4, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(25, 28, 2, 1);
    ctx.fillRect(37, 28, 2, 1);

    // Crimson Feather Pin on Hood
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(38, 9, 6, 8);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(39, 10, 4, 6);
    ctx.fillStyle = '#fca5a5';
    ctx.fillRect(40, 11, 2, 3);
  });

  // --- 2.6 Portrait: Warlock (64x64) - Curled Demonic Horns, Tattered Cowl, Fel Purple Eyes ---
  createTextureFromCanvas(scene, 'portrait_warlock', 64, 64, (ctx) => {
    drawOrnamentalFrame(ctx, '#4c1d95', '#a855f7', '#22c55e', '#240838', '#0c0214');

    // Tattered Abyssal Robe Collar
    ctx.fillStyle = '#10061f';
    ctx.fillRect(10, 48, 44, 13);
    ctx.fillStyle = '#2e1065';
    ctx.fillRect(12, 49, 40, 11);
    ctx.fillStyle = '#6d28d9';
    ctx.fillRect(14, 51, 6, 9);
    ctx.fillRect(44, 51, 6, 9);
    // Bone skull medallion at neck
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(29, 50, 6, 6);
    ctx.fillStyle = '#020617';
    ctx.fillRect(30, 52, 1, 1);
    ctx.fillRect(33, 52, 1, 1);

    // Sinister Curled Demonic Horns (Sweeping from head)
    // Left Horn
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(12, 14, 7, 5);
    ctx.fillRect(8, 9, 6, 7);
    ctx.fillRect(6, 4, 5, 7);
    ctx.fillRect(7, 2, 3, 3);
    ctx.fillStyle = '#44403c';
    ctx.fillRect(10, 7, 3, 7);
    ctx.fillStyle = '#a8a29e';
    ctx.fillRect(7, 3, 2, 3);

    // Right Horn
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(45, 14, 7, 5);
    ctx.fillRect(50, 9, 6, 7);
    ctx.fillRect(53, 4, 5, 7);
    ctx.fillRect(54, 2, 3, 3);
    ctx.fillStyle = '#44403c';
    ctx.fillRect(51, 7, 3, 7);
    ctx.fillStyle = '#a8a29e';
    ctx.fillRect(55, 3, 2, 3);

    // Abyssal Tattered Cowl Hood
    ctx.fillStyle = '#10061f';
    ctx.fillRect(17, 13, 30, 36);
    ctx.fillStyle = '#2e1065';
    ctx.fillRect(19, 15, 26, 32);
    ctx.fillStyle = '#581c87';
    ctx.fillRect(21, 15, 22, 3);

    // Void Shadow over upper face
    ctx.fillStyle = '#030008';
    ctx.fillRect(20, 20, 24, 25);

    // Pale Gaunt Face beneath hood
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(23, 28, 18, 14);
    ctx.fillStyle = '#94a3b8'; // hollow cheekbones
    ctx.fillRect(23, 34, 3, 6);
    ctx.fillRect(38, 34, 3, 6);
    // Dark void runes on cheeks
    ctx.fillStyle = '#9333ea';
    ctx.fillRect(25, 36, 2, 4);
    ctx.fillRect(37, 36, 2, 4);

    // Burning Fel / Abyssal Purple Eyes
    ctx.fillStyle = '#581c87';
    ctx.fillRect(23, 27, 6, 4);
    ctx.fillRect(35, 27, 6, 4);
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(24, 28, 4, 2);
    ctx.fillRect(36, 28, 4, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(25, 28, 2, 1);
    ctx.fillRect(37, 28, 2, 1);

    // Floating miniature corrupted skull at bottom right
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(52, 44, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(50, 42, 4, 4);
    ctx.fillStyle = '#22c55e'; // green eye
    ctx.fillRect(51, 43, 1, 1);
    ctx.fillRect(53, 43, 1, 1);
  });
}
