# Shareable Game Stats Design

## Goal

Kuromi Care stats should survive page reloads and be shareable without adding a backend service or credentials.

## Recommended Approach

Use browser `localStorage` as the persistent source for the current device, and use a compact URL query value as a shareable snapshot. When a shared URL is opened, the game imports the snapshot, stores it locally, and continues autosaving future changes.

## Architecture

- `src/lib/game.ts` owns serialization, parsing, validation, and storage helpers for game stats.
- `src/components/KuromiCareGame.tsx` loads the initial state from the shared URL or local storage, autosaves every state update, and exposes Copy Share Link and Reset buttons.
- `src/styles.css` styles the new compact controls without changing the room layout.
- `README.md` introduces the project and embeds screenshots for each main route/theme.

## Data Flow

1. On first render, read `?gameStats=<base64url-json>` from `window.location.search`.
2. If valid, clamp and apply those stats, derive mood, save to `localStorage`, and remove the query value from browser history.
3. If no valid share value exists, load the saved local value.
4. If neither exists, use `initialGameState`.
5. Whenever stats change, save a normalized snapshot to `localStorage`.
6. Copy Share Link builds a URL for the current page and current stats.

## Error Handling

Invalid query snapshots or corrupted local storage values are ignored and removed where possible. The game falls back to initial stats.

## Testing

Unit tests cover stat clamping, storage parsing, share encoding round trips, query import priority, and invalid payload fallback. Existing game tests continue to cover care actions and mood selection.
