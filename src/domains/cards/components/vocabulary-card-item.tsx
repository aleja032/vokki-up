import type { CSSProperties } from 'react';
import {
  LEARNING_STATE_PROGRESS,
  getCardLearningState,
  getDueDayOffset
} from '../card-learning-state';
import { cardsMessages } from '../messages';
import type { CardSchedule } from '../scheduling/types';
import type { CardGroup, VocabularyCard } from '../types';

const { learningState: stateMessages, dueLabel, overview } = cardsMessages;

type VocabularyCardItemProps = {
  card: VocabularyCard;
  group?: CardGroup;
  schedule?: CardSchedule;
  now: Date;
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
  now
}: VocabularyCardItemProps) {
  const learningState = getCardLearningState(schedule);
  const progressStyle = {
    '--deck-progress': `${LEARNING_STATE_PROGRESS[learningState]}%`
  } as CSSProperties;

  return (
    <article className="deck-card">
      <div className="deck-card__top">
        <div className="deck-card__title">
          <h3>{card.term}</h3>
          {card.phonetics && <span>{card.phonetics}</span>}
        </div>
        <span className="deck-card__category" data-category={card.partOfSpeech}>
          {card.partOfSpeech}
        </span>
      </div>
      <p className="deck-card__meaning">{card.meaning}</p>
      {card.example && <p className="deck-card__example">{card.example}</p>}
      <div className="deck-card__footer">
        <span className="deck-card__group" data-tone={group?.tone ?? 'neutral'}>
          {group?.name ?? overview.noGroup}
        </span>
        <div
          className="deck-card__bar"
          data-state={learningState}
          style={progressStyle}
        />
        <span className="deck-card__state" data-state={learningState}>
          {stateMessages[learningState]}
        </span>
        <span className="deck-card__due">
          · {formatDueLabel(schedule, now)}
        </span>
      </div>
    </article>
  );
}
