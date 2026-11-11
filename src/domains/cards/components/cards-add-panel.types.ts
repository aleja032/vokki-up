import type { CardGroup, VocabularyCard } from '../types';

/** What the dashboard hands to a custom add panel rendered by the route layer. */
export type CardsAddPanelApi = {
  groups: CardGroup[];
  existingTerms: readonly string[];
  initialGroupId?: string;
  editorKey: number;
  isOpen: boolean;
  isLibraryReady: boolean;
  onCancel: () => void;
  onSave: (card: VocabularyCard) => void;
  onAddCards: (cards: VocabularyCard[]) => void;
  onCreateGroup: () => void;
  onViewExisting: (term: string) => void;
};
