import type { ShippingInfo } from '../stores/checkout';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ShippingFieldErrors = Partial<Record<keyof Omit<ShippingInfo, 'apartment' | 'phone'>, string>>;

export function validateShipping(form: ShippingInfo): ShippingFieldErrors {
  const errors: ShippingFieldErrors = {};
  if (!form.firstName.trim()) errors.firstName = 'First name is required';
  if (!form.lastName.trim()) errors.lastName = 'Last name is required';
  const email = form.email.trim();
  if (!email) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Please enter a valid email address';
  }
  if (!form.address.trim()) errors.address = 'Address is required';
  if (!form.city.trim()) errors.city = 'City is required';
  if (!form.state.trim()) errors.state = 'State / province is required';
  if (!form.zip.trim()) errors.zip = 'ZIP / postal code is required';
  if (!form.country) errors.country = 'Country is required';
  return errors;
}

export interface CardForm {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export type CardErrors = Partial<Record<keyof CardForm, string>>;

export function validateCard(form: CardForm): CardErrors {
  const errors: CardErrors = {};
  if (!form.cardName.trim()) errors.cardName = 'Cardholder name is required';
  const digits = form.cardNumber.replace(/\D/g, '');
  if (!digits) errors.cardNumber = 'Card number is required';
  else if (digits.length !== 16) errors.cardNumber = 'Enter a valid 16-digit card number';
  if (!form.expiry) errors.expiry = 'Expiry date is required';
  else if (!/^\d{2}\/\d{2}$/.test(form.expiry)) errors.expiry = 'Use MM/YY format';
  const cvvDigits = form.cvv.replace(/\D/g, '');
  if (!cvvDigits) errors.cvv = 'CVV is required';
  else if (!/^\d{3,4}$/.test(cvvDigits)) errors.cvv = 'CVV must be 3–4 digits';
  return errors;
}
