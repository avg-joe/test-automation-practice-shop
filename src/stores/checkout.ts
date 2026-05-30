import { persistedAtom } from '../utils/persistedAtom';
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

export const shippingInfo = persistedAtom<ShippingInfo | null>('shipping', null);
export const orderInfo = persistedAtom<OrderInfo | null>('order', null);

export function resetCheckout(): void {
  clearCart();
  shippingInfo.set(null);
  orderInfo.set(null);
}
