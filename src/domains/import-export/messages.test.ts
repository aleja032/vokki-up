import { afterEach, describe, expect, it } from 'vitest';
import { setAppLanguage } from '@/lib/i18n/locale';
import { importExportMessages } from './messages';

describe('import-export messages', () => {
  afterEach(() => setAppLanguage('Español'));

  it('resolves issue texts in the active language at read time', () => {
    setAppLanguage('English');
    expect(importExportMessages.issues.missingColumns('word')).toBe(
      'Missing required columns: word.'
    );
    expect(importExportMessages.issues.invalidRow(4)).toBe(
      'Row 4: missing word or meaning.'
    );
    expect(importExportMessages.issues.wrongExtension).toBe(
      'Choose a file with a .csv extension.'
    );
  });
});
