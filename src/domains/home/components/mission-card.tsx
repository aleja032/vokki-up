import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { ActionPill } from '@/components/ui/action-pill';
import { translateText } from '@/lib/i18n/locale';
import type { HomeMission } from '@/lib/home/home-hand.types';
import { homeDashboardData } from '../data';
import './advance-card.css';
import './mission-card.css';

const { copy } = homeDashboardData;

export function MissionCard({
  mission,
  worldName,
  href
}: {
  mission: HomeMission;
  worldName: string;
  href: string;
}) {
  const world = translateText(worldName);

  return (
    <article className="advance-card mission-card">
      <h2 className="advance-card__title">{copy.mission.heading}</h2>
      <div className="mission-card__body">
        <span className="mission-card__art">
          <Image
            alt={copy.mission.imageAlt(world)}
            className="mission-card__image"
            fill
            sizes="112px"
            src="/images/world-daily.png"
            unoptimized
          />
        </span>
        <div className="mission-card__copy">
          <p className="mission-card__name">{world}</p>
          <p className="mission-card__text">
            {copy.mission.description(mission.steps.length)}
          </p>
        </div>
      </div>
      <ActionPill
        className="mission-card__cta"
        href={href}
        iconEnd={<ChevronRight size={22} strokeWidth={2.6} />}
      >
        {mission.nextTerm
          ? copy.mission.cta(mission.nextTerm)
          : copy.mission.completeCta}
      </ActionPill>
    </article>
  );
}
