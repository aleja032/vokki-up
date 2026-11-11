import { describe, expect, it } from 'vitest';
import {
  mapSuggestionToFormValues,
  planAutofill,
  type CardAutofillSuggestion
} from './card-autofill';

const suggestion: CardAutofillSuggestion = {
  meaning: 'dar por sentado',
  phonetics: '/teɪk/',
  example: 'Do not take it for granted.',
  partOfSpeech: 'Expresión'
};

const empty = { meaning: '', phonetics: '', example: '', partOfSpeech: '' };

describe('mapSuggestionToFormValues', () => {
  it('trims fields and keeps a supported part of speech', () => {
    expect(
      mapSuggestionToFormValues({
        ...suggestion,
        meaning: '  dar por sentado ',
        partOfSpeech: 'Verbo'
      })
    ).toEqual({
      meaning: 'dar por sentado',
      phonetics: '/teɪk/',
      example: 'Do not take it for granted.',
      partOfSpeech: 'Verbo'
    });
  });

  it('drops an unsupported part of speech', () => {
    expect(
      mapSuggestionToFormValues({ ...suggestion, partOfSpeech: 'Preposición' })
        .partOfSpeech
    ).toBeUndefined();
  });

  it('clips the example to the card limit', () => {
    const long = 'a'.repeat(400);
    expect(
      mapSuggestionToFormValues({ ...suggestion, example: long }).example
    ).toHaveLength(160);
  });
});

describe('planAutofill', () => {
  it('fills every empty field and reports no conflicts', () => {
    const plan = planAutofill(empty, suggestion);
    expect(plan.fill).toEqual(mapSuggestionToFormValues(suggestion));
    expect(plan.conflicts).toEqual({});
  });

  it('never overwrites typed fields: they become conflicts', () => {
    const plan = planAutofill(
      { ...empty, meaning: 'mi significado', example: '   ' },
      suggestion
    );
    expect(plan.fill.meaning).toBeUndefined();
    expect(plan.fill.example).toBe('Do not take it for granted.');
    expect(plan.conflicts).toEqual({ meaning: 'dar por sentado' });
  });

  it('ignores typed fields that already equal the suggestion', () => {
    const plan = planAutofill(
      { ...empty, meaning: 'dar por sentado' },
      suggestion
    );
    expect(plan.conflicts).toEqual({});
    expect(plan.fill.meaning).toBeUndefined();
  });
});
