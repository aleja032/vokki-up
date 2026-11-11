import Link from 'next/link';
import { BookOpen, ChevronRight, FileText, PenLine } from 'lucide-react';
import type { HomeActivity } from '../types';
import { homeDashboardData } from '../data';

const activityIcons = {
  cards: BookOpen,
  writing: PenLine,
  notes: FileText
} as const;

export function TodayActivityCard({
  activities
}: {
  activities: HomeActivity[];
}) {
  return (
    <section
      aria-labelledby="today-activity-title"
      className="today-activity card-surface"
    >
      <div className="section-heading">
        <h2 id="today-activity-title">
          {homeDashboardData.copy.todayActivityHeading}
        </h2>
      </div>
      <div className="activity-list">
        {activities.map(activity => {
          const Icon = activityIcons[activity.icon];

          return (
            <Link
              className="activity-item"
              href={activity.href}
              key={activity.title}
            >
              <span
                aria-hidden="true"
                className="activity-item__icon"
                data-icon={activity.icon}
              >
                <Icon size={20} strokeWidth={1.8} />
              </span>
              <span className="activity-item__copy">
                <strong>{activity.title}</strong>
                <span>{activity.description}</span>
              </span>
              <ChevronRight
                aria-hidden="true"
                className="activity-item__arrow"
                size={18}
                strokeWidth={1.8}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
