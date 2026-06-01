import {
  addToCart,
  appliedCoupon,
  cartItems,
  clearCart,
  removeFromCart,
  updateQuantity,
  type CartItem,
  type CouponInfo,
} from '../stores/cart';
import { getApiMessage, parseApiJson, type ApiResult, type ApiResponseBase } from './types';

type CartPayload = Omit<CartItem, 'quantity'>;

type CartResponseItem = Omit<CartItem, 'emoji'> & { emoji?: string };

interface CartMutationResponse extends ApiResponseBase {
  success: boolean;
  cart?: CartResponseItem[];
  itemCount?: number;
}

interface CouponResponse extends ApiResponseBase {
  success: boolean;
  code?: string;
  discountPercent?: number;
  freeShipping?: boolean;
  label?: string;
}

function emitCartUpdated(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cart:updated'));
  }
}

function normalizeCartItems(items: CartResponseItem[]): CartItem[] {
  const current = cartItems.get();

  return items.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    emoji:
      item.emoji ?? current.find((currentItem) => currentItem.id === item.id)?.emoji ?? '🛍️',
  }));
}

function syncCartResponse(data: CartMutationResponse, fallback: () => void): void {
  if (Array.isArray(data.cart)) {
    cartItems.set(normalizeCartItems(data.cart));
    return;
  }

  fallback();
}

async function postCart<TResponse extends ApiResponseBase>(
  url: string,
  body: unknown,
  fallbackMessage: string,
): Promise<ApiResult<TResponse>> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await parseApiJson<TResponse>(response);

    if (!response.ok || !data?.success) {
      return {
        ok: false,
        message: getApiMessage(data, fallbackMessage),
      };
    }

    return { ok: true, data };
  } catch {
    return { ok: false, message: fallbackMessage };
  }
}

export async function apiAddToCart(item: CartPayload): Promise<ApiResult<CartMutationResponse>> {
  const result = await postCart<CartMutationResponse>('/api/cart/add', item, 'Failed to add item to cart. Please try again.');

  if (result.ok) {
    syncCartResponse(result.data, () => addToCart(item));
    emitCartUpdated();
  }

  return result;
}

export async function apiUpdateQuantity(id: string, quantity: number): Promise<ApiResult<CartMutationResponse>> {
  const result = await postCart<CartMutationResponse>(
    '/api/cart/update',
    { id, quantity },
    'Failed to update quantity. Please try again.',
  );

  if (result.ok) {
    syncCartResponse(result.data, () => updateQuantity(id, quantity));
    emitCartUpdated();
  }

  return result;
}

export async function apiRemoveFromCart(id: string): Promise<ApiResult<CartMutationResponse>> {
  const result = await postCart<CartMutationResponse>('/api/cart/remove', { id }, 'Failed to remove item. Please try again.');

  if (result.ok) {
    syncCartResponse(result.data, () => removeFromCart(id));
    emitCartUpdated();
  }

  return result;
}

export async function apiClearCart(): Promise<ApiResult<CartMutationResponse>> {
  const result = await postCart<CartMutationResponse>('/api/cart/clear', {}, 'Failed to clear cart. Please try again.');

  if (result.ok) {
    syncCartResponse(result.data, clearCart);
    appliedCoupon.set(null);
    emitCartUpdated();
  }

  return result;
}

export async function apiApplyCoupon(code: string): Promise<ApiResult<CouponResponse>> {
  const normalizedCode = code.trim().toUpperCase();

  try {
    const response = await fetch('/api/coupon/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: normalizedCode }),
    });
    const data = await parseApiJson<CouponResponse>(response);

    if (!response.ok || !data?.success) {
      appliedCoupon.set(null);
      return {
        ok: false,
        message: getApiMessage(data, 'Failed to apply coupon. Please try again.'),
      };
    }

    const coupon: CouponInfo = {
      code: data.code ?? normalizedCode,
      discountPercent: data.discountPercent ?? 0,
      freeShipping: data.freeShipping ?? false,
    };

    appliedCoupon.set(coupon);
    return { ok: true, data };
  } catch {
    return { ok: false, message: 'Failed to apply coupon. Please try again.' };
  }
}
