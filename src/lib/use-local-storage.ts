import { useCallback, useMemo, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function readRaw(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * localStorage-backed state that is safe for SSR: the server (and the first
 * client render) use `initial`, then the stored value takes over.
 * `initial` must be a stable reference (declare it at module level).
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null,
  );

  const value = useMemo(() => {
    if (raw === null) return initial;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  }, [raw, initial]);

  const setValue = useCallback(
    (update: T | ((prev: T) => T)) => {
      let prev = initial;
      try {
        const current = readRaw(key);
        if (current !== null) prev = JSON.parse(current) as T;
      } catch {}
      const next =
        typeof update === "function" ? (update as (prev: T) => T)(prev) : update;
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {}
      listeners.forEach((listener) => listener());
    },
    [key, initial],
  );

  return [value, setValue] as const;
}
