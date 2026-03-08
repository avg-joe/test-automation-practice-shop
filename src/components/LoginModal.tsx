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
      className="login-modal"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="login-modal__dialog"
      >
        <button
          data-testid={getTestId('modal-close')}
          onClick={handleClose}
          aria-label="Close"
          className="login-modal__close"
        >
          ✕
        </button>

        <h2 id="modal-title" className="login-modal__title">
          Welcome back
        </h2>
        <p className="login-modal__subtitle">
          Sign in to your Test Automation Practice Shop account
        </p>

        <button
          data-testid={getTestId('google-login-btn')}
          className="login-modal__social-btn"
        >
          🔵 Continue with Google
        </button>

        <button
          data-testid={getTestId('facebook-login-btn')}
          className="login-modal__social-btn"
        >
          🔷 Continue with Facebook
        </button>

        <div className="login-modal__divider">
          <span className="login-modal__divider-line" />
          or
          <span className="login-modal__divider-line" />
        </div>

        {error && (
          <div className="login-modal__alert login-modal__alert--error">
            {error}
          </div>
        )}

        {success && (
          <div className="login-modal__alert login-modal__alert--success">
            {success}
          </div>
        )}

        <form data-testid={getTestId('login-form')} onSubmit={handleSubmit}>
          <div className="login-modal__form-group">
            <label
              htmlFor="login-email"
              className="login-modal__label"
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
              className="login-modal__input"
            />
          </div>

          <div className="login-modal__form-group">
            <label
              htmlFor="login-password"
              className="login-modal__label"
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
              className="login-modal__input"
            />
          </div>

          <div className="login-modal__options">
            <label className="login-modal__remember">
              <input type="checkbox" data-testid={getTestId('remember-me')} />
              Remember me
            </label>
            <a
              href="#"
              data-testid={getTestId('forgot-password')}
              className="login-modal__forgot-link"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            data-testid={getTestId('login-submit')}
            disabled={isLoading}
            className={`login-modal__submit ${isLoading ? 'login-modal__submit--loading' : ''}`}
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="login-modal__footer">
          Don&apos;t have an account?{' '}
          <a
            href="#"
            data-testid={getTestId('signup-link')}
            className="login-modal__signup-link"
          >
            Sign up for free
          </a>
        </div>
      </div>
    </div>
  );
}
