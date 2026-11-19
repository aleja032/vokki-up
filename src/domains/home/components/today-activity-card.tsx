import Link from 'next/link';
import { BookOpen, ChevronRight, FileText, PenLine } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import type { HomeActivity } from '../types';
import { homeDashboardData } from '../data';
import './today-activity-card.css';

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
      aria-label={homeDashboardData.copy.todayActivityHeading}
      className="today-activity"
    >
      <SectionHeading
        pixel
        title={homeDashboardData.copy.todayActivityHeading}
      />
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
                <Icon size={22} strokeWidth={2} />
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
