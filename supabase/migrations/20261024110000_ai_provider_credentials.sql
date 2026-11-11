create table if not exists public.ai_provider_credentials (
  user_id uuid primary key references auth.users (id) on delete cascade,
  provider text not null check (provider in ('gemini', 'openai')),
  model text not null,
  key_ciphertext text not null,
  key_iv text not null,
  key_auth_tag text not null,
  key_last_four text not null check (char_length(key_last_four) = 4),
  updated_at timestamptz not null default now(),
  constraint ai_provider_credentials_model_allowlist check (
    (provider = 'gemini' and model in ('gemini-3.5-flash-lite', 'gemini-2.5-flash', 'gemini-2.5-pro'))
    or (provider = 'openai' and model in ('gpt-4o-mini', 'gpt-4o'))
  )
);

alter table public.ai_provider_credentials enable row level security;
revoke all on public.ai_provider_credentials from anon;
grant select, insert, update, delete on public.ai_provider_credentials to authenticated;

create policy "Users manage their own AI credentials"
on public.ai_provider_credentials
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
