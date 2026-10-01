"use client";

import { useState } from "react";
import { BackLink } from "@/components/BackLink";
import { Button } from "@/components/Button";
import { CategoryField } from "@/components/CategoryField";
import { CategoryPicker } from "@/components/CategoryPicker";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { Panel } from "@/components/Panel";
import { StepButton } from "@/components/StepButton";
import { Sticker } from "@/components/Sticker";
import { groups } from "@/games/imposter/data/groups";
import { t } from "@/games/imposter/lib/i18n";
import {
  MAX_PLAYERS,
  MIN_PLAYERS,
  type Category,
  type Settings,
} from "@/games/imposter/lib/types";
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
  const [pickerOpen, setPickerOpen] = useState(false);
  const allSelected = settings.categories.length === 0;
  const chosen = allSelected
    ? categories
    : categories.filter((c) => settings.categories.includes(c.id));
  const wordCount = chosen.reduce((n, c) => n + c.words.length, 0);

  const setPlayers = (n: number) =>
    onChange({ ...settings, players: Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, n)) });

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 pb-10 pt-8 sm:max-w-lg sm:px-6">
      <div className="-mb-4 -mt-4">
        <BackLink>{c.games}</BackLink>
      </div>

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
      <Panel label={c.language} tilt={1} color="cyan">
        <LanguageSwitch value={language} onChange={onLanguageChange} />
      </Panel>

      {/* Categories */}
      <Panel label={s.categories} tilt={-0.6} color="yellow">
        <CategoryField
          summary={
            allSelected ? s.allCategories : `${chosen.length}/${categories.length} ${s.selected}`
          }
          detail={`${wordCount} ${s.words}`}
          icons={chosen.map((c) => c.icon)}
          pickLabel={s.pick}
          onOpen={() => setPickerOpen(true)}
        />
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
        <p className="mt-3 text-center font-mono text-[11px] text-muted">{c.saved}</p>
      </div>

      {pickerOpen && (
        <CategoryPicker
          sections={groups.map((g) => ({
            id: g.id,
            label: `${g.icon} ${g.name[language]}`,
            items: categories
              .filter((cat) => cat.group === g.id)
              .map((cat) => ({
                id: cat.id,
                icon: cat.icon,
                name: cat.name[language],
                count: cat.words.length,
              })),
          }))}
          value={settings.categories}
          labels={{
            title: s.categories,
            selected: s.selected,
            unit: s.words,
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
