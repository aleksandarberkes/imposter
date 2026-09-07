"use client";

import { useState } from "react";
import { Button } from "./Button";
import { Sticker } from "./Sticker";
import { t } from "@/lib/i18n";
import type { Category, Game as GameState, Settings } from "@/lib/types";

type Props = {
  game: GameState;
  settings: Settings;
  categories: Category[];
  onChange: (next: GameState) => void;
  onNewRound: () => void;
  onExit: () => void;
};

type Overlay = { index: number; revealed: boolean } | null;

export function Game({ game, settings, categories, onChange, onNewRound, onExit }: Props) {
  const s = t(settings.language);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [showImposter, setShowImposter] = useState(false);

  const allTaken = game.cards.every((c) => c === "taken");
  const categoryName =
    categories.find((c) => c.id === game.categoryId)?.name[settings.language] ?? "";

  const open = (index: number) => {
    if (game.cards[index] === "taken") return;
    setOverlay({ index, revealed: false });
  };

  const hideAndPass = () => {
    if (!overlay) return;
    const cards = game.cards.slice();
    cards[overlay.index] = "taken";
    onChange({ ...game, cards });
    setOverlay(null);
  };

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-4 pb-10 pt-6 sm:max-w-2xl sm:px-6">
      <header className="flex items-center justify-between animate-slide-up">
        <button
          type="button"
          onClick={onExit}
          className="min-h-11 font-mono text-sm text-muted underline-offset-4 hover:underline"
        >
          ← {s.backToSetup}
        </button>
        <h1 className="font-display text-2xl text-fg">
          IMPOSTER
        </h1>
      </header>

      {!allTaken && (
        <p className="animate-slide-up border-l-4 border-yellow bg-bg-2/80 px-3 py-2 font-mono text-sm text-fg">
          {s.pass}
        </p>
      )}

      {/* End of round */}
      {allTaken && (
        <section className="animate-pop relative hard-shadow-ink">
          <Sticker color="lime" tilt={-2} className="absolute -top-2 left-3 z-10">
            {s.allRevealed}
          </Sticker>
          <div className="cut-corners border-2 border-fg/15 bg-bg-2/90 p-4 pt-6">
          {showImposter ? (
            <div className="space-y-2 font-mono text-sm">
              <p>
                <span className="font-display text-xl text-pink">
                  {s.player} {game.imposterIndex + 1}
                </span>{" "}
                {s.wasImposter}.
              </p>
              <p className="text-muted">
                {s.theWordWas}{" "}
                <span className="font-display text-lg text-yellow">{game.word}</span>
                <span className="ml-2 text-[11px] uppercase opacity-60">[{categoryName}]</span>
              </p>
            </div>
          ) : (
            <Button variant="yellow" className="w-full" onClick={() => setShowImposter(true)}>
              👁 {s.showImposter}
            </Button>
          )}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button variant="cyan" onClick={() => { setShowImposter(false); onNewRound(); }}>
              ↻ {s.newRound}
            </Button>
            <Button variant="ghost" onClick={onExit}>
              {s.backToSetup}
            </Button>
          </div>
          </div>
        </section>
      )}

      {/* Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {game.cards.map((state, i) => (
          <Card
            key={i}
            index={i}
            state={state}
            tilt={game.tilts[i] ?? 0}
            label={`${s.player} ${i + 1}`}
            takenLabel={s.taken}
            onClick={() => open(i)}
            highlight={showImposter && i === game.imposterIndex}
          />
        ))}
      </div>

      {/* Reveal overlay */}
      {overlay && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-bg/95 px-6 backdrop-blur-sm"
        >
          <div className="animate-pop w-full max-w-sm hard-shadow-pink">
          <div className="border-2 border-fg/20 bg-bg-2 p-6 text-center cut-corners">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              {s.player} {overlay.index + 1}
            </p>

            {!overlay.revealed ? (
              <>
                <p className="mt-4 font-display text-2xl leading-tight text-fg">{s.revealWarn}</p>
                <Button
                  size="lg"
                  variant="cyan"
                  className="mt-8 w-full"
                  onClick={() => setOverlay({ ...overlay, revealed: true })}
                >
                  {s.reveal}
                </Button>
              </>
            ) : overlay.index === game.imposterIndex ? (
              <>
                <p className="mt-4 font-mono text-sm text-muted">{s.youAre}</p>
                <p
                  className="glitch mt-1 font-display text-5xl text-pink"
                  data-text={s.imposter}
                >
                  {s.imposter}
                </p>
                <p className="mt-3 font-mono text-sm text-fg">{s.blendIn}</p>
                {settings.hint && (
                  <div className="mt-5 inline-block stripes p-[3px]">
                    <div className="bg-bg px-4 py-2">
                      <span className="font-mono text-[11px] uppercase tracking-widest text-yellow">
                        {s.hintLabel}:
                      </span>{" "}
                      <span className="font-display text-xl text-yellow">{game.hint}</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="mt-4 font-mono text-sm text-muted">{s.yourWord}</p>
                <p className="mt-1 break-words font-display text-4xl text-cyan sm:text-5xl">
                  {game.word}
                </p>
              </>
            )}

            {overlay.revealed && (
              <Button size="lg" className="mt-8 w-full" onClick={hideAndPass}>
                🙈 {s.hide}
              </Button>
            )}
          </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ---------- card ---------- */

function Card({
  index,
  state,
  tilt,
  label,
  takenLabel,
  highlight,
  onClick,
}: {
  index: number;
  state: "hidden" | "taken";
  tilt: number;
  label: string;
  takenLabel: string;
  highlight: boolean;
  onClick: () => void;
}) {
  const taken = state === "taken";
  const shadow = highlight ? "hard-shadow-yellow" : taken ? "" : "hard-shadow-cyan";
  return (
    <div
      style={{ "--tilt": `${tilt}deg`, animationDelay: `${(index % 5) * -1.3}s` } as React.CSSProperties}
      className={`press animate-float ${shadow}`}
    >
      <button
        type="button"
        onClick={onClick}
        disabled={taken && !highlight}
        className={[
          "relative aspect-[4/5] w-full cut-corners text-left",
          "transition-transform duration-150 active:scale-95",
          highlight
            ? "bg-pink text-ink"
            : taken
              ? "bg-bg-2 text-muted border-2 border-fg/10 opacity-60"
              : "bg-gradient-to-br from-bg-2 to-bg border-2 border-cyan/60 text-fg",
        ].join(" ")}
      >
        <span className="absolute left-3 top-2 font-mono text-[11px] uppercase tracking-widest opacity-80">
          {label}
        </span>
        <span className="absolute inset-0 flex items-center justify-center font-display text-6xl">
          {highlight ? "!" : taken ? "✓" : "?"}
        </span>
        <span className="absolute bottom-2 right-3 font-mono text-3xl font-bold opacity-30">
          {String(index + 1).padStart(2, "0")}
        </span>
        {taken && !highlight && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] border-2 border-muted px-2 font-display text-sm uppercase text-muted">
            {takenLabel}
          </span>
        )}
      </button>
    </div>
  );
}
