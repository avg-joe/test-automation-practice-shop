import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { cartCount, cartItems, type CartItem } from '../stores/cart';
import { getTestId } from '../utils/testId';

function readCartItemsFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem('cart');
    if (!raw) return [];

    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];

    return parsed;
  } catch {
    return [];
  }
}

export default function CartIcon() {
  const count = useStore(cartCount);

  useEffect(() => {
    const syncFromStorage = () => {
      cartItems.set(readCartItemsFromStorage());
    };

    syncFromStorage();

    window.addEventListener('storage', syncFromStorage);
    window.addEventListener('cart:updated', syncFromStorage);

    return () => {
      window.removeEventListener('storage', syncFromStorage);
      window.removeEventListener('cart:updated', syncFromStorage);
    };
  }, []);

  return (
    <a
      href="/cart"
      data-testid={getTestId('nav-cart')}
      aria-label={count > 0 ? `Cart (${count} items)` : 'Cart'}
      className="cart-icon"
    >
      🛒
      <span
        data-testid={getTestId('cart-count')}
        className="cart-icon__badge"
        hidden={count < 1}
        suppressHydrationWarning
      >
        {count}
      </span>
    </a>
  );
}
