# Coding Conventions

**Analysis Date:** 2026-09-29

## Naming Patterns

**Files:**
- TypeScript scene files: PascalCase with `Scene` suffix (`BattleScene.ts`, `MainMenuScene.ts`)
- TypeScript entity files: PascalCase singular nouns (`Hero.ts`, `Monster.ts`, `Minion.ts`)
- TypeScript systems: PascalCase with `System` or `Manager` suffix (`AudioSystem.ts`, `ParticleSystem.ts`, `DamageTextManager.ts`)
- Domain types: lowercase (`game.ts`)

**Functions and Methods:**
- camelCase with verb prefixes (`createAllTextures`, `updateHero`, `takeDamage`, `addPerk`, `playSlash`)

**Variables and Properties:**
- camelCase (`attackTimer`, `skillCooldown`, `monsters`, `gameSpeed`)
- Constants: UPPER_SNAKE_CASE (`ALL_PERK_CARDS`, `SHOP_ITEMS`, `SAVE_KEY`, `META_UPGRADES`)

**Types and Interfaces:**
- PascalCase without `I` prefix (`HeroStats`, `PerkCard`, `EquipmentItem`, `DungeonNode`)
- Union types in lowercase strings (`HeroClass = 'knight' | 'mage' | 'rogue'`)

## Code Style

**Formatting:**
- 2-space indentation throughout all files
- Single quotes for strings
- Semicolons used consistently
- Trailing commas in multi-line object and array literals

**Strict Typing:**
- TypeScript strict mode enabled (`"strict": true` in `tsconfig.json`)
- Explicit return types on public methods
- Strong typing for event callbacks and scene init parameters

## Import Organization

**Order:**
1. External framework modules (`import Phaser from 'phaser';`)
2. Types and interfaces (`import { HeroStats, DungeonNode } from '../types/game';`)
3. Entities and systems (`import { Hero } from '../entities/Hero';`, `import { AudioSystem } from '../systems/AudioSystem';`)
4. Peer scenes / helpers (`import { completeDungeonNode } from './MapScene';`)

## Error Handling

**Defensive Programming:**
- Texture checks before rendering (`this.textures.exists('icon_gold')`)
- JSON parsing with `try/catch` fallbacks in `src/systems/SaveSystem.ts`
- Null-checks on optional scene parameters (`this.node?.floor || 1`)
- Array bounds validation when selecting random cards or items

## Audio & Visual Polish Patterns

**Game Feel (Juice):**
- Hits produce multi-layered feedback: floating damage number + hit spark particles + audio thud/crit + subtle camera shake.
- Motion uses easing: `Back.easeOut` for card pop-ins, `Quad.easeOut` for explosions, `Cubic.easeIn` for death fades.
- Real-time time dilation: `const effectiveDelta = delta * this.gameSpeed;` ensures physics, timers, and animations scale seamlessly across 1x, 2x, and 3x settings.

---

*Convention analysis: 2026-09-29*
