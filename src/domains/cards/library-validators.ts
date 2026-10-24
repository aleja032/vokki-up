import type { CardGroup, VocabularyCard } from './types';

const GROUP_TONE_VALUES = [
  'indigo',
  'amber',
  'green',
  'blue',
  'teal',
  'coral',
  'gray'
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isCardList(value: unknown): value is VocabularyCard[] {
  return (
    Array.isArray(value) &&
    value.every(
      card =>
        isRecord(card) &&
        typeof card.id === 'string' &&
        typeof card.term === 'string' &&
        typeof card.meaning === 'string' &&
        typeof card.phonetics === 'string' &&
        typeof card.example === 'string' &&
        typeof card.partOfSpeech === 'string' &&
        typeof card.groupId === 'string' &&
        Array.isArray(card.tags) &&
        card.tags.every(tag => typeof tag === 'string')
    )
  );
}

export function isGroupList(value: unknown): value is CardGroup[] {
  return (
    Array.isArray(value) &&
    value.every(
      group =>
        isRecord(group) &&
        typeof group.id === 'string' &&
        typeof group.name === 'string' &&
        typeof group.description === 'string' &&
        GROUP_TONE_VALUES.includes(String(group.tone))
    )
  );
}
