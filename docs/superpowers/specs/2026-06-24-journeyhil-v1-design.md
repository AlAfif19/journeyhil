# JourneyHil V1 Design

## Goal

Build a static interactive storytelling website for Hilfia Qisthi Amalia with all final theme routes available in version 1:

- `/theme/magical`
- `/theme/pixel`
- `/theme/scrapbook`

The site presents Hilfia's profile, journey, memories, organizations, academic path, and a Kuromi Care mini game. It is designed for Vercel deployment with no Docker requirement.

## Product Shape

JourneyHil is a personal interactive story, not a plain portfolio. The experience should feel cute, elegant, and affectionate while staying polished enough for a public website. The content centers on Hilfia's life journey, shared memories, school and university phases, organization experience, and a playful Kuromi-inspired game.

Version 1 includes all three routes as complete experiences. Each route uses the same content and assets but presents them through a distinct theme direction.

## Tech Stack

- React
- Vite
- Tailwind CSS
- shadcn/ui-compatible component structure
- Motion for animation
- Static assets served from `public/assets`
- Vercel deployment
- Local run scripts: `./start.sh` and `./stop.sh`

The implementation must not require Docker.

## Routing

The app is a Vite single page app with client-side routing:

- `/` redirects or links to the theme selector
- `/theme/magical` renders Magical Kuromi Journey
- `/theme/pixel` renders Pixel Kuromi House Adventure
- `/theme/scrapbook` renders Elegant Scrapbook Kuromi

After version 1, the Vercel deployment can promote one theme as the default, but version 1 must keep all routes available.

## Shared Content Model

Shared data modules should contain the profile, story, timeline, favorites, gallery manifest, and game configuration. Theme pages consume the same data to avoid duplicate edits.

Profile content:

- Name: Hilfia Qisthi Amalia
- Birth date: 06 Desember 2023
- City: Bandung
- Favorites: Strawberry, Sale Pisang, Ice Cream
- Favorite game: Mobile Legends
- Favorite character: Kuromi
- Hobby: Menempel stiker
- Instagram: `@hilfiaqisthii`

Main story:

- First met as mentor and group member
- Met several times to hang out
- Once invited her to eat
- Conversation lasted so long that eating was forgotten
- Food was bought for her instead
- Grew closer over time
- Built many shared experiences

Timeline phases:

- Bandung, 06 Desember 2023
- SMK Negeri 13 Bandung, Kimia Analis
- Universitas Kebangsaan, Teknik Lingkungan
- Mentor and group member meeting, then grew closer
- Teater Lima Wajah: member, recital, sekretaris dhemit
- BEM Aksara: humas
- Asisten Lab: trusted by lecturer as practicum assistant
- HMTL: publication, documentation, design, environmental seminars, sekretaris departemen PSDA
- DPM: Ketua Komisi 1

## Asset Strategy

Existing source assets live in `keperluan/`. Implementation should copy selected files into `public/assets` with stable, web-friendly names. Original source files should remain untouched.

Hero photo:

- Use `keperluan/foto hilfia sendiri/hilfia keren.jpeg` as the selected hero image.

Gallery:

- Include the other personal photos, organization photos, activity photos, and memory photos from `keperluan/foto hilfia sendiri` and `keperluan/foto galeri`.
- Use lazy loading for gallery images.
- Keep asset names meaningful after copying to public assets.

Game assets:

- Use available Kuromi, room, food, bed, bath, toy, and decoration assets from `keperluan`.
- The game must work even if some detailed sprite sheets are imperfect by falling back to simple animated transforms and mood states.

## Theme 1: Magical Kuromi Journey

This route is dreamy, elegant, and soft. It uses a full-viewport hero with Hilfia's selected hero photo as a first-screen signal. The visual language includes stars, moon details, floating Kuromi accents, soft cloud layers, lavender glow, and restrained glass surfaces.

The hero text:

- Title: `Journey of Hilfia Qisthi Amalia`
- Supporting text: `A beautiful story of growth and memories`
- CTA buttons: `Explore Journey` and `Play Kuromi Game`

Sections should feel like chapters in a night-sky journey. Timeline cards can appear as constellation points. The gallery should use soft floating cards without hiding the actual photos.

## Theme 2: Pixel Kuromi House Adventure

This route is playful, retro, and game-like. It should feel like entering a small pixel adventure rather than reading a standard page.

The first screen is a game profile/start screen with Hilfia's photo, pixel UI framing, Kuromi elements, and clear controls to start exploring or jump to the game.

The story and timeline are presented as quests. Each phase can read like a level or mission, while still preserving the real biographical content. The Kuromi Care game is most native to this theme and should visually anchor the route.

## Theme 3: Elegant Scrapbook Kuromi

This route is personal, diary-like, and warm without becoming messy. It uses layered photos, sticker-like Kuromi details, tape edges, note fragments, and polaroid-style gallery treatment.

The hero should feel like opening a scrapbook cover for Hilfia. The story section reads like diary entries. The timeline can use dated note strips and memory labels.

The design must avoid making the entire UI beige or brown. The scrapbook look should keep the requested purple, lavender, pink, and soft blue palette.

## Visual System

Core palette:

- Dark Purple: `#2A1B3D`
- Soft Purple: `#7E5CAD`
- Lavender: `#C8B6FF`
- Pink: `#F49AC2`
- Soft Blue: `#A0D2EB`

Theme-specific use:

- Magical: dark purple base, lavender glow, soft blue highlights, pink accents
- Pixel: dark purple pixel panels, saturated lavender and pink controls, soft blue UI states
- Scrapbook: light lavender paper, dark purple ink, pink sticker accents, soft blue tape or labels

Typography:

- Modern display/body: Poppins and Outfit
- Pixel route accents: Press Start 2P or Pixelify Sans

The implementation may load fonts from Google Fonts in CSS. If remote font loading is unavailable, it must fall back to system sans-serif fonts without breaking layout.

## Components

Shared components:

- `ThemeShell`: page frame, navigation, background treatment hook
- `HeroSection`: theme-specific hero variant
- `AboutSection`: Hilfia profile and favorites
- `StorySection`: theme-specific story presentation
- `TimelineSection`: timeline visualization
- `GallerySection`: lazy image grid with hover/focus states
- `KuromiCareGame`: interactive game component
- `ThemeSwitcher`: route links for all three themes

Theme-specific components or variant props should control layout, palette, and motion. Content should come from shared data files.

## Kuromi Care Game

The game is an interactive tamagotchi-style mini game set in a Kuromi room.

Stats:

- Hunger: 0 to 100
- Energy: 0 to 100
- Cleanliness: 0 to 100
- Happiness: 0 to 100

Initial values should be high enough that the game starts cheerful.

Actions:

- Eat: `+40 Hunger`, `+10 Happiness`
- Sleep: `+35 Energy`
- Bath: `+50 Cleanliness`
- Play: `+30 Happiness`
- Study: `+20 Experience visual only`

Stat decay every 30 seconds:

- Hunger `-5`
- Energy `-3`
- Cleanliness `-4`
- Happiness `-2`

There is no lose state. Stats clamp between 0 and 100.

Mood states:

- Low hunger: sad
- Low energy: sleepy
- Low cleanliness: dirty
- Low happiness: angry

Interaction flow:

1. User clicks an object or action button.
2. Game sets a target area.
3. Kuromi moves toward the target with a walking animation.
4. On arrival, the action animation or mood state plays briefly.
5. Stats update.

The game should be playable with pointer input and keyboard-focusable action controls.

## Responsiveness

The site must work on mobile, tablet, laptop, and large desktop screens.

Layout requirements:

- Hero content must not cover faces in key photos.
- Buttons must not overflow text on mobile.
- Gallery cards must keep stable dimensions and lazy-load images.
- Game controls must remain reachable on small screens.
- Reduced-motion users should receive simplified animations.

## Accessibility

The site must include:

- Semantic section structure
- Keyboard-focusable controls
- Visible focus states
- Alt text for meaningful photos and decorative empty alt text for purely decorative assets
- Button labels that describe actions
- Sufficient color contrast for text over themed backgrounds
- Motion reduced when `prefers-reduced-motion` is enabled

## Error And Fallback Behavior

The app is static and should avoid runtime failure from missing assets.

- Broken gallery assets should not break the whole page.
- Game state should clamp values instead of allowing invalid stats.
- Unsupported routes should render a theme chooser or not-found screen with links to all theme routes.
- If a future version adds local storage, game state must still work when storage is unavailable.

## Testing And Verification

Implementation verification should include:

- Install dependencies
- Build the app with `npm run build`
- Run available lint or type checks if configured
- Start local dev server
- Check `/theme/magical`, `/theme/pixel`, and `/theme/scrapbook`
- Verify CTA anchors and route links
- Verify Kuromi game actions update stats
- Verify responsive layout at mobile and desktop widths

## Out Of Scope For V1

- User accounts
- Backend persistence
- Audio playback
- Docker
- CMS editing
- Real deployment automation beyond Vercel-ready static build

## Repository Setup

The project workspace should use `https://github.com/AlAfif19/journeyhil.git` as `origin`. If the GitHub repo has no default branch yet, initialize local branch `main` and push it when the first implementation milestone is ready.
