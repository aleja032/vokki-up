'use client';

import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import type { ReactNode } from 'react';
import { ALL_GROUPS_ID, useCardsDashboard } from '../hooks/use-cards-dashboard';
import { cardsMessages } from '../messages';
import { CardEditor } from './card-editor';
import type { CardsAddPanelApi } from './cards-add-panel.types';
import { CardGroupList } from './card-group-list';
import { CardsLibrary } from './cards-library';
import { DeckIcon } from './deck-icon';
import { GroupCreateForm } from './group-create-form';
import { GroupDetail } from './group-detail';
import './cards.css';

const messages = cardsMessages.overview;

type CardsDashboardProps = {
  /** Replaces the manual editor panel (the route layer renders the add hub). */
  renderAddPanel?: (api: CardsAddPanelApi) => ReactNode;
};

export function CardsDashboard({ renderAddPanel }: CardsDashboardProps) {
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
    openGroup,
    openGroupCards
  } = dashboard;

  if (dashboard.groupView === 'new')
    return (
      <GroupCreateForm
        groups={groups}
        onCancel={() => dashboard.setGroupView('overview')}
        onCreate={dashboard.createGroup}
      />
    );

  if (dashboard.groupView === 'detail' && openGroup)
    return (
      <GroupDetail
        group={openGroup}
        cards={openGroupCards}
        schedules={schedules}
        dueCount={dashboard.openGroupStats.dueCount}
        masteredPercent={dashboard.openGroupStats.masteredPercent}
        onBack={() => dashboard.setGroupView('overview')}
        onAddCard={dashboard.openEditor}
      />
    );

  const addPanelApi: CardsAddPanelApi = {
    groups,
    existingTerms: dashboard.existingTerms,
    initialGroupId:
      dashboard.editorGroupId ??
      (activeGroupId === ALL_GROUPS_ID ? undefined : activeGroupId),
    editorKey: dashboard.editorKey,
    isOpen: dashboard.isEditorOpen,
    isLibraryReady: dashboard.isLibraryReady,
    onCancel: dashboard.closeEditor,
    onSave: dashboard.saveCard,
    onAddCards: dashboard.addCards,
    onCreateGroup: dashboard.startGroupCreation,
    onViewExisting: dashboard.viewExistingCard
  };

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
        <Link className="deck-page__review-button" href="/review?from=cards">
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
        <Link
          className="deck-action deck-action--review"
          href="/review?from=cards"
        >
          <span className="deck-action__icon">
            <DeckIcon name="stack" size={22} />
          </span>
          <span className="deck-action__copy">
            <strong>{messages.reviewTitle}</strong>
            <span>{messages.reviewPending(dueCount)}</span>
          </span>
        </Link>
        <Link
          className="deck-action deck-action--review"
          href="/cards/word-library"
        >
          <span className="deck-action__icon">
            <BookOpen size={22} aria-hidden="true" />
          </span>
          <span className="deck-action__copy">
            <strong>Biblioteca de palabras</strong>
            <span>Explora vocabulario y guárdalo en tus grupos</span>
          </span>
        </Link>
      </div>

      <CardGroupList
        tiles={groupTiles}
        totalCards={cards.length}
        totalDue={dueCount}
        activeGroupId={activeGroupId}
        onSelectAll={() => dashboard.setActiveGroupId(ALL_GROUPS_ID)}
        onOpenGroup={dashboard.openGroupById}
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
        {renderAddPanel ? (
          renderAddPanel(addPanelApi)
        ) : (
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
        )}
      </div>
    </div>
  );
}
