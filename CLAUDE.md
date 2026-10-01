@AGENTS.md

# Party Games (Imposter, Bomb)

A collection of pass-the-phone party games. Mobile-first website built with Next.js (App Router), TypeScript and Tailwind CSS v4. Deployed on Vercel.

## Games are fully separate

- `/` is the main menu (`<MainMenu>`), listing the games registered in `src/games/index.ts`.
- Each game is self-contained in `src/games/<id>/` (`components/`, `lib/`, `data/`) with its route in `src/app/<id>/page.tsx`. **Games never import from each other.**
- Shared code only: `src/components/` (Button, Sticker, Panel, Chip, StepButton, LanguageSwitch, BackLink, MainMenu) and `src/lib/` (storage, language, common i18n).
- To add a game: create `src/games/<id>/` and `src/app/<id>/page.tsx`, add an entry to `src/games/index.ts`, use `<id>:settings` / `<id>:game` localStorage keys.
- UI language (`en` / `sr`) is shared by everything via `useLanguage()` (`app:language` in localStorage). Read it once in the game's root component and pass it down.

## How Imposter works

1. Setup: number of players (3–12), language (`en` / `sr`), categories (empty selection = all), imposter hint on/off.
2. Start: one random word is drawn from the chosen categories (weighted per word, not per category). One random player index is the imposter.
3. Players pass the phone. Each taps their card → "make sure nobody is looking" → Reveal → sees the word, or IMPOSTER (+ hint if enabled) → Hide & pass. Opened cards become "taken".
4. When all cards are taken: discuss, optionally "Show imposter", then new round or back to setup.

## How Bomb works

1. Setup: number of players (2–12), language, fuse length (short / medium / long — a hidden random time within `FUSE_RANGES`), sound on/off.
2. Each round shows a topic ("Name: Animals"). Someone arms the bomb; players say one thing that fits and pass the phone. No repeats.
3. The timer is never shown. When it blows, tap who was holding it → they get a strike. Scoreboard, then next round with a new topic (topics don't repeat until all are used).
4. `explodesAt` is stored as an absolute timestamp so a refresh keeps the same fuse. Sounds are synthesized with Web Audio (`lib/sound.ts`), no audio files.
5. Topics live in `src/games/bomb/data/categories.json`, grouped by category: `[{ id, icon, name: {en, sr}, prompts: [{ en, sr }] }]`. `settings.categories` empty = all.

## Data & persistence (no database)

- **Imposter words live in JSON files on the server**: `src/games/imposter/data/categories/*.json`. One file per category:
  `{ id, group, icon, name: {en, sr}, words: [{ en: {word, hint}, sr: {word, hint} }] }`.
  `group` is one of the ids in `src/games/imposter/data/groups.ts` (everyday, geography, entertainment, games, music, sports); `icon` is one emoji.
  To add a category: drop a file there and register it in `src/games/imposter/data/index.ts`. Every word must have both languages and a hint.
- **Word count guideline**: narrow/fandom categories (superheroes, MTG, anime…) 20–30 of the most popular items; broad categories (animals, food, professions…) 50–80. Popular and describable beats obscure.
- **Validate after editing data**: `npm run words:check` (checks schema, counts, duplicates, hint ≠ word). Run it before committing.
- Category picking (both games): `settings.categories` empty = all. The shared `<CategoryPicker>` is a full-screen sheet with Select all / Deselect all, optional sections with per-section select-all, and a local draft: the list can be emptied while picking, but an empty selection is never saved and Done is disabled until at least one is chosen. `<CategoryField>` is the setup row that opens it.
- Each `src/app/<game>/page.tsx` is a Server Component that imports the game's data and passes it to its client root (`<ImposterApp>`, `<BombApp>`) — static at build time, no API routes.
- **Everything the user enters is stored in localStorage** via `useLocalStorage` in `src/lib/storage.ts`:
  - `app:language` — UI language, shared by the menu and all games
  - `imposter:settings` — setup form (players, categories, hint)
  - `imposter:game` — the round in progress, so a refresh doesn't lose it
  - `bomb:settings` — setup form (players, categories, fuse, sound)
  - `bomb:game` — the game in progress (round, topic, fuse end time, strikes)
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
npm run words:check  # validate imposter categories + bomb prompts
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
- UI text must go through i18n — the game's own `src/games/<id>/lib/i18n.ts` (`t(lang)`), or `src/lib/i18n.ts` (`tCommon(lang)`) for strings shared with the menu. Never hardcode English strings in components.
- Colors come from CSS variables in `globals.css` (`--background`, `--foreground`, `--muted`, `--accent`), which support light and dark via `prefers-color-scheme`. Reference them as Tailwind classes (`bg-background`, `text-muted`, etc.).

## Project layout

```
src/app/
  layout.tsx        # root layout, fonts, metadata, viewport
  page.tsx          # main menu → <MainMenu>
  imposter/page.tsx # server component: loads word data → <ImposterApp>
  bomb/page.tsx     # server component: loads prompts → <BombApp>
  globals.css       # Tailwind import, theme tokens, keyframes, utilities
src/components/     # shared UI only
  MainMenu.tsx      # game picker
  Button.tsx, Sticker.tsx, Panel.tsx, Chip.tsx, StepButton.tsx
  CategoryPicker.tsx, CategoryField.tsx  # category sheet + the setup row that opens it
  LanguageSwitch.tsx, BackLink.tsx
src/lib/            # shared logic only
  storage.ts        # useLocalStorage hook (SSR-safe)
  language.ts       # Language type + useLanguage() (app:language)
  i18n.ts           # strings shared with the menu (tCommon(lang))
src/games/
  index.ts          # game registry for the menu
  imposter/
    components/     # ImposterApp (client root), Setup, Game
    lib/            # types.ts, game.ts (createGame), i18n.ts
    data/           # index.ts, groups.ts, categories/*.json
  bomb/
    components/     # BombApp (client root), Setup, Game
    lib/            # types.ts, game.ts (pure state transitions), sound.ts, i18n.ts
    data/           # index.ts, categories.json
scripts/
  validate-words.mjs
```

## Conventions

- One component per file, PascalCase filenames for components. Shared ones go in `src/components/`, game-specific ones in `src/games/<id>/components/`.
- Prefer named exports for components; pages/layouts use default exports (required by Next).
- No inline `style={}` unless a value is truly dynamic.
- Run `npm run build` before committing to catch type and route errors.
