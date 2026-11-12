import { describe, expect, it } from 'vitest';
import { AVATAR_FALLBACK_INITIAL, getAvatarInitial } from './avatar-initial.util';

describe('getAvatarInitial', () => {
  it('uses the first letter of the display name, uppercased', () => {
    expect(getAvatarInitial({ displayName: 'alejandra', email: 'a@b.co' })).toBe(
      'A'
    );
  });

  it('skips surrounding whitespace', () => {
    expect(getAvatarInitial({ displayName: '  maria  ' })).toBe('M');
  });

  it('falls back to the email when the name is empty or blank', () => {
    expect(getAvatarInitial({ displayName: '', email: 'zoe@x.com' })).toBe('Z');
    expect(getAvatarInitial({ displayName: '   ', email: 'zoe@x.com' })).toBe(
      'Z'
    );
    expect(getAvatarInitial({ email: 'zoe@x.com' })).toBe('Z');
  });

  it('handles accented letters', () => {
    expect(getAvatarInitial({ displayName: 'élodie' })).toBe('É');
    expect(getAvatarInitial({ displayName: 'ñandú' })).toBe('Ñ');
  });

  it('keeps a whole emoji grapheme', () => {
    expect(getAvatarInitial({ displayName: '😀 Sam' })).toBe('😀');
    expect(getAvatarInitial({ displayName: '👩🏽‍💻 dev' })).toBe('👩🏽‍💻');
  });

  it('returns a neutral glyph when nothing is available', () => {
    expect(getAvatarInitial({})).toBe(AVATAR_FALLBACK_INITIAL);
    expect(getAvatarInitial({ displayName: ' ', email: ' ' })).toBe(
      AVATAR_FALLBACK_INITIAL
    );
    expect(getAvatarInitial({ displayName: null, email: null })).toBe(
      AVATAR_FALLBACK_INITIAL
    );
  });
});
