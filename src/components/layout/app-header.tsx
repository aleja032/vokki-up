import Link from 'next/link';
import { siteConfig, siteMessages } from '@/config/site';
import { ConnectionStatus } from './connection-status';
import { AuthenticatedOnly, ProfileActionSlot } from './shell-slots';

export function AppHeader() {
  return (
    <header className="app-header">
      <Link
        aria-label={siteMessages.mobileLogoLabel}
        className="brand"
        href="/"
      >
        <span>{siteConfig.brandPrimary}</span>{' '}
        <span className="brand__accent">{siteConfig.brandAccent}</span>
      </Link>
      <div className="app-header__actions">
        <AuthenticatedOnly>
          <ConnectionStatus variant="header" />
          <Link
            aria-label={siteMessages.settingsLinkLabel}
            className="user-avatar"
            href="/settings"
          >
            {siteMessages.avatarInitial}
          </Link>
        </AuthenticatedOnly>
        <ProfileActionSlot />
      </div>
    </header>
  );
}
