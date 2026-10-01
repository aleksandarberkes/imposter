"use client";

import { useMemo } from "react";
import { Game } from "./Game";
import { Setup } from "./Setup";
import { createGame, flattenTopics, topicPool } from "@/games/bomb/lib/game";
import {
  DEFAULT_SETTINGS,
  type Category,
  type Game as GameState,
  type Settings,
} from "@/games/bomb/lib/types";
import { useLanguage } from "@/lib/language";
import { useLocalStorage } from "@/lib/storage";

type Props = { categories: Category[] };

/**
 * Client root. All user-entered state lives in localStorage:
 *  - bomb:settings  → the setup form
 *  - bomb:game      → the game in progress (survives refresh)
 *  - app:language   → UI language, shared with the menu and other games
 */
export function BombApp({ categories }: Props) {
  const [settings, setSettings, settingsLoaded] = useLocalStorage<Settings>(
    "bomb:settings",
    DEFAULT_SETTINGS,
  );
  const [game, setGame, gameLoaded] = useLocalStorage<GameState | null>("bomb:game", null);
  const [language, setLanguage, languageLoaded] = useLanguage();
  const topics = useMemo(() => flattenTopics(categories), [categories]);
  const pool = useMemo(() => topicPool(topics, settings.categories), [topics, settings.categories]);

  // Avoid a flash of the setup screen when a game is in progress.
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
        topics={topics}
        pool={pool}
        onChange={setGame}
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
      onStart={() => setGame(createGame(settings, pool))}
    />
  );
}
