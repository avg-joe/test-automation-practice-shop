export { TAX_RATE, SHIPPING_METHODS, FREE_SHIPPING_THRESHOLD } from '../config/pricing';
export type { ShippingMethodId } from '../config/pricing';

export interface TotalsLineItem {
  price: number;
  quantity: number;
}

export interface TotalsCoupon {
  discountPercent: number;
  freeShipping: boolean;
}

import { TAX_RATE, SHIPPING_METHODS } from '../config/pricing';
import type { ShippingMethodId } from '../config/pricing';

export function calcSubtotal(items: TotalsLineItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function calcDiscount(subtotal: number, coupon: TotalsCoupon | null): number {
  return coupon ? (subtotal * coupon.discountPercent) / 100 : 0;
}

export function calcShippingCost(
  method: ShippingMethodId,
  coupon: TotalsCoupon | null
): number {
  if (coupon?.freeShipping) return 0;
  return SHIPPING_METHODS.find((shippingMethod) => shippingMethod.id === method)?.price ?? 0;
}

export function calcTax(subtotal: number, discount: number, shippingCost: number): number {
  return (subtotal - discount + shippingCost) * TAX_RATE;
}

export function calcGrandTotal(
  subtotal: number,
  discount: number,
  shippingCost: number,
  tax: number
): number {
  return subtotal - discount + shippingCost + tax;
}
