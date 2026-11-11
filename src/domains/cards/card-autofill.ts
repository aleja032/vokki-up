import {
  CARD_EXAMPLE_MAX_LENGTH,
  CARD_PARTS_OF_SPEECH
} from './card-create.schema';

/** What an AI capability can suggest for a card from only its English term. */
export type CardAutofillSuggestion = {
  meaning: string;
  phonetics: string;
  example: string;
  partOfSpeech: string;
};

export const AUTOFILL_FIELDS = [
  'meaning',
  'phonetics',
  'example',
  'partOfSpeech'
] as const;
export type CardAutofillField = (typeof AUTOFILL_FIELDS)[number];

export type CardAutofillValues = Partial<Record<CardAutofillField, string>>;

export type CardAutofillPlan = {
  /** Values for fields the user left empty: applied immediately. */
  fill: CardAutofillValues;
  /** Suggestions for fields the user already typed: applied only on confirmation. */
  conflicts: CardAutofillValues;
};

function isSupportedPartOfSpeech(value: string): boolean {
  return (CARD_PARTS_OF_SPEECH as readonly string[]).includes(value);
}

/** Normalizes a suggestion into values the card form accepts. */
export function mapSuggestionToFormValues(
  suggestion: CardAutofillSuggestion
): CardAutofillValues {
  const values: CardAutofillValues = {
    meaning: suggestion.meaning.trim(),
    phonetics: suggestion.phonetics.trim(),
    example: suggestion.example.trim().slice(0, CARD_EXAMPLE_MAX_LENGTH)
  };
  const partOfSpeech = suggestion.partOfSpeech.trim();
  if (isSupportedPartOfSpeech(partOfSpeech)) values.partOfSpeech = partOfSpeech;
  return values;
}

/**
 * Splits a suggestion into what can be filled right away (empty fields) and
 * what would overwrite user input (conflicts).
 */
export function planAutofill(
  current: Record<CardAutofillField, string>,
  suggestion: CardAutofillSuggestion
): CardAutofillPlan {
  const suggested = mapSuggestionToFormValues(suggestion);
  const fill: CardAutofillValues = {};
  const conflicts: CardAutofillValues = {};
  for (const field of AUTOFILL_FIELDS) {
    const next = suggested[field];
    if (!next) continue;
    const typed = current[field].trim();
    if (!typed) fill[field] = next;
    else if (typed !== next) conflicts[field] = next;
  }
  return { fill, conflicts };
}
