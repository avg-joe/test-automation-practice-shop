import { useState, type FormEvent } from 'react';
import { getTestId } from '../utils/testId';

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Clear previous errors and success
    setErrors({});
    setSuccess('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // Get form values
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const consent = formData.get('consent') as string;

    // Client-side validation
    const newErrors: Record<string, string> = {};
    
    if (!firstName || firstName.trim() === '') {
      newErrors.firstName = 'First Name is required';
    }
    
    if (!lastName || lastName.trim() === '') {
      newErrors.lastName = 'Last Name is required';
    }
    
    if (!email || email.trim() === '') {
      newErrors.email = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!subject || subject === '') {
      newErrors.subject = 'Subject is required';
    }
    
    if (!message || message.trim() === '') {
      newErrors.message = 'Message is required';
    }
    
    if (!consent) {
      newErrors.consent = 'You must agree to the Privacy Policy';
    }

    // If there are validation errors, display them
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit the form
    setIsLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          subject,
          message,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message ?? 'Message sent successfully! We\'ll be in touch within 24 hours.');
        form.reset();
      } else {
        setErrors({ form: data.message ?? 'Failed to send message. Please try again.' });
      }
    } catch {
      setErrors({ form: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div data-testid={getTestId('contact-form-section')}>
      <h2 className="contact-form-section__title">
        Send Us a Message
      </h2>
      <p className="contact-form-section__subtitle">
        Fill out the form and we'll respond as soon as possible.
      </p>

      <form data-testid={getTestId('contact-form')} onSubmit={handleSubmit}>
        <div className="contact-form__row">
          <div>
            <label
              htmlFor="contact-first"
              className="contact-form__label"
            >
              First Name <span className="contact-form__required">*</span>
            </label>
            <input
              type="text"
              id="contact-first"
              name="firstName"
              placeholder="Jane"
              data-testid={getTestId('contact-first-name')}
              className="contact-form__input"
            />
            {errors.firstName && (
              <p
                data-testid={getTestId('contact-first-name-error')}
                className="contact-form__error"
              >
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="contact-last"
              className="contact-form__label"
            >
              Last Name <span className="contact-form__required">*</span>
            </label>
            <input
              type="text"
              id="contact-last"
              name="lastName"
              placeholder="Doe"
              data-testid={getTestId('contact-last-name')}
              className="contact-form__input"
            />
            {errors.lastName && (
              <p
                data-testid={getTestId('contact-last-name-error')}
                className="contact-form__error"
              >
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        <div className="contact-form__group">
          <label
            htmlFor="contact-email"
            className="contact-form__label"
          >
            Email Address <span className="contact-form__required">*</span>
          </label>
          <input
            type="email"
            id="contact-email"
            name="email"
            placeholder="you@example.com"
            data-testid={getTestId('contact-email')}
            className="contact-form__input"
          />
          {errors.email && (
            <p
              data-testid={getTestId('contact-email-error')}
              className="contact-form__error"
            >
              {errors.email}
            </p>
          )}
        </div>

        <div className="contact-form__group">
          <label
            htmlFor="contact-phone"
            className="contact-form__label"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="contact-phone"
            name="phone"
            placeholder="+61 4XX XXX XXX"
            data-testid={getTestId('contact-phone')}
            className="contact-form__input"
          />
        </div>

        <div className="contact-form__group">
          <label
            htmlFor="contact-subject"
            className="contact-form__label"
          >
            Subject <span className="contact-form__required">*</span>
          </label>
          <select
            id="contact-subject"
            name="subject"
            data-testid={getTestId('contact-subject')}
            className="contact-form__select"
          >
            <option value="">Select a topic...</option>
            <option value="order">Order Issue</option>
            <option value="returns">Returns & Refunds</option>
            <option value="shipping">Shipping Question</option>
            <option value="product">Product Inquiry</option>
            <option value="account">Account Help</option>
            <option value="other">Other</option>
          </select>
          {errors.subject && (
            <p
              data-testid={getTestId('contact-subject-error')}
              className="contact-form__error"
            >
              {errors.subject}
            </p>
          )}
        </div>

        <div className="contact-form__group">
          <label
            htmlFor="contact-message"
            className="contact-form__label"
          >
            Message <span className="contact-form__required">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            placeholder="Write your message here..."
            data-testid={getTestId('contact-message')}
            className="contact-form__textarea"
          />
          {errors.message && (
            <p
              data-testid={getTestId('contact-message-error')}
              className="contact-form__error"
            >
              {errors.message}
            </p>
          )}
        </div>

        <div className="contact-form__checkbox-row">
          <label className="contact-form__checkbox-label">
            <input
              type="checkbox"
              name="consent"
              data-testid={getTestId('contact-consent')}
              className="contact-form__checkbox"
            />
            I agree to the{' '}
            <a
              href="#"
              data-testid={getTestId('contact-privacy-policy-link')}
              className="contact-form__privacy-link"
            >
              Privacy Policy
            </a>
          </label>
          {errors.consent && (
            <p
              data-testid={getTestId('contact-consent-error')}
              className="contact-form__error"
            >
              {errors.consent}
            </p>
          )}
        </div>

        <div className="contact-form__actions">
          <button
            type="submit"
            data-testid={getTestId('contact-submit-btn')}
            disabled={isLoading}
            className={`contact-form__submit ${isLoading ? 'contact-form__submit--loading' : ''}`}
          >
            {isLoading ? 'Sending...' : 'Send Message'}
          </button>
          <p className="contact-form__note">
            We typically respond within 24 hours.
          </p>
        </div>

        {errors.form && (
          <div
            data-testid={getTestId('contact-error-msg')}
            className="contact-form__alert contact-form__alert--error"
          >
            ⚠️ {errors.form}
          </div>
        )}
      </form>

      {success && (
        <div
          data-testid={getTestId('contact-success-msg')}
          className="contact-form__alert contact-form__alert--success"
        >
          ✅ {success}
        </div>
      )}
    </div>
  );
}
