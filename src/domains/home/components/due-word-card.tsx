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

interface DueWordCardProps {
  word: DueWord;
  href: string;
  /** Sample words are not the user's: render a plain card, not a link. */
  sample?: boolean;
}

export function DueWordCard({ word, href, sample = false }: DueWordCardProps) {
  const label = dueLabel(word);
  const Root = sample ? 'article' : Link;
  const rootProps = sample ? {} : { href };

  return (
    <Root
      aria-label={`${word.term}, ${label}`}
      className="due-card"
      data-sample={sample ? 'true' : undefined}
      data-tone={word.tone}
      {...(rootProps as { href: string })}
    >
      <PixelLabel className="due-card__tag">
        {translateText(word.partOfSpeech)}
      </PixelLabel>
      <strong className="due-card__term">{word.term}</strong>
      <span className="due-card__meaning">{word.meaning}</span>
      <span className="due-card__ipa">{word.phonetics}</span>
      <span className="due-card__footer">
        <ProgressBar
          className="due-card__memory"
          label={copy.memoryLabel(word.memoryLevel)}
          max={MAX_MEMORY_LEVEL}
          segments={MAX_MEMORY_LEVEL}
          shape="blocks"
          tone={word.tone}
          value={word.memoryLevel}
        />
        <span className="due-card__due">
          <span aria-hidden="true" className="due-card__dot" />
          <PixelLabel className="due-card__due-label">{label}</PixelLabel>
        </span>
      </span>
    </Root>
  );
}
