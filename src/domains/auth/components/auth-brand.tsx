import { authMessages } from '../messages';
import './login.css';

export function AuthBrand() {
  return (
    <p className="signin-brand">
      <span>{authMessages.login.brandPrimary}</span>{' '}
      <span className="signin-brand__accent">
        {authMessages.login.brandAccent}
      </span>
    </p>
  );
}
