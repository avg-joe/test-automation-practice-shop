export type ShippingMethodId = 'standard' | 'express' | 'overnight';

export const TAX_RATE = 0.08;

export const FREE_SHIPPING_THRESHOLD = 50;

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
