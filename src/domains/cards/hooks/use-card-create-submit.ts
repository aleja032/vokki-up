'use client';

import { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createCardCreateSchema,
  type CardCreateFormValues,
  type CardCreateInput
} from '../card-create.schema';
import type { CardAutofillField, CardAutofillValues } from '../card-autofill';
import { cardsMessages } from '../messages';
import type { CardGroup, VocabularyCard } from '../types';

type UseCardCreateSubmitOptions = {
  groups: CardGroup[];
  existingTerms: readonly string[];
  initialGroupId?: string;
  onSave: (card: VocabularyCard) => void;
};

function createCardId() {
  return globalThis.crypto?.randomUUID?.() ?? String(Date.now());
}

function parseTags(tags: string): string[] {
  return tags
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);
}

export function useCardCreateSubmit({
  groups,
  existingTerms,
  initialGroupId,
  onSave
}: UseCardCreateSubmitOptions) {
  const schema = useMemo(
    () => createCardCreateSchema(existingTerms),
    [existingTerms]
  );
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    control,
    formState: { errors, isValid, dirtyFields }
  } = useForm<CardCreateFormValues, unknown, CardCreateInput>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      term: '',
      meaning: '',
      phonetics: '',
      example: '',
      partOfSpeech: 'Sustantivo',
      groupId: initialGroupId ?? groups[0]?.id ?? '',
      tags: ''
    }
  });
  const watched = useWatch({ control });
  const values = {
    term: watched.term ?? '',
    meaning: watched.meaning ?? '',
    phonetics: watched.phonetics ?? '',
    example: watched.example ?? '',
    partOfSpeech: watched.partOfSpeech ?? 'Sustantivo',
    groupId: watched.groupId ?? '',
    tags: watched.tags ?? ''
  };
  const activeTags = parseTags(values.tags);
  const tagOptions = Array.from(
    new Set([...cardsMessages.cardEditor.tagsSuggestions, ...activeTags])
  );

  const onSubmit = handleSubmit(data => {
    onSave({
      id: createCardId(),
      ...data
    });
  });

  function selectPartOfSpeech(partOfSpeech: CardCreateInput['partOfSpeech']) {
    setValue('partOfSpeech', partOfSpeech, { shouldDirty: true });
  }

  function selectGroup(groupId: string) {
    setValue('groupId', groupId, { shouldDirty: true });
  }

  function toggleTag(tag: string) {
    const nextTags = activeTags.includes(tag)
      ? activeTags.filter(activeTag => activeTag !== tag)
      : [...activeTags, tag];
    setValue('tags', nextTags.join(', '), { shouldDirty: true });
  }

  // Writes AI-suggested values through RHF (validated, marked dirty).
  function applyAutofillValues(autofill: CardAutofillValues) {
    const options = { shouldDirty: true, shouldValidate: true };
    if (autofill.meaning !== undefined)
      setValue('meaning', autofill.meaning, options);
    if (autofill.phonetics !== undefined)
      setValue('phonetics', autofill.phonetics, options);
    if (autofill.example !== undefined)
      setValue('example', autofill.example, options);
    if (autofill.partOfSpeech !== undefined)
      setValue(
        'partOfSpeech',
        autofill.partOfSpeech as CardCreateInput['partOfSpeech'],
        options
      );
  }

  // The category always has a value, so only a user choice counts as typed.
  function readAutofillSnapshot(): Record<CardAutofillField, string> {
    const current = getValues();
    return {
      meaning: current.meaning ?? '',
      phonetics: current.phonetics ?? '',
      example: current.example ?? '',
      partOfSpeech: dirtyFields.partOfSpeech ? (current.partOfSpeech ?? '') : ''
    };
  }

  // Clears the text fields but keeps the chosen category and group.
  function clearFields() {
    reset({
      ...getValues(),
      term: '',
      meaning: '',
      phonetics: '',
      example: '',
      tags: ''
    });
  }

  const fieldErrors = {
    term: errors.term?.message,
    meaning: errors.meaning?.message,
    example: errors.example?.message
  };
  const errorCount = Object.values(fieldErrors).filter(Boolean).length;

  return {
    register,
    onSubmit,
    values,
    isValid,
    fieldErrors,
    errorCount,
    isDuplicateTerm: errors.term?.type === 'custom',
    activeTags,
    tagOptions,
    selectPartOfSpeech,
    selectGroup,
    toggleTag,
    clearFields,
    applyAutofillValues,
    readAutofillSnapshot
  };
}
