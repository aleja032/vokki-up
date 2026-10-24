'use client';

import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { StatusScreen } from '@/components/layout/status-screen';
import { statusPageMessages } from '@/config/messages';

const messages = statusPageMessages.error;

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <AppShell>
      <StatusScreen
        description={messages.description}
        eyebrow={messages.eyebrow}
        glyph="!"
        title={messages.title}
      >
        <button
          className="status-screen__action status-screen__action--primary"
          onClick={reset}
          type="button"
        >
          {messages.retry}
        </button>
        <Link
          className="status-screen__action status-screen__action--secondary"
          href="/"
        >
          {messages.goHome}
        </Link>
      </StatusScreen>
    </AppShell>
  );
}
