import type { CardCandidate } from './types';

export type CaptureCandidateSource = 'typed' | 'image';

export type SourcedCaptureCandidate = {
  source: CaptureCandidateSource;
  candidate: CardCandidate;
};

export function deduplicateCaptureCandidates(
  candidates: SourcedCaptureCandidate[]
): SourcedCaptureCandidate[] {
  const unique: SourcedCaptureCandidate[] = [];
  const indicesByTerm = new Map<string, number>();

  for (const incoming of candidates) {
    const key = normalizeTerm(incoming.candidate.word);
    const existingIndex = indicesByTerm.get(key);

    if (existingIndex === undefined) {
      indicesByTerm.set(key, unique.length);
      unique.push(incoming);
      continue;
    }

    const existing = unique[existingIndex];
    if (!existing) continue;

    const primary =
      incoming.source === 'typed' || existing.source !== 'typed'
        ? incoming
        : existing;
    const secondary = primary === incoming ? existing : incoming;

    unique[existingIndex] = {
      source: primary.source,
      candidate: mergeCandidate(primary.candidate, secondary.candidate)
    };
  }

  return unique;
}

function mergeCandidate(
  primary: CardCandidate,
  secondary: CardCandidate
): CardCandidate {
  return {
    ...secondary,
    ...primary,
    word: primary.word,
    original: firstPresent(primary.original, secondary.original),
    meaning: firstPresent(primary.meaning, secondary.meaning) ?? '',
    phonetics: firstPresent(primary.phonetics, secondary.phonetics) ?? '',
    example: firstPresent(primary.example, secondary.example) ?? '',
    partOfSpeech:
      firstPresent(primary.partOfSpeech, secondary.partOfSpeech) ?? '',
    relatedWords: mergeRelatedWords(
      primary.relatedWords,
      secondary.relatedWords
    )
  };
}

function mergeRelatedWords(primary: string[], secondary: string[]): string[] {
  const result: string[] = [];
  const seen = new Set<string>();

  for (const word of [...primary, ...secondary]) {
    const key = normalizeTerm(word);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(word);
    if (result.length === 2) break;
  }

  return result;
}

function firstPresent(primary?: string, fallback?: string): string | undefined {
  if (primary?.trim()) return primary;
  if (fallback?.trim()) return fallback;
  return undefined;
}

function normalizeTerm(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}
