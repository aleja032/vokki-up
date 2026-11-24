import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';
import { setAppLanguage } from '@/lib/i18n/locale';
import type { HomeMission } from '@/lib/home/home-hand.types';
import { MissionCard } from './mission-card';

const mission: HomeMission = {
  steps: [{ term: 'receipt', state: 'current' }],
  doneCount: 0,
  nextTerm: 'receipt'
};

describe('MissionCard world name in English', () => {
  afterEach(() => setAppLanguage('Español'));

  it('shows the world name and alt text in English', () => {
    setAppLanguage('English');
    const html = renderToStaticMarkup(
      <MissionCard
        mission={mission}
        worldName="Día a día"
        href="/review"
      />
    );
    expect(html).toContain('Daily life');
    expect(html).not.toContain('Día a día');
  });
});
