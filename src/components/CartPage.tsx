import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { cartItems, appliedCoupon, updateQuantity, removeFromCart, clearCart } from '../stores/cart';
import type { CouponInfo } from '../stores/cart';
import { getTestId } from '../utils/testId';

const RECOMMENDED_PRODUCTS = [
  { id: 'rec-1', emoji: '🎮', name: 'GamePad Pro', price: 59 },
  { id: 'rec-2', emoji: '📱', name: 'Phone Case', price: 19 },
  { id: 'rec-3', emoji: '🔋', name: 'Power Bank', price: 45 },
  { id: 'rec-4', emoji: '🎵', name: 'BT Speaker', price: 79 },
];

const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 4.99;
const TAX_RATE = 0.08;

export default function CartPage() {
  const items = useStore(cartItems);
  const coupon = useStore(appliedCoupon);

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const subtotal = items.reduce((t, i) => t + i.price * i.quantity, 0);
  const discountAmount = coupon ? (subtotal * coupon.discountPercent) / 100 : 0;
  const afterDiscount = subtotal - discountAmount;
  const shippingFree = subtotal >= SHIPPING_THRESHOLD || (coupon?.freeShipping ?? false);
  const shippingCost = shippingFree ? 0 : SHIPPING_COST;
  const tax = (afterDiscount + shippingCost) * TAX_RATE;
  const total = afterDiscount + shippingCost + tax;

  async function handleUpdateQty(id: string, qty: number) {
    if (qty < 1) return;
    setUpdatingId(id);
    try {
      const res = await fetch('/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, quantity: qty }),
      });
      if (!res.ok) throw new Error('Update failed');
      updateQuantity(id, qty);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleRemove(id: string) {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Remove failed');
      removeFromCart(id);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleClearCart() {
    try {
      const res = await fetch('/api/cart/clear', { method: 'POST' });
      if (!res.ok) throw new Error('Clear failed');
      clearCart();
    } catch {
      // best-effort
    }
  }

  async function handleApplyCoupon() {
    const trimmed = couponCode.trim();
    if (!trimmed) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await fetch('/api/coupon/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed }),
      });
      const data = await res.json() as {
        success: boolean;
        message?: string;
        code?: string;
        discountPercent?: number;
        freeShipping?: boolean;
      };
      if (!res.ok || !data.success) {
        setCouponError(data.message ?? 'Invalid coupon code');
        appliedCoupon.set(null);
      } else {
        const info: CouponInfo = {
          code: data.code!,
          discountPercent: data.discountPercent ?? 0,
          freeShipping: data.freeShipping ?? false,
        };
        appliedCoupon.set(info);
        setCouponCode('');
        setCouponError('');
      }
    } catch {
      setCouponError('Failed to apply coupon. Please try again.');
    } finally {
      setCouponLoading(false);
    }
  }

  async function handleAddRecommended(product: { id: string; emoji: string; name: string; price: number }) {
    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, name: product.name, price: product.price, emoji: product.emoji }),
      });
      if (!res.ok) throw new Error('Add failed');
      const { addToCart } = await import('../stores/cart');
      addToCart({ id: product.id, name: product.name, price: product.price, emoji: product.emoji });
    } catch {
      // best-effort
    }
  }

  if (items.length === 0) {
    return (
      <div className="cart-layout">
        <div className="cart-empty" data-testid={getTestId('cart-empty')}>
          <div className="cart-empty__icon">🛒</div>
          <h2 className="cart-empty__title">Your cart is empty</h2>
          <p className="cart-empty__subtitle">Looks like you haven't added anything yet.</p>
          <a href="/" className="cart-empty__btn" data-testid={getTestId('cart-empty-shop-btn')}>
            Start Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      {/* Left column */}
      <div>
        {/* Cart Items */}
        <div className="cart-section" data-testid={getTestId('cart-items')}>
          <div className="cart-section__header">
            <h2 className="cart-section__title" data-testid={getTestId('cart-item-count')}>
              {items.length} {items.length === 1 ? 'Item' : 'Items'} in Cart
            </h2>
            <button
              className="cart-section__clear-btn"
              data-testid={getTestId('clear-cart-btn')}
              onClick={handleClearCart}
            >
              Clear Cart
            </button>
          </div>

          {items.map((item, idx) => {
            const itemNum = idx + 1;
            const isUpdating = updatingId === item.id;
            return (
              <div className="cart-item" key={item.id} data-testid={getTestId(`cart-item-${itemNum}`)}>
                <div className="cart-item__image">{item.emoji}</div>
                <div>
                  <h3 className="cart-item__name" data-testid={getTestId(`item-name-${itemNum}`)}>
                    {item.name}
                  </h3>
                  <p className="cart-item__meta">Unit price: ${item.price.toFixed(2)}</p>
                  <div className="cart-item__qty">
                    <button
                      className="cart-item__qty-btn"
                      aria-label="Decrease quantity"
                      data-testid={getTestId(`qty-decrease-${itemNum}`)}
                      disabled={item.quantity <= 1 || isUpdating}
                      onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      className="cart-item__qty-input"
                      value={item.quantity}
                      min={1}
                      max={99}
                      aria-label="Quantity"
                      data-testid={getTestId(`qty-input-${itemNum}`)}
                      readOnly
                    />
                    <button
                      className="cart-item__qty-btn"
                      aria-label="Increase quantity"
                      data-testid={getTestId(`qty-increase-${itemNum}`)}
                      disabled={isUpdating}
                      onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-item__price-col">
                  <span className="cart-item__price" data-testid={getTestId(`item-price-${itemNum}`)}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    className="cart-item__remove"
                    data-testid={getTestId(`remove-item-${itemNum}`)}
                    onClick={() => handleRemove(item.id)}
                    disabled={isUpdating}
                  >
                    ✕ Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Coupon */}
        <div className="coupon-section" data-testid={getTestId('coupon-section')}>
          <h3 className="coupon-section__title">Have a Coupon?</h3>
          <div className="coupon-section__row">
            <input
              type="text"
              className="coupon-section__input"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              data-testid={getTestId('coupon-input')}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
            />
            <button
              className="coupon-section__apply-btn"
              data-testid={getTestId('apply-coupon-btn')}
              onClick={handleApplyCoupon}
              disabled={couponLoading || !couponCode.trim()}
            >
              {couponLoading ? 'Applying…' : 'Apply'}
            </button>
          </div>
          {coupon && (
            <p className="coupon-section__success" data-testid={getTestId('coupon-success')}>
              ✅ Coupon <strong>{coupon.code}</strong> applied —{' '}
              {coupon.freeShipping
                ? 'Free shipping on your order!'
                : `${coupon.discountPercent}% off your order!`}
            </p>
          )}
          {couponError && (
            <p className="coupon-section__error" data-testid={getTestId('coupon-error')}>
              {couponError}
            </p>
          )}
        </div>

        {/* Recommended */}
        <div className="recommended" data-testid={getTestId('recommended-section')}>
          <h3 className="recommended__title">You Might Also Like</h3>
          <div className="recommended__grid">
            {RECOMMENDED_PRODUCTS.map((p, i) => (
              <div className="recommended__card" key={p.id} data-testid={getTestId(`rec-product-${i + 1}`)}>
                <div className="recommended__card-img">{p.emoji}</div>
                <div className="recommended__card-name">{p.name}</div>
                <div className="recommended__card-price">${p.price}</div>
                <button
                  className="recommended__card-btn"
                  data-testid={getTestId(`rec-add-${i + 1}`)}
                  onClick={() => handleAddRecommended(p)}
                >
                  + Add
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right column: Order Summary */}
      <div data-testid={getTestId('order-summary')}>
        <div className="cart-summary__card">
          <h2 className="cart-summary__title">Order Summary</h2>

          <div className="cart-summary__row" data-testid={getTestId('summary-subtotal')}>
            <span className="cart-summary__row-label">
              Subtotal ({items.reduce((t, i) => t + i.quantity, 0)} items)
            </span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="cart-summary__row cart-summary__row--discount" data-testid={getTestId('summary-discount')}>
              <span className="cart-summary__row-label">Discount ({coupon!.discountPercent}%)</span>
              <span className="cart-summary__row-value">−${discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div
            className={`cart-summary__row${shippingFree ? ' cart-summary__row--free' : ''}`}
            data-testid={getTestId('summary-shipping')}
          >
            <span className="cart-summary__row-label">Shipping</span>
            <span className="cart-summary__row-value">
              {shippingFree ? 'Free 🎉' : `$${shippingCost.toFixed(2)}`}
            </span>
          </div>

          <div className="cart-summary__row" data-testid={getTestId('summary-tax')}>
            <span className="cart-summary__row-label">Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div className="cart-summary__row cart-summary__row--total" data-testid={getTestId('summary-total')}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <a
            href="/shipping"
            className="cart-summary__checkout-btn"
            data-testid={getTestId('checkout-btn')}
          >
            Proceed to Checkout →
          </a>

          <a
            href="/"
            className="cart-summary__continue-btn"
            data-testid={getTestId('continue-shopping-btn')}
          >
            ← Continue Shopping
          </a>

          <div className="cart-summary__secure">
            <span className="cart-summary__secure-item">🔒 Secure</span>
            <span className="cart-summary__secure-item">💳 Visa/MC</span>
            <span className="cart-summary__secure-item">🛡️ Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
