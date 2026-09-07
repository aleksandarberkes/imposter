@AGENTS.md

# Imposter

**Imposter** — a pass-the-phone party game. Mobile-first website built with Next.js (App Router), TypeScript and Tailwind CSS v4. Deployed on Vercel.

## How the game works

1. Setup: number of players (3–12), language (`en` / `sr`), categories (empty selection = all), imposter hint on/off.
2. Start: one random word is drawn from the chosen categories (weighted per word, not per category). One random player index is the imposter.
3. Players pass the phone. Each taps their card → "make sure nobody is looking" → Reveal → sees the word, or IMPOSTER (+ hint if enabled) → Hide & pass. Opened cards become "taken".
4. When all cards are taken: discuss, optionally "Show imposter", then new round or back to setup.

## Data & persistence (no database)

- **Words live in JSON files on the server**: `src/data/categories/*.json`. One file per category:
  `{ id, group, icon, name: {en, sr}, words: [{ en: {word, hint}, sr: {word, hint} }] }`.
  `group` is one of the ids in `src/data/groups.ts` (everyday, geography, entertainment, games, music, sports); `icon` is one emoji.
  To add a category: drop a file there and register it in `src/data/index.ts`. Every word must have both languages and a hint.
- **Word count guideline**: narrow/fandom categories (superheroes, MTG, anime…) 20–30 of the most popular items; broad categories (animals, food, professions…) 50–80. Popular and describable beats obscure.
- **Validate after editing data**: `npm run words:check` (checks schema, counts, duplicates, hint ≠ word). Run it before committing.
- Category picking: `settings.categories` empty = all. `<CategoryPicker>` is a full-screen sheet grouped by section with per-group select-all; it never lets the selection drop to zero.
- `src/app/page.tsx` is a Server Component that imports the data and passes it to the client `<App>` — static at build time, no API routes.
- **Everything the user enters is stored in localStorage** via `useLocalStorage` in `src/lib/storage.ts`:
  - `imposter:settings` — setup form (players, language, categories, hint)
  - `imposter:game` — the round in progress, so a refresh doesn't lose it
  Never add server-side user state.

## Design language

Retro Watch Dogs 2 / DedSec hacker aesthetic with floating cards:
- Near-black background with cyan blueprint grid, CRT scanlines overlay (`body::before`), dark vignette.
- Palette tokens in `globals.css`: `pink` #ff2a6d, `cyan` #05d9e8, `yellow` #f9f002, `lime` #7cff01, `bg`, `bg-2`, `fg`, `muted`, `ink`.
- Fonts: Bungee (`font-display`) for headings/buttons, Space Grotesk (body), Space Mono (labels, tags).
- Shapes: `cut-corners` / `cut-corners-sm` clip-path. Offset "sticker" shadows via `hard-shadow-{color}` — **must go on a wrapper** around the clipped element (clip-path clips box-shadow; the utility uses drop-shadow). Add class `press` on that wrapper to drop the shadow while pressed.
- `<Sticker>` = small rotated label. `<Button>` = chunky cut-corner button with variants pink/cyan/yellow/ghost.
- Floating: `animate-float` / `animate-float-slow` with per-element `--tilt` CSS var for a hand-placed look. `.glitch` + `data-text` for the RGB-split title.
- Respect `prefers-reduced-motion` (handled globally).

## Commands

```bash
npm run dev     # local dev server (Turbopack) at http://localhost:3000
npm run build   # production build — run before pushing
npm run lint    # ESLint
npm run words:check  # validate src/data/categories/*.json
```

## Stack

- Next.js 16 (App Router, `src/app/`), React 19, TypeScript strict
- Tailwind CSS v4 — config lives in `src/app/globals.css` via `@theme`, no `tailwind.config.js`
- Fonts: Geist via `next/font/google` (exposed as `--font-sans` / `--font-mono`)
- Path alias: `@/*` → `src/*`
- Hosting: Vercel (zero-config; every push to `main` deploys to production, other branches get preview URLs)

## Mobile-first rules

- **Write base styles for the smallest screen, then add `sm:` / `md:` / `lg:` variants to scale up.** Never start with desktop and shrink down.
- Touch targets ≥ 44px (`min-h-11`). Use `active:` states, not only `hover:`.
- Layout uses `dvh`, not `vh`, for full-height sections (mobile browser toolbars).
- Safe-area insets are applied on `<body>` in `globals.css`; `viewportFit: "cover"` is set in `layout.tsx`. Do not remove.
- Use `next/image` for all images with explicit `sizes` for responsive loading.
- Keep client JS small: default to Server Components, add `"use client"` only where interaction is needed.
- Test every UI change at 375–390px width first (iPhone SE / small Android), then tablet and desktop.
- UI text must go through `src/lib/i18n.ts` — never hardcode English strings in components.
- Colors come from CSS variables in `globals.css` (`--background`, `--foreground`, `--muted`, `--accent`), which support light and dark via `prefers-color-scheme`. Reference them as Tailwind classes (`bg-background`, `text-muted`, etc.).

## Project layout

```
src/app/
  layout.tsx        # root layout, fonts, metadata, viewport
  page.tsx          # server component: loads word data → <App>
  globals.css       # Tailwind import, theme tokens, keyframes, utilities
src/components/
  App.tsx           # client root: localStorage state, setup ↔ game switch
  Setup.tsx         # settings form
  CategoryPicker.tsx# full-screen grouped category sheet
  Game.tsx          # card grid, reveal overlay, end of round
  Button.tsx, Sticker.tsx
src/lib/
  types.ts          # Settings, Game, Category types + defaults/limits
  game.ts           # createGame(): pure word/imposter selection
  i18n.ts           # UI strings for en/sr (t(lang))
  storage.ts        # useLocalStorage hook (SSR-safe)
src/data/
  index.ts          # registers category files
  groups.ts         # picker sections (id, icon, localized name)
  categories/*.json # word lists
scripts/
  validate-words.mjs
```

## Conventions

- One component per file, PascalCase filenames for components, colocate under `src/components/`.
- Prefer named exports for components; pages/layouts use default exports (required by Next).
- No inline `style={}` unless a value is truly dynamic.
- Run `npm run build` before committing to catch type and route errors.
