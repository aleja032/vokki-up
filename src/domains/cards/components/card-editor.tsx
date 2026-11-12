'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  CARD_EXAMPLE_MAX_LENGTH,
  CARD_PARTS_OF_SPEECH
} from '../card-create.schema';
import { useCardCreateSubmit } from '../hooks/use-card-create-submit';
import {
  useCardEditorAutofill,
  type CardEditorAutofill
} from '../hooks/use-card-editor-autofill';
import { cardsMessages } from '../messages';
import type { CardGroup, VocabularyCard } from '../types';
import { CardEditorAutofill as CardEditorAutofillPanel } from './card-editor-autofill';
import { CardEditorPreview } from './card-editor-preview';
import { DeckFieldError } from './deck-field-error';
import { DeckIcon } from './deck-icon';
import { translateText } from '@/lib/i18n/locale';
import { useAiForCardsEnabled } from '@/lib/settings/use-ai-for-cards-enabled';

const messages = cardsMessages.cardEditor;
// Entry to the (static mockup) AI capture flow.
const AI_CAPTURE_HREF = '/cards/ai';

type CardEditorProps = {
  groups: CardGroup[];
  existingTerms: readonly string[];
  initialGroupId?: string;
  isOpen: boolean;
  onCancel: () => void;
  onSave: (card: VocabularyCard) => void;
  onCreateGroup: () => void;
  onViewExisting: (term: string) => void;
  /** AI autofill from only the English term, wired by the route layer. */
  autofill?: CardEditorAutofill;
  /** Rendered inside the add hub on desktop: the hub provides header and mode selector. */
  isEmbedded?: boolean;
};

export function CardEditor({
  groups,
  existingTerms,
  initialGroupId,
  isOpen,
  onCancel,
  onSave,
  onCreateGroup,
  onViewExisting,
  autofill,
  isEmbedded = false
}: CardEditorProps) {
  // UI-only: the tag input visibility is not card data.
  const [isTagInputVisible, setIsTagInputVisible] = useState(false);
  const [pronunciationLocale, setPronunciationLocale] = useState('en-US');
  const {
    register,
    onSubmit,
    values,
    isValid,
    fieldErrors,
    errorCount,
    isDuplicateTerm,
    activeTags,
    tagOptions,
    selectPartOfSpeech,
    selectGroup,
    toggleTag,
    clearFields,
    applyAutofillValues,
    readAutofillSnapshot
  } = useCardCreateSubmit({
    groups,
    existingTerms,
    initialGroupId,
    onSave: card =>
      onSave({
        ...card,
        pronunciationLocale: isValidPronunciationLocale(pronunciationLocale)
          ? pronunciationLocale
          : 'en-US'
      })
  });
  const { isEnabled: isAiEnabled } = useAiForCardsEnabled();
  const editorAutofill = useCardEditorAutofill({
    autofill: isAiEnabled ? autofill : undefined,
    term: values.term,
    readSnapshot: readAutofillSnapshot,
    applyValues: applyAutofillValues
  });
  const exampleLength = values.example.length;
  const isExampleTooLong = exampleLength > CARD_EXAMPLE_MAX_LENGTH;

  return (
    <section
      className={cn('deck-editor', isEmbedded && 'deck-editor--embedded')}
      data-open={isOpen}
      aria-labelledby="deck-editor-title"
    >
      <form className="deck-editor__form" onSubmit={onSubmit} noValidate>
        <header className="deck-editor__header">
          <button
            className="deck-editor__back"
            type="button"
            onClick={onCancel}
            aria-label={messages.backLabel}
          >
            <DeckIcon name="back" />
          </button>
          <div className="deck-editor__heading">
            <h2 id="deck-editor-title">{messages.title}</h2>
            <span className="deck-editor__subtitle deck-editor__subtitle--compact">
              {messages.subtitleCompact}
            </span>
            <span className="deck-editor__subtitle deck-editor__subtitle--wide">
              {messages.subtitleWide}
            </span>
          </div>
        </header>

        <div className="deck-editor__body">
          <div
            className="deck-modes"
            role="tablist"
            aria-label={messages.modesLabel}
          >
            {isAiEnabled ? (
              <Link
                className="deck-modes__tab"
                href={AI_CAPTURE_HREF}
                role="tab"
                aria-selected={false}
              >
                <span className="deck-modes__badge">
                  {messages.modeAiBadge}
                </span>
                {messages.modeAi}
              </Link>
            ) : (
              <button
                className="deck-modes__tab"
                type="button"
                role="tab"
                aria-selected={false}
                disabled
                title={messages.aiDisabledHint}
              >
                <span className="deck-modes__badge">
                  {messages.modeAiBadge}
                </span>
                {messages.modeAi}
              </button>
            )}
            <button
              className="deck-modes__tab"
              type="button"
              role="tab"
              aria-selected
            >
              {messages.modeManual}
            </button>
          </div>
          {!isAiEnabled && (
            <p className="deck-autofill__message">
              {messages.aiDisabledHint}{' '}
              <Link className="deck-field__link" href="/settings">
                {messages.aiSettingsLink}
              </Link>
            </p>
          )}

          {errorCount > 0 && (
            <div className="deck-summary" role="alert">
              <DeckIcon name="alertTriangle" />
              <span>
                <strong>{messages.errorSummary(errorCount)}</strong>
                <span>{messages.errorSummaryHint}</span>
              </span>
            </div>
          )}

          <CardEditorPreview
            term={values.term}
            meaning={values.meaning}
            phonetics={values.phonetics}
            example={values.example}
            partOfSpeech={values.partOfSpeech}
            tags={activeTags}
          />

          <section
            className="deck-section"
            aria-labelledby="deck-essentials-title"
          >
            <div className="deck-section__heading">
              <span className="deck-section__number">1</span>
              <h3 id="deck-essentials-title">{messages.essentialsTitle}</h3>
            </div>
            <div className="deck-field">
              <label htmlFor="card-term">
                {messages.termLabel} <span aria-hidden="true">*</span>
              </label>
              <input
                id="card-term"
                className="deck-field__input deck-field__input--display"
                type="text"
                autoComplete="off"
                placeholder={messages.termPlaceholder}
                aria-invalid={Boolean(fieldErrors.term)}
                aria-describedby={
                  fieldErrors.term ? 'card-term-error' : undefined
                }
                {...register('term')}
              />
              {fieldErrors.term && (
                <div className="deck-field__error-box">
                  <DeckFieldError id="card-term-error">
                    {fieldErrors.term}
                  </DeckFieldError>
                  {isDuplicateTerm && (
                    <button
                      className="deck-field__link"
                      type="button"
                      onClick={() => onViewExisting(values.term.trim())}
                    >
                      {messages.viewExisting}
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="deck-field">
              <label htmlFor="card-meaning">
                {messages.meaningLabel} <span aria-hidden="true">*</span>
              </label>
              <input
                id="card-meaning"
                className="deck-field__input"
                type="text"
                autoComplete="off"
                placeholder={messages.meaningPlaceholder}
                aria-invalid={Boolean(fieldErrors.meaning)}
                aria-describedby={
                  fieldErrors.meaning ? 'card-meaning-error' : undefined
                }
                {...register('meaning')}
              />
              {fieldErrors.meaning && (
                <DeckFieldError id="card-meaning-error">
                  {fieldErrors.meaning}
                </DeckFieldError>
              )}
              {isAiEnabled && (
                <CardEditorAutofillPanel
                  isAvailable={editorAutofill.isAvailable}
                  canRequest={editorAutofill.canRequest}
                  isLoading={editorAutofill.isLoading}
                  hasTerm={Boolean(values.term.trim())}
                  status={editorAutofill.status}
                  errorMessage={editorAutofill.errorMessage}
                  conflictCount={editorAutofill.conflictCount}
                  onRequest={editorAutofill.requestSuggestion}
                  onReplace={editorAutofill.replaceTypedFields}
                  onKeep={editorAutofill.keepTypedFields}
                />
              )}
            </div>
          </section>

          <section
            className="deck-section deck-section--optional"
            aria-labelledby="deck-context-title"
          >
            <div className="deck-section__heading">
              <span className="deck-section__number">2</span>
              <h3 id="deck-context-title">{messages.contextTitle}</h3>
              <span className="deck-section__badge">{messages.optional}</span>
            </div>
            <div className="deck-field">
              <div className="deck-field__row">
                <label htmlFor="card-example">{messages.exampleLabel}</label>
                <span data-invalid={isExampleTooLong}>
                  {messages.exampleCounter(exampleLength)}
                </span>
              </div>
              <textarea
                id="card-example"
                className="deck-field__input deck-field__input--example"
                rows={3}
                placeholder={messages.examplePlaceholder}
                aria-invalid={Boolean(fieldErrors.example)}
                aria-describedby={
                  fieldErrors.example ? 'card-example-error' : undefined
                }
                {...register('example')}
              />
              {fieldErrors.example && (
                <DeckFieldError id="card-example-error">
                  {fieldErrors.example}
                </DeckFieldError>
              )}
            </div>
            <div className="deck-field">
              <label htmlFor="card-phonetics">{messages.phoneticsLabel}</label>
              <input
                id="card-phonetics"
                className="deck-field__input deck-field__input--ipa"
                type="text"
                autoComplete="off"
                placeholder={messages.phoneticsPlaceholder}
                {...register('phonetics')}
              />
            </div>
            <div className="deck-field">
              <label htmlFor="card-pronunciation-locale">
                {messages.pronunciationLocaleLabel}
              </label>
              <input
                id="card-pronunciation-locale"
                className="deck-field__input"
                type="text"
                autoComplete="off"
                placeholder="en-US"
                value={pronunciationLocale}
                aria-invalid={!isValidPronunciationLocale(pronunciationLocale)}
                onChange={event => setPronunciationLocale(event.target.value)}
              />
            </div>

            <fieldset className="deck-choice">
              <legend>{messages.groupLegend}</legend>
              <div className="deck-choice__options">
                <button
                  className="deck-choice__group"
                  data-tone="neutral"
                  type="button"
                  aria-pressed={values.groupId === ''}
                  onClick={() => selectGroup('')}
                >
                  <span />
                  <span className="deck-choice__label">{messages.noGroup}</span>
                </button>
                {groups.map(group => (
                  <button
                    className="deck-choice__group"
                    data-tone={group.tone}
                    type="button"
                    key={group.id}
                    title={group.name}
                    aria-pressed={values.groupId === group.id}
                    onClick={() => selectGroup(group.id)}
                  >
                    <span />
                    <span className="deck-choice__label">{group.name}</span>
                  </button>
                ))}
                <button
                  className="deck-choice__add"
                  type="button"
                  onClick={onCreateGroup}
                >
                  <DeckIcon name="plus" size={14} />
                  {messages.newGroup}
                </button>
              </div>
            </fieldset>

            <fieldset className="deck-choice">
              <legend>{messages.categoryLegend}</legend>
              <div className="deck-choice__options">
                {CARD_PARTS_OF_SPEECH.map(category => (
                  <button
                    className="deck-choice__category"
                    data-category={category}
                    type="button"
                    key={category}
                    aria-pressed={values.partOfSpeech === category}
                    onClick={() => selectPartOfSpeech(category)}
                  >
                    {translateText(category)}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="deck-choice">
              <legend>{messages.tagsLegend}</legend>
              <div className="deck-choice__options">
                {tagOptions.map(tag => (
                  <button
                    className="deck-choice__tag"
                    type="button"
                    key={tag}
                    title={tag}
                    aria-pressed={activeTags.includes(tag)}
                    onClick={() => toggleTag(tag)}
                  >
                    <span className="deck-choice__label"># {tag}</span>
                  </button>
                ))}
                <button
                  className="deck-choice__tag deck-choice__tag--add"
                  type="button"
                  aria-expanded={isTagInputVisible}
                  onClick={() => setIsTagInputVisible(isVisible => !isVisible)}
                >
                  <DeckIcon name="plus" size={14} />
                  {messages.newTag}
                </button>
              </div>
              {isTagInputVisible && (
                <input
                  className="deck-field__input deck-choice__tag-input"
                  type="text"
                  autoComplete="off"
                  aria-label={messages.tagsInputLabel}
                  placeholder={messages.tagsPlaceholder}
                  {...register('tags')}
                />
              )}
            </fieldset>
          </section>
        </div>

        <footer className="deck-editor__footer">
          <button
            className="deck-editor__cancel"
            type="button"
            onClick={onCancel}
          >
            {messages.cancel}
          </button>
          <button
            className="deck-editor__clear"
            type="button"
            onClick={clearFields}
          >
            {messages.clear}
          </button>
          <button
            className="deck-editor__submit"
            type="submit"
            disabled={!isValid}
            aria-disabled={!isValid}
          >
            <DeckIcon name="check" size={18} />
            {messages.submit}
          </button>
        </footer>
      </form>
    </section>
  );
}

function isValidPronunciationLocale(value: string): boolean {
  try {
    return Intl.getCanonicalLocales(value).length === 1;
  } catch {
    return false;
  }
}
