# Step 3: Notes and Writing

## Objective
Build independent Notes and Writing modules that match the supplied Vokki Up visual proposal and remain local-only.

## Problem and rationale
Learners need a focused space to capture and organize notes, plus a writing workspace that turns a prompt response into structured, readable mock feedback.

## Scope
- Notes: focused note list, search/category selection, editor, detail/update interactions, independent of Cards.
- Writing: category selection, prompt, writing editor, mock feedback with overall score and clarity, vocabulary, grammar metrics plus corrections.
- Typed mock data, client-local state, reusable responsive components.
- No persistence, auth, AI, backend, sync, or unrelated dependencies.

## Constraints
- Match the supplied HTML proposal as the UI source of truth.
- Keep Notes and Writing as separate domains.
- Do not edit the original Vite repository.
- Do not commit or push.

## Authorized scope
`planning/tasks/step-3-notes-writing.md`, `src/app/notes/page.tsx`, `src/app/writing/page.tsx`, `src/domains/notes/**`, `src/domains/writing/**`, `src/components/ui/**`, `src/app/globals.css`.

## Route declaration
Delegated direct. Notes and Writing are two related but distinct non-trivial modules and require proposal-informed component work.

## Acceptance criteria
- [x] Notes provide independent note browsing/search and editable local notes.
- [x] Writing includes topic/category selection, a prompt, editor, and a structured mock feedback state.
- [x] Feedback exposes overall score, clarity, vocabulary, grammar, and concrete corrections.
- [x] Both modules have reusable components and responsive desktop/tablet/mobile layouts aligned to the proposal.
- [x] No persistence, auth, AI, sync, or provider integrations are introduced.

## Verification
- `pnpm exec tsc --noEmit` — passed (exit 0).
- `pnpm lint` — passed (exit 0).
- `pnpm build` — passed (exit 0); Next.js generated `/notes` and `/writing` routes.

## Progress
- [x] Read repository guidance and inspect the visual proposal.
- [x] Inspect the existing app routes and design tokens.
- [x] Implement Notes domain and route.
- [x] Implement Writing domain and route.
- [x] Run all requested checks and record exact results.

## Next step
Continue with the next product task. The Notes and Writing modules are complete within the requested local-only scope.