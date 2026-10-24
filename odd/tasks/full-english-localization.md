# Full English localization

## Objective
Add a complete English translation for the Vokki Up interface while preserving the approved UI, current Spanish default, local-first behavior, and persisted language selection.

## Problem
The settings selector persists a language value but user-facing copy is hard-coded in Spanish, so selecting English does not translate the interface.

## Scope
- Add a reusable message catalog with Spanish and English locales.
- Connect the active language preference to the app shell and all user-facing module copy.
- Preserve interpolation, accessibility labels, validation/errors, empty states, and auth/settings copy.
- Keep Spanish as the default and ensure language changes persist across reloads.
- Add focused tests for catalog coverage and language switching.

## Constraints
- Preserve current visual/UI structure; no redesign.
- Do not expose secrets or change backend behavior.
- Keep existing concurrent worktree changes untouched.
- Source identifiers remain English; product copy may be localized.

## Tasks
- [x] I18N-01 Map current copy and define typed catalog boundaries.
- [x] I18N-02 Implement locale state/provider and reusable message access.
- [x] I18N-03 Replace module and shell copy with locale messages.
- [x] I18N-04 Add tests and run typecheck/lint/build checks.

## Acceptance criteria
- Selecting English updates the entire visible interface without a reload.
- Reloading preserves the selected locale.
- Spanish remains the default and remains complete.
- No visible hard-coded Spanish copy remains in active UI components except intentional user content/examples.
- Missing message keys fail safely to Spanish and are covered by tests.
- Current UI layout and behavior remain unchanged.

## Route
Delegated direct: repository-wide copy mapping and multi-file implementation exceed the inline evidence budget and touch multiple non-trivial files. One explorer maps the surface, then one writer implements the bounded localization slice.

## Verification
- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm build`
- focused localization tests

## Progress
Implemented the reusable locale proxy and global provider. Existing message catalogs, site navigation, Home copy, and validation messages now resolve Spanish or English at render time. Language selection updates the provider immediately and persists through the existing settings storage. Focused localization tests, TypeScript, lint, and production build all pass.

## Verification evidence
- `pnpm exec vitest run src/lib/i18n/locale.test.ts` — 3 tests passed.
- `pnpm exec tsc --noEmit` — passed.
- `pnpm lint` — passed.
- `pnpm build` — passed.
- Work-unit commit: `6840165 feat(i18n): add app-wide English localization`.
- Follow-up translation coverage: `26b4213 feat(i18n): complete module copy translations`.
