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
      <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Send Us a Message
      </h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Fill out the form and we'll respond as soon as possible.
      </p>

      <form data-testid={getTestId('contact-form')} onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
          <div>
            <label
              htmlFor="contact-first"
              style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#1a1a2e' }}
            >
              First Name <span style={{ color: '#e94560', marginLeft: '2px' }}>*</span>
            </label>
            <input
              type="text"
              id="contact-first"
              name="firstName"
              placeholder="Jane"
              data-testid={getTestId('contact-first-name')}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1.5px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '0.95rem',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#e94560')}
              onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
            />
            {errors.firstName && (
              <p
                data-testid={getTestId('contact-first-name-error')}
                style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.3rem' }}
              >
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="contact-last"
              style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#1a1a2e' }}
            >
              Last Name <span style={{ color: '#e94560', marginLeft: '2px' }}>*</span>
            </label>
            <input
              type="text"
              id="contact-last"
              name="lastName"
              placeholder="Doe"
              data-testid={getTestId('contact-last-name')}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1.5px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '0.95rem',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#e94560')}
              onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
            />
            {errors.lastName && (
              <p
                data-testid={getTestId('contact-last-name-error')}
                style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.3rem' }}
              >
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '1.2rem' }}>
          <label
            htmlFor="contact-email"
            style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#1a1a2e' }}
          >
            Email Address <span style={{ color: '#e94560', marginLeft: '2px' }}>*</span>
          </label>
          <input
            type="email"
            id="contact-email"
            name="email"
            placeholder="you@example.com"
            data-testid={getTestId('contact-email')}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '1.5px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '0.95rem',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#e94560')}
            onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
          />
          {errors.email && (
            <p
              data-testid={getTestId('contact-email-error')}
              style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.3rem' }}
            >
              {errors.email}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '1.2rem' }}>
          <label
            htmlFor="contact-phone"
            style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#1a1a2e' }}
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="contact-phone"
            name="phone"
            placeholder="+61 4XX XXX XXX"
            data-testid={getTestId('contact-phone')}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '1.5px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '0.95rem',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#e94560')}
            onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
          />
        </div>

        <div style={{ marginBottom: '1.2rem' }}>
          <label
            htmlFor="contact-subject"
            style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#1a1a2e' }}
          >
            Subject <span style={{ color: '#e94560', marginLeft: '2px' }}>*</span>
          </label>
          <select
            id="contact-subject"
            name="subject"
            data-testid={getTestId('contact-subject')}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '1.5px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '0.95rem',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#e94560')}
            onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
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
              style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.3rem' }}
            >
              {errors.subject}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '1.2rem' }}>
          <label
            htmlFor="contact-message"
            style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#1a1a2e' }}
          >
            Message <span style={{ color: '#e94560', marginLeft: '2px' }}>*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            placeholder="Write your message here..."
            data-testid={getTestId('contact-message')}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '1.5px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '0.95rem',
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
              minHeight: '140px',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#e94560')}
            onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
          />
          {errors.message && (
            <p
              data-testid={getTestId('contact-message-error')}
              style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.3rem' }}
            >
              {errors.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '1.2rem' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              fontWeight: 400,
              fontSize: '0.85rem',
            }}
          >
            <input
              type="checkbox"
              name="consent"
              data-testid={getTestId('contact-consent')}
              style={{ cursor: 'pointer' }}
            />
            I agree to the{' '}
            <a href="#" style={{ color: '#e94560', textDecoration: 'none' }}>
              Privacy Policy
            </a>
          </label>
          {errors.consent && (
            <p
              data-testid={getTestId('contact-consent-error')}
              style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.3rem' }}
            >
              {errors.consent}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
          <button
            type="submit"
            data-testid={getTestId('contact-submit-btn')}
            disabled={isLoading}
            style={{
              padding: '0.9rem 2.5rem',
              background: '#e94560',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? 'Sending...' : 'Send Message'}
          </button>
          <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>
            We typically respond within 24 hours.
          </p>
        </div>

        {errors.form && (
          <div
            data-testid={getTestId('contact-error-msg')}
            style={{
              background: '#fef2f2',
              border: '1.5px solid #dc2626',
              borderRadius: '10px',
              padding: '1.2rem 1.5rem',
              marginTop: '1rem',
              color: '#dc2626',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            ⚠️ {errors.form}
          </div>
        )}
      </form>

      {success && (
        <div
          data-testid={getTestId('contact-success-msg')}
          style={{
            background: '#f0fdf4',
            border: '1.5px solid #22c55e',
            borderRadius: '10px',
            padding: '1.2rem 1.5rem',
            marginTop: '1rem',
            color: '#166534',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          ✅ {success}
        </div>
      )}
    </div>
  );
}
