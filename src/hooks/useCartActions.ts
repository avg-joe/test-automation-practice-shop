import { useState } from 'react';
import { useStore } from '@nanostores/react';
import {
  cartItems,
  appliedCoupon,
  subtotal,
  discount,
  shippingCost,
  tax,
  grandTotal,
} from '../stores/cart';
import {
  apiAddToCart,
  apiApplyCoupon,
  apiClearCart,
  apiRemoveFromCart,
  apiUpdateQuantity,
} from '../api/cart';

export interface UseCartActionsResult {
  items: ReturnType<typeof cartItems.get>;
  coupon: ReturnType<typeof appliedCoupon.get>;
  subtotalAmount: number;
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  total: number;
  couponCode: string;
  couponLoading: boolean;
  couponError: string;
  updatingId: string | null;
  actionError: string;
  setCouponCode: (code: string) => void;
  handleUpdateQty: (id: string, qty: number) => Promise<void>;
  handleRemove: (id: string) => Promise<void>;
  handleClearCart: () => Promise<void>;
  handleApplyCoupon: () => Promise<void>;
  handleAddRecommended: (product: { id: string; emoji: string; name: string; price: number }) => Promise<void>;
}

export function useCartActions(): UseCartActionsResult {
  const items = useStore(cartItems);
  const coupon = useStore(appliedCoupon);
  const subtotalAmount = useStore(subtotal);
  const discountAmount = useStore(discount);
  const shippingAmount = useStore(shippingCost);
  const taxAmount = useStore(tax);
  const total = useStore(grandTotal);

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');

  async function handleUpdateQty(id: string, qty: number) {
    if (qty < 1) return;
    setUpdatingId(id);
    setActionError('');

    const result = await apiUpdateQuantity(id, qty);

    if (!result.ok) {
      setActionError(result.message);
    }

    setUpdatingId(null);
  }

  async function handleRemove(id: string) {
    setUpdatingId(id);
    setActionError('');

    const result = await apiRemoveFromCart(id);

    if (!result.ok) {
      setActionError(result.message);
    }

    setUpdatingId(null);
  }

  async function handleClearCart() {
    setActionError('');

    const result = await apiClearCart();

    if (!result.ok) {
      setActionError(result.message);
    }
  }

  async function handleApplyCoupon() {
    const trimmed = couponCode.trim();
    if (!trimmed) return;
    setCouponLoading(true);
    setCouponError('');

    const result = await apiApplyCoupon(trimmed);

    if (!result.ok) {
      setCouponError(result.message);
    } else {
      setCouponCode('');
      setCouponError('');
    }

    setCouponLoading(false);
  }

  async function handleAddRecommended(product: { id: string; emoji: string; name: string; price: number }) {
    setActionError('');

    const result = await apiAddToCart(product);

    if (!result.ok) {
      setActionError(result.message);
    }
  }

  return {
    items,
    coupon,
    subtotalAmount,
    discountAmount,
    shippingAmount,
    taxAmount,
    total,
    couponCode,
    couponLoading,
    couponError,
    updatingId,
    actionError,
    setCouponCode,
    handleUpdateQty,
    handleRemove,
    handleClearCart,
    handleApplyCoupon,
    handleAddRecommended,
  };
}
