'use client';

import { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isOthers } from '../delete-group';
import { displayTone, type FolderColor } from '../group-colors';
import { getGroupDisplayName } from '../group-display';
import {
  createGroupEditSchema,
  type GroupEditInput
} from '../group-edit.schema';
import type { CardGroup } from '../types';
import { buildGroupPatch, type GroupPatch } from '../update-group';

type UseFolderEditSubmitOptions = {
  group: CardGroup;
  /** Names the folder cannot take (the other folders and the reserved one). */
  otherGroupNames: readonly string[];
  onSave: (patch: GroupPatch) => void;
};

// Form of the edit-folder dialog: name and color, validated with the edit
// schema. It starts from what the user sees (the displayed name and color) and
// hands the dashboard only what changed.
export function useFolderEditSubmit({
  group,
  otherGroupNames,
  onSave
}: UseFolderEditSubmitOptions) {
  const schema = useMemo(
    () => createGroupEditSchema(otherGroupNames),
    [otherGroupNames]
  );
  const defaultName = getGroupDisplayName(group);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid, isDirty }
  } = useForm<GroupEditInput>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { name: defaultName, tone: displayTone(group.tone) }
  });
  const tone = useWatch({ control, name: 'tone' });

  const onSubmit = handleSubmit(values => {
    onSave(buildGroupPatch(group, values));
  });

  function selectTone(nextTone: FolderColor) {
    setValue('tone', nextTone, { shouldDirty: true, shouldValidate: true });
  }

  return {
    register,
    onSubmit,
    tone,
    defaultName,
    nameError: errors.name?.message,
    isNameLocked: isOthers(group),
    canSave: isValid && isDirty,
    selectTone
  };
}
