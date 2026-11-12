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

- [x] AP-01 — Implement browser speech synthesis, per-card locale, review controls, and opt-in auto-play. **Route:** delegated. **Trigger:** multiple non-trivial files and code reading required. **Acceptance:** learner can replay pronunciation; auto-play only runs when enabled and safely falls back; locale is validated and persisted; focused tests pass. **Correction:** legacy locale is optional and normalized to `en-US`; editor and readers share one 35-character BCP 47 rule; unsupported/failed speech is communicated and disables auto-play after an utterance error; canonicalized locale tags are also limited to 35 characters; Spanish UI strings include English translations. **Checks:** `pnpm --manage-package-manager-versions=false tsc --noEmit --incremental false` — passed; `pnpm --manage-package-manager-versions=false test -- src/domains/cards/library-validators.test.ts src/domains/cards/scheduling/validators.test.ts src/domains/cards/persistence/__tests__/captured-cards.test.ts src/domains/cards/card-create.schema.test.ts` — 4 files / 17 tests passed; `pnpm --manage-package-manager-versions=false lint` — passed; Prettier check on all changed source files — passed. **Commit:** `1747e5c`.
- [x] AP-02 — Make pronunciation attempt automatic by default and remove the opt-in preference UI. **Route:** delegated. **Trigger:** review behavior, settings persistence, localization, and tests span multiple non-trivial files. **Acceptance:** each review card attempts browser-native playback once when opened; manual replay remains; unsupported playback and speech errors are reported accessibly; no autoplay checkbox, dialog, or active persisted preference remains. **Checks:** `tsc --noEmit --incremental false` — passed; focused card tests — 2 files / 6 tests passed; `pnpm --config.manage-package-manager-versions=false lint` — passed; Prettier check on changed source files — passed. **Commit:** `82891eb`.
## Progress

- Created on 2026-11-12 before source changes.
- AP-01 reopened after independent verification found type, persistence-validation, fallback, and localization defects.
- Fixed the canonicalization-expansion edge case; direct typecheck, focused tests (17 passing), lint, and source formatting checks passed. Correction commit: `1747e5c`.
- AP-02 created: automatic pronunciation is now the requested default.
- AP-02 completed: autoplay now attempts once per review-card identity, manual replay remains, and the preference control and setting accessors were removed. Browser speech failures no longer disable a preference; they remain visible as an accessible status. Direct typecheck, focused tests (6 passing), lint, and formatting checks passed.

