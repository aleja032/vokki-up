import { CARD_PARTS_OF_SPEECH } from '../card-create.schema';
import type { CardGroup, VocabularyCard } from '../types';
import { normalizePronunciationLocale } from '@/lib/i18n/locale';

export type CapturedCardCandidate = {
  word: string;
  original?: string;
  meaning: string;
  phonetics: string;
  example: string;
  partOfSpeech: string;
  relatedWords: string[];
};

export function mapCapturedCandidatesToCards(
  candidates: CapturedCardCandidate[],
  groupId: string,
  createId: () => string = () => crypto.randomUUID()
): VocabularyCard[] {
  return candidates.map(candidate => ({
    id: createId(),
    term: candidate.word.trim(),
    meaning: candidate.meaning.trim(),
    phonetics: candidate.phonetics.trim(),
    pronunciationLocale: normalizePronunciationLocale('en-US'),
    example: candidate.example.trim(),
    partOfSpeech: candidate.partOfSpeech,
    groupId,
    tags: [],
    relatedWords: candidate.relatedWords
  }));
}

export type CapturedCardsLibraryOptions = {
  groups: CardGroup[];
  isReady: boolean;
  addCards: (cards: VocabularyCard[]) => void;
};

/**
 * Adapter the AI capture flow consumes: maps accepted candidates to cards,
 * stores them through `addCards` and summarizes what was created.
 */
export function createCapturedCardsLibrary({
  groups,
  isReady,
  addCards
}: CapturedCardsLibraryOptions) {
  return {
    groups,
    isReady,
    partsOfSpeech: CARD_PARTS_OF_SPEECH,
    saveAccepted(candidates: CapturedCardCandidate[], groupId: string) {
      const cards = mapCapturedCandidatesToCards(candidates, groupId);
      addCards(cards);
      return cards.map(({ id, term, meaning, partOfSpeech }) => ({
        id,
        term,
        meaning,
        partOfSpeech
      }));
    }
  };
}
