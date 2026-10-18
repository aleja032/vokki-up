-- Apply only after enabling anonymous sign-ins in the target Supabase Auth project.
-- Each row belongs to exactly one authenticated (including anonymous) user.
create table if not exists public.study_cards (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null check (length(id) > 0),
  updated_at timestamptz not null,
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  primary key (user_id, id)
);

create table if not exists public.study_notes (like public.study_cards including all);
create table if not exists public.study_review_logs (like public.study_cards including all);
create table if not exists public.study_quiz_attempts (like public.study_cards including all);
create table if not exists public.study_writing_sessions (like public.study_cards including all);

-- LIKE INCLUDING ALL does not copy foreign keys.
alter table public.study_notes add constraint study_notes_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.study_review_logs add constraint study_review_logs_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.study_quiz_attempts add constraint study_quiz_attempts_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.study_writing_sessions add constraint study_writing_sessions_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;

-- Client clocks can differ, but an older timestamp must never overwrite a newer server row.
create or replace function public.keep_newer_study_row()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.updated_at <= old.updated_at then
    return old;
  end if;
  return new;
end;
$$;

create or replace function public.reject_append_only_study_change()
returns trigger language plpgsql set search_path = '' as $$
begin
  raise exception 'Study events are append-only' using errcode = '23514';
end;
$$;

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'study_cards', 'study_notes', 'study_review_logs', 'study_quiz_attempts', 'study_writing_sessions'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all on public.%I from anon, authenticated, public', table_name);
  end loop;
  foreach table_name in array array['study_cards', 'study_notes', 'study_writing_sessions'] loop
    execute format('create policy %I on public.%I for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)', 'own_' || table_name, table_name);
    execute format('create trigger %I before update on public.%I for each row execute function public.keep_newer_study_row()', 'keep_newer_' || table_name, table_name);
    execute format('grant select, insert, update, delete on public.%I to authenticated', table_name);
  end loop;
  foreach table_name in array array['study_review_logs', 'study_quiz_attempts'] loop
    execute format('create policy %I on public.%I for select to authenticated using ((select auth.uid()) = user_id)', 'read_' || table_name, table_name);
    execute format('create policy %I on public.%I for insert to authenticated with check ((select auth.uid()) = user_id)', 'append_' || table_name, table_name);
    execute format('create trigger %I before update or delete on public.%I for each row execute function public.reject_append_only_study_change()', 'append_only_' || table_name, table_name);
    execute format('grant select, insert on public.%I to authenticated', table_name);
  end loop;
end;
$$;

revoke all on function public.keep_newer_study_row() from public;
revoke all on function public.reject_append_only_study_change() from public;
