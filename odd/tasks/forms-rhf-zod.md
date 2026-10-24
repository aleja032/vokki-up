# forms-rhf-zod

## Objective
Migrate the 3 forms (NoteEditor, GroupCreateForm, CardEditor) to React Hook Form + Zod per `.claude/rules/forms.md`, extract their UI strings to messages files, and remove inline styles in the cards group UI. No user-visible behavior change.

## Why
Rules require RHF + Zod, one schema per file, a submit hook per form, no hardcoded strings, no inline styles. Libraries were installed (zod 4.6.7, react-hook-form 7.91.0, @hookform/resolvers 6.0.0).

## Scope / authorized surface
`src/domains/notes/**`, `src/domains/cards/**` (forms, group-detail, new schema/hook/messages files), `src/app/globals.css` (tone CSS only).
Out of scope: other domains' hardcoded strings, Zustand stores, Atomic Design layers, Server Actions.

## Decisions (made by the agent, user may revert)
- No Server Action: the forms are client-only and persist via `useTrackedBrowserState` (localStorage + sync queue). This deviates from `forms.md`; schema is reused client-side only.
- Notes title stays optional (today an empty title is allowed); keep per-keystroke `onChange` propagation to the parent.
- Follow the zod-4 skill (v4 API), not the v3 examples inside the rule files. Keep flat domain layout (`components/`, no `organisms/`).
- File names: `<form>.schema.ts` flat in domain root, `hooks/use-<form>-submit.ts`, `messages.ts`, `validation-messages.ts`.

## Tasks
- [x] F1 Shared cards pieces: `group-colors.ts` (palette + tones, used by form and group-detail), `messages.ts` and `validation-messages.ts`; replace inline `style=` in `group-create-form.tsx` (83,87,146) and `group-detail.tsx` (57,62) with `data-tone` + CSS variables in `globals.css`.
- [x] F2 Group create form: `group-create.schema.ts` (+ duplicate-name factory), `hooks/use-group-create-submit.ts`, form refactor, `group-create.schema.test.ts`.
- [x] F3 Card editor: `card-create.schema.ts` (tags string -> string[] transform), `hooks/use-card-create-submit.ts`, refactor, schema test.
- [x] F4 Notes: `note.schema.ts`, `hooks/use-note-submit.ts`, `messages.ts`, `validation-messages.ts`, editor refactor, schema test.

## Acceptance criteria
- No `useState` for field values and no manual `preventDefault` in the 3 forms; errors rendered from RHF.
- No `style=` left in the cards group components.
- All visible strings of these forms come from messages files, copied verbatim (including quotes and ellipses).
- `npx tsc --noEmit`, `npx eslint src`, `npx vitest run` pass; new pure Zod tests use relative imports (vitest has no `@/` alias).

## Test policy
Schemas are pure and testable: write schema tests first (RED), then implement (GREEN). Components have no test infrastructure (no jsdom/testing-library); verify via tsc/eslint and report the manual browser check as pending.

## Routes (per task)
Delegated writer, sequential F1-F4 (2+ non-trivial files each). Trigger: Writer trigger.

## Progress
F1-F4 implemented by the delegated writer (no commits made). Schema tests written first and observed failing (module missing) before implementation.

## Verification evidence
- npx tsc --noEmit: clean
- npx eslint src: clean
- npx vitest run: 10 files, 34 tests pass (15 new schema tests: group 5, card 6, note 4)
- rg "style={" src/domains/cards: no matches
- useState left only in card-editor.tsx (UI-only capture mode); note isSaved state lives in use-note-submit.ts
- rg preventDefault in notes/cards: only card-review.tsx (not one of the 3 forms)
- Manual browser check (group/card persist to localStorage and enqueue sync; note autosave per keystroke): NOT performed. Colors: same hex values moved to CSS vars, not visually compared.
- Deviations: Date.now/randomUUID id helpers are module-level functions in the hooks (react-hooks/purity lint); group name empty-state shows no error (filtered by too_small) to keep behavior; card/note forms render no inline field errors (button stays disabled as before).

## Next step
Manual browser check, then commit per work unit.
