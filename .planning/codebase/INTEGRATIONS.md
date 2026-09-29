# External Integrations

**Analysis Date:** 2026-09-29

## APIs & External Services

**Third-Party Web Services:**
- None detected. The entire game is completely self-contained and offline-capable. All assets (textures, sprites, audio synthesis) are generated programmatically at runtime in memory.

## Data Storage

**Databases:**
- None required. Client-side browser storage only.

**Local Storage:**
- Browser `window.localStorage`
  - Implementation: `src/systems/SaveSystem.ts`
  - Key: `ABYSS_DESCENT_SAVE_V1`
  - Data stored: `totalSouls`, `highestFloor`, `totalRuns`, `victories`, `upgrades`

**File Storage:**
- Local filesystem for source code and compiled static assets (`dist/`). No cloud bucket needed.

**Caching:**
- Browser memory cache for generated Phaser textures in `this.textures` (`src/scenes/BootScene.ts`).

## Authentication & Identity

**Auth Provider:**
- None. Anonymous single-player progression stored in browser `localStorage`.

## Monitoring & Observability

**Error Tracking:**
- Native browser DevTools console.

**Logs:**
- Browser console logging for scene transitions and debug information.

## CI/CD & Deployment

**Hosting:**
- Static web hosting target (e.g. GitHub Pages, Vercel, Netlify, itch.io HTML5 zip).

**CI Pipeline:**
- Headless TypeScript validation (`npx tsc --noEmit`) and Vite build (`npm run build`).

## Environment Configuration

**Required env vars:**
- None required for runtime.

**Secrets location:**
- No secrets or credentials needed for client-side gameplay.

## Webhooks & Callbacks

**Incoming:**
- None.

**Outgoing:**
- None.

---

*Integration audit: 2026-09-29*
