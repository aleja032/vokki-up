import Image from 'next/image';
import { PixelLabel } from '@/components/ui/pixel-label';
import { ProgressBar } from '@/components/ui/progress-bar';
import { WORLD_IMAGES } from '@/lib/worlds/world-images';
import { getWorldDisplayName } from '@/lib/home/derive-worlds';
import type { WorldProgress } from '@/lib/home/home-hand.types';
import { homeDashboardData } from '../data';
import './world-arch-card.css';

const { copy } = homeDashboardData;

export function WorldArchCard({ world }: { world: WorldProgress }) {
  const isActive = world.learned > 0;
  const name = getWorldDisplayName(world.name);

  return (
    <article
      className="world-arch"
      data-state={isActive ? 'active' : 'new'}
      data-world={world.id}
    >
      <Image
        alt=""
        className="world-arch__image"
        fill
        sizes="(min-width: 768px) 25vw, 176px"
        src={WORLD_IMAGES[world.id]}
        unoptimized
      />
      {/* A world not started shows its scene dimmed, so it reads as locked. */}
      {!isActive && <span aria-hidden="true" className="world-arch__veil" />}
      <span aria-hidden="true" className="world-arch__shade" />
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
            tone="brand"
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
