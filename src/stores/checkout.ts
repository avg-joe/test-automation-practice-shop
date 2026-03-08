import { atom } from 'nanostores';

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

export const shippingInfo = atom<ShippingInfo | null>(null);
export const orderInfo = atom<OrderInfo | null>(null);
