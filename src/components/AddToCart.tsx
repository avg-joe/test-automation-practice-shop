import { useState } from 'react';
import { apiAddToCart } from '../api/cart';
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

    const result = await apiAddToCart({ id: productId, name: productName, price, emoji });

    if (result.ok) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }

    setIsLoading(false);
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
