import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { cartItems, appliedCoupon, clearCart } from '../stores/cart';
import { shippingInfo, orderInfo } from '../stores/checkout';
import { getTestId } from '../utils/testId';

type PaymentMethod = 'credit-card' | 'paypal' | 'afterpay' | 'zip';

const TAX_RATE = 0.08;

interface CardForm {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

type CardErrors = Partial<Record<keyof CardForm, string>>;

function formatCardNumber(value: string): string {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

function validateCard(form: CardForm): CardErrors {
  const errors: CardErrors = {};
  if (!form.cardName.trim()) errors.cardName = 'Cardholder name is required';
  const digits = form.cardNumber.replace(/\s/g, '');
  if (!digits) errors.cardNumber = 'Card number is required';
  else if (digits.length < 16) errors.cardNumber = 'Enter a valid 16-digit card number';
  if (!form.expiry) errors.expiry = 'Expiry date is required';
  else if (!/^\d{2}\/\d{2}$/.test(form.expiry)) errors.expiry = 'Use MM/YY format';
  if (!form.cvv) errors.cvv = 'CVV is required';
  else if (form.cvv.length < 3) errors.cvv = 'CVV must be 3–4 digits';
  return errors;
}

export default function PaymentForm() {
  const items = useStore(cartItems);
  const coupon = useStore(appliedCoupon);
  const shipping = useStore(shippingInfo);

  const [method, setMethod] = useState<PaymentMethod>('credit-card');
  const [card, setCard] = useState<CardForm>({ cardName: '', cardNumber: '', expiry: '', cvv: '' });
  const [cardErrors, setCardErrors] = useState<CardErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const subtotal = items.reduce((t, i) => t + i.price * i.quantity, 0);
  const discountAmount = coupon ? (subtotal * coupon.discountPercent) / 100 : 0;
  const afterDiscount = subtotal - discountAmount;
  const shippingMethodCost =
    shipping?.method === 'express' ? 9.99 : shipping?.method === 'overnight' ? 24.99 : 0;
  const shippingCost = coupon?.freeShipping ? 0 : shippingMethodCost;
  const tax = (afterDiscount + shippingCost) * TAX_RATE;
  const total = afterDiscount + shippingCost + tax;

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
    try {
      const name = shipping
        ? `${shipping.firstName} ${shipping.lastName}`
        : 'Customer';
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: shipping?.email ?? '',
          address: shipping
            ? `${shipping.address}, ${shipping.city}, ${shipping.state} ${shipping.zip}, ${shipping.country}`
            : '',
          paymentMethod: method,
          total,
        }),
      });
      const data = await res.json() as { success: boolean; message?: string; orderId?: string };
      if (!res.ok || !data.success) {
        setServerError(data.message ?? 'Payment failed. Please try again.');
        setIsSubmitting(false);
        return;
      }
      orderInfo.set({ orderId: data.orderId!, message: data.message ?? '', total });
      clearCart();
      window.location.href = '/confirm';
    } catch {
      setServerError('Payment failed. Please try again.');
      setIsSubmitting(false);
    }
  }

  const paymentTabs: { id: PaymentMethod; icon: string; label: string }[] = [
    { id: 'credit-card', icon: '💳', label: 'Credit Card' },
    { id: 'paypal', icon: '🅿️', label: 'PayPal' },
    { id: 'afterpay', icon: '🔷', label: 'AfterPay' },
    { id: 'zip', icon: '⚡', label: 'Zip' },
  ];

  if (items.length === 0) {
    return (
      <div className="payment-layout">
        <div className="cart-empty" data-testid={getTestId('payment-empty')}>
          <div className="cart-empty__icon">🛒</div>
          <h2 className="cart-empty__title">Your cart is empty</h2>
          <p className="cart-empty__subtitle">Add some items before proceeding to payment.</p>
          <a href="/" className="cart-empty__btn" data-testid={getTestId('payment-empty-shop-btn')}>
            Start Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-layout">
      {/* Left: Payment Form */}
      <form onSubmit={handleSubmit} noValidate data-testid={getTestId('payment-form')}>
        <div className="payment-card">
          <h2 className="payment-card__title">Payment Method</h2>

          {/* Method tabs */}
          <div className="payment-tabs" data-testid={getTestId('payment-methods')}>
            {paymentTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`payment-tab${method === tab.id ? ' payment-tab--selected' : ''}`}
                data-testid={getTestId(`payment-method-${tab.id}`)}
                onClick={() => setMethod(tab.id)}
              >
                <span className="payment-tab__icon">{tab.icon}</span>
                <span className="payment-tab__label">{tab.label}</span>
              </button>
            ))}
          </div>

          {serverError && (
            <div className="payment-alert payment-alert--error" data-testid={getTestId('payment-error')}>
              {serverError}
            </div>
          )}

          {/* Credit Card form */}
          {method === 'credit-card' && (
            <div data-testid={getTestId('credit-card-form')}>
              <div className="payment-form__group">
                <label htmlFor="card-name" className="payment-form__label">
                  Cardholder Name <span className="payment-form__required">*</span>
                </label>
                <input
                  id="card-name"
                  type="text"
                  className={`payment-form__input${cardErrors.cardName ? ' payment-form__input--error' : ''}`}
                  value={card.cardName}
                  onChange={(e) => updateCard('cardName', e.target.value)}
                  placeholder="Jane Smith"
                  data-testid={getTestId('card-name')}
                  autoComplete="cc-name"
                />
                {cardErrors.cardName && (
                  <p className="payment-form__error" data-testid={getTestId('card-name-error')}>
                    {cardErrors.cardName}
                  </p>
                )}
              </div>

              <div className="payment-form__group">
                <label htmlFor="card-number" className="payment-form__label">
                  Card Number <span className="payment-form__required">*</span>
                </label>
                <input
                  id="card-number"
                  type="text"
                  className={`payment-form__input${cardErrors.cardNumber ? ' payment-form__input--error' : ''}`}
                  value={card.cardNumber}
                  onChange={(e) => updateCard('cardNumber', e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  data-testid={getTestId('card-number')}
                  inputMode="numeric"
                  autoComplete="cc-number"
                />
                {cardErrors.cardNumber && (
                  <p className="payment-form__error" data-testid={getTestId('card-number-error')}>
                    {cardErrors.cardNumber}
                  </p>
                )}
              </div>

              <div className="payment-form__row">
                <div className="payment-form__group">
                  <label htmlFor="card-expiry" className="payment-form__label">
                    Expiry Date <span className="payment-form__required">*</span>
                  </label>
                  <input
                    id="card-expiry"
                    type="text"
                    className={`payment-form__input${cardErrors.expiry ? ' payment-form__input--error' : ''}`}
                    value={card.expiry}
                    onChange={(e) => updateCard('expiry', e.target.value)}
                    placeholder="MM/YY"
                    data-testid={getTestId('card-expiry')}
                    inputMode="numeric"
                    autoComplete="cc-exp"
                  />
                  {cardErrors.expiry && (
                    <p className="payment-form__error" data-testid={getTestId('card-expiry-error')}>
                      {cardErrors.expiry}
                    </p>
                  )}
                </div>
                <div className="payment-form__group">
                  <label htmlFor="card-cvv" className="payment-form__label">
                    CVV <span className="payment-form__required">*</span>
                  </label>
                  <input
                    id="card-cvv"
                    type="text"
                    className={`payment-form__input${cardErrors.cvv ? ' payment-form__input--error' : ''}`}
                    value={card.cvv}
                    onChange={(e) => updateCard('cvv', e.target.value)}
                    placeholder="123"
                    data-testid={getTestId('card-cvv')}
                    inputMode="numeric"
                    autoComplete="cc-csc"
                  />
                  {cardErrors.cvv && (
                    <p className="payment-form__error" data-testid={getTestId('card-cvv-error')}>
                      {cardErrors.cvv}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PayPal panel */}
          {method === 'paypal' && (
            <div className="payment-alt-panel" data-testid={getTestId('paypal-panel')}>
              <div className="payment-alt-panel__icon">🅿️</div>
              <h3 className="payment-alt-panel__title">Pay with PayPal</h3>
              <p className="payment-alt-panel__desc">
                You will be redirected to PayPal to complete your payment securely.
                <br />
                <strong>(Simulated — no real payment processed)</strong>
              </p>
            </div>
          )}

          {/* AfterPay panel */}
          {method === 'afterpay' && (
            <div className="payment-alt-panel" data-testid={getTestId('afterpay-panel')}>
              <div className="payment-alt-panel__icon">🔷</div>
              <h3 className="payment-alt-panel__title">Pay with AfterPay</h3>
              <p className="payment-alt-panel__desc">
                Split your payment into 4 interest-free instalments of{' '}
                <strong>${(total / 4).toFixed(2)}</strong> every 2 weeks.
                <br />
                <strong>(Simulated — no real payment processed)</strong>
              </p>
            </div>
          )}

          {/* Zip panel */}
          {method === 'zip' && (
            <div className="payment-alt-panel" data-testid={getTestId('zip-panel')}>
              <div className="payment-alt-panel__icon">⚡</div>
              <h3 className="payment-alt-panel__title">Pay with Zip</h3>
              <p className="payment-alt-panel__desc">
                Own it now, pay later. Split into weekly payments of{' '}
                <strong>${(total / 4).toFixed(2)}</strong>.
                <br />
                <strong>(Simulated — no real payment processed)</strong>
              </p>
            </div>
          )}

          <button
            type="submit"
            className="payment-submit"
            data-testid={getTestId('payment-submit-btn')}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing…' : `Place Order — $${total.toFixed(2)}`}
          </button>

          <a href="/shipping" className="payment-back" data-testid={getTestId('payment-back-btn')}>
            ← Back to Shipping
          </a>
        </div>
      </form>

      {/* Right: Order Summary */}
      <div>
        <div className="payment-summary__card" data-testid={getTestId('payment-order-summary')}>
          <h3 className="payment-summary__title">Order Summary</h3>

          {shipping && (
            <div className="payment-summary__shipping">
              <p className="payment-summary__shipping-title">Shipping to</p>
              <p className="payment-summary__shipping-name">
                {shipping.firstName} {shipping.lastName}
              </p>
              <p className="payment-summary__shipping-addr">
                {shipping.address}
                {shipping.apartment ? `, ${shipping.apartment}` : ''}
                <br />
                {shipping.city}, {shipping.state} {shipping.zip}
                <br />
                {shipping.country}
              </p>
            </div>
          )}

          <div className="payment-summary__row">
            <span className="payment-summary__row-label">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="payment-summary__row">
              <span className="payment-summary__row-label">Discount</span>
              <span>−${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="payment-summary__row">
            <span className="payment-summary__row-label">Shipping</span>
            <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
          </div>
          <div className="payment-summary__row">
            <span className="payment-summary__row-label">Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="payment-summary__row payment-summary__row--total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="payment-summary__secure">
            <span className="payment-summary__secure-item">🔒 Secure</span>
            <span className="payment-summary__secure-item">💳 Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
