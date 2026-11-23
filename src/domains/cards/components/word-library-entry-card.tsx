import { Check, LockKeyhole } from 'lucide-react';
import { LevelDiamonds } from '@/components/ui/level-diamonds';
import { PixelLabel } from '@/components/ui/pixel-label';
import { TileEyebrow } from '@/components/ui/tile-eyebrow';
import type { WordLibraryEntry } from '../word-library/catalog';
import { getCatalogEntryExampleEs } from '../word-library/example-es';
import { LEVEL_NUMBER, wordLibraryMessages } from '../word-library/messages';
import { getWorldDisplayName, WORLDS } from '../word-library/worlds';
import { ExampleEsToggle } from './example-es-toggle';
import './vocabulary-card-item.css';
import './word-library-entry-card.css';

const messages = wordLibraryMessages;

type WordLibraryEntryCardProps = {
  entry: WordLibraryEntry;
  isAdding: boolean;
  isSelected: boolean;
  isAlreadyAdded: boolean;
  onToggleSelect: (entryId: string) => void;
};

function getCategoryLabel(entry: WordLibraryEntry) {
  const world = WORLDS.find(item => item.category === entry.category);
  return world ? getWorldDisplayName(world) : entry.category;
}

// Same tile as the Mi mazo cards (`deck-card`, shared subgrid rows), with the
// state of the catalog word in the footer instead of the memory bar.
export function WordLibraryEntryCard({
  entry,
  isAdding,
  isSelected,
  isAlreadyAdded,
  onToggleSelect
}: WordLibraryEntryCardProps) {
  const isSelectable = isAdding && !isAlreadyAdded;
  const level = LEVEL_NUMBER[entry.level];

  return (
    <article
      className="deck-card word-entry"
      data-adding={isAdding}
      data-selected={isSelected}
      data-existing={isAlreadyAdded}
    >
      <TileEyebrow
        className="deck-card__top"
        label={getCategoryLabel(entry)}
        trailing={
          <LevelDiamonds
            label={`${messages.levelNames[entry.level]} · ${messages.levelOf(level)}`}
            level={level}
          />
        }
      />
      {isSelectable && (
        <>
          <button
            aria-checked={isSelected}
            aria-label={messages.selectWord(entry.term)}
            className="deck-card__select"
            onClick={() => onToggleSelect(entry.id)}
            role="checkbox"
            type="button"
          />
          <span className="deck-card__check" aria-hidden="true">
            <Check size={14} strokeWidth={3} />
          </span>
        </>
      )}
      <div className="deck-card__body">
        <h2 className="deck-card__term" title={entry.term}>
          {entry.term}
        </h2>
        <p className="deck-card__meaning">{entry.meaning}</p>
        <span className="deck-card__ipa">{entry.phonetics}</span>
        <div className="deck-card__example">
          <ExampleEsToggle
            key={entry.id}
            sentence={getCatalogEntryExampleEs(entry)}
          >
            <p className="deck-card__example-text">“{entry.example}”</p>
          </ExampleEsToggle>
        </div>
      </div>
      <div className="deck-card__footer">
        {isAlreadyAdded ? (
          <p className="word-entry__existing">
            <LockKeyhole aria-hidden="true" size={14} />
            {messages.alreadyInLibrary}
          </p>
        ) : (
          <PixelLabel className="word-entry__state">
            {isSelected ? messages.selectedState : messages.notAdded}
          </PixelLabel>
        )}
      </div>
    </article>
  );
}
