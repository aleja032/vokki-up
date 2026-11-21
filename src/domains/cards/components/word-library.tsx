'use client';

import { useMemo } from 'react';
import {
  countEntriesByLevel,
  normalizeCatalogTerm,
  wordLibraryCatalog
} from '../word-library/catalog';
import { useCardsDashboard } from '../hooks/use-cards-dashboard';
import { getDefaultGroupId } from '../word-library/default-groups';
import { wordLibraryMessages } from '../word-library/messages';
import { findWorld, summarizeWorlds } from '../word-library/worlds';
import { WordLibraryBrowser } from './word-library-browser';
import { WorldsHub } from './worlds-hub';
import './word-library.css';

// Kept for callers that import these helpers from this module.
export { getDefaultGroupId };
export {
  paginateWordLibraryEntries,
  sortWordLibraryEntries,
  WORD_LIBRARY_PAGE_SIZE
} from './word-library-browser';
export { WordLibraryEntryCard } from './word-library-entry-card';

/** `?world=all` lists the whole catalog instead of one world. */
export const WHOLE_LIBRARY_PARAM = 'all';

type WordLibraryProps = {
  /** Value of the `world` query param: a world id, `all`, or nothing (hub). */
  worldParam?: string | null;
};

export function WordLibrary({ worldParam }: WordLibraryProps) {
  const dashboard = useCardsDashboard();
  const existingTerms = useMemo(
    () => new Set(dashboard.cards.map(card => normalizeCatalogTerm(card.term))),
    [dashboard.cards]
  );
  const worlds = useMemo(
    () => summarizeWorlds(wordLibraryCatalog, existingTerms),
    [existingTerms]
  );
  const levelTotals = useMemo(
    () => countEntriesByLevel(wordLibraryCatalog),
    []
  );

  if (!dashboard.isLibraryReady) {
    return (
      <section className="word-library" aria-live="polite">
        <p className="word-library__loading">{wordLibraryMessages.loading}</p>
      </section>
    );
  }

  const world = findWorld(worldParam);
  if (!world && worldParam !== WHOLE_LIBRARY_PARAM) {
    return (
      <div className="accent-violet">
        <WorldsHub levelTotals={levelTotals} worlds={worlds} />
      </div>
    );
  }

  return (
    <WordLibraryBrowser
      existingTerms={existingTerms}
      key={world?.id ?? WHOLE_LIBRARY_PARAM}
      onAddEntries={dashboard.addWordLibraryEntries}
      world={worlds.find(item => item.id === world?.id)}
    />
  );
}
