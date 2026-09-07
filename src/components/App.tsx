"use client";

import { Game } from "./Game";
import { Setup } from "./Setup";
import { createGame } from "@/lib/game";
import { useLocalStorage } from "@/lib/storage";
import { DEFAULT_SETTINGS, type Category, type Game as GameState, type Settings } from "@/lib/types";

type Props = { categories: Category[] };

/**
 * Client root. All user-entered state lives in localStorage:
 *  - imposter:settings  → the setup form
 *  - imposter:game      → the round in progress (survives refresh)
 */
export function App({ categories }: Props) {
  const [settings, setSettings, settingsLoaded] = useLocalStorage<Settings>(
    "imposter:settings",
    DEFAULT_SETTINGS,
  );
  const [game, setGame, gameLoaded] = useLocalStorage<GameState | null>("imposter:game", null);

  // Avoid a flash of the setup screen when a round is in progress.
  if (!settingsLoaded || !gameLoaded) {
    return <div className="flex flex-1 items-center justify-center font-mono text-sm text-muted">…</div>;
  }

  if (game) {
    return (
      <Game
        game={game}
        settings={settings}
        categories={categories}
        onChange={setGame}
        onNewRound={() => setGame(createGame(settings, categories))}
        onExit={() => setGame(null)}
      />
    );
  }

  return (
    <Setup
      settings={settings}
      categories={categories}
      onChange={setSettings}
      onStart={() => setGame(createGame(settings, categories))}
    />
  );
}
