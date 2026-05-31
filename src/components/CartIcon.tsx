import { useEffect, useState } from 'react';
import { getTestId } from '../utils/testId';

function readCartCountFromStorage(): number {
  if (typeof window === 'undefined') return 0;

  try {
    const raw = localStorage.getItem('cart');
    if (!raw) return 0;

    const parsed = JSON.parse(raw) as Array<{ quantity?: number }>;
    if (!Array.isArray(parsed)) return 0;

    return parsed.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
  } catch {
    return 0;
  }
}

export default function CartIcon() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const syncCount = () => setCount(readCartCountFromStorage());

    syncCount();

    window.addEventListener('storage', syncCount);
    window.addEventListener('cart:updated', syncCount);

    return () => {
      window.removeEventListener('storage', syncCount);
      window.removeEventListener('cart:updated', syncCount);
    };
  }, []);

  return (
    <a
      href="/cart"
      data-testid={getTestId('nav-cart')}
      aria-label="Cart"
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
