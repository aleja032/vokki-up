export type SupabasePublicConfig = {
  url: string;
  publishableKey: string;
};

export function parseSupabaseConfig(
  url: string | undefined,
  publishableKey: string | undefined
): SupabasePublicConfig | null {
  if (!url?.trim() || !publishableKey?.trim()) return null;

  try {
    const parsed = new URL(url);
    const isLocalHttp =
      parsed.protocol === 'http:' &&
      (parsed.hostname === 'localhost' ||
        parsed.hostname === '127.0.0.1' ||
        parsed.hostname === '[::1]');
    if (parsed.protocol !== 'https:' && !isLocalHttp) return null;
    if (!parsed.hostname) return null;
    return { url: parsed.origin, publishableKey: publishableKey.trim() };
  } catch {
    return null;
  }
}

export function getSupabasePublicConfig(): SupabasePublicConfig | null {
  return parseSupabaseConfig(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}
