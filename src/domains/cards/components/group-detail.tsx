'use client';

import { ArrowRight, Folder } from 'lucide-react';
import { ActionPill } from '@/components/ui/action-pill';
import { ConfirmDialog } from '@/components/overlay/confirm-dialog';
import { Pill } from '@/components/ui/pill';
import { ProgressBar } from '@/components/ui/progress-bar';
import { StatCard } from '@/components/ui/stat-card';
import { getCardLearningState } from '../card-learning-state';
import type { CardLearningState } from '../card-learning-state';
import { canDeleteGroup } from '../delete-group';
import { useGroupActionsMenu } from '../hooks/use-group-actions-menu';
import {
  getGroupDisplayName,
  getGroupDisplayDescription
} from '../group-display';
import { cardsMessages } from '../messages';
import type { CardScheduleMap } from '../scheduling/types';
import type { CardGroup, VocabularyCard } from '../types';
import { DeckIcon } from './deck-icon';
import { GroupAddActions } from './group-add-actions';
import { GroupEmptyState } from './group-empty-state';
import './group-detail.css';

const messages = cardsMessages.groupDetail;
const stateMessages = cardsMessages.learningState;

const STATE_TONE = {
  new: 'brand',
  learning: 'neutral',
  mastered: 'mint'
} as const satisfies Record<CardLearningState, string>;

type GroupDetailProps = {
  group: CardGroup;
  cards: VocabularyCard[];
  schedules: CardScheduleMap;
  dueCount: number;
  masteredPercent: number;
  onBack: () => void;
  onAddCard: () => void;
  onDelete: (groupId: string) => void;
};

export function GroupDetail({
  group,
  cards,
  schedules,
  dueCount,
  masteredPercent,
  onBack,
  onAddCard,
  onDelete
}: GroupDetailProps) {
  const {
    isMenuOpen,
    isConfirmingDelete,
    toggleMenu,
    closeMenu,
    askDelete,
    dismissDelete
  } = useGroupActionsMenu();
  const isDeletable = canDeleteGroup(group, cards);
  const displayName = getGroupDisplayName(group);

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
            disabled={!isDeletable}
            aria-describedby={isDeletable ? undefined : 'group-delete-blocked'}
            onClick={askDelete}
          >
            {messages.menuDelete}
          </button>
          {!isDeletable && (
            <span className="deck-menu__hint" id="group-delete-blocked">
              {messages.menuDeleteBlocked}
            </span>
          )}
        </div>
      )}
      <div className="deck-screen__body">
        <section className="deck-hero" data-tone={group.tone}>
          <div className="deck-hero__identity">
            <span className="deck-hero__icon">
              <Folder aria-hidden="true" size={26} />
            </span>
            <div>
              <h1 id="group-detail-title">{getGroupDisplayName(group)}</h1>
              {group.description && (
                <span>{getGroupDisplayDescription(group)}</span>
              )}
            </div>
          </div>
          <div className="deck-hero__stats">
            <StatCard
              label={messages.statCards(cards.length)}
              tone="brand"
              value={cards.length}
            />
            <StatCard label={messages.statDue} tone="brand" value={dueCount} />
            <StatCard
              label={messages.statMastered}
              tone="mint"
              value={`${masteredPercent}%`}
            />
          </div>
          <ProgressBar
            label={messages.statMastered}
            tone="mint"
            value={masteredPercent}
          />
          <ActionPill
            className="deck-hero__review"
            href={`/review?groupId=${encodeURIComponent(group.id)}&from=cards`}
            icon={<ArrowRight size={18} strokeWidth={2.4} />}
            variant="primary"
          >
            {messages.review(dueCount)}
          </ActionPill>
        </section>
        <div className="deck-screen__list-heading">
          <h2>{messages.listTitle}</h2>
          {cards.length > 0 && (
            <GroupAddActions variant="header" onAdd={onAddCard} />
          )}
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
                  <Pill tone={STATE_TONE[learningState]}>
                    {stateMessages[learningState]}
                  </Pill>
                </article>
              );
            })}
          </div>
        ) : (
          <GroupEmptyState onAdd={onAddCard} />
        )}
      </div>
      <ConfirmDialog
        open={isConfirmingDelete}
        title={messages.deleteTitle}
        description={messages.deleteBody(displayName, cards.length)}
        confirmLabel={messages.deleteConfirm}
        cancelLabel={messages.deleteCancel}
        onConfirm={() => {
          dismissDelete();
          onDelete(group.id);
        }}
        onCancel={dismissDelete}
      />
    </section>
  );
}
