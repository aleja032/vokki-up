import { describe, expect, it } from 'vitest';
import { parseSupabaseConfig } from './config';

describe('parseSupabaseConfig', () => {
  it('accepts only the public URL and publishable key configuration', () => {
    expect(
      parseSupabaseConfig(
        'https://project-id.supabase.co',
        'sb_publishable_example'
      )
    ).toEqual({
      url: 'https://project-id.supabase.co',
      publishableKey: 'sb_publishable_example'
    });
  });

  it('allows local HTTP endpoints for development', () => {
    expect(
      parseSupabaseConfig('http://127.0.0.1:54321', 'sb_publishable_example')
    ).not.toBeNull();
  });

  it('rejects missing or unsafe public configuration', () => {
    expect(parseSupabaseConfig('', 'key')).toBeNull();
    expect(parseSupabaseConfig('https://example.invalid', '')).toBeNull();
    expect(parseSupabaseConfig('http://example.invalid', 'key')).toBeNull();
    expect(parseSupabaseConfig('not a url', 'key')).toBeNull();
  });
});
