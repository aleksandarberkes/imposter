@AGENTS.md

# Imposter

Mobile-first website built with Next.js (App Router), TypeScript and Tailwind CSS v4. Deployed on Vercel.

## Commands

```bash
npm run dev     # local dev server (Turbopack) at http://localhost:3000
npm run build   # production build — run before pushing
npm run lint    # ESLint
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
- Test every UI change at 375px width first (iPhone SE / small Android), then tablet and desktop.
- Colors come from CSS variables in `globals.css` (`--background`, `--foreground`, `--muted`, `--accent`), which support light and dark via `prefers-color-scheme`. Reference them as Tailwind classes (`bg-background`, `text-muted`, etc.).

## Project layout

```
src/app/
  layout.tsx    # root layout, metadata, viewport
  page.tsx      # home page
  globals.css   # Tailwind import, theme tokens, base mobile styles
public/         # static assets
```

## Conventions

- One component per file, PascalCase filenames for components, colocate under `src/components/`.
- Prefer named exports for components; pages/layouts use default exports (required by Next).
- No inline `style={}` unless a value is truly dynamic.
- Run `npm run build` before committing to catch type and route errors.
