import { AppShell } from '@/components/layout/app-shell';
import { ImportExportWorkspace } from '@/domains/import-export/components/import-export-workspace';

type ImportExportPageProps = {
  searchParams: Promise<{ from?: string }>;
};

export default async function ImportExportPage({
  searchParams
}: ImportExportPageProps) {
  const { from } = await searchParams;

  return (
    <AppShell>
      <ImportExportWorkspace origin={from === 'cards' ? 'cards' : 'settings'} />
    </AppShell>
  );
}
