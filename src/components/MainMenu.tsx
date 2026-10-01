"use client";

import Link from "next/link";
import { LanguageSwitch } from "./LanguageSwitch";
import { Panel } from "./Panel";
import { Sticker } from "./Sticker";
import { games } from "@/games";
import { tCommon } from "@/lib/i18n";
import { useLanguage } from "@/lib/language";

const accents = {
  pink: { border: "border-pink/70", text: "text-pink", bg: "bg-pink", shadow: "hard-shadow-pink" },
  cyan: { border: "border-cyan/70", text: "text-cyan", bg: "bg-cyan", shadow: "hard-shadow-cyan" },
  yellow: { border: "border-yellow/70", text: "text-yellow", bg: "bg-yellow", shadow: "hard-shadow-yellow" },
  lime: { border: "border-lime/70", text: "text-lime", bg: "bg-lime", shadow: "hard-shadow-lime" },
};

/** Landing screen: pick which game to play. */
export function MainMenu() {
  const [language, setLanguage, loaded] = useLanguage();
  const s = tCommon(language);

  // Avoid a flash of the default language.
  if (!loaded) {
    return <div className="flex flex-1 items-center justify-center font-mono text-sm text-muted">…</div>;
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 pb-10 pt-8 sm:max-w-lg sm:px-6">
      <header className="relative animate-slide-up">
        <Sticker color="cyan" tilt={-6} className="absolute -top-3 left-0">
          {games.length} {s.games}
        </Sticker>
        <h1
          className="glitch font-display text-[40px] leading-none text-fg sm:text-6xl"
          data-text={s.menuTitle}
        >
          {s.menuTitle}
        </h1>
        <p className="mt-2 font-mono text-sm text-pink">&gt; {s.menuTagline}_</p>
      </header>

      <ul className="flex flex-col gap-6">
        {games.map((g, i) => {
          const a = accents[g.color];
          return (
            <li
              key={g.id}
              style={{ "--tilt": `${i % 2 === 0 ? -1 : 1}deg`, animationDelay: `${i * -2.1}s` } as React.CSSProperties}
              className={`press relative animate-float ${a.shadow}`}
            >
              <Link
                href={g.href}
                className={`cut-corners flex min-h-32 items-center gap-4 border-2 bg-gradient-to-br from-bg-2 to-bg p-4 pt-6 transition-transform duration-150 active:scale-[0.98] ${a.border}`}
              >
                <span className="text-6xl" aria-hidden>
                  {g.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block font-display text-3xl leading-none ${a.text}`}>
                    {g.name[language]}
                  </span>
                  <span className="mt-2 block font-mono text-xs text-muted">
                    {g.tagline[language]}
                  </span>
                </span>
                <span className={`cut-corners-sm shrink-0 px-3 py-2 font-display text-sm text-ink ${a.bg}`}>
                  {s.play} ›
                </span>
              </Link>
              <Sticker color={g.color} tilt={-2} className="absolute -top-2 left-3">
                {g.minPlayers}–{g.maxPlayers} {s.players}
              </Sticker>
            </li>
          );
        })}
      </ul>

      <Panel label={s.language} tilt={0.6} color="cyan">
        <LanguageSwitch value={language} onChange={setLanguage} />
      </Panel>

      <p className="text-center font-mono text-[11px] text-muted">{s.saved}</p>
    </main>
  );
}
