'use client';

import { useState } from 'react';
import {
  planAutofill,
  type CardAutofillField,
  type CardAutofillSuggestion,
  type CardAutofillValues
} from '../card-autofill';

/** Contract the route layer fulfils with an AI capability (cards never import ai). */
export type CardEditorAutofill = {
  status: 'idle' | 'loading' | 'error' | 'unconfigured';
  errorMessage: string;
  onRequest: (term: string) => Promise<CardAutofillSuggestion | null>;
  onDismiss: () => void;
};

type UseCardEditorAutofillOptions = {
  autofill?: CardEditorAutofill;
  term: string;
  readSnapshot: () => Record<CardAutofillField, string>;
  applyValues: (values: CardAutofillValues) => void;
};

/**
 * Autofill flow of the card editor: empty fields are filled right away,
 * fields the user already typed only change after an explicit confirmation.
 */
export function useCardEditorAutofill({
  autofill,
  term,
  readSnapshot,
  applyValues
}: UseCardEditorAutofillOptions) {
  // UI-only: suggestions waiting for the user to confirm replacing typed fields.
  const [conflicts, setConflicts] = useState<CardAutofillValues | null>(null);
  const trimmedTerm = term.trim();
  const isLoading = autofill?.status === 'loading';

  async function requestSuggestion() {
    if (!autofill || !trimmedTerm) return;
    setConflicts(null);
    const suggestion = await autofill.onRequest(trimmedTerm);
    if (!suggestion) return;
    const plan = planAutofill(readSnapshot(), suggestion);
    applyValues(plan.fill);
    setConflicts(Object.keys(plan.conflicts).length ? plan.conflicts : null);
  }

  function replaceTypedFields() {
    if (conflicts) applyValues(conflicts);
    setConflicts(null);
  }

  function keepTypedFields() {
    setConflicts(null);
  }

  return {
    isAvailable: Boolean(autofill),
    canRequest: Boolean(autofill) && Boolean(trimmedTerm) && !isLoading,
    isLoading,
    status: autofill?.status ?? 'idle',
    errorMessage: autofill?.errorMessage ?? '',
    conflictCount: conflicts ? Object.keys(conflicts).length : 0,
    requestSuggestion,
    replaceTypedFields,
    keepTypedFields
  };
}
