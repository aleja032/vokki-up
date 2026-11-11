'use client';

import { CardsDashboard } from '@/domains/cards/components/cards-dashboard';
import type { AddHubMode } from './add-hub-modes';
import { CardsAddHub } from './cards-add-hub';

type CardsPageContainerProps = {
  initialMode: AddHubMode;
};

/** Composes the cards dashboard with the add hub (cards + ai domains). */
export function CardsPageContainer({ initialMode }: CardsPageContainerProps) {
  return (
    <CardsDashboard
      renderAddPanel={panel => (
        <CardsAddHub panel={panel} initialMode={initialMode} />
      )}
    />
  );
}
