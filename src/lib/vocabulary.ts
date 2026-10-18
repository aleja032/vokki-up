import type { VocabularyCandidate } from '../types/study'

export function normalizeCandidateWord(word: string): string {
  return word.trim().replace(/\s+/g, ' ')
}

export function createVocabularyCandidate(word: string, meaning = ''): VocabularyCandidate | null {
  const normalizedWord = normalizeCandidateWord(word)
  if (!normalizedWord) return null
  return {
    id: crypto.randomUUID(),
    word: normalizedWord,
    meaning: meaning.trim(),
    status: 'pending',
  }
}
