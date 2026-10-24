import type { ReactNode } from 'react';
import { AppHeader } from './app-header';
import { AppSidebar } from './app-sidebar';
import { BottomNavigation } from './bottom-navigation';
import './app-shell.css';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <AppSidebar />
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
