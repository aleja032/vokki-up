# Settings, provider testing, reminders, and notes management

## Objective

Make the authenticated Settings experience truthful and useful, complete the provider connection test, preserve the selected theme, and add user-managed Notes categories without changing the approved visual language.

## Problem

The profile panel is not auth-aware, the provider test is a disabled preview, theme application can flash or reset on navigation, the delete-data CTA is unnecessary, reminders only toggle local state, and Notes categories are fixed constants.

## Scope

- Show the authenticated user's display name/email state correctly and hide the sign-in action after login.
- Implement a real provider connection test using saved credentials for authenticated users and transient credentials for guests.
- Persist and reapply theme consistently across navigation and reloads.
- Increase native dropdown spacing without changing the approved component structure.
- Remove the disabled delete-data CTA.
- Add Notes category CRUD, validation, persistence, and favorite behavior coverage.
- Define reminder delivery boundaries; email delivery requires an external provider and scheduled server execution.

## Constraints

- Preserve approved UI structure and existing local-first behavior.
- Never expose full API keys or log credentials.
- Do not send reminder emails until delivery provider, schedule, and consent are defined.
- Do not add Storybook or Docker.

## Acceptance criteria

- Authenticated profile copy uses the current session and does not show a sign-in CTA.
- Provider test returns actionable success/error states and uses the selected provider/model.
- Theme remains stable when navigating to Settings and after reload.
- Dropdown controls have clear internal spacing on desktop and mobile.
- Delete-data CTA is removed without leaving an empty action gap.
- Users can create, rename, edit, and remove/reassign Notes categories; favorites continue to work.
- Authenticated reminder consent and enabled state persist server-side; guest reminder preferences remain local-only. Email delivery stays unavailable until required Resend, Supabase service-role, verified-sender, and cron settings are configured.
- Focused tests, typecheck, lint, and build pass for completed tasks.

## Tasks

- [x] SET-01 Make profile panel auth-aware. Authenticated sessions display the session name (falling back to email) and email, while the sign-in CTA is shown only after a guest session is confirmed.
- [x] SET-02 Implement provider connection test endpoint and UI state. Authenticated checks use the saved server-side key and reject cross-provider use; guest checks send only the transient in-memory key. Gemini performs a minimal `generateContent` request and returns safe success/error plus latency; unsupported provider checks fail actionably. The UI wires loading, result, latency, and error states while retaining preview fallbacks.
- [x] SET-03 Stabilize theme hydration and dropdown spacing; remove delete-data CTA. Theme application now waits for browser-state hydration, Settings and Notes selects reserve clearer horizontal space for their native indicators, and the unavailable delete-data action is removed.
- [x] SET-04 Implement consent-gated authenticated email reminders with Resend and Vercel Cron. A fixed 20:00 UTC daily schedule is used for Vercel Hobby compatibility; authenticated consent/enabled state and last-send date are stored in Supabase, and guest settings remain local-only.
- [x] SET-05 Add Notes category CRUD, validation, local persistence, and tests. Deleting a category reassigns its notes to the protected `General` category; note content and favorite state are preserved. New notes fall back to an existing category if `Ideas` was deleted.

## Route

Delegated direct: read-only exploration mapped the settings, provider, auth, notes, and reminder flows. Implementation should use one writer per bounded task; parent performs verification and preserves unrelated worktree changes.

## Progress

- Status: SET-01 through SET-05 implemented; SET-04 focused verification passed.
- SET-01 verification: no focused ProfilePanel/auth-session test exists; `pnpm exec tsc --noEmit` passed; `pnpm lint` passed.
- SET-02 verification: focused provider/route tests passed (4 tests); `pnpm exec tsc --noEmit`, `pnpm lint`, and `pnpm build` passed.
- SET-03 verification: `pnpm exec vitest run` passed (20 files, 74 tests); `pnpm exec tsc --noEmit`, `pnpm lint`, and `pnpm build` passed; Impeccable detector returned no findings. No focused theme-hydration test exists.
- SET-05 verification: `pnpm exec vitest run src/domains/notes/note.schema.test.ts` passed (8 tests); `pnpm exec tsc --noEmit`, `pnpm lint`, and `pnpm build` passed.
- SET-04 verification: `pnpm exec vitest run src/app/api/reminders/send/route.test.ts` passed (5 tests); `pnpm exec tsc --noEmit` passed; focused ESLint on reminder route/helpers/Settings files passed. The full suite/build were not run for this task.
- SET-04 setup: apply `supabase/migrations/20261024140000_email_reminder_preferences.sql`; configure server-only `CRON_SECRET` (at least 16 characters), `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `NEXT_PUBLIC_SUPABASE_URL`; set `RESEND_SENDER_DOMAIN_VERIFIED=true` only after verifying the sender domain in Resend. Vercel Cron calls `/api/reminders/send` daily at `20:00 UTC` and may arrive within that hour on Hobby. Delivery fails closed when any required value or sender-domain verification flag is absent. Resend is called through its REST API, so no package dependency was added.

## Delivery

- Strategy: ask-on-risk; keep work units reviewable and do not commit or push without explicit user request.
