import { describe, expect, it } from 'vitest';
import { getVisibleProfileSections } from './profile-visibility.util';

const flagsOff = { profileExtras: false };
const flagsOn = { profileExtras: true };

describe('getVisibleProfileSections', () => {
  it('shows only language and theme while the session loads', () => {
    expect(getVisibleProfileSections('loading', flagsOff)).toEqual({
      language: true,
      theme: true,
      account: false,
      displayName: false,
      level: false,
      dailyGoal: false,
      reminder: false,
      data: false
    });
  });

  it('shows only language and theme to guests', () => {
    const sections = getVisibleProfileSections('guest', flagsOff);
    expect(sections.language).toBe(true);
    expect(sections.theme).toBe(true);
    expect(sections.account).toBe(false);
    expect(sections.displayName).toBe(false);
  });

  it('adds account and name field for authenticated users', () => {
    const sections = getVisibleProfileSections('authenticated', flagsOff);
    expect(sections.account).toBe(true);
    expect(sections.displayName).toBe(true);
    expect(sections.level).toBe(false);
    expect(sections.dailyGoal).toBe(false);
    expect(sections.reminder).toBe(false);
    expect(sections.data).toBe(false);
  });

  it('reveals the extras only when the flag is on and the session is resolved', () => {
    expect(getVisibleProfileSections('guest', flagsOn).level).toBe(true);
    expect(getVisibleProfileSections('authenticated', flagsOn).data).toBe(true);
    expect(getVisibleProfileSections('loading', flagsOn).level).toBe(false);
  });
});
