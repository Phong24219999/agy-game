<!-- refreshed: 2026-09-29 -->
# Architecture

**Analysis Date:** 2026-09-29

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                       Entry & Boot                          │
├──────────────────────────────┬──────────────────────────────┤
│  index.html                  │  src/main.ts                 │
│  (Canvas Viewport)           │  (Phaser Game Config)        │
└──────────────┬───────────────┴──────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Scene Management                        │
├──────────────────┬──────────────────┬───────────────────────┤
│  BootScene       │  MainMenuScene   │  MapScene             │
│  `src/scenes/`   │  `src/scenes/`   │  `src/scenes/`        │
├──────────────────┼──────────────────┼───────────────────────┤
│  BattleScene     │  RewardScene     │  ShopScene            │
│  `src/scenes/`   │  `src/scenes/`   │  `src/scenes/`        │
├──────────────────┴──────────────────┴───────────────────────┤
│  CampfireScene   │  GameOverScene                           │
│  `src/scenes/`   │  `src/scenes/`                           │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌──────────────────────────────┬──────────────────────────────┐
│        Entity Layer          │        System Layer          │
├──────────────────────────────┼──────────────────────────────┤
│  Hero (`src/entities/`)      │  AudioSystem (`src/systems/`)│
│  Monster (`src/entities/`)   │  DungeonGen (`src/systems/`) │
│  Minion (`src/entities/`)    │  SaveSystem (`src/systems/`) │
│                              │  SynergySys (`src/systems/`) │
│                              │  DamageText (`src/systems/`) │
│                              │  Particles (`src/systems/`)  │
└──────────────────────────────┴──────────────────────────────┘
```

## Architectural Patterns

**Scene-Driven State Machine:**
- Game states are cleanly segmented into Phaser `Scene` subclasses extending `Phaser.Scene`.
- Flow: `BootScene` (generates procedural graphics) → `MainMenuScene` (class selection & sanctuary meta upgrades) → `MapScene` (branching node progression) → `BattleScene` / `ShopScene` / `CampfireScene` → `RewardScene` (draft modal) → `GameOverScene` (summary & soul rewards).

**Entity-Component / Container Composition:**
- `Hero`, `Monster`, and `Minion` inherit from `Phaser.GameObjects.Container`.
- Entities encapsulate their own sprites, HP bars, status timers, and update logic (`updateHero`, `updateMonster`, `updateMinion`).

**Singleton Systems:**
- Audio and Save management utilize Singleton patterns (`AudioSystem.getInstance()`, `SaveSystem.getInstance()`) for consistent state and audio context compliance.

**Procedural Asset Generation:**
- Zero external image/sound files. `BootScene.ts` uses Canvas 2D context drawing to generate pixel art textures directly into Phaser's Texture Manager cache.
- `AudioSystem.ts` uses Web Audio API oscillators, noise buffers, and biquad filters to synthesize SFX in real time.

## Data Flow

1. **Initialization:**
   `src/main.ts` configures game viewport (960x600 FIT), attaches initial click listeners for Web Audio autoplay unlocking, and boots `BootScene`.
2. **Meta Progression:**
   `MainMenuScene` loads persistent upgrades via `SaveSystem.applyMetaStats(baseStats)` and constructs the `Hero` instance.
3. **Map Generation:**
   `MapScene` invokes `DungeonGenerator.generateFloor(floor)` to build a branching 6-row tree of nodes (`battle`, `elite`, `chest`, `shop`, `campfire`, `boss`).
4. **Auto-Combat Arena:**
   `BattleScene` receives `{ hero, node, dungeonNodes }`. It drives the automated loop:
   - Evaluates distances and applies movement/kiting.
   - Triggers basic attacks and class skills based on cooldowns.
   - Computes mitigation, crits, lifesteal, and synergies.
   - Emits floating numbers via `DamageTextManager` and sparks/explosions via `ParticleSystem`.
   - On victory, pauses and launches `RewardScene` for a 1-of-3 perk card draft before returning to `MapScene`.

## Constraints & Invariants

- **Auto-Battler Independence:** No manual movement or aiming during combat; tactical control is exercised through game speed (`1x`, `2x`, `3x`), path selection, and card/gear drafting.
- **Node Immutability & Branch Commitment:** Once a node in a row is completed via `completeDungeonNode()`, alternative paths in that row are locked, and only downstream connected nodes become accessible.
- **Asset Integrity:** All assets must be generated before `BootScene` finishes to prevent missing texture errors.

---

*Architecture analysis: 2026-09-29*
