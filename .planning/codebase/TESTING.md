# Testing Patterns

**Analysis Date:** 2026-09-29

## Test Framework

**Static Analysis & Compiler Checks:**
- TypeScript Compiler (`tsc --noEmit`)
- Version: TypeScript 5.7.2
- Config: `tsconfig.json`

**Run Commands:**
```bash
npx tsc --noEmit       # Type check all source files without emitting JS
npm run build          # Full build validation (tsc && vite build)
npm run preview        # Run local production preview server
```

## Current Test Strategy

**Type Soundness:**
- Static type checking guarantees all method signatures, scene transitions, and event payloads match across scenes and entities.
- Zero-error policy on `npx tsc --noEmit`.

**Runtime Verification:**
- Production build validation with Vite checks module graph resolution, asset integrity, and bundle minification.
- HTTP server preview check via `curl -I http://localhost:5173` to verify HTML header delivery and JS bundle chunking.

## Test File Organization

**Location:**
- Currently, unit testing frameworks (e.g. Vitest, Jest) are not yet installed in `package.json`. Tests are conducted via static TypeScript validation and browser execution.

**Recommended Setup for Unit Testing:**
- When adding unit tests, install `vitest`:
  ```bash
  npm install -D vitest
  ```
- Co-locate test files alongside systems and entities:
  - `src/systems/SynergySystem.test.ts` (test synergy counts and drop pools)
  - `src/systems/DungeonGenerator.test.ts` (test floor connectivity and row generation)
  - `src/systems/SaveSystem.test.ts` (test localStorage read/write and upgrade costs)

## Common Test Scenarios to Automate

**1. Dungeon Generator Connectivity:**
- Assert that every node in rows 0..4 has at least one valid downstream connection in `connectedTo`.
- Assert that row 5 contains exactly 1 boss node reachable from row 4.

**2. Damage & Mitigation Math:**
- Test `Monster.takeDamage()` and `Hero.takeDamage()` with various defense percentages, shields, crits, and thorns reflections.

**3. Synergy Calculation:**
- Test `SynergyManager.getSynergyCount()` with various permutations of cards and equipment.

---

*Testing analysis: 2026-09-29*
