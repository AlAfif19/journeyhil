# Shareable Game Stats Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist Kuromi Care stats locally, support shareable stat snapshot links, add README screenshots, and publish the main branch.

**Architecture:** Keep persistence and URL serialization in `src/lib/game.ts` so React stays thin. `KuromiCareGame` reads one initial snapshot, autosaves future stats, and exposes small controls for sharing and reset. README assets live under `docs/screenshots/`.

**Tech Stack:** React 18, TypeScript, Vite, Vitest, browser localStorage, URLSearchParams, Playwright or Chromium screenshot tooling.

## Global Constraints

- Use no new backend or runtime credential.
- Shared links carry a stats snapshot and then become local state on the receiving browser.
- Invalid saved/shared stats must not crash the page.
- Keep UI controls compact and consistent with existing game styling.

---

### Task 1: Game Stats Persistence Helpers

**Files:**
- Modify: `src/lib/game.ts`
- Test: `src/lib/game.test.ts`

**Interfaces:**
- Produces: `GAME_STATS_QUERY_PARAM`, `GAME_STATS_STORAGE_KEY`, `normalizeGameStats`, `encodeSharedGameStats`, `decodeSharedGameStats`, `readStoredGameStats`, `writeStoredGameStats`, `clearStoredGameStats`, `stateFromStats`

- [ ] Write tests for share encoding round trip, invalid payload fallback, local storage read/write/clear, and clamping imported values.
- [ ] Run `npm test -- src/lib/game.test.ts` and verify the new tests fail because helpers do not exist.
- [ ] Implement the helper functions in `src/lib/game.ts`.
- [ ] Run `npm test -- src/lib/game.test.ts` and verify the file passes.

### Task 2: Game UI Persistence and Share Controls

**Files:**
- Modify: `src/components/KuromiCareGame.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: persistence helpers from Task 1.
- Produces: load from `?gameStats=`, autosave to `localStorage`, copy share link button, reset stats button.

- [ ] Initialize game state with shared URL stats first, then local storage, then defaults.
- [ ] Save stats whenever they change.
- [ ] Add Copy Share Link and Reset buttons beside the mood badge.
- [ ] Remove `gameStats` from browser history after a valid import.
- [ ] Style `.game-heading-actions` and `.game-utility-button`.

### Task 3: README Screenshots and Publishing

**Files:**
- Create: `docs/screenshots/*.png`
- Create/Modify: `README.md`

**Interfaces:**
- Consumes: built or dev-served app routes.
- Produces: GitHub-ready README with screenshots for the chooser and each theme route.

- [ ] Build the app.
- [ ] Serve the app locally.
- [ ] Capture screenshots for the chooser and theme pages.
- [ ] Write README with preview images, routes, feature notes, and local commands.
- [ ] Run full `npm test` and `npm run build`.
- [ ] Commit all intended changes and push `main` to `origin`.
