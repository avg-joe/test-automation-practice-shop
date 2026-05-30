import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { selectedShippingMethod } from '../stores/cart';
import { shippingInfo } from '../stores/checkout';
import type { ShippingInfo } from '../stores/checkout';
import type { ShippingMethodId } from '../utils/totals';
import { apiSaveShipping } from '../api/checkout';
import { validateShipping, type ShippingFieldErrors } from '../utils/validation';

export interface UseShippingFormResult {
  form: ShippingInfo;
  errors: ShippingFieldErrors;
  isSubmitting: boolean;
  serverError: string;
  updateField: (field: keyof ShippingInfo, value: string) => void;
  updateShippingMethod: (method: ShippingMethodId) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useShippingForm(): UseShippingFormResult {
  const currentShippingMethod = useStore(selectedShippingMethod);
  const savedShippingInfo = useStore(shippingInfo);

  const [form, setForm] = useState<ShippingInfo>(() => {
    const baseForm: ShippingInfo = {
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
      method: currentShippingMethod,
    };
    if (savedShippingInfo) {
      return { ...baseForm, ...savedShippingInfo };
    }
    return baseForm;
  });

  useEffect(() => {
    if (savedShippingInfo) {
      selectedShippingMethod.set(savedShippingInfo.method);
    }
  }, []);
  const [errors, setErrors] = useState<ShippingFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  function updateField(field: keyof ShippingInfo, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof ShippingFieldErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function updateShippingMethod(method: ShippingMethodId) {
    selectedShippingMethod.set(method);
    updateField('method', method);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fieldErrors = validateShipping(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setIsSubmitting(true);
    setServerError('');

    const result = await apiSaveShipping(form);

    if (!result.ok) {
      setServerError(result.message);
      setIsSubmitting(false);
      return;
    }

    window.location.href = '/payment';
  }

  return { form, errors, isSubmitting, serverError, updateField, updateShippingMethod, handleSubmit };
}
