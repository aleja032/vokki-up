'use client';

import type { ReactNode } from 'react';
import { ALL_GROUPS_ID, useCardsDashboard } from '../hooks/use-cards-dashboard';
import { CardEditor } from './card-editor';
import type { CardsAddPanelApi } from './cards-add-panel.types';
import { CardGroupList } from './card-group-list';
import { CardsLibrary } from './cards-library';
import { DeckPageHeader } from './deck-page-header';
import { FolderChipRow } from './folder-chip-row';
import { GroupCreateForm } from './group-create-form';
import { NewCardFab } from './new-card-fab';
import './cards.css';

type CardsDashboardProps = {
  /** Replaces the manual editor panel (the route layer renders the add hub). */
  renderAddPanel?: (api: CardsAddPanelApi) => ReactNode;
};

export function CardsDashboard(props: CardsDashboardProps) {
  return <CardsDashboardView {...props} />;
}

function CardsDashboardView({ renderAddPanel }: CardsDashboardProps) {
  const dashboard = useCardsDashboard();
  const {
    cards,
    groups,
    schedules,
    now,
    dueCount,
    groupTiles,
    activeGroup,
    activeGroupId
  } = dashboard;

  if (dashboard.editingCard)
    return (
      <CardEditor
        key={dashboard.editingCard.id}
        groups={groups}
        existingTerms={dashboard.editingExistingTerms}
        initialCard={dashboard.editingCard}
        isOpen
        onCancel={dashboard.closeCardEdit}
        onSave={dashboard.saveEditedCard}
        onCreateGroup={dashboard.startGroupCreation}
        onViewExisting={dashboard.viewExistingCard}
      />
    );

  if (dashboard.groupView === 'new')
    return (
      <GroupCreateForm
        groups={groups}
        onCancel={() => dashboard.setGroupView('overview')}
        onCreate={dashboard.createGroup}
      />
    );

  const addPanelApi: CardsAddPanelApi = {
    groups,
    existingTerms: dashboard.existingTerms,
    initialGroupId: activeGroupId === ALL_GROUPS_ID ? undefined : activeGroupId,
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
      <DeckPageHeader
        totalCards={cards.length}
        dueCount={dueCount}
        reviewFolder={dashboard.reviewGroup}
        groupCount={groups.length}
      />

      <FolderChipRow
        tiles={groupTiles}
        totalCards={cards.length}
        totalDue={dueCount}
        activeGroupId={activeGroupId}
        onSelectGroup={dashboard.setActiveGroupId}
        onAddGroup={dashboard.startGroupCreation}
      />

      <div className="deck-page__workspace">
        <CardGroupList
          tiles={groupTiles}
          totalCards={cards.length}
          totalDue={dueCount}
          activeGroupId={activeGroupId}
          searchText={dashboard.groupSearchText}
          onSearchChange={dashboard.setGroupSearchText}
          onSelectGroup={dashboard.setActiveGroupId}
          onAddGroup={dashboard.startGroupCreation}
        />
        <CardsLibrary
          cards={dashboard.filteredCards}
          schedules={schedules}
          now={now}
          activeGroup={activeGroup}
          activeGroupStats={dashboard.activeGroupStats}
          categories={dashboard.categories}
          activeCategory={dashboard.activeCategory}
          activeStatus={dashboard.activeStatus}
          statusCounts={dashboard.statusCounts}
          searchText={dashboard.searchText}
          canDeleteCards={dashboard.canDeleteCards}
          onSearchChange={dashboard.setSearchText}
          onCategoryChange={dashboard.setActiveCategory}
          onStatusChange={dashboard.setActiveStatus}
          onDeleteCards={dashboard.deleteCards}
          onAddCard={dashboard.openEditor}
          otherGroupNames={dashboard.activeGroupOtherNames}
          onUpdateGroup={dashboard.updateGroup}
          onDeleteGroup={dashboard.deleteGroup}
          onEditCard={dashboard.editCard}
          onShowAll={() => dashboard.setActiveGroupId(ALL_GROUPS_ID)}
        />
        {renderAddPanel ? (
          renderAddPanel(addPanelApi)
        ) : (
          <CardEditor
            key={dashboard.editorKey}
            groups={groups}
            existingTerms={dashboard.existingTerms}
            initialGroupId={
              activeGroupId === ALL_GROUPS_ID ? undefined : activeGroupId
            }
            isOpen={dashboard.isEditorOpen}
            onCancel={dashboard.closeEditor}
            onSave={dashboard.saveCard}
            onCreateGroup={dashboard.startGroupCreation}
            onViewExisting={dashboard.viewExistingCard}
          />
        )}
      </div>

      <NewCardFab onCreate={dashboard.openEditor} />
    </div>
  );
}
