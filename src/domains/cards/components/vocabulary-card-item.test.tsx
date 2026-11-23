import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { VocabularyCard } from '../types';
import { VocabularyCardItem } from './vocabulary-card-item';

const CARD: VocabularyCard = {
  id: 'card-1',
  term: 'handle',
  meaning: 'manejar',
  partOfSpeech: 'Verbo'
} as VocabularyCard;

function render(isManaging: boolean, isSelected: boolean) {
  return renderToStaticMarkup(
    <VocabularyCardItem
      card={CARD}
      now={new Date('2026-01-01T00:00:00Z')}
      isManaging={isManaging}
      isSelected={isSelected}
      onToggleSelect={() => undefined}
    />
  );
}

describe('VocabularyCardItem memory', () => {
  const schedule = {
    cardId: 'card-1',
    repetitions: 4,
    intervalMinutes: 60,
    dueAt: '2026-01-04T00:00:00Z',
    lastReviewedAt: '2025-12-31T00:00:00Z',
    lastRating: 'good'
  } as const;

  it('shows a new card with no filled memory segments', () => {
    const html = render(false, false);
    expect(html).toContain('data-tone="brand"');
    expect(html).toContain('aria-label="Memoria 0 de 5"');
    expect(html).toContain('>Nueva<');
  });

  it('derives tone, memory bar and due label from the schedule', () => {
    const html = renderToStaticMarkup(
      <VocabularyCardItem
        card={CARD}
        isManaging={false}
        isSelected={false}
        now={new Date('2026-01-01T00:00:00Z')}
        onToggleSelect={() => undefined}
        schedule={schedule}
      />
    );
    expect(html).toContain('data-tone="mint"');
    expect(html).toContain('aria-label="Memoria 4 de 5"');
    expect(html.split('data-filled="true"').length - 1).toBe(4);
    expect(html).toContain('en 3 días');
  });
});

describe('VocabularyCardItem manage mode', () => {
  it('has no selection control outside manage mode', () => {
    expect(render(false, false)).not.toContain('role="checkbox"');
  });

  it('exposes the whole card as one checkbox with its state', () => {
    const idle = render(true, false);
    const selected = render(true, true);

    expect(idle).toContain('role="checkbox"');
    expect(idle).toContain('aria-checked="false"');
    expect(idle).toContain('Seleccionar handle');
    expect(selected).toContain('aria-checked="true"');
    expect(selected).toContain('data-selected="true"');
  });
});

describe('VocabularyCardItem edit', () => {
  function renderWithEdit(isManaging: boolean) {
    return renderToStaticMarkup(
      <VocabularyCardItem
        card={CARD}
        isManaging={isManaging}
        isSelected={false}
        now={new Date('2026-01-01T00:00:00Z')}
        onEdit={() => undefined}
        onToggleSelect={() => undefined}
      />
    );
  }

  it('offers one named edit button over the tile outside manage mode', () => {
    const html = renderWithEdit(false);
    expect(html).toContain('deck-card__edit');
    expect(html).toContain('aria-label="Editar handle"');
  });

  it('replaces it with the selection checkbox in manage mode', () => {
    const html = renderWithEdit(true);
    expect(html).not.toContain('deck-card__edit');
    expect(html).toContain('role="checkbox"');
  });
});
