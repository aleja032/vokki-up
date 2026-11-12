import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { FEATURES } from '@/config/features';
import { WritingWorkspace } from '@/domains/writing/components/writing-workspace';
export default function WritingPage() {
  if (!FEATURES.writing) notFound();

  return (
    <AppShell>
      <WritingWorkspace />
    </AppShell>
  );
}
