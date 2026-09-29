# Codebase Concerns

**Analysis Date:** 2026-09-29

## Tech Debt

**Single-Chunk Bundle Size:**
- Issue: Phaser 3.90.0 is packaged into a single JavaScript chunk (`dist/assets/index-*.js`, ~1.58 MB uncompressed).
- Files: `package.json`, `index.html`
- Impact: Produces a Vite warning during build (`Some chunks are larger than 500 kB after minification`).
- Fix approach: Configure `rollupOptions.output.manualChunks` in `vite.config.ts` to split Phaser into a separate vendor chunk for better browser caching.

## Known Bugs & Edge Cases

**Browser Audio Autoplay Policy:**
- Symptoms: Audio may remain silent if the user doesn't click or press a key on the webpage before the game begins.
- Files: `src/main.ts`, `src/systems/AudioSystem.ts`
- Current mitigation: A window event listener (`pointerdown`, `keydown`) is attached in `src/main.ts` to resume `AudioContext` on first interaction.
- Recommendation: Add a prominent "Bấm để Bắt Đầu" (Click to Start) overlay in `MainMenuScene` if `AudioContext` is suspended.

## Performance Bottlenecks

**Entity & Particle Lifecycles:**
- Potential bottleneck: Rapidly spawning text objects and particle circles during high-speed combat (`3x` game speed with large swarms).
- Files: `src/systems/DamageTextManager.ts`, `src/systems/ParticleSystem.ts`
- Cause: Allocating new Phaser GameObjects on each hit.
- Improvement path: Introduce an object pool for damage text and particles if scaling to hundreds of enemies.

## Fragile Areas

**Dungeon Node State Synchronization:**
- Files: `src/scenes/MapScene.ts`, `src/scenes/BattleScene.ts`, `src/scenes/RewardScene.ts`
- Why fragile: Nodes and hero state are passed across scenes via Phaser's scene data payload.
- Safe modification: Ensure any new scene receiving `dungeonNodes` calls `completeDungeonNode()` before returning to `MapScene`.

## Missing Critical Features

**Audio Mute / Volume Control UI:**
- Problem: `AudioSystem.ts` supports volume control and `toggleMute()`, but there is no visible speaker icon button on the HUD yet.
- Improvement path: Add a toggleable speaker icon in the top-right corner of `MainMenuScene` and `BattleScene`.

---

*Concerns audit: 2026-09-29*
