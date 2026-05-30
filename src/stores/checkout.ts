import { persistedAtom } from '../utils/persistedAtom';
// cart.ts does not import from this module, so this is a safe one-way dependency.
import { clearCart } from './cart';

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  method: 'standard' | 'express' | 'overnight';
}

export interface OrderInfo {
  orderId: string;
  message: string;
  total: number;
}

export const shippingInfo = persistedAtom<ShippingInfo | null>('checkout-shipping', null);
export const orderInfo = persistedAtom<OrderInfo | null>('checkout-order', null);

export function resetCheckout(): void {
  // clearCart() also resets appliedCoupon and selectedShippingMethod.
  clearCart();
  shippingInfo.set(null);
  orderInfo.set(null);
}
