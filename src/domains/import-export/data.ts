import type { CsvCardRow, CsvValidation } from './types';
export const CSV_SCHEMA: {
  column: string;
  label: string;
  required: boolean;
  format: string;
}[] = [
  { column: 'word', label: 'Palabra o frase', required: true, format: 'Texto' },
  { column: 'meaning', label: 'Significado', required: true, format: 'Texto' },
  {
    column: 'phonetics',
    label: 'Pronunciación',
    required: false,
    format: 'Texto'
  },
  { column: 'example', label: 'Ejemplo', required: false, format: 'Texto' },
  {
    column: 'part_of_speech',
    label: 'Tipo de palabra',
    required: false,
    format: 'Texto'
  },
  { column: 'group', label: 'Grupo', required: false, format: 'Texto libre' },
  {
    column: 'tags',
    label: 'Etiquetas',
    required: false,
    format: 'Texto separado por punto y coma'
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
