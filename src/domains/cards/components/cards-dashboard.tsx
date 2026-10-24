'use client';

import Link from 'next/link';
import { ALL_GROUPS_ID, useCardsDashboard } from '../hooks/use-cards-dashboard';
import { cardsMessages } from '../messages';
import { CardEditor } from './card-editor';
import { CardGroupList } from './card-group-list';
import { CardsLibrary } from './cards-library';
import { DeckIcon } from './deck-icon';
import { GroupCreateForm } from './group-create-form';
import { GroupDetail } from './group-detail';
import './cards.css';

const messages = cardsMessages.overview;

export function CardsDashboard() {
  const dashboard = useCardsDashboard();
  const {
    cards,
    groups,
    schedules,
    now,
    dueCount,
    groupTiles,
    activeGroup,
    activeGroupId,
    activeGroupCards
  } = dashboard;

  if (dashboard.groupView === 'new')
    return (
      <GroupCreateForm
        groups={groups}
        onCancel={() => dashboard.setGroupView('overview')}
        onCreate={dashboard.createGroup}
      />
    );

  if (dashboard.groupView === 'detail' && activeGroup)
    return (
      <GroupDetail
        group={activeGroup}
        cards={activeGroupCards}
        schedules={schedules}
        dueCount={dashboard.activeGroupStats.dueCount}
        masteredPercent={dashboard.activeGroupStats.masteredPercent}
        onBack={() => dashboard.setGroupView('overview')}
        onAddCard={dashboard.openEditor}
      />
    );

  return (
    <div className="deck-page">
      <header className="deck-page__heading">
        <div className="deck-page__title">
          <h1>{messages.title}</h1>
          <p className="deck-page__summary deck-page__summary--compact">
            {messages.summaryCompact(cards.length, groups.length, dueCount)}
          </p>
          <p className="deck-page__summary deck-page__summary--wide">
            {messages.summaryWide(cards.length, dueCount)}
          </p>
        </div>
        <Link className="deck-page__review-button" href="/review">
          <DeckIcon name="stack" size={18} />
          {messages.reviewWide(dueCount)}
        </Link>
      </header>

      <div className="deck-actions">
        <button
          className="deck-action deck-action--primary"
          type="button"
          onClick={dashboard.openEditor}
        >
          <span className="deck-action__icon">
            <DeckIcon name="plus" size={22} />
          </span>
          <span className="deck-action__copy">
            <strong>{messages.newCardTitle}</strong>
            <span>{messages.newCardHint}</span>
          </span>
        </button>
        <Link className="deck-action deck-action--review" href="/review">
          <span className="deck-action__icon">
            <DeckIcon name="stack" size={22} />
          </span>
          <span className="deck-action__copy">
            <strong>{messages.reviewTitle}</strong>
            <span>{messages.reviewPending(dueCount)}</span>
          </span>
        </Link>
      </div>

      <CardGroupList
        tiles={groupTiles}
        totalCards={cards.length}
        totalDue={dueCount}
        activeGroupId={activeGroupId}
        activeGroup={activeGroup}
        activeGroupCardCount={activeGroupCards.length}
        onSelect={dashboard.setActiveGroupId}
        onOpenGroup={() => dashboard.setGroupView('detail')}
        onAddGroup={dashboard.startGroupCreation}
      />

      <div className="deck-page__workspace">
        <CardsLibrary
          cards={dashboard.filteredCards}
          groups={groups}
          schedules={schedules}
          now={now}
          activeGroup={activeGroup}
          categories={dashboard.categories}
          activeCategory={dashboard.activeCategory}
          searchText={dashboard.searchText}
          onSearchChange={dashboard.setSearchText}
          onCategoryChange={dashboard.setActiveCategory}
        />
        <CardEditor
          key={dashboard.editorKey}
          groups={groups}
          existingTerms={dashboard.existingTerms}
          initialGroupId={
            dashboard.editorGroupId ??
            (activeGroupId === ALL_GROUPS_ID ? undefined : activeGroupId)
          }
          isOpen={dashboard.isEditorOpen}
          onCancel={dashboard.closeEditor}
          onSave={dashboard.saveCard}
          onCreateGroup={dashboard.startGroupCreation}
          onViewExisting={dashboard.viewExistingCard}
        />
      </div>
    </div>
  );
}
