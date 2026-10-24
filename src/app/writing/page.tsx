import { AppShell } from '@/components/layout/app-shell';
import { WritingWorkspace } from '@/domains/writing/components/writing-workspace';
export default function WritingPage() {
  return (
    <AppShell>
      <WritingWorkspace />
    </AppShell>
  );
}
