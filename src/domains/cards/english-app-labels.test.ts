import { afterEach, describe, expect, it } from 'vitest';
import { setAppLanguage } from '@/lib/i18n/locale';
import { cardsMessages } from './messages';
import { INITIAL_GROUPS } from './data';
import { createCapturedCardsLibrary } from './persistence/captured-cards';

describe('app-provided card labels in English', () => {
  afterEach(() => setAppLanguage('Español'));

  it('offers the AI capture flow the seed group names in English', () => {
    setAppLanguage('English');
    const { groups } = createCapturedCardsLibrary({
      groups: INITIAL_GROUPS,
      isReady: true,
      addCards: () => {}
    });
    expect(groups.map(group => group.name)).toEqual(
      expect.arrayContaining(['Work', 'Daily life', 'Travel'])
    );
    expect(groups.map(group => group.name)).not.toContain('Trabajo');
  });

  it('keeps the seed group names in Spanish for Spanish', () => {
    const { groups } = createCapturedCardsLibrary({
      groups: INITIAL_GROUPS,
      isReady: true,
      addCards: () => {}
    });
    expect(groups.map(group => group.name)).toContain('Trabajo');
  });

  it('suggests English tags and placeholder in English', () => {
    setAppLanguage('English');
    expect([...cardsMessages.cardEditor.tagsSuggestions]).toEqual([
      'work',
      'travel',
      'interviews'
    ]);
    expect(cardsMessages.cardEditor.tagsPlaceholder).toBe(
      'work, travel, interviews'
    );
  });

  it('keeps the Spanish tag suggestions for Spanish', () => {
    expect([...cardsMessages.cardEditor.tagsSuggestions]).toEqual([
      'trabajo',
      'viajes',
      'entrevistas'
    ]);
  });
});
