import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { getSupabasePublicConfig } from './config';

export class SupabaseConfigurationError extends Error {
  constructor() {
    super('Supabase public URL and publishable key are not configured.');
    this.name = 'SupabaseConfigurationError';
  }
}

export async function createSupabaseServerClient(): Promise<SupabaseClient> {
  const config = getSupabasePublicConfig();
  if (!config) throw new SupabaseConfigurationError();

  const cookieStore = await cookies();
  return createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components cannot set cookies; middleware owns refresh writes.
        }
      }
    }
  }) as SupabaseClient;
}
