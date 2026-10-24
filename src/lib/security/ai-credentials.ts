import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { AI_PROVIDER_CATALOG, type AiProviderId } from '../../lib/ai/catalog';

export type EncryptedCredential = {
  ciphertext: string;
  iv: string;
  authTag: string;
};

export type ValidatedCredentialInput = {
  provider: AiProviderId;
  model: string;
  apiKey: string;
};

export function validateCredentialInput(
  value: unknown
): ValidatedCredentialInput {
  if (
    !isRecord(value) ||
    !hasOnlyKeys(value, ['provider', 'model', 'apiKey'])
  ) {
    throw new Error('Choose a supported provider, model, and API key.');
  }
  if (
    typeof value.provider !== 'string' ||
    typeof value.model !== 'string' ||
    typeof value.apiKey !== 'string'
  ) {
    throw new Error('Choose a supported provider, model, and API key.');
  }
  const provider = AI_PROVIDER_CATALOG.find(
    option => option.id === value.provider
  );
  if (!provider || !provider.models.includes(value.model as never)) {
    throw new Error('Choose a supported provider and model.');
  }
  const apiKey = value.apiKey.trim();
  if (apiKey.length < 20 || apiKey.length > 4096 || /[\r\n\0]/.test(apiKey)) {
    throw new Error('Enter a valid API key.');
  }
  return { provider: provider.id, model: value.model, apiKey };
}

export function encryptCredential(plaintext: string): EncryptedCredential {
  if (!plaintext) throw new Error('Credential cannot be empty.');
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', getEncryptionKey(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final()
  ]);
  return {
    ciphertext: ciphertext.toString('base64'),
    iv: iv.toString('base64'),
    authTag: cipher.getAuthTag().toString('base64')
  };
}

export function decryptCredential(value: EncryptedCredential): string {
  try {
    const iv = Buffer.from(value.iv, 'base64');
    const authTag = Buffer.from(value.authTag, 'base64');
    const decipher = createDecipheriv('aes-256-gcm', getEncryptionKey(), iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([
      decipher.update(Buffer.from(value.ciphertext, 'base64')),
      decipher.final()
    ]).toString('utf8');
  } catch {
    throw new Error('Stored provider credential could not be decrypted.');
  }
}

export function maskApiKey(apiKey: string): string {
  return `••••${apiKey.slice(-4)}`;
}

function getEncryptionKey(): Buffer {
  const configured = process.env.AI_CREDENTIAL_ENCRYPTION_KEY?.trim();
  if (!configured)
    throw new Error('AI credential encryption is not configured.');
  let key: Buffer;
  if (/^[a-f\d]{64}$/i.test(configured)) key = Buffer.from(configured, 'hex');
  else if (/^[A-Za-z0-9+/]{43}=?$/.test(configured))
    key = Buffer.from(configured, 'base64');
  else
    throw new Error('AI_CREDENTIAL_ENCRYPTION_KEY must encode a 32-byte key.');
  if (key.length !== 32)
    throw new Error('AI_CREDENTIAL_ENCRYPTION_KEY must encode a 32-byte key.');
  return key;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function hasOnlyKeys(value: Record<string, unknown>, keys: string[]) {
  return Object.keys(value).every(key => keys.includes(key));
}
