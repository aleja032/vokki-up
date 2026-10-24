import type { CardCandidate } from '@/domains/ai/types';
import type { VocabularyCard } from '../types';

export function mapCapturedCandidatesToCards(
  candidates: CardCandidate[],
  groupId: string,
  createId: () => string = () => crypto.randomUUID()
): VocabularyCard[] {
  return candidates.map(candidate => ({
    id: createId(),
    term: candidate.word.trim(),
    meaning: candidate.meaning.trim(),
    phonetics: candidate.phonetics.trim(),
    example: candidate.example.trim(),
    partOfSpeech: candidate.partOfSpeech,
    groupId,
    tags: [],
    relatedWords: candidate.relatedWords
  }));
}
