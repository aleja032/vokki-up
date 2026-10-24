'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useLoginSubmit } from '../hooks/use-login-submit';
import type { LoginInput } from '../login.schema';
import { authMessages } from '../messages';
import './login.css';

const messages = authMessages.login;

type LoginFormProps = {
  onLogin?: (input: LoginInput) => void | Promise<void>;
};

export function LoginForm({ onLogin }: LoginFormProps) {
  const { register, onSubmit, errors, isSubmitting, isValid } = useLoginSubmit({
    onLogin
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const emailError = errors.email?.message;
  const passwordError = errors.password?.message;
  const rootError = errors.root?.message;

  return (
    <form className="signin-form" onSubmit={onSubmit} noValidate>
      <div className="signin-field">
        <label htmlFor="login-email">{messages.emailLabel}</label>
        <input
          id="login-email"
          className="signin-field__input"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={messages.emailPlaceholder}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? 'login-email-error' : undefined}
          {...register('email')}
        />
        {emailError && (
          <p
            id="login-email-error"
            className="signin-field__error"
            role="alert"
          >
            {emailError}
          </p>
        )}
      </div>

      <div className="signin-field">
        <label htmlFor="login-password">{messages.passwordLabel}</label>
        <div className="signin-field__control">
          <input
            id="login-password"
            className="signin-field__input signin-field__input--password"
            type={isPasswordVisible ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder={messages.passwordPlaceholder}
            aria-invalid={Boolean(passwordError)}
            aria-describedby={
              passwordError ? 'login-password-error' : undefined
            }
            {...register('password')}
          />
          <button
            className="signin-field__toggle"
            type="button"
            onClick={() => setIsPasswordVisible(isVisible => !isVisible)}
            aria-label={
              isPasswordVisible ? messages.hidePassword : messages.showPassword
            }
            aria-pressed={isPasswordVisible}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} aria-hidden="true" />
            ) : (
              <Eye size={20} aria-hidden="true" />
            )}
          </button>
        </div>
        {passwordError && (
          <p
            id="login-password-error"
            className="signin-field__error"
            role="alert"
          >
            {passwordError}
          </p>
        )}
      </div>

      <button
        className="signin-form__submit"
        type="submit"
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? messages.submitting : messages.submit}
      </button>

      <div className="signin-form__root" aria-live="polite">
        {rootError && (
          <p className="signin-form__root-error" role="alert">
            {rootError}
          </p>
        )}
      </div>

      <Link className="signin-form__guest" href="/">
        {messages.continueAsGuest}
      </Link>
    </form>
  );
}
