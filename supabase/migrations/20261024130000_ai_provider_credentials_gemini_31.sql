alter table public.ai_provider_credentials
  drop constraint if exists ai_provider_credentials_model_allowlist;

alter table public.ai_provider_credentials
  add constraint ai_provider_credentials_model_allowlist check (
    (provider = 'gemini' and model in ('gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-2.5-pro'))
    or (provider = 'openai' and model in ('gpt-4o-mini', 'gpt-4o'))
  );