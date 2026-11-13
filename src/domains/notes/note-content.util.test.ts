import { describe, expect, it } from 'vitest';
import { getNotePreview, groupNoteSections } from './note-content.util';

describe('note content', () => {
  it('keeps existing notes unchanged', () => {
    expect(groupNoteSections('## Title\n- one\n- two\nplain')).toEqual([
      {
        heading: 'Title',
        blocks: [
          { type: 'list', items: ['one', 'two'] },
          { type: 'paragraph', text: 'plain' }
        ]
      }
    ]);
  });

  it('hides inline marks in previews', () => {
    expect(getNotePreview('**bold** and _it_\n- ++under++')).toBe(
      'bold and it · under'
    );
  });
});
