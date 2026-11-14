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
