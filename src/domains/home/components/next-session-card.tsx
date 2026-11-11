import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { HomeDashboardData } from '../types';
import { homeDashboardData } from '../data';

const { copy } = homeDashboardData;

export function NextSessionCard({
  data
}: {
  data: HomeDashboardData['nextSession'];
}) {
  return (
    <section
      aria-labelledby="next-session-title"
      className="next-session card-surface"
    >
      <div className="next-session__copy">
        <h2 id="next-session-title">{copy.nextSessionHeading}</h2>
        <p className="next-session__title">{data.title}</p>
        <p className="next-session__description">
          {copy.nextSessionDescription}
        </p>
        <p className="next-session__meta">
          {copy.nextSessionSummary(
            data.pendingCount,
            data.newCount,
            data.estimatedMinutes
          )}
        </p>
        <ul className="next-session__chips">
          <li>{copy.pendingChip(data.pendingCount)}</li>
          <li>{copy.newChip(data.newCount)}</li>
          <li>{copy.minutesChip(data.estimatedMinutes)}</li>
        </ul>
      </div>
      <Link className="primary-action" href={data.href}>
        <span>{copy.startSession}</span>
        <ArrowRight aria-hidden="true" size={18} strokeWidth={2} />
      </Link>
    </section>
  );
}
