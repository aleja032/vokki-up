import { AppShell } from '@/components/layout/app-shell';
import { NotesWorkspace } from '@/domains/notes/components/notes-workspace';
export default function NotesPage() {
  return (
    <AppShell>
      <NotesWorkspace />
    </AppShell>
  );
}
