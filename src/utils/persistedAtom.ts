import { atom } from 'nanostores';
import type { WritableAtom } from 'nanostores';

export function persistedAtom<T>(
  key: string,
  initial: T,
  validate?: (value: T) => T,
): WritableAtom<T> {
  let stored = initial;
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        const parsed = JSON.parse(raw) as T;
        stored = validate ? validate(parsed) : parsed;
      }
    } catch {
      // ignore parse errors, fall back to initial
    }
  }

  const store = atom<T>(stored);

  if (typeof localStorage !== 'undefined') {
    // Use listen() instead of subscribe() to avoid writing back the value
    // we just loaded from localStorage on the initial subscription call.
    store.listen((value) => {
      if (value === null || value === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    });
  }

  return store;
}
