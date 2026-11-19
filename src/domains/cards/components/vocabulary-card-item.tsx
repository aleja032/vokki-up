import { Check } from 'lucide-react';
import { PixelLabel } from '@/components/ui/pixel-label';
import { ProgressBar } from '@/components/ui/progress-bar';
import { translateText } from '@/lib/i18n/locale';
import { getCardLearningState, getDueDayOffset } from '../card-learning-state';
import { getCardMemory, MAX_CARD_MEMORY } from '../card-memory';
import { getGroupDisplayName } from '../group-display';
import { cardsMessages } from '../messages';
import type { CardSchedule } from '../scheduling/types';
import type { CardGroup, VocabularyCard } from '../types';
import { getExampleEs } from '../word-library/example-es';
import { ExampleEsToggle } from './example-es-toggle';
import './vocabulary-card-item.css';

const { learningState: stateMessages, dueLabel, overview } = cardsMessages;

type VocabularyCardItemProps = {
  card: VocabularyCard;
  group?: CardGroup;
  schedule?: CardSchedule;
  now: Date;
  isManaging: boolean;
  isSelected: boolean;
  onToggleSelect: (cardId: string) => void;
};

function formatDueLabel(schedule: CardSchedule | undefined, now: Date) {
  if (!schedule) return dueLabel.today;
  const days = getDueDayOffset(schedule.dueAt, now);
  if (days === 0) return dueLabel.today;
  return days === 1 ? dueLabel.tomorrow : dueLabel.inDays(days);
}

export function VocabularyCardItem({
  card,
  group,
  schedule,
  now,
  isManaging,
  isSelected,
  onToggleSelect
}: VocabularyCardItemProps) {
  const learningState = getCardLearningState(schedule);
  const memory = getCardMemory(schedule);
  const groupName = group ? getGroupDisplayName(group) : overview.noGroup;

  return (
    <article
      className="deck-card"
      data-managing={isManaging}
      data-selected={isSelected}
      data-state={learningState}
      data-tone={memory.tone}
    >
      <div className="deck-card__top">
        <PixelLabel className="deck-card__category">
          {translateText(card.partOfSpeech)}
        </PixelLabel>
        <PixelLabel className="deck-card__state">
          {stateMessages[learningState]}
        </PixelLabel>
      </div>
      {isManaging && (
        <>
          <button
            aria-checked={isSelected}
            aria-label={overview.cardSelectLabel(card.term)}
            className="deck-card__select"
            onClick={() => onToggleSelect(card.id)}
            role="checkbox"
            type="button"
          />
          <span className="deck-card__check" aria-hidden="true">
            <Check size={14} strokeWidth={3} />
          </span>
        </>
      )}
      <div className="deck-card__body">
        <h3 className="deck-card__term" title={card.term}>
          {card.term}
        </h3>
        <p className="deck-card__meaning">{card.meaning}</p>
        {card.phonetics && (
          <span className="deck-card__ipa">{card.phonetics}</span>
        )}
        {card.example && (
          <div className="deck-card__example">
            <ExampleEsToggle key={card.id} sentence={getExampleEs(card)}>
              <p className="deck-card__example-text">{card.example}</p>
            </ExampleEsToggle>
          </div>
        )}
      </div>
      <div className="deck-card__footer">
        <span className="deck-card__group" data-tone={group?.tone ?? 'neutral'}>
          <span className="deck-card__group-name" title={groupName}>
            {groupName}
          </span>
        </span>
        <div className="deck-card__memory-row">
          <ProgressBar
            className="deck-card__memory"
            label={overview.memoryLabel(memory.level)}
            max={MAX_CARD_MEMORY}
            segments={MAX_CARD_MEMORY}
            tone={memory.level >= MAX_CARD_MEMORY ? 'mint' : 'muted'}
            value={memory.level}
          />
          <span className="deck-card__due">
            <span
              aria-hidden="true"
              className="deck-card__dot"
              data-tone={memory.tone}
            />
            <PixelLabel>{formatDueLabel(schedule, now)}</PixelLabel>
          </span>
        </div>
      </div>
    </article>
  );
}
