import { openLogin } from '../stores/ui';
import { getTestId } from '../utils/testId';

export default function LoginButton() {
  return (
    <button
      type="button"
      data-testid={getTestId('nav-login-btn')}
      onClick={openLogin}
      className="navbar__login-btn"
    >
      Login
    </button>
  );
}
