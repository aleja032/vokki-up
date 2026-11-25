import { afterEach, describe, expect, it } from 'vitest';
import { setAppLanguage } from '@/lib/i18n/locale';
import { INITIAL_NOTES } from './data';
import { getNoteDisplay } from './seed-note-display';

const SPANISH_MARKERS =
  /Para empezar|Para matizar|participio|Cuando importa|Lo que noté|Conectores|Cuándo usarlo|Reglas clave|Formas|Negativo y pregunta|Propinas|opinión|redacciones|Presente simple/;

describe('getNoteDisplay', () => {
  afterEach(() => setAppLanguage('Español'));

  it('returns the stored note in Spanish', () => {
    setAppLanguage('Español');
    for (const note of INITIAL_NOTES) {
      expect(getNoteDisplay(note)).toEqual(note);
    }
  });

  it('shows every untouched seed note in English', () => {
    setAppLanguage('English');
    for (const note of INITIAL_NOTES) {
      const display = getNoteDisplay(note);
      expect(display.id).toBe(note.id);
      expect(display.category).toBe(note.category);
      expect(`${display.title}\n${display.body}`).not.toMatch(SPANISH_MARKERS);
    }
    expect(getNoteDisplay(INITIAL_NOTES[0]).title).toBe('Giving my opinion');
    expect(getNoteDisplay(INITIAL_NOTES[0]).body).toContain('I believe that…');
  });

  it('keeps the English example phrases untouched', () => {
    setAppLanguage('English');
    expect(getNoteDisplay(INITIAL_NOTES[1]).body).toContain(
      'I have finished my homework.'
    );
  });

  it('returns the user text when the note differs from the seed', () => {
    setAppLanguage('English');
    const edited = { ...INITIAL_NOTES[0], title: 'Mi título' };
    expect(getNoteDisplay(edited)).toBe(edited);
    const editedBody = { ...INITIAL_NOTES[2], body: 'Mi texto' };
    expect(getNoteDisplay(editedBody)).toBe(editedBody);
  });

  it('never translates notes the user created', () => {
    setAppLanguage('English');
    const own = {
      id: 'note-1',
      title: 'Presente simple',
      category: 'Ideas',
      body: INITIAL_NOTES[6].body,
      updatedAt: 'Ahora'
    };
    expect(getNoteDisplay(own)).toBe(own);
  });
});
