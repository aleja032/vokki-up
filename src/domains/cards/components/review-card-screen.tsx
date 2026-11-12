'use client';

import { useEffect } from 'react';
import { cardsMessages } from '../messages';
import type { CardRating, VocabularyCard } from '../types';
import { REVIEW_RATINGS, type ReviewRating } from '../hooks/use-card-review';
import { ReviewIcon } from './review-icon';
import { translateText } from '@/lib/i18n/locale';
import { useSettingsPreferences } from '@/domains/settings/hooks/use-settings-preferences';

const messages = cardsMessages.review;

const RATING_KEYS: Record<ReviewRating, number> = {
  again: 1,
  good: 2,
  easy: 3
};

type ReviewCardScreenProps = {
  card: VocabularyCard;
  isRevealed: boolean;
  getIntervalLabel: (rating: CardRating) => string;
  onReveal: () => void;
  onRate: (rating: CardRating) => void;
};

function speakPronunciation(card: VocabularyCard): void {
  if (
    !card.term.trim() ||
    typeof window === 'undefined' ||
    !('speechSynthesis' in window) ||
    typeof SpeechSynthesisUtterance === 'undefined'
  )
    return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(card.term);
    utterance.lang = card.pronunciationLocale ?? 'en-US';
    window.speechSynthesis.speak(utterance);
  } catch {
    // Speech synthesis can be unavailable or blocked by browser policy.
  }
}

function splitExample(example: string, term: string) {
  const start = example.toLowerCase().indexOf(term.toLowerCase());
  if (start === -1) return { before: example, match: '', after: '' };
  const end = start + term.length;
  return {
    before: example.slice(0, start),
    match: example.slice(start, end),
    after: example.slice(end)
  };
}

export function ReviewCardScreen({
  card,
  isRevealed,
  getIntervalLabel,
  onReveal,
  onRate
}: ReviewCardScreenProps) {
  const settings = useSettingsPreferences();
  const shouldAutoPlayPronunciation = settings.shouldAutoPlayPronunciation;
  const example = card.example ? splitExample(card.example, card.term) : null;

  useEffect(() => {
    if (shouldAutoPlayPronunciation) speakPronunciation(card);
  }, [card, shouldAutoPlayPronunciation]);

  return (
    <>
      <section className="drill-card" aria-labelledby="review-term">
        <div className="drill-card__meta">
          <span
            className="drill-card__category"
            data-category={card.partOfSpeech}
            title={translateText(card.partOfSpeech)}
          >
            {translateText(card.partOfSpeech)}
          </span>
          {card.tags[0] && (
            <span className="drill-card__tag" title={card.tags[0]}>
              # {card.tags[0]}
            </span>
          )}
        </div>
        <div className="drill-card__term">
          <h1 className="drill-card__word" id="review-term">
            {card.term}
          </h1>
          <div className="drill-card__pronunciation">
            {card.phonetics && (
              <span className="drill-card__ipa">{card.phonetics}</span>
            )}
            <button
              className="drill-card__listen"
              type="button"
              aria-label={messages.listenLabel}
              title={messages.listenLabel}
              onClick={() => speakPronunciation(card)}
            >
              <ReviewIcon name="speaker" size={20} />
            </button>
          </div>
          <label className="drill-card__autoplay">
            <input
              type="checkbox"
              checked={shouldAutoPlayPronunciation}
              onChange={event =>
                settings.changeAutoPlayPronunciation(event.target.checked)
              }
            />
            {messages.autoPlayLabel}
          </label>
        </div>
        {isRevealed ? (
          <div className="drill-card__answer" aria-live="polite">
            <div className="drill-card__block">
              <span className="drill-card__label">{messages.meaningLabel}</span>
              <span className="drill-card__meaning">{card.meaning}</span>
            </div>
            {example && (
              <div className="drill-card__example">
                <span className="drill-card__label">
                  {messages.exampleLabel}
                </span>
                <span className="drill-card__sentence">
                  {example.before}
                  {example.match && <strong>{example.match}</strong>}
                  {example.after}
                </span>
              </div>
            )}
          </div>
        ) : (
          <button className="drill-card__hint" type="button" onClick={onReveal}>
            <ReviewIcon name="eye" size={24} />
            {messages.revealHint}
          </button>
        )}
      </section>
      {isRevealed ? (
        <div
          className="drill-ratings"
          role="group"
          aria-label={messages.ratingsLabel}
        >
          <span className="drill-ratings__prompt">{messages.ratingPrompt}</span>
          <div className="drill-ratings__grid">
            {REVIEW_RATINGS.map(rating => (
              <button
                className="drill-rating"
                data-tone={rating}
                type="button"
                key={rating}
                onClick={() => onRate(rating)}
              >
                <span className="drill-rating__label">
                  {messages.ratings[rating]}
                </span>
                <span className="drill-rating__hint">
                  {getIntervalLabel(rating)}
                  <span className="drill-rating__key">
                    {' · '}
                    {messages.keyHint(RATING_KEYS[rating])}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="drill-reveal">
          <button
            className="drill-reveal__action"
            type="button"
            onClick={onReveal}
          >
            {messages.revealAction}
          </button>
          <span className="drill-reveal__shortcut">
            {messages.shortcutLabel} <kbd>{messages.spaceKey}</kbd>
          </span>
        </div>
      )}
    </>
  );
}
