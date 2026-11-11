import { afterEach, describe, expect, it } from 'vitest';
import {
  decryptCredential,
  encryptCredential,
  maskApiKey,
  validateCredentialInput
} from './ai-credentials';

afterEach(() => {
  delete process.env.AI_CREDENTIAL_ENCRYPTION_KEY;
});

describe('AI credential protection', () => {
  it('encrypts and decrypts with AES-GCM without storing plaintext', () => {
    process.env.AI_CREDENTIAL_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString(
      'base64'
    );
    const encrypted = encryptCredential('AIzaSyVerySecret1234567890');
    expect(JSON.stringify(encrypted)).not.toContain(
      'AIzaSyVerySecret1234567890'
    );
    expect(decryptCredential(encrypted)).toBe('AIzaSyVerySecret1234567890');
  });
  it('fails closed for missing or malformed master keys', () => {
    expect(() => encryptCredential('secret')).toThrow('not configured');
    process.env.AI_CREDENTIAL_ENCRYPTION_KEY = 'too-short';
    expect(() => encryptCredential('secret')).toThrow('32-byte');
  });
  it('masks keys to provider-independent last-four metadata', () => {
    expect(maskApiKey('AIzaSyVerySecret1234567890')).toBe('••••7890');
  });
  it('validates allowlisted provider/model pairs and rejects malformed keys', () => {
    expect(
      validateCredentialInput({
        provider: 'gemini',
        model: 'gemini-3.1-flash-lite',
        apiKey: 'AIzaSyVerySecret1234567890'
      })
    ).toMatchObject({ provider: 'gemini', model: 'gemini-3.1-flash-lite' });
    expect(() =>
      validateCredentialInput({
        provider: 'gemini',
        model: 'gpt-4o-mini',
        apiKey: 'AIzaSyVerySecret1234567890'
      })
    ).toThrow();
    expect(() =>
      validateCredentialInput({
        provider: 'gemini',
        model: 'gemini-3.1-flash-lite',
        apiKey: 'short'
      })
    ).toThrow();
  });
});
