const RESEND_ENDPOINT = 'https://api.resend.com/emails';

export interface ReminderEmail {
  to: string;
  idempotencyKey: string;
}

export function hasReminderDeliveryConfiguration(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      isEmailAddress(process.env.RESEND_FROM_EMAIL) &&
      process.env.RESEND_SENDER_DOMAIN_VERIFIED?.trim() === 'true' &&
      (process.env.CRON_SECRET?.trim().length ?? 0) >= 16 &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  );
}

export async function sendReminderEmail({
  to,
  idempotencyKey
}: ReminderEmail): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (
    !apiKey ||
    !isEmailAddress(from) ||
    process.env.RESEND_SENDER_DOMAIN_VERIFIED?.trim() !== 'true'
  ) {
    throw new Error('Reminder email delivery is not configured.');
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: 'Tu recordatorio de Vokki Up',
      html: '<p>Un momento hoy para practicar inglés marca la diferencia. Abre Vokki Up para continuar.</p>'
    })
  });

  if (!response.ok) {
    throw new Error('The reminder email provider rejected the message.');
  }
}

function isEmailAddress(value: string | undefined): value is string {
  return Boolean(value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()));
}
