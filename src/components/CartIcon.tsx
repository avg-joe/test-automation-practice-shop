import { useStore } from '@nanostores/react';
import { cartCount } from '../stores/cart';
import { getTestId } from '../utils/testId';

export default function CartIcon() {
  const count = useStore(cartCount);

  return (
    <a
      href="/cart"
      data-testid={getTestId('nav-cart')}
      aria-label="Cart"
      className="cart-icon"
    >
      🛒
      {count > 0 && (
        <span
          data-testid={getTestId('cart-count')}
          className="cart-icon__badge"
        >
          {count}
        </span>
      )}
    </a>
  );
}
