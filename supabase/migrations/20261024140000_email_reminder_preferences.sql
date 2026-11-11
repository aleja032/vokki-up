create table if not exists public.reminder_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  enabled boolean not null default false,
  consented_at timestamptz,
  last_sent_on date,
  updated_at timestamptz not null default now(),
  constraint reminder_preferences_consent_required check (not enabled or consented_at is not null)
);

alter table public.reminder_preferences enable row level security;
revoke all on public.reminder_preferences from anon;
grant select, insert, update, delete on public.reminder_preferences to authenticated;

drop policy if exists "Users manage their own reminder preferences" on public.reminder_preferences;
create policy "Users manage their own reminder preferences"
on public.reminder_preferences
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
