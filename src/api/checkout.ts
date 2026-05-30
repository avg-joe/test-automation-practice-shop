import { clearCart } from '../stores/cart';
import { orderInfo, shippingInfo, type ShippingInfo } from '../stores/checkout';
import { getApiMessage, parseApiJson, type ApiResult, type ApiResponseBase } from './types';

interface ShippingResponse extends ApiResponseBase {
  success: boolean;
  method?: ShippingInfo['method'];
}

interface CheckoutResponse extends ApiResponseBase {
  success: boolean;
  orderId?: string;
}

interface ContactResponse extends ApiResponseBase {
  success: boolean;
  ticketId?: string;
}

interface LoginResponse extends ApiResponseBase {
  success: boolean;
  token?: string;
  user?: { id?: number; username?: string; name?: string };
}

interface CheckoutPayload {
  name: string;
  email: string;
  address: string;
  paymentMethod: string;
  total: number;
}

interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface LoginPayload {
  username: string;
  password: string;
}

async function postJson<TResponse extends ApiResponseBase>(
  url: string,
  body: unknown,
  fallbackMessage: string,
  networkMessage = fallbackMessage,
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
    return { ok: false, message: networkMessage };
  }
}

export async function apiSaveShipping(form: ShippingInfo): Promise<ApiResult<ShippingResponse>> {
  const result = await postJson<ShippingResponse>('/api/shipping', form, 'Failed to save shipping details. Please try again.');

  if (result.ok) {
    shippingInfo.set(form);
  }

  return result;
}

export async function apiCheckout(payload: CheckoutPayload): Promise<ApiResult<CheckoutResponse>> {
  const result = await postJson<CheckoutResponse>('/api/checkout', payload, 'Payment failed. Please try again.');

  if (!result.ok) {
    return result;
  }

  if (!result.data.orderId) {
    return { ok: false, message: 'Payment failed. Please try again.' };
  }

  orderInfo.set({
    orderId: result.data.orderId,
    message: result.data.message ?? '',
    total: payload.total,
  });
  clearCart();

  return result;
}

export async function apiContact(payload: ContactPayload): Promise<ApiResult<ContactResponse>> {
  return postJson<ContactResponse>(
    '/api/contact',
    payload,
    'Failed to send message. Please try again.',
    'Network error. Please check your connection and try again.',
  );
}

export async function apiLogin(payload: LoginPayload): Promise<ApiResult<LoginResponse>> {
  return postJson<LoginResponse>(
    '/api/login',
    payload,
    'Invalid credentials. Try username: student',
    'Network error. Please try again.',
  );
}
