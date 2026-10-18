import { describe, expect, it, vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseAccessToken } from './supabaseClient'

function authClient(auth: Record<string, unknown>): SupabaseClient {
  return { auth } as unknown as SupabaseClient
}

describe('Supabase authenticated access token', () => {
  it('reuses an existing session without signing in again', async () => {
    const signInAnonymously = vi.fn()
    const client = authClient({
      getSession: vi.fn().mockResolvedValue({ data: { session: { access_token: 'existing-session-token' } }, error: null }),
      signInAnonymously,
    })

    await expect(getSupabaseAccessToken(client)).resolves.toBe('existing-session-token')
    expect(signInAnonymously).not.toHaveBeenCalled()
  })

  it('creates an anonymous session when no session exists', async () => {
    const signInAnonymously = vi.fn().mockResolvedValue({ data: { session: { access_token: 'anonymous-session-token' } }, error: null })
    const client = authClient({
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      signInAnonymously,
    })

    await expect(getSupabaseAccessToken(client)).resolves.toBe('anonymous-session-token')
    expect(signInAnonymously).toHaveBeenCalledOnce()
  })

  it('returns a safe Spanish error when anonymous auth is unavailable', async () => {
    const client = authClient({
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      signInAnonymously: vi.fn().mockResolvedValue({ data: { session: null }, error: new Error('private auth detail') }),
    })

    await expect(getSupabaseAccessToken(client)).rejects.toThrow('No pudimos validar tu sesión')
    await expect(getSupabaseAccessToken(null)).rejects.toThrow('La IA todavía no está configurada')
  })
})
