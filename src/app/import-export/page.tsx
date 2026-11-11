import { AppShell } from '@/components/layout/app-shell';
import { ImportExportWorkspace } from '@/domains/import-export/components/import-export-workspace';
export default function ImportExportPage() {
  return (
    <AppShell>
      <ImportExportWorkspace />
    </AppShell>
  );
}
