'use client';

import { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DEFAULT_GROUP_TONE, type GroupTone } from '../group-colors';
import {
  createGroupCreateSchema,
  type GroupCreateInput
} from '../group-create.schema';
import type { CardGroup } from '../types';

type UseGroupCreateSubmitOptions = {
  groups: CardGroup[];
  onCreate: (group: CardGroup) => void;
};

function createGroupId() {
  return `group-${Date.now()}`;
}

export function useGroupCreateSubmit({
  groups,
  onCreate
}: UseGroupCreateSubmitOptions) {
  const schema = useMemo(
    () => createGroupCreateSchema(groups.map(group => group.name)),
    [groups]
  );
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid }
  } = useForm<GroupCreateInput>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { name: '', description: '', tone: DEFAULT_GROUP_TONE }
  });
  const name = useWatch({ control, name: 'name' });
  const tone = useWatch({ control, name: 'tone' });

  const onSubmit = handleSubmit(values => {
    onCreate({ id: createGroupId(), ...values });
  });

  function selectTone(nextTone: GroupTone) {
    setValue('tone', nextTone, { shouldDirty: true });
  }

  function applySuggestion(suggestion: string) {
    setValue('name', suggestion, { shouldDirty: true, shouldValidate: true });
  }

  // An empty name only disables the submit button; it never shows an error.
  const nameError =
    errors.name?.type === 'too_small' ? undefined : errors.name?.message;

  return {
    register,
    onSubmit,
    name,
    tone,
    nameError,
    isValid,
    selectTone,
    applySuggestion
  };
}
