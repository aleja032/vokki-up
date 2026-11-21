import { Suspense } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { WordLibraryPageContainer } from './word-library-page-container';

export default function WordLibraryPage() {
  return (
    <AppShell>
      <Suspense fallback={null}>
        <WordLibraryPageContainer />
      </Suspense>
    </AppShell>
  );
}
