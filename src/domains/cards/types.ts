export type CardGroup = {
  id: string;
  name: string;
  description: string;
  tone: 'indigo' | 'amber' | 'green' | 'blue' | 'teal' | 'coral' | 'gray';
};

export type VocabularyCard = {
  id: string;
  term: string;
  meaning: string;
  phonetics: string;
  pronunciationLocale?: string;
  example: string;
  /** Optional Spanish translation of the example, shown under an eyebrow. */
  exampleEs?: string;
  partOfSpeech: string;
  groupId: string;
  tags: string[];
  relatedWords?: string[];
};

export type CardRating = 'again' | 'hard' | 'good' | 'easy';
