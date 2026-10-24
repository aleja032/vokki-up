export type CsvCardRow = {
  word: string;
  meaning: string;
  phonetics: string;
  example: string;
  partOfSpeech: string;
  group: string;
  tags: string;
  sourceRow: number;
};
export type CsvValidation = {
  validRows: number;
  invalidRows: number;
  issues: string[];
  missingHeaders: string[];
};
