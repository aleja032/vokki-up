import type { CsvCardRow, CsvValidation } from './types';
export type CsvColumnName =
  | 'word'
  | 'meaning'
  | 'phonetics'
  | 'example'
  | 'part_of_speech'
  | 'group'
  | 'tags';
export const CSV_SCHEMA: {
  column: CsvColumnName;
  required: boolean;
  format: 'text' | 'freeText' | 'semicolonText';
}[] = [
  { column: 'word', required: true, format: 'text' },
  { column: 'meaning', required: true, format: 'text' },
  {
    column: 'phonetics',

    required: false,
    format: 'text'
  },
  { column: 'example', required: false, format: 'text' },
  {
    column: 'part_of_speech',

    required: false,
    format: 'text'
  },
  { column: 'group', required: false, format: 'freeText' },
  {
    column: 'tags',

    required: false,
    format: 'semicolonText'
  }
];
export const SAMPLE_CSV_ROWS: CsvCardRow[] = [
  {
    sourceRow: 2,
    word: 'reliable',
    meaning: 'confiable; que responde bien',
    phonetics: '/rɪˈlaɪəbəl/',
    example: 'She is a reliable colleague.',
    partOfSpeech: 'Adjetivo',
    group: 'Trabajo',
    tags: 'work; personality'
  },
  {
    sourceRow: 3,
    word: 'to catch up',
    meaning: 'ponerse al día',
    phonetics: '/kætʃ ʌp/',
    example: 'Let’s catch up next week.',
    partOfSpeech: 'Verbo frasal',
    group: 'Frases útiles',
    tags: 'phrases'
  }
];
export const SAMPLE_CSV_VALIDATION: CsvValidation = {
  validRows: SAMPLE_CSV_ROWS.length,
  invalidRows: 0,
  issues: [],
  missingHeaders: []
};
