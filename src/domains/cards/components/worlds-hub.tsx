import { Briefcase, Library, MessageCircle, Plane, Sun } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ActionPill } from '@/components/ui/action-pill';
import { ArchCard } from '@/components/ui/arch-card';
import { LevelDiamonds } from '@/components/ui/level-diamonds';
import { PixelLabel } from '@/components/ui/pixel-label';
import { ProgressBar } from '@/components/ui/progress-bar';
import {
  WORD_LIBRARY_LEVELS,
  type WordLibraryLevel
} from '../word-library/catalog';
import { LEVEL_NUMBER, wordLibraryMessages } from '../word-library/messages';
import {
  getWorldDisplayName,
  type WorldId,
  type WorldSummary
} from '../word-library/worlds';
import './worlds-hub.css';

const messages = wordLibraryMessages;

const WORLD_ICONS: Record<WorldId, LucideIcon> = {
  daily: Sun,
  work: Briefcase,
  travel: Plane,
  phrases: MessageCircle
};

/** Pixel art shown by the worlds the user has already started. */
const ACTIVE_WORLD_IMAGE = '/images/world-daily.png';

type WorldsHubProps = {
  worlds: readonly WorldSummary[];
  /** Catalog words per level, across every world. */
  levelTotals: Record<WordLibraryLevel, number>;
};

export function WorldsHub({ worlds, levelTotals }: WorldsHubProps) {
  const total = worlds.reduce((sum, world) => sum + world.total, 0);
  const inDeck = worlds.reduce((sum, world) => sum + world.inDeck, 0);

  return (
    <div className="worlds-hub">
      <header className="worlds-hub__header">
        <div className="worlds-hub__heading">
          <h1 id="word-library-title">{messages.worldsTitle}</h1>
          <p>
            {[
              messages.worldCount(worlds.length),
              messages.wordCount(total),
              messages.inYourDeck(inDeck)
            ].join(' · ')}
          </p>
        </div>
        <div className="worlds-hub__overall">
          <div className="worlds-hub__overall-text">
            <span>{messages.libraryProgress}</span>
            <strong>{messages.libraryOf(inDeck, total)}</strong>
          </div>
          <ProgressBar
            label={`${messages.libraryProgress}: ${messages.libraryOf(inDeck, total)}`}
            max={total}
            value={inDeck}
          />
        </div>
      </header>

      <section className="worlds-hub__grid">
        {worlds.map(world => {
          const Icon = WORLD_ICONS[world.id];
          const isActive = world.inDeck > 0;
          const name = getWorldDisplayName(world);
          return (
            <ArchCard
              description={messages.worldDescriptions[world.id]}
              href={`/cards/word-library?world=${world.id}`}
              icon={<Icon aria-hidden="true" strokeWidth={1.4} />}
              imageSrc={isActive ? ACTIVE_WORLD_IMAGE : undefined}
              isActive={isActive}
              key={world.id}
              progress={{
                value: world.inDeck,
                max: world.total,
                label: messages.worldProgress(name, world.inDeck, world.total)
              }}
              stateLabel={isActive ? messages.worldActive : messages.worldNew}
              title={name}
            />
          );
        })}
      </section>

      <section
        aria-label={messages.levelsSection}
        className="worlds-hub__levels"
      >
        {WORD_LIBRARY_LEVELS.map(level => (
          <div className="worlds-hub__level" key={level}>
            <span className="worlds-hub__level-text">
              <PixelLabel>{messages.levelNames[level]}</PixelLabel>
              <strong>{messages.wordCount(levelTotals[level])}</strong>
            </span>
            <LevelDiamonds
              label={messages.levelOf(LEVEL_NUMBER[level])}
              level={LEVEL_NUMBER[level]}
            />
          </div>
        ))}
      </section>

      <ActionPill
        className="worlds-hub__all"
        href="/cards/word-library?world=all"
        icon={<Library size={18} />}
        variant="outline"
      >
        {messages.openWholeLibrary}
      </ActionPill>
    </div>
  );
}
