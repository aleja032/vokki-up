import type { CardStatusCounts, CardStatusFilter } from './card-status';
import { cardsMessages } from './messages';

const messages = cardsMessages.overview;

export type StatusFilterOption = {
  value: CardStatusFilter;
  label: string;
  /** Shorter label for phones, where the four options share one row. */
  shortLabel?: string;
  count: number;
  dot?: 'coral' | 'brand' | 'mint';
};

// Dot colors follow the due dot of the cards: coral is due today, violet is
// due this week, mint is safe. Read at render time so the labels follow the
// selected language.
export function getStatusOptions(
  counts: CardStatusCounts
): readonly StatusFilterOption[] {
  const labels = messages.statusFilters;
  return [
    { value: 'all', label: labels.all, count: counts.all },
    { value: 'due', label: labels.due, count: counts.due, dot: 'coral' },
    {
      value: 'week',
      label: labels.week,
      shortLabel: labels.weekShort,
      count: counts.week,
      dot: 'brand'
    },
    { value: 'safe', label: labels.safe, count: counts.safe, dot: 'mint' }
  ];
}
