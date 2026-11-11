'use client';

import { LogOut } from 'lucide-react';
import { authMessages } from '../messages';
import './login.css';

type LogoutButtonProps = {
  onLogout?: () => void | Promise<void>;
  variant?: 'full' | 'compact';
};

async function noopLogout() {}

export function LogoutButton({
  onLogout = noopLogout,
  variant = 'full'
}: LogoutButtonProps) {
  return (
    <button
      className="signin-logout"
      type="button"
      data-variant={variant}
      onClick={() => void onLogout()}
      aria-label={variant === 'compact' ? authMessages.logout.label : undefined}
      title={variant === 'compact' ? authMessages.logout.label : undefined}
    >
      <LogOut size={variant === 'compact' ? 18 : 20} aria-hidden="true" />
      {variant === 'full' && <span>{authMessages.logout.label}</span>}
    </button>
  );
}
