import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export interface SupabasePublicConfig {
  url: string
  publishableKey: string
}

let configuredClient: SupabaseClient | null = null

export function getSupabasePublicConfig(): SupabasePublicConfig | null {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim()
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()
  if (!url || !publishableKey || url.includes('your-project') || publishableKey.includes('your-supabase')) return null
  try {
    if (new URL(url).protocol !== 'https:') return null
  } catch {
    return null
  }
  return { url, publishableKey }
}

export function getConfiguredSupabaseClient(): SupabaseClient | null {
  const config = getSupabasePublicConfig()
  if (!config) return null
  configuredClient ??= createClient(config.url, config.publishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
  })
  return configuredClient
}
