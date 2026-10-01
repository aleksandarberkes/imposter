"use client";

import { useEffect } from "react";
import { Button } from "@/components/Button";
import { Sticker } from "@/components/Sticker";
import { arm, blame, explode, nextRound, skipPrompt } from "@/games/bomb/lib/game";
import { t } from "@/games/bomb/lib/i18n";
import { playBoom, playTick, unlockAudio } from "@/games/bomb/lib/sound";
import type { Category, Game as GameState, Settings, Topic } from "@/games/bomb/lib/types";
import type { Language } from "@/lib/language";

type Props = {
  game: GameState;
  settings: Settings;
  language: Language;
  categories: Category[];
  /** Every prompt as one flat list; game.promptIndex points into it. */
  topics: Topic[];
  /** Indexes of the topics allowed by the chosen categories. */
  pool: number[];
  onChange: (next: GameState) => void;
  onExit: () => void;
};

export function Game({
  game,
  settings,
  language,
  categories,
  topics,
  pool,
  onChange,
  onExit,
}: Props) {
  const s = t(language);
  const topic = topics[game.promptIndex];
  const prompt = topic?.[language] ?? "";
  const category = categories.find((c) => c.id === topic?.categoryId);
  const ticking = game.phase === "ticking";

  // Run the hidden fuse. explodesAt is absolute, so a refresh keeps the timer.
  useEffect(() => {
    if (game.phase !== "ticking" || game.explodesAt === null) return;
    const fuse = window.setTimeout(
      () => {
        if (settings.sound) playBoom();
        navigator.vibrate?.([300, 80, 500]);
        onChange(explode(game));
      },
      Math.max(0, game.explodesAt - Date.now()),
    );
    const tick = window.setInterval(() => {
      if (settings.sound) playTick();
    }, 1000);
    // Keep the screen awake while the bomb is being passed around.
    let wakeLock: WakeLockSentinel | null = null;
    let cancelled = false;
    navigator.wakeLock
      ?.request("screen")
      .then((lock) => {
        if (cancelled) void lock.release();
        else wakeLock = lock;
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      window.clearTimeout(fuse);
      window.clearInterval(tick);
      void wakeLock?.release();
    };
  }, [game, settings.sound, onChange]);

  const armBomb = () => {
    if (settings.sound) unlockAudio();
    onChange(arm(game, settings));
  };

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-4 pb-10 pt-6 sm:max-w-2xl sm:px-6">
      <header className="flex items-center justify-between animate-slide-up">
        <button
          type="button"
          onClick={onExit}
          className="min-h-11 font-mono text-sm text-muted underline-offset-4 hover:underline active:underline"
        >
          ← {s.backToSetup}
        </button>
        <h1 className="font-display text-2xl text-fg">{s.title}</h1>
      </header>

      {/* Ready: show the topic, wait for someone to arm the bomb */}
      {game.phase === "ready" && (
        <>
          <p className="animate-slide-up border-l-4 border-yellow bg-bg-2/80 px-3 py-2 font-mono text-sm text-fg">
            {s.howTo}
          </p>
          <section className="animate-pop relative mt-2 hard-shadow-cyan">
            <Sticker color="cyan" tilt={-2} className="absolute -top-2 left-3 z-10">
              {s.round} {game.round} · {category ? `${category.icon} ${category.name[language]}` : s.name}
            </Sticker>
            <div className="cut-corners border-2 border-fg/15 bg-bg-2/90 p-5 pt-8 text-center">
              <p className="break-words font-display text-3xl leading-tight text-cyan sm:text-4xl">
                {prompt}
              </p>
              <button
                type="button"
                onClick={() => onChange(skipPrompt(game, pool))}
                className="mt-3 min-h-11 px-2 font-mono text-[11px] uppercase tracking-widest text-muted underline-offset-4 active:underline"
              >
                ↻ {s.skip}
              </button>
            </div>
          </section>
          <Button size="lg" variant="yellow" className="mt-2 w-full" onClick={armBomb}>
            💣 {s.arm}
          </Button>
        </>
      )}

      {/* Ticking: nothing to tap, just the topic and the bomb */}
      {ticking && (
        <section className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div className="stripes p-[3px]">
            <p className="bg-bg px-4 py-2 font-mono text-xs uppercase tracking-widest text-yellow">
              {s.name}
            </p>
          </div>
          <p className="break-words font-display text-4xl leading-tight text-cyan sm:text-5xl">
            {prompt}
          </p>
          <div className="animate-tick text-[120px] leading-none" aria-hidden>
            💣
          </div>
          <p className="animate-flicker font-display text-xl text-pink">{s.ticking}</p>
        </section>
      )}

      {/* Exploded */}
      {game.phase === "exploded" && (
        <>
          <div className="animate-shake text-center">
            <p className="glitch font-display text-6xl text-pink sm:text-7xl" data-text={s.boom}>
              {s.boom}
            </p>
          </div>

          {game.loser === null ? (
            <>
              <p className="animate-slide-up border-l-4 border-yellow bg-bg-2/80 px-3 py-2 font-mono text-sm text-fg">
                {s.whoHeld}
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {game.strikes.map((_, i) => (
                  <Button key={i} variant="ghost" size="lg" onClick={() => onChange(blame(game, i))}>
                    {s.player} {i + 1}
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <section className="animate-pop relative hard-shadow-ink">
              <Sticker color="lime" tilt={-2} className="absolute -top-2 left-3 z-10">
                {s.scores}
              </Sticker>
              <div className="cut-corners border-2 border-fg/15 bg-bg-2/90 p-4 pt-6">
                <p className="font-mono text-sm">
                  <span className="font-display text-xl text-pink">
                    {s.player} {game.loser + 1}
                  </span>{" "}
                  {s.blewUp}.
                </p>
                <ul className="mt-4 space-y-1">
                  {game.strikes.map((n, i) => (
                    <li
                      key={i}
                      className={`flex min-h-9 items-center justify-between px-2 font-mono text-sm ${
                        i === game.loser ? "bg-pink/15 text-fg" : "text-muted"
                      }`}
                    >
                      <span className="uppercase tracking-wide">
                        {s.player} {i + 1}
                      </span>
                      <span className="font-display text-lg tabular-nums text-yellow">
                        💥 {n}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button variant="cyan" onClick={() => onChange(nextRound(game, pool))}>
                    ↻ {s.nextRound}
                  </Button>
                  <Button variant="ghost" onClick={onExit}>
                    {s.backToSetup}
                  </Button>
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
