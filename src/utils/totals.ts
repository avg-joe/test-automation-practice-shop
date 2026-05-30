export type ShippingMethodId = 'standard' | 'express' | 'overnight';
export interface TotalsLineItem {
  price: number;
  quantity: number;
}

export interface TotalsCoupon {
  discountPercent: number;
  freeShipping: boolean;
}

export const TAX_RATE = 0.08;

export const SHIPPING_METHODS: {
  id: ShippingMethodId;
  label: string;
  description: string;
  icon: string;
  price: number;
}[] = [
  { id: 'standard', label: 'Standard Shipping', description: '5–7 business days', icon: '📦', price: 0 },
  { id: 'express', label: 'Express Shipping', description: '2–3 business days', icon: '🚚', price: 9.99 },
  { id: 'overnight', label: 'Overnight Shipping', description: 'Next business day', icon: '✈️', price: 24.99 },
];

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
