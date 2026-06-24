# Magical Focus And Kuromi Game Upgrade Design

## Goal

Focus polish on `/theme/magical` while leaving Pixel and Scrapbook routes available but unchanged in direction. Magical becomes the main candidate for final deployment after visual and game upgrades.

## Visual Direction

Magical should feel like a dreamy Kuromi night stage. 3D overlay assets sit at the far edges of the viewport and sections: upper corners, side rails, and lower decorative zones. They must render above the background and page atmosphere, but they must not cover primary content such as hero text, hero photo, timeline text, gallery photos, or game controls.

Overlay assets must use processed transparent versions where possible. The processing should remove edge-connected white or checkerboard-like backgrounds from asset images while preserving interior white details such as Kuromi eyes.

## Asset Pipeline

The asset copy script should also generate processed transparent PNGs for game and 3D overlay assets. Processed files live under:

- `public/assets/processed/game`
- `public/assets/processed/overlay3d`

The app should use processed assets for Magical overlays and game object UI.

## Game Logic

The Kuromi Care game needs a clearer domain model before UI polish:

- `GameStats`: hunger, energy, cleanliness, happiness, experience
- `GameMood`: happy, sad, sleepy, dirty, angry
- `GameItem`: individual food/toy items with unique stat effects
- `GameStation`: food, bed, bath, toy, study
- `GameState`: stats, mood, current station, current action, active sprite

Mood behavior:

- Dirty appears when cleanliness is low.
- Bath should improve cleanliness and move Kuromi toward a clean or happy state.
- Pressing Bath must not force a dirty sprite.
- Different foods must have different stat effects.
- Sprite resolution must derive from action and mood in a predictable order.

## Game Map

The map uses the existing Kuromi room background. Station buttons must use provided title assets:

- `title food`
- `title bed`
- `title bath`
- `title toy`
- `title soap` for clean/bath support

Station buttons should sit near their matching room locations. Food items are selectable separately and apply different stat effects.

## Verification

Add tests for:

- Food items having distinct effects.
- Bath cleaning dirty Kuromi.
- Mood resolution changing from dirty to happy/clean after bath.
- Sprite resolution not using dirty during bath.
- Station config including title assets and map positions.
- Processed asset manifest containing processed game and overlay assets.

Then verify:

- `npm test`
- `npm run build`
- Browser check for `/theme/magical`
