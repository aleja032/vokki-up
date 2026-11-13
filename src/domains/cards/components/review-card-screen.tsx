'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useSyncExternalStore
} from 'react';
import { cardsMessages } from '../messages';
import type { CardRating, VocabularyCard } from '../types';
import { REVIEW_RATINGS, type ReviewRating } from '../hooks/use-card-review';
import { ReviewIcon } from './review-icon';
import { normalizePronunciationLocale, translateText } from '@/lib/i18n/locale';

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

type SpeechAttemptState = {
  activeAttemptId: number | null;
  failedAttemptId: number | null;
};

type SpeechAttemptAction =
  | { type: 'started'; attemptId: number }
  | { type: 'failed'; attemptId: number };

export const initialSpeechAttemptState: SpeechAttemptState = {
  activeAttemptId: null,
  failedAttemptId: null
};

export function speechAttemptReducer(
  state: SpeechAttemptState,
  action: SpeechAttemptAction
): SpeechAttemptState {
  if (action.type === 'started') {
    return { activeAttemptId: action.attemptId, failedAttemptId: null };
  }
  if (state.activeAttemptId !== action.attemptId) return state;
  return { ...state, failedAttemptId: action.attemptId };
}

function hasSpeechSynthesis(): boolean {
  try {
    return (
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      typeof window.speechSynthesis?.speak === 'function' &&
      typeof SpeechSynthesisUtterance !== 'undefined'
    );
  } catch {
    return false;
  }
}

function subscribeToSpeechSupport(): () => void {
  return () => undefined;
}

export function speakPronunciation(
  term: string,
  pronunciationLocale: string | undefined,
  example: string | undefined,
  onFailure: () => void,
  isAttemptCurrent: () => boolean = () => true
): void {
  if (!term.trim() || !hasSpeechSynthesis()) {
    onFailure();
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(term);
    utterance.lang = normalizePronunciationLocale(pronunciationLocale);
    utterance.onend = () => {
      if (!example?.trim() || !isAttemptCurrent()) return;
      try {
        const exampleUtterance = new SpeechSynthesisUtterance(example);
        exampleUtterance.lang =
          normalizePronunciationLocale(pronunciationLocale);
        exampleUtterance.onerror = event => {
          if (event.error !== 'canceled' && event.error !== 'interrupted')
            onFailure();
        };
        window.speechSynthesis.speak(exampleUtterance);
      } catch {
        onFailure();
      }
    };
    utterance.onerror = event => {
      if (event.error !== 'canceled' && event.error !== 'interrupted')
        onFailure();
    };
    window.speechSynthesis.speak(utterance);
  } catch {
    onFailure();
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
  const isSpeechSupported = useSyncExternalStore(
    subscribeToSpeechSupport,
    hasSpeechSynthesis,
    () => false
  );
  const [speechAttempt, dispatchSpeechAttempt] = useReducer(
    speechAttemptReducer,
    initialSpeechAttemptState
  );
  const speechAttemptSequence = useRef(0);
  const activeSpeechAttemptId = useRef<number | null>(null);
  const lastAutoPlayCardId = useRef<string | null>(null);
  const previousRevealState = useRef({ cardId: card.id, isRevealed });
  const example = card.example ? splitExample(card.example, card.term) : null;

  useLayoutEffect(() => {
    return () => {
      activeSpeechAttemptId.current = null;
      if (hasSpeechSynthesis()) window.speechSynthesis.cancel();
    };
  }, [card.id]);

  const startSpeechAttempt = useCallback(
    (
      isSpeechSupported: boolean,
      phrase = card.term,
      followWithExample?: string
    ) => {
      const attemptId = ++speechAttemptSequence.current;
      activeSpeechAttemptId.current = attemptId;
      dispatchSpeechAttempt({ type: 'started', attemptId });
      if (!isSpeechSupported) return;
      speakPronunciation(
        phrase,
        card.pronunciationLocale,
        followWithExample,
        () => dispatchSpeechAttempt({ type: 'failed', attemptId }),
        () => activeSpeechAttemptId.current === attemptId
      );
    },
    [card.term, card.pronunciationLocale]
  );

  useEffect(() => {
    if (isSpeechSupported && lastAutoPlayCardId.current === card.id) return;
    if (isSpeechSupported) lastAutoPlayCardId.current = card.id;
    startSpeechAttempt(isSpeechSupported, card.term);
  }, [card.id, card.term, isSpeechSupported, startSpeechAttempt]);

  useEffect(() => {
    const previous = previousRevealState.current;
    previousRevealState.current = { cardId: card.id, isRevealed };
    if (
      previous.cardId !== card.id ||
      previous.isRevealed ||
      !isRevealed ||
      !card.example?.trim()
    ) {
      return;
    }
    startSpeechAttempt(isSpeechSupported, card.example);
  }, [
    card.example,
    card.id,
    isRevealed,
    isSpeechSupported,
    startSpeechAttempt
  ]);

  return (
    <>
      <section
        className="drill-card"
        aria-labelledby="review-term"
        data-revealed={isRevealed || undefined}
      >
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
              aria-label={
                isSpeechSupported
                  ? messages.listenLabel
                  : messages.speechUnavailable
              }
              title={
                isSpeechSupported
                  ? messages.listenLabel
                  : messages.speechUnavailable
              }
              disabled={!isSpeechSupported}
              onClick={() =>
                startSpeechAttempt(isSpeechSupported, card.term, card.example)
              }
            >
              <ReviewIcon name="speaker" size={20} />
            </button>
          </div>
          {!isSpeechSupported && (
            <p className="drill-card__speech-status" role="status">
              {messages.speechUnavailable}
            </p>
          )}
          {speechAttempt.failedAttemptId === speechAttempt.activeAttemptId &&
            speechAttempt.failedAttemptId !== null &&
            isSpeechSupported && (
              <p className="drill-card__speech-status" role="status">
                {messages.speechFailed}
              </p>
            )}
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
