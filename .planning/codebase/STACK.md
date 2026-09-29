# Technology Stack

**Analysis Date:** 2026-09-29

## Languages

**Primary:**
- TypeScript 5.7.2 - All application logic, scene lifecycle, entities, systems, and data types (`src/**/*.ts`)

**Secondary:**
- HTML5 / CSS3 - Canvas container styling and web viewport configuration (`index.html`)

## Runtime

**Environment:**
- Modern Web Browsers (Chrome, Firefox, Safari, Edge) supporting WebGL 2.0 / Canvas fallback and Web Audio API
- Node.js v22.11.0 (local dev environment)

**Package Manager:**
- npm 10.9.0
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Phaser 3.90.0 - 2D Web Game Framework managing scene flow, WebGL/Canvas rendering, Arcade Physics, Cameras, Tweens, and game loop (`package.json`)

**Testing:**
- Headless TypeScript compile checking via `tsc --noEmit` (`tsconfig.json`)

**Build/Dev:**
- Vite 6.0.7 - Next generation frontend tooling with rapid HMR, ES module bundling, and optimized production rollout (`package.json`)

## Key Dependencies

**Critical:**
- `phaser` (^3.90.0) - Core game engine driving rendering, scene management, display containers, and game loop
- `typescript` (^5.7.2) - Strict static typing across all game systems and scenes
- `vite` (^6.0.7) - Fast development server and production bundler

**Infrastructure:**
- Procedural Web Audio API - Built-in browser audio engine synthesized directly in `src/systems/AudioSystem.ts` without external media file dependencies

## Configuration

**Environment:**
- Client-side static single-page application (SPA); no server-side secrets or API keys required
- Browser `localStorage` used for game persistence in `src/systems/SaveSystem.ts`

**Build:**
- `tsconfig.json` - Target ESNext, moduleResolution Node, strict mode enabled
- `package.json` - Scripts for `dev`, `build`, and `preview`
- `.npmrc` - Local cache redirection (`cache=/tmp/.npm-cache`)

## Platform Requirements

**Development:**
- Node.js >= 18.0.0
- npm >= 9.0.0

**Production:**
- Any static web host or CDN (GitHub Pages, Vercel, Netlify, Cloudflare Pages, Nginx, Apache) serving `dist/`

---

*Stack analysis: 2026-09-29*
