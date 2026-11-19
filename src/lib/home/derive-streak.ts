// Structural, so src/lib stays free of domain imports.
type StreakEvent = { localDate: string; earnsDailyCredit: boolean };

function localDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Consecutive days with a credited review, ending today or yesterday. */
export function deriveStreakDays(
  events: StreakEvent[],
  today: Date = new Date()
): number {
  const activeDays = new Set(
    events.filter(event => event.earnsDailyCredit).map(event => event.localDate)
  );
  const cursor = new Date(today);
  if (!activeDays.has(localDateKey(cursor)))
    cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  while (activeDays.has(localDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function isStreakEventList(value: unknown): value is StreakEvent[] {
  return (
    Array.isArray(value) &&
    value.every(
      item =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as StreakEvent).localDate === 'string' &&
        typeof (item as StreakEvent).earnsDailyCredit === 'boolean'
    )
  );
}
