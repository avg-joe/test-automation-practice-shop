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
      style={{
        position: 'relative',
        textDecoration: 'none',
        fontSize: '1.3rem',
        color: '#1a1a2e',
      }}
    >
      🛒
      <span
        data-testid={getTestId('cart-count')}
        style={{
          position: 'absolute',
          top: '-6px',
          right: '-8px',
          background: '#e94560',
          color: '#fff',
          fontSize: '0.65rem',
          borderRadius: '50%',
          width: '18px',
          height: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
        }}
      >
        {count}
      </span>
    </a>
  );
}
