import Image from 'next/image';
import {
  Briefcase,
  MessageCircle,
  Plane,
  Sun,
  type LucideIcon
} from 'lucide-react';
import { PixelLabel } from '@/components/ui/pixel-label';
import { ProgressBar } from '@/components/ui/progress-bar';
import { translateText } from '@/lib/i18n/locale';
import type { WorldId, WorldProgress } from '@/lib/home/home-hand.types';
import { homeDashboardData } from '../data';
import './world-arch-card.css';

const { copy } = homeDashboardData;

const WORLD_ICONS: Record<WorldId, LucideIcon> = {
  daily: Sun,
  work: Briefcase,
  travel: Plane,
  phrases: MessageCircle
};

export function WorldArchCard({ world }: { world: WorldProgress }) {
  const Icon = WORLD_ICONS[world.id];
  const isActive = world.learned > 0;
  const name = translateText(world.name);

  return (
    <article
      className="world-arch"
      data-state={isActive ? 'active' : 'new'}
      data-world={world.id}
    >
      {isActive ? (
        <>
          <Image
            alt=""
            className="world-arch__image"
            fill
            sizes="(min-width: 768px) 25vw, 176px"
            src="/images/world-daily.png"
            unoptimized
          />
          <span aria-hidden="true" className="world-arch__shade" />
        </>
      ) : (
        <span aria-hidden="true" className="world-arch__icon">
          <Icon size={64} strokeWidth={1.5} />
        </span>
      )}
      <div className="world-arch__info">
        <PixelLabel className="world-arch__state">
          {isActive ? copy.worldActive : copy.worldNew}
        </PixelLabel>
        <h3 className="world-arch__name">{name}</h3>
        <div className="world-arch__progress">
          <ProgressBar
            className="world-arch__bar"
            label={`${name}: ${world.learned}/${world.total}`}
            max={world.total}
            tone="mint"
            value={world.learned}
          />
          <span className="world-arch__count">
            {world.learned}/{world.total}
          </span>
        </div>
      </div>
    </article>
  );
}
