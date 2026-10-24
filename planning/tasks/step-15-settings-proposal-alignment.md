# Step 15: Settings proposal alignment

## Objective
Align the Settings route with the supplied mobile and desktop HTML states while preserving local-only configuration and the provider-agnostic AI boundary.

## Problem and rationale
The existing Settings scaffold uses Aprendizaje/Perfil panels that differ from the reference's Perfil/Proveedor IA tabs and desktop two-column arrangement. As with prior proposal mismatches, this task extracts the reference states before changing the UI so the HTML remains the contract rather than a source of inspiration.

## Scope
- Match mobile and desktop profile/AI settings sections, controls, wording, status, responsive behavior, and app tokens.
- Preserve browser-local language, level, daily goal, theme, provider, and model values; add local toggles for AI usage preferences.
- Show a safe local-only connection state. Do not request, persist, expose, or use provider credentials and do not make provider calls.
- Keep destructive data actions non-operational if implementing them would erase unrelated local app data without a separate authorization.

## Constraints
- The supplied HTML is the sole visual source of truth.
- No secrets, API-key input/storage, remote calls, provider testing, Storybook, Docker, unrelated dependencies, commits, or pushes.
- Keep all changes inside the authorized Settings and shared UI surfaces.

## Authorized scope
- planning/tasks/step-15-settings-proposal-alignment.md
- src/domains/settings/**
- src/app/settings/**
- src/app/globals.css
- src/components/**

## Route declaration
Direct implementation within the Settings domain; the mobile tabs, desktop columns, local setting state, and shared responsive styles form one coherent proposal-alignment task.

## Acceptance criteria
- [x] Mobile shows the Perfil and Proveedor IA tabs with profile as the initial view and proposal-aligned navigation.
- [x] Profile includes name/account summary, English level A1–C2, daily card goal, theme, desktop language, export action, and a disabled delete control.
- [x] AI settings include provider/model choices, an unconfigured local connection state, and local toggles for card creation and writing feedback.
- [x] Desktop presents profile and AI configuration side by side, with Guardar cambios; mobile remains a readable single-column tab flow.
- [x] Existing tracked local preference updates remain functional; no credentials or remote calls are introduced.
- [x] TypeScript, lint, production build, and Impeccable detector checks completed successfully.

## Verification
- pnpm exec tsc --noEmit — exit 0.
- pnpm lint — exit 0.
- pnpm build — exit 0; generated /settings and other configured routes.
- Impeccable detector — final pass exit 0, output []. Two detector invocations were made because the first pass preceded removal of non-reference copy; both returned [].

## Progress
- [x] Load Impeccable instructions and inspect the mobile/desktop reference states.
- [x] Inspect the existing Settings route, domain, theme tokens, and previous Settings decision.
- [x] Implement proposal-aligned mobile tabs and desktop panels with local-only state.
- [x] Run all requested checks and record unavailable or intentionally excluded states.

## Reference limitations
- The proposal bundle contains only light Settings states; dark presentation uses the existing theme tokens and cannot be verified against a dedicated dark reference.
- The HTML includes API-key entry/testing controls, but those controls are intentionally omitted because this task forbids credentials and provider calls; connection stays accurately Sin configurar.
- The destructive Borrar todos mis datos control is present but disabled to avoid erasing app-wide local data without explicit authorization.

## Next step
Settings proposal alignment is complete; continue with the next requested product task.
