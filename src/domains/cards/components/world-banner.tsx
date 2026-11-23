import Image from 'next/image';
import { Briefcase, MessageCircle, Plane, Sun } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { LocationCrumb } from '@/components/ui/location-crumb';
import { wordLibraryCatalog } from '../word-library/catalog';
import { wordLibraryMessages } from '../word-library/messages';
import { pickWorldTagWords, WORLD_ART } from '../word-library/world-art';
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

// Header of one world: back link to the hub, its name and its real counts,
// over the world's pixel art. Real words of the world float over the art on
// wide screens (unless the scene already has words drawn in it).
export function WorldBanner({ world }: WorldBannerProps) {
  const Icon = WORLD_ICONS[world.id];
  const art = WORLD_ART[world.id];
  const tags = art.hasWords
    ? []
    : pickWorldTagWords(wordLibraryCatalog, world.category);

  return (
    <section className="world-banner" data-world={world.id}>
      <span aria-hidden="true" className="world-banner__art">
        <Image
          alt=""
          className="world-banner__image"
          fill
          sizes="(min-width: 768px) 50vw, 60vw"
          src={art.src}
          unoptimized
        />
        <span className="world-banner__shade" />
      </span>
      {tags.length > 0 ? (
        <ul aria-hidden="true" className="world-banner__tags">
          {tags.map(word => (
            <li className="world-banner__tag motion-float-tag" key={word}>
              {word}
            </li>
          ))}
        </ul>
      ) : null}
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
