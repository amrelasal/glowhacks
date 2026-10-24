"use client";

import { useEffect, useState } from "react";

/**
 * Tiny localStorage hook. Reads after mount (avoids SSR/hydration mismatch)
 * and exposes `loaded` so components can render a skeleton until ready.
 * Everything stays in the visitor's browser.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        const isObj = (v: unknown) => typeof v === "object" && v !== null && !Array.isArray(v);
        setValue(isObj(initial) && isObj(parsed) ? ({ ...initial, ...parsed } as T) : (parsed as T));
      }
    } catch {
      /* ignore corrupted or blocked storage */
    }
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or blocked */
    }
  }, [key, value, loaded]);

  return [value, setValue, loaded] as const;
}
