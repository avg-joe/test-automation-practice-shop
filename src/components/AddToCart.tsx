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
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId, name: productName, price, emoji }),
      });

      if (!res.ok) {
        throw new Error(
          `[AddToCart] Failed to add item to cart: ${res.status} ${res.statusText}`,
        );
      }
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

  const buttonClasses = [
    'add-to-cart-btn',
    isLoading && 'add-to-cart-btn--loading',
    added && 'add-to-cart-btn--added',
  ].filter(Boolean).join(' ');

  return (
    <button
      data-testid={getTestId(`add-to-cart-${testIdSuffix}`)}
      onClick={handleAddToCart}
      disabled={isLoading}
      className={buttonClasses}
    >
      {isLoading ? '…' : added ? '✓ Added!' : 'Add to Cart'}
    </button>
  );
}
