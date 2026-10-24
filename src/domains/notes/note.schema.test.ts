import { describe, expect, it } from 'vitest';
import { noteSchema } from './note.schema';
import { createNoteCategorySchema } from './note.schema';
import {
  reassignNoteCategory,
  renameNoteCategory,
  sortNotesFavoritesFirst
} from './data';
import type { Note } from './types';
import { notesValidationMessages } from './validation-messages';

describe('noteSchema', () => {
  it('allows an empty title and body', () => {
    const result = noteSchema.safeParse({
      title: '',
      category: 'Ideas',
      body: ''
    });

    expect(result.success).toBe(true);
  });

  it('keeps text exactly as typed without trimming', () => {
    const input = { title: ' Hola ', category: 'Cultura', body: 'texto \n' };
    const result = noteSchema.safeParse(input);

    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual(input);
  });

  it('accepts custom category names', () => {
    expect(
      noteSchema.safeParse({ title: 't', category: 'Mis ideas', body: 'b' })
        .success
    ).toBe(true);
  });

  it('rejects an empty category', () => {
    const result = noteSchema.safeParse({
      title: 't',
      category: '  ',
      body: 'b'
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        notesValidationMessages.categoryInvalid
      );
    }
  });

  it('rejects blank, duplicate, and overlong category names', () => {
    const categories = ['General', 'Ideas'];
    expect(
      createNoteCategorySchema(categories).safeParse({ name: ' ' }).success
    ).toBe(false);
    expect(
      createNoteCategorySchema(categories).safeParse({ name: 'ideas' }).success
    ).toBe(false);
    expect(
      createNoteCategorySchema(categories).safeParse({ name: 'x'.repeat(41) })
        .success
    ).toBe(false);
  });

  it('allows the current category name while editing', () => {
    expect(
      createNoteCategorySchema(['General', 'Ideas'], 'Ideas').safeParse({
        name: 'Ideas'
      }).success
    ).toBe(true);
  });
});

describe('note category updates', () => {
  const note: Note = {
    id: 'n1',
    title: 'Favorite note',
    category: 'Ideas',
    body: 'Content',
    updatedAt: 'Today',
    favorite: true
  };

  it('renames a category without changing note data or favorite state', () => {
    expect(renameNoteCategory([note], 'Ideas', 'Writing')).toEqual([
      { ...note, category: 'Writing' }
    ]);
  });

  it('reassigns notes to General instead of deleting them', () => {
    expect(reassignNoteCategory([note], 'Ideas')).toEqual([
      { ...note, category: 'General' }
    ]);
  });
});

describe('favorite-first note ordering', () => {
  it('promotes favorites while preserving order within each group', () => {
    const notes: Note[] = [
      { id: 'a', title: 'A', category: 'Ideas', body: '', updatedAt: '' },
      {
        id: 'b',
        title: 'B',
        category: 'Ideas',
        body: '',
        updatedAt: '',
        favorite: true
      },
      {
        id: 'c',
        title: 'C',
        category: 'Ideas',
        body: '',
        updatedAt: '',
        favorite: true
      },
      { id: 'd', title: 'D', category: 'Ideas', body: '', updatedAt: '' }
    ];

    expect(sortNotesFavoritesFirst(notes).map(note => note.id)).toEqual([
      'b',
      'c',
      'a',
      'd'
    ]);
    expect(notes.map(note => note.id)).toEqual(['a', 'b', 'c', 'd']);
  });
});
