'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useSyncExternalStore
} from 'react';
import { ActionPill } from '@/components/ui/action-pill';
import { PixelLabel } from '@/components/ui/pixel-label';
import { cardsMessages } from '../messages';
import type { CardRating, VocabularyCard } from '../types';
import type { CardMemory } from '../card-memory';
import { getExampleEs } from '../word-library/example-es';
import { ExampleEsToggle } from './example-es-toggle';
import { ReviewCompanion, ReviewCompanionBadge } from './review-companion';
import { ReviewIcon } from './review-icon';
import { ReviewMemoryFooter } from './review-memory-footer';
import { ReviewRatingButtons } from './review-rating-buttons';
import { normalizePronunciationLocale, translateText } from '@/lib/i18n/locale';

const messages = cardsMessages.review;

type ReviewCardScreenProps = {
  card: VocabularyCard;
  isRevealed: boolean;
  /** Memory strength of the card; the footer is omitted without it. */
  memory?: CardMemory;
  /** Current run of recalled cards; a run of two or more is cheered. */
  combo?: number;
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
  isAttemptCurrent: () => boolean = () => true,
  /** The browser refused to speak without a user gesture (autoplay policy). */
  onBlocked?: () => void
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
      if (event.error === 'not-allowed' && onBlocked) {
        onBlocked();
        return;
      }
      if (event.error !== 'canceled' && event.error !== 'interrupted')
        onFailure();
    };
    window.speechSynthesis.speak(utterance);
  } catch {
    onFailure();
  }
}

/** The example is read after the word only once the meaning is revealed. */
export function getReplayExample(
  isRevealed: boolean,
  example: string | undefined
): string | undefined {
  return isRevealed ? example : undefined;
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
  memory,
  combo = 0,
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
  const exampleEs = getExampleEs(card);

  const cancelBlockedRetry = useRef<(() => void) | null>(null);

  useLayoutEffect(() => {
    return () => {
      activeSpeechAttemptId.current = null;
      cancelBlockedRetry.current?.();
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
      cancelBlockedRetry.current?.();
      dispatchSpeechAttempt({ type: 'started', attemptId });
      if (!isSpeechSupported) return;
      const isCurrent = () => activeSpeechAttemptId.current === attemptId;
      const onFailure = () =>
        dispatchSpeechAttempt({ type: 'failed', attemptId });
      // Browsers refuse speech with no user gesture on a fresh page. Instead of
      // failing, wait for the first tap or key press and speak then.
      const onBlocked = () => {
        if (!isCurrent()) return;
        const retry = () => {
          stopWaiting();
          if (!isCurrent()) return;
          speakPronunciation(
            phrase,
            card.pronunciationLocale,
            followWithExample,
            onFailure,
            isCurrent
          );
        };
        const stopWaiting = () => {
          window.removeEventListener('pointerdown', retry, true);
          window.removeEventListener('keydown', retry, true);
          cancelBlockedRetry.current = null;
        };
        window.addEventListener('pointerdown', retry, true);
        window.addEventListener('keydown', retry, true);
        cancelBlockedRetry.current = stopWaiting;
      };
      speakPronunciation(
        phrase,
        card.pronunciationLocale,
        followWithExample,
        onFailure,
        isCurrent,
        onBlocked
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

  const topLabel = [card.tags[0], translateText(card.partOfSpeech)]
    .filter(Boolean)
    .join(' · ');

  return (
    <>
      <div className="drill-stage">
        <div className="drill-stage__card">
          <section
            className="drill-card"
            aria-labelledby="review-term"
            data-revealed={isRevealed || undefined}
          >
            <PixelLabel className="drill-card__top">{topLabel}</PixelLabel>
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
                    startSpeechAttempt(
                      isSpeechSupported,
                      card.term,
                      getReplayExample(isRevealed, card.example)
                    )
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
              {speechAttempt.failedAttemptId ===
                speechAttempt.activeAttemptId &&
                speechAttempt.failedAttemptId !== null &&
                isSpeechSupported && (
                  <p className="drill-card__speech-status" role="status">
                    {messages.speechFailed}
                  </p>
                )}
            </div>
            {isRevealed ? (
              <div className="drill-card__answer" aria-live="polite">
                <span className="sr-only">{messages.meaningLabel}</span>
                <span className="drill-card__meaning">{card.meaning}</span>
                {example && (
                  <div className="drill-card__example">
                    <span className="sr-only">{messages.exampleLabel}</span>
                    <ExampleEsToggle key={card.id} sentence={exampleEs}>
                      <span className="drill-card__sentence">
                        {example.before}
                        {example.match && <strong>{example.match}</strong>}
                        {example.after}
                      </span>
                    </ExampleEsToggle>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="drill-card__hint"
                type="button"
                onClick={onReveal}
              >
                <ReviewIcon name="eye" size={24} />
                {messages.revealHint}
              </button>
            )}
            {memory && <ReviewMemoryFooter memory={memory} />}
          </section>
          <ReviewCompanionBadge />
        </div>
        <ReviewCompanion combo={combo} />
      </div>
      <div className="drill-actions">
        {isRevealed ? (
          <ReviewRatingButtons
            getIntervalLabel={getIntervalLabel}
            onRate={onRate}
          />
        ) : (
          <ActionPill
            className="drill-actions__reveal"
            onClick={onReveal}
            variant="primary"
          >
            {messages.revealAction}
          </ActionPill>
        )}
      </div>
    </>
  );
}
