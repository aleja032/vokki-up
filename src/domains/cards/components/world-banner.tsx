import Image from 'next/image';
import { Briefcase, MessageCircle, Plane, Sun } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { LocationCrumb } from '@/components/ui/location-crumb';
import { wordLibraryMessages } from '../word-library/messages';
import {
  getWorldDisplayName,
  type WorldId,
  type WorldSummary
} from '../word-library/worlds';
import './world-banner.css';

const messages = wordLibraryMessages;

const WORLD_ICONS: Record<WorldId, LucideIcon> = {
  daily: Sun,
  work: Briefcase,
  travel: Plane,
  phrases: MessageCircle
};

type WorldBannerProps = { world: WorldSummary };

// Header of one world: back link to the hub, its name and its real counts.
export function WorldBanner({ world }: WorldBannerProps) {
  const Icon = WORLD_ICONS[world.id];
  const isActive = world.inDeck > 0;

  return (
    <section className="world-banner">
      <span aria-hidden="true" className="world-banner__art">
        {isActive ? (
          <Image
            alt=""
            className="world-banner__image"
            fill
            sizes="(min-width: 768px) 50vw, 60vw"
            src="/images/world-daily.png"
            unoptimized
          />
        ) : (
          <Icon className="world-banner__icon" strokeWidth={1.2} />
        )}
        <span className="world-banner__shade" />
      </span>
      <div className="world-banner__content">
        <LocationCrumb
          ariaLabel={messages.locationLabel}
          currentLabel={getWorldDisplayName(world)}
          icon={<Icon size={16} />}
          kindLabel={messages.worldKind}
          onHero
          rootHref="/cards/word-library"
          rootLabel={messages.backToWorlds}
        />
        <h1 id="word-library-title">{getWorldDisplayName(world)}</h1>
        <p>
          {[
            messages.wordCount(world.total),
            messages.inYourDeck(world.inDeck)
          ].join(' · ')}
        </p>
      </div>
    </section>
  );
}
