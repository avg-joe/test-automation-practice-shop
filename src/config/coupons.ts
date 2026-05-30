export const COUPONS: Record<string, { discountPercent: number; freeShipping: boolean; label: string }> = {
  SAVE10: { discountPercent: 10, freeShipping: false, label: '10% off your order' },
  SUMMER20: { discountPercent: 20, freeShipping: false, label: '20% off your order' },
  FREESHIP: { discountPercent: 0, freeShipping: true, label: 'Free shipping on your order' },
};
