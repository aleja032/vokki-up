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

export async function getSupabaseAccessToken(client: SupabaseClient | null = getConfiguredSupabaseClient()): Promise<string> {
  const unavailableMessage = 'No pudimos validar tu sesión para usar la IA. Probá de nuevo o seguí sin conexión.'
  if (!client) throw new Error('La IA todavía no está configurada. Podés seguir agregando palabras manualmente.')

  try {
    const { data, error } = await client.auth.getSession()
    if (error) throw error
    if (data.session?.access_token) return data.session.access_token

    const { data: signInData, error: signInError } = await client.auth.signInAnonymously()
    if (signInError || !signInData.session?.access_token) throw signInError ?? new Error('Missing anonymous session')
    return signInData.session.access_token
  } catch {
    throw new Error(unavailableMessage)
  }
}
