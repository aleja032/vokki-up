'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { siteConfig, siteMessages } from '@/config/site';
import { ConnectionStatus } from './connection-status';
import { isCurrentRoute } from './is-current-route.util';
import {
  navigationIcons,
  SettingsIcon,
  SidebarToggleIcon
} from './navigation-icons';
import {
  AuthenticatedOnly,
  ProfileActionSlot,
  ProfileSummarySlot
} from './shell-slots';

const settingsHref = '/settings';

export function AppSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleLabel = isCollapsed
    ? siteMessages.toggleExpanded
    : siteMessages.toggleCollapsed;

  return (
    <aside className="app-sidebar" data-collapsed={isCollapsed}>
      <div className="app-sidebar__header">
        <Link
          aria-label={siteMessages.logoHomeLabel}
          className="brand app-sidebar__brand"
          href="/"
        >
          <span>{siteConfig.brandPrimary}</span>{' '}
          <span className="brand__accent">{siteConfig.brandAccent}</span>
        </Link>
        <button
          aria-expanded={!isCollapsed}
          aria-label={toggleLabel}
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={toggleLabel}
          type="button"
        >
          <SidebarToggleIcon size={20} />
        </button>
      </div>
      <nav aria-label={siteMessages.navigationLabel} className="sidebar-nav">
        {siteConfig.navigation.map(item => {
          const Icon = navigationIcons[item.icon];

          return (
            <Link
              aria-current={
                isCurrentRoute(pathname, item.href) ? 'page' : undefined
              }
              className="sidebar-nav__item"
              href={item.href}
              key={item.href}
              title={item.label}
            >
              <Icon size={20} />
              <span className="app-sidebar__label">{item.label}</span>
            </Link>
          );
        })}
        <Link
          aria-current={
            isCurrentRoute(pathname, settingsHref) ? 'page' : undefined
          }
          className="sidebar-nav__item"
          href={settingsHref}
          title={siteMessages.settings}
        >
          <SettingsIcon size={20} />
          <span className="app-sidebar__label">{siteMessages.settings}</span>
        </Link>
      </nav>
      <div className="app-sidebar__footer">
        <AuthenticatedOnly>
          <ConnectionStatus variant="sidebar" />
        </AuthenticatedOnly>
        <div className="app-sidebar__profile">
          <AuthenticatedOnly>
            <span aria-hidden="true" className="user-avatar">
              {siteMessages.avatarInitial}
            </span>
          </AuthenticatedOnly>
          <ProfileSummarySlot />
          <span className="app-sidebar__profile-action">
            <ProfileActionSlot />
          </span>
        </div>
      </div>
    </aside>
  );
}
