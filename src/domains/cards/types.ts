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
  example: string;
  partOfSpeech: string;
  groupId: string;
  tags: string[];
  relatedWords?: string[];
};

export type CardRating = 'again' | 'hard' | 'good' | 'easy';
