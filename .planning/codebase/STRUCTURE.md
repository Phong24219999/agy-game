# Codebase Structure

**Analysis Date:** 2026-09-29

## Directory Layout

```
agy-game/
├── .planning/                  # GSD planning and codebase maps
│   └── codebase/               # System documentation & architectural maps
├── dist/                       # Production bundle (HTML & compiled JS)
├── node_modules/               # NPM dependencies
├── src/                        # Core TypeScript source code
│   ├── entities/               # Game actor classes (Hero, Monster, Minion)
│   │   ├── Hero.ts             # Hero auto-combat AI, skills & class stats
│   │   ├── Minion.ts           # Summoned skeleton ally entity
│   │   └── Monster.ts          # Enemy AI, boss phase & status effects
│   ├── scenes/                 # Phaser 3 Game Scenes
│   │   ├── BattleScene.ts      # Auto-combat arena with 1x/2x/3x speed
│   │   ├── BootScene.ts        # Procedural canvas asset generator
│   │   ├── CampfireScene.ts    # Altar rest & weapon forge room
│   │   ├── GameOverScene.ts    # Victory/defeat summary & soul harvest
│   │   ├── MainMenuScene.ts    # Title screen, class select & sanctuary
│   │   ├── MapScene.ts         # Branching Slay-the-Spire node tree
│   │   ├── RewardScene.ts      # 1-of-3 Perk Card draft modal
│   │   └── ShopScene.ts        # Wandering merchant shop
│   ├── systems/                # Subsystems and managers
│   │   ├── AudioSystem.ts      # Web Audio API real-time synthesizer
│   │   ├── DamageTextManager.ts# Floating animated RPG combat text
│   │   ├── DungeonGenerator.ts # Procedural node tree generator
│   │   ├── ParticleSystem.ts   # Combat VFX, sparks, blood, lightning
│   │   ├── SaveSystem.ts       # LocalStorage meta-progression persistence
│   │   └── SynergySystem.ts    # Synergies, perk cards & shop database
│   ├── types/                  # Shared TypeScript interfaces & types
│   │   └── game.ts             # HeroStats, Item, Node, Perk definitions
│   └── main.ts                 # Application entry point & Phaser Game config
├── index.html                  # Main HTML5 viewport entry
├── package.json                # Project dependencies & scripts
├── tsconfig.json               # TypeScript compiler configuration
└── .npmrc                      # Local cache configuration
```

## Directory Purposes

**`src/entities/`:**
- Purpose: Contains interactive combat actors.
- Contains: `Hero.ts`, `Monster.ts`, `Minion.ts`.
- Key responsibilities: HP calculation, AI steering/kiting, weapon attacks, cooldown tracking, and taking damage.

**`src/scenes/`:**
- Purpose: Contains individual view screens and game phases.
- Contains: 8 specialized Phaser scenes implementing `init()`, `create()`, and `update()`.

**`src/systems/`:**
- Purpose: Reusable gameplay engines and data handlers.
- Contains: Procedural audio, damage numbers, visual effects, procedural generation, persistence, and synergy evaluation.

**`src/types/`:**
- Purpose: Central domain types and data models.
- Key file: `src/types/game.ts`.

## Key File Locations

**Entry Points:**
- `index.html`: Canvas mount container (`#game-container`).
- `src/main.ts`: Configures `Phaser.Game` and initializes Web Audio.

**Configuration:**
- `package.json`: Scripts (`dev`, `build`, `preview`) and pinned versions.
- `tsconfig.json`: TypeScript configuration.

**Core Logic:**
- `src/entities/Hero.ts`: Hero combat behaviors and class attributes.
- `src/scenes/BattleScene.ts`: Real-time auto-combat arena loop.
- `src/scenes/MapScene.ts`: Slay-the-Spire node navigation logic.
- `src/systems/SynergySystem.ts`: Elemental synergies, perks, and items.

## Naming Conventions

**Files:**
- Scenes & Classes: PascalCase (e.g. `BattleScene.ts`, `Hero.ts`, `AudioSystem.ts`).
- Types & Config: camelCase or kebab-case (e.g. `game.ts`).

**Identifiers:**
- Classes: PascalCase (e.g. `DamageTextManager`).
- Methods & Variables: camelCase (e.g. `updateHero`, `attackTimer`).
- Interfaces & Types: PascalCase (e.g. `HeroStats`, `DungeonNode`).

## Where to Add New Code

**New Hero Class or Monster Type:**
- Add stats and traits in `src/types/game.ts`.
- Add sprite drawing logic in `src/scenes/BootScene.ts`.
- Implement AI behavior / attack pattern in `src/entities/Hero.ts` or `src/entities/Monster.ts`.

**New Synergy or Perk Card:**
- Register in `src/systems/SynergySystem.ts` (`ALL_PERK_CARDS`, `SYNERGY_INFO`).
- Add visual icon in `src/scenes/BootScene.ts`.

**New Encounter Room / Node:**
- Add room type in `src/types/game.ts` (`NodeType`).
- Update generation rules in `src/systems/DungeonGenerator.ts`.
- Create corresponding Scene in `src/scenes/` and register in `src/main.ts`.

---

*Structure analysis: 2026-09-29*
