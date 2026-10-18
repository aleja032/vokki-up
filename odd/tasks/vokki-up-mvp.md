# Vokki Up MVP

## Objective
Deliver an intuitive, mobile-first PWA for personal English study from B1 to B2 on web, Android, and iPhone. It must work offline, persist study data locally, support AI-assisted content through a secure Gemini backend, and enable image-based vocabulary capture.

## Constraints
- Product UI is Spanish.
- PWA-first: no App Store, TestFlight, or native Capacitor delivery in this feature.
- Keep the current React 19 / Vite 8 baseline unless a verified integration requires otherwise.
- Never expose a Gemini API key in client code; use a Supabase Edge Function and secrets.
- Image extraction requires user confirmation before vocabulary is saved.
- Supabase free tier is available for optional authenticated sync.
- SDD is used here only for task specification and detail; no separate SDD implementation artifacts are created.

## Delivery strategy
- Strategy: `exception-ok` — user explicitly authorized one direct push of the current MVP baseline to `main`; all future features use feature branches and pull requests.
- Forecast: the current baseline exceeds the usual review size and is an approved bootstrap exception. Future work uses small, coherent PR slices.
- Repository state: Git repository detected on 2026-10-18; current baseline will be committed and pushed before future PR-based work starts.

## Tasks

- [x] **VU-01 — Application shell and design system**
  - Route: delegated; multi-file UI implementation.
  - Scope: replace starter screen with accessible, Spanish, mobile-first navigation; establish theme tokens, light/dark toggle, and responsive layout.
  - Acceptance: all five modules are navigable; selected section is clear; layout is usable at phone width and desktop width; user preference persists locally.
  - Checks: `npm run build` passed (Vite 8.0.16); `npm run lint` passed after restoring dependencies with elevated access. Local Vite server returned HTTP 200. Browser visual QA remains pending.

- [x] **VU-02 — Offline study domain and persistence**
  - Route: delegated; new data model, IndexedDB persistence, and deterministic scheduling logic.
  - Scope: vocabulary notes, flashcards, study states, SM-2-inspired review scheduling, daily queue, and local history.
  - Acceptance: create, edit, suspend, and review cards offline; Again/Hard/Good/Easy produce distinct intervals; reload preserves data.
  - Checks: `npm test -- --run` passed (7 tests: scheduler plus Dexie reopen/transaction/seed behavior); `npm run build` and `npm run lint` passed. Parent spot check: tests passed.

- [x] **VU-03 — Notes, vocabulary capture, and review experience**
  - Route: delegated; multi-file feature behavior and UX.
  - Scope: text notes plus camera/image attachment; candidate vocabulary review; flashcard creation and animated study flow.
  - Acceptance: user can capture/select an image, review extracted candidate words, reject/edit them, and add confirmed words to local vocabulary; daily review queue is usable.
  - Checks: `npm test -- --run` passed (12 tests including candidate-update/confirmation safety); `npm run build` and `npm run lint` passed. Parent spot check: tests passed. Manual camera/file and keyboard runtime checks remain pending.

- [x] **VU-04 — Secure Gemini content generation**
  - Route: delegated; client/backend boundary.
  - Scope: Supabase Edge Function contract for Gemini, structured flashcard/quiz generation, image vocabulary extraction, writing prompt/feedback, resilient error states.
  - Acceptance: no client API key; AI calls show progress, validation, retry/error UX, and remain optional to offline study.
  - Checks: `npm test -- --run` passed (20 tests); non-network Edge smoke checks rejected malformed/forged inputs and returned missing-secret responses; `npm run build` and `npm run lint` passed. Parent spot check: tests passed. Remote deployment was authorized and completed: the `vokki-ai` function is active. Gemini secrets are still unconfigured.

- [x] **VU-05 — Quiz, writing, and progress dashboard**
  - Route: delegated; multi-module study workflows.
  - Scope: generated quizzes with feedback/retry, writing sessions with Spanish feedback, B2 progress and streak/statistics.
  - Acceptance: completed activity updates persistent progress; dashboard explains current status and next study action.
  - Checks: `npm test -- --run` passed (29 tests); `npm run build` and `npm run lint` passed. Parent spot check: tests passed. Responsive browser QA remains pending.

- [ ] **VU-06 — Supabase sync and PWA delivery**
  - Route: delegated; cloud integration and deployment configuration.
  - Scope: opt-in authentication/sync, conflict-safe offline reconciliation, PWA manifest/service worker, install UX.
  - Acceptance: app works offline before sign-in; sync does not lose locally created data; install prompt/manifest work on supported browsers.
  - Progress: PWA install/offline shell is implemented and production build generated manifest plus service worker (20 precache entries). Browser QA confirmed responsive shell, theme persistence, navigation, and IndexedDB card persistence after reload. Local-first Supabase sync foundation and RLS migration are implemented; 37 tests, build, and lint pass. Remote deployment verified: migration `202610180001_initial_study_sync.sql` applied under name `202610180001_initial_study_sync` (remote history version `20261018185839`); five `public.study_*` tables exist with RLS enabled. Edge Function `vokki-ai` is ACTIVE at version 1 with JWT verification enabled. The user reports Gemini secrets and anonymous sign-ins are configured; live auth/RLS/sync remains to be independently validated, along with actual offline-network reload, Chromium/Safari installation, and performance.

- [x] **VU-07 — Readable, modular card experience**
  - Route: delegated; component extraction and cross-screen typography/layout refinement.
  - Scope: replace the hardcoded profile name with a single shared source; improve small-screen typography and vertical rhythm; separate flashcard creation from review; extract reusable card UI views and style primitives without changing study-domain behavior.
  - Acceptance: no visible hardcoded “Kiev”; body/supporting text is legible at phone width; card creation and review are distinct, obvious flows; each extracted component has a focused responsibility; repeated style rules are componentized rather than duplicated.
  - Checks: unit tests, build, lint, and browser QA at mobile and desktop widths.
  - Verification: `npm test -- --run` passed (37 tests); `npm run build` passed (Vite 8.0.16; existing chunk-size advisory only); `npm run lint` passed. Independent browser QA passed at desktop and 390×844: no horizontal overflow, distinct review/create/library flows, and populated editing. No focused UI tests were added because this workspace has no existing UI interaction test harness; existing deterministic domain tests passed.
  - Implementation: replaced the sample personal name with neutral profile/greeting copy; introduced reusable card views and a shared panel/section-heading primitive; separated review, create/edit, and library into explicit card flows; added typography, spacing, and radius tokens plus phone-focused readability and touch-target refinements.

- [ ] **VU-08 — Component-scoped styling architecture**
  - Route: delegated; style ownership refactor across the existing UI surface.
  - Scope: preserve global reset/theme tokens in `index.css`, move feature/component-specific rules out of the monolithic `App.css` into colocated CSS Modules, and retain the verified VU-07 visual behavior.
  - Acceptance: each feature/component owns its styles; shared primitives expose deliberate reusable styling; no screen-specific styling remains in the application-shell stylesheet; build, lint, and visual QA continue to pass.
  - Checks: tests, build, lint, and targeted phone/desktop browser QA.

- [x] **VU-09A — AI-enriched image vocabulary batches**
  - Route: delegated; extends local vocabulary, Gemini contract, and candidate review flow.
  - Scope: preserve the raw note as user context; enrich image candidates with canonical corrected English, Spanish meaning, and English phonetic transcription; allow selecting and confirming multiple candidates atomically into cards.
  - Acceptance: a user can upload/take a photo, review and edit AI candidates, see corrections without losing the original input, select multiple entries, and create non-duplicate local cards in one action. Offline/manual fallback remains usable.
  - Checks: 42 deterministic tests passed; production build and lint passed. Browser QA not run. No Edge Function deployment or remote service calls.

- [ ] **VU-09B — Traceable study activity and readable UI refinement**
  - Route: delegated; local activity history plus targeted UX refinement.
  - Scope: record meaningful local study actions for progress traceability; make light-theme contrast and type scale legible; reduce visual noise around optional synchronization and active module content.
  - Acceptance: progress explains recent meaningful activity; light-mode text meets readable contrast/size expectations; optional sync is visually calm and does not compete with the active module.
  - Checks: deterministic history/progress tests, build, lint, and phone/desktop browser QA.

## Progress
- Created: 2026-10-17
- Completed: VU-01 — mobile-first Spanish application shell, responsive navigation, and persistent theme preference. Verification: build and lint passed.
- Completed: VU-02 — Dexie-backed offline cards, review log, deterministic SRS scheduler, editable/suspendable local cards, and persistence tests. Verification: 7 tests, build, and lint passed.
- Completed: VU-03 — offline notes, camera/file capture, persisted image previews, truthful candidate confirmation, and atomic local flashcard creation. Verification: 12 tests, build, and lint passed.
- Completed: VU-04 — secure local Gemini/Supabase Edge Function boundary, validated image requests/responses, and note-scoped extraction UX. Verification: 20 tests, build, lint, and non-network Edge smoke checks passed.
- Completed: VU-09A — explicit original/corrected vocabulary fields, Spanish meaning and IPA phonetics, editable/selectable candidates, and atomic duplicate-safe batch confirmation. Verification: 42 tests, production build, and lint passed; browser QA and deployment were intentionally not performed.
- Completed: VU-05 — persistent local quiz and writing workflows, derived progress/streak dashboard, and safe Gemini-assisted feedback boundary. Verification: 29 tests, build, and lint passed.
- Completed: VU-07 — neutral profile copy, legible mobile typography/spacing, modular card views, and separate review/create/library flows. Verification: 37 tests, build, lint, and independent desktop/phone browser QA passed.
- Next: configure the Gemini secrets outside chat, confirm anonymous sign-ins are enabled, then validate live auth/RLS/sync and device/offline behavior.











