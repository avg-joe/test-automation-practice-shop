import { useStore } from '@nanostores/react';
import { openLogin } from '../stores/ui';
import { mswReady } from '../stores/msw';
import { getTestId } from '../utils/testId';

export default function NavLoginButton() {
  const ready = useStore(mswReady);

  return (
    <button
      type="button"
      data-testid={getTestId('nav-login-btn')}
      className="navbar__login-btn"
      disabled={!ready}
      onClick={ready ? openLogin : undefined}
    >
      Login
    </button>
  );
}
