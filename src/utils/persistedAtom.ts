import { atom } from 'nanostores';
import type { WritableAtom } from 'nanostores';

function canUseLocalStorage(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__persistedAtom_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const hasLocalStorage = canUseLocalStorage();

export function persistedAtom<T>(
  key: string,
  initial: T,
  validate?: (value: T) => T,
): WritableAtom<T> {
  let stored = initial;
  if (hasLocalStorage) {
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

  if (hasLocalStorage) {
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
