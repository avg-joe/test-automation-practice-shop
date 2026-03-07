import { useState } from 'react';
import { addToCart } from '../stores/cart';
import { getTestId } from '../utils/testId';

interface AddToCartProps {
  productId: string;
  productName: string;
  price: number;
  emoji: string;
  testIdSuffix: string;
}

export default function AddToCart({
  productId,
  productName,
  price,
  emoji,
  testIdSuffix,
}: AddToCartProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);

    try {
      await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId, name: productName, price, emoji }),
      });

      addToCart({ id: productId, name: productName, price, emoji });
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      console.error('[AddToCart] Failed to add item to cart:', err);
      // Optionally surface a brief error to the user in a real app
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      data-testid={getTestId(`add-to-cart-${testIdSuffix}`)}
      onClick={handleAddToCart}
      disabled={isLoading}
      style={{
        padding: '0.45rem 1rem',
        background: added ? '#16a34a' : '#1a1a2e',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '0.82rem',
        fontWeight: 600,
        cursor: isLoading ? 'not-allowed' : 'pointer',
        transition: 'background 0.2s',
        minWidth: '90px',
      }}
    >
      {isLoading ? '…' : added ? '✓ Added!' : 'Add to Cart'}
    </button>
  );
}
