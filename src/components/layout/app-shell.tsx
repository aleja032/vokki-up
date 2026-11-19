import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { AppHeader } from './app-header';
import { AppTopbar } from './app-topbar';
import { BottomNavigation } from './bottom-navigation';
import './app-shell.css';

type AppShellProps = {
  children: ReactNode;
  /** `violet` re-skins the whole shell with the Mi mazo palette (globals.css). */
  palette?: 'default' | 'violet';
};

export function AppShell({ children, palette = 'default' }: AppShellProps) {
  return (
    <div className={cn('app-shell', palette === 'violet' && 'palette-violet')}>
      <AppTopbar />
      <div className="app-shell__content">
        <AppHeader />
        <main className="app-main">
          <div className="app-main__inner">{children}</div>
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
}
