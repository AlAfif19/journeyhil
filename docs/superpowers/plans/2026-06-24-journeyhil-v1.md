# JourneyHil V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the JourneyHil V1 static React/Vite site with `/theme/magical`, `/theme/pixel`, and `/theme/scrapbook` plus a reusable Kuromi Care game.

**Architecture:** A Vite React app with client-side routing. Shared data, asset manifests, and game logic feed theme-specific page components so all routes are complete without duplicating content.

**Tech Stack:** React, Vite, TypeScript, Tailwind CSS, Motion, Lucide React, local static assets, Vercel-ready build output.

## Global Constraints

- All shell commands in this workspace must be prefixed with `rtk`.
- No Docker.
- Local run scripts must exist: `./start.sh` and `./stop.sh`.
- Routes required in V1: `/theme/magical`, `/theme/pixel`, `/theme/scrapbook`.
- Source assets in `keperluan/` must remain untouched.
- Copied public assets must use stable, web-friendly names.
- The Git remote must be `https://github.com/AlAfif19/journeyhil.git`.
- The app must build with `npm run build`.
- The game has no lose state and clamps all stats from 0 to 100.
- Stat decay interval is 30 seconds: hunger `-5`, energy `-3`, cleanliness `-4`, happiness `-2`.
- Core palette: `#2A1B3D`, `#7E5CAD`, `#C8B6FF`, `#F49AC2`, `#A0D2EB`.

---

## File Structure

- Create `package.json`: scripts and dependencies.
- Create `index.html`: Vite entry document.
- Create `vite.config.ts`: React Vite config.
- Create `tsconfig.json`, `tsconfig.node.json`: TypeScript config.
- Create `tailwind.config.ts`, `postcss.config.js`: Tailwind config.
- Create `src/main.tsx`: React root.
- Create `src/App.tsx`: route matching and theme routing.
- Create `src/styles.css`: Tailwind layers, theme variables, responsive polish.
- Create `src/data/journey.ts`: profile, story, timeline, gallery, game data.
- Create `src/data/assets.ts`: public asset path constants.
- Create `src/lib/game.ts`: stat math and action helpers.
- Create `src/components/ThemeShell.tsx`: navigation and page frame.
- Create `src/components/sections.tsx`: hero/about/story/timeline/gallery sections with theme variants.
- Create `src/components/KuromiCareGame.tsx`: reusable game UI.
- Create `src/pages/ThemePage.tsx`: composes a theme route.
- Create `src/pages/ThemeChooser.tsx`: `/` route.
- Create `src/pages/NotFound.tsx`: unsupported route fallback.
- Create `scripts/copy-assets.ps1`: deterministic asset copy.
- Create `start.sh`, `stop.sh`: dev server helpers.
- Create `public/assets/...`: copied and renamed image assets.

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`
- Create: `start.sh`
- Create: `stop.sh`

**Interfaces:**
- Produces: a runnable Vite React TypeScript app with a temporary title screen.
- Produces: npm scripts `dev`, `build`, `preview`, `lint`.

- [ ] **Step 1: Create package and config files**

Create `package.json`:

```json
{
  "name": "journeyhil",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 0.0.0.0",
    "lint": "tsc -b --pretty false"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "framer-motion": "^11.18.2",
    "lucide-react": "^0.468.0",
    "vite": "^6.0.7",
    "typescript": "^5.7.2",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17"
  }
}
```

Create `index.html` with root `div#root`.

Create `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
```

Create strict TypeScript configs using `jsx: "react-jsx"`, `moduleResolution: "Bundler"`, and `noEmit: true`.

Create `tailwind.config.ts` with `content: ["./index.html", "./src/**/*.{ts,tsx}"]`.

Create `postcss.config.js` with Tailwind and Autoprefixer plugins.

- [ ] **Step 2: Create the minimal app shell**

Create `src/main.tsx`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

Create `src/App.tsx`:

```tsx
export default function App() {
  return (
    <main className="min-h-screen bg-[#2A1B3D] text-white">
      <h1>JourneyHil</h1>
    </main>
  );
}
```

Create `src/styles.css` with Tailwind layers and base font smoothing.

- [ ] **Step 3: Create run scripts**

Create `start.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail
npm run dev
```

Create `stop.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail
if command -v pkill >/dev/null 2>&1; then
  pkill -f "vite --host 0.0.0.0" || true
else
  echo "Stop the Vite terminal session manually on this platform."
fi
```

- [ ] **Step 4: Install and verify scaffold**

Run: `rtk npm install`

Expected: dependencies installed and `package-lock.json` created.

Run: `rtk npm run build`

Expected: TypeScript and Vite build complete with exit code 0.

- [ ] **Step 5: Commit**

Run:

```bash
rtk git add package.json package-lock.json index.html vite.config.ts tsconfig.json tsconfig.node.json tailwind.config.ts postcss.config.js src/main.tsx src/App.tsx src/styles.css start.sh stop.sh
rtk git commit -m "chore: scaffold JourneyHil app"
```

---

### Task 2: Assets And Shared Data

**Files:**
- Create: `scripts/copy-assets.ps1`
- Create: `src/data/assets.ts`
- Create: `src/data/journey.ts`
- Create: `public/assets/...`

**Interfaces:**
- Produces: `assetPaths` object with hero, gallery, institution, and game paths.
- Produces: `journeyProfile`, `storyBeats`, `timelineItems`, `galleryItems`, `gameActions`.

- [ ] **Step 1: Create deterministic asset copy script**

Create `scripts/copy-assets.ps1` with a mapping table from source files to public paths. Include at least:

```powershell
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$destRoot = Join-Path $root "public/assets"
New-Item -ItemType Directory -Force -Path $destRoot | Out-Null

$files = @(
  @{ Source = "keperluan/foto hilfia sendiri/hilfia keren.jpeg"; Dest = "photos/hero-hilfia-keren.jpeg" },
  @{ Source = "keperluan/foto hilfia sendiri/cutee.jpeg"; Dest = "photos/hilfia-cutee.jpeg" },
  @{ Source = "keperluan/foto hilfia sendiri/hilfia clean ( bisa jadi hero ).jpeg"; Dest = "photos/hilfia-clean.jpeg" },
  @{ Source = "keperluan/foto hilfia sendiri/hilfia baju hmtl.jpeg"; Dest = "photos/hilfia-hmtl.jpeg" },
  @{ Source = "keperluan/foto galeri/mentor & anak.jpg"; Dest = "gallery/mentor-anak.jpg" },
  @{ Source = "keperluan/foto galeri/main ke cafe.jpg"; Dest = "gallery/main-ke-cafe.jpg" },
  @{ Source = "keperluan/foto galeri/main di taman.jpg"; Dest = "gallery/main-di-taman.jpg" },
  @{ Source = "keperluan/foto galeri/foto bareng dpm.jpg"; Dest = "gallery/foto-bareng-dpm.jpg" },
  @{ Source = "keperluan/foto galeri/gaya wajib komisi 1 lucu.jpg"; Dest = "gallery/komisi-1-lucu.jpg" },
  @{ Source = "keperluan/smk 13 bandung.jpg"; Dest = "places/smk-13-bandung.jpg" },
  @{ Source = "keperluan/universitas kebangsaan republik indonesia.webp"; Dest = "places/universitas-kebangsaan.webp" },
  @{ Source = "keperluan/kamar kuromi pixel game.png"; Dest = "game/kuromi-room.png" },
  @{ Source = "keperluan/kuromi pixel.png"; Dest = "game/kuromi-pixel.png" },
  @{ Source = "keperluan/kuromi 2d.png"; Dest = "game/kuromi-2d.png" },
  @{ Source = "keperluan/aset game.png"; Dest = "game/game-assets.png" },
  @{ Source = "keperluan/hiasan game.png"; Dest = "game/game-decor.png" }
)

foreach ($file in $files) {
  $source = Join-Path $root $file.Source
  $dest = Join-Path $destRoot $file.Dest
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $dest) | Out-Null
  Copy-Item -LiteralPath $source -Destination $dest -Force
}
```

- [ ] **Step 2: Run asset copy**

Run: `rtk powershell -NoProfile -ExecutionPolicy Bypass -File scripts/copy-assets.ps1`

Expected: `public/assets/photos`, `public/assets/gallery`, `public/assets/places`, and `public/assets/game` exist.

- [ ] **Step 3: Create shared asset paths**

Create `src/data/assets.ts`:

```ts
export const assetPaths = {
  photos: {
    hero: "/assets/photos/hero-hilfia-keren.jpeg",
    cutee: "/assets/photos/hilfia-cutee.jpeg",
    clean: "/assets/photos/hilfia-clean.jpeg",
    hmtl: "/assets/photos/hilfia-hmtl.jpeg",
  },
  gallery: {
    mentorAnak: "/assets/gallery/mentor-anak.jpg",
    cafe: "/assets/gallery/main-ke-cafe.jpg",
    taman: "/assets/gallery/main-di-taman.jpg",
    dpm: "/assets/gallery/foto-bareng-dpm.jpg",
    komisi: "/assets/gallery/komisi-1-lucu.jpg",
  },
  places: {
    smk: "/assets/places/smk-13-bandung.jpg",
    university: "/assets/places/universitas-kebangsaan.webp",
  },
  game: {
    room: "/assets/game/kuromi-room.png",
    kuromiPixel: "/assets/game/kuromi-pixel.png",
    kuromi2d: "/assets/game/kuromi-2d.png",
    assets: "/assets/game/game-assets.png",
    decor: "/assets/game/game-decor.png",
  },
} as const;
```

- [ ] **Step 4: Create journey data**

Create `src/data/journey.ts` exporting typed data:

```ts
import { assetPaths } from "./assets";

export type ThemeKey = "magical" | "pixel" | "scrapbook";
export type TimelineItem = { phase: string; title: string; detail: string; image?: string };
export type GalleryItem = { src: string; alt: string; caption: string; category: "profile" | "memory" | "organization" | "school" };
export type GameActionId = "eat" | "sleep" | "bath" | "play" | "study";

export const journeyProfile = {
  name: "Hilfia Qisthi Amalia",
  birthDate: "06 Desember 2023",
  city: "Bandung",
  favorites: ["Strawberry", "Sale Pisang", "Ice Cream"],
  favoriteGame: "Mobile Legends",
  favoriteCharacter: "Kuromi",
  hobby: "Menempel stiker",
  instagram: "@hilfiaqisthii",
};

export const storyBeats = [
  "Awal bertemu sebagai mentor dan anggota kelompok.",
  "Bertemu beberapa kali untuk main dan ngobrol lebih dekat.",
  "Pernah mengajak makan, tapi obrolannya terlalu lama sampai lupa makan.",
  "Akhirnya makanan dibelikan saja, dan ceritanya jadi salah satu memori manis.",
  "Semakin dekat, semakin banyak pengalaman bersama yang layak disimpan.",
];

export const timelineItems: TimelineItem[] = [
  { phase: "Phase 1", title: "Bandung", detail: "06 Desember 2023" },
  { phase: "Phase 2", title: "SMK Negeri 13 Bandung", detail: "Jurusan Kimia Analis", image: assetPaths.places.smk },
  { phase: "Phase 3", title: "Universitas Kebangsaan", detail: "Teknik Lingkungan", image: assetPaths.places.university },
  { phase: "Phase 4", title: "Awal Dekat", detail: "Mentor dan anggota kelompok, sering main bersama, dan cerita lupa makan karena ngobrol terlalu lama." },
  { phase: "Phase 5", title: "Teater Lima Wajah", detail: "Anggota teater, resital, dan sekretaris dhemit." },
  { phase: "Phase 6", title: "BEM Aksara", detail: "Berperan sebagai humas." },
  { phase: "Phase 7", title: "Asisten Lab", detail: "Dipercaya dosen menjadi asisten praktikum." },
  { phase: "Phase 8", title: "HMTL", detail: "Publikasi, dokumentasi, desain, seminar lingkungan, dan sekretaris departemen PSDA." },
  { phase: "Phase 9", title: "DPM", detail: "Ketua Komisi 1." },
];

export const galleryItems: GalleryItem[] = [
  { src: assetPaths.photos.cutee, alt: "Hilfia tersenyum dalam foto personal", caption: "Cute memory", category: "profile" },
  { src: assetPaths.photos.clean, alt: "Hilfia dengan tampilan elegan", caption: "Soft portrait", category: "profile" },
  { src: assetPaths.photos.hmtl, alt: "Hilfia memakai atribut HMTL", caption: "HMTL day", category: "organization" },
  { src: assetPaths.gallery.mentorAnak, alt: "Momen mentor dan anggota kelompok", caption: "Mentor & anak", category: "memory" },
  { src: assetPaths.gallery.cafe, alt: "Momen main ke cafe", caption: "Cafe memory", category: "memory" },
  { src: assetPaths.gallery.taman, alt: "Momen main di taman", caption: "Taman story", category: "memory" },
  { src: assetPaths.gallery.dpm, alt: "Foto bersama DPM", caption: "DPM", category: "organization" },
  { src: assetPaths.gallery.komisi, alt: "Gaya wajib Komisi 1 yang lucu", caption: "Komisi 1", category: "organization" },
];

export const gameActions = [
  { id: "eat", label: "Eat", stat: "hunger", amount: 40, bonusStat: "happiness", bonusAmount: 10 },
  { id: "sleep", label: "Sleep", stat: "energy", amount: 35 },
  { id: "bath", label: "Bath", stat: "cleanliness", amount: 50 },
  { id: "play", label: "Play", stat: "happiness", amount: 30 },
  { id: "study", label: "Study", stat: "experience", amount: 20 },
] as const;
```

- [ ] **Step 5: Verify and commit**

Run: `rtk npm run build`

Expected: build succeeds after the data modules compile.

Run:

```bash
rtk git add scripts/copy-assets.ps1 public/assets src/data
rtk git commit -m "feat: add JourneyHil assets and data"
```

---

### Task 3: Game Logic And Shared Layout Components

**Files:**
- Create: `src/lib/game.ts`
- Create: `src/components/ThemeShell.tsx`
- Create: `src/components/KuromiCareGame.tsx`

**Interfaces:**
- Produces: `clampStat(value: number): number`.
- Produces: `applyGameAction(stats, actionId): GameStats`.
- Produces: `decayStats(stats): GameStats`.
- Produces: `ThemeShell({ theme, children })`.
- Produces: `KuromiCareGame({ theme })`.

- [ ] **Step 1: Create game logic**

Create `src/lib/game.ts`:

```ts
import type { GameActionId } from "../data/journey";

export type GameStats = {
  hunger: number;
  energy: number;
  cleanliness: number;
  happiness: number;
  experience: number;
};

export const initialGameStats: GameStats = {
  hunger: 82,
  energy: 78,
  cleanliness: 86,
  happiness: 88,
  experience: 0,
};

export function clampStat(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function decayStats(stats: GameStats): GameStats {
  return {
    ...stats,
    hunger: clampStat(stats.hunger - 5),
    energy: clampStat(stats.energy - 3),
    cleanliness: clampStat(stats.cleanliness - 4),
    happiness: clampStat(stats.happiness - 2),
  };
}

export function applyGameAction(stats: GameStats, actionId: GameActionId): GameStats {
  if (actionId === "eat") {
    return { ...stats, hunger: clampStat(stats.hunger + 40), happiness: clampStat(stats.happiness + 10) };
  }
  if (actionId === "sleep") return { ...stats, energy: clampStat(stats.energy + 35) };
  if (actionId === "bath") return { ...stats, cleanliness: clampStat(stats.cleanliness + 50) };
  if (actionId === "play") return { ...stats, happiness: clampStat(stats.happiness + 30) };
  return { ...stats, experience: clampStat(stats.experience + 20) };
}

export function moodForStats(stats: GameStats) {
  if (stats.hunger < 25) return "sad";
  if (stats.energy < 25) return "sleepy";
  if (stats.cleanliness < 25) return "dirty";
  if (stats.happiness < 25) return "angry";
  return "happy";
}
```

- [ ] **Step 2: Create ThemeShell**

Create `src/components/ThemeShell.tsx` with nav links to `/theme/magical`, `/theme/pixel`, `/theme/scrapbook`, a `theme` class on the outer wrapper, and a consistent footer.

- [ ] **Step 3: Create KuromiCareGame**

Create `src/components/KuromiCareGame.tsx` using `useState`, `useEffect`, `applyGameAction`, `decayStats`, and `moodForStats`. Render:

- a room image background
- a Kuromi image that shifts left/center/right based on the last action
- stat bars for Hunger, Energy, Cleanliness, Happiness
- action buttons for Eat, Sleep, Bath, Play, Study
- a mood label

Use theme classes so each route can style the same component differently.

- [ ] **Step 4: Verify game compile**

Run: `rtk npm run build`

Expected: TypeScript accepts the game logic and components.

- [ ] **Step 5: Commit**

Run:

```bash
rtk git add src/lib src/components/ThemeShell.tsx src/components/KuromiCareGame.tsx
rtk git commit -m "feat: add shared shell and Kuromi game"
```

---

### Task 4: Shared Sections And Route Composition

**Files:**
- Create: `src/components/sections.tsx`
- Create: `src/pages/ThemePage.tsx`
- Create: `src/pages/ThemeChooser.tsx`
- Create: `src/pages/NotFound.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Produces: `ThemePage({ theme })`.
- Produces: client route handling for `/`, `/theme/magical`, `/theme/pixel`, `/theme/scrapbook`.

- [ ] **Step 1: Create reusable sections**

Create `src/components/sections.tsx` exporting:

- `HeroSection`
- `AboutSection`
- `StorySection`
- `TimelineSection`
- `GallerySection`

Each component accepts `theme: ThemeKey`. Use shared data from `src/data/journey.ts` and assets from `src/data/assets.ts`.

- [ ] **Step 2: Create ThemePage**

Create `src/pages/ThemePage.tsx`:

```tsx
import { KuromiCareGame } from "../components/KuromiCareGame";
import { AboutSection, GallerySection, HeroSection, StorySection, TimelineSection } from "../components/sections";
import { ThemeShell } from "../components/ThemeShell";
import type { ThemeKey } from "../data/journey";

export function ThemePage({ theme }: { theme: ThemeKey }) {
  return (
    <ThemeShell theme={theme}>
      <HeroSection theme={theme} />
      <AboutSection theme={theme} />
      <StorySection theme={theme} />
      <TimelineSection theme={theme} />
      <GallerySection theme={theme} />
      <section id="game" className="section-wrap">
        <KuromiCareGame theme={theme} />
      </section>
    </ThemeShell>
  );
}
```

- [ ] **Step 3: Create chooser and fallback pages**

Create `ThemeChooser` with links to all three routes and hero image preview.

Create `NotFound` with links back to all three routes.

- [ ] **Step 4: Replace App route handling**

Modify `src/App.tsx` to read `window.location.pathname` and render:

- `/` -> `ThemeChooser`
- `/theme/magical` -> `<ThemePage theme="magical" />`
- `/theme/pixel` -> `<ThemePage theme="pixel" />`
- `/theme/scrapbook` -> `<ThemePage theme="scrapbook" />`
- anything else -> `NotFound`

- [ ] **Step 5: Verify and commit**

Run: `rtk npm run build`

Expected: all pages compile.

Run:

```bash
rtk git add src/App.tsx src/pages src/components/sections.tsx
rtk git commit -m "feat: compose JourneyHil theme routes"
```

---

### Task 5: Theme Visual Polish

**Files:**
- Modify: `src/styles.css`
- Modify: `src/components/sections.tsx`
- Modify: `src/components/KuromiCareGame.tsx`

**Interfaces:**
- Consumes: `theme` class names from `ThemeShell`.
- Produces: complete visual styling for magical, pixel, and scrapbook themes.

- [ ] **Step 1: Add design tokens and layout utilities**

In `src/styles.css`, define:

- CSS variables for palette
- `.section-wrap`
- `.theme-magical`, `.theme-pixel`, `.theme-scrapbook`
- responsive hero grids
- gallery masonry-like columns
- game panel styles
- reduced motion media query

- [ ] **Step 2: Polish Magical route**

Add magical-specific classes:

- dark purple night background
- floating star layer using CSS radial gradients
- soft cloud-like pseudo elements
- glass panels with readable contrast
- constellation-style timeline

- [ ] **Step 3: Polish Pixel route**

Add pixel-specific classes:

- pixel font accents
- crisp image rendering for game assets
- blocky borders and inset shadows
- quest-card timeline labels
- high-contrast action buttons

- [ ] **Step 4: Polish Scrapbook route**

Add scrapbook-specific classes:

- lavender paper background
- photo tape details using pseudo elements
- sticker-like badges
- polaroid gallery cards
- note-strip timeline items

- [ ] **Step 5: Verify and commit**

Run: `rtk npm run build`

Expected: build succeeds.

Run:

```bash
rtk git add src/styles.css src/components/sections.tsx src/components/KuromiCareGame.tsx
rtk git commit -m "feat: polish JourneyHil theme visuals"
```

---

### Task 6: Final Verification And Repository Publish

**Files:**
- Modify only files needed for fixes found during verification.

**Interfaces:**
- Produces: verified local app and pushed `main` branch when authentication permits.

- [ ] **Step 1: Build verification**

Run: `rtk npm run build`

Expected: exit code 0 and Vite outputs `dist`.

- [ ] **Step 2: Start dev server**

Run: `rtk npm run dev`

Expected: Vite reports a local URL, commonly `http://localhost:5173/`.

- [ ] **Step 3: Manual route checks**

Open and verify:

- `http://localhost:5173/theme/magical`
- `http://localhost:5173/theme/pixel`
- `http://localhost:5173/theme/scrapbook`

Check:

- hero photo renders
- all CTA links scroll or navigate correctly
- timeline content appears
- gallery images load lazily
- Kuromi game buttons update stats
- layout works at mobile and desktop widths

- [ ] **Step 4: Stop server**

Run: `rtk ./stop.sh` from Git Bash if the server was launched through `rtk ./start.sh`, or stop the terminal session manually if launched directly.

- [ ] **Step 5: Final git status**

Run: `rtk git status --short`

Expected: clean except intentionally untracked local-only files. For this project, `keperluan/` may remain untracked if source assets should not be committed.

- [ ] **Step 6: Push**

Run:

```bash
rtk git push -u origin main
```

Expected: branch `main` pushed to `https://github.com/AlAfif19/journeyhil.git`. If authentication fails, report the exact git error and leave the commit ready locally.
