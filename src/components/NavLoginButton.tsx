import { useStore } from '@nanostores/react';
import { mswReady } from '../stores/msw';
import { getTestId } from '../utils/testId';

export default function NavLoginButton() {
  const ready = useStore(mswReady);

  return (
    <button
      id="open-login-modal"
      data-testid={getTestId('nav-login-btn')}
      className="navbar__login-btn"
      disabled={!ready}
    >
      Login
    </button>
  );
}
