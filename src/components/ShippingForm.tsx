import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { cartItems, appliedCoupon } from '../stores/cart';
import { shippingInfo } from '../stores/checkout';
import type { ShippingInfo } from '../stores/checkout';
import { getTestId } from '../utils/testId';

type ShippingMethod = 'standard' | 'express' | 'overnight';

const SHIPPING_METHODS: {
  id: ShippingMethod;
  icon: string;
  name: string;
  desc: string;
  price: number;
}[] = [
  { id: 'standard', icon: '📦', name: 'Standard Shipping', desc: '5–7 business days', price: 0 },
  { id: 'express', icon: '🚚', name: 'Express Shipping', desc: '2–3 business days', price: 9.99 },
  { id: 'overnight', icon: '✈️', name: 'Overnight Shipping', desc: 'Next business day', price: 24.99 },
];

const TAX_RATE = 0.08;

type FieldErrors = Partial<Record<keyof Omit<ShippingInfo, 'apartment' | 'phone'>, string>>;

function validate(form: ShippingInfo): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.firstName.trim()) errors.firstName = 'First name is required';
  if (!form.lastName.trim()) errors.lastName = 'Last name is required';
  if (!form.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address';
  }
  if (!form.address.trim()) errors.address = 'Address is required';
  if (!form.city.trim()) errors.city = 'City is required';
  if (!form.state.trim()) errors.state = 'State / province is required';
  if (!form.zip.trim()) errors.zip = 'ZIP / postal code is required';
  if (!form.country) errors.country = 'Country is required';
  return errors;
}

export default function ShippingForm() {
  const items = useStore(cartItems);
  const coupon = useStore(appliedCoupon);

  const [form, setForm] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: '',
    method: 'standard',
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const subtotal = items.reduce((t, i) => t + i.price * i.quantity, 0);
  const discountAmount = coupon ? (subtotal * coupon.discountPercent) / 100 : 0;
  const afterDiscount = subtotal - discountAmount;

  const selectedMethod = SHIPPING_METHODS.find((m) => m.id === form.method)!;
  const shippingCost = coupon?.freeShipping ? 0 : selectedMethod.price;
  const tax = (afterDiscount + shippingCost) * TAX_RATE;
  const total = afterDiscount + shippingCost + tax;

  function updateField(field: keyof ShippingInfo, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setIsSubmitting(true);
    setServerError('');
    try {
      const res = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Shipping submission failed');
      shippingInfo.set(form);
      window.location.href = '/payment';
    } catch {
      setServerError('Failed to save shipping details. Please try again.');
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="shipping-layout">
        <div className="cart-empty" data-testid={getTestId('shipping-empty')}>
          <div className="cart-empty__icon">🛒</div>
          <h2 className="cart-empty__title">Your cart is empty</h2>
          <p className="cart-empty__subtitle">Add some items before proceeding to shipping.</p>
          <a href="/" className="cart-empty__btn" data-testid={getTestId('shipping-empty-shop-btn')}>
            Start Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="shipping-layout">
      {/* Left: Form */}
      <form onSubmit={handleSubmit} noValidate data-testid={getTestId('shipping-form')}>
        <div className="shipping-form-card">
          <h2 className="shipping-form-card__title">Shipping Information</h2>

          {serverError && (
            <div className="shipping-form__server-error" data-testid={getTestId('shipping-server-error')}>
              {serverError}
            </div>
          )}

          <div className="shipping-form__row">
            <div className="shipping-form__group">
              <label htmlFor="shipping-first-name" className="shipping-form__label">
                First Name <span className="shipping-form__required">*</span>
              </label>
              <input
                id="shipping-first-name"
                type="text"
                className={`shipping-form__input${errors.firstName ? ' shipping-form__input--error' : ''}`}
                value={form.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                placeholder="Jane"
                data-testid={getTestId('shipping-first-name')}
                autoComplete="given-name"
              />
              {errors.firstName && (
                <p className="shipping-form__error" data-testid={getTestId('shipping-first-name-error')}>
                  {errors.firstName}
                </p>
              )}
            </div>
            <div className="shipping-form__group">
              <label htmlFor="shipping-last-name" className="shipping-form__label">
                Last Name <span className="shipping-form__required">*</span>
              </label>
              <input
                id="shipping-last-name"
                type="text"
                className={`shipping-form__input${errors.lastName ? ' shipping-form__input--error' : ''}`}
                value={form.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                placeholder="Smith"
                data-testid={getTestId('shipping-last-name')}
                autoComplete="family-name"
              />
              {errors.lastName && (
                <p className="shipping-form__error" data-testid={getTestId('shipping-last-name-error')}>
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="shipping-form__row">
            <div className="shipping-form__group">
              <label htmlFor="shipping-email" className="shipping-form__label">
                Email Address <span className="shipping-form__required">*</span>
              </label>
              <input
                id="shipping-email"
                type="email"
                className={`shipping-form__input${errors.email ? ' shipping-form__input--error' : ''}`}
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="jane@example.com"
                data-testid={getTestId('shipping-email')}
                autoComplete="email"
              />
              {errors.email && (
                <p className="shipping-form__error" data-testid={getTestId('shipping-email-error')}>
                  {errors.email}
                </p>
              )}
            </div>
            <div className="shipping-form__group">
              <label htmlFor="shipping-phone" className="shipping-form__label">
                Phone <span className="shipping-form__optional">(optional)</span>
              </label>
              <input
                id="shipping-phone"
                type="tel"
                className="shipping-form__input"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+1 (555) 000-0000"
                data-testid={getTestId('shipping-phone')}
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="shipping-form__group">
            <label htmlFor="shipping-address" className="shipping-form__label">
              Street Address <span className="shipping-form__required">*</span>
            </label>
            <input
              id="shipping-address"
              type="text"
              className={`shipping-form__input${errors.address ? ' shipping-form__input--error' : ''}`}
              value={form.address}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="123 Main Street"
              data-testid={getTestId('shipping-address')}
              autoComplete="street-address"
            />
            {errors.address && (
              <p className="shipping-form__error" data-testid={getTestId('shipping-address-error')}>
                {errors.address}
              </p>
            )}
          </div>

          <div className="shipping-form__group">
            <label htmlFor="shipping-apartment" className="shipping-form__label">
              Apartment, suite, etc. <span className="shipping-form__optional">(optional)</span>
            </label>
            <input
              id="shipping-apartment"
              type="text"
              className="shipping-form__input"
              value={form.apartment}
              onChange={(e) => updateField('apartment', e.target.value)}
              placeholder="Apt 4B"
              data-testid={getTestId('shipping-apartment')}
              autoComplete="address-line2"
            />
          </div>

          <div className="shipping-form__row">
            <div className="shipping-form__group">
              <label htmlFor="shipping-city" className="shipping-form__label">
                City <span className="shipping-form__required">*</span>
              </label>
              <input
                id="shipping-city"
                type="text"
                className={`shipping-form__input${errors.city ? ' shipping-form__input--error' : ''}`}
                value={form.city}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder="New York"
                data-testid={getTestId('shipping-city')}
                autoComplete="address-level2"
              />
              {errors.city && (
                <p className="shipping-form__error" data-testid={getTestId('shipping-city-error')}>
                  {errors.city}
                </p>
              )}
            </div>
            <div className="shipping-form__group">
              <label htmlFor="shipping-state" className="shipping-form__label">
                State / Province <span className="shipping-form__required">*</span>
              </label>
              <input
                id="shipping-state"
                type="text"
                className={`shipping-form__input${errors.state ? ' shipping-form__input--error' : ''}`}
                value={form.state}
                onChange={(e) => updateField('state', e.target.value)}
                placeholder="NY"
                data-testid={getTestId('shipping-state')}
                autoComplete="address-level1"
              />
              {errors.state && (
                <p className="shipping-form__error" data-testid={getTestId('shipping-state-error')}>
                  {errors.state}
                </p>
              )}
            </div>
          </div>

          <div className="shipping-form__row">
            <div className="shipping-form__group">
              <label htmlFor="shipping-zip" className="shipping-form__label">
                ZIP / Postal Code <span className="shipping-form__required">*</span>
              </label>
              <input
                id="shipping-zip"
                type="text"
                className={`shipping-form__input${errors.zip ? ' shipping-form__input--error' : ''}`}
                value={form.zip}
                onChange={(e) => updateField('zip', e.target.value)}
                placeholder="10001"
                data-testid={getTestId('shipping-zip')}
                autoComplete="postal-code"
              />
              {errors.zip && (
                <p className="shipping-form__error" data-testid={getTestId('shipping-zip-error')}>
                  {errors.zip}
                </p>
              )}
            </div>
            <div className="shipping-form__group">
              <label htmlFor="shipping-country" className="shipping-form__label">
                Country <span className="shipping-form__required">*</span>
              </label>
              <select
                id="shipping-country"
                className={`shipping-form__select${errors.country ? ' shipping-form__select--error' : ''}`}
                value={form.country}
                onChange={(e) => updateField('country', e.target.value)}
                data-testid={getTestId('shipping-country')}
                autoComplete="country"
              >
                <option value="">Select country…</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="GB">United Kingdom</option>
                <option value="NZ">New Zealand</option>
              </select>
              {errors.country && (
                <p className="shipping-form__error" data-testid={getTestId('shipping-country-error')}>
                  {errors.country}
                </p>
              )}
            </div>
          </div>

          {/* Shipping Methods */}
          <p className="shipping-form__section-title">Shipping Method</p>
          <div className="shipping-methods" data-testid={getTestId('shipping-methods')}>
            {SHIPPING_METHODS.map((method) => (
              <label
                key={method.id}
                className={`shipping-method${form.method === method.id ? ' shipping-method--selected' : ''}`}
                data-testid={getTestId(`shipping-method-${method.id}`)}
              >
                <div className="shipping-method__left">
                  <input
                    type="radio"
                    name="shippingMethod"
                    className="shipping-method__radio"
                    value={method.id}
                    checked={form.method === method.id}
                    onChange={() => updateField('method', method.id)}
                  />
                  <span className="shipping-method__icon">{method.icon}</span>
                  <div>
                    <p className="shipping-method__name">{method.name}</p>
                    <p className="shipping-method__desc">{method.desc}</p>
                  </div>
                </div>
                <span
                  className={`shipping-method__price${method.price === 0 || coupon?.freeShipping ? ' shipping-method__price--free' : ''}`}
                >
                  {method.price === 0 || coupon?.freeShipping ? 'Free' : `$${method.price.toFixed(2)}`}
                </span>
              </label>
            ))}
          </div>

          <button
            type="submit"
            className="shipping-form__submit"
            data-testid={getTestId('shipping-submit-btn')}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving…' : 'Continue to Payment →'}
          </button>

          <a href="/cart" className="shipping-form__back" data-testid={getTestId('shipping-back-btn')}>
            ← Back to Cart
          </a>
        </div>
      </form>

      {/* Right: Order Summary */}
      <div>
        <div className="shipping-summary__card" data-testid={getTestId('shipping-order-summary')}>
          <h3 className="shipping-summary__title">Order Summary</h3>

          {items.map((item) => (
            <div className="shipping-summary__item" key={item.id}>
              <div className="shipping-summary__item-img">{item.emoji}</div>
              <div>
                <p className="shipping-summary__item-name">{item.name}</p>
                <p className="shipping-summary__item-qty">Qty: {item.quantity}</p>
              </div>
              <span className="shipping-summary__item-price">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          <div className="shipping-summary__totals">
            <div className="shipping-summary__row">
              <span className="shipping-summary__row-label">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="shipping-summary__row">
                <span className="shipping-summary__row-label">Discount</span>
                <span>−${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="shipping-summary__row">
              <span className="shipping-summary__row-label">Shipping</span>
              <span>
                {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="shipping-summary__row">
              <span className="shipping-summary__row-label">Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="shipping-summary__row shipping-summary__row--total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
