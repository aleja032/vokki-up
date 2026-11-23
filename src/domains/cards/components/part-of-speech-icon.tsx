import {
  Box,
  MessageSquareQuote,
  Sparkles,
  Tag,
  Wind,
  Zap,
  type LucideIcon
} from 'lucide-react';

// Spanish part-of-speech names, as stored on the cards.
const ICONS: Readonly<Record<string, LucideIcon>> = {
  sustantivo: Box,
  verbo: Zap,
  'verbo frasal': Zap,
  adjetivo: Sparkles,
  adverbio: Wind,
  expresión: MessageSquareQuote
};

export function PartOfSpeechIcon({ partOfSpeech }: { partOfSpeech: string }) {
  const Icon = ICONS[(partOfSpeech ?? '').trim().toLowerCase()] ?? Tag;
  return <Icon size={12} strokeWidth={2.6} />;
}
