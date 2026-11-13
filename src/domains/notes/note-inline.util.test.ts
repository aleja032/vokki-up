import { describe, expect, it } from 'vitest';
import {
  parseInline,
  stripInlineMarks,
  toggleBulletList,
  toggleInlineMark
} from './note-inline.util';

describe('parseInline', () => {
  it('keeps unformatted text as a single text node', () => {
    expect(parseInline('plain text')).toEqual([
      { type: 'text', text: 'plain text' }
    ]);
  });

  it('parses bold, italic and underline marks', () => {
    expect(parseInline('a **b** _c_ ++d++ e')).toEqual([
      { type: 'text', text: 'a ' },
      { type: 'bold', children: [{ type: 'text', text: 'b' }] },
      { type: 'text', text: ' ' },
      { type: 'italic', children: [{ type: 'text', text: 'c' }] },
      { type: 'text', text: ' ' },
      { type: 'underline', children: [{ type: 'text', text: 'd' }] },
      { type: 'text', text: ' e' }
    ]);
  });

  it('supports nested marks', () => {
    expect(parseInline('**a _b_**')).toEqual([
      {
        type: 'bold',
        children: [
          { type: 'text', text: 'a ' },
          { type: 'italic', children: [{ type: 'text', text: 'b' }] }
        ]
      }
    ]);
  });

  it('does not treat underscores inside words as italic', () => {
    expect(parseInline('snake_case_name and my_var')).toEqual([
      { type: 'text', text: 'snake_case_name and my_var' }
    ]);
  });

  it('leaves unmatched markers as literal text', () => {
    expect(parseInline('2 ** 3 and ++ alone')).toEqual([
      { type: 'text', text: '2 ** 3 and ++ alone' }
    ]);
  });
});

describe('stripInlineMarks', () => {
  it('removes marks and keeps the text', () => {
    expect(stripInlineMarks('a **b** _c_ ++d++')).toBe('a b c d');
  });
});

describe('toggleInlineMark', () => {
  it('wraps the selection and keeps it selected', () => {
    expect(toggleInlineMark('hello world', 6, 11, 'bold')).toEqual({
      value: 'hello **world**',
      selectionStart: 8,
      selectionEnd: 13
    });
  });

  it('unwraps when the markers surround the selection', () => {
    expect(toggleInlineMark('hello **world**', 8, 13, 'bold')).toEqual({
      value: 'hello world',
      selectionStart: 6,
      selectionEnd: 11
    });
  });

  it('unwraps when the selection includes the markers', () => {
    expect(toggleInlineMark('++hi++', 0, 6, 'underline')).toEqual({
      value: 'hi',
      selectionStart: 0,
      selectionEnd: 2
    });
  });

  it('inserts an empty pair and places the caret between the markers', () => {
    expect(toggleInlineMark('ab', 1, 1, 'italic')).toEqual({
      value: 'a__b',
      selectionStart: 2,
      selectionEnd: 2
    });
  });
});

describe('toggleBulletList', () => {
  it('prefixes every selected line', () => {
    expect(toggleBulletList('one\ntwo\nthree', 0, 7)).toEqual({
      value: '- one\n- two\nthree',
      selectionStart: 0,
      selectionEnd: 11
    });
  });

  it('removes the prefix when every selected line is already a bullet', () => {
    expect(toggleBulletList('- one\n- two', 0, 11)).toEqual({
      value: 'one\ntwo',
      selectionStart: 0,
      selectionEnd: 7
    });
  });

  it('adds the prefix to the missing lines when the selection is mixed', () => {
    expect(toggleBulletList('- one\ntwo', 0, 9).value).toBe('- one\n- two');
  });

  it('works with a caret on a single line', () => {
    expect(toggleBulletList('a\nbc\nd', 3, 3)).toEqual({
      value: 'a\n- bc\nd',
      selectionStart: 5,
      selectionEnd: 5
    });
  });
});
