import { LevelDiamonds } from '@/components/ui/level-diamonds';
import { PixelLabel } from '@/components/ui/pixel-label';
import { ProgressBar } from '@/components/ui/progress-bar';
import {
  WORD_LIBRARY_LEVELS,
  type WordLibraryLevelFilter
} from '../word-library/catalog';
import { LEVEL_NUMBER, wordLibraryMessages } from '../word-library/messages';
import type { WorldSummary } from '../word-library/worlds';
import './world-stages.css';

const messages = wordLibraryMessages;

type WorldStagesProps = {
  world: WorldSummary;
  /** The level the list is filtered by; that stage is highlighted. */
  activeLevel: WordLibraryLevelFilter;
};

// One card per level of the world: how many of its words are already in the deck.
export function WorldStages({ world, activeLevel }: WorldStagesProps) {
  return (
    <section aria-label={messages.levelsSection} className="world-stages">
      {WORD_LIBRARY_LEVELS.map(level => {
        const progress = world.levels[level];
        const number = LEVEL_NUMBER[level];
        const summary = `${messages.levelNames[level]} · ${progress.inDeck}/${progress.total}`;
        return (
          <div
            className="world-stages__stage"
            data-active={activeLevel === level}
            key={level}
          >
            <span className="world-stages__top">
              <PixelLabel className="world-stages__label">
                {messages.stage(number)}
              </PixelLabel>
              <LevelDiamonds label={messages.levelOf(number)} level={number} />
            </span>
            <ProgressBar
              className="world-stages__bar"
              label={summary}
              max={progress.total}
              value={progress.inDeck}
            />
            <span className="world-stages__summary">{summary}</span>
          </div>
        );
      })}
    </section>
  );
}
