import { computed } from 'nanostores';
import {
  SHIPPING_METHODS,
  calcDiscount,
  calcGrandTotal,
  calcShippingCost,
  calcSubtotal,
  calcTax,
} from '../utils/totals';
import type { ShippingMethodId } from '../utils/totals';
import { persistedAtom } from '../utils/persistedAtom';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

export interface CouponInfo {
  code: string;
  discountPercent: number;
  freeShipping: boolean;
}

export const cartItems = persistedAtom<CartItem[]>('cart', []);
export const appliedCoupon = persistedAtom<CouponInfo | null>('coupon', null);
export const selectedShippingMethod = persistedAtom<ShippingMethodId>('selectedShippingMethod', 'standard');

// Ensure the persisted shipping method is still a valid option
if (!SHIPPING_METHODS.some((m) => m.id === selectedShippingMethod.get())) {
  selectedShippingMethod.set('standard');
}

export const cartCount = computed(cartItems, (items) =>
  items.reduce((total, item) => total + item.quantity, 0)
);

export const cartTotal = computed(cartItems, (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0)
);

export const subtotal = computed(cartItems, (items) => calcSubtotal(items));

export const discount = computed([subtotal, appliedCoupon], (nextSubtotal, coupon) =>
  calcDiscount(nextSubtotal, coupon)
);

export const shippingCost = computed(
  [selectedShippingMethod, appliedCoupon],
  (method, coupon) => calcShippingCost(method, coupon)
);

export const tax = computed([subtotal, discount, shippingCost], (nextSubtotal, nextDiscount, nextShipping) =>
  calcTax(nextSubtotal, nextDiscount, nextShipping)
);

export const grandTotal = computed(
  [subtotal, discount, shippingCost, tax],
  (nextSubtotal, nextDiscount, nextShipping, nextTax) =>
    calcGrandTotal(nextSubtotal, nextDiscount, nextShipping, nextTax)
);

export function addToCart(item: Omit<CartItem, 'quantity'>): void {
  const current = cartItems.get();
  const existing = current.find((i) => i.id === item.id);

  if (existing) {
    cartItems.set(
      current.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  } else {
    cartItems.set([...current, { ...item, quantity: 1 }]);
  }
}

export function updateQuantity(id: string, quantity: number): void {
  if (quantity < 1) return;
  cartItems.set(
    cartItems.get().map((i) => (i.id === id ? { ...i, quantity } : i))
  );
}

export function removeFromCart(id: string): void {
  cartItems.set(cartItems.get().filter((i) => i.id !== id));
}

export function clearCart(): void {
  cartItems.set([]);
  appliedCoupon.set(null);
  selectedShippingMethod.set('standard');
}
