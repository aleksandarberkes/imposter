"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useState persisted to localStorage. SSR-safe: renders `initial` on the
 * server and first client paint, then loads the stored value.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);
  const initialRef = useRef(initial);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        const base = initialRef.current;
        const bothObjects =
          parsed && typeof parsed === "object" && !Array.isArray(parsed) &&
          base && typeof base === "object" && !Array.isArray(base);
        setValue(bothObjects ? { ...base, ...parsed } : parsed);
      }
    } catch {
      // ignore corrupt or unavailable storage
    }
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      if (value === null || value === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {
      // storage full or blocked; keep working in memory
    }
  }, [key, value, loaded]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => setValue(next),
    [],
  );

  return [value, update, loaded] as const;
}
