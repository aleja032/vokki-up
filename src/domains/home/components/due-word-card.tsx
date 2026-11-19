import Link from 'next/link';
import { PixelLabel } from '@/components/ui/pixel-label';
import { ProgressBar } from '@/components/ui/progress-bar';
import { translateText } from '@/lib/i18n/locale';
import type { DueWord } from '@/lib/home/home-hand.types';
import { MAX_MEMORY_LEVEL } from '@/lib/home/build-home-extras';
import { homeDashboardData } from '../data';
import './due-word-card.css';

const { copy } = homeDashboardData;

function dueLabel(word: DueWord): string {
  if (word.isNew) return copy.dueNewLabel;
  return word.tone === 'coral' ? copy.dueForgettingLabel : copy.dueTodayLabel;
}

export function DueWordCard({ word, href }: { word: DueWord; href: string }) {
  const label = dueLabel(word);

  return (
    <Link
      aria-label={`${word.term}, ${label}`}
      className="due-card"
      data-tone={word.tone}
      href={href}
    >
      <PixelLabel className="due-card__tag">
        {translateText(word.partOfSpeech)}
      </PixelLabel>
      <span className="due-card__word">
        <strong className="due-card__term">{word.term}</strong>
        <span className="due-card__ipa">{word.phonetics}</span>
      </span>
      <span className="due-card__footer">
        <ProgressBar
          className="due-card__memory"
          label={copy.memoryLabel(word.memoryLevel)}
          max={MAX_MEMORY_LEVEL}
          segments={MAX_MEMORY_LEVEL}
          tone={word.tone}
          value={word.memoryLevel}
        />
        <PixelLabel className="due-card__due">{label}</PixelLabel>
      </span>
    </Link>
  );
}
