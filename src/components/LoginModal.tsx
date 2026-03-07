import { useState, useEffect } from 'react';
import { getTestId } from '../utils/testId';

export default function LoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const openBtn = document.getElementById('open-login-modal');
    if (openBtn) {
      const handler = () => setIsOpen(true);
      openBtn.addEventListener('click', handler);
      return () => openBtn.removeEventListener('click', handler);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const username = (formData.get('username') ?? formData.get('email') ?? '') as string;
    const password = (formData.get('password') ?? '') as string;

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json() as { success: boolean; message?: string; user?: { name: string } };

      if (res.ok && data.success) {
        setSuccess(`Welcome back, ${data.user?.name ?? username}!`);
        setTimeout(() => handleClose(), 1500);
      } else {
        setError(data.message ?? 'Invalid credentials. Try username: student');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      data-testid={getTestId('login-modal')}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '420px',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
      >
        <button
          data-testid={getTestId('modal-close')}
          onClick={handleClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.4rem',
            cursor: 'pointer',
            color: '#666',
          }}
        >
          ✕
        </button>

        <h2 id="modal-title" style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.4rem' }}>
          Welcome back
        </h2>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.8rem' }}>
          Sign in to your Test Automation Practice Shop account
        </p>

        <button
          data-testid={getTestId('google-login-btn')}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1.5px solid #e0e0e0',
            borderRadius: '8px',
            background: '#fff',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            fontWeight: 600,
            marginBottom: '0.6rem',
          }}
        >
          🔵 Continue with Google
        </button>

        <button
          data-testid={getTestId('facebook-login-btn')}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1.5px solid #e0e0e0',
            borderRadius: '8px',
            background: '#fff',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            fontWeight: 600,
            marginBottom: '0.6rem',
          }}
        >
          🔷 Continue with Facebook
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            margin: '1.2rem 0',
            color: '#666',
            fontSize: '0.85rem',
          }}
        >
          <span style={{ flex: 1, height: '1px', background: '#e0e0e0', display: 'block' }} />
          or
          <span style={{ flex: 1, height: '1px', background: '#e0e0e0', display: 'block' }} />
        </div>

        {error && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '0.75rem',
              marginBottom: '1rem',
              color: '#dc2626',
              fontSize: '0.9rem',
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              padding: '0.75rem',
              marginBottom: '1rem',
              color: '#16a34a',
              fontSize: '0.9rem',
            }}
          >
            {success}
          </div>
        )}

        <form data-testid={getTestId('login-form')} onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.2rem' }}>
            <label
              htmlFor="login-email"
              style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}
            >
              Email address
            </label>
            <input
              type="text"
              id="login-email"
              name="email"
              placeholder="you@example.com"
              data-testid={getTestId('login-email')}
              autoComplete="email"
              required
              style={{
                width: '100%',
                padding: '0.7rem 1rem',
                border: '1.5px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <label
              htmlFor="login-password"
              style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}
            >
              Password
            </label>
            <input
              type="password"
              id="login-password"
              name="password"
              placeholder="••••••••"
              data-testid={getTestId('login-password')}
              autoComplete="current-password"
              required
              style={{
                width: '100%',
                padding: '0.7rem 1rem',
                border: '1.5px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              fontSize: '0.85rem',
            }}
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
              <input type="checkbox" data-testid={getTestId('remember-me')} />
              Remember me
            </label>
            <a
              href="#"
              data-testid={getTestId('forgot-password')}
              style={{ color: '#e94560', textDecoration: 'none' }}
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            data-testid={getTestId('login-submit')}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.85rem',
              fontSize: '1rem',
              fontWeight: 600,
              background: '#e94560',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '0.88rem', color: '#666' }}>
          Don&apos;t have an account?{' '}
          <a
            href="#"
            data-testid={getTestId('signup-link')}
            style={{ color: '#e94560', textDecoration: 'none', fontWeight: 600 }}
          >
            Sign up for free
          </a>
        </div>
      </div>
    </div>
  );
}
