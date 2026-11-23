import Link from 'next/link';
import { ChevronRight, FileText, PenLine } from 'lucide-react';
import type { UpcomingReviews } from '@/lib/home/home-hand.types';
import type { HomeActivity } from '../types';
import { homeDashboardData } from '../data';
import './upcoming-reviews-card.css';

const { copy } = homeDashboardData;

const activityIcons = {
  writing: PenLine,
  notes: FileText
} as const;

type UpcomingReviewsCardProps = {
  upcoming: UpcomingReviews;
  /** Where the "today" row leads: the review round. */
  reviewHref: string;
  /** Extra shortcuts (notes, writing); the review one is the "today" row. */
  activities: HomeActivity[];
};

export function UpcomingReviewsCard({
  upcoming,
  reviewHref,
  activities
}: UpcomingReviewsCardProps) {
  const { upcoming: labels } = copy;
  const rows = [
    ['today', labels.today, labels.todayHint, upcoming.today],
    ['week', labels.week, labels.weekHint, upcoming.week],
    ['safe', labels.safe, labels.safeHint, upcoming.safe]
  ] as const;

  return (
    <section aria-label={labels.heading} className="upcoming">
      <div className="upcoming__header">
        <h2 className="upcoming__title">{labels.heading}</h2>
        <Link className="upcoming__link" href="/cards">
          {labels.link}
        </Link>
      </div>
      <ul className="upcoming__list">
        {rows.map(([key, title, hint, count]) => {
          const content = (
            <>
              <span
                aria-hidden="true"
                className="upcoming__dot"
                data-level={key}
              />
              <span className="upcoming__copy">
                <strong>{title}</strong>
                <span>{hint}</span>
              </span>
              <strong className="upcoming__count">{count}</strong>
            </>
          );

          return (
            <li key={key}>
              {key === 'today' && count > 0 ? (
                <Link className="upcoming__row" href={reviewHref}>
                  {content}
                </Link>
              ) : (
                <div className="upcoming__row">{content}</div>
              )}
            </li>
          );
        })}
        {activities.map(activity => {
          const Icon =
            activityIcons[activity.icon as keyof typeof activityIcons];

          return (
            <li key={activity.title}>
              <Link className="upcoming__row" href={activity.href}>
                <span aria-hidden="true" className="upcoming__icon">
                  <Icon size={18} strokeWidth={2} />
                </span>
                <span className="upcoming__copy">
                  <strong>{activity.title}</strong>
                  <span>{activity.description}</span>
                </span>
                <ChevronRight
                  aria-hidden="true"
                  className="upcoming__arrow"
                  size={18}
                  strokeWidth={1.8}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
