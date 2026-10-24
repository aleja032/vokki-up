import { AppShell } from '@/components/layout/app-shell';
import { statusPageMessages } from '@/config/messages';

export default function Loading() {
  return (
    <AppShell>
      <div aria-busy="true" className="status-skeleton" role="status">
        <span className="sr-only">{statusPageMessages.loading.label}</span>
        <span
          aria-hidden="true"
          className="status-skeleton__bar status-skeleton__bar--title"
        />
        <span
          aria-hidden="true"
          className="status-skeleton__bar status-skeleton__bar--subtitle"
        />
        <span aria-hidden="true" className="status-skeleton__panel" />
        <span aria-hidden="true" className="status-skeleton__grid">
          <span className="status-skeleton__tile" />
          <span className="status-skeleton__tile" />
        </span>
      </div>
    </AppShell>
  );
}
