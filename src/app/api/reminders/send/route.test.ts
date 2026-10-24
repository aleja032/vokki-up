import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getUtcReminderDate,
  isDueForUtcReminder
} from '../../../../lib/reminders/schedule';
import { GET, PATCH } from './route';

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  maybeSingle: vi.fn(),
  upsert: vi.fn(),
  getUserById: vi.fn(),
  select: vi.fn(),
  eq: vi.fn(),
  not: vi.fn(),
  update: vi.fn(),
  createAdmin: vi.fn()
}));

vi.mock('../../../../lib/supabase/server-client', () => ({
  createSupabaseServerClient: vi.fn(async () => ({
    auth: { getUser: mocks.getUser },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({ maybeSingle: mocks.maybeSingle }))
      })),
      upsert: mocks.upsert
    }))
  }))
}));

vi.mock('../../../../lib/reminders/admin-client', () => ({
  createReminderAdminClient: mocks.createAdmin
}));

const environmentKeys = [
  'CRON_SECRET',
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL',
  'RESEND_SENDER_DOMAIN_VERIFIED',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_SUPABASE_URL'
] as const;
const savedEnvironment = Object.fromEntries(
  environmentKeys.map(key => [key, process.env[key]])
);

function configureDelivery() {
  process.env.CRON_SECRET = 'test-cron-secret-at-least-16';
  process.env.RESEND_API_KEY = 'test-resend-key';
  process.env.RESEND_FROM_EMAIL = 'reminders@example.com';
  process.env.RESEND_SENDER_DOMAIN_VERIFIED = 'true';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role';
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://project.example';
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const key of environmentKeys) {
    const value = savedEnvironment[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  mocks.getUser.mockReset();
  mocks.maybeSingle.mockReset();
  mocks.upsert.mockReset();
  mocks.getUserById.mockReset();
  mocks.createAdmin.mockReset();
});

describe('reminder scheduling', () => {
  it('uses a UTC date key and skips duplicate sends on the same UTC date', () => {
    const now = new Date('2026-10-24T20:00:00.000Z');
    expect(getUtcReminderDate(now)).toBe('2026-10-24');
    expect(isDueForUtcReminder('2026-10-24', now)).toBe(false);
    expect(isDueForUtcReminder('2026-10-23', now)).toBe(true);
    expect(isDueForUtcReminder(null, now)).toBe(true);
  });
});

describe('/api/reminders/send', () => {
  it('rejects cron requests without an exact configured bearer secret', async () => {
    configureDelivery();
    const response = await GET(
      new Request('https://app.example/api/reminders/send', {
        headers: { Authorization: 'Bearer wrong-secret' }
      })
    );
    expect(response.status).toBe(401);
    expect(mocks.createAdmin).not.toHaveBeenCalled();
  });

  it('fails closed when cron delivery configuration is missing', async () => {
    process.env.CRON_SECRET = 'test-cron-secret-at-least-16';
    const response = await GET(
      new Request('https://app.example/api/reminders/send', {
        headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` }
      })
    );
    expect(response.status).toBe(503);
    expect(mocks.createAdmin).not.toHaveBeenCalled();
  });

  it('requires explicit email consent before enabling reminders', async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null
    });
    const response = await PATCH(
      new Request('https://app.example/api/reminders/send', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: true, consent: false })
      })
    );
    expect(response.status).toBe(400);
    expect(mocks.upsert).not.toHaveBeenCalled();
  });

  it('returns authenticated preferences without exposing provider configuration', async () => {
    configureDelivery();
    mocks.getUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null
    });
    mocks.maybeSingle.mockResolvedValue({
      data: { enabled: true, ['consented_at']: '2026-10-24T19:00:00.000Z' },
      error: null
    });
    const response = await GET(
      new Request('https://app.example/api/reminders/send?preferences=1')
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      enabled: true,
      consent: true,
      deliveryConfigured: true
    });
  });
});
