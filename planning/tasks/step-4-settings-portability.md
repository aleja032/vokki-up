# Step 4: Settings and Data Portability

## Objective
Implement local-only Settings and CSV import/export UI scaffolding aligned to the supplied Vokki Up visual proposal.

## Problem and rationale
Learners need clear control over appearance, learning preferences, provider/model configuration, and a transparent future data portability workflow.

## Scope
- Settings: theme, language/learning preferences, daily limits, provider/model configuration only, account placeholders.
- Import/export: CSV schema preview, validation summary, explicit controls, exact preservation of group text.
- Typed mock data and local interactions only; componentized responsive modules.
- No auth backend, persistence, AI/provider calls, sync, or unrelated dependencies.

## Constraints
- Treat the supplied HTML as the UI source of truth.
- Provider/model selection is configuration UI only; never store a key or call a provider.
- Do not edit the original Vite repository, commit, or push.

## Authorized scope
`planning/tasks/step-4-settings-portability.md`, `src/app/settings/page.tsx`, `src/app/import-export/page.tsx`, `src/domains/settings/**`, `src/domains/import-export/**`, `src/components/ui/**`, `src/app/globals.css`.

## Route declaration
Delegated direct. Settings and portability each need multiple coordinated components and distinct local interactions.

## Acceptance criteria
- [x] Settings exposes theme, language, learning preferences, daily limits, provider/model choices, and account placeholders.
- [x] Theme, category, language, and limit controls respond locally without persistence.
- [x] Import/export presents the defined CSV fields, validation feedback, and explicit controls.
- [x] Imported group names remain unchanged, including capitalization and spacing.
- [x] Responsive layouts align with the proposal; no backend/auth/AI/sync or extra dependencies.

## Verification
- `pnpm exec tsc --noEmit` — passed (exit 0).
- `pnpm lint` — passed (exit 0).
- `pnpm build` — passed (exit 0); Next.js generated `/settings` and `/import-export` routes.

## Progress
- [x] Read the visual proposal and inspect existing routes and design tokens.
- [x] Implement typed Settings domain and route.
- [x] Implement typed portability domain and route.
- [x] Run and record all requested checks.

## Next step
Continue with the next product task. Settings and CSV portability are complete within the requested local-only scaffold scope.