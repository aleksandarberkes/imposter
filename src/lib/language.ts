"use client";

import { useEffect } from "react";
import { useLocalStorage } from "./storage";

export type Language = "en" | "sr";

const KEY = "app:language";

/**
 * UI language, shared by the main menu and every game.
 * Stored in localStorage under `app:language`.
 */
export function useLanguage() {
  // One-time migration: language used to live inside imposter:settings.
  // Declared before useLocalStorage so it runs before the first read.
  useEffect(() => {
    try {
      if (window.localStorage.getItem(KEY) !== null) return;
      const legacy = JSON.parse(window.localStorage.getItem("imposter:settings") ?? "null");
      if (legacy?.language === "en" || legacy?.language === "sr") {
        window.localStorage.setItem(KEY, JSON.stringify(legacy.language));
      }
    } catch {
      // ignore corrupt or unavailable storage
    }
  }, []);

  return useLocalStorage<Language>(KEY, "en");
}
