import { authMessages } from '../messages';
import { VokkiLogo } from '@/components/brand/vokki-logo';
import './login.css';

export function AuthBrand() {
  return (
    <p className="signin-brand">
      <VokkiLogo className="signin-brand__mark" size={32} />
      <span className="signin-brand__wordmark">
        <span>{authMessages.login.brandPrimary}</span>{' '}
        <span className="signin-brand__accent">
          {authMessages.login.brandAccent}
        </span>
      </span>
    </p>
  );
}
