import { AppShell } from '@/components/layout/app-shell';
import { CardsDashboard } from '@/domains/cards/components/cards-dashboard';

export default function CardsPage() {
  return (
    <AppShell>
      <CardsDashboard />
    </AppShell>
  );
}
