import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../../../lib/supabase/server-client';
import { createReminderAdminClient } from '../../../../lib/reminders/admin-client';
import {
  hasReminderDeliveryConfiguration,
  sendReminderEmail
} from '../../../../lib/reminders/resend';
import {
  getUtcReminderDate,
  isDueForUtcReminder
} from '../../../../lib/reminders/schedule';

export const dynamic = 'force-dynamic';

export async function GET(request: Request): Promise<Response> {
  const authorization = request.headers.get('authorization');
  if (authorization?.startsWith('Bearer ')) {
    return runDailyReminderCron(authorization);
  }

  if (new URL(request.url).searchParams.get('preferences') === '1') {
    return getPreferences();
  }

  return json({ error: 'Unauthorized.' }, 401);
}

export async function PATCH(request: Request): Promise<Response> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user)
      return json({ error: 'Authentication required.' }, 401);

    const body: unknown = await request.json();
    if (!isRecord(body) || !hasOnlyKeys(body, ['enabled', 'consent'])) {
      return json({ error: 'Choose valid reminder settings.' }, 400);
    }
    if (
      typeof body.enabled !== 'boolean' ||
      typeof body.consent !== 'boolean'
    ) {
      return json({ error: 'Choose valid reminder settings.' }, 400);
    }
    if (body.enabled && !body.consent) {
      return json(
        { error: 'Consent is required to enable email reminders.' },
        400
      );
    }
    if (body.enabled && !hasReminderDeliveryConfiguration()) {
      return json({ error: 'Email reminders are not configured yet.' }, 503);
    }

    const { error: saveError } = await supabase
      .from('reminder_preferences')
      .upsert(
        {
          ['user_id']: data.user.id,
          enabled: body.enabled,
          ['consented_at']: body.consent ? new Date().toISOString() : null,
          ['updated_at']: new Date().toISOString()
        },
        { onConflict: 'user_id' }
      );
    if (saveError)
      return json({ error: 'Reminder settings could not be saved.' }, 503);

    return json(
      {
        enabled: body.enabled,
        consent: body.consent,
        deliveryConfigured: hasReminderDeliveryConfiguration()
      },
      200
    );
  } catch {
    return json({ error: 'Reminder settings could not be saved.' }, 503);
  }
}

async function getPreferences(): Promise<Response> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user)
      return json({ error: 'Authentication required.' }, 401);

    const { data: preferences, error: preferenceError } = await supabase
      .from('reminder_preferences')
      .select('enabled,consented_at')
      .eq('user_id', data.user.id)
      .maybeSingle();
    if (preferenceError)
      return json({ error: 'Reminder settings are unavailable.' }, 503);

    return json(
      {
        enabled: preferences?.enabled === true,
        consent: Boolean(preferences?.consented_at),
        deliveryConfigured: hasReminderDeliveryConfiguration()
      },
      200
    );
  } catch {
    return json({ error: 'Reminder settings are unavailable.' }, 503);
  }
}

async function runDailyReminderCron(authorization: string): Promise<Response> {
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return json({ error: 'Unauthorized.' }, 401);
  }
  if (!hasReminderDeliveryConfiguration()) {
    return json({ error: 'Reminder delivery is not configured.' }, 503);
  }

  try {
    const admin = createReminderAdminClient();
    const { data: preferences, error } = await admin
      .from('reminder_preferences')
      .select('user_id,last_sent_on')
      .eq('enabled', true)
      .not('consented_at', 'is', null);
    if (error) return json({ error: 'Reminder queue is unavailable.' }, 503);

    const now = new Date();
    const today = getUtcReminderDate(now);
    let sent = 0;
    let skipped = 0;
    let failed = 0;

    for (const preference of preferences ?? []) {
      if (!isDueForUtcReminder(preference.last_sent_on, now)) {
        skipped += 1;
        continue;
      }

      const { data: result, error: userError } =
        await admin.auth.admin.getUserById(preference.user_id);
      const email = result.user?.email;
      if (userError || !email) {
        failed += 1;
        continue;
      }

      try {
        await sendReminderEmail({
          to: email,
          idempotencyKey: `daily-reminder/${preference.user_id}/${today}`
        });
      } catch {
        failed += 1;
        continue;
      }

      const { error: updateError } = await admin
        .from('reminder_preferences')
        .update({
          ['last_sent_on']: today,
          ['updated_at']: new Date().toISOString()
        })
        .eq('user_id', preference.user_id);
      if (updateError) {
        failed += 1;
        continue;
      }
      sent += 1;
    }

    return json({ sent, skipped, failed, date: today }, 200);
  } catch {
    return json({ error: 'Reminder delivery could not be completed.' }, 503);
  }
}

function json(value: unknown, status: number): Response {
  return NextResponse.json(value, {
    status,
    headers: { 'Cache-Control': 'private, no-store' }
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, keys: string[]): boolean {
  return Object.keys(value).every(key => keys.includes(key));
}
