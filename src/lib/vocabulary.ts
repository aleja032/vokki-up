import type { VocabularyCandidate } from '../types/study'

export function normalizeCandidateWord(word: string): string {
  return word.trim().replace(/\s+/g, ' ')
}

export type VocabularyCandidateDetails = {
  originalInput?: string
  canonicalWord?: string
  phonetic?: string
}

export function createVocabularyCandidate(word: string, meaning = '', details: VocabularyCandidateDetails = {}): VocabularyCandidate | null {
  const normalizedWord = normalizeCandidateWord(details.canonicalWord ?? word)
  if (!normalizedWord) return null
  return {
    id: crypto.randomUUID(),
    word: normalizedWord,
    originalInput: details.originalInput?.trim() || word.trim(),
    canonicalWord: normalizedWord,
    ...(details.phonetic?.trim() ? { phonetic: details.phonetic.trim() } : {}),
    meaning: meaning.trim(),
    status: 'pending',
  }
}
