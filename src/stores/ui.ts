import { atom } from 'nanostores';

export const isLoginOpen = atom(false);

export function openLogin(): void {
  isLoginOpen.set(true);
}

export function closeLogin(): void {
  isLoginOpen.set(false);
}
