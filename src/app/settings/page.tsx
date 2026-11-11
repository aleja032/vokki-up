import { AppShell } from '@/components/layout/app-shell';
import { SettingsWorkspace } from '@/domains/settings/components/settings-workspace';
import type {
  ConnectionStatus,
  ConnectionTest,
  SettingsTab
} from '@/domains/settings/types';

interface SettingsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Development-only review aid for the static AI connection states:
 *   /settings?tab=provider&aiState=untested|testing|ok|error
 * Production always renders the default state.
 */
const PREVIEW_STATES: Record<
  string,
  { status: ConnectionStatus; test: ConnectionTest }
> = {
  untested: { status: 'untested', test: 'idle' },
  testing: { status: 'untested', test: 'testing' },
  ok: { status: 'ok', test: 'ok' },
  error: { status: 'error', test: 'error' }
};

export default async function SettingsPage({
  searchParams
}: SettingsPageProps) {
  const params = await searchParams;
  const isPreviewEnabled = process.env.NODE_ENV !== 'production';
  const preview =
    isPreviewEnabled && typeof params.aiState === 'string'
      ? PREVIEW_STATES[params.aiState]
      : undefined;
  const initialTab: SettingsTab =
    isPreviewEnabled && params.tab === 'provider' ? 'provider' : 'profile';

  return (
    <AppShell>
      <SettingsWorkspace
        connectionStatus={preview?.status}
        connectionTest={preview?.test}
        initialTab={initialTab}
      />
    </AppShell>
  );
}
