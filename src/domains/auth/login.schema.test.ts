import { describe, expect, it } from 'vitest';
import { loginSchema } from './login.schema';
import { authValidationMessages } from './validation-messages';

function getFieldMessages(input: unknown, field: 'email' | 'password') {
  const result = loginSchema.safeParse(input);
  if (result.success) return [];
  return result.error.issues
    .filter(issue => issue.path[0] === field)
    .map(issue => issue.message);
}

describe('loginSchema', () => {
  it('accepts a valid email and password and trims the email', () => {
    const result = loginSchema.safeParse({
      email: '  ana@example.com  ',
      password: 'secreto123'
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        email: 'ana@example.com',
        password: 'secreto123'
      });
    }
  });

  it('asks for the email when it is empty', () => {
    expect(
      getFieldMessages({ email: '', password: 'secreto123' }, 'email')
    ).toEqual([authValidationMessages.emailRequired]);
  });

  it('rejects a malformed email with the invalid email message', () => {
    expect(
      getFieldMessages({ email: 'ana@', password: 'secreto123' }, 'email')
    ).toEqual([authValidationMessages.emailInvalid]);
  });

  it('asks for the password when it is empty', () => {
    expect(
      getFieldMessages(
        { email: 'ana@example.com', password: '' },
        'password'
      )[0]
    ).toBe(authValidationMessages.passwordRequired);
  });

  it('rejects a password shorter than 8 characters', () => {
    expect(
      getFieldMessages(
        { email: 'ana@example.com', password: '1234567' },
        'password'
      )
    ).toEqual([authValidationMessages.passwordTooShort]);
  });

  it('accepts a password of exactly 8 characters', () => {
    expect(
      loginSchema.safeParse({ email: 'ana@example.com', password: '12345678' })
        .success
    ).toBe(true);
  });
});
