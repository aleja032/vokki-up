import Link from 'next/link';
import { Search } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { StatusScreen } from '@/components/layout/status-screen';
import { statusPageMessages } from '@/config/messages';

const messages = statusPageMessages.notFound;

export default function NotFound() {
  return (
    <AppShell>
      <StatusScreen
        description={messages.description}
        eyebrow={messages.eyebrow}
        glyph="?"
        search={
          <div className="status-screen__search">
            <label className="sr-only" htmlFor="not-found-search">
              {messages.searchLabel}
            </label>
            <Search aria-hidden="true" size={20} strokeWidth={1.8} />
            <input
              id="not-found-search"
              placeholder={messages.searchPlaceholder}
              type="search"
            />
          </div>
        }
        title={messages.title}
      >
        <Link
          className="status-screen__action status-screen__action--primary"
          href="/"
        >
          {messages.goHome}
        </Link>
        <Link
          className="status-screen__action status-screen__action--secondary"
          href="/cards"
        >
          {messages.viewCards}
        </Link>
      </StatusScreen>
    </AppShell>
  );
}
