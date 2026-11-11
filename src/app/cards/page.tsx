import { AppShell } from '@/components/layout/app-shell';
import { parseAddHubMode } from './add-hub-modes';
import { CardsPageContainer } from './cards-page-container';

type CardsPageProps = {
  searchParams: Promise<{ mode?: string | string[] }>;
};

export default async function CardsPage({ searchParams }: CardsPageProps) {
  const { mode } = await searchParams;
  return (
    <AppShell>
      <CardsPageContainer initialMode={parseAddHubMode(mode)} />
    </AppShell>
  );
}
