import Link from 'next/link';
import { authMessages } from '../messages';
import { AuthBrand } from './auth-brand';
import { LogoutButton } from './logout-button';
import './login.css';

const messages = authMessages.session;

type SessionCardProps = {
  email: string;
  onLogout?: () => void | Promise<void>;
};

export function SessionCard({ email, onLogout }: SessionCardProps) {
  return (
    <section className="signin-card" aria-labelledby="signin-session-title">
      <AuthBrand />
      <header className="signin-card__header">
        <h1 id="signin-session-title">{messages.title}</h1>
        <p>{messages.description}</p>
      </header>
      <div className="signin-account">
        <span>{messages.emailLabel}</span>
        <strong>{email}</strong>
      </div>
      <LogoutButton onLogout={onLogout} />
      <Link className="signin-form__guest" href="/">
        {messages.backToApp}
      </Link>
    </section>
  );
}
