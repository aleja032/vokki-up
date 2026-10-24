export const REMINDER_SCHEDULE_UTC = '0 20 * * *';
export const REMINDER_TIME_LABEL = '20:00 UTC';

export function getUtcReminderDate(now: Date): string {
  return now.toISOString().slice(0, 10);
}

export function isDueForUtcReminder(
  lastSentOn: string | null,
  now: Date
): boolean {
  return lastSentOn !== getUtcReminderDate(now);
}
