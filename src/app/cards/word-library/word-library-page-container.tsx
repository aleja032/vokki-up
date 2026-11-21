'use client';

import { useSearchParams } from 'next/navigation';
import { WordLibrary } from '@/domains/cards/components/word-library';

// `?world=<id>` opens one world, `?world=all` the whole catalog; without it the
// page is the worlds hub.
export function WordLibraryPageContainer() {
  const searchParams = useSearchParams();

  return <WordLibrary worldParam={searchParams.get('world')} />;
}
