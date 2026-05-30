import { atom } from 'nanostores';
import type { WritableAtom } from 'nanostores';

export function persistedAtom<T>(key: string, initial: T): WritableAtom<T> {
  let stored = initial;
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        stored = JSON.parse(raw) as T;
      }
    } catch {
      // ignore parse errors, fall back to initial
    }
  }

  const store = atom<T>(stored);

  if (typeof localStorage !== 'undefined') {
    store.subscribe((value) => {
      if (value === null || value === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    });
  }

  return store;
}
