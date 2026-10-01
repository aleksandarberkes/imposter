"use client";

import { Game } from "./Game";
import { Setup } from "./Setup";
import { createGame } from "@/games/imposter/lib/game";
import {
  DEFAULT_SETTINGS,
  type Category,
  type Game as GameState,
  type Settings,
} from "@/games/imposter/lib/types";
import { useLanguage } from "@/lib/language";
import { useLocalStorage } from "@/lib/storage";

type Props = { categories: Category[] };

/**
 * Client root. All user-entered state lives in localStorage:
 *  - imposter:settings  → the setup form
 *  - imposter:game      → the round in progress (survives refresh)
 *  - app:language       → UI language, shared with the menu and other games
 */
export function ImposterApp({ categories }: Props) {
  const [settings, setSettings, settingsLoaded] = useLocalStorage<Settings>(
    "imposter:settings",
    DEFAULT_SETTINGS,
  );
  const [game, setGame, gameLoaded] = useLocalStorage<GameState | null>("imposter:game", null);
  const [language, setLanguage, languageLoaded] = useLanguage();

  // Avoid a flash of the setup screen when a round is in progress.
  if (!settingsLoaded || !gameLoaded || !languageLoaded) {
    return <div className="flex flex-1 items-center justify-center font-mono text-sm text-muted">…</div>;
  }

  if (game) {
    return (
      <Game
        game={game}
        settings={settings}
        language={language}
        categories={categories}
        onChange={setGame}
        onNewRound={() => setGame(createGame(settings, language, categories))}
        onExit={() => setGame(null)}
      />
    );
  }

  return (
    <Setup
      settings={settings}
      language={language}
      categories={categories}
      onChange={setSettings}
      onLanguageChange={setLanguage}
      onStart={() => setGame(createGame(settings, language, categories))}
    />
  );
}
