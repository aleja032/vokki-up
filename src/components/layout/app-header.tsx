import Link from 'next/link';
import { VokkiLogo } from '@/components/brand/vokki-logo';
import { siteConfig, siteMessages } from '@/config/site';
import { ConnectionStatus } from './connection-status';
import { SettingsIcon } from './navigation-icons';
import {
  AuthenticatedOnly,
  ProfileActionSlot,
  UnauthenticatedOnly
} from './shell-slots';

export function AppHeader() {
  return (
    <header className="app-header">
      <Link
        aria-label={siteMessages.mobileLogoLabel}
        className="brand app-header__brand"
        href="/"
      >
        <VokkiLogo className="brand__mark" size={28} />
        <span className="brand__wordmark">
          <span>{siteConfig.brandPrimary}</span>{' '}
          <span className="brand__accent">{siteConfig.brandAccent}</span>
        </span>
      </Link>
      <div className="app-header__actions">
        <AuthenticatedOnly>
          <ConnectionStatus variant="header" />
        </AuthenticatedOnly>
        <Link
          aria-label={siteMessages.settingsLinkLabel}
          className="user-avatar"
          href="/settings"
        >
          <AuthenticatedOnly>{siteMessages.avatarInitial}</AuthenticatedOnly>
          <UnauthenticatedOnly>
            <SettingsIcon size={20} />
          </UnauthenticatedOnly>
        </Link>
        <ProfileActionSlot />
      </div>
    </header>
  );
}
