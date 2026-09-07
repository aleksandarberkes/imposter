"use client";

import { Button } from "./Button";
import { Sticker } from "./Sticker";
import { t } from "@/lib/i18n";
import {
  MAX_PLAYERS,
  MIN_PLAYERS,
  type Category,
  type Language,
  type Settings,
} from "@/lib/types";

type Props = {
  settings: Settings;
  categories: Category[];
  onChange: (next: Settings) => void;
  onStart: () => void;
};

export function Setup({ settings, categories, onChange, onStart }: Props) {
  const s = t(settings.language);
  const allSelected = settings.categories.length === 0;

  const setPlayers = (n: number) =>
    onChange({ ...settings, players: Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, n)) });

  const setLanguage = (language: Language) => onChange({ ...settings, language });

  const toggleCategory = (id: string) => {
    const next = settings.categories.includes(id)
      ? settings.categories.filter((c) => c !== id)
      : [...settings.categories, id];
    // Selecting every category individually is the same as "all".
    onChange({ ...settings, categories: next.length === categories.length ? [] : next });
  };

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 pb-10 pt-8 sm:max-w-lg sm:px-6">
      {/* Title */}
      <header className="relative animate-slide-up">
        <Sticker color="cyan" tilt={-6} className="absolute -top-3 left-0">
          v0.1 · beta
        </Sticker>
        <h1
          className="glitch font-display text-[52px] leading-none text-fg sm:text-7xl"
          data-text="IMPOSTER"
        >
          IMPOSTER
        </h1>
        <p className="mt-2 font-mono text-sm text-pink">&gt; {s.tagline}_</p>
      </header>

      {/* Players */}
      <Panel label={s.players} tilt={-1} color="pink">
        <div className="flex items-center justify-between gap-4">
          <StepButton onClick={() => setPlayers(settings.players - 1)} disabled={settings.players <= MIN_PLAYERS}>
            −
          </StepButton>
          <span className="font-display text-5xl tabular-nums text-yellow" aria-live="polite">
            {settings.players}
          </span>
          <StepButton onClick={() => setPlayers(settings.players + 1)} disabled={settings.players >= MAX_PLAYERS}>
            +
          </StepButton>
        </div>
      </Panel>

      {/* Language */}
      <Panel label={s.language} tilt={1} color="cyan">
        <div className="grid grid-cols-2 gap-3">
          <Chip active={settings.language === "en"} onClick={() => setLanguage("en")}>
            🇬🇧 English
          </Chip>
          <Chip active={settings.language === "sr"} onClick={() => setLanguage("sr")}>
            🇷🇸 Srpski
          </Chip>
        </div>
      </Panel>

      {/* Categories */}
      <Panel label={s.categories} tilt={-0.6} color="yellow">
        <div className="flex flex-wrap gap-2">
          <Chip active={allSelected} onClick={() => onChange({ ...settings, categories: [] })}>
            {s.all}
          </Chip>
          {categories.map((c) => (
            <Chip
              key={c.id}
              active={!allSelected && settings.categories.includes(c.id)}
              onClick={() => toggleCategory(c.id)}
            >
              {c.name[settings.language]}
              <span className="ml-1 font-mono text-[10px] opacity-60">{c.words.length}</span>
            </Chip>
          ))}
        </div>
      </Panel>

      {/* Hint */}
      <Panel label={s.hint} tilt={0.8} color="lime">
        <button
          type="button"
          role="switch"
          aria-checked={settings.hint}
          onClick={() => onChange({ ...settings, hint: !settings.hint })}
          className="flex min-h-11 w-full items-center justify-between font-mono text-sm"
        >
          <span className="text-muted">
            {settings.hint ? s.hintOnDesc : s.hintOffDesc}
          </span>
          <span
            className={`cut-corners-sm px-3 py-1 font-display text-sm ${
              settings.hint ? "bg-lime text-ink" : "bg-bg-2 text-muted border border-fg/20"
            }`}
          >
            {settings.hint ? s.on : s.off}
          </span>
        </button>
      </Panel>

      <div className="mt-2 animate-slide-up [animation-delay:200ms]">
        <Button size="lg" className="w-full" onClick={onStart}>
          ▶ {s.start}
        </Button>
        <p className="mt-3 text-center font-mono text-[11px] text-muted">{s.saved}</p>
      </div>
    </main>
  );
}

/* ---------- local pieces ---------- */

function Panel({
  label,
  color,
  tilt,
  children,
}: {
  label: string;
  color: "pink" | "cyan" | "yellow" | "lime";
  tilt: number;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{ "--tilt": `${tilt}deg` } as React.CSSProperties}
      className="relative animate-float-slow hard-shadow-ink"
    >
      <div className="cut-corners border-2 border-fg/15 bg-bg-2/90 p-4 pt-6">
        {children}
      </div>
      <Sticker color={color} tilt={-2} className="absolute -top-2 left-3">
        {label}
      </Sticker>
    </section>
  );
}

function StepButton({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...rest}
      className="cut-corners-sm flex size-14 items-center justify-center bg-cyan font-display text-3xl text-ink transition-transform active:scale-90 disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`cut-corners-sm min-h-11 px-4 font-mono text-sm font-bold uppercase tracking-wide transition-transform active:scale-95 ${
        active ? "bg-pink text-ink" : "bg-bg text-fg border border-fg/25"
      }`}
    >
      {children}
    </button>
  );
}
