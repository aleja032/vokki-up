# Audio pronunciation

## Objective

Add accessible pronunciation playback to review cards without changing the existing immediate-save experience or requiring a backend audio provider.

## Problem

The review screen exposes a disabled audio control and cards only store IPA. Learners cannot hear the word they are reviewing.

## Scope

- Browser-native speech synthesis only; no stored audio files, external TTS, or Supabase changes.
- Store a pronunciation locale per card and an opt-in local setting for automatic playback.
- Preserve a manual playback control and graceful fallback when speech synthesis or autoplay is unavailable.

## Constraints

- Do not alter existing automatic persistence behavior.
- Do not add image functionality.
- Speech playback must be optional and accessible.

## Delivery

- Forecast: ~180 authored changed lines, excluding generated files.
- Strategy: ask-on-risk; expected slice remains below the review budget.

## Tasks

- [x] AP-01 — Implement browser speech synthesis, per-card locale, review controls, and opt-in auto-play. **Route:** delegated. **Trigger:** multiple non-trivial files and code reading required. **Acceptance:** learner can replay pronunciation; auto-play only runs when enabled and safely falls back; locale is validated and persisted; focused tests pass. **Correction:** legacy locale is optional and normalized to `en-US`; editor and readers share one 35-character BCP 47 rule; unsupported/failed speech is communicated and disables auto-play after an utterance error; Spanish UI strings include English translations. **Checks:** `pnpm --manage-package-manager-versions=false tsc --noEmit --incremental false` — passed; `pnpm --manage-package-manager-versions=false test -- src/domains/cards/library-validators.test.ts src/domains/cards/scheduling/validators.test.ts src/domains/cards/persistence/__tests__/captured-cards.test.ts src/domains/cards/card-create.schema.test.ts` — 4 files / 16 tests passed; `pnpm --manage-package-manager-versions=false lint` — passed; Prettier check on all changed source files — passed. **Commit:** `1a4e54d`.

## Progress

- Created on 2026-11-12 before source changes.
- AP-01 reopened after independent verification found type, persistence-validation, fallback, and localization defects.
- Corrected findings; required typecheck, focused tests, lint, and formatting checks pass. Correction commit: `1a4e54d`.
