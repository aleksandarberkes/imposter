"use client";

import { useState } from "react";
import { BackLink } from "@/components/BackLink";
import { Button } from "@/components/Button";
import { CategoryField } from "@/components/CategoryField";
import { CategoryPicker } from "@/components/CategoryPicker";
import { Chip } from "@/components/Chip";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { Panel } from "@/components/Panel";
import { StepButton } from "@/components/StepButton";
import { Sticker } from "@/components/Sticker";
import { t } from "@/games/bomb/lib/i18n";
import {
  FUSE_RANGES,
  MAX_PLAYERS,
  MIN_PLAYERS,
  type Category,
  type Fuse,
  type Settings,
} from "@/games/bomb/lib/types";
import { tCommon } from "@/lib/i18n";
import type { Language } from "@/lib/language";

type Props = {
  settings: Settings;
  language: Language;
  categories: Category[];
  onChange: (next: Settings) => void;
  onLanguageChange: (next: Language) => void;
  onStart: () => void;
};

const FUSES: Fuse[] = ["short", "medium", "long"];

export function Setup({
  settings,
  language,
  categories,
  onChange,
  onLanguageChange,
  onStart,
}: Props) {
  const s = t(language);
  const c = tCommon(language);
  const fuseLabels: Record<Fuse, string> = {
    short: s.fuseShort,
    medium: s.fuseMedium,
    long: s.fuseLong,
  };
  const [fuseMin, fuseMax] = FUSE_RANGES[settings.fuse];
  const [pickerOpen, setPickerOpen] = useState(false);
  const allSelected = settings.categories.length === 0;
  const chosen = allSelected
    ? categories
    : categories.filter((cat) => settings.categories.includes(cat.id));
  const topicCount = chosen.reduce((n, cat) => n + cat.prompts.length, 0);

  const setPlayers = (n: number) =>
    onChange({ ...settings, players: Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, n)) });

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 pb-10 pt-8 sm:max-w-lg sm:px-6">
      <div className="-mb-4 -mt-4">
        <BackLink>{c.games}</BackLink>
      </div>

      {/* Title */}
      <header className="relative animate-slide-up">
        <Sticker color="yellow" tilt={-6} className="absolute -top-3 left-0">
          v0.1 · beta
        </Sticker>
        <h1
          className="glitch font-display text-[52px] leading-none text-fg sm:text-7xl"
          data-text={s.title}
        >
          {s.title}
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
      <Panel label={c.language} tilt={1} color="cyan">
        <LanguageSwitch value={language} onChange={onLanguageChange} />
      </Panel>

      {/* Categories */}
      <Panel label={s.categories} tilt={-0.6} color="yellow">
        <CategoryField
          summary={
            allSelected ? s.allCategories : `${chosen.length}/${categories.length} ${s.selected}`
          }
          detail={`${topicCount} ${s.topics}`}
          icons={chosen.map((cat) => cat.icon)}
          pickLabel={s.pick}
          onOpen={() => setPickerOpen(true)}
        />
      </Panel>

      {/* Fuse */}
      <Panel label={s.fuse} tilt={0.6} color="pink">
        <div className="grid grid-cols-3 gap-2">
          {FUSES.map((f) => (
            <Chip key={f} active={settings.fuse === f} onClick={() => onChange({ ...settings, fuse: f })}>
              {fuseLabels[f]}
            </Chip>
          ))}
        </div>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-muted">
          {"// "}
          {fuseMin}–{fuseMax} {s.seconds}
        </p>
      </Panel>

      {/* Sound */}
      <Panel label={s.sound} tilt={0.8} color="lime">
        <button
          type="button"
          role="switch"
          aria-checked={settings.sound}
          onClick={() => onChange({ ...settings, sound: !settings.sound })}
          className="flex min-h-11 w-full items-center justify-between font-mono text-sm"
        >
          <span className="text-muted">{settings.sound ? s.soundOnDesc : s.soundOffDesc}</span>
          <span
            className={`cut-corners-sm px-3 py-1 font-display text-sm ${
              settings.sound ? "bg-lime text-ink" : "bg-bg-2 text-muted border border-fg/20"
            }`}
          >
            {settings.sound ? s.on : s.off}
          </span>
        </button>
      </Panel>

      <div className="mt-2 animate-slide-up [animation-delay:200ms]">
        <Button size="lg" variant="yellow" className="w-full" onClick={onStart}>
          ▶ {s.start}
        </Button>
        <p className="mt-3 text-center font-mono text-[11px] text-muted">{c.saved}</p>
      </div>

      {pickerOpen && (
        <CategoryPicker
          sections={[
            {
              id: "all",
              items: categories.map((cat) => ({
                id: cat.id,
                icon: cat.icon,
                name: cat.name[language],
                count: cat.prompts.length,
              })),
            },
          ]}
          value={settings.categories}
          labels={{
            title: s.categories,
            selected: s.selected,
            unit: s.topics,
            done: s.done,
            selectAll: s.selectAll,
            deselectAll: s.deselectAll,
            clear: s.clear,
            pickOne: s.pickOne,
          }}
          onChange={(next) => onChange({ ...settings, categories: next })}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </main>
  );
}
