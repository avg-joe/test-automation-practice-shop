import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { cartItems, appliedCoupon, subtotal, discount, shippingCost, tax, grandTotal } from '../stores/cart';
import { shippingInfo } from '../stores/checkout';
import { apiCheckout } from '../api/checkout';
import { validateCard, type CardForm, type CardErrors } from '../utils/validation';
import { formatCardNumber, formatExpiry } from '../utils/format';

export type PaymentMethod = 'credit-card' | 'paypal' | 'afterpay' | 'zip';

export interface UsePaymentFormResult {
  items: ReturnType<typeof cartItems.get>;
  coupon: ReturnType<typeof appliedCoupon.get>;
  shipping: ReturnType<typeof shippingInfo.get>;
  subtotalAmount: number;
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  total: number;
  method: PaymentMethod;
  card: CardForm;
  cardErrors: CardErrors;
  isSubmitting: boolean;
  serverError: string;
  setMethod: (method: PaymentMethod) => void;
  updateCard: (field: keyof CardForm, rawValue: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function usePaymentForm(): UsePaymentFormResult {
  const items = useStore(cartItems);
  const coupon = useStore(appliedCoupon);
  const shipping = useStore(shippingInfo);
  const subtotalAmount = useStore(subtotal);
  const discountAmount = useStore(discount);
  const shippingAmount = useStore(shippingCost);
  const taxAmount = useStore(tax);
  const total = useStore(grandTotal);

  const [method, setMethod] = useState<PaymentMethod>('credit-card');
  const [card, setCard] = useState<CardForm>({ cardName: '', cardNumber: '', expiry: '', cvv: '' });
  const [cardErrors, setCardErrors] = useState<CardErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  function updateCard(field: keyof CardForm, rawValue: string) {
    let value = rawValue;
    if (field === 'cardNumber') value = formatCardNumber(rawValue);
    if (field === 'expiry') value = formatExpiry(rawValue);
    if (field === 'cvv') value = rawValue.replace(/\D/g, '').slice(0, 4);
    setCard((prev) => ({ ...prev, [field]: value }));
    if (cardErrors[field]) setCardErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');

    if (method === 'credit-card') {
      const errs = validateCard(card);
      if (Object.keys(errs).length > 0) {
        setCardErrors(errs);
        return;
      }
    }

    setIsSubmitting(true);

    const name = shipping
      ? `${shipping.firstName} ${shipping.lastName}`
      : 'Customer';
    const result = await apiCheckout({
      name,
      email: shipping?.email ?? '',
      address: shipping
        ? `${shipping.address}, ${shipping.city}, ${shipping.state} ${shipping.zip}, ${shipping.country}`
        : '',
      paymentMethod: method,
      total,
    });

    if (!result.ok) {
      setServerError(result.message);
      setIsSubmitting(false);
      return;
    }

    window.location.href = '/confirm';
  }

  return {
    items,
    coupon,
    shipping,
    subtotalAmount,
    discountAmount,
    shippingAmount,
    taxAmount,
    total,
    method,
    card,
    cardErrors,
    isSubmitting,
    serverError,
    setMethod,
    updateCard,
    handleSubmit,
  };
}
