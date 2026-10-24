'use client';

import { GROUP_TONES } from '../group-colors';
import { useGroupCreateSubmit } from '../hooks/use-group-create-submit';
import { cardsMessages } from '../messages';
import type { CardGroup } from '../types';
import { DeckFieldError } from './deck-field-error';
import { DeckIcon } from './deck-icon';

const messages = cardsMessages.groupCreate;
const NAME_COUNTER_LIMIT = 30;

type GroupCreateFormProps = {
  groups: CardGroup[];
  onCancel: () => void;
  onCreate: (group: CardGroup) => void;
};

export function GroupCreateForm({
  groups,
  onCancel,
  onCreate
}: GroupCreateFormProps) {
  const {
    register,
    onSubmit,
    name,
    tone,
    nameError,
    isValid,
    selectTone,
    applySuggestion
  } = useGroupCreateSubmit({ groups, onCreate });
  const trimmedName = name.trim();

  return (
    <section
      className="deck-screen deck-screen--form"
      aria-labelledby="group-create-title"
    >
      <form className="deck-screen__form" onSubmit={onSubmit} noValidate>
        <header className="deck-screen__header">
          <button
            className="deck-screen__back"
            type="button"
            onClick={onCancel}
            aria-label={messages.backLabel}
          >
            <DeckIcon name="back" />
          </button>
          <h1 id="group-create-title">{messages.title}</h1>
        </header>

        <div className="deck-screen__body">
          <section
            className="deck-group-preview"
            aria-label={messages.previewLabel}
            aria-live="polite"
          >
            <div className="deck-group-preview__card" data-tone={tone}>
              <span className="deck-group-preview__icon">
                <DeckIcon name="folder" />
              </span>
              <span className="deck-group-preview__copy">
                <span data-empty={!trimmedName}>
                  {trimmedName || messages.previewFallbackName}
                </span>
                <span>{messages.previewCardCount}</span>
              </span>
            </div>
          </section>

          <div className="deck-field">
            <div className="deck-field__row">
              <label htmlFor="group-name">
                {messages.nameLabel} <span aria-hidden="true">*</span>
              </label>
              <span data-invalid={name.length > NAME_COUNTER_LIMIT}>
                {name.length} / {NAME_COUNTER_LIMIT}
              </span>
            </div>
            <input
              id="group-name"
              className="deck-field__input deck-field__input--name"
              type="text"
              maxLength={60}
              autoComplete="off"
              placeholder={messages.namePlaceholder}
              aria-invalid={Boolean(nameError)}
              aria-describedby={nameError ? 'group-name-error' : undefined}
              autoFocus
              {...register('name')}
            />
            {nameError && (
              <DeckFieldError id="group-name-error" role="alert">
                {nameError}
              </DeckFieldError>
            )}
            <div className="deck-ideas">
              <span>{messages.ideasLabel}</span>
              {messages.suggestions.map(idea => (
                <button
                  type="button"
                  key={idea}
                  onClick={() => applySuggestion(idea)}
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>

          <fieldset className="deck-choice">
            <legend>{messages.colorLegend}</legend>
            <div className="deck-colors">
              {GROUP_TONES.map(groupTone => (
                <button
                  key={groupTone}
                  type="button"
                  className="deck-colors__option"
                  data-tone={groupTone}
                  onClick={() => selectTone(groupTone)}
                  aria-label={messages.colorNames[groupTone]}
                  aria-pressed={tone === groupTone}
                >
                  <span />
                </button>
              ))}
            </div>
          </fieldset>

          <div className="deck-field">
            <label htmlFor="group-description">
              {messages.descriptionLabel}{' '}
              <span className="deck-field__hint">
                {messages.descriptionOptional}
              </span>
            </label>
            <textarea
              id="group-description"
              className="deck-field__input deck-field__input--text"
              rows={2}
              placeholder={messages.descriptionPlaceholder}
              {...register('description')}
            />
          </div>
        </div>

        <footer className="deck-screen__footer">
          <button
            className="deck-screen__cancel"
            type="button"
            onClick={onCancel}
          >
            {messages.cancel}
          </button>
          <button
            className="deck-screen__submit"
            type="submit"
            disabled={!isValid}
          >
            {messages.submit}
          </button>
        </footer>
      </form>
    </section>
  );
}
