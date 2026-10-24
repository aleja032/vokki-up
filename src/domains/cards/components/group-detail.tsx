'use client';

import Link from 'next/link';
import { getCardLearningState } from '../card-learning-state';
import { useGroupActionsMenu } from '../hooks/use-group-actions-menu';
import { cardsMessages } from '../messages';
import type { CardScheduleMap } from '../scheduling/types';
import type { CardGroup, VocabularyCard } from '../types';
import { DeckIcon } from './deck-icon';

const messages = cardsMessages.groupDetail;
const stateMessages = cardsMessages.learningState;

type GroupDetailProps = {
  group: CardGroup;
  cards: VocabularyCard[];
  schedules: CardScheduleMap;
  dueCount: number;
  masteredPercent: number;
  onBack: () => void;
  onAddCard: () => void;
};

export function GroupDetail({
  group,
  cards,
  schedules,
  dueCount,
  masteredPercent,
  onBack,
  onAddCard
}: GroupDetailProps) {
  const {
    isMenuOpen,
    isConfirmingDelete,
    toggleMenu,
    closeMenu,
    askDelete,
    dismissDelete
  } = useGroupActionsMenu();

  return (
    <section
      className="deck-screen deck-screen--detail"
      aria-labelledby="group-detail-title"
    >
      <header className="deck-screen__header">
        <button
          className="deck-screen__back"
          type="button"
          onClick={onBack}
          aria-label={messages.backLabel}
        >
          <DeckIcon name="back" />
        </button>
        <span className="deck-screen__eyebrow">{messages.eyebrow}</span>
        <button
          className="deck-screen__icon-button"
          type="button"
          aria-label={messages.menuLabel}
          aria-expanded={isMenuOpen}
          aria-haspopup="menu"
          onClick={toggleMenu}
        >
          <DeckIcon name="more" />
        </button>
      </header>
      {isMenuOpen && (
        <div
          className="deck-menu"
          role="menu"
          aria-label={messages.menuAriaLabel}
        >
          <button type="button" role="menuitem" onClick={closeMenu}>
            {messages.menuRename}
          </button>
          <button type="button" role="menuitem" onClick={closeMenu}>
            {messages.menuRecolor}
          </button>
          <button
            className="deck-menu__danger"
            type="button"
            role="menuitem"
            onClick={askDelete}
          >
            {messages.menuDelete}
          </button>
        </div>
      )}
      <div className="deck-screen__body">
        {isConfirmingDelete && (
          <div
            className="deck-confirm"
            role="alertdialog"
            aria-labelledby="group-delete-title"
          >
            <div className="deck-confirm__copy">
              <span id="group-delete-title">
                {messages.deleteTitle(group.name)}
              </span>
              <span>{messages.deleteBody(cards.length)}</span>
            </div>
            <div className="deck-confirm__actions">
              <button type="button" onClick={dismissDelete}>
                {messages.deleteCancel}
              </button>
              <button
                className="deck-confirm__danger"
                type="button"
                onClick={dismissDelete}
              >
                {messages.deleteConfirm}
              </button>
            </div>
          </div>
        )}
        <section className="deck-hero" data-tone={group.tone}>
          <div className="deck-hero__identity">
            <span className="deck-hero__icon">
              <DeckIcon name="folder" size={26} />
            </span>
            <div>
              <h1 id="group-detail-title">{group.name}</h1>
              {group.description && <span>{group.description}</span>}
            </div>
          </div>
          <div className="deck-hero__stats">
            <div>
              <strong>{cards.length}</strong>
              <span>{messages.statCards(cards.length)}</span>
            </div>
            <div>
              <strong>{dueCount}</strong>
              <span>{messages.statDue}</span>
            </div>
            <div>
              <strong>{masteredPercent}%</strong>
              <span>{messages.statMastered}</span>
            </div>
          </div>
          <Link
            className="deck-hero__review"
            href={`/review?groupId=${encodeURIComponent(group.id)}`}
          >
            {messages.review(dueCount)}
            <DeckIcon name="arrowRight" size={18} />
          </Link>
        </section>
        <div className="deck-screen__list-heading">
          <h2>{messages.listTitle}</h2>
          <button type="button" onClick={onAddCard}>
            <DeckIcon name="plus" size={16} />
            {messages.add}
          </button>
        </div>
        {cards.length ? (
          <div className="deck-group-cards">
            {cards.map(card => {
              const learningState = getCardLearningState(schedules[card.id]);
              return (
                <article className="deck-group-card" key={card.id}>
                  <span className="deck-group-card__copy">
                    <span title={card.term}>{card.term}</span>
                    <span title={card.meaning}>{card.meaning}</span>
                  </span>
                  <span
                    className="deck-group-card__state"
                    data-state={learningState}
                  >
                    {stateMessages[learningState]}
                  </span>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="deck-group-empty">
            <DeckIcon name="folder" size={23} />
            <h3>{messages.emptyTitle}</h3>
            <p>{messages.emptyBody}</p>
            <button type="button" onClick={onAddCard}>
              <DeckIcon name="plus" size={16} />
              {messages.emptyAction}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
